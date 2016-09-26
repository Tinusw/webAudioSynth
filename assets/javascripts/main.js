// Browser Compatibility
window.AudioContext = window.AudioContext || window.webkitAudioContext;

  var context = new AudioContext(),
      settings = {
          id: 'keyboard',
          width: 600,
          height: 150,
          startNote: 'A2',
          whiteNotesColour: '#fff',
          blackNotesColour: '#000',
          borderColour: '#000',
          activeColour: 'yellow',
          octaves: 2
      },
      keyboard = new QwertyHancock(settings);

  masterGain = context.createGain();
  nodes = [];

  // init LP and HP filters
  var filter = context.createBiquadFilter();
  filter.type = "lowpass";
  var filter2 = context.createBiquadFilter();
  filter2.type = "highpass";

  // Create our analyser
  var analyser = context.createAnalyser();
  analyser.smoothingTimeConstant = 0.3;
  analyser.fftSize = 1024;
  // Don't know why visualiser needs this var
  var ctx;
  var fbc_array, bars, bar_x, bar_width, bar_height;
  
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

  function frameLooper(){
    window.webkitRequestAnimationFrame(frameLooper);
    // varialbes that our analyser will use
    fbc_array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(fbc_array);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00CCFF';
    bars = 250;
    // Loop that build spectrum
    for (var i = 0; i < bars; i++) {
      bar_x = i * 3;
      bar_width = 2;
      bar_height = -(fbc_array[i] / 2);
      ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
    }
  }

  var oscillators = {};

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
      // Visualiser stuff
      var canvas = document.getElementById("canvas");
      ctx = canvas.getContext('2d');
      // And connect Signal Path
      filter2.connect(analyser);
      analyser.connect(masterGain);
      masterGain.connect(context.destination);

      frameLooper();
  };

  // KeyUp or stop note event
  keyboard.keyUp = function (note, frequency) {
      oscillators[frequency].forEach(function(oscillator){
        oscillator.stop(context.currentTime)
      });
  };
;




// function changeVolume(volume) {
//   STATE.volume = volume
// }

// function applyVolumeToAmp(amp, startTime, duration) {
//   amp.gain.value = STATE.volume;
//   // Fade out
//   amp.gain.setValueAtTime(STATE.volume, startTime + duration - 0.800);
//   amp.gain.linearRampToValueAtTime(0.0, startTime + duration);  
// }

// function setupVolumeListener(amp, startTime, duration) {
//   //TODO: remove the old listeners before addin this one
//   document.getElementById('volume').addEventListener('change', function() {
//     changeVolume(this.value)
//     applyVolumeToAmp(amp, startTime, duration)
//   })
// }

// // Play OSC at certain frequency and for a certain time
// var playNote = function(frequency, startTime, duration){
//   // Create OSC & volume
  
//   var amp = context.createGain();

//   // default Amp level
//   amp.gain.value = 0.2;

//   // Create a basic LP filter
//   var filter = context.createBiquadFilter();
//   filter.type = 0;
//   filter.frequency.value = 500;
//   filter.Q.value = 0;

//   // Set Oscillator shapes
//   osc1.type = 'sawtooth';
//   osc2.type = 'sawtooth';

//   // set up nodes so we route osc through volume
//   osc1.connect(filter);
//   osc2.connect(filter);

//   filter.connect(amp);
//   amp.connect(context.destination);
//   // and to analyser
//   amp.connect(analyser)
//   analyser.getByteTimeDomainData(dataArray);

//   // Alter frequency for each OSC independently, chorus effect
//   osc1.frequency.value = frequency + 1;
//   osc2.frequency.value = frequency - 2;

//   applyVolumeToAmp(amp, startTime, duration)
//   setupVolumeListener(amp, startTime, duration)
  

//   // Start the Oscillator now
//   osc1.start(startTime);
//   osc2.start(startTime);

//   // Stop the Oscillator after 3 sec
//   osc1.stop(startTime + duration);
//   osc2.stop(startTime + duration);
// };

// document.addEventListener('DOMContentLoaded', function() {
//   var osc1 = context.createOscillator();
//   var osc2 = context.createOscillator();
//   var amp = context.createGain();

//   var keyboard = new QwertyHancock({
//                  id: 'keyboard',
//                  width: 600,
//                  height: 150,
//                  octaves: 2,
//                  startNote: 'A3',
//                  whiteNotesColour: 'white',
//                  blackNotesColour: 'black',
//                  hoverColour: '#f3e939'
//             });

//   keyboard.keyDown = function (note, frequency) {
    

//     // default Amp level
//     // amp.gain.value = 0.2;

//     // Create a basic LP filter
//     osc1.connect(amp);
//     osc2.connect(amp);

//     amp.connect(context.destination)
//     osc1.start(0);
//     osc2.start(0);

//     nodes.push(oscillator)
//   };

//   keyboard.keyUp = function (note, frequency) {
//     var new_nodes = [];
//     osc1.stop(0);
//     osc2.stop(0);

//     for (var i = 0; i < nodes.length; i++) {
//         if (Math.round(nodes[i].frequency.value) === Math.round(frequency)) {
//             nodes[i].stop(0);
//             nodes[i].disconnect();
//         } else {
//             new_nodes.push(nodes[i]);
//         }
//     }

//     nodes = new_nodes;
//   };



//   document.getElementById("click").addEventListener('click', function(){
//     playNote(493.883, context.currentTime, 1.000);
//     playNote(659.255, context.currentTime + 0.300, 1.000);
//     playNote(987.77, context.currentTime + 0.650, 1.000);
//     playNote(880.00, context.currentTime + 1.000, 1.000);
//     playNote(830.61, context.currentTime + 1.500, 1.000);
//   });

// });
