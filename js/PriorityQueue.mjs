class PriorityQueue
{
    #head;
    #tail;
    #size;

    constructor()
    {
        this.#head = null;
        this.#tail = null;
        this.#size = 0;
    }

    pop()
    {
        if (!this.#head) {
            return null;
        }
        const nodeToPop = this.#head;
        this.#head = this.#head.next;
        if (this.#head) {
            this.#head.previous = null;
        } else {
            this.#tail = null;
        }
        this.#size--;
        return nodeToPop.contents;
    }

    get size()
    {
        return this.#size;
    }

    read()
    {
        return this.#head ? this.#head.contents : null;
    }

    add(contents, priority)
    {
        const newNode = new Node(contents, priority);
        if (!this.#head) {
            this.#head = newNode;
            this.#tail = newNode;
        }
        else
        {
            let current = this.#head;
            while (current && current.priority <= priority) {
                current = current.next;
            }
            if (!current) {
                newNode.previous = this.#tail;
                this.#tail.next = newNode;
                this.#tail = newNode;
            } else {
                newNode.next = current;
                newNode.previous = current.previous;
                if (current.previous) {
                    current.previous.next = newNode;
                } else {
                    this.#head = newNode;
                }
                current.previous = newNode;
            }
        }

        this.#size++;
    }
}

class Node
{
    #contents;
    previous;
    next;
    priority;

    constructor(contents, priority)
    {
        this.#contents = contents;
        this.previous = null;
        this.next = null;
        this.priority = priority;
    }

    get contents()
    {
        return this.#contents;
    }
}

export default PriorityQueue;