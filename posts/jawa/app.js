const input = document.getElementById('input');
const output = document.getElementById('output');
const copyBtn = document.getElementById('copyBtn');
const swapBtn = document.getElementById('swapBtn');
const murdaToggle = document.getElementById('murdaToggle');
const modeLabel = document.getElementById('modeLabel');

// false = Latin → Jawa
// true  = Jawa → Latin
let reverse = false;

function setModeUI(){
  if(reverse){
    modeLabel.textContent = 'Aksara Jawa → Latin';
    input.placeholder = 'Contoh: ꦄꦤ꧀ꦏ꧀ ꦭꦤꦁ ꦩꦔꦤ꧀';
    murdaToggle.disabled = true;
  } else {
    modeLabel.textContent = 'Latin → Aksara Jawa';
    input.placeholder = 'Contoh: anak lanang mangan tahu';
    murdaToggle.disabled = false;
  }
}

function render(){
  const text = input.value || '';
  output.textContent = reverse
    ? jawaToLatin(text)
    : latinToJawa(text);
}

// INPUT
input.addEventListener('input', render);

// MURDA
murdaToggle.addEventListener('change', e=>{
  USE_MURDA = !!e.target.checked;
  render();
});

// SWAP
swapBtn.addEventListener('click', ()=>{
  input.value = output.textContent || '';
  output.textContent = '';
  reverse = !reverse;
  setModeUI();
  render();
});

// COPY
copyBtn.addEventListener('click', async ()=>{
  await navigator.clipboard.writeText(output.textContent || '');
  const prev = copyBtn.textContent;
  copyBtn.textContent = 'Tersalin ✓';
  setTimeout(()=>copyBtn.textContent = prev, 1200);
});

// INIT
setModeUI();
render();