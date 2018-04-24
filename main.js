// ================== TODO ==================
// ! get timer to run (remaining time displayed in 'mm:ss' format)
// ! let user adjust length of break & session
// ! automatically clears setInterval when time is up
// automatically switch between break and session
// animate filling effect of a tomato

// ================== seletors ==================
// start timer button
const startBtn = getEl('.start')[0];
// pause timer button
const pauseBtn = getEl('.pause')[0];
// stop timer button
const stopBtn = getEl('.stop')[0];
// resume timer button
const resumeBtn = getEl('.resume')[0];
// time remaining display
const remainTimeDisplay = getEl('.remain-len')[0];

// ================== Initializations ==================
// remaining time in seconds
let timeRemaining;
let stopIntervalKey;
let stopTimeoutKey;
// session length input (in minutes)
let sessionLen;
// break length input (in minutes)
let breakLen;
// const breakLen = getEl('.break-len')[0].value;
// determine session or break
let inSession = true;

// ================== Event Listeners ==================
// start timer when start button pressed
startBtn.addEventListener('click', startTimer);

// stop timer when stop button pressed
stopBtn.addEventListener('click', stopTimer);

// pause timer when pause button pressed
pauseBtn.addEventListener('click', pauseTimer);

// re-start timer when resume button pressed
resumeBtn.addEventListener('click', startTimer);

// ================== Functions ==================
// start and resume timer
function startTimer() {
  // start new timer: retrieve sessionLen from input; resume timer: use current sessionLen
  sessionLen = sessionLen || getEl('.session-len')[0].value;
  // get break length
  breakLen = getEl('.break-len')[0].value;
  // calculate remaining time based on whether work session or break
  if (inSession) {
    // calculate remaining time: if start, use sessionlen; if resume, use current timeRemaining
    timeRemaining = timeRemaining || Math.floor(parseFloat(sessionLen) * 60);
    console.log('work')
    hideBtn([startBtn, resumeBtn]);
  } else if (!inSession) {
    timeRemaining = timeRemaining || Math.floor(parseFloat(breakLen) * 60);
    console.log('rest')
  }

  // update title
  if (inSession) {
    getEl('.sessionName')[0].textContent = 'work'
  } else {
    getEl('.sessionName')[0].textContent = 'rest'
  }

  // start timer and assign stop key
  stopIntervalKey = setInterval(() => {
    remainTimeDisplay.textContent = formatTime(timeRemaining);
    timeRemaining -= 1;
  }, 1000);
  console.log('timer started');
  // hide start timer button
  hideBtn([startBtn, resumeBtn]);
  // show pause button and stop button
  showBtn([pauseBtn, stopBtn]);

  // setTimeout to clearInterval after timeRemaining
  stopTimeoutKey = setTimeout(() => {
    clearInterval(stopIntervalKey);
    inSession = !inSession;
    // clear remaining time
    timeRemaining = null;
    hideBtn([pauseBtn, stopBtn]);
    showBtn([startBtn]);
    // start break or session again based on previous session
    startTimer();
    console.log(timeRemaining)
    console.log("automatically cleared");

  }, (timeRemaining + 1.5) * 1000);
}

// stop timer
function stopTimer() {
  // set time display to default (0)
  remainTimeDisplay.textContent = formatTime(0);
  // clear interval
  clearInterval(stopIntervalKey);
  // clear timeout
  clearTimeout(stopTimeoutKey);
  // clear timeRemaining
  timeRemaining = null;
  // clear sessionLen and breakLen
  sessionLen = null;
  breakLen = null;
  console.log('timer stopped');
  // show start button
  showBtn([startBtn]);
  // hide pause button and stop button
  hideBtn([pauseBtn, stopBtn]);
  // empty interval and timeout key
  stopIntervalKey = null;
  stopTimeoutKey = null;
}

// pause timer
function pauseTimer() {
  // clear current timer with clearInterval and cleartimeout
  clearInterval(stopIntervalKey);
  clearTimeout(stopTimeoutKey);
  // clear stop and timeout key
  stopIntervalKey = null;
  stopTimeoutKey = null;
  // record timeRemaining
  // hide pause button
  hideBtn([pauseBtn]);
  // show resume button
  showBtn([resumeBtn]);
  console.log('timer paused');
}

// convert remaining time string into format: hh:mm:ss
function formatTime(time) {
  // time in seconds
  time = Number(time);
  // hours
  const hour = Math.floor(time / 3600);
  // minutes
  const minute = Math.floor(time % 3600 / 60);
  // seconds
  const second = Math.floor(time % 3600 % 60);

  // form string representation of time in proper format
  let timeString = '';
  // hour > 0 ? timeString += (hour < 10 ? '0' + hour : hour) + ':' : timeString += '00:';
  hour > 0 ? timeString += (hour < 10 ? '0' + hour : hour) + ':' : timeString;
  minute > 0 ? timeString += (minute < 10 ? '0' + minute : minute) + ':' : timeString += '00:';
  second > 0 ? timeString += (second < 10 ? '0' + second : second) : timeString += '00';
  return timeString;
}

// helper function for selecting elements
function getEl(selector) {
  if (selector[0] === '#') {
    // selects by id (1 item)
    return document.getElementById(selector.slice(1));
  } else if (selector[0] === '.') {
    // selects by class (array of items) - use [0] to select particular one
    return document.getElementsByClassName(selector.slice(1));
  } else {
    // selects by tag
    return document.querySelector(selector);
  }
}

// hide button
function hideBtn(buttons) {
  // accepts buttons as [btn1, btn2]
  for (let button of buttons) {
    button.style.display = 'none';
  }
}

// show button
function showBtn(buttons) {
  for (let button of buttons) {
    button.style.display = 'inline-block';
  }
}
