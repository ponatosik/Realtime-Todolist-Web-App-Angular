import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoTask } from '../../data/todoTask';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'todo-create-form',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './todo-create-form.component.html',
  styleUrl: './todo-create-form.component.css'
})
export class TodoCreateFormComponent {
  @Output() todoCreated = new EventEmitter<TodoTask>();

  deadline: Date | null = null;
  title = "";

  create() {
    const todo: TodoTask = {
      id: 0,
      order: 0,
      completed: false,
      title: this.title,
      deadline: this.deadline,
    };

    this.title = "";
    this.deadline = null;

    this.todoCreated.emit(todo);
  }

  setDeadlineToday() {
    this.deadline = new Date();
  }
}
