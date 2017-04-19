import {renderChart} from "./visuals"
var QwertyHancock = require("./kwerty.js")

var keyboard = new QwertyHancock({
  id: 'keyboard',
  width: 700,
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
  volume: 0.5,
  LPcutoff : 10000,
  HPcutoff : 0,
  delayAmnt: 0.5,
  delayFeedback: 0.8,
  feedbackFilter: 1000
}

// Initial State
filter.frequency.value = STATE.LPcutoff;
filter2.frequency.value = STATE.HPcutoff;
delayEffect.delayTime.value = STATE.delayAmnt;
delayFeedback.gain.value = STATE.delayFeedback;
feedbackFilter.frequency.value = STATE.feedbackFilter;
masterGain.gain.value = STATE.volume;


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

// Keydown Event
keyboard.keyDown = function (note, frequency) {
    // create our two oscilators
    var oscillator = context.createOscillator();
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = frequency;
    oscillator.detune.value = -10;
    oscillator.start(context.currentTime);

    var oscillator2 = context.createOscillator();
    oscillator2.type = 'sawtooth';
    oscillator2.frequency.value = frequency;
    oscillator2.detune.value = 10;
    oscillator2.start(context.currentTime);

    oscillators[frequency] = [oscillator, oscillator2];

    oscillator.connect(filter);
    oscillator2.connect(filter);
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
    oscillators[frequency].forEach(function(oscillator){
      oscillator.stop(context.currentTime)
    });
  };
;

export {analyser}
