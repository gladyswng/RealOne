import React from 'react'
import { ReactComponent as AddIcon } from '../../svg/add.svg'
import { ReactComponent as AlertIcon } from '../../svg/alert.svg'
import { ReactComponent as MenuIcon } from '../../svg/menu.svg'
import { ReactComponent as CloseIcon } from '../../svg/close.svg'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../../pages/userSlice'
import { ReactComponent as ProfileIcon } from '../../svg/profile.svg'


interface NavbarProps {

}

const Navbar: React.FC<NavbarProps> = ({}) => {

  const user = useSelector(selectUser)
  
    return (
      <nav className="bg-blue-500">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:bg-blue-700 focus:outline-none focus:ring-inset focus:ring-white" aria-expanded="false">
                <span className="sr-only">Main Menu</span>
                <MenuIcon className="block h-6 w-6"/>

                <CloseIcon className="hidden h-6 w-6"/>
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <div className="hidden sm:block sm:ml-6">
                <div className="flex space-x-4">
                  
                  <Link to="/home" className="bg-blue-900 text-white px-3 py-2 rounded-md text-sm font-medium">Feed</Link>
                  <a href="#" className="btn-blue text-sm ">Topics</a>
                  <a href="#" className="btn-blue text-sm ">Saved</a>
                  <a href="#" className="btn-blue text-sm ">Message</a>
                </div>
              </div>
            </div>



            <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button className="bg-blue-900 p-1 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-900 focus:ring-white">
                <span className="sr-only">Add post</span>
                <Link to="/login" >
                  <span>LOGIN</span>
                </Link>
              </button>
              <button className="bg-blue-900 p-1 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-900 focus:ring-white">
                <span className="sr-only">Add post</span>
                <Link to="/addPost" >
                  <AddIcon />
                </Link>
              </button>
              <button className="bg-blue-900 p-1 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-900 focus:ring-white">
                <span className="sr-only">View notifications</span>
              
                <AlertIcon />
              </button>

            
              <div className="ml-3 relative">
                <div>
                  <Link to="/profile" className="bg-gray-800 flex text-blue-500 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu" aria-haspopup="true">
                    <span className="sr-only">Open user menu</span>
                    {user?.image ? <img className="h-8 w-8 rounded-full object-cover" src={user.image} alt="" /> : <ProfileIcon className="w-8 fill-current"/>}

                  </Link>
                </div>
                
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 hidden" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Your Profile</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Settings</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Sign out</a>
                </div>
              </div>
            </div>
          </div>


          <div className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              
              <Link to="/home" className="bg-blue-900 text-white block px-3 py-2 rounded-md text-base font-medium">Feed</Link>
              <a href="#" className="btn-blue block">Topics</a>
              <a href="#" className="btn-blue block">Saved</a>
              <a href="#" className="btn-blue block">Message</a>
              
            </div>
          </div>
        </div>
      </nav>
    )
}
export default Navbar