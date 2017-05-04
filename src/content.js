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

function outputUpdate(vol) {
  document.querySelector('#MasterVolumeOutput').value = vol * 100 + "%";
}

// Browser Compatibility
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var context = new AudioContext(),keyboard;

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
  osc1Type: 'sawtooth',
  osc1Detune: 0,
  osc2Type: 'sawtooth',
  osc2Detune: 0,
  volume: 0.5,
  LPcutoff : 1000,
  HPcutoff : 0,
  delayAmnt: 0.5,
  delayFeedback: 0,
  feedbackFilter: 1000
}

// Initial State
filter.frequency.value = STATE.LPcutoff;
filter2.frequency.value = STATE.HPcutoff;
delayEffect.delayTime.value = STATE.delayAmnt;
delayFeedback.gain.value = STATE.delayFeedback;
feedbackFilter.frequency.value = STATE.feedbackFilter;
masterGain.gain.value = STATE.volume;

function changeOsc1Type(osc1Type){
  STATE.osc1Type = osc1Type;
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

var osc1Type = document.getElementById("osc1Type");

osc1Type.addEventListener("change", function(){
  STATE.osc1Type = this.value;
})

var osc1Detune = document.getElementById("Osc1Detune");

osc1Detune.addEventListener("change", function(){
  STATE.osc1Detune = this.value;
})

// OSC 2 LISTENERS

var osc2Type = document.getElementById("osc2Type");

osc2Type.addEventListener("change", function(){
  STATE.osc2Type = this.value;
})

var osc2Detune = document.getElementById("Osc2Detune");

osc2Detune.addEventListener("change", function(){
  STATE.osc2Detune = this.value;
})

// Listener for MasterVolume
var MasterVolume = document.getElementById("volume");

MasterVolume.addEventListener("change", function(){
  changeMasterVolume(this.value);
  masterGain.gain.value = this.value;
});

var analyser = context.createAnalyser();

// Listener for LOWPASS FILTER CUTOFF
var LPcutoff = document.getElementById("LPcutoff");

LPcutoff.addEventListener("change", function(){
  changeLPcutoff(this.value);
  filter.frequency.value = this.value;
});

// Listener for HIGHPASS FILTER CUTOFF
var LPcutoff = document.getElementById("HPcutoff");

LPcutoff.addEventListener("change", function(){
  changeHPcutoff(this.value);
  filter2.frequency.value = this.value;
});

// Listener for Delay Effect
var delayAmnt = document.getElementById("delayAmnt");

delayAmnt.addEventListener("change", function(){
  changeDelayTime(this.value);
  delayEffect.delayTime.value = this.value;
});

// Listener for Delay Feedback Amount
var delayFeedbackAmnt = document.getElementById("delayFeedbackAmnt");

delayFeedbackAmnt.addEventListener("change", function(){
  changeDelayFeedback(this.value);
  delayFeedback.gain.value = this.value;
});

function createOscillatorInObject(type,frequency,detune){
  var i = 0;
  var oscillator_id = "oscillator" + i;
  if(oscillators.hasOwnProperty(oscillator_id)){
    // not incrementing for some reason
    i = i + 1;
    console.log(i)
  } else {
    createSingleOscillator(i, type, frequency, detune);
  }
}

function createSingleOscillator(i,type, frequency, detune){
  var oscillator_id = "oscillator" + i;
  oscillators[oscillator_id] = context.createOscillator();
  oscillators[oscillator_id].type = type;
  oscillators[oscillator_id].frequency.value = frequency;
  oscillators[oscillator_id].detune.value = detune;
  oscillators[oscillator_id].start(context.currentTime);
  oscillators[oscillator_id].connect(filter);
}

function stopOscillators(){
  var i = 0;
  var oscillator_id = "oscillator" + i;
  for (var oscillator_id in oscillators){
    if (oscillators.hasOwnProperty(oscillator_id)){
      oscillators[oscillator_id].stop(context.currentTime);
    }
    i = i + 1;
  };
}

// Keydown Event
keyboard.keyDown = function (note, frequency) {
    // create our two oscilators
    createOscillatorInObject(STATE.osc1Type, frequency, STATE.osc1Detune);
    // createOscillatorInObject(STATE.osc2Type, frequency, STATE.osc2Detune);

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
};

export {analyser}
