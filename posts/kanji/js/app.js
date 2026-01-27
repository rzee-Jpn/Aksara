const App = {
  shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  },

  speak(text) {
  if (window.speechSynthesis?.speaking) {
    speechSynthesis.cancel();
  }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP";
  u.rate = 0.85;
  speechSynthesis.speak(u);
}
};

document.addEventListener("DOMContentLoaded", () => {
  UI.showMenu();
});  