import { PROJECT_STATUS_CONFIG } from '../constants/projectStatus'

export default function ProjectStatusBadge({ status, className = '' }) {
  const config = PROJECT_STATUS_CONFIG[status] || PROJECT_STATUS_CONFIG.completed
  const StatusIcon = config.icon

  return (
    <span
      className={`badge text-xs font-semibold ${className}`}
      style={{
        background: 'rgba(0,0,0,.58)',
        color: '#fff',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,.16)',
      }}
    >
      <StatusIcon size={12} style={{ color: config.color }} /> {config.label}
    </span>
  )
}
