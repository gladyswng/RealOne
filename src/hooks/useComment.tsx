import { timeStamp } from 'console'
import { useState } from 'react'
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
  id?: string
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
    const commentId = (await commentAdded).id
    console.log(commentId)
    const time = timeAgoCalculator(new Date().getTime())
    const comment = { post: postId, author, text, createdAt: time } 
    // createdAt: 
    // return comment
    setCommentList([...commentList, comment])

  }

  // return [commentList, fetchComments, addComment] as const
  return { commentList, fetchComments, addComment }
  

}