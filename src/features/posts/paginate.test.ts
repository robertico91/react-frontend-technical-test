import { describe, expect, test } from "vitest";
import { paginate } from "./paginate";

const items = [1, 2, 3, 4, 5, 6, 7];

describe("paginate", () => {
  test("devuelve la página pedida y el rango", () => {
    expect(paginate(items, 1, 5)).toEqual({
      items: [1, 2, 3, 4, 5],
      page: 1,
      totalPages: 2,
      from: 1,
      to: 5,
      total: 7,
    });
  });

  test("la última página puede estar incompleta", () => {
    expect(paginate(items, 2, 5)).toMatchObject({ items: [6, 7], from: 6, to: 7 });
  });

  test("una página fuera de rango se ajusta a la primera o la última", () => {
    expect(paginate(items, 9, 5).page).toBe(2);
    expect(paginate(items, 0, 5).page).toBe(1);
    expect(paginate(items, -3, 5).page).toBe(1);
    expect(paginate(items, Number("abc"), 5).page).toBe(1);
    expect(paginate(items, 1.5, 5).page).toBe(1);
  });

  test("sin elementos hay una única página vacía", () => {
    expect(paginate([], 3, 5)).toEqual({
      items: [],
      page: 1,
      totalPages: 1,
      from: 0,
      to: 0,
      total: 0,
    });
  });
});
