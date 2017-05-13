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
var feedbackFilter = context.createBiquadFilter();

// TODO
// The reverb below isn't that great...
// init reverb
var reverbEffect = context.createConvolver();
var impulseUrl = 'src/reverbSample.mp3';

var irRRequest = new XMLHttpRequest();

irRRequest.open("GET", "src/reverbSample.mp3", true);
irRRequest.responseType = "arraybuffer";
irRRequest.onload = function() {
    context.decodeAudioData( irRRequest.response, function(buffer) {
      filter2.buffer = buffer;
      // reverbEffect.buffer = buffer;
    } );
}
irRRequest.send();

reverbEffect.buffer = filter2.buffer;

// Distortion init
var distortionEffect = context.createWaveShaper();

function makeDistortionCurve(amount) {
  var k = typeof amount === 'number' ? amount : 50,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;

  for ( ; i < n_samples; ++i){
    x = i * 2 / n_samples - 1;
    curve[i] = ( 3 + k ) * x * 20 * deg / (Math.PI + k * Math.abs(x) );
  }
  return curve;
};

distortionEffect.curve = makeDistortionCurve(0);
distortionEffect.oversample = '4x';








// State that will save global variables and levels
var STATE = {
  osc1Gain: 0.5,
  osc1Type: 'sawtooth',
  osc1Detune: 0,
  osc2Gain: 0.4,
  osc2Type: 'sawtooth',
  osc2Detune: 0.01,
  volume: 0.5,
  LPcutoff : 4000,
  LPreso: 0.0001,
  HPcutoff : 0,
  HPreso: 0.0001,
  delayAmnt: 0.5,
  delayFeedback: 0,
  feedbackFilter: 1000
}

// Initial State
osc1Gain.gain.value = STATE.osc1Gain;
osc2Gain.gain.value = STATE.osc2Gain;
filter.frequency.value = STATE.LPcutoff;
filter.Q.value = STATE.LPreso;
filter2.frequency.value = STATE.HPcutoff;
filter2.Q.value = STATE.HPreso;
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

function changeLPreso(LPreso){
  STATE.LPreso = LPreso;
}

function changeHPcutoff(HPcutoff){
  STATE.HPcutoff = HPcutoff;
}

function changeHPreso(HPreso){
  STATE.HPreso = HPreso;
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
var octave = 0;

var octaveUp = document.getElementById("octUp");
octaveUp.addEventListener("click", function(){
  // If an octave up we simply multiply existing frequency
  octave = 1;
})

var octaveNormal = document.getElementById("octNormal");
octaveNormal.addEventListener("click", function(){
  octave = 0;
})

var octaveDown = document.getElementById("octDown");
octaveDown.addEventListener("click", function(){
  octave = -1;
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

// Listener for LOWPASS FILTER Q

var LPreso = document.getElementById("LPreso");

LPreso.addEventListener("input", function(){
  changeLPreso(this.value);
  filter.Q.value = this.value;
})

// Listener for HIGHPASS FILTER CUTOFF
var HPcutoff = document.getElementById("HPcutoff");

HPcutoff.addEventListener("input", function(){
  changeHPcutoff(this.value);
  filter2.frequency.value = this.value;
});

var HPreso = document.getElementById("HPreso");

HPreso.addEventListener("input", function(){
  changeHPreso(this.value);
  filter2.Q.value = this.value;
})

// ************************
// Delay Effect
// ************************

// Draw SVG pad
function canvasApp(canvasID, effectType) {
	var theCanvas = document.getElementById(canvasID);
	var context = theCanvas.getContext("2d");

	init();

	var numShapes;
	var shapes;
	var dragIndex;
	var dragging;
	var mouseX;
	var mouseY;
	var dragHoldX;
	var dragHoldY;

	function init() {
		numShapes = 1;
		shapes = [];

		makeShapes();

		drawScreen();

		theCanvas.addEventListener("mousedown", mouseDownListener, false);
	}

	function makeShapes() {
		var i;
		var tempX;
		var tempY;
		var tempRad;
		var tempR;
		var tempG;
		var tempB;
		var tempColor;
    var tempShape;
		for (i=0; i < numShapes; i++) {
      // My canvas element is 240x240
			tempRad = 10;
			tempX = 0 + tempRad;
			tempY = 240 - tempRad;
			tempR = Math.floor(Math.random()*255);
			tempG = Math.floor(Math.random()*255);
			tempB = Math.floor(Math.random()*255);
			tempColor = "rgb(" + tempR + "," + tempG + "," + tempB +")";
			tempShape = {x:tempX, y:tempY, rad:tempRad, color:tempColor};
			shapes.push(tempShape);
		}
	}

	function mouseDownListener(evt) {
		var i;
		//We are going to pay attention to the layering order of the objects so that if a mouse down occurs over more than object,
		//only the topmost one will be dragged.
		var highestIndex = -1;

		//getting mouse position correctly, being mindful of resizing that may have occured in the browser:
		var bRect = theCanvas.getBoundingClientRect();
		mouseX = (evt.clientX - bRect.left)*(theCanvas.width/bRect.width);
		mouseY = (evt.clientY - bRect.top)*(theCanvas.height/bRect.height);

		//find which shape was clicked
		for (i=0; i < numShapes; i++) {
			if	(hitTest(shapes[i], mouseX, mouseY)) {
				dragging = true;
				if (i > highestIndex) {
					//We will pay attention to the point on the object where the mouse is "holding" the object:
					dragHoldX = mouseX - shapes[i].x;
					dragHoldY = mouseY - shapes[i].y;
					highestIndex = i;
					dragIndex = i;
				}
			}
		}

		if (dragging) {
			window.addEventListener("mousemove", mouseMoveListener, false);
		}
		theCanvas.removeEventListener("mousedown", mouseDownListener, false);
		window.addEventListener("mouseup", mouseUpListener, false);

		//code below prevents the mouse down from having an effect on the main browser window:
		if (evt.preventDefault) {
			evt.preventDefault();
		} //standard
		else if (evt.returnValue) {
			evt.returnValue = false;
		} //older IE
		return false;
	}

	function mouseUpListener(evt) {
		theCanvas.addEventListener("mousedown", mouseDownListener, false);
		window.removeEventListener("mouseup", mouseUpListener, false);
		if (dragging) {
			dragging = false;
			window.removeEventListener("mousemove", mouseMoveListener, false);
		}
	}

	function mouseMoveListener(evt) {
		var posX;
		var posY;
		var shapeRad = shapes[dragIndex].rad;
		var minX = shapeRad;
		var maxX = theCanvas.width - shapeRad;
		var minY = shapeRad;
		var maxY = theCanvas.height - shapeRad;
		//getting mouse position correctly
		var bRect = theCanvas.getBoundingClientRect();
		mouseX = (evt.clientX - bRect.left)*(theCanvas.width/bRect.width);
		mouseY = (evt.clientY - bRect.top)*(theCanvas.height/bRect.height);

    setEffects(mouseX, mouseY, effectType);

		//clamp x and y positions to prevent object from dragging outside of canvas
		posX = mouseX - dragHoldX;
		posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
		posY = mouseY - dragHoldY;
		posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);

		shapes[dragIndex].x = posX;
		shapes[dragIndex].y = posY;

		drawScreen();
	}

	function hitTest(shape,mx,my) {

		var dx;
		var dy;
		dx = mx - shape.x;
		dy = my - shape.y;

		//a "hit" will be registered if the distance away from the center is less than the radius of the circular object
		return (dx*dx + dy*dy < shape.rad*shape.rad);
	}

	function drawShapes() {
		var i;
		for (i=0; i < numShapes; i++) {
			context.fillStyle = shapes[i].color;
			context.beginPath();
			context.arc(shapes[i].x, shapes[i].y, shapes[i].rad, 0, 2*Math.PI, false);
			context.closePath();
			context.fill();
		}
	}

	function drawScreen() {
		context.fillStyle = "#000000";
		context.fillRect(0,0,theCanvas.width,theCanvas.height);

		drawShapes();
	}
}

// This is called by our canvas element to conditionnaly update our effects
function setEffects(mouseX, mouseY, effectType){
  if (effectType == 'delay'){
    // Divide by width of canvas and multiply to get percentage out of 100
    var DelayTime = 100 - ((mouseX/240) * 100);
    // Invert returned value to get percentage out of 100
    var DelayFeedback = (100 - (mouseY/240) * 100);
    // Set as portion of 2 seconds
    delayEffect.delayTime.value = DelayTime/100 * 2.0;
    // set delay feedback gain as value of random number
    delayFeedback.gain.value = (DelayFeedback/100 * 1.0);
  } else {
    // Divide by width of canvas and multiply to get percentage out of 100
    var DistortionX = ((mouseX/240) * 100);
    var DistortionY = (100 - (mouseY/240) * 100);
    distortionEffect.curve = makeDistortionCurve(DistortionX);
    distortionEffect.oversample = '4x';
  }
}
// ********************************************

function checkOsc2frequency(octave, frequency){
  if (octave >= 1){
    return frequency = frequency * 2;
  } else if (octave < 0){
    return frequency = frequency / 2
  } else {
    return frequency;
  }
}
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
  frequency = checkOsc2frequency(octave, frequency)
  if(oscillators.hasOwnProperty(oscillator_id)){
    i = i + 1;
    createSingleOscillator2(i, type, frequency );
  } else {
    createSingleOscillator2(i, type, frequency );
  }
}

function createSingleOscillator2(i, type, frequency){
  var oscillator_id = "oscillator_2" + i;
  oscillators[oscillator_id] = context.createOscillator();
  oscillators[oscillator_id].type = type;
  oscillators[oscillator_id].frequency.value = frequency;
  // Adds a slight bit of analogue wobble
  oscillators[oscillator_id].detune.value = (STATE.osc2Detune * generateRandomNumber(0.4, 0.7));
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
    filter2.connect(distortionEffect);
    distortionEffect.connect(analyser)
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

window.addEventListener("load", windowLoadHandler, false);

function windowLoadHandler() {
	canvasApp('delayPad', 'delay');
  canvasApp('reverbPad', 'reverb');
}


export {analyser}
