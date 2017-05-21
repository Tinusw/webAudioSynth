// Set the color change on the selected button
function setColor(e) {
  var status = e.classList.contains('active');
  e.classList.add(status ? 'inactive' : 'active');
  e.classList.remove(status ? 'active' : 'inactive');
}

// Toggle buttons that aren't clicked to inactive
function checkColors(arg){
  var buttons = document.getElementsByClassName(arg);
  for(var i = 0; i < buttons.length; i++) {
    if (buttons[i].classList.contains('active')) {
      setColor(buttons[i]);
    }
  }
}

// cycle through our octave buttons and add event listeners
// add hooks to color toggler
function findAndSetButtons(arg){
  var buttons = document.getElementsByClassName(arg);
  for(var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function(e){
      checkColors(arg)
      e = e || window.event;
      var target = e.target || e.srcElement
      var text = target.textContent || text.innerText;
      if (target.classList.contains('label')) {
        setColor(target.parentNode);
      } else {
        setColor(target)
      }
    })
  }
}

// Get the height of closest bootstrap element
// Steal height and apply it to the div that will contain our SVG
function setDivHeight(){
  var height = document.getElementById('filter').offsetHeight;
  var spectrum = document.getElementById('spectrum-analyser')
  height = height + 'px';
  spectrum.style.height= height;
}


document.addEventListener("DOMContentLoaded", function(event) {
  findAndSetButtons('switch1')
  findAndSetButtons('switch2')
});

// export function renderChart;
export { setDivHeight }
