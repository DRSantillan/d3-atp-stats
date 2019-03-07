import $ from 'jQuery';
import ViewController from './modules/ViewController'

var viewController = new ViewController();

let playerData = $(".charts--player-data");
let playerPerData = $(".charts--player-performance");
playerData.addClass("charts--hidden");
playerPerData.addClass("charts--hidden");

