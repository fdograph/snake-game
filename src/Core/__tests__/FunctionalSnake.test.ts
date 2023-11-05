import {
  append,
  calculateNext,
  getNextPoint,
  gridLoop,
  grow,
  hasPosition,
  isHead,
  isOutOfBounds,
  isSamePoint,
  move,
  Point,
  pop,
  prepend,
  Snake,
  translate,
} from "../FunctionalSnake.ts";

describe("FunctionalSnake", () => {
  describe("isSamePoint", () => {
    it("should return true if two points are the same", () => {
      expect(isSamePoint([1, 1], [1, 1])).toEqual(true);
    });

    it("should return false if two points are not the same", () => {
      expect(isSamePoint([1, 1], [1, 2])).toEqual(false);
    });
  });

  describe("isOutOfBounds", () => {
    it("should return true if a point is out of bounds", () => {
      expect(isOutOfBounds([2, 2], [1, 1])).toEqual(true);
    });
    it("should return false if a point is not out of bounds", () => {
      expect(isOutOfBounds([0, 0], [1, 1])).toEqual(false);
    });
  });

  describe("hasPosition", () => {
    it("should return true if a snake has a position", () => {
      expect(hasPosition([{ point: [0, 0] }], [0, 0])).toEqual(true);
    });
    it("should return false if a snake does not have a position", () => {
      expect(hasPosition([{ point: [0, 0] }], [1, 1])).toEqual(false);
    });
  });

  describe("isHead", () => {
    it("should return true if a point is the head", () => {
      expect(isHead([0, 0], [{ point: [0, 0] }])).toEqual(true);
    });
    it("should return false if a point is not the head", () => {
      expect(isHead([0, 0], [{ point: [1, 1] }])).toEqual(false);
    });
  });

  describe("append", () => {
    it("should append a point to a snake", () => {
      expect(append([{ point: [0, 0] }], [1, 1])).toEqual([
        { point: [1, 1] },
        { point: [0, 0] },
      ]);
    });
    it("should not mutate the original snake", () => {
      const snake: Snake = [{ point: [0, 0] }];
      const result = append(snake, [1, 1]);

      expect(snake === result).toEqual(false);
      expect(snake).toEqual([{ point: [0, 0] }]);
      expect(result).toEqual([{ point: [1, 1] }, { point: [0, 0] }]);
    });
  });

  describe("prepend", () => {
    it("should prepend a point to a snake", () => {
      expect(prepend([{ point: [0, 0] }], [1, 1])).toEqual([
        { point: [0, 0] },
        { point: [1, 1] },
      ]);
    });
    it("should not mutate the original snake", () => {
      const snake: Snake = [{ point: [0, 0] }];
      const result = prepend(snake, [1, 1]);

      expect(snake === result).toEqual(false);
      expect(snake).toEqual([{ point: [0, 0] }]);
      expect(result).toEqual([{ point: [0, 0] }, { point: [1, 1] }]);
    });
  });

  describe("pop", () => {
    it("should pop the last node without mutating the original", () => {
      const snake: Snake = [{ point: [0, 0] }, { point: [1, 1] }];
      const [last, result] = pop(snake);

      expect(last).toEqual({ point: [1, 1] });
      expect(snake === result).toEqual(false);
      expect(snake).toEqual([{ point: [0, 0] }, { point: [1, 1] }]);
      expect(result).toEqual([{ point: [0, 0] }]);
    });
    it("should return undefined if the snake is empty", () => {
      const snake: Snake = [];
      const [last, result] = pop(snake);

      expect(last).toEqual(undefined);
      expect(snake === result).toEqual(false);
      expect(snake).toEqual([]);
      expect(result).toEqual([]);
    });
  });

  describe("getNextPoint", () => {
    it("should return the next point", () => {
      const snake: Snake = [{ point: [0, 0] }];
      const result = getNextPoint(snake, "up", [1, 1]);

      expect(result).toEqual([0, 1]);
    });
    it("should return the next point when the snake is out of bounds", () => {
      const snake: Snake = [{ point: [0, 0] }];
      const result = getNextPoint(snake, "up", [1, 1]);

      expect(result).toEqual([0, 1]);
    });
    it("should handle all allowed directions", () => {
      const snake: Snake = [{ point: [0, 0] }];
      const up = getNextPoint(snake, "up", [1, 1]);
      const down = getNextPoint(snake, "down", [1, 1]);
      const left = getNextPoint(snake, "left", [1, 1]);
      const right = getNextPoint(snake, "right", [1, 1]);

      expect(up).toEqual([0, 1]);
      expect(down).toEqual([0, 1]);
      expect(left).toEqual([1, 0]);
      expect(right).toEqual([1, 0]);
    });
  });

  describe("calculateNext", () => {
    it("should return the next point", () => {
      const snake: Snake = [{ point: [0, 0] }];
      const result = calculateNext(snake, "up", [1, 1]);

      expect(result).toEqual([0, 1]);
    });
    it("should return the next point when the snake is out of bounds", () => {
      const snake: Snake = [{ point: [0, 0] }];
      const result = calculateNext(snake, "up", [0, 1]);

      expect(result).toEqual([0, 1]);
    });
    it("should handle all allowed directions", () => {
      const snake: Snake = [{ point: [0, 0] }];
      const up = calculateNext(snake, "up", [1, 1]);
      const down = calculateNext(snake, "down", [1, 1]);
      const left = calculateNext(snake, "left", [1, 1]);
      const right = calculateNext(snake, "right", [1, 1]);

      expect(up).toEqual([0, 1]);
      expect(down).toEqual([0, 1]);
      expect(left).toEqual([1, 0]);
      expect(right).toEqual([1, 0]);
    });
    it("should throw an error if the snake steps on itself", () => {
      const snake: Snake = [{ point: [0, 0] }, { point: [0, 1] }];
      expect(() => {
        calculateNext(snake, "up", [1, 1]);
      }).toThrow("Stepped on self");
    });
  });

  describe("translate", () => {
    it("should translate the snake", () => {
      const snake: Snake = [{ point: [0, 0] }];
      const result = translate(snake, "up", [1, 1]);

      expect(result).toEqual([{ point: [0, 1] }]);
    });
    it("should not mutate the original snake", () => {
      const snake: Snake = [{ point: [0, 0] }];
      const result = translate(snake, "up", [1, 1]);

      expect(snake === result).toEqual(false);
      expect(snake).toEqual([{ point: [0, 0] }]);
      expect(result).toEqual([{ point: [0, 1] }]);
    });
    it("should translate the snake multiple times without mutating the original", () => {
      const snake: Snake = [{ point: [0, 0] }];
      const bounds: Point = [3, 3];
      const step1 = translate(snake, "right", bounds);
      const step2 = translate(step1, "right", bounds);
      const step3 = translate(step2, "right", bounds);
      const step4 = translate(step3, "right", bounds);

      expect(snake === step1).toEqual(false);
      expect(snake === step2).toEqual(false);
      expect(snake === step3).toEqual(false);
      expect(snake === step4).toEqual(false);
      expect(snake).toEqual([{ point: [0, 0] }]);
      expect(step1).toEqual([{ point: [1, 0] }]);
      expect(step2).toEqual([{ point: [2, 0] }]);
      expect(step3).toEqual([{ point: [3, 0] }]);
      expect(step4).toEqual([{ point: [0, 0] }]);
    });
  });

  describe("grow", () => {
    it("should grow the snake", () => {
      const snake: Snake = [{ point: [0, 0] }];
      const bounds: Point = [5, 5];
      const result = grow(snake, "up", bounds);

      expect(result).toEqual([{ point: [0, 5] }, { point: [0, 0] }]);
    });
    it("should not mutate the original snake", () => {
      const snake: Snake = [{ point: [0, 0] }];
      const result = grow(snake, "up", [1, 1]);

      expect(snake === result).toEqual(false);
      expect(snake).toEqual([{ point: [0, 0] }]);
      expect(result).toEqual([{ point: [0, 1] }, { point: [0, 0] }]);
    });
    it("should grow the snake multiple times without mutating the original", () => {
      const snake: Snake = [{ point: [0, 0] }];
      const bounds: Point = [3, 3];
      const step1 = grow(snake, "right", bounds);
      const step2 = grow(step1, "right", bounds);
      const step3 = grow(step2, "right", bounds);

      expect(step1).toEqual([{ point: [1, 0] }, { point: [0, 0] }]);
      expect(step2).toEqual([
        { point: [2, 0] },
        { point: [1, 0] },
        { point: [0, 0] },
      ]);
      expect(step3).toEqual([
        { point: [3, 0] },
        { point: [2, 0] },
        { point: [1, 0] },
        { point: [0, 0] },
      ]);
    });
  });

  describe("move", () => {
    it("should move the snake", () => {
      const snake: Snake = [{ point: [0, 0] }];
      const bounds: Point = [5, 5];
      const result = move(snake, "up", bounds);

      expect(result).toEqual([{ point: [0, 5] }]);
    });
    it("should not mutate the original snake", () => {
      const snake: Snake = [{ point: [0, 0] }];
      const result = move(snake, "up", [1, 1]);

      expect(snake === result).toEqual(false);
      expect(snake).toEqual([{ point: [0, 0] }]);
      expect(result).toEqual([{ point: [0, 1] }]);
    });
    it("should decide whether to grow or translate", () => {
      const snake: Snake = [{ point: [0, 0] }];
      const bounds: Point = [3, 3];
      const food: Point = [2, 2];
      const step1 = move(snake, "right", bounds, food);
      const step2 = move(step1, "right", bounds, food);
      const step3 = move(step2, "down", bounds, food);
      const step4 = move(step3, "down", bounds, food);
      const step5 = move(step4, "right", bounds, food);

      expect(step1).toEqual([{ point: [1, 0] }]);
      expect(step2).toEqual([{ point: [2, 0] }]);
      expect(step3).toEqual([{ point: [2, 1] }]);
      expect(step4).toEqual([{ point: [2, 2] }, { point: [2, 1] }]);
      expect(step4).toEqual([{ point: [2, 2] }, { point: [2, 1] }]);
      expect(step5).toEqual([{ point: [3, 2] }, { point: [2, 2] }]);
    });
  });

  describe("gridLoop", () => {
    it("should loop through a grid", () => {
      const cols = 3;
      const rows = 3;
      const result = gridLoop(cols, rows, (point) => point);
      const expected = [
        [
          [0, 0],
          [1, 0],
          [2, 0],
        ],
        [
          [0, 1],
          [1, 1],
          [2, 1],
        ],
        [
          [0, 2],
          [1, 2],
          [2, 2],
        ],
      ];

      result.forEach((row, rowIndex) => {
        expect(row).toEqual(expected[rowIndex]);
      });
    });
  });
});
