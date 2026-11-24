import { beforeEach, describe, expect, test } from "vitest";
import { allowRead } from "../src/server/reads";

const START = 1_000_000;
let seen: Map<string, number[]>;
beforeEach(() => {
  seen = new Map();
});
const read = (key: string, at = START, maxKeys?: number) => allowRead(key, at, seen, maxKeys);
const fill = (key: string, at = START) => Array.from({ length: 8 }, () => read(key, at));

describe("website read limit", () => {
  test("allows 8 reads a minute and refuses the 9th", () => {
    expect(fill("a")).toEqual(Array(8).fill(true));
    expect(read("a")).toBe(false);
  });

  test("visitors don't share a limit", () => {
    fill("a");
    expect(read("a")).toBe(false);
    expect(read("b")).toBe(true);
  });

  test("a read stops counting after exactly 60 seconds", () => {
    fill("a");
    expect(read("a", START + 59_999)).toBe(false);
    expect(read("a", START + 60_000)).toBe(true);
  });

  test("the window slides, one read at a time", () => {
    for (let i = 0; i < 8; i++) expect(read("a", START + i * 1000)).toBe(true);
    expect(read("a", START + 60_000)).toBe(true); // only the first read has expired
    expect(read("a", START + 60_000)).toBe(false);
    expect(read("a", START + 61_000)).toBe(true);
  });

  test("refused reads don't extend the wait", () => {
    fill("a");
    for (let i = 1; i <= 20; i++) expect(read("a", START + i * 1000)).toBe(false);
    expect(read("a", START + 60_000)).toBe(true);
  });

  test("expired visitors are dropped by anyone's next read", () => {
    read("a");
    read("b", START + 1000);
    read("c", START + 60_500);
    expect([...seen.keys()]).toEqual(["b", "c"]);
  });

  test("a visitor who keeps reading isn't dropped, or left blocking the ones behind them", () => {
    read("a");
    read("b", START + 1000);
    read("a", START + 50_000);
    read("c", START + 61_000);
    expect([...seen.keys()]).toEqual(["a", "c"]);
    expect(seen.get("a")).toEqual([START, START + 50_000]);
  });

  test("a refused read still clears expired visitors", () => {
    read("old");
    fill("a", START + 30_000);
    expect(read("a", START + 60_000)).toBe(false);
    expect([...seen.keys()]).toEqual(["a"]);
  });

  test("at the cap, the visitor who read longest ago is evicted", () => {
    read("a", START, 3);
    read("b", START + 1, 3);
    read("c", START + 2, 3);
    read("a", START + 3, 3); // already stored, so nobody is evicted
    expect([...seen.keys()]).toEqual(["b", "c", "a"]);
    read("d", START + 4, 3);
    expect([...seen.keys()]).toEqual(["c", "a", "d"]);
  });

  test("holds at most 10,000 visitors by default", () => {
    for (let i = 0; i < 10_050; i++) read(`v${i}`);
    expect(seen.size).toBe(10_000);
    expect(seen.has("v49")).toBe(false);
    expect(seen.has("v50")).toBe(true);
  });
});
