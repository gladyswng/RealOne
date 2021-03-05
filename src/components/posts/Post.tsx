import React, { useState } from 'react'

import { ReactComponent as HeartIcon } from '../../svg/heart.svg'
import { ReactComponent as SaveIcon } from '../../svg/bookmark.svg'
import { ReactComponent as ProfileIcon } from '../../svg/profile.svg'
import AutoTextArea from '../share/AutoTextArea'
import Comment from './Comment'

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
  }
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {



    return (
      <div>

        <div className="max-w-md mx-auto bg-white sm:rounded-md shadow-md my-6">
          <div className="">
            <div className="">
              {post.image && <img className=" h-60 md:h-72 w-full object-cover" src={post.image} alt="Post image" />}
            </div>
            <div className="p-8 ">
              <div className="flex justify-between w-full">
                <div className="flex items-center">
                  <button className="bg-gray-100 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-white" id="user-menu" aria-haspopup="true">
                    {post.author.image?<img className="h-8 w-8 rounded-full object-cover" src={post.author.image} alt="" /> : <ProfileIcon className="h-8 text-blue-500 fill-current"/>}
                  </button>
                  <span className="text-gray-600 pl-2">{post.author.name}</span>
                </div>

                <div className="flex space-x-2">

                  <div className="text-red-500"><HeartIcon /></div>
                  <div className="text-blue-500"><SaveIcon /></div>
                </div>

              </div>

              <p className="mt-2 text-gray-700">{post.text}</p>
              <div className="mt-4 flex space-x-2">
                <span className="tag-blue">#food</span>
                <span className="tag-blue">#fashion</span>
                <span className="tag-blue">#lifestyle</span>
              </div>
              <div className="flex justify-between w-full">
                <p className="text-gray-500 text-sm mt-4">{post.createdAt} ago</p>

                <p className="pt-4 text-sm text-gray-700">{post.comments} {post.comments < 2 ? 'comment' : 'comments'}</p>
                

              </div>
                <Comment postId={post.id} postComments={post.comments}/>
                
              </div>

          </div>
        </div>

      </div>

    )
}
export default PostCard