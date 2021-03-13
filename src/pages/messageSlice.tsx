
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { create } from 'domain';
import { AppThunk, RootState } from '../app/store';
import { projectFirestore, timestamp, postsRef, auth, projectStorage } from '../firebase/config'
import { timeAgoCalculator } from '../util/timeAgoCalculator';




interface IMessage {
  createdAt: string
  read: boolean
  recipient: string
  sender: string
  id: string
  access: string[]
}


interface IMessageOnAdd {
  recipient: string
  sender: string
  message: string
}


interface IMessageState {
  messages: IMessage[]
  senderList: {
    name: string
    image?: string
  } []
  conversation: IMessage[]
  unreadCount: number
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected'
}

const initialState: IMessageState = {
  messages: [],
  senderList: [],
  conversation: [],
  unreadCount: 0,
  status: 'idle'
}

export const addMessage = createAsyncThunk('message/addMessage', async ({messageData }: {messageData: IMessageOnAdd}) => {
  const { recipient, sender, message } = messageData
  const createdAt = timestamp()
})

export const fetchmessages = createAsyncThunk('message/fetchmessages', async ({ user }: {user: string}) => {
  let messageList:any[] = []

  // const userRef = projectFirestore.collection('users')
  const messageRef = projectFirestore.collection('messages')

  const messagesSnapshot = await messageRef.where('access', 'array-contains', user).get()

  const result = messagesSnapshot.docs.map(async doc => {
    const message = doc.data()
  
    const senderRef = await message.sender.get()
    const sender = await senderRef.data()
    message.sender = {name: sender.name, email: sender.email, image: sender.image}
    
    const time = await message.createdAt.toDate()
    message.createdAt = timeAgoCalculator(time)
    message.id = doc.id
    messageList = [...messageList, message]

    await Promise.all(messageList)
    return messageList
  })
  await Promise.all(result)
 
  return messageList

})

export const updatemessages = createAsyncThunk('message/updatemessages ', async ({ user }: {user: string}) => {
  console.log('dispatched update')
  const batch = projectFirestore.batch()
  const messages = await projectFirestore.collection('messages').where('recipient', '==', user).get()
  messages.forEach(doc => {
    batch.update(doc.ref, { read: true })
  })
  await batch.commit()
   

})


export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    getConversation: (state, action) => {
      state.messages.filter(message => message.sender === action.payload)
      
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchmessages.fulfilled, (state, action) => {
      
      state.unreadCount = action.payload.filter(message => !message.read).length
      
      // const senderList = [...new Set (action.payload.map(message => message.sender))] 
      const unsortedSenderList = action.payload.map(message => message.sender)
      const senderList = unsortedSenderList.filter((user, index, self) => self.findIndex(u => u.name === user.name) === index)
      console.log(senderList)

      // const conversation = action.payload.filter(message => message.access.includes('1234@123.com'))
      // console.log(conversation)
      state.senderList = senderList
      state.messages = action.payload
    })
    .addCase(updatemessages.fulfilled, (state, action) => {
      state.unreadCount = 0
      state.messages.forEach(note => note.read = true)

    })



  }
});

export const {  } = messageSlice.actions;



export const selectMessages = (state: RootState) => state.message.messages
export const selectUndreadCount = (state: RootState) => state.message.unreadCount

export default messageSlice.reducer;
