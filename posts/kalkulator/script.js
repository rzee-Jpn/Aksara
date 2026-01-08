let chart, REPORT_DATA=null;

const namaUser=document.getElementById("namaUser");
const harga=document.getElementById("harga");
const dp=document.getElementById("dp");
const bungaInput=document.getElementById("bunga");
const tenor=document.getElementById("tenor");
const tipeBungaEl=document.getElementById("tipeBunga");
const bungaTipe=document.getElementById("bungaTipe");
const admin=document.getElementById("admin");
const provisi=document.getElementById("provisi");
const asuransi=document.getElementById("asuransi");
const summary=document.getElementById("summary");
const detail=document.getElementById("detail");
const grafikCicilan=document.getElementById("grafikCicilan");
const downloadBtn=document.getElementById("downloadBtn");

function toggleMode(){document.body.classList.toggle("dark");}
function formatRp(i){i.value=new Intl.NumberFormat("id-ID").format(i.value.replace(/\D/g,""));}
function num(v){return parseFloat(v.replace(/\./g,""))||0;}
function rp(v){return new Intl.NumberFormat("id-ID").format(v.toFixed(0));}

function hitung(){
  const pinjaman=num(harga.value)-num(dp.value);
  const bunga=parseFloat(bungaInput.value)/100;
  const tenorVal=parseInt(tenor.value);
  const bungaBulanan=tipeBungaEl.value==="tahun"?bunga/12:bunga;
  const metode=bungaTipe.value;

  let cicilan,sisa=pinjaman,total=0,cumulative=[];
  if(metode==="efektif"){
    cicilan=(pinjaman*bungaBulanan)/(1-Math.pow(1+bungaBulanan,-tenorVal));
  }

  let table="<table><tr><th>Bulan</th><th>Cicilan</th><th>Sisa</th></tr>";
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
    sisa-=pokok; total+=cicilan; cumulative.push(total);
    table+=`<tr><td>${i}</td><td>Rp ${rp(cicilan)}</td><td>Rp ${rp(Math.max(sisa,0))}</td></tr>`;
  }
  table+="</table>";

  summary.style.display="block";
  summary.innerHTML=`<b>Pinjaman:</b> Rp ${rp(pinjaman)}<br><b>Cicilan:</b> Rp ${rp(cicilan)}`;
  detail.innerHTML=table;

  if(chart) chart.destroy();
  chart=new Chart(grafikCicilan,{
    type:'line',
    data:{labels:cumulative.map((_,i)=>i+1),
    datasets:[{data:cumulative,borderColor:'#b89b5e',backgroundColor:'rgba(184,155,94,.25)',fill:true}]}
  });

  REPORT_DATA={nama:namaUser.value||"Client",chart:chart.toBase64Image(),table};
  downloadBtn.style.display="block";
}

function downloadPDF(){
  const div=document.createElement("div");
  div.innerHTML=`<h2 style="text-align:center">Investor Report</h2>${REPORT_DATA.table}<img src="${REPORT_DATA.chart}" style="width:100%">`;
  html2pdf().from(div).set({filename:"Investor_Report.pdf"}).save();
}