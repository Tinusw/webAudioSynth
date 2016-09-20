var audioContext = new AudioContext();

var context = new AudioContext(),
    oscillator = context.createOscillator();

// Connect Oscillator to our speakers
oscillator.connect(context.destination);

// Start the Oscillator now
oscillator.start(context.currentTime);

// Stop the Oscillator after 3 sec
oscillator.stop(context.currentTime + 3);