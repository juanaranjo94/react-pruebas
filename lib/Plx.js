'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _bezierEasing = require('bezier-easing');

var _bezierEasing2 = _interopRequireDefault(_bezierEasing);

var _windowScrollManager = require('window-scroll-manager');

var _windowScrollManager2 = _interopRequireDefault(_windowScrollManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Check if code is running in the browser (important for universal rendering)
var WINDOW_EXISTS = typeof window !== 'undefined';

// Regex that checks for numbers in string
// formatted as "{number}{unit}" where unit is "px", "vh", "%" or none
var START_END_DURATION_REGEX = /^-?\d+(\.\d+)?(px|vh|%)?$/;

var DEFAULT_UNIT = 'px';
var DEFAULT_ANGLE_UNIT = 'deg';
var ANGLE_PROPERTIES = ['rotate', 'rotateX', 'rotateY', 'rotateZ', 'skew', 'skewX', 'skewY', 'skewZ', 'hueRotate'];

var EASINGS = {
  ease: [0.25, 0.1, 0.25, 1.0],
  easeIn: [0.42, 0.0, 1.00, 1.0],
  easeOut: [0.00, 0.0, 0.58, 1.0],
  easeInOut: [0.42, 0.0, 0.58, 1.0],
  easeInSine: [0.47, 0, 0.745, 0.715],
  easeOutSine: [0.39, 0.575, 0.565, 1],
  easeInOutSine: [0.445, 0.05, 0.55, 0.95],
  easeInQuad: [0.55, 0.085, 0.68, 0.53],
  easeOutQuad: [0.25, 0.46, 0.45, 0.94],
  easeInOutQuad: [0.455, 0.03, 0.515, 0.955],
  easeInCubic: [0.55, 0.055, 0.675, 0.19],
  easeOutCubic: [0.215, 0.61, 0.355, 1],
  easeInOutCubic: [0.645, 0.045, 0.355, 1],
  easeInQuart: [0.895, 0.03, 0.685, 0.22],
  easeOutQuart: [0.165, 0.84, 0.44, 1],
  easeInOutQuart: [0.77, 0, 0.175, 1],
  easeInQuint: [0.755, 0.05, 0.855, 0.06],
  easeOutQuint: [0.23, 1, 0.32, 1],
  easeInOutQuint: [0.86, 0, 0.07, 1],
  easeInExpo: [0.95, 0.05, 0.795, 0.035],
  easeOutExpo: [0.19, 1, 0.22, 1],
  easeInOutExpo: [1, 0, 0, 1],
  easeInCirc: [0.6, 0.04, 0.98, 0.335],
  easeOutCirc: [0.075, 0.82, 0.165, 1],
  easeInOutCirc: [0.785, 0.135, 0.15, 0.86]
};

// Color regexes

// 0 - 199 | 200 - 249 | 250 - 255
var REGEX_0_255 = '(1?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])';
// 0.0 - 1.9999...
var REGEX_0_1 = '([01](\\.\\d+)?)';
// 00 - FF
var REGEX_TWO_HEX_DIGITS = '([a-f\\d]{2})';

var HEX_REGEX = new RegExp('^#' + REGEX_TWO_HEX_DIGITS + REGEX_TWO_HEX_DIGITS + REGEX_TWO_HEX_DIGITS + '$', 'i');
var RGB_REGEX = new RegExp('^rgb\\(' + REGEX_0_255 + ',' + REGEX_0_255 + ',' + REGEX_0_255 + '\\)$', 'i');
var RGBA_REGEX = new RegExp('^rgba\\(' + REGEX_0_255 + ',' + REGEX_0_255 + ',' + REGEX_0_255 + ',' + REGEX_0_1 + '\\)$', 'i');

var SCROLL_OFFSET = 50;

var RESIZE_DEBOUNCE_TIMEOUT = 150;

// CSS transform map
var TRANSFORM_MAP = {
  rotate: function rotate(value) {
    var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_ANGLE_UNIT;
    return 'rotate(' + value + unit + ')';
  },
  rotateX: function rotateX(value) {
    var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_ANGLE_UNIT;
    return 'rotateX(' + value + unit + ')';
  },
  rotateY: function rotateY(value) {
    var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_ANGLE_UNIT;
    return 'rotateY(' + value + unit + ')';
  },
  rotateZ: function rotateZ(value) {
    var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_ANGLE_UNIT;
    return 'rotateZ(' + value + unit + ')';
  },
  scale: function scale(value) {
    return 'scale(' + value + ')';
  },
  scaleX: function scaleX(value) {
    return 'scaleX(' + value + ')';
  },
  scaleY: function scaleY(value) {
    return 'scaleY(' + value + ')';
  },
  scaleZ: function scaleZ(value) {
    return 'scaleZ(' + value + ')';
  },
  skew: function skew(value) {
    var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_UNIT;
    return 'skew(' + value + unit + ')';
  },
  skewX: function skewX(value) {
    var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_UNIT;
    return 'skewX(' + value + unit + ')';
  },
  skewY: function skewY(value) {
    var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_UNIT;
    return 'skewY(' + value + unit + ')';
  },
  skewZ: function skewZ(value) {
    var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_UNIT;
    return 'skewZ(' + value + unit + ')';
  },
  translateX: function translateX(value) {
    var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_UNIT;
    return 'translateX(' + value + unit + ')';
  },
  translateY: function translateY(value) {
    var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_UNIT;
    return 'translateY(' + value + unit + ')';
  },
  translateZ: function translateZ(value) {
    var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_UNIT;
    return 'translateZ(' + value + unit + ')';
  }
};

// Order of CSS transforms matters
var ORDER_OF_TRANSFORMS = ['translateX', 'translateY', 'translateZ', 'skew', 'skewX', 'skewY', 'skewZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ'];

// CSS properties that use color values
var COLOR_PROPERTIES = ['backgroundColor', 'borderBottomColor', 'borderColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color', 'fill', 'stroke'];

// CSS filter map
// blur()
// brightness()
// contrast()
// grayscale()
// hue-rotate()
// invert()
// opacity() // use opacityFilter
// saturate()
// sepia()

// Not supported
// drop-shadow()
// url()
var FILTER_MAP = {
  blur: function blur(value) {
    var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_UNIT;
    return 'blur(' + value + unit + ')';
  },
  brightness: function brightness(value) {
    return 'brightness(' + value + ')';
  },
  contrast: function contrast(value) {
    return 'contrast(' + value + ')';
  },
  grayscale: function grayscale(value) {
    return 'grayscale(' + value + ')';
  },
  hueRotate: function hueRotate(value) {
    var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_ANGLE_UNIT;
    return 'hue-rotate(' + value + unit + ')';
  },
  invert: function invert(value) {
    return 'invert(' + value + ')';
  },
  opacityFilter: function opacityFilter(value) {
    return 'opacity(' + value + ')';
  },
  saturate: function saturate(value) {
    return 'saturate(' + value + ')';
  },
  sepia: function sepia(value) {
    return 'sepia(' + value + ')';
  }
};

var FILTER_PROPERTIES = ['blur', 'brightness', 'contrast', 'grayscale', 'hueRotate', 'invert', 'opacityFilter', 'saturate', 'sepia'];

// Props to be removed from passing directly to the component element
var PROPS_TO_OMIT = ['animateWhenNotInViewport', 'children', 'className', 'freeze', 'parallaxData', 'style', 'tagName', 'onPlxStart', 'onPlxEnd'];

// Get element's top offset
function getElementTop(el) {
  var top = 0;
  var element = el;

  do {
    top += element.offsetTop || 0;
    element = element.offsetParent;
  } while (element);

  return top;
}

// Returns CSS unit
function getUnit(property, unit) {
  var propertyUnit = unit || DEFAULT_UNIT;

  if (ANGLE_PROPERTIES.indexOf(property) >= 0) {
    propertyUnit = unit || DEFAULT_ANGLE_UNIT;
  }

  return propertyUnit;
}

// Takes string value (in px/vh/%) and returns number
function getValueInPx(value, maxScroll) {
  var floatValue = parseFloat(value);
  var unit = value.match(START_END_DURATION_REGEX)[2] || null;
  var vh = window.innerHeight / 100;
  var valueInPx = value;

  switch (unit) {
    case 'vh':
      valueInPx = vh * floatValue;
      break;
    case '%':
      valueInPx = maxScroll * floatValue / 100;
      break;
    default:
      valueInPx = floatValue;
  }

  return valueInPx;
}

// Takes start/end/duration props
// and return number (in pixels) based on prop type (number, string, dom element)
function convertPropToPixels(propName, propValue, maxScroll) {
  var offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  var propValueInPx = propValue;
  var isElement = propValue instanceof HTMLElement;
  var keyCodes = {
    ZERO: 48,
    NINE: 57
  };

  if (typeof propValue === 'number') {
    propValueInPx = propValue;
  } else if (START_END_DURATION_REGEX.test(propValue)) {
    propValueInPx = getValueInPx(propValue, maxScroll);
  } else if (isElement || typeof propValue === 'string' && (propValue.charCodeAt(0) < keyCodes.ZERO || propValue.charCodeAt(0) > keyCodes.NINE)) {
    var element = isElement ? propValue : document.querySelector(propValue);

    if (!element) {
      console.warn('Plx, ERROR: ' + propName + ' selector matches no elements: "' + propValue + '"'); // eslint-disable-line
      return null;
    }

    if (propName === 'start' || propName === 'end') {
      // START or END
      // Element enters the viewport
      propValueInPx = getElementTop(element) - window.innerHeight;
    } else if (propName === 'duration') {
      // DURATION
      // Height of the element
      propValueInPx = element.offsetHeight;
    }
  } else {
    console.warn('Plx, ERROR: "' + propValue + '" is not a valid ' + propName + ' value, check documenation'); // eslint-disable-line
    return null;
  }

  // Transform offset to px
  var offsetInPx = 0;

  if (typeof offset === 'number') {
    offsetInPx = offset;
  } else if (START_END_DURATION_REGEX.test(offset)) {
    offsetInPx = getValueInPx(offset, maxScroll);
  }
  // Add offset
  propValueInPx += offsetInPx;

  if (propValueInPx < 0) {
    propValueInPx = 0;
  }

  return propValueInPx;
}

// Convers color in hex format into object { r, g, b, a }
function hexToObject(hex) {
  // Convert #abc to #aabbcc
  var color = hex.length === 4 ? '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3] : hex;
  var result = HEX_REGEX.exec(color);

  // Safety check, if color is in the wrong format
  if (!result) {
    console.warn('Plx, ERROR: hex color is not in the right format: "' + hex + '"'); // eslint-disable-line no-console
    return null;
  }

  // All color functions are returning { r, g, b, a } object
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: 1
  };
}

// Convers color in rgb format into object { r, g, b, a }
function rgbToObject(rgb) {
  var isRgba = rgb.toLowerCase().indexOf('rgba') === 0;
  var color = rgb.replace(/ /g, '');
  var result = isRgba ? RGBA_REGEX.exec(color) : RGB_REGEX.exec(color);

  // Safety check, if color is in the wrong format
  if (!result) {
    console.warn('Plx, ERROR: rgb or rgba color is not in the right format: "' + rgb + '"'); // eslint-disable-line
    return null;
  }

  // All color functions are returning { r, g, b, a } object
  return {
    r: parseInt(result[1], 10),
    g: parseInt(result[2], 10),
    b: parseInt(result[3], 10),
    a: isRgba ? parseFloat(result[4]) : 1
  };
}

// Calculates the current value for parallaxing property
function parallax(scrollPosition, start, duration, startValue, endValue, easing) {
  var min = startValue;
  var max = endValue;
  var invert = startValue > endValue;

  // Safety check, if "startValue" is in the wrong format
  if (typeof startValue !== 'number') {
    console.warn('Plx, ERROR: startValue is not a number (type: "' + (typeof endValue === 'undefined' ? 'undefined' : _typeof(endValue)) + '", value: "' + endValue + '")'); // eslint-disable-line
    return null;
  }

  // Safety check, if "endValue" is in the wrong format
  if (typeof endValue !== 'number') {
    console.warn('Plx, ERROR: endValue is not a number (type: "' + (typeof endValue === 'undefined' ? 'undefined' : _typeof(endValue)) + '", value: "' + endValue + '")'); // eslint-disable-line
    return null;
  }

  // Safety check, if "duration" is in the wrong format
  if (typeof duration !== 'number' || duration === 0) {
    console.warn('Plx, ERROR: duration is zero or not a number (type: "' + (typeof duration === 'undefined' ? 'undefined' : _typeof(duration)) + '", value: "' + duration + '")'); // eslint-disable-line
    return null;
  }

  if (invert) {
    min = endValue;
    max = startValue;
  }

  var percentage = (scrollPosition - start) / duration;

  if (percentage > 1) {
    percentage = 1;
  } else if (percentage < 0) {
    percentage = 0;
  }

  // Apply easing
  if (easing) {
    var easingPropType = typeof easing === 'undefined' ? 'undefined' : _typeof(easing);
    if (easingPropType === 'object' && easing.length === 4) {
      percentage = (0, _bezierEasing2.default)(easing[0], easing[1], easing[2], easing[3])(percentage);
    } else if (easingPropType === 'string' && EASINGS[easing]) {
      percentage = (0, _bezierEasing2.default)(EASINGS[easing][0], EASINGS[easing][1], EASINGS[easing][2], EASINGS[easing][3])(percentage);
    } else if (easingPropType === 'function') {
      percentage = easing(percentage);
    }
  }

  var value = percentage * (max - min);

  if (invert) {
    value = max - value;
  } else {
    value += min;
  }

  return Math.floor(value * 100) / 100;
}

// Calculates current value for color parallax
function colorParallax(scrollPosition, start, duration, startValue, endValue, easing) {
  var startObject = null;
  var endObject = null;

  if (startValue[0].toLowerCase() === 'r') {
    startObject = rgbToObject(startValue);
  } else {
    startObject = hexToObject(startValue);
  }

  if (endValue[0].toLowerCase() === 'r') {
    endObject = rgbToObject(endValue);
  } else {
    endObject = hexToObject(endValue);
  }

  if (startObject && endObject) {
    var r = parallax(scrollPosition, start, duration, startObject.r, endObject.r, easing);
    var g = parallax(scrollPosition, start, duration, startObject.g, endObject.g, easing);
    var b = parallax(scrollPosition, start, duration, startObject.b, endObject.b, easing);
    var a = parallax(scrollPosition, start, duration, startObject.a, endObject.a, easing);

    return 'rgba(' + parseInt(r, 10) + ', ' + parseInt(g, 10) + ', ' + parseInt(b, 10) + ', ' + a + ')';
  }

  return null;
}

// Applies property parallax to the style object
function applyProperty(scrollPosition, propertyData, startPosition, duration, style, easing) {
  var startValue = propertyData.startValue,
      endValue = propertyData.endValue,
      property = propertyData.property,
      unit = propertyData.unit;

  // If property is one of the color properties
  // Use it's parallax method

  var isColor = COLOR_PROPERTIES.indexOf(property) > -1;
  var parallaxMethod = isColor ? colorParallax : parallax;

  // Get new CSS value
  var value = parallaxMethod(scrollPosition, startPosition, duration, startValue, endValue, easing);

  // Get transform function
  var transformMethod = TRANSFORM_MAP[property];
  var filterMethod = FILTER_MAP[property];
  var newStyle = style;

  if (transformMethod) {
    // Get CSS unit
    var propertyUnit = getUnit(property, unit);
    // Transforms, apply value to transform function
    newStyle.transform[property] = transformMethod(value, propertyUnit);
  } else if (filterMethod) {
    // Get CSS unit
    var _propertyUnit = getUnit(property, unit);
    // Filters, apply value to filter function
    newStyle.filter[property] = filterMethod(value, _propertyUnit);
  } else {
    // All other properties
    newStyle[property] = value;

    // Add unit if it is passed
    if (unit) {
      newStyle[property] += unit;
    }
  }

  return newStyle;
}

// Returns CSS classes based on animation state
function getClasses(lastSegmentScrolledBy, isInSegment, parallaxData) {
  var cssClasses = null;

  if (lastSegmentScrolledBy === null) {
    cssClasses = 'Plx--above';
  } else if (lastSegmentScrolledBy === parallaxData.length - 1 && !isInSegment) {
    cssClasses = 'Plx--below';
  } else if (lastSegmentScrolledBy !== null && isInSegment) {
    var segmentName = parallaxData[lastSegmentScrolledBy].name || lastSegmentScrolledBy;

    cssClasses = 'Plx--active Plx--in Plx--in-' + segmentName;
  } else if (lastSegmentScrolledBy !== null && !isInSegment) {
    var _segmentName = parallaxData[lastSegmentScrolledBy].name || lastSegmentScrolledBy;
    var nextSegmentName = parallaxData[lastSegmentScrolledBy + 1].name || lastSegmentScrolledBy + 1;

    cssClasses = 'Plx--active Plx--between Plx--between-' + _segmentName + '-and-' + nextSegmentName;
  }

  return cssClasses;
}

// Checks if class contains 'active'
function checkIfActive(classes) {
  return classes.indexOf('Plx--active') > -1;
}

// Omits "keysToOmit" from "object"
function omit(object, keysToOmit) {
  var result = {};

  Object.keys(object).forEach(function (key) {
    if (keysToOmit.indexOf(key) === -1) {
      result[key] = object[key];
    }
  });

  return result;
}

// Main update function
// Returns new state object based on props and scroll position
function getNewState(scrollPosition, props, state, element) {
  var animateWhenNotInViewport = props.animateWhenNotInViewport,
      disabled = props.disabled,
      freeze = props.freeze,
      parallaxData = props.parallaxData;
  var showElement = state.showElement,
      plxStyle = state.plxStyle,
      plxStateClasses = state.plxStateClasses;

  // Do nothing if animation is disabled, frozen
  // or if element is not rendered yet

  if (freeze && showElement || !element || disabled) {
    return null;
  }

  // Check if element is in viewport
  // Small offset is added to prevent page jumping
  if (!animateWhenNotInViewport) {
    var rect = element.getBoundingClientRect();
    var isTopAboveBottomEdge = rect.top < window.innerHeight + SCROLL_OFFSET;
    var isBottomBelowTopEdge = rect.top + rect.height > -SCROLL_OFFSET;

    if (!isTopAboveBottomEdge || !isBottomBelowTopEdge) {
      return null;
    }
  }

  var newState = {};

  // Style to be applied to our element
  var newStyle = {
    transform: {},
    filter: {}
  };

  // This means "componentDidMount" did happen and that we should show our element
  if (!showElement) {
    newState.showElement = true;
  }

  var appliedProperties = [];
  var segments = [];
  var isInSegment = false;
  var lastSegmentScrolledBy = null;
  var bodyHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
  var maxScroll = bodyHeight - window.innerHeight;

  var _loop = function _loop(i) {
    var _parallaxData$i = parallaxData[i],
        duration = _parallaxData$i.duration,
        easing = _parallaxData$i.easing,
        endOffset = _parallaxData$i.endOffset,
        properties = _parallaxData$i.properties,
        startOffset = _parallaxData$i.startOffset;


    var start = parallaxData[i].start === 'self' ? element : parallaxData[i].start;
    var end = parallaxData[i].end === 'self' ? element : parallaxData[i].end;

    var startInPx = convertPropToPixels('start', start, maxScroll, startOffset);
    var durationInPx = null;
    var endInPx = null;

    // End has higher priority than duration
    if (typeof end !== 'undefined') {
      endInPx = convertPropToPixels('end', end, maxScroll, endOffset);
      durationInPx = endInPx - startInPx;
    } else {
      durationInPx = convertPropToPixels('duration', duration, maxScroll);
      endInPx = startInPx + durationInPx;
    }

    // If segment is below scroll position skip it
    if (scrollPosition < startInPx) {
      return 'break';
    }

    var isScrolledByStart = scrollPosition >= startInPx;

    if (isScrolledByStart) {
      lastSegmentScrolledBy = i;
    }

    // If active segment exists, apply his properties
    if (scrollPosition >= startInPx && scrollPosition <= endInPx) {
      isInSegment = true;

      properties.forEach(function (propertyData) {
        // eslint-disable-line no-loop-func
        var property = propertyData.property;

        // Save which properties are applied to the active segment
        // So they are not re-applied for other segments

        appliedProperties.push(property);

        // Apply property style
        newStyle = applyProperty(scrollPosition, propertyData, startInPx, durationInPx, newStyle, easing);
      });
    } else {
      // Push non active segments above the scroll position to separate array
      // This way "durationInPx" and "startInPx" are not calculated again
      // and segments below scroll position are skipped in the next step
      segments.push({
        easing: easing,
        durationInPx: durationInPx,
        properties: properties,
        startInPx: startInPx
      });
    }
  };

  for (var i = 0; i < parallaxData.length; i++) {
    var _ret = _loop(i);

    if (_ret === 'break') break;
  }

  // These are only segments that are completly above scroll position
  segments.forEach(function (data) {
    var easing = data.easing,
        durationInPx = data.durationInPx,
        properties = data.properties,
        startInPx = data.startInPx;


    properties.forEach(function (propertyData) {
      var property = propertyData.property;

      // Skip propery that was changed for active segment

      if (appliedProperties.indexOf(property) > -1) {
        return;
      }

      // These styles that are the ones changed by segments
      // that are above active segment
      newStyle = applyProperty(scrollPosition, propertyData, startInPx, durationInPx, newStyle, easing);
    });
  });

  // Sort transforms by ORDER_OF_TRANSFORMS
  // as order of CSS transforms matters
  var transformsOrdered = [];

  ORDER_OF_TRANSFORMS.forEach(function (transformKey) {
    if (newStyle.transform[transformKey]) {
      transformsOrdered.push(newStyle.transform[transformKey]);
    }
  });

  // Concat transforms and add webkit prefix
  newStyle.transform = transformsOrdered.join(' ');
  newStyle.WebkitTransform = newStyle.transform;

  var filtersArray = [];
  FILTER_PROPERTIES.forEach(function (filterKey) {
    if (newStyle.filter[filterKey]) {
      filtersArray.push(newStyle.filter[filterKey]);
    }
  });

  // Concat filters and add webkit prefix
  newStyle.filter = filtersArray.join(' ');
  newStyle.WebkitFilter = newStyle.filter;

  // "Stupid" check if style should be updated
  if (JSON.stringify(plxStyle) !== JSON.stringify(newStyle)) {
    newState.plxStyle = newStyle;
  }

  // Adding state class
  var newPlxStateClasses = getClasses(lastSegmentScrolledBy, isInSegment, parallaxData);

  if (newPlxStateClasses !== plxStateClasses) {
    newState.plxStateClasses = newPlxStateClasses;
  }

  if (Object.keys(newState).length) {
    return newState;
  }

  return null;
}

var Plx = function (_Component) {
  _inherits(Plx, _Component);

  function Plx(props) {
    _classCallCheck(this, Plx);

    // Binding handlers
    var _this = _possibleConstructorReturn(this, (Plx.__proto__ || Object.getPrototypeOf(Plx)).call(this));

    _this.handleScrollChange = _this.handleScrollChange.bind(_this);
    _this.handleResize = _this.handleResize.bind(_this);

    _this.state = {
      element: null,
      showElement: false,
      plxStateClasses: '',
      plxStyle: {}
    };

    // Skipping type checking as PropTypes will give a warning if the props aren't functions
    _this.plxStartEnabled = props.onPlxStart !== null;
    _this.plxEndEnabled = props.onPlxEnd !== null;
    return _this;
  }

  _createClass(Plx, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // Get scroll manager singleton
      this.scrollManager = new _windowScrollManager2.default();

      // Add listeners
      window.addEventListener('window-scroll', this.handleScrollChange);
      window.addEventListener('resize', this.handleResize);

      this.update();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var wasActive = checkIfActive(prevState.plxStateClasses);
      var isActive = checkIfActive(this.state.plxStateClasses);

      // Update only if props changed
      if (prevProps !== this.props) {
        this.update();
      }

      // Callbacks
      if ((this.plxStartEnabled || this.plxEndEnabled) && prevState.plxStateClasses !== this.state.plxStateClasses) {
        if (this.plxStartEnabled && !wasActive && isActive) {
          this.props.onPlxStart();
        } else if (this.plxEndEnabled && wasActive && !isActive) {
          this.props.onPlxEnd();
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('window-scroll', this.handleScrollChange);
      window.removeEventListener('resize', this.handleResize);

      clearTimeout(this.resizeDebounceTimeoutID);
      this.resizeDebounceTimeoutID = null;

      if (this.scrollManager) {
        this.scrollManager.removeListener();
      }
    }
  }, {
    key: 'update',
    value: function update() {
      var scrollPosition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var currentScrollPosition = scrollPosition === null ? this.scrollManager.getScrollPosition().scrollPositionY : scrollPosition;

      var newState = getNewState(currentScrollPosition, this.props, this.state, this.element);

      if (newState) {
        this.setState(newState);
      }
    }
  }, {
    key: 'handleResize',
    value: function handleResize() {
      var _this2 = this;

      clearTimeout(this.resizeDebounceTimeoutID);
      this.resizeDebounceTimeoutID = setTimeout(function () {
        _this2.update();
      }, RESIZE_DEBOUNCE_TIMEOUT);
    }
  }, {
    key: 'handleScrollChange',
    value: function handleScrollChange(e) {
      this.update(e.detail.scrollPositionY);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          children = _props.children,
          className = _props.className,
          disabled = _props.disabled,
          style = _props.style,
          tagName = _props.tagName;
      var _state = this.state,
          showElement = _state.showElement,
          plxStyle = _state.plxStyle,
          plxStateClasses = _state.plxStateClasses;


      var Tag = tagName;

      var elementStyle = style;

      if (!disabled) {
        elementStyle = _extends({}, style, plxStyle, {
          // Hide element before until it is rendered
          // This prevents jumps if page is scrolled and then refreshed
          visibility: showElement ? null : 'hidden'
        });
      }

      return _react2.default.createElement(
        Tag,
        _extends({}, omit(this.props, PROPS_TO_OMIT), {
          className: 'Plx ' + plxStateClasses + ' ' + className,
          style: elementStyle,
          ref: function ref(el) {
            return _this3.element = el;
          }
        }),
        children
      );
    }
  }]);

  return Plx;
}(_react.Component);

exports.default = Plx;


var propertiesItemType = _propTypes2.default.shape({
  startValue: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]).isRequired,
  endValue: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]).isRequired,
  property: _propTypes2.default.string.isRequired,
  unit: _propTypes2.default.string
});

// Check for the universal rendering
// HTMLElement in the proptypes breaks on server
// https://github.com/Stanko/react-plx/issues/25
var SafeHTMLElement = WINDOW_EXISTS ? window.HTMLElement : {};

var parallaxDataType = _propTypes2.default.shape({
  start: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number, _propTypes2.default.instanceOf(SafeHTMLElement)]).isRequired,
  startOffset: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  duration: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number, _propTypes2.default.instanceOf(SafeHTMLElement)]),
  end: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number, _propTypes2.default.instanceOf(SafeHTMLElement)]),
  endOffset: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  properties: _propTypes2.default.arrayOf(propertiesItemType).isRequired,
  easing: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array, _propTypes2.default.func]),
  name: _propTypes2.default.string
});

Plx.propTypes = {
  animateWhenNotInViewport: _propTypes2.default.bool,
  children: _propTypes2.default.any,
  className: _propTypes2.default.string,
  disabled: _propTypes2.default.bool,
  freeze: _propTypes2.default.bool,
  parallaxData: _propTypes2.default.arrayOf(parallaxDataType),
  style: _propTypes2.default.objectOf(_propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number, _propTypes2.default.object])),
  tagName: _propTypes2.default.string,
  onPlxStart: _propTypes2.default.func,
  onPlxEnd: _propTypes2.default.func
};

Plx.defaultProps = {
  animateWhenNotInViewport: false,
  children: null,
  className: '',
  disabled: false,
  freeze: false,
  parallaxData: [],
  style: {},
  tagName: 'div',
  onPlxStart: null,
  onPlxEnd: null
};