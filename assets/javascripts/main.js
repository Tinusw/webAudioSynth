var context = new AudioContext();


// Play OSC at certain frequency and for a certain time
var playNote = function(frequency, startTime, duration){
  // Create OSC & volume
  var osc1 = context.createOscillator();
  var osc2 = context.createOscillator();
  var volume = context.createGain();

  // Create a basic LP filter
  var filter = context.createBiquadFilter();
  filter.type = 0;
  filter.frequency.value = 2000;
  filter.Q.value = 0;

  // Volume scaled to 8/10ths of total gain
  volume.gain.value = 0.4;

  // Set Oscillator shapes
  osc1.type = 'sawtooth';
  osc2.type = 'sawtooth';

  // set up nodes so we route osc through volume
  osc1.connect(filter);
  osc2.connect(filter);

  filter.connect(volume);
  volume.connect(context.destination);

  // Alter frequency for each OSC independently, chorus effect
  osc1.frequency.value = frequency + 1;
  osc2.frequency.value = frequency - 2;

  // Fade out
  volume.gain.setValueAtTime(0.4, startTime + duration - 0.800);
  volume.gain.linearRampToValueAtTime(0.0, startTime + duration);

  // Start the Oscillator now
  osc1.start(startTime);
  osc2.start(startTime);

  // Stop the Oscillator after 3 sec
  osc1.stop(startTime + duration);
  osc2.stop(startTime + duration);
};

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("click").addEventListener('click', function(){
    playNote(493.883, context.currentTime, 1.000);
    playNote(659.255, context.currentTime + 0.300, 1.000);
    playNote(987.77, context.currentTime + 0.650, 1.000);
    playNote(880.00, context.currentTime + 1.000, 1.000);
    playNote(830.61, context.currentTime + 1.500, 1.000);
  });

  document.getElementById("A").addEventListener('click', function(){
    playNote(440, context.currentTime, 1.000);
  });

  document.getElementById("A#").addEventListener('click', function(){
    playNote(466.16, context.currentTime, 1.000);
  });

  document.getElementById("B").addEventListener('click', function(){
    playNote(493.88, context.currentTime, 1.000);
  });

  document.getElementById("C").addEventListener('click', function(){
    playNote(523.25, context.currentTime, 1.000);
  });

  document.getElementById("C#").addEventListener('click', function(){
    playNote(554.37, context.currentTime, 1.000);
  });

  document.getElementById("D").addEventListener('click', function(){
      playNote(587.33, context.currentTime, 1.000);
    });

  document.getElementById("D#").addEventListener('click', function(){
      playNote(622.25, context.currentTime, 1.000);
    });

  document.getElementById("E").addEventListener('click', function(){
      playNote(659.25, context.currentTime, 1.000);
    });

  document.getElementById("F").addEventListener('click', function(){
      playNote(698.46, context.currentTime, 1.000);
    });

  document.getElementById("F#").addEventListener('click', function(){
      playNote(739.99, context.currentTime, 1.000);
    });

  document.getElementById("G").addEventListener('click', function(){
      playNote(783.99, context.currentTime, 1.000);
    });

  document.getElementById("G#").addEventListener('click', function(){
      playNote(830.61, context.currentTime, 1.000);
    });
});
