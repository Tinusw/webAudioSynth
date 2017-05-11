import {renderChart} from "./visuals"
var QwertyHancock = require("./kwerty.js")

// Todo
// figure this out so we can dynamically set the keyboard width
var keyboardDiv = document.getElementById("keyboard-container");
var keyboardWidth = keyboardDiv.clientWidth;

var keyboard = new QwertyHancock({
  id: 'keyboard',
  width: keyboardWidth-110,
  height: 150,
  startNote: 'A2',
  whiteNotesColour: '#fff',
  blackNotesColour: '#000',
  borderColour: '#000',
  activeColour: 'orange',
  octaves: 3
});

// Browser Compatibility
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var context = new AudioContext(),keyboard;
var osc1Gain = context.createGain();
var osc2Gain = context.createGain();
var masterGain = context.createGain();
var nodes = [];
// Global object to expose scoped variable
var oscillators = {};

// init LP and HP filters
var filter = context.createBiquadFilter();
filter.type = "lowpass";
var filter2 = context.createBiquadFilter();
filter2.type = "highpass";

// init Delay
var delayEffect = context.createDelay(5);

// init feedback & feedbackFilter
var delayFeedback = context.createGain();
var feedbackFilter = context.createBiquadFilter()

// State that will save global variables and levels
var STATE = {
  osc1Gain: 0.5,
  osc1Type: 'sawtooth',
  osc1Detune: 0,
  osc2Gain: 0.4,
  osc2Type: 'sawtooth',
  osc2Detune: 0.01,
  volume: 0.5,
  LPcutoff : 1000,
  HPcutoff : 0,
  delayAmnt: 0.5,
  delayFeedback: 0,
  feedbackFilter: 1000
}

// Initial State
osc1Gain.gain.value = STATE.osc1Gain;
osc2Gain.gain.value = STATE.osc2Gain;
filter.frequency.value = STATE.LPcutoff;
filter2.frequency.value = STATE.HPcutoff;
delayEffect.delayTime.value = STATE.delayAmnt;
delayFeedback.gain.value = STATE.delayFeedback;
feedbackFilter.frequency.value = STATE.feedbackFilter;
masterGain.gain.value = STATE.volume;

function changeOsc1Volume(osc1Gain){
  STATE.osc1Gain = osc1Gain;
}

function changeOsc1Type(osc1Type){
  STATE.osc1Type = osc1Type;
}

function changeOsc2Volume(osc2Gain){
  STATE.osc2Gain = osc2Gain;
}

function changeOsc2Type(osc2Type){
  STATE.osc2Type = osc2Type;
}

// Function to alter Master Volume
function changeMasterVolume(volume){
  STATE.volume = volume;
}

function changeLPcutoff(LPcutoff){
  STATE.LPcutoff = LPcutoff;
}

function changeHPcutoff(HPcutoff){
  STATE.HPcutoff = HPcutoff;
}

function changeDelayTime(delayAmnt){
  STATE.delayAmnt = delayAmnt;
}

function changeDelayFeedback(feedback){
  STATE.delayFeedback = delayFeedback;
}

// OSC 1 LISTENERS

var osc1Volume = document.getElementById("Osc1Gain")

osc1Volume.addEventListener("input", function(){
  osc1Gain.gain.value = this.value;
  changeOsc1Volume(this.value);
})

var osc1Type = document.getElementById("Osc1Type");

osc1Type.addEventListener("input", function(){
  STATE.osc1Type = this.value;
})

// OSC 2 LISTENERS

var osc2Volume = document.getElementById("Osc2Gain")

osc2Volume.addEventListener("input", function(){
  osc2Gain.gain.value = this.value;
  changeOsc2Volume(this.value);
})

var osc2Type = document.getElementById("Osc2Type");

osc2Type.addEventListener("input", function(){
  STATE.osc2Type = this.value;
})

var osc2Oct = document.getElementById("Osc2Oct");

osc2Oct.addEventListener("input", function(){
  // TODO refine why both Oscillators are being screwed with
  for (var oscillator_2_id in oscillators){
    if (oscillators.hasOwnProperty(oscillator_2_id)){
      console.log(oscillators)
      oscillators[oscillator_2_id].detune.value = this.value;
    }
  };
})

// Listener for MasterVolume
var MasterVolume = document.getElementById("volume");

MasterVolume.addEventListener("input", function(){
  changeMasterVolume(this.value);
  masterGain.gain.value = this.value;
});

var analyser = context.createAnalyser();

// Listener for LOWPASS FILTER CUTOFF
var LPcutoff = document.getElementById("LPcutoff");

LPcutoff.addEventListener("input", function(){
  changeLPcutoff(this.value);
  filter.frequency.value = this.value;
});

// Listener for HIGHPASS FILTER CUTOFF
var LPcutoff = document.getElementById("HPcutoff");

LPcutoff.addEventListener("input", function(){
  changeHPcutoff(this.value);
  filter2.frequency.value = this.value;
});

// Listener for Delay Effect
var delayAmnt = document.getElementById("delayAmnt");

delayAmnt.addEventListener("input", function(){
  changeDelayTime(this.value);
  delayEffect.delayTime.value = this.value;
});

// Listener for Delay Feedback Amount
var delayFeedbackAmnt = document.getElementById("delayFeedbackAmnt");

delayFeedbackAmnt.addEventListener("input", function(){
  changeDelayFeedback(this.value);
  delayFeedback.gain.value = this.value;
});

// We're using this to uniquely identify oscillators
// This is used by createOscillatorInObject
// This is used by createSingleOscillator
// This is used by stopOscillators
var i = 0;

// Every subsequent oscillator will have a slight amount of detune added to immitate an analog synthesizer
// This is called by createOscillatorInObject
function generateRandomNumber(min, max){
  return Math.floor(Math.random() * max) + min;
}

function createOscillatorInObject(type, frequency){
  var oscillator_id = "oscillator" + i;
  if(oscillators.hasOwnProperty(oscillator_id)){
    i = i + 1;
    createSingleOscillator(i, type, frequency, (i * generateRandomNumber(0.4, 0.9)));
  } else {
    createSingleOscillator(i, type, frequency, (i * generateRandomNumber(0.4, 0.9)));
  }
}

function createSingleOscillator(i, type, frequency, detune){
  var oscillator_id = "oscillator" + i;
  oscillators[oscillator_id] = context.createOscillator();
  oscillators[oscillator_id].type = type;
  oscillators[oscillator_id].frequency.value = frequency;
  oscillators[oscillator_id].detune.value = detune;
  oscillators[oscillator_id].start(context.currentTime);
  oscillators[oscillator_id].connect(osc1Gain);
}

function createOscillator2InObject(type, frequency){
  var oscillator_id = "oscillator_2" + i;
  if(oscillators.hasOwnProperty(oscillator_id)){
    i = i + 1;
    createSingleOscillator2(i, type, frequency);
  } else {
    createSingleOscillator2(i, type, frequency);
  }
}

function createSingleOscillator2(i, type, frequency){
  var oscillator_id = "oscillator_2" + i;
  oscillators[oscillator_id] = context.createOscillator();
  oscillators[oscillator_id].type = type;
  oscillators[oscillator_id].frequency.value = frequency;
  // Adds a slight bit of analogue wobble
  oscillators[oscillator_id].detune.value = (STATE.osc2Detune * generateRandomNumber(0.4, 0.7));
  console.log(STATE.osc2Detune);
  oscillators[oscillator_id].start(context.currentTime);
  oscillators[oscillator_id].connect(osc2Gain);
}

function stopOscillators(){
  // Refactor
  for (var oscillator_id in oscillators){
    if (oscillators.hasOwnProperty(oscillator_id)){
      oscillators[oscillator_id].stop(context.currentTime);
    }
  };
  for (var oscillator2_id in oscillators){
    if (oscillators.hasOwnProperty(oscillator2_id)){
      oscillators[oscillator2_id].stop(context.currentTime);
    }
  };
}


// Keydown Event
keyboard.keyDown = function (note, frequency) {
    // create our two oscilators
    createOscillatorInObject(STATE.osc1Type, frequency);
    // TODO SORT OUT OSC2 DETUNE
    createOscillator2InObject(STATE.osc2Type, frequency, STATE.osc2Detune);
    osc1Gain.connect(filter);
    osc2Gain.connect(filter);

    // oscillator2.connect(filter);
    filter.connect(filter2);

    // And connect Signal Path
    filter2.connect(delayEffect);
    delayEffect.connect(delayFeedback);
    delayFeedback.connect(delayEffect);
    delayFeedback.connect(feedbackFilter);
    feedbackFilter.connect(analyser);
    filter2.connect(analyser);
    analyser.connect(masterGain);
    masterGain.connect(context.destination);
    renderChart();
};

// KeyUp or stop note event
keyboard.keyUp = function (note, frequency) {
  stopOscillators();
  // Only after successfully stopping all oscillators can we reset i
  i = 0;
};

export {analyser}
