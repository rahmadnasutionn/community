import * as config from '@/config';

function Footer() {
  return (
    <footer className='bg-zinc-100 mt-36 text-center py-4 border-t border-zinc-300'>
      <p className='text-lg text-center'>{config.copyright}</p>
    </footer>
  )
}

export default Footer;