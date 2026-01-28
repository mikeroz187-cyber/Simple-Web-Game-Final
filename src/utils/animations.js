/**
 * Animation utilities for Studio Empire
 * Vanilla JS — no dependencies
 */

// ============================================
// NUMBER COUNTING ANIMATION
// ============================================

/**
 * Animate a number counting up or down
 * @param {HTMLElement} element - Element to update
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {number} duration - Animation duration in ms
 * @param {function} formatter - Optional formatter function
 */
function animateNumber(element, start, end, duration, formatter) {
  if (!element) return;
  duration = duration || 500;
  formatter = formatter || function(n) { return n.toString(); };

  var startTime = null;
  var range = end - start;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function update(currentTime) {
    if (!startTime) startTime = currentTime;
    var elapsed = currentTime - startTime;
    var progress = Math.min(elapsed / duration, 1);
    var easedProgress = easeOutCubic(progress);
    var currentValue = Math.round(start + range * easedProgress);

    element.textContent = formatter(currentValue);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/**
 * Animate currency value
 */
function animateCurrency(element, start, end, duration) {
  animateNumber(element, start, end, duration, function(n) {
    return '$' + n.toLocaleString();
  });
}

/**
 * Animate a plain number with commas
 */
function animateCount(element, start, end, duration) {
  animateNumber(element, start, end, duration, function(n) {
    return n.toLocaleString();
  });
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

var toastQueue = [];
var toastActive = false;

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {string} type - 'success', 'error', 'warning', 'info'
 * @param {number} duration - How long to show (ms)
 */
function showToast(message, type, duration) {
  type = type || 'info';
  duration = duration || 3000;

  toastQueue.push({ message: message, type: type, duration: duration });
  processToastQueue();
}

function processToastQueue() {
  if (toastActive || toastQueue.length === 0) return;

  toastActive = true;
  var toast = toastQueue.shift();

  var container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  var icons = {
    success: '🎉',
    error: '❌',
    warning: '⚠️',
    info: '💡',
    money: '💰',
    unlock: '🔓',
    star: '⭐'
  };

  var toastEl = document.createElement('div');
  toastEl.className = 'toast toast--' + toast.type;
  toastEl.innerHTML = '<span class="toast__icon">' + (icons[toast.type] || icons.info) + '</span>' +
    '<span class="toast__message">' + toast.message + '</span>';

  container.appendChild(toastEl);

  // Trigger animation
  requestAnimationFrame(function() {
    toastEl.classList.add('toast--visible');
  });

  // Remove after duration
  setTimeout(function() {
    toastEl.classList.remove('toast--visible');
    toastEl.classList.add('toast--hiding');

    setTimeout(function() {
      if (toastEl.parentNode) {
        toastEl.parentNode.removeChild(toastEl);
      }
      toastActive = false;
      processToastQueue();
    }, 300);
  }, toast.duration);
}

// ============================================
// VALUE CHANGE FLASH
// ============================================

/**
 * Flash an element to indicate value changed
 * @param {HTMLElement} element - Element to flash
 * @param {string} type - 'positive' or 'negative'
 */
function flashValueChange(element, type) {
  if (!element) return;

  var className = type === 'positive' ? 'flash-positive' : 'flash-negative';
  element.classList.add(className);

  setTimeout(function() {
    element.classList.remove(className);
  }, 600);
}

// ============================================
// SCREEN TRANSITIONS
// ============================================

/**
 * Transition to a new screen with animation
 * @param {string} screenId - ID of screen to show
 */
function transitionToScreen(screenId) {
  var screens = document.querySelectorAll('.screen');
  var targetScreen = document.getElementById(screenId);

  if (!targetScreen) return;

  // Find currently active screen
  var activeScreen = document.querySelector('.screen.is-active');

  if (activeScreen && activeScreen.id !== screenId) {
    // Fade out current
    activeScreen.classList.add('screen--exiting');

    setTimeout(function() {
      activeScreen.classList.remove('is-active', 'screen--exiting');

      // Fade in new
      targetScreen.classList.add('is-active', 'screen--entering');

      requestAnimationFrame(function() {
        targetScreen.classList.remove('screen--entering');
      });
    }, 150);
  } else if (!activeScreen) {
    targetScreen.classList.add('is-active');
  }
}

// ============================================
// STAGGERED ENTRANCE ANIMATIONS
// ============================================

/**
 * Animate children with staggered entrance
 * @param {HTMLElement} container - Parent container
 * @param {string} childSelector - CSS selector for children
 * @param {number} staggerDelay - Delay between each child (ms)
 */
function staggerEntrance(container, childSelector, staggerDelay) {
  if (!container) return;
  staggerDelay = staggerDelay || 50;

  var children = container.querySelectorAll(childSelector);
  children.forEach(function(child, index) {
    child.style.opacity = '0';
    child.style.transform = 'translateY(10px)';

    setTimeout(function() {
      child.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      child.style.opacity = '1';
      child.style.transform = 'translateY(0)';
    }, index * staggerDelay);
  });
}

// ============================================
// PULSE ANIMATION
// ============================================

/**
 * Pulse an element to draw attention
 * @param {HTMLElement} element - Element to pulse
 */
function pulseElement(element) {
  if (!element) return;

  element.classList.add('pulse');

  setTimeout(function() {
    element.classList.remove('pulse');
  }, 600);
}

// ============================================
// TRACK PREVIOUS VALUES FOR ANIMATION
// ============================================

var previousValues = {};

/**
 * Store a value for comparison
 */
function setPreviousValue(key, value) {
  previousValues[key] = value;
}

/**
 * Get previous value
 */
function getPreviousValue(key) {
  return previousValues[key];
}

/**
 * Check if value changed and animate if so
 */
function animateIfChanged(key, newValue, element, formatter, flashElement) {
  var oldValue = getPreviousValue(key);

  if (oldValue !== undefined && oldValue !== newValue && element) {
    // Animate the number
    if (formatter) {
      animateNumber(element, oldValue, newValue, 500, formatter);
    }

    // Flash indicator
    if (flashElement) {
      var type = newValue > oldValue ? 'positive' : 'negative';
      flashValueChange(flashElement, type);
    }
  } else if (element && formatter) {
    element.textContent = formatter(newValue);
  }

  setPreviousValue(key, newValue);
}
