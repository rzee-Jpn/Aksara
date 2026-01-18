"use strict";

let chartInstance = null;
let REPORT = null;

const $ = id => document.getElementById(id);

/* ========= UTIL ========= */
const cleanNumber = v =>
  Number(String(v || "").replace(/[^\d]/g, "")) || 0;

const formatIDR = n =>
  new Intl.NumberFormat("id-ID").format(Math.round(n));

/* ========= INPUT FORMAT ========= */
["harga", "dp"].forEach(id => {
  const el = $(id);
  el.addEventListener("input", () => {
    const val = cleanNumber(el.value);
    el.value = val ? formatIDR(val) : "";
  });
});

/* ========= UI ========= */
function toggleMode() {
  document.body.classList.toggle("dark");
}

/* ========= CORE ========= */
function hitung() {
  const harga = cleanNumber($("harga").value);
  const dp = cleanNumber($("dp").value);
  const pinjaman = harga - dp;

  if (pinjaman <= 0) {
    alert("Pinjaman harus lebih dari 0");
    return;
  }

  const tenor = Math.min(Math.max(+$("tenor").value, 1), 25) * 12;
  const bungaRaw = (+$("bunga").value || 0) / 100;
  const bungaBulanan =
    $("tipeBunga").value === "tahun" ? bungaRaw / 12 : bungaRaw;

  const metode = $("bungaTipe").value;

  let sisa = pinjaman;
  let totalBayar = 0;
  let totalBunga = 0;
  let cicilan = 0;

  const cumulative = [];
  const rowsData = [];

  if (metode === "efektif") {
    cicilan =
      bungaBulanan === 0
        ? pinjaman / tenor
        : (pinjaman * bungaBulanan) /
          (1 - Math.pow(1 + bungaBulanan, -tenor));
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

    cumulative.push(Math.round(totalBayar));

    rowsData.push({
      bulan: i,
      cicilan: Math.round(cicilan),
      sisa: Math.round(sisa)
    });
  }

  $("summary").classList.remove("hidden");
  $("summary").innerHTML = `
    <b>Loan:</b> Rp ${formatIDR(pinjaman)}<br>
    <b>Monthly:</b> Rp ${formatIDR(cicilan)}<br>
    <b>Total Interest:</b> Rp ${formatIDR(totalBunga)}<br>
    <b>Total Payment:</b> Rp ${formatIDR(totalBayar)}
  `;

  $("detail").innerHTML = `
    <table>
      <tr><th>Bulan</th><th>Cicilan</th><th>Sisa</th></tr>
      ${rowsData.map(r => `
        <tr>
          <td>${r.bulan}</td>
          <td>Rp ${formatIDR(r.cicilan)}</td>
          <td>Rp ${formatIDR(r.sisa)}</td>
        </tr>
      `).join("")}
    </table>
  `;

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart($("grafikCicilan"), {
    type: "line",
    data: {
      labels: cumulative.map((_, i) => `Bulan ${i + 1}`),
      datasets: [{
        data: cumulative,
        borderWidth: 2,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      animation: false,
      plugins: { legend: { display: false } }
    }
  });

  REPORT = {
    nama: $("namaUser").value || "Investor",
    tanggal: new Date().toLocaleDateString("id-ID"),
    pinjaman,
    cicilan,
    totalBunga,
    totalBayar,
    rowsData,
    chartImage: chartInstance.toBase64Image()
  };

  $("downloadBtn").classList.remove("hidden");
}

/* ========= PDF ========= */
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  const d = REPORT;
  const rupiah = n => "Rp " + formatIDR(n);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("INVESTMENT LOAN REPORT", 105, 20, { align: "center" });

  pdf.setFontSize(10);
  pdf.text(`Client: ${d.nama}`, 20, 35);
  pdf.text(`Date: ${d.tanggal}`, 20, 42);

  pdf.text(`Loan: ${rupiah(d.pinjaman)}`, 20, 55);
  pdf.text(`Monthly: ${rupiah(d.cicilan)}`, 20, 62);
  pdf.text(`Interest: ${rupiah(d.totalBunga)}`, 20, 69);
  pdf.text(`Total: ${rupiah(d.totalBayar)}`, 20, 76);

  pdf.addPage();

  pdf.autoTable({
    head: [["Bulan", "Cicilan", "Sisa"]],
    body: d.rowsData.map(r => [
      r.bulan,
      rupiah(r.cicilan),
      rupiah(r.sisa)
    ])
  });

  pdf.addPage();
  pdf.addImage(d.chartImage, "PNG", 15, 20, 180, 90);

  pdf.save(`Investor_Report_${d.nama}.pdf`);
}