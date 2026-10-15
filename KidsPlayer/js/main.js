/*
 * App Tizen "casca": abre o app hospedado no GitHub Pages e repassa o controle remoto.
 * Toda a lógica (catálogo, player) mora na página hospedada: atualizar = git push, sem reinstalar.
 * ES5 de propósito (Tizen 5.0 = Chromium antigo).
 */
var APP_URL = 'https://fernandohenriquemarques.github.io/kids-player/';

var frame = document.getElementById('frame');
var statusEl = document.getElementById('status');
var statusTimer = null;
var ready = false;

function showStatus(text, ms) {
  statusEl.textContent = text;
  statusEl.style.display = 'block';
  clearTimeout(statusTimer);
  if (ms) statusTimer = setTimeout(function () { statusEl.style.display = 'none'; }, ms);
}

function exitApp() {
  try { tizen.application.getCurrentApplication().exit(); } catch (e) { /* fora da TV */ }
}

function registerKeys() {
  try {
    tizen.tvinputdevice.registerKeyBatch([
      'MediaPlayPause', 'MediaPlay', 'MediaPause', 'MediaStop', 'MediaRewind', 'MediaFastForward'
    ]);
  } catch (e) { /* fora da TV */ }
}

var KEYS = {
  13: 'enter', 37: 'left', 38: 'up', 39: 'right', 40: 'down',
  10009: 'back', 10252: 'playpause', 415: 'play', 19: 'pause', 413: 'stop', 412: 'rew', 417: 'ff'
};

document.addEventListener('keydown', function (e) {
  var k = KEYS[e.keyCode];
  if (!k) return;
  e.preventDefault();
  // Se o app hospedado não carregou, Voltar sai direto
  if (!ready) { if (k === 'back') exitApp(); return; }
  frame.contentWindow.postMessage({ target: 'kids-app', cmd: 'key', arg: k }, '*');
});

window.addEventListener('message', function (e) {
  var d = e.data;
  if (!d || d.source !== 'kids-app') return;
  if (d.type === 'ready') { ready = true; clearTimeout(loadTimer); statusEl.style.display = 'none'; }
  if (d.type === 'exit') exitApp();
});

var loadTimer = setTimeout(function () {
  showStatus('Sem conexão. Verifique a internet e abra o app de novo.');
}, 20000);

window.onload = function () {
  registerKeys();
  frame.src = APP_URL;
  document.body.focus();
};
