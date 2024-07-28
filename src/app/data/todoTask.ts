export interface TodoTask {
  id: number;
  title: string;
  completed: boolean;
  order: number;
  deadline: Date | null;
}
