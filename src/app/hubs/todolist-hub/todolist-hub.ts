import { BehaviorSubject, Observable } from "rxjs";
import { HubClient } from "../hub-client";
import { TodoTask } from "../../data/todoTask";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { TodoListUtil } from "../../utilities/todo-list.util";

export class TodolistHub extends HubClient {
  private tasksSubject: BehaviorSubject<TodoTask[]>;
  public tasks$: Observable<TodoTask[]>;

  private _workspaceId: number;
  public get workspaceId(): number { return this._workspaceId; }

  constructor(apiClient: HttpClient, workspaceId: number) {
    const endpointUrl = `${environment.apiBaseUrl}/todolist/${workspaceId}`;
    const hubUrl = `${environment.apiBaseUrl}/board?workspaceid=${workspaceId}`;

    super(hubUrl);

    this._workspaceId = workspaceId;

    this.tasksSubject = new BehaviorSubject<TodoTask[]>([]);
    this.tasks$ = this.tasksSubject.asObservable();

    const tasks = apiClient.get<TodoTask[]>(endpointUrl);
    tasks.subscribe(result => this.tasksSubject.next(result));

    this.tasks$.subscribe(items => console.log(items));
    super.wireUpCallbacks(this);
  }

  public createTask(taskName: string, deadline: Date | null) {
    this.hubConnection.invoke('Addtask', taskName, deadline);
  }
  public deleteTask(taskId: Number) {
    this.hubConnection.invoke('Deletetask', taskId);
  }
  public updateTaskTitle(taskId: number, title: string) {
    this.hubConnection.invoke('UpdateTaskTitle', taskId, title);
  }
  public updateTaskCompleted(taskId: number, completed: boolean) {
    this.hubConnection.invoke('UpdateTaskCompleted', taskId, completed);
  }
  public updateTaskDeadline(taskId: number, deadline: Date | null) {
    this.hubConnection.invoke('UpdateTaskDeadline', taskId, deadline);
  }
  public updateTaskOrder(taskId: number, order: number) {
    this.hubConnection.invoke('UpdateTaskOrder', taskId, order);

    this.onUpdateTaskOrder(taskId, order);
  }

  // hub callbacks
  private onAddTask(task: TodoTask) {
    this.tasksSubject.next([...this.tasksSubject.getValue(), task]);
    console.log("new task added", task);
  }

  private onDeleteTask(taskId: number) {
    this.tasksSubject.next([... this.tasksSubject.getValue()].filter(x => x.id != taskId));
    console.log("task deleted", taskId);
  }

  private onUpdateTaskTitle(taskId: number, title: string) {
    let tasks = this.tasksSubject.getValue();
    let task = tasks.find(x => x.id == taskId);
    if (task == null) {
      this.onError("trying to update non existing task");
      return;
    }

    task.title = title;
    this.tasksSubject.next(tasks)
  }

  private onUpdateTaskCompleted(taskId: number, completed: boolean) {
    let tasks = this.tasksSubject.getValue();
    let task = tasks.find(x => x.id == taskId);
    if (task == null) {
      this.onError("trying to update non existing task");
      return;
    }

    task.completed = completed;
    this.tasksSubject.next(tasks)
  }

  private onUpdateTaskDeadline(taskId: number, deadline: Date) {
    let tasks = this.tasksSubject.getValue();
    let task = tasks.find(x => x.id == taskId);
    if (task == null) {
      this.onError("trying to update non existing task");
      return;
    }

    task.deadline = deadline;
    this.tasksSubject.next(tasks)
  }

  private onUpdateTaskOrder(taskId: number, order: number) {
    let tasks = this.tasksSubject.getValue();
    let task = tasks.find(x => x.id == taskId);
    if (task == null) {
      this.onError("trying to update non existing task");
      return;
    }

    try {
      let newList = TodoListUtil.moveTodo(tasks, task.order, order)
    } catch (e) {
      this.onError(e);
    }
    this.tasksSubject.next(tasks)
  }

  private onUpdateTask(taskId: number, updatedTask: TodoTask) {
    let task = this.tasksSubject.getValue().find(x => x.id == taskId);
    if (task == null) {
      this.onError("trying to update non existing task");
      return;
    }

    if (task.title != updatedTask.title) {
      task.title = updatedTask.title;
    }
    if (task.completed != updatedTask.completed) {
      task.completed = updatedTask.completed;
    }
    if (task.deadline != updatedTask.deadline) {
      task.deadline = updatedTask.deadline;
    }
    if (task.order != updatedTask.order) {
      task.order = updatedTask.order;
    }
  }

  private onError(error: any) {
    console.error("Hub error", error);
  }
}
