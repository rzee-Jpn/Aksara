let chart;
let REPORT_DATA = null;

function toggleMode(){
  document.body.classList.toggle("dark");
}
function toggleDTI(){
  const d = document.getElementById("dtiSection");
  d.style.display = d.style.display==="none"?"block":"none";
}
function formatRp(i){
  i.value = new Intl.NumberFormat("id-ID")
    .format(i.value.replace(/\D/g,""));
}
function num(v){
  return parseFloat(v.replace(/\./g,""))||0;
}
function rp(v){
  return new Intl.NumberFormat("id-ID").format(v.toFixed(0));
}

function hitung(){
  const nama = namaUser.value || "Client";
  const harga = num(harga.value);
  const dp = num(dp.value);
  const bunga = bungaEl = parseFloat(bunga.value)/100;
  const tenor = parseInt(tenor.value);
  const tipeBunga = tipeBunga.value;
  const metode = bungaTipe.value;

  const admin = num(admin.value);
  const provisi = num(harga-dp) * (parseFloat(provisi.value)/100);
  const asuransi = num(asuransi.value);

  const pinjaman = harga-dp;
  const bungaBulanan = tipeBunga==="tahun"?bunga/12:bunga;

  let sisa = pinjaman;
  let table = `
  <div class="result-table-wrapper">
  <table>
    <tr><th>Bulan</th><th>Cicilan</th><th>Pokok</th><th>Bunga</th><th>Sisa</th></tr>`;

  let cicilan;
  if(metode==="efektif"){
    cicilan = (pinjaman*bungaBulanan)/(1-Math.pow(1+bungaBulanan,-tenor));
  }

  let total = 0;
  let cumulative = [];

  for(let i=1;i<=tenor;i++){
    let bungaB, pokok;
    if(metode==="efektif"){
      bungaB = sisa*bungaBulanan;
      pokok = cicilan-bungaB;
    }else{
      pokok = pinjaman/tenor;
      bungaB = pinjaman*bungaBulanan;
      cicilan = pokok+bungaB;
    }
    sisa -= pokok;
    total += cicilan;
    cumulative.push(total);

    table += `<tr>
      <td>${i}</td>
      <td>Rp ${rp(cicilan)}</td>
      <td>Rp ${rp(pokok)}</td>
      <td>Rp ${rp(bungaB)}</td>
      <td>Rp ${rp(Math.max(sisa,0))}</td>
    </tr>`;
  }
  table += `</table></div>`;

  const biayaAwal = dp+admin+provisi+asuransi;

  summary.style.display="block";
  summary.innerHTML=`
    <b>Nama:</b> ${nama}<br>
    <b>Pinjaman:</b> Rp ${rp(pinjaman)}<br>
    <b>Cicilan / Bulan:</b> Rp ${rp(cicilan)}<br>
    <b>Biaya Awal:</b> Rp ${rp(biayaAwal)}<br>
    <b>Total Pembayaran:</b> Rp ${rp(total+biayaAwal)}
  `;

  detail.innerHTML=`<h3>Rincian</h3>${table}`;

  if(chart) chart.destroy();
  chart = new Chart(grafikCicilan,{
    type:'line',
    data:{
      labels:cumulative.map((_,i)=>i+1),
      datasets:[{
        label:'Cumulative Payment',
        data:cumulative,
        fill:true
      }]
    }
  });

  REPORT_DATA = {
    nama,
    tanggal:new Date().toLocaleDateString("id-ID"),
    pinjaman,
    cicilan,
    biayaAwal,
    total: total+biayaAwal,
    tenor,
    bunga:bunga*100,
    metode,
    table,
    chart: chart.toBase64Image()
  };

  downloadBtn.style.display="block";
}

/* ===== PDF ULTRA LUXURY ===== */

function buildPDF(d){
  return `
  <div style="padding:45px;font-family:'Times New Roman',serif;">
    <h2 style="text-align:center;letter-spacing:4px;">
      PRIVATE FINANCIAL REPORT
    </h2>
    <p style="text-align:center;font-size:11px;">
      Confidential – Investor Class
    </p>
    <hr>

    <table width="100%" style="margin:20px 0;">
      <tr>
        <td><b>Client</b><br>${d.nama}</td>
        <td align="right"><b>Date</b><br>${d.tanggal}</td>
      </tr>
    </table>

    <table width="100%" border="1" cellpadding="12">
      <tr>
        <td>Loan Principal<br><b>Rp ${rp(d.pinjaman)}</b></td>
        <td>Monthly Installment<br><b>Rp ${rp(d.cicilan)}</b></td>
      </tr>
      <tr>
        <td>Total Cost<br><b>Rp ${rp(d.total)}</b></td>
        <td>Tenor<br><b>${d.tenor} Bulan</b></td>
      </tr>
    </table>

    <h3>Payment Schedule</h3>
    ${d.table}

    <div style="page-break-before:always"></div>
    <h3 style="text-align:center">Projection</h3>
    <img src="${d.chart}" style="width:100%">

    <p style="font-size:9px;text-align:center;margin-top:30px;">
      Simulation only. Not a financial offer.
    </p>
  </div>`;
}

function downloadPDF(){
  if(!REPORT_DATA) return alert("Hitung dulu");
  const div=document.createElement("div");
  div.innerHTML=buildPDF(REPORT_DATA);

  html2pdf().from(div).set({
    filename:`Investor_Report_${REPORT_DATA.nama}.pdf`,
    html2canvas:{scale:2},
    jsPDF:{format:'a4'}
  }).save();
}