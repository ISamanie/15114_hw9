// tests/scoring.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import { timeToMinutes } from "../logic.mjs";


test("Check that 4:20 translates to 260 minutes", () => {
  assert.equal(timeToMinutes("04:20"), 260);
});

test("Check that 0:00 translates to 0 minutes", () => {
  assert.equal(timeToMinutes("00:00"), 0);
});

test("Check that an invalid time does not translate properly", () => {
  assert.throws(() => timeToMinutes("00:99"), RangeError);
});

