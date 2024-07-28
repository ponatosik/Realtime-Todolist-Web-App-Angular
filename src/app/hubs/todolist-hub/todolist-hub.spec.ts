import { TodolistHub } from './todolist-hub';

describe('TodolistConnection', () => {
  it('should create an instance', () => {
    expect(new TodolistHub()).toBeTruthy();
  });
});
