import { Component, OnDestroy } from '@angular/core';
import { CdkDragDrop, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { WorkspacesHubService } from '../../hubs/workspaces-hub-service/workspaces-hub.service';
import { AsyncPipe } from '@angular/common';
import { TodoTask } from '../../data/todoTask';
import { Observable, Subscription, combineLatest, map, of, switchMap } from 'rxjs';
import { TodoCardComponent } from '../todo-card/todo-card.component';
import { Workspace } from '../../data/workspace';
import { TodolistHub } from '../../hubs/todolist-hub/todolist-hub';
import { TodoCreateFormComponent } from '../todo-create-form/todo-create-form.component';

@Component({
  selector: 'todo-list',
  standalone: true,
  imports: [AsyncPipe, TodoCardComponent, TodoCreateFormComponent, CdkDropList, CdkDrag],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent implements OnDestroy {
  todoList$: Observable<TodoTask[] | null>;
  selectedWorkspace$: Observable<Workspace | null>;
  activeTodolistConnection: TodolistHub | null = null;
  activeConnectionSubscription: Subscription;

  constructor(public workspacesConnection: WorkspacesHubService) {
    this.todoList$ = workspacesConnection.activeWorkspace$.pipe(
      switchMap(item => item?.tasks$ ?? of(null)),
      map(tasks => tasks?.sort((a, b) => a.order - b.order) ?? null)
    );

    this.selectedWorkspace$ = combineLatest([workspacesConnection.activeWorkspace$, workspacesConnection.workspaces$]).pipe(
      map(([activeWorkspace, workspaces]) =>
        workspaces.find(x => x.id === activeWorkspace?.workspaceId) ?? null
      )
    );

    this.activeConnectionSubscription = workspacesConnection.activeWorkspace$.subscribe(workspace => this.activeTodolistConnection = workspace);
  }

  ngOnDestroy(): void {
    this.activeConnectionSubscription.unsubscribe();
  }

  moveTask(event: CdkDragDrop<TodoTask[]>) {
    const todo = event.item.data;
    const newOrder = event.currentIndex;

    this.activeTodolistConnection?.updateTaskOrder(todo.id, newOrder)
  }

  createTask(task: TodoTask) {
    this.activeTodolistConnection?.createTask(task.title, task.deadline);
  }

  onUpdateTaskCompleted(task: TodoTask) {
    this.activeTodolistConnection?.updateTaskCompleted(task.id, task.completed);
  }
  onUpdateTaskDealine(task: TodoTask) {
    this.activeTodolistConnection?.updateTaskDeadline(task.id, task.deadline);
  }
  onDeleteTask(task: TodoTask) {
    this.activeTodolistConnection?.deleteTask(task.id);
  }
}
