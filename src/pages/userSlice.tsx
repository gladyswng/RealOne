
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../app/store';
import { projectFirestore, timestamp, postsRef, auth, projectStorage } from '../firebase/config'

interface IUser {
  name: string
  email: string
  image?: string
  likes: string[]
  contacts: ISender[]
}

interface ISender {
  name: string
    image: string
    email: string
}

interface IUserUpdate {
  name: string
  email: string
  image?: string
  oldImage?: string 
  likes: string[]
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
    let senderList:any = []
    try {
      await auth.signInWithEmailAndPassword(email, password)
      const userDoc = await userRef.doc(email).get()
      let user = userDoc.data()
      localStorage.setItem('user', JSON.stringify(user.email))
      const result = await user.contacts.map(async (sender: any) => {
        const senderRef = await userRef.doc(sender).get()
        const senderData = senderRef.data()
        
        const senderInfo = {...senderData, id: senderRef.id }
        senderList = [...senderList, senderInfo]
        await Promise.all(senderList)
        return senderList
      })
      await Promise.all(result)
      console.log(senderList)
      user = {...user, contacts: senderList}
      
      return user
    } catch (e) {
      console.log(e.message)
    }
  }
) 

export const logout = createAsyncThunk('user/logout',
  async () => {
     console.log('login out') 
    try{
      await auth.signOut()
      localStorage.removeItem('user')

    } catch (e) {
      console.error(e)
    }
  }
) 


export const updateUser = createAsyncThunk('user/update', async (user:IUserUpdate) => {
  //{ name, image, email, oldImage } : IUserUpdate
  const { name, image, email, oldImage } = user
  
  const userRef: any = projectFirestore.collection('users')
  if (oldImage && image && oldImage !== image) {
    await projectStorage.refFromURL(oldImage).delete()
  }

  try {
    
    await userRef.doc(email).update({ name, image })
    // const updatedUser = { name, image, email, likes, messages }
    return { name, image }

     
    } catch (e) {
      console.log(e.message)
    }
})

// export const fetchUserByEmail = createAsyncThunk('user/retrieve', async ({email}: {email:string}) => {
  
// })

export const retrieveUser = createAsyncThunk('user/retrieve', async ({email}: {email:string}) => {
  let senderList:any = []
  const userRef: any = projectFirestore.collection('users')
  const userDoc = await userRef.doc(email).get()
  let user = userDoc.data()
  
  
  const result = await user.contacts.map(async (sender: any) => {
    const senderRef = await userRef.doc(sender).get()
    const senderData = senderRef.data()
    const senderInfo = { name: senderData.name, email: senderData.email, image: senderData.image }
    senderList = [...senderList, senderInfo]
    await Promise.all(senderList)
    return senderList
  })
  await Promise.all(result)
 
  user = {...user, contacts: senderList}


  return user
})
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUserLike: (state, action) => {
      state.user?.likes.push(action.payload)
    },
    removeUserLike: (state, action) => {
      if (state.user) {

        state.user.likes = state.user?.likes.filter(post => post !== action.payload)
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload
    })
    .addCase(logout.fulfilled, (state) => {
      state.user = null
    })
    .addCase(retrieveUser.fulfilled, (state, action) => {
      state.user = action.payload
    })
    .addCase(updateUser.fulfilled, (state, action) => {
      // Is this right?
      if (!action.payload || !state.user) {
        return
      }
      const { name, image } = action.payload
      state.user = {...state.user, name, image}

    })


  }
});

export const { addUserLike, removeUserLike } = userSlice.actions;



export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
