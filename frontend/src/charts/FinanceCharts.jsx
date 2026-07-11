import { BarChart, Bar, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Paper, Typography } from "@mui/material";

const colors = ["#155e75", "#be123c", "#15803d", "#a16207", "#6d28d9", "#0f766e"];

export function CategoryPie({ data }) {
  return (
    <Paper sx={{ p: 2, height: 360 }}>
      <Typography variant="h6" gutterBottom>Category Expenses</Typography>
      <ResponsiveContainer width="100%" height="88%">
        <PieChart>
          <Pie data={data} dataKey="total" nameKey="category" outerRadius={110} label>
            {data.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export function MonthlyBar({ data }) {
  return (
    <Paper sx={{ p: 2, height: 360 }}>
      <Typography variant="h6" gutterBottom>Monthly Trends</Typography>
      <ResponsiveContainer width="100%" height="88%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="income" fill="#15803d" />
          <Bar dataKey="expense" fill="#be123c" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
