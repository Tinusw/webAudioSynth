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
          activeColour: 'orange',
          octaves: 3
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
    // Visualiser stuff
    var canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    // varialbes that our analyser will use
    fbc_array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(fbc_array);
    ctx.beginPath();
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
    ctx.closePath();
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