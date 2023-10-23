import { SinglyLinkedList } from "../LinkedList.ts";

describe("SinglyLinkedList", () => {
  it("should create a new SinglyLinkedList", () => {
    const list = new SinglyLinkedList<number>(1);

    expect(list).toBeDefined();
    expect(list.toArray()).toEqual([1]);
  });

  it("should append a new node without mutating the original", () => {
    const list = new SinglyLinkedList<number>(1);
    const resultedList = list.append(2);

    expect(list === resultedList).toEqual(false);
    expect(list.toArray()).toEqual([1]);
    expect(resultedList.toArray()).toEqual([1, 2]);
  });

  it("should prepend a new node without mutating the original", () => {
    const list = new SinglyLinkedList<number>(1);
    const resultedList = list.prepend(2);

    expect(list === resultedList).toEqual(false);
    expect(list.toArray()).toEqual([1]);
    expect(resultedList.toArray()).toEqual([2, 1]);
  });

  it("should return the size of the resulting list", () => {
    const list = new SinglyLinkedList<number>(1);

    expect(list.size()).toEqual(1);
    expect(list.append(2).size()).toEqual(2);
  });

  it("should traverse the list", () => {
    const list = new SinglyLinkedList<number>(1);
    const modifiedList = list.append(2).append(3);
    const result: number[] = [];

    modifiedList.forEach((node) => {
      result.push(node.value);
    });

    expect(modifiedList.toArray()).toEqual([1, 2, 3]);
    expect(result).toEqual([1, 2, 3]);
  });

  it("should pop the last node without mutating the original", () => {
    const list = new SinglyLinkedList<number>(1);
    const modifiedList = list.append(2).append(3).clip();

    expect(list.toArray()).toEqual([1]);
    expect(list === modifiedList).toEqual(false);
    expect(modifiedList.toArray()).toEqual([1, 2]);
  });

  it("should check if the list contains a value", () => {
    const list = new SinglyLinkedList<number>(1).append(2).append(3);

    expect(list.has((value) => value === 2)).toEqual(true);
    expect(list.has((value) => value === 4)).toEqual(false);
  });
});
