const input = document.getElementById('input');
const output = document.getElementById('output');
const copyBtn = document.getElementById('copyBtn');
const murdaToggle = document.getElementById('murdaToggle');

function render(){
  output.textContent = latinToJawa(input.value || '');
}

// update global flag saat toggle berubah
murdaToggle.addEventListener('change', (e) => {
  USE_MURDA = !!e.target.checked;
  render();
});

input.addEventListener('input', render);

// initial render
render();

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(output.textContent || '');
    // notifikasi sederhana
    const prev = copyBtn.textContent;
    copyBtn.textContent = 'Tersalin ✓';
    setTimeout(()=> copyBtn.textContent = prev, 1200);
  } catch (err) {
    alert('Gagal menyalin: ' + err);
  }
});