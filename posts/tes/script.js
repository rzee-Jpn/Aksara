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
    alert("Generate calculation first.");
    return;
  }

  const d = REPORT;
  const root = document.getElementById("pdf-root");

  const rp = n => Number(n).toLocaleString("id-ID");

  root.innerHTML = `
  <div style="
    font-family: 'Times New Roman', serif;
    color:#111;
    padding:22mm;
    line-height:1.5;
  ">

  <!-- PAGE 1 -->
  <section style="page-break-after:always">

    <div style="text-align:center;margin-bottom:32px">
      <div style="
        color:#b89b5e;
        letter-spacing:4px;
        font-size:10px;
        margin-bottom:6px">
        CONFIDENTIAL INVESTMENT REPORT
      </div>

      <h1 style="
        font-size:22px;
        margin:0">
        PRIVATE FINANCIAL PROJECTION
      </h1>

      <div style="
        font-size:10px;
        color:#777;
        margin-top:6px">
        For Sophisticated Investors Only
      </div>
    </div>

    <table width="100%" style="margin-bottom:28px">
      <tr>
        <td>
          <b>Client</b><br>
          ${d.nama}
        </td>
        <td align="right">
          <b>Date</b><br>
          ${d.tanggal}
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="14" style="
      border:1px solid #b89b5e;
      border-collapse:collapse;
      margin-bottom:36px;
      page-break-inside:avoid">

      <tr>
        <td>
          Loan Principal<br>
          <b>Rp ${rp(d.pinjaman)}</b>
        </td>
        <td>
          Monthly Installment<br>
          <b>Rp ${rp(d.cicilan)}</b>
        </td>
      </tr>

      <tr>
        <td>
          Total Interest<br>
          <b style="color:#b89b5e">
            Rp ${rp(d.totalBunga)}
          </b>
        </td>
        <td>
          Total Payment<br>
          <b>Rp ${rp(d.totalBayar)}</b>
        </td>
      </tr>
    </table>

  </section>

  <!-- PAGE 2+ -->
  <section style="page-break-after:always">

    <h3 style="
      color:#b89b5e;
      letter-spacing:3px;
      margin-bottom:16px">
      PAYMENT SCHEDULE
    </h3>

    <div style="page-break-inside:auto">
      ${d.rows}
    </div>

  </section>

  <!-- LAST PAGE -->
  <section>

    <h3 style="
      text-align:center;
      color:#b89b5e;
      letter-spacing:3px">
      PAYMENT PROJECTION
    </h3>

    <img src="${d.chart}" style="
      width:100%;
      margin-top:20px;
      page-break-inside:avoid">

    <div style="
      margin-top:70px;
      page-break-inside:avoid">

      <div style="
        color:#b89b5e;
        font-size:10px;
        letter-spacing:3px">
        SIGNED & AUTHORIZED
      </div>

      <div style="
        font-size:22px;
        margin-top:6px">
        ANGLUMEA
      </div>

      <div style="
        font-size:10px;
        color:#777">
        Financial Strategy & Investment Intelligence
      </div>

    </div>

    <p style="
      font-size:9px;
      color:#777;
      margin-top:36px;
      text-align:center">
      This report is a financial simulation only and does not constitute
      investment advice.
    </p>

  </section>

  </div>
  `;

  html2pdf().from(root).set({
    filename: `Anglumea_Private_Report_${d.nama.replace(/[^\w]/g,"")}.pdf`,
    margin: 0,
    html2canvas: {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    },
    pagebreak: {
      mode: ["css", "avoid-all"]
    }
  }).save();
}