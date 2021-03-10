import React from 'react'

interface NotificationProps {

}

const Notification: React.FC<NotificationProps> = ({}) => {
  return (
    <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
      <div className="py-1" role="none">
        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Edit</a>
        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Duplicate</a>
      </div>
      <div className="py-1" role="none">
        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Archive</a>
        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Move</a>
      </div>
      <div className="py-1" role="none">
        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Share</a>
        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Add to favorites</a>
      </div>
      <div className="py-1" role="none">
        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Delete</a>
      </div>
    </div>
  )
}
export default Notification