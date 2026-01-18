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

/* ================= PDF EXPORT ================= */
function downloadPDF() {
  if (!REPORT) {
    alert("Please generate calculation first.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const W = 210;
  const H = 297;
  const M = 18;
  let y = M;

  const d = REPORT;
  const rupiah = n => "Rp " + formatIDR(n);

  pdf.setFont("times", "bold");
  pdf.setFontSize(11);
  pdf.text("INVESTOR OS — EXECUTIVE FINANCIAL PROJECTION", W / 2, y, { align: "center" });

  y += 8;
  pdf.setFont("times", "normal");
  pdf.setFontSize(10);

  pdf.text(`Subject: ${d.nama}`, M, y);
  pdf.text(`Date: ${d.tanggal}`, W - M, y, { align: "right" });

  y += 10;

  pdf.setFont("times", "bold");
  pdf.text("KEY METRICS", M, y);
  y += 6;

  pdf.setFont("times", "normal");
  [
    ["Loan Principal", rupiah(d.pinjaman)],
    ["Monthly Payment", rupiah(d.cicilan)],
    ["Total Interest", rupiah(d.totalBunga)],
    ["Total Payment", rupiah(d.totalBayar)]
  ].forEach(m => {
    pdf.text(`${m[0]}: ${m[1]}`, M, y);
    y += 6;
  });

  y += 4;

  if (d.chartImage) {
    pdf.addImage(d.chartImage, "PNG", M, y, W - M * 2, 50);
  }

  pdf.save(`InvestorOS_Executive_${d.nama.replace(/[^\w]/g, "")}.pdf`);
}