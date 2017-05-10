import * as d3 from "d3";
import { analyser } from "./content.js"

// visuals
var frequencyData = new Uint8Array(255);
// Create our analyser and vars
var analyserDiv = document.getElementById("spectrum-analyser");
var divWidth = analyserDiv.clientWidth;
console.log(divWidth)
var divHeight = analyserDiv.clientHeight;

// Todo
// Review why I cannot use divHeight here
var svgHeight = 240;
// Todo
// Review why divWidth is returning a number bigger than the div
var svgWidth = divWidth - 100;

function createSvg(parent, height, width){
  return d3.select(parent).append('svg').attr('height', height).attr('width', width)
}

var svg = createSvg('#canvas', svgHeight, svgWidth);

svg.selectAll('rect')
  .data(frequencyData)
  .enter().append('rect')
  .attr('transform', '')
  .transition().duration(300)
  .attr('x', function(d, i){
    return i * (svgWidth / frequencyData.length);
  })
.attr('width',svgWidth / frequencyData.length);

// loop and update chart with frequency data
function renderChart() {
  requestAnimationFrame(renderChart);

  // copy freq data to freqData array
  analyser.getByteFrequencyData(frequencyData);

  // Update d3 chart with data
  svg.selectAll('rect').data(frequencyData)
    .attr('y', function(d) {
      return svgHeight -d;
    })
    .attr('height', function(d) {
      return d;
    })
    .attr('fill', function(d) {
      return 'rgb(0,0,'+ d +' )';
    });
}

// export function renderChart;
export {renderChart}
