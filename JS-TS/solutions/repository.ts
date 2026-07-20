export class InMemoryRepository<T extends { id: number }> {
  // private storage
  private items: T[] = [];

  add(entity: T): T {
    this.items.push(entity);
    return entity;
  }

  update(id: number, patch: Partial<T>): T {
    this.items.forEach((item, index) => {
      if (item.id === id) {
        this.items[index] = { ...item, ...patch };
      }
    });
    return this.items.find((item) => item.id === id)!;
  }

  remove(id: number): void {
    this.items = this.items.filter((item) => item.id !== id);
  }

  findById(id: number): T {
    return this.items.find((item) => item.id === id)!;
  }

  findAll(): T[] {
    return this.items;
  }
}
