import React from 'react'

// import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';


// import { AppThunk, RootState } from '../app/store';

// import { projectFirestore, projectStorage, timestamp, increment } from '../firebase/config'

// import { useTimeSince } from '../hooks/useTimeSince'


// interface IAuthor {
//   name: string,
//   email: string,
//   image?: string
// }

// interface ICommentOnAdd {
//   text: string
//   author: string
//   postId: string
// }


// interface IComment {
//   text: string
//   image?: string
//   createdAt: string
//   id?: string
//   author: IAuthor
// }


// interface CommentState {
//   comments: IComment[] | null
//   status: 'idle' | 'pending' | 'fulfilled' | 'rejected'
// }


// const initialState: CommentState = {
//   comments: [],
//   status: 'idle'
// };


// export const fetchComments = createAsyncThunk('comments/fetchComments', async ({postId}:{postId: string}) => {
//   let commentList: any[] = []
//   const collectionRef = projectFirestore.collection('comments')
  
//   const result = (await (collectionRef.where("post", "==", postId).get())).docs.map(async doc => {

//     const comment = (doc.data())
//     const author = await comment.author.get()
//     comment.author = await author.data()
//     const time = await comment.createdAt.toDate()
//     comment.createdAt = useTimeSince(time)
//     commentList = [...commentList, comment]
//     await Promise.all(commentList)
//     return commentList
//   })

//   await Promise.all(result)
//   console.log(commentList)
//   return commentList
// })
// // export const fetchPosts = createAsyncThunk('posts/fetchPosts', 
// //   async () => {
// //     const collectionRef = projectFirestore.collection('posts')
// //     // const collectionRef = await projectFirestore.collection('posts').get()
    
// //     let postList: any[] = []

// //     const result =  (await (collectionRef.get())).docs.map(async doc => {
// //       console.log(doc.data())
// //       const post = (doc.data())
// //       const author = await post.author.get()
// //       post.author = await author.data()
// //       const time = await post.createdAt.toDate()  
// //       post.createdAt = useTimeSince(time)
// //       // post.createdAt = await post.createdAt.toDate().toDateString()  
// //       post.id = doc.id
// //       postList=[...postList, post]
// //       await Promise.all(postList)
// //       return postList
// //     })

// //     await Promise.all(result)
// //     return postList

// //   }
// // ) 

// export const addComment = createAsyncThunk('comments/addComments', async ({ text, author, postId } :ICommentOnAdd) => {

//   const createdAt = timestamp()
//   const userRef= projectFirestore.collection('users').doc(author)
//   const postRef = projectFirestore.collection('posts').doc(postId)
//   const commentRef = projectFirestore.collection('comments')
//   await postRef.update({ comments: increment(1)})
//   const comment = { post: postId, author:userRef, text, createdAt }
//   commentRef.add(comment)
//   // return comment

// })

// // export const addPost = createAsyncThunk('posts/addPost', async ({ text, author, image } : IPostOnAdd) => {  
// //   console.log(author)
// //   // const { text, image } = post
// //   const createdAt = timestamp()
// //   // const userRef: any = projectFirestore.collection('users').doc(user)
// //   // const author = await userRef.get().data()
// //   const postRef = projectFirestore.collection('posts')
// //   const userRef = projectFirestore.doc(`users/${author.email}`)
// //   postRef.add({ text, image, createdAt, author: userRef})
  

    
// // })

// export const commentSlice = createSlice({
//   name: 'comment',
//   initialState,
//   reducers: {

//   },
//   extraReducers: builder => {
//     builder.addCase(fetchComments.fulfilled, (state, action) => {
//       state.comments = action.payload
//     })
//     // builder.addCase(addComment.fulfilled, (state, action) => {
//     //   state.comments!.push(action.payload)
//     // })
//     // .addCase(fetchPosts.fulfilled, (state, action) => {
//     //   console.log(action.payload)
//     //   state.posts = action.payload
//     // })
    

//   }
// });

// export const {  } = commentSlice.actions;

// // The function below is called a thunk and allows us to perform async logic. It
// // can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// // will call the thunk with the `dispatch` function as the first argument. Async
// // code can then be executed and other actions can be dispatched
// // export const incrementAsync = (amount: number): AppThunk => dispatch => {
// //   setTimeout(() => {
// //     dispatch(incrementByAmount(amount));
// //   }, 1000);
// // };



 
// // The function below is called a selector and allows us to select a value from
// // the state. Selectors can also be defined inline where they're used instead of
// // in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectComments = (state: RootState) => state.comment.comments

// export default commentSlice.reducer;
