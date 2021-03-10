import React from 'react'
import { ReactComponent as HeartIcon } from '../../svg/heart.svg'
import { ReactComponent as CommentIcon } from '../../svg/comment.svg'
import { appendFile } from 'fs'

interface NotificationProps {
  notifications: {
    createdAt: string
    postId: string
    read: boolean
    recipient: string
    sender: string
    id: string
    type: 'like' | 'comment'
  }[]
}

const Notification: React.FC<NotificationProps> = ({ notifications }) => {
  return (
    <div className="absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
      {notifications.map(not => {
        return (
          <div  key={not.id} className="p-3 hover:bg-gray-100 hover:text-gray-900 rounded-md" >
            <div className="flex text-gray-800 font-light text-sm items-start ">
              
                {not.type === 'like' && (
                  <div className={`${not.read? 'text-gray-500':'text-red-600'} flex items-center`}>
                    <HeartIcon className="fill-current h-5"/>
                  </div>
                )}
                {not.type === 'comment' && (
                  <div className={`${not.read? 'text-gray-500':'text-blue-500'} flex items-center`}>
                    <CommentIcon className="fill-current h-5"/>
                  </div>
                )}
                <div className="ml-2">
                  <span className="font-medium flex-shrink-0">{not.sender}</span> <span>&nbsp;{not.type=== 'like'? 'liked' : 'commented on'}&nbsp;your post</span>
                  <p className="text-xs text-gray-600 mt-1">{not.createdAt} ago</p>

                </div>

            </div>

          </div>

  
        )
      })}
    </div>
  )
}
export default Notification