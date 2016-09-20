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
  osc1.type = 'ramp';
  osc2.type = 'ramp';

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

playNote(493.883, context.currentTime, 1.200);

playNote(659.255, context.currentTime + 0.300, 1.200);

playNote(987.77, context.currentTime + 0.650, 1.200);

