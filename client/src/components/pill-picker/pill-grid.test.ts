import assert from "node:assert/strict";
import { pillNeighbors } from "./pill-grid";

const pill = (tag: number, x: number, y: number, width = 100) => ({ tag, x, y, width });

const neighbors = pillNeighbors([
  pill(1, 0, 0),
  pill(2, 120, 0),
  pill(3, 240, 0),
  pill(4, 0, 80, 300),
  pill(5, 320, 80),
]);

assert.deepEqual(neighbors.get(1), { nextFocusUp: undefined, nextFocusDown: 4, nextFocusLeft: undefined, nextFocusRight: undefined });
assert.equal(neighbors.get(3)?.nextFocusRight, 4);
assert.equal(neighbors.get(3)?.nextFocusDown, 5);
assert.equal(neighbors.get(4)?.nextFocusLeft, 3);
assert.equal(neighbors.get(4)?.nextFocusUp, 2);
assert.equal(neighbors.get(5)?.nextFocusRight, undefined);
assert.equal(neighbors.get(5)?.nextFocusDown, undefined);

console.log("pill-grid ok");
