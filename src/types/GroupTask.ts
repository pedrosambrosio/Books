import { Task } from "@/components/TaskCard";

export interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: GroupMember[];
  inviteCode: string;
}

export interface GroupTask extends Task {
  groupId: string;
  assignedTo?: string[];
  category: 'group' | string;
}