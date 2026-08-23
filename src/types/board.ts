export const columnOrder = ['backlog', 'in-progress', 'review', 'done'] as const
export type ColumnId = (typeof columnOrder)[number]

export type Priority = 'low' | 'medium' | 'high'

export type BoardTask = {
  id: number
  title: string
  description: string
  status: ColumnId
  priority: Priority
  assigneeId: number
  dueDate: string
  sprintId: number
  order: number
  createdAt: string
  completedAt: string | null
  updatedAt: string
  comments: string[]
}

export type BoardFixture = {
  tasks: Omit<BoardTask, 'comments'>[]
}