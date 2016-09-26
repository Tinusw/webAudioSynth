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


  masterGain.connect(context.destination);
  
  // State that will save global variables and levels
  var STATE = {
    volume: 0.8,
    melody: function() {}
  }

  // Initial State
  masterGain.gain.value = STATE.volume;
  console.log(masterGain.gain.value);

  // Function to alter Master Volume
  function changeMasterVolume(volume) {
    STATE.volume = volume;
  }
  
  // Listener for MasterVolume
  var MasterVolume = document.getElementById("volume");

  MasterVolume.addEventListener("change", function(){
    changeMasterVolume(this.value);
    masterGain.gain.value = this.value;

  });

  var oscillators = {};

  // Keydown Event
  keyboard.keyDown = function (note, frequency) {
      // create our two oscilators
      var oscillator = context.createOscillator();
      oscillator.type = 'sawtooth';
      oscillator.frequency.value = frequency;
      oscillator.detune.value = -10;
      oscillator.connect(masterGain);
      oscillator.start(context.currentTime);

      var oscillator2 = context.createOscillator();
      oscillator2.type = 'sawtooth';
      oscillator2.frequency.value = frequency;
      oscillator2.detune.value = 10;
      oscillator2.connect(masterGain);
      oscillator2.start(context.currentTime);

      oscillators[frequency] = [oscillator, oscillator2];

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
