import React from 'react'
import { ReactComponent as HeartIcon } from '../../svg/heart.svg'
import { ReactComponent as CommentIcon } from '../../svg/comment.svg'

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
    <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
      {notifications.map(note => {
        return (
          <div key={note.id} className="flex text-gray-600 font-light text-sm p-3 hover:bg-gray-100 hover:text-gray-900">
            
              {note.type === 'like' && (
                <div className={`${note.read? 'text-gray-300':'text-red-600'} flex items-center`}>
                  <HeartIcon className="fill-current h-5"/>
                </div>
              )}
              {note.type === 'comment' && (
                <div className="text-red-500">
                  <CommentIcon className="fill-current"/>
                </div>
              )}

              <span className="font-medium ml-1">{note.sender}</span> <span>&nbsp;{note.type=== 'like'? 'liked' : 'commented on'}&nbsp;</span><span> your post</span>
            </div>

  
        )
      })}
    </div>
  )
}
export default Notification