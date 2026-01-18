/* ======================================================
   INVESTOR OS — PATCHED CORE SCRIPT
   Stable | Deterministic | Executive-Grade
====================================================== */

"use strict";

let chartInstance = null;
let REPORT = null;

const $ = id => document.getElementById(id);

/* ================= UTIL ================= */
const cleanNumber = v =>
  Number(String(v || "").replace(/[^\d]/g, "")) || 0;

const formatIDR = n =>
  new Intl.NumberFormat("id-ID").format(Math.round(n));

const formatInputCurrency = el => {
  const val = cleanNumber(el.value);
  el.value = val ? formatIDR(val) : "";
};

/* ================= INPUT FORMAT ================= */
["harga", "dp"].forEach(id => {
  const el = $(id);
  if (!el) return;
  el.addEventListener("input", () => formatInputCurrency(el));
});

/* ================= UI ================= */
function toggleMode() {
  document.body.classList.toggle("dark");
}

/* ================= CORE CALC ================= */
function hitung() {
  const harga = cleanNumber($("harga").value);
  const dp = cleanNumber($("dp").value);
  const pinjaman = Math.max(harga - dp, 0);

  if (!pinjaman) {
    alert("Loan amount must be greater than zero.");
    return;
  }

  const tenorTahun = Math.min(Math.max(+$("tenor").value || 1, 1), 25);
  const tenor = tenorTahun * 12;

  const bungaInput = +$("bunga").value || 0;
  const bungaRaw = bungaInput / 100;

  const bungaBulanan =
    $("tipeBunga").value === "tahun" ? bungaRaw / 12 : bungaRaw;

  const metode = $("bungaTipe").value;

  let sisa = pinjaman;
  let totalBayar = 0;
  let totalBunga = 0;
  let cicilan = 0;

  const cumulative = [];
  const rowsData = [];

  /* ===== CICILAN ===== */
  if (metode === "efektif") {
    if (bungaBulanan === 0) {
      cicilan = pinjaman / tenor;
    } else {
      cicilan =
        (pinjaman * bungaBulanan) /
        (1 - Math.pow(1 + bungaBulanan, -tenor));
    }
  }

  for (let i = 1; i <= tenor; i++) {
    let bunga = 0;
    let pokok = 0;

    if (metode === "efektif") {
      bunga = sisa * bungaBulanan;
      pokok = cicilan - bunga;
    } else {
      pokok = pinjaman / tenor;
      bunga = pinjaman * bungaBulanan;
      cicilan = pokok + bunga;
    }

    sisa = Math.max(sisa - pokok, 0);

    totalBayar += cicilan;
    totalBunga += bunga;
    cumulative.push(totalBayar);

    rowsData.push({
      bulan: i,
      cicilan: Math.round(cicilan),
      sisa: Math.round(sisa)
    });
  }

  /* ================= SUMMARY ================= */
  $("summary").classList.remove("hidden");
  $("summary").innerHTML = `
    <b>Loan Principal:</b> Rp ${formatIDR(pinjaman)}<br>
    <b>Monthly Payment:</b> Rp ${formatIDR(cicilan)}<br>
    <b>Total Interest:</b> Rp ${formatIDR(totalBunga)}<br>
    <b>Total Payment:</b> Rp ${formatIDR(totalBayar)}
  `;

  /* ================= TABLE ================= */
  $("detail").innerHTML = `
    <table>
      <tr><th>Month</th><th>Payment</th><th>Remaining</th></tr>
      ${rowsData
        .map(
          r => `
          <tr>
            <td>${r.bulan}</td>
            <td>Rp ${formatIDR(r.cicilan)}</td>
            <td>Rp ${formatIDR(r.sisa)}</td>
          </tr>`
        )
        .join("")}
    </table>
  `;

  /* ================= CHART ================= */
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart($("grafikCicilan"), {
    type: "line",
    data: {
      labels: cumulative.map((_, i) => i + 1),
      datasets: [
        {
          data: cumulative,
          borderWidth: 2,
          fill: true,
          tension: 0.25
        }
      ]
    },
    options: {
      animation: false,
      plugins: { legend: { display: false } },
      scales: { x: { display: false } }
    }
  });

  /* ================= REPORT SNAPSHOT ================= */
  REPORT = {
    nama: $("namaUser").value || "Investor",
    tanggal: new Date().toLocaleDateString("en-GB"),
    pinjaman,
    cicilan,
    totalBunga,
    totalBayar,
    rowsData,
    chartImage: chartInstance.toBase64Image()
  };

  $("downloadBtn").classList.remove("hidden");
}

/* ================== PDF FIX ================= */
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const d = REPORT;
  const pageW = 210;
  const pageH = 297;
  const margin = 15;
  let y = margin;

  const gold = [184, 155, 94];
  const rupiah = n => "Rp " + rp(n);

  /* ================= COVER ================= */
  pdf.setFont("times", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(...gold);
  pdf.text("CONFIDENTIAL INVESTMENT REPORT", pageW / 2, y, { align: "center" });

  y += 8;
  pdf.setFontSize(18);
  pdf.setTextColor(0);
  pdf.text("PRIVATE FINANCIAL PROJECTION", pageW / 2, y, { align: "center" });

  y += 18;
  pdf.setFontSize(11);
  pdf.text("Client", margin, y);
  pdf.text(d.nama, margin, y + 6);

  pdf.text("Date", pageW - margin, y, { align: "right" });
  pdf.text(d.tanggal, pageW - margin, y + 6, { align: "right" });

  y += 18;
  pdf.setDrawColor(...gold);
  pdf.rect(margin, y, pageW - margin * 2, 32);

  pdf.text("Loan Principal", margin + 5, y + 8);
  pdf.text(rupiah(d.pinjaman), margin + 5, y + 16);

  pdf.text("Monthly Installment", pageW / 2 + 5, y + 8);
  pdf.text(rupiah(d.cicilan), pageW / 2 + 5, y + 16);

  pdf.text("Total Interest", margin + 5, y + 24);
  pdf.text(rupiah(d.totalBunga), margin + 5, y + 32);

  pdf.text("Total Payment", pageW / 2 + 5, y + 24);
  pdf.text(rupiah(d.totalBayar), pageW / 2 + 5, y + 32);

  /* ================= TABLE ================= */
  pdf.addPage();
  pdf.setFontSize(13);
  pdf.setTextColor(...gold);
  pdf.text("PAYMENT SCHEDULE", pageW / 2, margin, { align: "center" });

  pdf.autoTable({
    startY: margin + 8,
    head: [["Bulan", "Cicilan", "Sisa Pinjaman"]],
    body: d.rowsData.map(r => [
      r.bulan,
      rupiah(r.cicilan),
      rupiah(r.sisa)
    ]),
    styles: {
      font: "times",
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: {
      fillColor: gold,
      textColor: 255,
      halign: "center"
    },
    bodyStyles: {
      halign: "center"
    },
    margin: { left: margin, right: margin },
    didDrawPage: () => {
      pdf.setFontSize(9);
      pdf.setTextColor(150);
      pdf.text(
        "PRIVATE INVESTMENT DOCUMENT",
        pageW / 2,
        pageH - 8,
        { align: "center" }
      );
    }
  });

  /* ================= CHART ================= */
  pdf.addPage();
  pdf.setFontSize(13);
  pdf.setTextColor(...gold);
  pdf.text("PAYMENT PROJECTION", pageW / 2, margin, { align: "center" });

  pdf.addImage(
    d.chart,
    "PNG",
    margin,
    margin + 10,
    pageW - margin * 2,
    100
  );

  pdf.save(`Investor_Report_${d.nama}.pdf`);
}