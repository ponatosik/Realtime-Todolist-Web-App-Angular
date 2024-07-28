import * as SignalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

export abstract class HubClient {
  public isConnected$ = new BehaviorSubject(false);
  protected hubConnection: SignalR.HubConnection;

  constructor(hubUrl: string) {
    this.hubConnection = new SignalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .build();
  }

  public connect() {
    if (!this.isConnected$.getValue())
      this.hubConnection
        .start()
        .then(() => this.isConnected$.next(true));
  }

  public disconnect() {
    if (this.isConnected$.getValue())
      this.hubConnection
        .stop()
        .then(() => this.isConnected$.next(false));
  }

  public wireUpCallbacks(hub: object, methodPrefix: string = 'on'): void {
    for (const methodName of Object.getOwnPropertyNames(Object.getPrototypeOf(hub))) {
      const callback = (hub as any)[methodName];
      if (typeof callback === 'function' && methodName !== 'constructor') {
        if (methodName.startsWith(methodPrefix)) {
          let callbackName = methodName.substring(methodPrefix.length)
          let callbackFunction = callback.bind(hub) as (...args: any[]) => void
          this.hubConnection.on(callbackName, callbackFunction);
        }
      }
    }
  }
}
