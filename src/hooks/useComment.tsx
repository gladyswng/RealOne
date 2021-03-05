import { timeStamp } from 'console'
import { useCallback, useState } from 'react'
import { decrement } from '../components/counter/counterSlice'
import { projectFirestore, projectStorage, timestamp, increment } from '../firebase/config'

import { timeAgoCalculator } from '../util/timeAgoCalculator'

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


interface IComment {
  text: string
  image?: string
  createdAt: string
  id: string
  author: IAuthor
}

//  { comment }: {comment: IComment}
export const useComment = () => {
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
  
  const addComment = async ({ text, author, postId } :ICommentOnAdd) => {
    const createdAt = timestamp()
    const userRef= projectFirestore.collection('users').doc(author.email)
    const postRef = projectFirestore.collection('posts').doc(postId)
    const commentRef = projectFirestore.collection('comments')
    await postRef.update({ comments: increment(1)})
    
    const commentAdded = commentRef.add({ post: postId, author:userRef, text, createdAt })
    const id = (await commentAdded).id
    const time = timeAgoCalculator(new Date().getTime())
    const comment = { post: postId, author, text, createdAt: time, id } 
    // createdAt: 
    // return comment
    setCommentList([...commentList, comment])

  }

  const deleteComment = async (id: string, postId: string) => {
    const commentRef = projectFirestore.collection('comments').doc(id)
    const postRef = projectFirestore.collection('posts').doc(postId)
    await commentRef.delete() 
    await postRef.update({ comments: increment(-1)})
   
    setCommentList(commentList.filter(comment => comment.id !== id))
  }

  // return [commentList, fetchComments, addComment] as const
  return { commentList, fetchComments, addComment, deleteComment }
  

}