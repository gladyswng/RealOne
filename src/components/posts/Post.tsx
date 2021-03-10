import React, { useState } from 'react'

import { ReactComponent as HeartIcon } from '../../svg/heart.svg'
import { ReactComponent as SaveIcon } from '../../svg/bookmark.svg'
import { ReactComponent as ProfileIcon } from '../../svg/profile.svg'
import { ReactComponent as ArrowDownIcon } from '../../svg/arrow_down.svg'
import { ReactComponent as RemoveIcon } from '../../svg/remove_filled.svg'
import Comment from './Comment'
import { addUserLike, removeUserLike, selectUser } from '../../pages/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { deletePost, addPostLike, removePostLike } from '../../pages/postSlice'

interface PostCardProps {
  post: {
    image?: string,
    text: string,
    createdAt: string
    author: {
      image?: string,
      name: string,
      email: string
    },
    id: string
    comments: number
    likes: number
    tags?: string[]
  }
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [ commentsShow, setCommnetsShow ] = useState<boolean>(false)
  // const [ heart, setHeart ] = useState<boolean>()
  const commentHandler = () => {
    setCommnetsShow(!commentsShow)
  }
 

  const likeHandler = () => {
    if(!user) {
      return
    }
    if (!user.likes.includes(post.id)) {
      
      dispatch(addPostLike({post, user}))
      dispatch(addUserLike(post.id))
    } else {
      dispatch(removePostLike({post, user}))
      dispatch(removeUserLike(post.id))
    }

  }
    return (
      <div>

        <div className="max-w-md mx-auto bg-white sm:rounded-md shadow-md my-6">
        
          <div className="relative">
            {post.image && <img className=" h-60 md:h-72 w-full object-cover" src={post.image} alt="Post image" />}

            {user && user.email ===post.author.email && <button className="flex-shrink-0 rounded-full focus:outline-none focus:ring-white absolute top-2 right-2" onClick={()=> {dispatch(deletePost({post: post}))}}>    
            <span className="sr-only">Delete Comment</span>
            <RemoveIcon className="h-7 fill-current bg-white rounded-full text-blue-500 "/></button>}
          </div>
          <div className="p-8 ">
            <div className="flex justify-between w-full">
                <div className="flex items-center">
                  <button className="bg-gray-100 flex flex-shrink-0 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-white" id="user-menu" aria-haspopup="true">
                    {post.author.image?<img className="h-8 w-8 rounded-full object-cover flex-shrink-0" src={post.author.image} alt="" /> : <ProfileIcon className="h-8 text-blue-500 fill-current"/>}
                  </button>
                  <span className="text-gray-600 pl-2">{post.author.name}</span>
                </div>

                <div className="flex space-x-2 items-center">
                  <span className="text-gray-700 text-sm">{post.likes} {post.likes > 1? 'likes': 'like'}</span>
                  <button className={`${user?.likes.includes(post.id)? 'text-red-500' : 'text-gray-400'}`} onClick={likeHandler}><HeartIcon /></button>
                  <div className="text-blue-500"><SaveIcon /></div>
                </div>

              </div>

              <p className="mt-2 text-gray-700 break-words">{post.text}</p>

              {post.tags && 
                (<div className="mt-4 flex space-x-2">
                  {post.tags.map(tag => {
                    return <span className="tag-blue" key={tag}>#{tag}</span>
                  })}
                </div>)}
              <div className="flex justify-between w-full">
                <p className="text-gray-500 text-sm mt-4">{post.createdAt} ago</p>

                <button className="pt-4 text-sm text-gray-700 focus:text-blue-500 border-none focus-within:outline-none flex" onClick={commentHandler}>
                  <span className="flex-shrink-0">{post.comments} {post.comments < 2 ? 'comment' : 'comments'}
                  </span>
                  <ArrowDownIcon className="h-5 ml-1 fill-current"/>
                </button>
                

              </div>
              <div hidden={!commentsShow} 
               style={{ transition: 'all 3s ease-in-out', height: commentsShow ? '100%' : '0' }}
              className="transition ease-out duration-100 transform opacity-0 scale-95  opacity-100 scale-100">

                <Comment post={post} postComments={post.comments}/>
              </div>
              
            </div>

       
        </div>

      </div>

    )
}
export default PostCard