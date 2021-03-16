import React, { useState } from 'react'

import { ReactComponent as HeartIcon } from '../../svg/heart.svg'
import { ReactComponent as SaveIcon } from '../../svg/bookmark.svg'
import { ReactComponent as ProfileIcon } from '../../svg/profile.svg'
import { ReactComponent as ArrowDownIcon } from '../../svg/arrow_down.svg'
import { ReactComponent as RemoveIcon } from '../../svg/remove_filled.svg'
import { ReactComponent as CommentIcon } from '../../svg/comment.svg'
import Comment from './Comment'
import { addUserLike, removeUserLike, selectUser } from '../../pages/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { deletePost, addPostLike, removePostLike } from '../../pages/postSlice'
import { useHistory } from 'react-router-dom'
import { createContact } from '../../pages/messageSlice'

interface PostCardProps {
  post: {
    image?: string,
    text: string,
    createdAt: string
    author: IPostAuthor,
    id: string
    comments: number
    likes: number
    tags?: string[]
  }
}

interface IPostAuthor {
  image?: string,
  name: string,
  email: string
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const dispatch = useDispatch()
  const history = useHistory()
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

  const contactClickHandler = (postAuthor: IPostAuthor) => {
    dispatch(createContact(postAuthor))
    history.push('/message')
  }
    return (
      <div>

        <div className="max-w-md mx-auto bg-white sm:rounded-md shadow-md my-6">
        
          <div className="relative">
            

            {user && user.email ===post.author.email && <button className="flex-shrink-0 rounded-full focus:outline-none focus:ring-white absolute top-2 right-2" onClick={()=> {dispatch(deletePost({post: post}))}}>    
            <span className="sr-only">Delete Comment</span>
            <RemoveIcon className="h-7 fill-current bg-white rounded-full text-blue-500 "/></button>}
          </div>
          
          <div className="p-6 ">
            
            <div className="flex justify-between w-full items-start">
              
                <div className="flex items-center">
                  <button className="bg-gray-100 flex flex-shrink-0 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-white" id="user-menu" aria-haspopup="true">
                    {post.author.image?<img className="h-12 w-12 rounded-full object-cover flex-shrink-0" src={post.author.image} alt="" /> : <ProfileIcon className="h-8 text-blue-500 fill-current"/>}
                  </button>
                  <div className="pl-4">

                    <p className="text-gray-600 ">{post.author.name}</p>
                    <p className="text-gray-500 text-sm">{post.createdAt} ago</p>
                  </div>
                </div>
                {user && user.email !==post.author.email && <button className="text-blue-500 mt-0 border-blue-500 text-sm px-1 rounded-md focus:outline-none " onClick=
                {() => contactClickHandler(post.author) }>Send Message</button>}

                
              </div>

              <p className="mt-6 text-gray-700 break-words">{post.text}</p>
              

              {post.tags && 
                (<div className="mt-4 flex space-x-2">
                  {post.tags.map(tag => {
                    return <span className="tag-blue" key={tag}>#{tag}</span>
                  })}
                </div>)}
              
              
          </div>
          {post.image && <img className=" h-60 md:h-72 w-full object-cover" src={post.image} alt="Post image" />}
          
          <div className="p-6 ">

            <div className="flex items-center w-full divide-x text-sm justify-end ">
              

              <span className="flex-shrink-0 text-gray-700">{post.comments} {post.comments < 2 ? 'comment' : 'comments'}
              </span>
              <button className="text-gray-500 focus:text-blue-500 border-none focus-within:outline-none flex pr-4" onClick={commentHandler}>
                
                <CommentIcon className="h-6 ml-2 fill-current"/>
              </button>
              <span className="text-gray-700 pl-4">{post.likes} {post.likes > 1? 'likes': 'like'}</span>
              
              <button className={`${user?.likes.includes(post.id)? 'text-red-500' : 'text-gray-500'} text-sm border-none focus-within:outline-none flex items-center`} onClick={likeHandler}>
                
                <HeartIcon className="h-6 ml-2"/>
              </button>
              {/* <div className="text-blue-500"><SaveIcon /></div> */}

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