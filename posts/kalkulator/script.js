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
function downloadPDF(){
  if(!REPORT_DATA){
    alert("Hitung simulasi terlebih dahulu");
    return;
  }

  const d = REPORT_DATA;

  const div = document.createElement("div");
  div.innerHTML = `
  <div style="
    background:#0b0b0b;
    color:#eaeaea;
    padding:50px;
    font-family:Times New Roman,serif;
  ">

    <!-- HEADER -->
    <div style="text-align:center;margin-bottom:30px">
      <div style="color:#b89b5e;letter-spacing:4px;font-size:13px">
        CONFIDENTIAL INVESTMENT REPORT
      </div>
      <h1 style="margin:10px 0;color:#fff">
        PRIVATE FINANCIAL PROJECTION
      </h1>
      <div style="color:#888;font-size:11px">
        Generated for High-Net-Worth Investor
      </div>
    </div>

    <!-- CLIENT INFO -->
    <table width="100%" style="margin-bottom:30px">
      <tr>
        <td>
          <b style="color:#b89b5e">Client</b><br>
          ${d.nama}
        </td>
        <td align="right">
          <b style="color:#b89b5e">Date</b><br>
          ${d.tanggal}
        </td>
      </tr>
    </table>

    <!-- METRICS -->
    <table width="100%" cellpadding="16" style="
      border:1px solid #b89b5e;
      margin-bottom:35px
    ">
      <tr>
        <td>
          Loan Principal<br>
          <b style="font-size:16px">Rp ${rp(d.totalPokok)}</b>
        </td>
        <td>
          Monthly Installment<br>
          <b style="font-size:16px">Rp ${rp(d.cicilan)}</b>
        </td>
      </tr>
      <tr>
        <td>
          Total Interest<br>
          <b style="font-size:16px;color:#b89b5e">
            Rp ${rp(d.totalBunga)}
          </b>
        </td>
        <td>
          Total Payment<br>
          <b style="font-size:16px">
            Rp ${rp(d.totalBayar)}
          </b>
        </td>
      </tr>
    </table>

    <!-- PAYMENT SCHEDULE -->
    <h3 style="color:#b89b5e;letter-spacing:2px">
      PAYMENT SCHEDULE
    </h3>
    ${d.table}

    <!-- PAGE BREAK -->
    <div style="page-break-before:always"></div>

    <!-- CHART -->
    <h3 style="text-align:center;color:#b89b5e">
      PAYMENT PROJECTION
    </h3>
    <img src="${d.chart}" style="width:100%;margin-top:20px">

    <!-- SIGNATURE -->
    <div style="margin-top:70px">
      <div style="color:#b89b5e;font-size:12px;letter-spacing:2px">
        SIGNED & AUTHORIZED BY
      </div>
      <div style="font-size:20px;margin-top:5px">
        ANGLUMEA
      </div>
      <div style="font-size:11px;color:#aaa">
        Financial Strategy & Investment Intelligence
      </div>
    </div>

    <!-- FOOTNOTE -->
    <p style="
      font-size:9px;
      color:#777;
      margin-top:40px;
      text-align:center
    ">
      This report is a financial simulation only and does not constitute
      an offer or financial advice.
    </p>

  </div>
  `;

  html2pdf()
    .from(div)
    .set({
      filename:`Anglumea_Private_Report_${d.nama}.pdf`,
      html2canvas:{scale:2,backgroundColor:null},
      jsPDF:{format:"a4",orientation:"portrait"}
    })
    .save();
}