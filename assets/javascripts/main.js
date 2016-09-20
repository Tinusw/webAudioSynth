var context = new AudioContext();

// Create OSC & volume
var osc1 = context.createOscillator(),
    osc2 = context.createOscillator();
var volume = context.createGain();

// Volume scaled to 8/10ths of total gain
volume.gain.value = 0.8;

// Set Oscillator shapes
osc1.type = 'sine';
osc2.type = 'ramp';

// base frequency
var frequency = 493.883;

// set up nodes so we route osc through volume
osc1.connect(volume);
osc2.connect(volume);

// Alter frequency for each OSC independently, chorus effect
osc1.frequency.value = frequency + 1;
osc2.frequency.value = frequency - 2;

// Connect Oscillator to our speakers
volume.connect(context.destination);


var duration = 2;
var startTime = context.currentTime;

// Fade Out Effect
volume.gain.setValueAtTime(0.1, startTime + duration - 0.05);
volume.gain.linearRampToValueAtTime(0, startTime + duration);

// Start the Oscillator now
osc1.start(startTime);
osc2.start(startTime);

// Stop the Oscillator after 3 sec
osc1.stop(startTime + duration);
osc2.stop(startTime + duration);