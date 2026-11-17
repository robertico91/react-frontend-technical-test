import { describe, expect, test } from "vitest";
import { validatePost } from "./validatePost";

describe("validatePost", () => {
  test("título y texto son obligatorios", () => {
    expect(validatePost({ title: "", body: "" })).toEqual({
      title: "El título es obligatorio",
      body: "El texto es obligatorio",
    });
  });

  test("un valor hecho solo de espacios no cuenta", () => {
    expect(validatePost({ title: "   ", body: "\n\t " })).toEqual({
      title: "El título es obligatorio",
      body: "El texto es obligatorio",
    });
  });

  test("sin errores cuando los dos campos tienen contenido", () => {
    expect(validatePost({ title: "Hola", body: "Mundo" })).toEqual({});
  });
});
