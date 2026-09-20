import { Archive, CheckCircle2, Clock3 } from 'lucide-react'

export const PROJECT_STATUSES = ['completed', 'in-progress', 'archived']

export const PROJECT_STATUS_CONFIG = {
  completed: { bg: 'rgba(16,185,129,.12)', color: '#10b981', label: 'Completed', icon: CheckCircle2 },
  'in-progress': { bg: 'rgba(245,158,11,.12)', color: '#f59e0b', label: 'In Progress', icon: Clock3 },
  archived: { bg: 'rgba(148,163,184,.12)', color: '#94a3b8', label: 'Archived', icon: Archive },
}
