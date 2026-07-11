import csv
from datetime import date
from decimal import Decimal

import pandas as pd
from django.db.models import Sum
from django.http import HttpResponse
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from transactions.models import Transaction


def _month_year(request):
    today = date.today()
    return (
        int(request.query_params.get("month", today.month)),
        int(request.query_params.get("year", today.year)),
    )


def _monthly_queryset(request):
    month, year = _month_year(request)
    return Transaction.objects.filter(user=request.user, date__month=month, date__year=year)


def _summary(queryset):
    income = queryset.filter(transaction_type=Transaction.INCOME).aggregate(total=Sum("amount"))["total"] or Decimal("0")
    expenses = queryset.filter(transaction_type=Transaction.EXPENSE).aggregate(total=Sum("amount"))["total"] or Decimal("0")
    categories = (
        queryset.filter(transaction_type=Transaction.EXPENSE)
        .values("category")
        .annotate(total=Sum("amount"))
        .order_by("-total")
    )
    return {
        "total_income": income,
        "total_expenses": expenses,
        "savings": income - expenses,
        "category_breakdown": list(categories),
    }


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def monthly_report(request):
    month, year = _month_year(request)
    queryset = _monthly_queryset(request)
    data = _summary(queryset)
    data["month"] = month
    data["year"] = year
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def annual_summary(request):
    year = int(request.query_params.get("year", date.today().year))
    rows = (
        Transaction.objects.filter(user=request.user, date__year=year)
        .values("date__month", "transaction_type")
        .annotate(total=Sum("amount"))
        .order_by("date__month")
    )
    return Response({"year": year, "months": list(rows)})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard(request):
    queryset = Transaction.objects.filter(user=request.user)
    current_month = _monthly_queryset(request)
    trends = (
        queryset.values("date__year", "date__month", "transaction_type")
        .annotate(total=Sum("amount"))
        .order_by("date__year", "date__month")
    )
    response = _summary(current_month)
    response["monthly_trends"] = list(trends)
    return Response(response)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def export_csv(request):
    queryset = _monthly_queryset(request)
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="monthly-transactions.csv"'
    writer = csv.writer(response)
    writer.writerow(["Date", "Type", "Category", "Amount", "Description"])
    for tx in queryset:
        writer.writerow([tx.date, tx.transaction_type, tx.category, tx.amount, tx.description])
    return response


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def export_excel(request):
    queryset = _monthly_queryset(request)
    rows = list(queryset.values("date", "transaction_type", "category", "amount", "description"))
    df = pd.DataFrame(rows)
    response = HttpResponse(content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    response["Content-Disposition"] = 'attachment; filename="monthly-transactions.xlsx"'
    with pd.ExcelWriter(response, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Transactions")
    return response


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def export_pdf(request):
    month, year = _month_year(request)
    queryset = _monthly_queryset(request)
    summary = _summary(queryset)

    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = 'attachment; filename="monthly-report.pdf"'
    pdf = canvas.Canvas(response, pagesize=A4)
    width, height = A4

    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(50, height - 50, f"Personal Finance Monthly Report - {month}/{year}")
    pdf.setFont("Helvetica", 11)
    y = height - 90
    pdf.drawString(50, y, f"Total Income: INR {summary['total_income']}")
    pdf.drawString(50, y - 20, f"Total Expenses: INR {summary['total_expenses']}")
    pdf.drawString(50, y - 40, f"Savings: INR {summary['savings']}")
    y -= 80
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(50, y, "Transactions")
    y -= 25
    pdf.setFont("Helvetica", 9)
    for tx in queryset[:30]:
        line = f"{tx.date} | {tx.transaction_type} | {tx.category} | INR {tx.amount} | {tx.description[:45]}"
        pdf.drawString(50, y, line)
        y -= 16
        if y < 60:
            pdf.showPage()
            y = height - 50
            pdf.setFont("Helvetica", 9)
    pdf.save()
    return response
