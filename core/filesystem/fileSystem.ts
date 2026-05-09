export type NodeType = "file" | "folder";

export interface FileNode {
  id: string;
  name: string;
  type: NodeType;
  parentId: string | null;
  children: string[];
  code?: string;
  language?: string;
  isOpen?: boolean;
}

export class FileSystem {
  private nodes = new Map<string, FileNode>();

  constructor(initial: FileNode[]) {
    initial.forEach(n => this.nodes.set(n.id, n));
  }

  getNode(id: string) {
    return this.nodes.get(id);
  }

  createFile(parentId: string, name: string, language: string) {
    const id = crypto.randomUUID();

    const file: FileNode = {
      id,
      name,
      type: "file",
      parentId,
      children: [],
      code: "",
      language
    };

    this.nodes.set(id, file);
    this.nodes.get(parentId)?.children.push(id);

    return file;
  }

  deleteNode(id: string) {
    const node = this.nodes.get(id);
    if (!node) return;

    node.children.forEach(child => this.deleteNode(child));

    this.nodes.delete(id);
  }

  getPath(id: string): FileNode[] {
    const path: FileNode[] = [];
    let current: FileNode | undefined | null = this.nodes.get(id);

    while (current) {
      path.unshift(current);
      current = current.parentId ? this.nodes.get(current.parentId) : null;
    }

    return path;
  }
}