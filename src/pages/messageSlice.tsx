
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { create } from 'domain';
import { AppThunk, RootState } from '../app/store';
import { projectFirestore, timestamp, postsRef, auth, projectStorage } from '../firebase/config'
import { timeAgoCalculator } from '../util/timeAgoCalculator';




interface IMessage {
  
  createdAt: string
  read: boolean
  recipient: string
  sender: {
    email: string
    image?: string
    name: string
  }
  id: string
  access: string[]
}


interface IMessageOnAdd {
  recipient: string
  sender: string
  message: string
}

interface ISender {
  name: string
  image?: string
  email: string
}

interface IMessageState {
  messageList: {
    sender: {
      conversation: IMessage[]
      lastContacted: string
      unreadCount: number

    }
  }[]
  senderList: ISender[]
  
  currentConversation: IMessage[]
  unreadCount: number
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected'
}

const initialState: IMessageState = {
  messageList: [],
  senderList: [],
  currentConversation: [],
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
  // Get all messages
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
 
  // sort messages after user
  const unreadCount = messageList.filter(message => !message.read).length
  console.log(messageList)
  const userRef: any = projectFirestore.collection('users')
  const sortedMessageList = await messageList.reduce((acc, message,_, currentList) => {
    const sender = message.sender.email
    if (!acc[sender]) {
      console.log(sender)
      // const userDoc = await userRef.doc(sender).get()
      // const user = await userDoc.data()
      
      // console.log(user)
      acc[sender] = {}
      acc[sender].sender = message.sender
      // acc[sender].senderInfo = {name: user.name, email: user.email, image: user.image}
      acc[sender].conversation = []
      acc[sender].unreadCount = 0
    
    }
    if (!message.read) {
      acc[sender].unreadCount += 1
    }
    acc[sender].conversation.push(message)
    acc[sender].lastContacted = currentList[currentList.length-1].createdAt
    
    console.log(acc)
    return acc
  }, [])
  console.log(sortedMessageList)
  // await Promise.all(sortedMessageList)
  return { sortedMessageList, unreadCount}

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
      state.messageList.filter(message => message.sender === action.payload)
      
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchmessages.fulfilled, (state, action) => {
      
      
      
      console.log(action.payload)
     
      // const unsortedSenderList = action.payload.map(message => message.sender)
      // const senderList = unsortedSenderList.filter((user, index, self) => self.findIndex(u => u.name === user.name) === index)

    })
    .addCase(updatemessages.fulfilled, (state, action) => {
      // state.unreadCount = 0
      // state.messageList.forEach(note => note.read = true)

    })



  }
});

export const {  } = messageSlice.actions;



export const selectMessages = (state: RootState) => state.message.messageList
export const selectUndreadCount = (state: RootState) => state.message.unreadCount

export default messageSlice.reducer;
