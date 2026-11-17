import { expect, test } from "vitest";
import { users } from "@/test/fixtures";
import { sortUsersByName } from "./sortUsersByName";

test("ordena por nombre de la A a la Z, con tildes en su sitio, sin mutar la lista", () => {
  const original = [...users];

  expect(sortUsersByName(users).map((user) => user.name)).toEqual([
    "Clementine Bauch",
    "José Álvarez",
    "Leanne Graham",
    "Mrs. Dennis Schulist",
  ]);
  expect(users).toEqual(original);
});
