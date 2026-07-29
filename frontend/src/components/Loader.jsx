const Loader = ({ fullScreen = false }) => {

  const spinner = (

    <div className="flex flex-col items-center justify-center gap-3">
      
      <div className="w-10 h-10 rounded-full border-2 animate-spin"
        style={{ borderColor: 'var(--clr-border)', borderTopColor: 'var(--clr-primary)' }} />
      <span className="text-sm" style={{ color: 'var(--clr-text-3)' }}>Loading…</span>

    </div>
  
  )
  
  if (fullScreen) return (
    
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(4px)' }}>
    
      {spinner}
    
    </div>

  )

  return <div className="flex items-center justify-center py-20">{spinner}</div>

}

export default Loader