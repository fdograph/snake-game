export type Grid<T> = T[][];
export type Point = [number, number];
export type SnakeNode = {
  point: Point;
};
export type Snake = SnakeNode[];

export type Direction = "up" | "down" | "left" | "right";
export type Action = "pause";

export const isSamePoint = (a: Point, b: Point) => {
  return a[0] === b[0] && a[1] === b[1];
};

export const isOutOfBounds = (point: Point, bounds: Point) => {
  return (
    point[0] < 0 ||
    point[0] >= bounds[0] ||
    point[1] < 0 ||
    point[1] >= bounds[1]
  );
};

export const hasPosition = (snake: Snake, point: Point) => {
  return snake.some((node) => isSamePoint(node.point, point));
};

export const isHead = (point: Point, snake: Snake): boolean => {
  const head = snake[0];
  return head !== undefined && isSamePoint(point, head.point);
};

export const append = (snake: Snake, point: Point): Snake => {
  return [...snake, { point }];
};

export const prepend = (snake: Snake, point: Point): Snake => {
  return [{ point }, ...snake];
};

export const pop = (snake: Snake): [SnakeNode | undefined, Snake] => {
  const poppedSnake = [...snake];
  const last = poppedSnake.pop();

  return [last, poppedSnake];
};

export const getNextPoint = (
  snake: Snake,
  direction: Direction,
  [boundsX, boundsY]: Point,
): Point => {
  const [headX, headY] = snake[snake.length - 1].point;
  let nextHead: Point;
  switch (direction) {
    case "up":
      nextHead = [headX, headY - 1 < 0 ? boundsY - 1 : headY - 1];
      break;
    case "down":
      nextHead = [headX, headY + 1 >= boundsY ? 0 : headY + 1];
      break;
    case "left":
      nextHead = [headX - 1 < 0 ? boundsX - 1 : headX - 1, headY];
      break;
    case "right":
      nextHead = [headX + 1 >= boundsX ? 0 : headX + 1, headY];
      break;
  }

  return nextHead;
};

export const calculateNext = (
  snake: Snake,
  direction: Direction,
  bounds: Point,
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
  bounds: Point,
): Snake => {
  return append(pop(snake)[1], calculateNext(snake, direction, bounds));
};

export const grow = (
  snake: Snake,
  direction: Direction,
  bounds: Point,
): Snake => {
  return append(snake, calculateNext(snake, direction, bounds));
};

export const move = (
  snake: Snake,
  direction: Direction,
  bounds: Point,
  food?: Point,
): Snake => {
  const nextHead = calculateNext(snake, direction, bounds);

  if (food && isSamePoint(nextHead, food)) {
    return grow(snake, direction, bounds);
  }

  return translate(snake, direction, bounds);
};

export const gridLoop = (
  cols: number,
  rows: number,
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

export const getCell = <T>(grid: Grid<T>, [pointX, pointY]: Point): T => {
  return grid[pointX][pointY];
};

export const pickRandom = (
  [boundsX, boundsY]: Point,
  snake: Snake,
): Point | undefined => {
  const available: Point[] = [];

  for (let y = 0; y < boundsY; y++) {
    for (let x = 0; x < boundsX; x++) {
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
