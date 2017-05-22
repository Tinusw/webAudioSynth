## Web Synth with Webpack, D3.js & the Web Audio API

This is a little synthesizer with:
- Polyphonic playable keyboard
- Two oscillators with:
  - sawtooth
  - sine
  - triagle
  - square
- By default oscillator 2 will be on the same octave as Oscillator 1, but can be shifted up, or down an octave.
- Lowpass filter with resonance
- Highpass filter with resonance
- An effects section with 2 X-Y pads:
  - A delay circuit (feedback is slightly filtered)
    - X axis controls feedback time
    - Y axis controls feedback volume
  - A distortion circuit
    - X axis controls the distortion curve
    - Y axis is in progress.
- A spectrum analyser that will give real-time output.
- It also has a mini tutorial built using [bootstrap-tour](http://bootstraptour.com/api/).

## Setting the project up & running it.

The project is bundled using webpack, so to get started run

`npm install`

`webpack-dev-server --progress --colors`

then check out `localhost:8080`
