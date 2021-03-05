import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../app/store';

import { projectFirestore, projectStorage, timestamp, postsRef } from '../firebase/config'

import { timeAgoCalculator } from '../util/timeAgoCalculator'

interface IAuthor {
  name: string,
  email: string
}

interface IPostOnAdd {
  text: string
  image?: string
  author: IAuthor
}


interface IPost {
  text: string
  image?: string
  createdAt: string
  id: string
  author: IAuthor
  comments: number
}


interface PostState {
  posts: IPost[]
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected'
}


const initialState: PostState = {
  posts: [],
  status: 'idle'
};


export const fetchPosts = createAsyncThunk('posts/fetchPosts', 
  async () => {
    const collectionRef = projectFirestore.collection('posts')
    // const collectionRef = await projectFirestore.collection('posts').get()
    
    let postList: any[] = []

    const result =  (await (collectionRef.get())).docs.map(async doc => {

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

export const addPost = createAsyncThunk('posts/addPost', async ({ text, author, image } : IPostOnAdd) => {
  
  // const { text, image } = post
  const createdAt = timestamp()
  // const userRef: any = projectFirestore.collection('users').doc(user)
  // const author = await userRef.get().data()
  const postRef = projectFirestore.collection('posts')
  const userRef = projectFirestore.doc(`users/${author.email}`)
  postRef.add({ text, image, createdAt, author: userRef, comments: 0 })
  

    
})

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
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
      
      state.posts = action.payload
    })
    // .addCase(addPost.fulfilled, (state, action) => {
    //   state.posts.push(action.payload)
    // })

  }
});

export const {  } = postSlice.actions;

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

export default postSlice.reducer;
