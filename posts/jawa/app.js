const input = document.getElementById('input');
const output = document.getElementById('output');
const copyBtn = document.getElementById('copyBtn');
const murdaToggle = document.getElementById('murdaToggle');
const reverseToggle = document.getElementById('reverseToggle');

/* =========================
   RENDER ENGINE
========================= */
function render(){
  const text = input.value || '';

  if (reverseToggle && reverseToggle.checked) {
    // AKSARA → LATIN
    output.textContent = jawaToLatin(text);
  } else {
    // LATIN → AKSARA
    output.textContent = latinToJawa(text);
  }
}

/* =========================
   EVENT LISTENERS
========================= */

// input utama
input.addEventListener('input', render);

// toggle murda (hanya berpengaruh ke Latin → Jawa)
if (murdaToggle) {
  murdaToggle.addEventListener('change', (e) => {
    USE_MURDA = !!e.target.checked;
    render();
  });
}

// toggle reverse
if (reverseToggle) {
  reverseToggle.addEventListener('change', render);
}

// copy hasil
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(output.textContent || '');
    const prev = copyBtn.textContent;
    copyBtn.textContent = 'Tersalin ✓';
    setTimeout(() => copyBtn.textContent = prev, 1200);
  } catch (err) {
    alert('Gagal menyalin: ' + err);
  }
});

// render awal
render();