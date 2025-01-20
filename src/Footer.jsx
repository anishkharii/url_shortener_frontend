import { Github, Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className=' h-10 flex flex-col items-center justify-center gap-2 absolute bottom-10 w-full'>
        <p className='text-xs'>Created with ❣️ by Anish Khari</p>
        <div className='bg-slate-100 backdrop-blur shadow-md rounded-full px-5 py-2 flex gap-3'>

            <a href='https://github.com/anishkharii/url_shortener_frontend' target='_blank'><Github className='cursor-pointer hover:text-blue-600 transition-all'/></a>
            <a href='https://www.linkedin.com/in/anish-khari-992207247/' target='_blank'><Linkedin className='cursor-pointer hover:text-blue-600 transition-all'/></a>
        </div>
        <Link to='/urls' className='underline text-xs hover:text-blue-500'>View All URLs</Link>
    </div>
  )
}

export default Footer