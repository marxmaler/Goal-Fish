export function animateModalValue(modal, start, end, duration) {
  if (start === end) return;
  var range = end - start;
  var current = start;
  var increment = end > start ? 1 : -1;
  var stepTime = Math.abs(Math.floor(duration / range));
  var timer = setInterval(function () {
    current += increment;
    modal.innerHTML = `+${current}`;
    if (current == end) {
      clearInterval(timer);
    }
  }, stepTime);
}
