let chart

/* =========================
   MAIN CALCULATOR
========================= */
function calculate() {

  const ageNow = +el('ageNow').value
  const ageRetire = +el('ageRetire').value
  const ageEnd = +el('ageEnd').value

  const initial = +el('initial').value
  const monthly = +el('monthly').value
  const expenseStart = +el('expense').value

  const returnWork = +el('returnWork').value / 100
  const returnRetire = +el('returnRetire').value / 100
  const inflation = +el('inflation').value / 100

  if (ageRetire <= ageNow || ageEnd <= ageRetire) {
    alert('Usia tidak valid')
    return
  }

  const monthsWork = (ageRetire - ageNow) * 12
  const monthsRetire = (ageEnd - ageRetire) * 12

  /* =========================
     AKUMULASI (WORK PHASE)
  ========================= */
  let balance = initial
  let growthData = []

  const rWork = Math.pow(1 + returnWork, 1 / 12) - 1

  for (let i = 0; i < monthsWork; i++) {
    balance = balance * (1 + rWork) + monthly
    growthData.push(balance)
  }

  const fundAtRetire = balance

  /* =========================
     HITUNG DANA IDEAL
  ========================= */
  const requiredFund = calculateRequiredFund(
    expenseStart,
    monthsRetire,
    returnRetire,
    inflation
  )

  const gap = fundAtRetire - requiredFund

  /* =========================
     DISTRIBUSI (RETIRE PHASE)
  ========================= */
  let expense = expenseStart
  let retireData = []
  let depletionMonth = null

  const rRetire = Math.pow(1 + returnRetire, 1 / 12) - 1

  for (let i = 0; i < monthsRetire; i++) {

    if (i > 0 && i % 12 === 0) {
      expense *= (1 + inflation)
    }

    balance = balance * (1 + rRetire) - expense
    retireData.push(balance)

    if (balance <= 0 && depletionMonth === null) {
      depletionMonth = i
    }
  }

  /* =========================
     OUTPUT
  ========================= */
  const result = el('result')
  result.classList.remove('hidden')

  result.innerHTML = `
    <h3>Status: ${gap >= 0 ? 'AMAN' : 'DEFISIT'}</h3>

    <p>Dana ideal saat pensiun:
      <b>Rp ${format(requiredFund)}</b>
    </p>

    <p>Dana Anda saat pensiun:
      <b>Rp ${format(fundAtRetire)}</b>
    </p>

    <p>Selisih:
      <b style="color:${gap >= 0 ? '#7CFC98' : '#ff6b6b'}">
        Rp ${format(gap)}
      </b>
    </p>

    ${
      depletionMonth !== null
        ? `<p style="color:#ff6b6b">
            Dana habis di usia
            <b>${ageRetire + Math.floor(depletionMonth / 12)}</b>
           </p>`
        : ''
    }
  `

  drawChart(growthData, retireData)
}

/* =========================
   DANA IDEAL (PV RETIREMENT)
========================= */
function calculateRequiredFund(
  expenseStart,
  monthsRetire,
  returnRetire,
  inflation
) {
  let fund = 0
  let expense = expenseStart
  const r = Math.pow(1 + returnRetire, 1 / 12) - 1

  for (let i = monthsRetire - 1; i >= 0; i--) {

    if (i % 12 === 0 && i !== monthsRetire - 1) {
      expense /= (1 + inflation)
    }

    fund = (fund + expense) / (1 + r)
  }

  return fund
}

/* =========================
   REVERSE PLANNING
========================= */
function reversePlan() {

  const ageNow = +el('ageNow').value
  const ageRetire = +el('ageRetire').value
  const ageEnd = +el('ageEnd').value

  const initial = +el('initial').value
  const expenseStart = +el('expense').value

  const returnWork = +el('returnWork').value / 100
  const returnRetire = +el('returnRetire').value / 100
  const inflation = +el('inflation').value / 100

  const monthsWork = (ageRetire - ageNow) * 12
  const monthsRetire = (ageEnd - ageRetire) * 12

  const requiredFund = calculateRequiredFund(
    expenseStart,
    monthsRetire,
    returnRetire,
    inflation
  )

  let low = 0
  let high = 50_000_000
  let result = high

  const rWork = Math.pow(1 + returnWork, 1 / 12) - 1

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)

    let balance = initial
    for (let i = 0; i < monthsWork; i++) {
      balance = balance * (1 + rWork) + mid
    }

    if (balance >= requiredFund) {
      result = mid
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  const resultBox = el('result')
  resultBox.classList.remove('hidden')

  resultBox.innerHTML = `
    <h3>Rekomendasi Investasi Bulanan</h3>

    <p>Dana ideal saat pensiun:
      <b>Rp ${format(requiredFund)}</b>
    </p>

    <p>Agar aman sampai usia ${ageEnd},
    Anda perlu investasi bulanan sekitar:</p>

    <h2>Rp ${format(result)}</h2>
  `
}

/* =========================
   CHART
========================= */
function drawChart(growth, retire) {

  const ctx = el('chart')
  if (chart) chart.destroy()

  const data = [...growth, ...retire]

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((_, i) => i + 1),
      datasets: [{
        label: 'Dana (Rp)',
        data,
        borderWidth: 2,
        tension: 0.25
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { title: { display: true, text: 'Bulan' } },
        y: { title: { display: true, text: 'Saldo (Rp)' } }
      }
    }
  })
}

/* =========================
   UTIL
========================= */
function el(id) {
  return document.getElementById(id)
}

function format(n) {
  return Math.round(n).toLocaleString('id-ID')
}