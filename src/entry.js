import _ from 'lodash';
import 'jquery';
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
require('bootstrap-loader');
require("./content.js")
require("./style.css");


function component () {
  var body = document.createElement('col-lg-12');
  return body;
}

document.body.appendChild(component());
