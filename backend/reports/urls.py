from django.urls import path
from . import views

urlpatterns = [
    path("dashboard/", views.dashboard, name="dashboard"),
    path("monthly/", views.monthly_report, name="monthly_report"),
    path("annual/", views.annual_summary, name="annual_summary"),
    path("export/csv/", views.export_csv, name="export_csv"),
    path("export/excel/", views.export_excel, name="export_excel"),
    path("export/pdf/", views.export_pdf, name="export_pdf"),
]
