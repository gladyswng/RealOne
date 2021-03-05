import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CommentField from './CommentField'
import { useComment } from '../../hooks/useComment'
import { ReactComponent as ProfileIcon } from '../../svg/profile.svg'
import { ReactComponent as RemoveIcon } from '../../svg/remove.svg'
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
  
  const {  commentList, fetchComments, addComment, deleteComment} = useComment()

  console.log(commentList)
  
  useEffect(() => {
    // console.log(postId)
    // if (commentList) {
    //   dispatch(fetchComments({postId}))
    // }
    // TODO - Swtich to if post
    if (postComments) {

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
    <div className="pt-4 justify-between">
                  
      {commentList.map(comment => {
        
        return (
          <div className="flex items-start" key={comment.id}>
            <div className="flex flex-shrink-0  items-start w-full text-sm text-gray-800 pt-2 ">
              <button className="bg-gray-100 flex flex-shrink-0 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-white" id="user-menu" aria-haspopup="true">
                {comment.author.image?<img className="h-8 w-8 rounded-full object-cover" src={comment.author.image} alt="" /> : <ProfileIcon className="h-8 text-blue-500 fill-current "/>}
              </button>
              <div className="pl-2 ">
                <span className="text-gray-800 whitespace-nowrap font-medium">{comment.author.name}</span>
                <span className="ml-2">{comment.text}</span>
                <p className="text-gray-800 text-xs pt-1">{comment.createdAt} ago</p>

              </div>
            </div>
            
            {user && user.email === comment.author.email && <button className="flex-shrink-0 rounded-full focus:outline-none focus:ring-white" onClick={() => deleteComment(comment.id, postId)}>
              <span className="sr-only">Delete Comment</span>
              <RemoveIcon className="h-5 fill-current  text-blue-500 "/></button>}
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