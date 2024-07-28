import { TestBed } from '@angular/core/testing';

import { WorkspacesHubService } from './workspaces-hub.service';

describe('HubConnectionService', () => {
  let service: WorkspacesHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkspacesHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
