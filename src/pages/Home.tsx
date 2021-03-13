import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import Post from '../components/posts/Post';
import {
  fetchPosts,
  selectPost,
} from './postSlice';
import { selectUser } from './userSlice'
import { ReactComponent as ProfileIcon } from '../svg/profile.svg'

interface HomeProps {

}

const Home: React.FC<HomeProps> = ({}) => {
  const dispatch = useDispatch()
  const posts = useSelector(selectPost)
  const user = useSelector(selectUser) 
  useEffect(() => {
    dispatch(fetchPosts())

  }, [])
  console.log(posts)
  
console.log(user)
    return (
      <div className="flex justify-center items-start space-x-6 w-10/12 m-auto">
        <div className="bg-white sm:rounded-md shadow-md my-6 p-6 w-48 flex space-y-4 flex-col items-start">
          <h4 className="text-blue-500">Trending #</h4>
          <button className="tag-blue" >#lifestyle</button>
          <button className="tag-blue" >#mentalHealth</button>
          <button className="tag-blue" >#fashion</button>
          <button className="tag-blue" >#food</button>
          <button className="tag-blue" >#mood</button>
          <button className="tag-blue" >#music</button>
          <button className="tag-blue" >#life</button>
          <button className="tag-blue" >#thoughts</button>

        </div>
        <div className="col-start-2 col-span-2">
          
          {posts && posts.map(post => {
            return <div key={post.id}>
              <Post post={post} />
            </div>
          })}
        </div>
        <div className="bg-white sm:rounded-md shadow-md my-6 p-6 flex space-y-4 flex-col items-center flex-shrink-0 text-gray-800 w-64 text-center text-sm">
          {user?.image? <img src={user.image} className="rounded-full w-44 h-44 object-cover items-start flex-shrink-0"/> : <ProfileIcon className="mx-auto w-44 text-blue-600 fill-current"/>}

          <p >{user?.name}</p>
          <p>4 Posts</p> 
          <p>since 1 jan 2021</p>
          <p>Bio: Food is the greatest creation of god</p>
          <p>Location: Oslo, Norway</p>
        </div>
       
      </div>
    )
}
export default Home