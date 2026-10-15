/*
 * App Tizen "casca": abre a página do player hospedada e repassa o controle remoto.
 * ES5 de propósito (Tizen 5.0 = Chromium antigo).
 */

// ===== CONFIGURE AQUI =====
// GitHub Pages:  'https://SEU_USUARIO.github.io/kids-player/player.html'
// Teste no Mac:  'http://IP_DO_MAC:8000/player.html'
var PLAYER_URL = 'https://SEU_USUARIO.github.io/kids-player/player.html';
var VIDEO_ID   = 'z3hMX65Khtg';
// ==========================

var frame = document.getElementById('frame');
var statusEl = document.getElementById('status');
var statusTimer = null;

function showStatus(text) {
  statusEl.textContent = text;
  statusEl.style.display = 'block';
  clearTimeout(statusTimer);
  statusTimer = setTimeout(function () { statusEl.style.display = 'none'; }, 2500);
}

function send(cmd, arg) {
  if (frame.contentWindow) {
    frame.contentWindow.postMessage({ target: 'kids-player', cmd: cmd, arg: arg }, '*');
  }
}

function exitApp() {
  try { tizen.application.getCurrentApplication().exit(); } catch (e) { /* fora da TV */ }
}

// Registra as teclas de mídia do controle (Enter/setas/Voltar já vêm por padrão)
function registerKeys() {
  try {
    tizen.tvinputdevice.registerKeyBatch([
      'MediaPlayPause', 'MediaPlay', 'MediaPause', 'MediaStop',
      'MediaRewind', 'MediaFastForward'
    ]);
  } catch (e) {
    showStatus('Teclas de mídia indisponíveis');
  }
}

var KEY = {
  ENTER: 13, LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40,
  BACK: 10009, PLAY_PAUSE: 10252, PLAY: 415, PAUSE: 19, STOP: 413,
  REWIND: 412, FAST_FORWARD: 417
};

document.addEventListener('keydown', function (e) {
  switch (e.keyCode) {
    case KEY.ENTER:
    case KEY.PLAY_PAUSE: send('toggle'); break;
    case KEY.PLAY:       send('play'); break;
    case KEY.PAUSE:      send('pause'); break;
    case KEY.STOP:       send('stop'); break;
    case KEY.LEFT:
    case KEY.REWIND:       send('seek', -10); showStatus('⏪ 10s'); break;
    case KEY.RIGHT:
    case KEY.FAST_FORWARD: send('seek', 10);  showStatus('⏩ 10s'); break;
    case KEY.BACK:       exitApp(); break;
  }
});

// Mensagens vindas do player (estado, erros)
window.addEventListener('message', function (e) {
  var d = e.data;
  if (!d || d.source !== 'kids-player') return;
  if (d.type === 'error') showStatus('Erro do YouTube: ' + d.data);
});

// Se a página do player não responder, avisa (útil para debug na TV)
var readyTimeout = setTimeout(function () {
  showStatus('Player não carregou. Verifique PLAYER_URL e a internet.');
}, 15000);
window.addEventListener('message', function (e) {
  if (e.data && e.data.source === 'kids-player' && e.data.type === 'ready') clearTimeout(readyTimeout);
});

window.onload = function () {
  registerKeys();
  frame.src = PLAYER_URL + '?v=' + encodeURIComponent(VIDEO_ID);
  document.body.focus();
};
