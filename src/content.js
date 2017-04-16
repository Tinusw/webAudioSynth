import * as d3 from "d3";

var QwertyHancock = require('./kwerty.js')
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

  // init LP and HP filters
  var filter = context.createBiquadFilter();
  filter.type = "lowpass";
  var filter2 = context.createBiquadFilter();
  filter2.type = "highpass";

  // State that will save global variables and levels
  var STATE = {
    volume: 0.5,
    LPcutoff : 10000,
    HPcutoff : 0
  }

  // Initial State
  filter.frequency.value = STATE.LPcutoff;
  filter2.frequency.value = STATE.HPcutoff;
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

  // visuals
  var frequencyData = new Uint8Array(380);
  // Create our analyser and vars
  var svgHeight = 300;
  var svgWidth = 600;
  var barPadding = 1;

  function createSvg(parent, height, width){
    return d3.select(parent).append('svg').attr('height', height).attr('width', width)
  }

  var svg = createSvg('#canvas', svgHeight, svgWidth);

  svg.selectAll('rect')
    .data(frequencyData)
    .enter().append('rect')
    .attr('x', function(d, i){
      return i * (svgWidth / frequencyData.length);
    })
  .attr('width',svgWidth / frequencyData.length + barPadding);

  var oscillators = {};

  // loop and update chart with frequency data
  function renderChart() {
    requestAnimationFrame(renderChart);

    // copy freq data to freqData array
    analyser.getByteFrequencyData(frequencyData);

    // Update d3 chart with data
    svg.selectAll('rect').data(frequencyData)
      .attr('y', function(d) {
        return svgHeight -d;
      })
      .attr('height', function(d) {
        return d;
      })
      .attr('fill', function(d) {
        return 'rgb(0,0,'+ d +' )';
      });
  }

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
