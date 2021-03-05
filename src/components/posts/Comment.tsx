import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CommentField from './CommentField'
import { useComment } from '../../hooks/useComment'
import { ReactComponent as ProfileIcon } from '../../svg/profile.svg'
import { selectUser } from '../../pages/userSlice'
interface CommentProps {
  postId: string
  postComments: number | undefined
}

const Comment: React.FC<CommentProps> = ({ postId, postComments}) => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  // const commentList = useSelector(selectComments)
  const [ commentsShow, setCommnetsShow ] = useState<boolean>(false)
  const [ comment, setComment ]= useState<string>()
  
  const { fetchComments, addComment, commentList } = useComment()

  console.log(commentList)
  
  useEffect(() => {
    // console.log(postId)
    // if (commentList) {
    //   dispatch(fetchComments({postId}))
    // }
    // TODO - Swtich to if post
    if (postComments) {
      console.log(postId)
      fetchComments(postId)
    }
    
  }, [])
  

  // const commentSubmitHandler = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   if (!comment || !user || comment === '') {
  //     return
  //   }
  //   console.log(user.email, comment, postId)
  //   addComment({ author:user, text: comment, postId })
  //   // dispatch(addComment({ author: user.email, text: comment, postId }))
  //   setComment('')
  // }
  // const inputHandler = (e:React.FormEvent<HTMLTextAreaElement>) => {
  //   const target = e.target as HTMLTextAreaElement
    
  //   setComment(target.value)
  // }
  return (
    <div className="pt-4 ">
                  
      {commentList.map(comment => {
        
        return (
          <div>
            <div className="flex items-center w-full text-sm text-gray-800 pt-2">
              <button className="bg-gray-100 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-white" id="user-menu" aria-haspopup="true">
                {comment.author.image?<img className="h-6 w-6 rounded-full object-cover" src={comment.author.image} alt="" /> : <ProfileIcon className="h-6 text-blue-500 fill-current"/>}
              </button>
              <span className="text-gray-800 pl-2">{comment.author.name}</span>
              <p className="ml-2">{comment.text}</p>
            </div>
            <p className="text-gray-800 text-xs pt-1">{comment.createdAt} ago</p>
            {user?.email === comment.author.email && (
              <button>delete</button>
            )} 

          </div>

        )

      })}
      {user && <CommentField postId={postId} addComment={addComment} user={user}/>}
      {/* <div className="pt-4 w-full flex items-end ">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
        </label>
        <AutoTextArea className="w-full resize-none block border-gray-200 rounded-md text-gray-700 text-sm focus:ring-transparent focus:border-transparent overflow-hidden" name="comment" placeholder="Leave a comment" onInput={inputHandler} value={comment}/>
        <button className=" btn-blue bg-blue-500 ml-2" onClick={commentSubmitHandler} >Send</button>

      </div> */}

    
      
    </div>
  )
}
export default Comment