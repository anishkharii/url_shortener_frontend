import { Github, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <div className=' h-10 flex flex-col items-center justify-center gap-2 absolute bottom-10 w-full'>
        <p className='text-xs'>Created with ❣️ by Anish Khari</p>
        <div className='bg-slate-100 rounded-full px-5 py-2 flex gap-3'>

            <a href='#' target='_blank'><Github className='cursor-pointer hover:text-blue-600'/></a>
            <a href='#' target='_blank'><Linkedin className='cursor-pointer hover:text-blue-600'/></a>
        </div>
    </div>
  )
}

export default Footer