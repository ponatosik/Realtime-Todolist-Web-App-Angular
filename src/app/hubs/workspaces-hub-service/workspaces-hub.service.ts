import { Injectable } from '@angular/core';
import { HubClient } from '../hub-client';
import { Workspace } from '../../data/workspace';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TodolistHub } from '../todolist-hub/todolist-hub';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkspacesHubService extends HubClient {
  private workspacesSubject: BehaviorSubject<Workspace[]>;
  public workspaces$: Observable<Workspace[]>;

  private activeWorkspaceSubject: BehaviorSubject<TodolistHub | null>;
  public activeWorkspace$: Observable<TodolistHub | null>;

  constructor(private apiClient: HttpClient) {
    const hubUrl = `${environment.apiBaseUrl}/workspaceshub`;
    const endpointUrl = `${environment.apiBaseUrl}/workspaces`;

    super(hubUrl);

    this.workspacesSubject = new BehaviorSubject<Workspace[]>([]);
    this.workspaces$ = this.workspacesSubject.asObservable();

    this.activeWorkspaceSubject = new BehaviorSubject<TodolistHub | null>(null);
    this.activeWorkspace$ = this.activeWorkspaceSubject.asObservable()

    const workspaces = apiClient.get<Workspace[]>(endpointUrl);
    workspaces.subscribe(
      result => {
        console.log(result);
        this.workspacesSubject.next(result);

        // DEBUG
        this.connectToWorkspace(result[0]);
      }
    );

    this.workspaces$.subscribe(items => console.log(items));
    super.wireUpCallbacks(this);
  }

  public connectToWorkspace(workspace: Workspace) {
    var activeWorkspace = this.activeWorkspaceSubject.getValue();
    if (activeWorkspace?.workspaceId == workspace.id) {
      return;
    }
    if (activeWorkspace != null) {
      activeWorkspace.disconnect()
    }

    var newConnection = new TodolistHub(this.apiClient, workspace.id);
    newConnection.connect();
    this.activeWorkspaceSubject.next(newConnection);
  }

  public createWorkspace(workspaceName: string) {
    this.hubConnection.invoke('AddWorkspace', workspaceName);
  }
  public deleteWorkspace(workspaceId: Number) {
    this.hubConnection.invoke('DeleteWorkspace', workspaceId);
  }
  public updateWorkspaceName(workspaceId: Number, newName: string) {
    this.hubConnection.invoke('UpdateWorkspaceName', workspaceId, newName);
  }

  // hub callbacks
  private onAddWorkspace(workspace: Workspace) {
    this.workspacesSubject.next([...this.workspacesSubject.getValue(), workspace]);
    console.log("new Workspace added", workspace);
  }
  private onDeleteWorkspace(workspaceId: number) {
    this.workspacesSubject.next([... this.workspacesSubject.getValue()].filter(x => x.id != workspaceId));
    if (workspaceId == this.activeWorkspaceSubject.getValue()?.workspaceId) {
      this.activeWorkspaceSubject.next(null);
    }

    console.log("Workspace deleted", workspaceId);
  }
  private onUpdateWorkspaceName(workspace: Workspace) {
    var workspaces = this.workspacesSubject.getValue();
    var existingWorkspace = workspaces.find(x => x.id == workspace.id);
    if (existingWorkspace == null) {
      return;
    }

    existingWorkspace.name = workspace.name;
    this.workspacesSubject.next([...workspaces]);
    console.log("Workspace name updated", workspace);
  }
  private onError(error: any) {
    console.error("Hub error", error);
  }
}
