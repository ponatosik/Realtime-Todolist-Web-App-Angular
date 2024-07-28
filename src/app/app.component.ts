import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { WorkspaceListComponent } from './components/workspace-list/workspace-list.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { AppCautionComponent } from './components/app-caution/app-caution.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, WorkspaceListComponent, TodoListComponent, AppCautionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SignalR-test-client';
}
