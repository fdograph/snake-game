export class Node<T> {
  public value: T;
  public next: Node<T> | undefined;

  constructor(value: T) {
    this.value = value;
  }
}
export abstract class LinkedList<T> {
  protected head: Node<T>;

  protected constructor(head: T | Node<T>) {
    this.head = head instanceof Node ? head : new Node(head);
  }

  public abstract append(value: T): LinkedList<T>;
  public abstract prepend(value: T): LinkedList<T>;
  public abstract clip(): LinkedList<T>;

  public toArray(): T[] {
    const result: T[] = [];

    this.forEach((node) => {
      result.push(node.value);
    });

    return result;
  }

  public size(): number {
    let count = 0;

    this.forEach(() => {
      count++;
    });

    return count;
  }

  public forEach(fn: (node: Node<T>) => void | false) {
    let current: Node<T> | undefined = this.head;

    while (current) {
      const shouldBreak = fn(current);

      if (shouldBreak === false) {
        break;
      }

      current = current.next;
    }
  }

  public map<U>(fn: (node: Node<T>) => U): U[] {
    const result: U[] = [];

    this.forEach((node) => {
      result.push(fn(node));
    });

    return result;
  }

  public has(comparisonFn: (value: T) => boolean): boolean {
    let result = false;

    this.forEach((node) => {
      if (comparisonFn(node.value)) {
        result = true;
        return false;
      }
    });

    return result;
  }

  protected push(value: T) {
    const modifiedHead = this.cloneHead();
    const node = new Node<T>(value);

    let current = modifiedHead;
    while (current.next) {
      current = current.next;
    }

    current.next = node;

    return modifiedHead;
  }

  protected unshift(value: T) {
    let modifiedHead = this.cloneHead();
    const node = new Node<T>(value);

    node.next = modifiedHead;
    modifiedHead = node;

    return modifiedHead;
  }

  protected pop(): [T, Node<T>] {
    const modifiedHead = this.cloneHead();
    let current = modifiedHead;
    let previous: Node<T> | undefined;

    while (current.next) {
      previous = current;
      current = current.next;
    }

    if (previous) {
      previous.next = undefined;
    }

    return [current.value, modifiedHead];
  }

  protected cloneHead() {
    const newHead = new Node<T>(this.head.value);
    let current: Node<T> = newHead;
    let headCurrent: Node<T> | undefined = this.head.next;

    while (headCurrent) {
      const newNode = new Node<T>(headCurrent.value);
      current.next = newNode;
      current = newNode;
      headCurrent = headCurrent.next;
    }

    return newHead;
  }
}

export class SinglyLinkedList<T> extends LinkedList<T> {
  constructor(head: T | Node<T>) {
    super(head);
  }

  append(value: T): SinglyLinkedList<T> {
    return new SinglyLinkedList<T>(this.push(value));
  }

  prepend(value: T): SinglyLinkedList<T> {
    return new SinglyLinkedList<T>(this.unshift(value));
  }

  clip(): SinglyLinkedList<T> {
    return new SinglyLinkedList<T>(this.pop()[1]);
  }
}
