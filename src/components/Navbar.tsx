import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../../@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../@/components/ui/avatar';
import { Popover, PopoverTrigger, PopoverContent } from '../../@/components/ui/popover';
import { Briefcase, Home, Info, LogOut, Menu, User, X } from 'lucide-react';
import { ModeToggle } from '../components/ToggleMode';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const isAuthenticated = true; // Replace with your authentication logic
  const handleLogout = () => {
    // Implement your logout logic here
  }
  const toggleMenu = () => {
    setOpen(!open);
  }
  return (
    <nav className='z-50 sticky top-0 bg-background/80 border-b backdrop-blur-md shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center'>
            <Link to='/' className='flex items-center gap-1 group'>
              <div className='text-2xl font-bold tracking-tight'>
                <span className='bg-linear-to-r from bg-blue-600 to-blue-800 bg-clip-text text-transparent'>Hire</span>
                <span className='text-red-500'>Heaven</span>
              </div>
            </Link>
          </div>
          {/** Desktop navigation */}
          <div className='hidden md:flex items-center space-x-1'>
            <Link to='/'>
              <Button variant={"ghost"} className='flex items-center gap-2 font-medium'>
                <Home size={16} />
                <span>HOME</span>
              </Button>
            </Link>
            <Link to='/jobs'>
              <Button variant={"ghost"} className='flex items-center gap-2 font-medium'>
                <Briefcase size={16} />
                <span>JOBS</span>
              </Button>
            </Link>
            <Link to='/about'>
              <Button variant={"ghost"} className='flex items-center gap-2 font-medium'>
                <Info size={16} />
                <span>ABOUT</span>
              </Button>
            </Link>
          </div>
          {/** Right side actions */}
          <div className='hidden md:flex items-center gap-3'>
            {
              isAuthenticated ? <Popover>
                <PopoverTrigger>
                  <button className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
                    <Avatar className='h-9 w-9 ring-2 ring-offset-2 ring-offset-background ring-blue-500/20 cursor-pointer hover:ring-blue-500/40 transition-all'>
                      <AvatarImage src='' alt='User Avatar' />
                      <AvatarFallback className='bg-blue-100 dark:bg-blue-900 text-blue-600'>S</AvatarFallback>
                    </Avatar>
                  </button>
                </PopoverTrigger>
                <PopoverContent className='w-56 p-2' align='end'>
                  <div className='px-3 py-2 mb-2 boorder-b'>
                    <p className='text-sm font-semibold'>Suvam</p>
                    <p className='text-xs opacity-60 truncate'>roysuvam1999@gmail.com</p>
                  </div>
                  <Link to='/account'>
                    <Button variant={"ghost"} className='w-full justify-start gap-2'>
                      <User size={16} />
                      <span>My profile</span>
                    </Button>
                  </Link>
                  <Button className='w-full justify-start gap-2 mt-1' variant={"destructive"} onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </Button>
                </PopoverContent>
              </Popover> : <Link to='/login'>
                <Button variant={"default"} className='flex items-center gap-2 font-medium'>
                  <User size={16} />
                  <span>LOGIN</span>
                </Button>
              </Link>
            }
            <ModeToggle />
          </div>
          {/** Mobile menu button */}
          <div className='md:hidden flex items-center gap-3'>
            <ModeToggle />
            <button onClick={toggleMenu} className='p-2 rounded-lg hover:bg-accent transition-colors' aria-label='Toggle menu'>
              {
                open ? <X size={24} /> : <Menu size={24} />
              }
            </button>
          </div>
        </div>
      </div>
      {/** Mobile menu content */}
      <div className={`md:hidden border-t overflow-hidden transition-all duration-300 ease-in-out ${open? "max-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className='px-3 py-3 space-y-1 bg-background/95 backdrop-blur-md'>
          {/** is authenticated or user */}
          <Link to='/' onClick={toggleMenu}>
            <Button variant={"ghost"} className='w-full justify-start gap-3 h-11'>
              <Home size={18} />
              <span>HOME</span>
            </Button>
          </Link>
          <Link to='/jobs' onClick={toggleMenu}>
            <Button variant={"ghost"} className='w-full justify-start gap-3 h-11'>
              <Briefcase size={18} />
              <span>JOBS</span>
            </Button>
          </Link>
          <Link to='/about' onClick={toggleMenu}>
            <Button variant={"ghost"} className='w-full justify-start gap-3 h-11'>
              <Info size={18} />
              <span>ABOUT</span>
            </Button>
          </Link>
          {
            isAuthenticated ? (<>
              <Link to='/about' onClick={toggleMenu}>
                <Button variant={"ghost"} className='w-full justify-start gap-3 h-11'>
                  <User size={18} />
                  <span>My profile</span>
                </Button>
              </Link>
              <Button variant={"destructive"} className='w-full justify-start gap-3 h-11' onClick={() => {
                handleLogout();
                toggleMenu();
              }}>
                <LogOut size={18} />
                <span>Logout</span>
              </Button>
            </>
            ) : (
              <Link to='/login' onClick={toggleMenu}>
                <Button variant={"default"} className='w-full justify-start gap-3 h-11 mt-2'>
                  <User size={18} />
                  <span>LOGIN</span>
                </Button>
              </Link>
            )
          }
        </div>
      </div>
    </nav>
  )
}

export default Navbar
