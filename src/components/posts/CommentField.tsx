import React, { useState } from 'react'
import AutoTextArea from '../share/AutoTextArea'
import { selectUser } from '../../pages/userSlice'
import { useSelector } from 'react-redux'
import { useComment } from '../../hooks/useComment'


interface IAuthor {
  name: string,
  email: string,
  image?: string
}

interface ICommentOnAdd {
  text: string
  author: IAuthor
  postId: string
}

interface CommentFieldProps {
  postId: string
  user: IAuthor
  addComment: ({ text, author, postId }: ICommentOnAdd) => Promise<void>
}

const CommentField: React.FC<CommentFieldProps> = ({ postId, addComment, user }) => {
  // const user = useSelector(selectUser)
  const [ comment, setComment ]= useState<string>()
  // const {  addComment } = useComment()
  const commentSubmitHandler = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!comment || comment === '') {
      return
    }

    addComment({ author:user, text: comment, postId })
    // dispatch(addComment({ author: user.email, text: comment, postId }))
    setComment('')
  }
  const inputHandler = (e:React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    
    setComment(target.value)
  }
  return (
    <div className="pt-4 w-full flex items-end ">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
        </label>
        <AutoTextArea className="w-full resize-none block border-gray-200 rounded-md text-gray-700 text-sm focus:ring-transparent focus:border-transparent overflow-hidden" name="comment" placeholder="Leave a comment" onInput={inputHandler} value={comment}/>
        <button className=" btn-blue bg-blue-500 ml-2" onClick={commentSubmitHandler} >Send</button>

      </div>

  )
}
export default CommentField