import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../components/posts/Post';
import { ReactComponent as SearchIcon } from '../svg/search.svg'
import { fetchTopicPosts, selectTopicPost } from './postSlice';
interface TopicsProps {

}

const Topics: React.FC<TopicsProps> = ({}) => {
  const [ searchText, setSearchText ] = useState<string>()
    const posts = useSelector(selectTopicPost);
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(fetchTopicPosts({topic: 'food'}))

    }, [])
    console.log(posts)

  const hotTagsList = ['lifestyle', 'fashion', 'food', 'brunch', 'book']
  const inputHandler = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement  
    setSearchText(target.value)
  }

  const searchHandler = () => {

  }
  return (
    <div className="flex flex-col justify-center w-9/12 m-auto">

      <div className="p-2 text-sm flex items-center">
        <label htmlFor="tags" className="sr-only">Search Topics
        </label>
        <input id="tags" name="tags" placeholder="Search Topics" className="border border-gray-300 rounded-md p-1 mr-4 flex-grow-1" onInput={inputHandler} />
        <button className="text-blue-500 rounded-full" onClick={searchHandler}>
          <SearchIcon className="h-8 fill-current"/>
        </button>
        <div className="ml-4 flex space-x-2 items-end text-blue-500">
            <span>HOT:</span>
            {hotTagsList.map(tag => {
              return <span className="tag-blue" key={tag}>#{tag}</span>
            })}
        </div>

      </div>
      <div>
        {posts.map(post => {
          return (
            <PostCard post={post} key={post.id}/>
          )
        })}
      </div>
    </div>
    
    
  )
}
export default Topics