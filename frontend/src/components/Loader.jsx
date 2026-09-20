const Loader = ({ fullScreen = false }) => {
	const spinner = (
		<div className="flex flex-col items-center justify-center gap-4">
			<div className="relative flex items-center justify-center">
				<div
					className="absolute inset-0 rounded-full blur-xl opacity-70"
					style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.26), transparent 70%)' }}
				/>
				<div
					className="h-14 w-14 rounded-full border-[3px] animate-spin"
					style={{
						borderColor: 'var(--clr-border)',
						borderTopColor: 'var(--clr-primary)',
						borderRightColor: 'var(--clr-accent)',
						boxShadow: '0 18px 40px rgba(79, 70, 229, 0.18)',
					}}
				/>
			</div>

			<div
				className="flex items-center gap-2 text-sm font-semibold tracking-[0.22em] uppercase"
				style={{ color: 'var(--clr-text-3)' }}
			>
				<span
					className="inline-block h-2 w-2 rounded-full animate-pulse"
					style={{ background: 'var(--clr-primary)' }}
				/>
				Loading
			</div>
		</div>
	)

	if (fullScreen) {
		return (
			<div
				className="fixed inset-0 z-50 flex items-center justify-center"
				style={{ background: 'rgba(15,23,42,0.32)', backdropFilter: 'blur(6px)' }}
			>
				{spinner}
			</div>
		)
	}

	return <div className="flex items-center justify-center py-20">{spinner}</div>
}

export default Loader
