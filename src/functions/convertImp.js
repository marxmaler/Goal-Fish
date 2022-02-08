export function convertImp(importance) {
  const point = importance === "A" ? 5 : importance === "B" ? 3 : 1;
  return point;
}
