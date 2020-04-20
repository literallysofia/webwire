export const conditions = new Map<string, Function>();
conditions.set("greater", greater);
conditions.set("less", less);
conditions.set("equals", equals);
conditions.set("not equal", not_equal);

function greater(a: number, b: number): boolean {
  return a > b;
}

function less(a: number, b: number): boolean {
  return a < b;
}

function equals(a: number, b: number): boolean {
  return a === b;
}

function not_equal(a: number, b: number): boolean {
  return a !== b;
}
