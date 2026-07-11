import { useEffect, useState } from "react";
import {
  Button,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../services/api.js";

const blank = {
  transaction_type: "expense",
  category: "",
  amount: "",
  description: "",
  date: new Date().toISOString().slice(0, 10)
};

export default function Transactions() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(blank);

  const load = () => api.get("/transactions/").then((res) => setRows(res.data));

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    await api.post("/transactions/", form);
    setForm(blank);
    load();
  };

  const remove = async (id) => {
    await api.delete(`/transactions/${id}/`);
    load();
  };

  return (
    <div className="page">
      <Typography variant="h4">Transactions</Typography>
      <Paper sx={{ p: 2 }}>
        <form className="form-grid" onSubmit={submit}>
          <TextField select label="Type" value={form.transaction_type} onChange={(e) => setForm({ ...form, transaction_type: e.target.value })}>
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </TextField>
          <TextField label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
          <TextField label="Amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          <TextField label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} InputLabelProps={{ shrink: true }} required />
          <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Button type="submit" variant="contained">Add</Button>
        </form>
      </Paper>
      <Paper sx={{ overflow: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.transaction_type}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>INR {Number(row.amount).toLocaleString("en-IN")}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell align="right">
                  <Button color="error" startIcon={<DeleteIcon />} onClick={() => remove(row.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
