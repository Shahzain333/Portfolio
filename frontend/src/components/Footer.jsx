import { Mail } from 'lucide-react'

const footers = [
  { href: 'https://github.com', icon: Mail },
  { href: 'https://linkedin.com', icon: Mail },
  { href: 'mailto:you@email.com', icon: Mail },
]

const Footer = () => (
  
  <footer className="mt-10 py-8 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-t 
    border-gray-200 dark:border-gray-800">

    <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
    
      <p className="text-sm text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} Portfolio. All rights reserved.</p>
    
      <div className="flex items-center gap-4">
        {footers.map(({ href, icon: Icon }) => (
    
          <a key={href} href={href} target="_blank" rel="noreferrer"
            className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <Icon size={20} />
          </a>
  
        ))}
  
      </div>
  
    </div>
  
  </footer>
  
)
export default Footer