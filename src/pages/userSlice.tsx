
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../app/store';
import { projectFirestore, timestamp, postsRef, auth } from '../firebase/config'

interface IUser {
  name: string
  email: string
  image?: string
}



interface IAuth {
  email: string
  password: string
}

interface UserState {
  user: IUser | null
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected'
}

const initialState: UserState = {
  user: null,
  status: 'idle'
}


export const login = createAsyncThunk('user/login', 
  async (userCredential: IAuth) => {
    if (!userCredential) {
      return null
    }
    const { email, password } = userCredential
    const userRef: any = projectFirestore.collection('users')
    try {
      await auth.signInWithEmailAndPassword(email, password)
      const userDoc = await userRef.doc(email).get()
      const user = userDoc.data()
      localStorage.setItem('user', JSON.stringify(user))
      
      return user
    } catch (e) {
      console.log(e.message)
    }
  }
) 

export const logout = createAsyncThunk('user/logout', 
  async () => {
    try{
      await auth.signOut()
      localStorage.removeItem('user')

    } catch (e) {
      console.error(e)
    }
  }
) 



export const updateUser = createAsyncThunk('user/update', async ({ name, image, email } : IUser) => {
  const userRef: any = projectFirestore.collection('users')
  try {
      // const userDoc = await userRef.doc(email).get()

    await userRef.doc(email).update({ name, image })
     
    } catch (e) {
      console.log(e.message)
    }
})


export const userSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    // addPost: (state, action: PayloadAction<IPost>) => {
    //   state.posts.push(action.payload)
    // },

  },
  extraReducers: builder => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload
    })
    .addCase(logout.fulfilled, (state) => {
      state.user = null
    })

  }
});

// export const { addPost } = userSlice.actions;



export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
