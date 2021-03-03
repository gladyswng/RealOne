import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import Post from '../components/posts/Post';
import {
  fetchPosts,
  selectPost,
} from './postSlice';

interface HomeProps {

}

const Home: React.FC<HomeProps> = ({}) => {
  const posts = useSelector(selectPost);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPosts())

  }, [])
  console.log(posts)
  

    return (
      <div>
        {posts.map(post => {
          return <div key={post.id}>
           

            <Post post={post} />
          </div>
        })}
      </div>
    )
}
export default Home