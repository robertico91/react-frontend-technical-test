import { expect, test } from "vitest";
import { parseUserId } from "./parseUserId";

test.each([
  ["1", 1],
  ["42", 42],
  ["0", null],
  ["-1", null],
  ["1.5", null],
  ["abc", null],
  ["1abc", null],
  ["", null],
  [undefined, null],
])("parseUserId(%j) → %j", (param, expected) => {
  expect(parseUserId(param)).toBe(expected);
});
