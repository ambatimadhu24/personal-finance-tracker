import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import api from "../services/api.js";

const now = new Date();
const blank = {
  category: "",
  monthly_limit: "",
  month: now.getMonth() + 1,
  year: now.getFullYear()
};

export default function Budgets() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(blank);

  const load = () => api.get("/budgets/").then((res) => setRows(res.data));

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    await api.post("/budgets/", form);
    setForm(blank);
    load();
  };

  return (
    <div className="page">
      <Typography variant="h4">Budgets</Typography>
      <Paper sx={{ p: 2 }}>
        <form className="form-grid" onSubmit={submit}>
          <TextField label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
          <TextField label="Monthly Limit" type="number" value={form.monthly_limit} onChange={(e) => setForm({ ...form, monthly_limit: e.target.value })} required />
          <TextField label="Month" type="number" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} required />
          <TextField label="Year" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required />
          <Button type="submit" variant="contained">Create Budget</Button>
        </form>
      </Paper>
      {rows.some((row) => row.status === "Over Budget") && <Alert severity="warning">One or more categories are over budget.</Alert>}
      <Paper sx={{ overflow: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Budget</TableCell>
              <TableCell>Spent</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.category}</TableCell>
                <TableCell>INR {Number(row.monthly_limit).toLocaleString("en-IN")}</TableCell>
                <TableCell>INR {Number(row.spent).toLocaleString("en-IN")}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
