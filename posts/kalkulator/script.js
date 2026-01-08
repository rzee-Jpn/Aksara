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
  if (!REPORT_DATA) return alert("Hitung dulu");

  const signature = "ANG L U M E A  •  PRIVATE INVESTMENT";
  const sigPattern = Array(40).fill(signature.repeat(4)).join("\n");

  const div = document.createElement("div");

  div.innerHTML = `
  <style>
    @page { size: A4; margin: 0; }

    .pdf-page{
      width:210mm;
      height:297mm;
      background:#000;
      color:#e6d6a3;
      font-family:"Times New Roman",serif;
      position:relative;
      overflow:hidden;
    }

    .pdf-page::before{
      content:"";
      position:absolute;
      inset:12mm;
      border:1px solid #b89b5e;
      z-index:1;
    }

    .signature-text{
      position:absolute;
      inset:0;
      font-size:26px;
      color:rgba(184,155,94,.07);
      transform:rotate(-30deg);
      line-height:80px;
      white-space:pre;
      z-index:0;
    }

    .content{
      position:relative;
      z-index:2;
      padding:30mm;
    }

    h1{
      text-align:center;
      letter-spacing:4px;
      margin-bottom:8px;
    }

    .subtitle{
      text-align:center;
      font-size:13px;
      opacity:.8;
      margin-bottom:30px;
    }

    table{
      width:100%;
      border-collapse:collapse;
      font-size:11px;
    }

    th,td{
      border-bottom:1px solid rgba(184,155,94,.3);
      padding:6px;
      text-align:center;
    }

    th{color:#f1e3b0;}

    .gold-line{
      height:1px;
      background:linear-gradient(to right,transparent,#b89b5e,transparent);
      margin:20px 0;
    }

    .footer{
      position:absolute;
      bottom:18mm;
      left:30mm;
      right:30mm;
      display:flex;
      justify-content:space-between;
      font-size:10px;
      opacity:.75;
      z-index:2;
    }
  </style>

  <div class="pdf-page">
    <div class="signature-text">${sigPattern}</div>

    <div class="content">
      <h1>PRIVATE INVESTOR REPORT</h1>
      <div class="subtitle">Confidential • High Net Worth Individual</div>

      <div class="gold-line"></div>

      <p><b>Client:</b> ${REPORT_DATA.nama}</p>
      <p><b>Date:</b> ${REPORT_DATA.tanggal}</p>

      <div class="gold-line"></div>

      ${REPORT_DATA.table}

      <div class="gold-line"></div>

      <img src="${REPORT_DATA.chart}" style="width:100%;margin-top:20px">
    </div>

    <div class="footer">
      <div>ANG L U M E A™</div>
      <div>Authorized Signature</div>
    </div>
  </div>
  `;

  html2pdf()
    .from(div)
    .set({
      margin:0,
      filename:"Anglumea_Luxury_Report.pdf",
      html2canvas:{
        scale:3,
        backgroundColor:"#000"
      },
      jsPDF:{
        unit:"mm",
        format:"a4",
        orientation:"portrait"
      }
    })
    .save();
}