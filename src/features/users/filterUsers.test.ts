import { describe, expect, test } from "vitest";
import { users } from "@/test/fixtures";
import { filterUsers } from "./filterUsers";

const names = (search: string) => filterUsers(users, search).map((user) => user.name);

describe("filterUsers", () => {
  test("filtra por nombre sin distinguir mayúsculas", () => {
    expect(names("LEAN")).toEqual(["Leanne Graham"]);
  });

  test("no distingue tildes ni en la búsqueda ni en el nombre", () => {
    expect(names("jose alvarez")).toEqual(["José Álvarez"]);
    expect(names("LEÁN")).toEqual(["Leanne Graham"]);
  });

  test("una búsqueda vacía o de espacios devuelve todos, en el mismo orden", () => {
    expect(filterUsers(users, "")).toEqual(users);
    expect(filterUsers(users, "   ")).toEqual(users);
  });

  test("ignora los espacios de los extremos", () => {
    expect(names("  bauch ")).toEqual(["Clementine Bauch"]);
  });

  test("sin coincidencias devuelve una lista vacía", () => {
    expect(names("zzz")).toEqual([]);
  });
});
