import { useState } from "react";
import { Button, Paper, TextField, Typography } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import api from "../services/api.js";

const now = new Date();

export default function Reports() {
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [report, setReport] = useState(null);

  const load = async () => {
    const { data } = await api.get(`/reports/monthly/?month=${month}&year=${year}`);
    setReport(data);
  };

  const download = async (type) => {
    const { data } = await api.get(`/reports/export/${type}/?month=${month}&year=${year}`, {
      responseType: "blob"
    });
    const extension = type === "excel" ? "xlsx" : type;
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `monthly-report.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page">
      <Typography variant="h4">Reports</Typography>
      <Paper sx={{ p: 2 }}>
        <div className="form-grid">
          <TextField label="Month" type="number" value={month} onChange={(e) => setMonth(e.target.value)} />
          <TextField label="Year" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
          <Button variant="contained" onClick={load}>Generate</Button>
          <Button startIcon={<FileDownloadIcon />} onClick={() => download("csv")}>CSV</Button>
          <Button startIcon={<FileDownloadIcon />} onClick={() => download("excel")}>Excel</Button>
          <Button startIcon={<FileDownloadIcon />} onClick={() => download("pdf")}>PDF</Button>
        </div>
      </Paper>
      {report && (
        <Paper sx={{ p: 2 }}>
          <Typography>Total Income: INR {Number(report.total_income).toLocaleString("en-IN")}</Typography>
          <Typography>Total Expenses: INR {Number(report.total_expenses).toLocaleString("en-IN")}</Typography>
          <Typography>Savings: INR {Number(report.savings).toLocaleString("en-IN")}</Typography>
        </Paper>
      )}
    </div>
  );
}
