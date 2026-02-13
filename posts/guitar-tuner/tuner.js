const noteNames = ["C","C♯","D","D♯","E","F","F♯","G","G♯","A","A♯","B"];
const A4 = 440;

let audioCtx, analyser, buffer, lastNote = null;

async function startTuner(){
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const stream = await navigator.mediaDevices.getUserMedia({ audio:true });

  const source = audioCtx.createMediaStreamSource(stream);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  buffer = new Float32Array(analyser.fftSize);

  source.connect(analyser);
  detect();
}

function detect(){
  analyser.getFloatTimeDomainData(buffer);
  const freq = autoCorrelate(buffer, audioCtx.sampleRate);

  if(freq !== -1){
    const note = freqToNote(freq);
    const cents = centsOff(freq, note.freq);

    updateUI(note, freq, cents);
  }

  requestAnimationFrame(detect);
}

function autoCorrelate(buf, sampleRate){
  let rms = 0;
  for(let i=0;i<buf.length;i++) rms += buf[i]*buf[i];
  rms = Math.sqrt(rms / buf.length);
  if(rms < 0.01) return -1;

  let bestOffset = -1, bestCorr = 0;
  const correlations = new Array(buf.length).fill(0);

  for(let offset=8; offset<buf.length/2; offset++){
    let corr = 0;
    for(let i=0;i<buf.length/2;i++){
      corr += buf[i]*buf[i+offset];
    }
    correlations[offset] = corr;
    if(corr > bestCorr){
      bestCorr = corr;
      bestOffset = offset;
    }
  }

  if(bestOffset === -1) return -1;

  const shift =
    (correlations[bestOffset+1] - correlations[bestOffset-1]) /
    correlations[bestOffset];

  return sampleRate / (bestOffset + shift*0.5);
}

function freqToNote(freq){
  const noteNum = Math.round(12 * Math.log2(freq / A4)) + 69;
  const name = noteNames[noteNum % 12];
  const noteFreq = A4 * Math.pow(2, (noteNum - 69)/12);
  return { name, freq: noteFreq };
}

function centsOff(freq, ref){
  return Math.floor(1200 * Math.log2(freq / ref));
}

function updateUI(note, freq, cents){
  const noteEl = document.querySelector(".note");
  const freqEl = document.querySelector(".freq");
  const needle = document.querySelector(".needle");
  const status = document.querySelector(".status");

  if(note.name !== lastNote){
    noteEl.textContent = note.name;
    lastNote = note.name;
  }

  freqEl.textContent = freq.toFixed(2) + " Hz";
  const clamped = Math.max(-50, Math.min(50, cents));
  needle.style.left = (50 + clamped) + "%";

  status.textContent =
    Math.abs(cents) < 5 ? "In tune" :
    cents > 0 ? "Too sharp" : "Too flat";
}

startTuner();