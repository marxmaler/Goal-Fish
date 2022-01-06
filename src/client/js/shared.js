export function manualSubmit(form) {
  form.submit();
}

export function preventSubmit(event) {
  event.preventDefault();
}

export function timeFormat(time) {
  return String(time).padStart(2, "0");
}

export const calculateProgress = (
  progress,
  progressPoint,
  checkedCnt,
  checkboxCnt
) => {
  progress.value = (checkedCnt / checkboxCnt) * 100;
  progressPoint.innerText = `${Math.round((checkedCnt / checkboxCnt) * 100)}%`;
};
