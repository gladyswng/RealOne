import { createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../app/store';

import { projectFirestore, projectStorage, timestamp, increment, arrayUnion, arrayRemove } from '../firebase/config'

import { timeAgoCalculator } from '../util/timeAgoCalculator'

interface IUser {
  name: string,
  email: string,
  likes: string[]
}

interface IPostOnAdd {
  text: string
  image?: string
  author: IUser
  tags?: string[]
}


interface IPost {
  text: string
  image?: string
  createdAt: string
  id: string
  author: {
    name: string,
    email: string
  }
  comments: number
  tags?: string[]
  likes: number
  
}


interface PostState {
  posts: IPost[],
  topicPosts: IPost[],
  postListStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected',
  error: string | null
}


const postsAdaptor = createEntityAdapter({})
const initialState: PostState = {
  posts: [],
  topicPosts: [],
  postListStatus: 'idle',
  error: null
};



export const fetchPosts = createAsyncThunk('posts/fetchPosts', 
  async () => {
    // try {
    // } catch (e) {
    //   console.log(e)
    // }
    const collectionRef = projectFirestore.collection('posts')
    // const collectionRef = await projectFirestore.collection('posts').get()
    
    let postList: any[] = []

    const result =  (await (collectionRef.get())).docs.map(async doc => {

      const post = (doc.data())
      const author = await post.author.get()
      const authorData = await author.data()
      post.author = { name: authorData.name, email: authorData.email, image: authorData.image }
      const time = await post.createdAt.toDate()  
      post.createdAt = timeAgoCalculator(time)
      // post.createdAt = await post.createdAt.toDate().toDateString()  
      post.id = doc.id
      postList=[...postList, post]
      await Promise.all(postList)
      return postList
    })

    await Promise.all(result)
    return postList

   

  }
) 

export const fetchTopicPosts = createAsyncThunk('posts/fetchTopicPosts', 
  async ({topic}: {topic: string}) => {
 
    const collectionRef = projectFirestore.collection('posts')
    // const collectionRef = await projectFirestore.collection('posts').get()
    
    let postList: any[] = []

    const result =  (await (collectionRef.where('tags', 'array-contains', topic).get())).docs.map(async doc => {

      const post = (doc.data())
      
      const author = await post.author.get()
      post.author = await author.data()
      const time = await post.createdAt.toDate()  
      post.createdAt = timeAgoCalculator(time)
      // post.createdAt = await post.createdAt.toDate().toDateString()  
      post.id = doc.id
      postList=[...postList, post]
      await Promise.all(postList)
      return postList
    })

    await Promise.all(result)
    return postList
 

  }
) 

export const addPost = createAsyncThunk('posts/addPost', async ({ text, author, image, tags } : IPostOnAdd) => {
  
  // const { text, image } = post
  const createdAt = timestamp()
  // const userRef: any = projectFirestore.collection('users').doc(user)
  // const author = await userRef.get().data()
  const postRef = projectFirestore.collection('posts')
  const userRef = projectFirestore.doc(`users/${author.email}`)
  
  const newPost = { text, image, createdAt, author: userRef, comments: 0, likes: 0, tags }
  postRef.add(newPost)
  
  return {text, image, comments: 0, likes: 0, tags  }
    
})

export const deletePost = createAsyncThunk('posts/deletePost', async ({post } : {post: IPost}) => {
  
  const postRef = projectFirestore.collection('posts').doc(post.id)
  const commentRef =  projectFirestore.collection('comments')


  if (post.comments > 0) {
    const comments = await commentRef.where("post", "==", post.id).get()
    const batch = projectFirestore.batch()
    comments.forEach(doc => {
    
      batch.delete(doc.ref)
    })
    await batch.commit()
    
  }
  if (post.image) {

    await projectStorage.refFromURL(post.image).delete()
  }
  await postRef.delete() 

  return post.id
      
})

export const addPostLike = createAsyncThunk('posts/addLike', async ({post, user } : {post: IPost, user: IUser}) => {
  const postRef = projectFirestore.collection('posts').doc(post.id)
  const userRef = projectFirestore.collection('users').doc(user.email)
  const notificationRef = projectFirestore.collection('notifications')
  const createdAt = timestamp()
  await postRef.update({ likes: increment(1)})
  await userRef.update({ likes: arrayUnion(post.id) })
  await notificationRef.add({ createdAt, postId: post.id, sender: user.name, recipient: post.author.email, type: 'like', read: false })
  return post.id
}
)

export const removePostLike = createAsyncThunk('posts/removeLike', async ({post, user } : {post: IPost, user: IUser}) => {
  const postRef = projectFirestore.collection('posts').doc(post.id)
  const userRef = projectFirestore.collection('users').doc(user.email)
  await postRef.update({likes: increment(-1)})
  await userRef.update({ likes: arrayRemove(post.id) })
  return post.id
})

// export const toggleLikePost = createAsyncThunk('posts/likePost', async ({post, user } : {post: IPost, user: IUser}) => {
//   const postRef = projectFirestore.collection('posts').doc(post.id)
//   const userRef = projectFirestore.collection('users').doc(user.email)
//   const liked = user.likes.includes(post.id)

//   if (liked) {
//     await postRef.update({likes: increment(-1)})
//     await userRef.update({ likes: arrayRemove(post.id) })
 
//   } else {

//     await postRef.update({ likes: increment(1)})
//     await userRef.update({ likes: arrayUnion(post.id) })
//   }
      
// })

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {

    addCommentCount: (state, action) => {
      const postIndex = state.posts.findIndex(post => post.id === action.payload)
      console.log(state.posts[postIndex].comments)
      state.posts[postIndex].comments += 1
    },

    substractCommentCount: (state, action) => {
      const postIndex = state.posts.findIndex(post => post.id === action.payload)
      state.posts[postIndex].comments -= 1
    }
    
    // addPost: (state, action: PayloadAction<IPost>) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.posts.push(action.payload)
    // },
    // decrement: state => {
    //   state.value -= 1;
    // },
    // // Use the PayloadAction type to declare the contents of `action.payload`
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
  },
  extraReducers: builder => {
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      
      state.postListStatus = 'fulfilled'
      if (action.payload) 
      state.posts = action.payload
    })
    .addCase(fetchPosts.pending, (state, action) => {
      state.postListStatus = 'pending'
    })
    .addCase(fetchPosts.rejected, (state, action) => {
      state.postListStatus = 'rejected'
      if (action.error.message) {

        state.error = action.error.message
      }
    })
    .addCase(deletePost.fulfilled, (state, action) => {
    
      state.posts = state.posts.filter(post => post.id !== action.payload)
    })
    // .addCase(addPost.fulfilled, (state, action) => {
    //   state.posts.push(action.payload)
    // })
    .addCase(fetchTopicPosts.fulfilled, (state, action) => {
   
      state.topicPosts = action.payload
    })
    .addCase(addPostLike.fulfilled, (state, action) => {
      const postIndex = state.posts.findIndex(post => post.id === action.payload)
      state.posts[postIndex].likes += 1
    })
    .addCase(removePostLike.fulfilled, (state, action) => {
      const postIndex = state.posts.findIndex(post => post.id === action.payload)
      state.posts[postIndex].likes -= 1
    })
    .addCase(addPost.fulfilled, (state, action) => {
      // state.posts.push(action.payload)
      console.log(action.payload)
    })


  }
});

export const { substractCommentCount, addCommentCount } = postSlice.actions

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = (amount: number): AppThunk => dispatch => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };



 
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectPost = (state: RootState) => state.post.posts;
export const selectTopicPost = (state: RootState) => state.post.topicPosts;

export default postSlice.reducer;
