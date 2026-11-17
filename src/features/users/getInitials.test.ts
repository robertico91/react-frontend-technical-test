import { expect, test } from "vitest";
import { getInitials } from "./getInitials";

test.each([
  ["Leanne Graham", "LG"],
  ["Mrs. Dennis Schulist", "DS"],
  ["Nicholas Runolfsdottir V", "NR"],
  ["josé  álvarez", "JÁ"],
  ["Cher", "C"],
  ["", ""],
])("getInitials(%j) → %j", (name, initials) => {
  expect(getInitials(name)).toBe(initials);
});
