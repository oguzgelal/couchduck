import assert from "node:assert/strict";
import { pillNeighbors } from "./pill-grid.ts";

const pill = (tag, x, y, width = 100) => ({ tag, x, y, width });
const DONE = 99;

const neighbors = pillNeighbors(
  [pill(1, 0, 0), pill(2, 120, 0), pill(3, 240, 0), pill(4, 0, 80, 300), pill(5, 320, 80)],
  DONE,
);

assert.deepEqual(neighbors.get(1), { nextFocusUp: undefined, nextFocusDown: 4, nextFocusLeft: 5, nextFocusRight: undefined });
assert.equal(neighbors.get(3)?.nextFocusRight, 4);
assert.equal(neighbors.get(3)?.nextFocusDown, 5);
assert.equal(neighbors.get(4)?.nextFocusLeft, 3);
assert.equal(neighbors.get(4)?.nextFocusUp, 2);
assert.equal(neighbors.get(4)?.nextFocusDown, DONE);
assert.equal(neighbors.get(5)?.nextFocusRight, 1);
assert.equal(neighbors.get(5)?.nextFocusDown, DONE);

console.log("pill-grid ok");
