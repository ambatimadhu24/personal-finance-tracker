import React, { useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";
import api from "../services/api.js";
import { CategoryPie, MonthlyBar } from "../charts/FinanceCharts.jsx";

function formatMoney(value) {
  return `INR ${Number(value || 0).toLocaleString("en-IN")}`;
}

function normalizeTrends(rows) {
  const map = {};
  rows.forEach((row) => {
    const label = `${row.date__month}/${row.date__year}`;
    map[label] = map[label] || { label, income: 0, expense: 0 };
    map[label][row.transaction_type] = Number(row.total);
  });
  return Object.values(map);
}

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/reports/dashboard/").then((res) => setData(res.data));
  }, []);

  if (!data) return <Typography>Loading dashboard...</Typography>;

  return (
    <div className="page">
      <Typography variant="h4">Dashboard</Typography>
      <div className="metric-grid">
        {[
          ["Total Income", data.total_income],
          ["Total Expenses", data.total_expenses],
          ["Savings", data.savings]
        ].map(([label, value]) => (
          <Paper key={label} sx={{ p: 2 }}>
            <Typography color="text.secondary">{label}</Typography>
            <Typography variant="h5">{formatMoney(value)}</Typography>
          </Paper>
        ))}
      </div>
      <div className="chart-grid">
        <CategoryPie data={data.category_breakdown || []} />
        <MonthlyBar data={normalizeTrends(data.monthly_trends || [])} />
      </div>
    </div>
  );
}
