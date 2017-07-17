// import { Tour } from "./bootstrap-tour.js"

// Set the color change on the selected button
function setColor(e) {
  var status = e.classList.contains("active");
  e.classList.add(status ? "inactive" : "active");
  e.classList.remove(status ? "active" : "inactive");
}

// Toggle buttons that aren't clicked to inactive
function checkColors(arg) {
  var buttons = document.getElementsByClassName(arg);
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].classList.contains("active")) {
      setColor(buttons[i]);
    }
  }
}

// cycle through our octave buttons and add event listeners
// add hooks to color toggler
function findAndSetButtons(arg) {
  var buttons = document.getElementsByClassName(arg);
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function(e) {
      checkColors(arg);
      e = e || window.event;
      var target = e.target || e.srcElement;
      var text = target.textContent || text.innerText;
      if (target.classList.contains("label")) {
        setColor(target.parentNode);
      } else {
        setColor(target);
      }
    });
  }
}

// Get the height of closest bootstrap element
// Steal height and apply it to the div that will contain our SVG
function setDivHeight() {
  var height = document.getElementById("filter").offsetHeight;
  var spectrum = document.getElementById("spectrum-analyser");
  height = height + "px";
  spectrum.style.height = height;
}

// Our little user tour of the synth
var tour = new Tour({
  steps: [
    {
      element: "#octNormal1",
      title: "Oscillator 1",
      content:
        "This is our first oscillator, you can pick between a variety of waveshapes, how loud you'd like the oscillator to be, and whether it should be pitched an octave up or down."
    },
    {
      element: "#octNormal2",
      title: "Oscillator 1",
      content:
        "This is our second oscillator, it has the same options as our first oscillator. Mix up your settings for some interesting sounds."
    },
    {
      element: "#filter",
      title: "Filter Section",
      content:
        "This is our filter section, you have sweepable high pass and low pass filters as well as a resonance setting for each of them. They'll help you sculpt a sound."
    },
    {
      element: "#spectrum-analyser",
      title: "Spectrum Analyser",
      content:
        "This area section visualises our audio in real time. It will display our audio frequencies from low end to high end."
    },
    {
      element: "#delayPad",
      title: "Delay Effect",
      content:
        "This is a delay pad, similar to the popular kaossilator pads. Moving the dot along either axis will influence how prominent the delay effect is. The X axis controls our delay time, while the Y axis controlls how loud the feedback is, and therefore how long it will be."
    },
    {
      element: "#distortionPad",
      title: "Distortion Effect",
      content:
        "This is a distortion pad which works much the same way as our delay pad. The X axis controls how much distortion we add to the signal, while the Y axis is what I'd like to call the random filter, it's meant to be sweeped while you play ;)"
    },
    {
      element: "#volume",
      title: "Master Volume",
      content:
        "We have volume controls for both oscillators, as well as a distortion that might make things loud. Use the master volume to keep everything under control"
    },
    {
      element: "#keyboard-container",
      title: "Keyboard",
      content:
        "Lastly we have the all too familiar keyboard for playing notes. You can also controller it with your computers keyboard. Oh and the synthesizer is polyphonic. ENJOY"
    }
  ],
  debug: true,
  storage: false,
  smartPlacement: true,
  backdrop: true,
  backdropContainer: "body"
});

document.addEventListener("DOMContentLoaded", function(event) {
  findAndSetButtons("switch1");
  findAndSetButtons("switch2");
  tour.init();
  var tutorial = document.getElementById("tutorial");
  tutorial.addEventListener("click", function() {
    tour.start();
  });
});

// export function renderChart;
export { setDivHeight };
