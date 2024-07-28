import { Component, ElementRef, ViewChild, effect, signal } from '@angular/core';
import { WorkspacesHubService } from '../../hubs/workspaces-hub-service/workspaces-hub.service';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'workspace-list',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './workspace-list.component.html',
  styleUrl: './workspace-list.component.css'
})
export class WorkspaceListComponent {
  isConnected$ = this.hubService.isConnected$;
  workspaces$ = this.hubService.workspaces$;

  @ViewChild('createWorkspaceFormInput') createFormInput!: ElementRef;
  isCreateFormActive = signal(false);

  constructor(public hubService: WorkspacesHubService) {
    if (!hubService.isConnected$.getValue()) {
      this.hubService.connect();
    }
    effect(() => {
      if (this.isCreateFormActive()) {
        // Set delay for the form to be rendered (until display:none is discarded)
        setTimeout(() => this.createFormInput.nativeElement.focus(), 10);
      }
    });
  }

  onCreateFormFocusOut(event: FocusEvent) {
    // Cast event to raw object to retrieve information about elements in focus
    const rawEvent = event as any;
    const targetForm = rawEvent.target?.form?.attributes[0];
    const originalForm = rawEvent.explicitOriginalTarget?.form?.attributes[0];

    console.log(event);
    console.log(targetForm, originalForm);


    // Check if focus is outside of the original form
    if (targetForm != originalForm) {
      this.isCreateFormActive.set(false);
    }
  }

  createWorkspace() {
    var workspaceName = this.createFormInput.nativeElement.value;
    // this.hubService.createWorkspace(workspaceName);

    this.createFormInput.nativeElement.value = "";
  }
}
