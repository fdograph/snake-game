export type Grid<T> = T[][];
export type Point = [number, number]; // [rowIndex, colIndex]
export type GridDimensions = [number, number]; // [mRows, nCols]
export type SnakeNode = {
  point: Point;
};
export type Snake = SnakeNode[];

export type Direction = "up" | "down" | "left" | "right";
export type Action = "pause";

export const isSamePoint = (a: Point, b: Point) => {
  return a[0] === b[0] && a[1] === b[1];
};

export const isOutOfBounds = (
  [aX, aY]: Point,
  [boundsX, boundsY]: GridDimensions,
) => {
  return aX < 0 || aX > boundsX - 1 || aY < 0 || aY > boundsY - 1;
};

export const hasPosition = (snake: Snake, point: Point) => {
  return snake.some((node) => isSamePoint(node.point, point));
};

export const isHead = (point: Point, snake: Snake): boolean => {
  const head = snake[0];
  return head !== undefined && isSamePoint(point, head.point);
};

export const prepend = (snake: Snake, point: Point): Snake => {
  return [{ point }, ...snake];
};

export const append = (snake: Snake, point: Point): Snake => {
  return [...snake, { point }];
};

export const pop = (snake: Snake): [SnakeNode | undefined, Snake] => {
  if (snake.length === 0) {
    return [undefined, []];
  }

  const lastIndex = snake.length - 1;
  const last = snake[lastIndex];
  const poppedSnake = snake.slice(0, lastIndex);

  return [last, poppedSnake];
};

export const getNextPoint = (
  snake: Snake,
  direction: Direction,
  [rows, cols]: GridDimensions,
): Point => {
  const [headX, headY] = snake[0].point;
  let nextX: number;
  let nextY: number;

  switch (direction) {
    case "up":
      nextX = headX;
      nextY = headY - 1 < 0 ? rows - 1 : headY - 1;
      break;
    case "down":
      nextX = headX;
      nextY = headY + 1 > rows - 1 ? 0 : headY + 1;
      break;
    case "left":
      nextX = headX - 1 < 0 ? cols - 1 : headX - 1;
      nextY = headY;
      break;
    case "right":
      nextX = headX + 1 > cols - 1 ? 0 : headX + 1;
      nextY = headY;
      break;
  }

  return [nextX, nextY];
};

export const calculateNext = (
  snake: Snake,
  direction: Direction,
  bounds: GridDimensions,
): Point => {
  const nextHead = getNextPoint(snake, direction, bounds);

  if (hasPosition(snake, nextHead)) {
    throw new Error("Stepped on self");
  }

  return nextHead;
};

export const translate = (
  snake: Snake,
  direction: Direction,
  bounds: GridDimensions,
): Snake => {
  return prepend(pop(snake)[1], calculateNext(snake, direction, bounds));
};

export const grow = (
  snake: Snake,
  direction: Direction,
  bounds: GridDimensions,
): Snake => {
  return prepend(snake, calculateNext(snake, direction, bounds));
};

export const move = (
  snake: Snake,
  direction: Direction,
  bounds: GridDimensions,
  food?: Point,
): Snake => {
  const nextHead = calculateNext(snake, direction, bounds);

  if (food && isSamePoint(nextHead, food)) {
    return grow(snake, direction, bounds);
  }

  return translate(snake, direction, bounds);
};

export const gridLoop = (
  rows: number,
  cols: number,
  factory: (point: Point) => Point = (point) => point,
): Grid<Point> => {
  const grid: Point[][] = [];

  for (let row = 0; row < rows; row++) {
    const rowArr: Point[] = [];

    for (let col = 0; col < cols; col++) {
      rowArr.push(factory([col, row]));
    }

    grid.push(rowArr);
  }

  return grid;
};

export const flatGrid = (rowCount: number, colCount: number) => {
  return gridLoop(rowCount, colCount, (point) => point).reduce(
    (acc, pointRow) => [...acc, ...pointRow],
    [],
  );
};

export const pickRandom = (
  [rows, cols]: GridDimensions,
  snake: Snake,
): Point | undefined => {
  const available: Point[] = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const point: Point = [x, y];

      if (!hasPosition(snake, point)) {
        available.push(point);
      }
    }
  }

  if (available.length === 0) {
    return;
  }

  return available[Math.floor(Math.random() * available.length)];
};
