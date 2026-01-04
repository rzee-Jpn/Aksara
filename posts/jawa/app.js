const input = document.getElementById('input');
const output = document.getElementById('output');
const copyBtn = document.getElementById('copyBtn');
const murdaToggle = document.getElementById('murdaToggle');
const swapBtn = document.getElementById('swapBtn');
const modeLabel = document.getElementById('modeLabel');

// false = Latin → Jawa
// true  = Jawa → Latin
let isReverse = false;

function render(){
  const text = input.value || '';

  if (isReverse) {
    output.textContent = jawaToLatin(text);
    modeLabel.textContent = 'Aksara Jawa → Latin';
    murdaToggle.disabled = true;
  } else {
    output.textContent = latinToJawa(text);
    modeLabel.textContent = 'Latin → Aksara Jawa';
    murdaToggle.disabled = false;
  }
}

// input
input.addEventListener('input', render);

// murda
murdaToggle.addEventListener('change', e => {
  USE_MURDA = !!e.target.checked;
  render();
});

// SWAP
swapBtn.addEventListener('click', () => {
  const temp = input.value;
  input.value = output.textContent || '';
  output.textContent = '';
  isReverse = !isReverse;
  render();
});

// copy
copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(output.textContent || '');
  const prev = copyBtn.textContent;
  copyBtn.textContent = 'Tersalin ✓';
  setTimeout(() => copyBtn.textContent = prev, 1200);
});

// init
render();