"use strict";

let currentLevel = 1;
let duelTimeout = 700;
let isReady = false;
let duelTimer, points;

const btnStartGame = document.querySelector('.button-start-game');
const btnRestart = document.querySelector('.button-restart');
const btnNextLevel = document.querySelector('.button-next-level');
const menuScreen = document.querySelector('.game-menu');
const mainWrapper = document.querySelector('.wrapper');
const infoPanels = document.querySelector('.game-panels');
const screenGame = document.querySelector('.game-screen');
const victoryScreen = document.querySelector('.win-screen');
const enemy = document.querySelector('.gunman');
const playerTime = document.querySelector('.time-panel__you');
const gunmanTime = document.querySelector('.time-panel__gunman');
const levelDisplay = document.querySelector('.score-panel__level');
const gameMessage = document.querySelector('.message');

const soundIntro = new Audio('sfx/intro.m4a');
const soundWait = new Audio('sfx/wait.m4a');
const soundFire = new Audio('sfx/fire.m4a');
const soundShot = new Audio('sfx/shot.m4a');
const soundVictory = new Audio('sfx/win.m4a');
const soundDeath = new Audio('sfx/death.m4a');

btnStartGame.addEventListener('click', launchGame);
btnRestart.addEventListener('click', restartSession);
btnNextLevel.addEventListener('click', advanceLevel);

function launchGame() {
  menuScreen.style.display = 'none';
  infoPanels.style.display = 'block';
  screenGame.style.display = 'block';
  mainWrapper.style.display = 'block';
  gunmanTime.innerHTML = (duelTimeout / 1000).toFixed(2);
  playerTime.innerHTML = (0).toFixed(2);
  points = +document.querySelector('.score-panel__score_num').innerHTML;
  levelDisplay.innerHTML = 'level: ' + currentLevel;
  enemy.classList.add('gunman-level-' + currentLevel);
  enemy.addEventListener('transitionend', setupDuel);
  setTimeout(initiateMovement, 500);
}

function restartSession() {
  soundDeath.pause();
  btnRestart.style.display = 'none';
  gameMessage.innerHTML = '';
  screenGame.classList.remove('game-screen--death');
  gameMessage.classList.remove('message--dead', 'animated', 'zoomIn');
  enemy.className = 'gunman';
  setTimeout(launchGame, 1000);
}

function advanceLevel() {
  if (currentLevel < 5) {
    btnNextLevel.style.display = 'none';
    gameMessage.innerHTML = '';
    gameMessage.classList.remove('message--win', 'animated', 'zoomIn');
    enemy.className = 'gunman';
    currentLevel++;
    duelTimeout = 700 - (currentLevel * 100);
    launchGame();
  } else {
    gameMessage.style.display = 'none';
    screenGame.style.display = 'none';
    infoPanels.style.display = 'none';
    victoryScreen.style.display = 'block';
  }
}

function initiateMovement() {
  setTimeout(() => {
    enemy.classList.add('moving');
    soundIntro.play();
    soundIntro.loop = true;
  }, 50);
}

function setupDuel() {
  soundIntro.pause();
  soundWait.play();
  soundWait.currentTime = 0;
  soundWait.loop = true;
  enemy.classList.remove('moving');
  enemy.classList.add('standing', 'gunman-level-' + currentLevel + '__standing');
  setTimeout(() => {
    soundWait.pause();
    enemy.classList.add('gunman-level-' + currentLevel + '__ready');
    gameMessage.classList.add('message--fire');
    soundFire.play();
    enemy.addEventListener('mousedown', playerShoots);
    isReady = true;
    startTimer(new Date().getTime());
    setTimeout(enemyShootsPlayer, duelTimeout);
  }, 1000);
}

function startTimer(start) {
  let now;
  (function tick() {
    now = new Date().getTime();
    if (isReady) {
      duelTimer = ((now - start + 10) / 1000).toFixed(2);
      playerTime.innerHTML = duelTimer;
      setTimeout(tick, 10);
    }
  })();
}

function enemyShootsPlayer() {
  if (isReady) {
    isReady = false;
    enemy.classList.remove('standing');
    enemy.classList.add('gunman-level-' + currentLevel + '__shooting');
    setTimeout(() => {
      soundShot.play();
      gameMessage.classList.remove('message--fire');
      screenGame.classList.add('game-screen--death');
      gameMessage.classList.add('message--dead', 'animated', 'zoomIn');
      gameMessage.innerHTML = 'You are dead!';
    }, duelTimeout / 3);
    enemy.removeEventListener('mousedown', playerShoots);
    setTimeout(() => {
      soundDeath.play();
      btnRestart.style.display = 'block';
    }, 1000);
  }
}

function playerShoots() {
  if (isReady) {
    isReady = false;
    soundShot.play();
    gameMessage.classList.remove('message--fire');
    enemy.classList.remove('standing', 'gunman-level-' + currentLevel + '__shooting');
    enemy.classList.add('gunman-level-' + currentLevel + '__death');
    enemy.removeEventListener('mousedown', playerShoots);
    soundVictory.play();
    setTimeout(() => {
      gameMessage.classList.add('message--win', 'animated', 'zoomIn');
      gameMessage.innerHTML = 'You Win!';
      updateScore();
      btnNextLevel.style.display = 'block';
    }, 1000);
  }
}

function updateScore() {
  const scoreElement = document.querySelector('.score-panel__score_num');
  const earned = +((+(duelTimeout / 1000) * 100 - +(playerTime.innerHTML) * 100) * 100 * currentLevel).toFixed(0);
  (function increment() {
    if (+scoreElement.innerHTML - points < earned) {
      scoreElement.innerHTML = +scoreElement.innerHTML + 100;
      setTimeout(increment, 10);
    }
  })();
}
