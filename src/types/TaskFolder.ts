import { Task } from "@/components/TaskCard";

export interface TaskFolder {
  id: string;
  name: string;
  tasks: Task[];
  bibleBook?: string;
}