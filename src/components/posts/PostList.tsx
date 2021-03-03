import React from 'react'
import PostCard from './Post'

interface PostListProps {

}

const PostList: React.FC<PostListProps> = ({}) => {

  const postsList = [
    {
      author: 'Name Name',
      avatar: 'https://images.unsplash.com/photo-1560090202-da24d0bed0e5?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Nnx8ZGFpbHklMjBsaWZlfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=60',
      img: 'https://images.unsplash.com/photo-1560090202-da24d0bed0e5?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Nnx8ZGFpbHklMjBsaWZlfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=60" alt="Man looking at item at a store" ',
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Est optio iusto error tempora quia omnis aliquid ea. ❤️',
      likes: 24,
      topics: ['lifestyle', 'food', 'fashion'],
      time: '9 days ago',
      // comments: [
      //   {
      //     author: 'Name Wong',
      //     avatar: '',
      //     comment: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia, alias?',
      //     time: ''
      //   }
      // ]
    }
  ]

  return (
    <div>
      {/* <PostCard />
      <PostCard />
      <PostCard />
      <PostCard /> */}
    </div>
  )
}
export default PostList