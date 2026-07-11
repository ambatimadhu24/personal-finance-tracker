from decimal import Decimal
from django.db import models
from rest_framework import serializers
from transactions.models import Transaction
from .models import Budget


class BudgetSerializer(serializers.ModelSerializer):
    spent = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = Budget
        fields = [
            "id",
            "category",
            "monthly_limit",
            "month",
            "year",
            "spent",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "spent", "status", "created_at"]

    def validate_month(self, value):
        if value < 1 or value > 12:
            raise serializers.ValidationError("Month must be between 1 and 12.")
        return value

    def get_spent(self, obj):
        total = Transaction.objects.filter(
            user=obj.user,
            transaction_type=Transaction.EXPENSE,
            category__iexact=obj.category,
            date__month=obj.month,
            date__year=obj.year,
        ).aggregate(total=models.Sum("amount"))["total"]
        return total or Decimal("0.00")

    def get_status(self, obj):
        spent = self.get_spent(obj)
        return "Over Budget" if spent > obj.monthly_limit else "Safe"
