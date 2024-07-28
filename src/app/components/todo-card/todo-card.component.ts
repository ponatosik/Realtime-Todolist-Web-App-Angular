import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { TodoTask } from '../../data/todoTask';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'todo-card',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './todo-card.component.html',
  styleUrl: './todo-card.component.css'
})
export class TodoCardComponent implements OnInit {
  @Input({ required: true }) todoTask!: TodoTask;
  @Output() onUpdateTaskCompleted: EventEmitter<TodoTask> = new EventEmitter<TodoTask>
  @Output() onUpdateTaskTitle: EventEmitter<TodoTask> = new EventEmitter<TodoTask>
  @Output() onUpdateTaskDeadline: EventEmitter<TodoTask> = new EventEmitter<TodoTask>
  @Output() onDeleteTask: EventEmitter<TodoTask> = new EventEmitter<TodoTask>

  deadline!: Date | null;

  isDeleting = signal(false);

  ngOnInit(): void {
    this.deadline = this.todoTask.deadline;
  }

  updateTaskCompletion(completed: boolean) {
    this.todoTask.completed = completed;
    this.onUpdateTaskCompleted.emit(this.todoTask);
  }

  updateTaskTitle(title: string) {
    this.todoTask.title = title;
    this.onUpdateTaskTitle.emit(this.todoTask);
  }

  updateTaskDeadline(date: Date | null) {
    this.todoTask.deadline = date;
    this.onUpdateTaskDeadline.emit(this.todoTask);
  }

  updateTaskDeadlineToday() {
    this.updateTaskDeadline(new Date);
  }

  deleteTask() {
    if (!this.isDeleting()) {
      this.isDeleting.set(true);
      this.onDeleteTask.emit(this.todoTask);
    }
  }

  formatDate(date: Date | null): string {
    if (date == null) {
      return ''
    }
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    const year = date.getFullYear().toString();

    if (month.length < 2) {
      month = '0' + month
    }
    if (day.length < 2) {
      day = '0' + day
    }

    return [year, month, day].join('-');
  }
}
