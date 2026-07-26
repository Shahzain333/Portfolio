const Loader = ({ fullScreen = false }) => {

  const spinner = <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full 
  animate-spin" />

  if (fullScreen)

    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-950">
              {spinner}
           </div>

  return <div className="flex justify-center items-center py-16">{spinner}</div>

}

export default Loader