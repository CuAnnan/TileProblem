class IndexedSearchTree
{
    #indexedNodes = new Map();
    constructor(key, item)
    {
        this.firstNode = new Node(item);
        this.#indexedNodes.set(key, this.firstNode);
    }

    addNode(parentKey, key, item)
    {
        const parentNode = this.#indexedNodes.get(parentKey);
        if (!parentNode) {
            throw new Error("Parent node not found");
        }
        const newNode = new Node(item);
        parentNode.addChild(newNode);
        this.#indexedNodes.set(key, newNode);
    }

    getByKey(key)
    {
        return this.#indexedNodes.get(key);
    }

    getPathFromRoot(key)
    {
        const node = this.#indexedNodes.get(key);
        if (!node) {
            throw new Error("Node not found");
        }
        const path = [];
        let currentNode = node;
        while (currentNode) {
            path.push({string: currentNode.item.toString(), solvedState: key, size: currentNode.item.size});
            currentNode = currentNode.parent;
        }
        return path.reverse();
    }

}

class Node
{
    constructor(item)
    {
        this.item = item;
        this.children = [];
        this.parent = null;
    }

    addChild(Node)
    {
        Node.parent = this;
        this.children.push(Node);
    }
}

export default IndexedSearchTree;