const synth = "speechSynthesis" in window ? window.speechSynthesis : null;

export const playTTS = text => {
  if (!synth || !text) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ko-KR";
  u.rate = 0.85;
  synth.speak(u);
};

export const vibrate = pattern =>
  "vibrate" in navigator && navigator.vibrate(pattern);