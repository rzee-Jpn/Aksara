let chart = null;
let REPORT_DATA = null;

/* =====================
   ELEMENT
===================== */
const namaUser = document.getElementById("namaUser");
const harga = document.getElementById("harga");
const dp = document.getElementById("dp");
const bungaInput = document.getElementById("bunga");
const tenor = document.getElementById("tenor");
const tipeBungaEl = document.getElementById("tipeBunga");
const bungaTipe = document.getElementById("bungaTipe");
const admin = document.getElementById("admin");
const provisi = document.getElementById("provisi");
const asuransi = document.getElementById("asuransi");

const summary = document.getElementById("summary");
const detail = document.getElementById("detail");
const grafikCicilan = document.getElementById("grafikCicilan");
const downloadBtn = document.getElementById("downloadBtn");

/* =====================
   UTIL
===================== */
function toggleMode(){
  document.body.classList.toggle("dark");
}

function formatRp(i){
  i.value = new Intl.NumberFormat("id-ID")
    .format(i.value.replace(/\D/g,""));
}

function num(v){
  return parseFloat(v.replace(/\./g,"")) || 0;
}

function rp(v){
  return new Intl.NumberFormat("id-ID")
    .format(Math.round(v));
}

/* =====================
   HITUNG
===================== */
function hitung(){

  const hargaVal = num(harga.value);
  const dpVal = num(dp.value);
  const pinjaman = Math.max(hargaVal - dpVal, 0);

  const bungaTahunan = parseFloat(bungaInput.value) / 100;
  const tenorVal = parseInt(tenor.value);

  const bungaBulanan =
    tipeBungaEl.value === "tahun"
      ? bungaTahunan / 12
      : bungaTahunan;

  const metode = bungaTipe.value;

  let cicilan = 0;
  let sisa = pinjaman;
  let totalBayar = 0;
  let totalBunga = 0;
  let cumulative = [];

  if(metode === "efektif"){
    cicilan =
      (pinjaman * bungaBulanan) /
      (1 - Math.pow(1 + bungaBulanan, -tenorVal));
  }

  let table = `
    <table>
      <tr>
        <th>Bulan</th>
        <th>Cicilan</th>
        <th>Sisa Pinjaman</th>
      </tr>
  `;

  for(let i = 1; i <= tenorVal; i++){
    let bungaB = 0;
    let pokok = 0;

    if(metode === "efektif"){
      bungaB = sisa * bungaBulanan;
      pokok = cicilan - bungaB;
    } else {
      pokok = pinjaman / tenorVal;
      bungaB = pinjaman * bungaBulanan;
      cicilan = pokok + bungaB;
    }

    sisa -= pokok;
    totalBayar += cicilan;
    totalBunga += bungaB;

    cumulative.push(totalBayar);

    table += `
      <tr>
        <td>${i}</td>
        <td>Rp ${rp(cicilan)}</td>
        <td>Rp ${rp(Math.max(sisa,0))}</td>
      </tr>
    `;
  }

  table += "</table>";

  /* =====================
     SUMMARY UI
  ===================== */
  summary.style.display = "block";
  summary.innerHTML = `
    <b>Pinjaman Pokok:</b> Rp ${rp(pinjaman)}<br>
    <b>Cicilan / Bulan:</b> Rp ${rp(cicilan)}<br>
    <b>Total Bunga:</b> Rp ${rp(totalBunga)}<br>
    <b>Total Pembayaran:</b> Rp ${rp(totalBayar)}
  `;

  detail.innerHTML = table;

  /* =====================
     CHART
  ===================== */
  if(chart) chart.destroy();

  chart = new Chart(grafikCicilan,{
    type: "line",
    data: {
      labels: cumulative.map((_,i)=>i+1),
      datasets: [{
        data: cumulative,
        borderWidth: 2,
        fill: true
      }]
    },
    options:{
      responsive:true,
      plugins:{legend:{display:false}},
      scales:{
        x:{title:{display:true,text:"Bulan"}},
        y:{title:{display:true,text:"Akumulasi Pembayaran"}}
      }
    }
  });

  /* =====================
     SAVE REPORT DATA
  ===================== */
  REPORT_DATA = {
    nama: namaUser.value || "Client",
    tanggal: new Date().toLocaleDateString("id-ID"),
    pinjaman,
    cicilan,
    tenor: tenorVal,
    bunga: (bungaTahunan * 100).toFixed(2),
    metode,
    totalPokok: pinjaman,
    totalBunga,
    totalBayar,
    table,
    chart: chart.toBase64Image()
  };

  downloadBtn.style.display = "block";
}

/* =====================
   PDF (SIMPLE HOOK)
   → TEMPLATE BLACK–GOLD
   → SIGNATURE GOLD
===================== */

function downloadPDF() {
  const signature = "ANG L U M E A  •  PRIVATE INVESTMENT";

  const sigPattern = Array(30).fill(signature.repeat(3)).join("\n");

  const div = document.createElement("div");
  div.innerHTML = `
  <div class="pdf-page">
    <div class="signature-bg"></div>
    <div class="signature-text">${sigPattern}</div>

    <div class="pdf-content">
      <h1>PRIVATE INVESTOR REPORT</h1>
      <div class="subtitle">Confidential • High Net Worth Individual</div>

      <div class="gold-line"></div>

      <p><b>Client:</b> ${REPORT_DATA.nama}</p>
      <p><b>Date:</b> ${new Date().toLocaleDateString("id-ID")}</p>

      <div class="gold-line"></div>

      ${REPORT_DATA.table}

      <div class="gold-line"></div>

      <img src="${REPORT_DATA.chart}" style="width:100%; margin-top:15px">
    </div>

    <div class="footer">
      <div>ANG L U M E A™</div>
      <div>Authorized Signature</div>
    </div>
  </div>
  `;

  html2pdf().from(div).set({
    margin: 0,
    filename: "Anglumea_Investor_Report.pdf",
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: "#000"
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    }
  }).save();
}