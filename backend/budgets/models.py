from django.conf import settings
from django.db import models


class Budget(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    category = models.CharField(max_length=80)
    monthly_limit = models.DecimalField(max_digits=12, decimal_places=2)
    month = models.PositiveSmallIntegerField()
    year = models.PositiveSmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-year", "-month", "category"]
        unique_together = ["user", "category", "month", "year"]

    def __str__(self):
        return f"{self.user} {self.category} {self.month}/{self.year}"
