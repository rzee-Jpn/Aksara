let chart;
let REPORT_DATA = null;

/* ===== DOM ===== */
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

function toggleMode(){
  document.body.classList.toggle("dark");
}
function toggleDTI(){
  const d=document.getElementById("dtiSection");
  d.style.display=d.style.display==="none"?"block":"none";
}
function formatRp(i){
  i.value=new Intl.NumberFormat("id-ID")
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
  const hargaVal = num(harga.value);
  const dpVal = num(dp.value);

  const bunga = parseFloat(bungaInput.value)/100;
  const tenorVal = parseInt(tenor.value);
  const tipeBunga = tipeBungaEl.value;
  const metode = bungaTipe.value;

  const adminVal = num(admin.value);
  const provisiVal = (hargaVal-dpVal)*(parseFloat(provisi.value)/100);
  const asuransiVal = num(asuransi.value);

  const pinjaman = hargaVal-dpVal;
  const bungaBulanan = tipeBunga==="tahun"?bunga/12:bunga;

  let cicilan;
  let sisa = pinjaman;
  let total = 0;
  let cumulative=[];

  if(metode==="efektif"){
    cicilan=(pinjaman*bungaBulanan)/(1-Math.pow(1+bungaBulanan,-tenorVal));
  }

  let table=`<table>
  <tr><th>Bulan</th><th>Cicilan</th><th>Pokok</th><th>Bunga</th><th>Sisa</th></tr>`;

  for(let i=1;i<=tenorVal;i++){
    let bungaB,pokok;
    if(metode==="efektif"){
      bungaB=sisa*bungaBulanan;
      pokok=cicilan-bungaB;
    }else{
      pokok=pinjaman/tenorVal;
      bungaB=pinjaman*bungaBulanan;
      cicilan=pokok+bungaB;
    }
    sisa-=pokok;
    total+=cicilan;
    cumulative.push(total);

    table+=`<tr>
      <td>${i}</td>
      <td>Rp ${rp(cicilan)}</td>
      <td>Rp ${rp(pokok)}</td>
      <td>Rp ${rp(bungaB)}</td>
      <td>Rp ${rp(Math.max(sisa,0))}</td>
    </tr>`;
  }
  table+=`</table>`;

  const biayaAwal=dpVal+adminVal+provisiVal+asuransiVal;

  summary.style.display="block";
  summary.innerHTML=`
    <b>Nama:</b> ${nama}<br>
    <b>Pinjaman:</b> Rp ${rp(pinjaman)}<br>
    <b>Cicilan:</b> Rp ${rp(cicilan)}<br>
    <b>Biaya Awal:</b> Rp ${rp(biayaAwal)}<br>
    <b>Total:</b> Rp ${rp(total+biayaAwal)}
  `;
  detail.innerHTML=table;

  if(chart) chart.destroy();
  chart=new Chart(grafikCicilan,{
    type:'line',
    data:{
      labels:cumulative.map((_,i)=>i+1),
      datasets:[{
        label:'Cumulative Payment',
        data:cumulative,
        borderColor:'#b89b5e',
        backgroundColor:'rgba(184,155,94,0.25)',
        fill:true
      }]
    }
  });

  REPORT_DATA={
    nama,
    tanggal:new Date().toLocaleDateString("id-ID"),
    pinjaman,
    cicilan,
    total:total+biayaAwal,
    tenor:tenorVal,
    table,
    chart:chart.toBase64Image()
  };
  downloadBtn.style.display="block";
}