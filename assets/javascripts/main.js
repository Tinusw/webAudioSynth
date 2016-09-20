var context = new AudioContext();


// Play OSC at certain frequency and for a certain time
var playNote = function(frequency, startTime, duration){
  // Create OSC & volume
  var osc1 = context.createOscillator();
  var osc2 = context.createOscillator();
  var volume = context.createGain();

  // Volume scaled to 8/10ths of total gain
  volume.gain.value = 0.8;

  // Set Oscillator shapes
  osc1.type = 'triange';
  osc2.type = 'triangle';

  // set up nodes so we route osc through volume
  osc1.connect(volume);
  osc2.connect(volume);
  volume.connect(context.destination);

  // Alter frequency for each OSC independently, chorus effect
  osc1.frequency.value = frequency + 1;
  osc2.frequency.value = frequency - 2;

  // Fade out
  volume.gain.setValueAtTime(0.4, startTime + duration - 0.800);
  volume.gain.linearRampToValueAtTime(0, startTime + duration);

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
});
