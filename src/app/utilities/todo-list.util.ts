import { TodoTask } from "../data/todoTask";

export class TodoListUtil {
  public static moveTodo(items: TodoTask[], currentOrder: number, newOrder: number): TodoTask[] {
    if (currentOrder < 0 || currentOrder >= items.length || newOrder < 0 || newOrder >= items.length) {
      throw new Error("Invalid order values");
    }

    let todoToMove = items.find(todo => todo.order === currentOrder);
    if (!todoToMove) {
      throw new Error("Todo with specified order not found");
    }

    let newItems = items.sort((a, b) => a.order - b.order);
    let todoIndex = newItems.indexOf(todoToMove);

    newItems.splice(todoIndex, 1);
    newItems.splice(newOrder, 0, todoToMove);

    newItems.forEach((todo, index) => {
      todo.order = index;
    });

    return items;
  }
}
