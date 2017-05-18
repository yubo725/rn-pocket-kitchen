var Dimensions = require('Dimensions');
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var scale = Dimensions.get('window').scale;

var global = {
  statePreload: 0,
  stateLoadSuccess: 1,
  stateLoadError: -1,
  key: '520520test',
  screenWidth: width,
  screenHeight: height,
  screenScale: scale,
  isEmpty: (str) => {
    return str === null || str === undefined || str === '';
  }
};

module.exports = {
  global: global
};
