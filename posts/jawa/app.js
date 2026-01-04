const input = document.getElementById('input');
const output = document.getElementById('output');
const copyBtn = document.getElementById('copyBtn');
const swapBtn = document.getElementById('swapBtn');
const murdaToggle = document.getElementById('murdaToggle');
const modeLabel = document.getElementById('modeLabel');

let reverse = false;

function render(){
  if(reverse){
    output.textContent = jawaToLatin(input.value);
    modeLabel.textContent = 'Aksara Jawa → Latin';
    murdaToggle.disabled = true;
  } else {
    output.textContent = latinToJawa(input.value);
    modeLabel.textContent = 'Latin → Aksara Jawa';
    murdaToggle.disabled = false;
  }
}

input.addEventListener('input', render);

murdaToggle.addEventListener('change', e=>{
  USE_MURDA = e.target.checked;
  render();
});

swapBtn.addEventListener('click', ()=>{
  reverse = !reverse;
  input.value = output.textContent;
  render();
});

copyBtn.addEventListener('click', async ()=>{
  await navigator.clipboard.writeText(output.textContent);
  copyBtn.textContent='Tersalin ✓';
  setTimeout(()=>copyBtn.textContent='Salin',1200);
});

render();