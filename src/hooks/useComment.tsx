import { timeStamp } from 'console'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { decrement } from '../components/counter/counterSlice'
import { projectFirestore, projectStorage, timestamp, increment } from '../firebase/config'
import { addCommentCount, substractCommentCount } from '../pages/postSlice'

import { timeAgoCalculator } from '../util/timeAgoCalculator'

interface IAuthor {
  name: string,
  email: string,
  image?: string
}

interface ICommentOnAdd {
  text: string
  author: IAuthor
  post: {
    id: string,
    author: IAuthor
  }
}


interface IComment {
  text: string
  image?: string
  createdAt: string
  id: string
  author: IAuthor
}

//  { comment }: {comment: IComment}
export const useComment = () => {
  const dispatch = useDispatch()
  const [commentList, setCommentList] = useState<IComment[]>([])



  const fetchComments = async (postId: string) => {
    let commentList: any[] = []
    const collectionRef = projectFirestore.collection('comments')
    
    const result = (await (collectionRef.where("post", "==", postId).get())).docs.map(async doc => {

      const comment = (doc.data())
      const author = await comment.author.get()
      comment.author = await author.data()
      const time = await comment.createdAt.toDate()
      comment.createdAt = timeAgoCalculator(time)
      comment.id =  doc.id
      commentList = [...commentList, comment]
      await Promise.all(commentList)
      return commentList
    })

    await Promise.all(result)
    
    setCommentList(commentList)
  }
  
  const addComment = async ({ text, author, post } :ICommentOnAdd) => {
    const createdAt = timestamp()

    const userRef= projectFirestore.collection('users').doc(author.email)
    const postRef = projectFirestore.collection('posts').doc(post.id)
     const notificationRef = projectFirestore.collection('notifications')
    await notificationRef.add({ createdAt, postId: post.id, sender: author.name, recipient: post.author.email, type: 'comment', read: false })
    const commentRef = projectFirestore.collection('comments')
    await postRef.update({ comments: increment(1)})
    
    const commentAdded = commentRef.add({ post: post.id, author:userRef, text, createdAt })
    const id = (await commentAdded).id
    const time = timeAgoCalculator(new Date().getTime())
    const comment = { post: post.id, author, text, createdAt: time, id }
    // createdAt: 
    // return comment
  
    setCommentList([...commentList, comment])
    dispatch(addCommentCount(post.id))
  }

  const deleteComment = async (id: string, postId: string) => {
    const commentRef = projectFirestore.collection('comments').doc(id)
    const postRef = projectFirestore.collection('posts').doc(postId)
    await commentRef.delete() 
    await postRef.update({ comments: increment(-1)})
   
    setCommentList(commentList.filter(comment => comment.id !== id))
    dispatch(substractCommentCount(postId))
  }

  // return [commentList, fetchComments, addComment] as const
  return { commentList, fetchComments, addComment, deleteComment }
  

}