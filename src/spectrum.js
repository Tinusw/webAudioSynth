import * as d3 from "d3";
import { analyser } from "./content.js"
import {setDivHeight} from "./utilities.js"
// visuals
var frequencyData = new Uint8Array(255);
// append an svg element with the correct size
function createSVG(parent, height, width){
  return d3.select(parent)
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .attr('id', 'canvas')
}

function throttle (callback, limit) {
    var wait = false;
    return function () {
        if (!wait) {
            callback.call();
            wait = true;
            setTimeout(function () {
                wait = false;
            }, limit);
        }
    }
}

function throlledFun(){
  window.Animation = window.requestAnimationFrame(renderChart);
  // copy freq data to freqData array
  analyser.getByteFrequencyData(frequencyData);
}

// loop and update chart with frequency data
function renderChart() {
  throttle(throlledFun(), 250);
  var height = document.getElementById('spectrum-analyser').offsetHeight;
  var svg = d3.select(document.getElementById('canvas'))

  // Update d3 chart with data
  svg.selectAll('rect').data(frequencyData)
    .attr('y', function(d) {
      return height - d;
    })
    .attr('height', function(d) {
      return d;
    })
    .attr('fill', function(d) {
      return 'rgb(217,82,'+ d +' )';
    });
}

document.addEventListener("DOMContentLoaded", function(event) {
  setDivHeight()
  var width = document.getElementById('spectrum-analyser').offsetWidth;
  var height = document.getElementById('spectrum-analyser').offsetHeight;
  var svg = createSVG('#canvas', height, width);
  // Create our intial chart
  svg.selectAll('rect')
    .data(frequencyData)
    .enter().append('rect')
    .attr('transform', '')
    .transition().duration(100)
    .attr('x', function(d, i){
      return i * (width / frequencyData.length);
    })
  .attr('width', width / frequencyData.length);
});

// export function renderChart;
export {renderChart}
