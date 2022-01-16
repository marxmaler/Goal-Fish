export function manualSubmit(form) {
  form.submit();
}

export function preventSubmit(event) {
  event.preventDefault();
}

export function timeFormat(time) {
  return String(time).padStart(2, "0");
}

export function formSubmit(form) {
  form.submit();
}
