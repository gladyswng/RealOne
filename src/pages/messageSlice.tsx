
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { create } from 'domain';
import { send } from 'process';
import { AppThunk, RootState } from '../app/store';
import { projectFirestore, timestamp, postsRef, auth, projectStorage } from '../firebase/config'
import { timeAgoCalculator } from '../util/timeAgoCalculator';




interface IMessage {
  
  message: string
  read: boolean
  id: string
  createdAt: string
  sender: string
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
    contact: ISender
    conversation: IMessage[]
    lastContacted: string
    unreadCount: number
  }[]
  senderList: ISender[]
  
  currentConversation: IMessage[]
  totalUnreadCount: number
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected'
}

const initialState: IMessageState = {
  messageList: [],
  senderList: [],
  currentConversation: [],
  totalUnreadCount: 0,
  status: 'idle'
}



export const fetchmessages = createAsyncThunk('message/fetchmessages', async ({ user }: {user: string}) => {
  let messageList:any[] = []

  const messageRef = projectFirestore.collection('messages')
  const userRef = projectFirestore.collection('users')
  

  const messagesSnapshot = await messageRef.where('access', 'array-contains', user).get()
  // Get all messages
  const result = messagesSnapshot.docs.map(async doc => {
    const message = doc.data()
    const contactEmail = message.access.filter((u:any) => u !== user).toString()
    const contactRef = await userRef.doc(contactEmail).get()
    const userData = contactRef.data()

    message.contact = {name: userData?.name, email: userData?.email, image: userData?.image}
    const time = await message.createdAt.toDate()
    message.createdAt = timeAgoCalculator(time)
    message.id = doc.id
  

    messageList = [...messageList, message]
    await Promise.all(messageList)
    return messageList
  })
  await Promise.all(result)

 
  // sort messages after conversation users
  const totalUnreadCount = messageList.filter(message => !message.read && message.sender === message.contact.email).length

  const sortedMessageList = messageList.reduce((acc, message,_, currentList) => {
  
    if (acc.every((messageData: any) => messageData.contact.email !== message.contact.email)) {
      acc.push({
        contact: message.contact,
        conversation: [],
        unreadCount: 0
      })
    }
    const messageIndex = acc.findIndex((messageData: any) => messageData.contact.email === message.contact.email)
    if (!message.read && message.sender === message.contact.email) {
      acc[messageIndex].unreadCount += 1
    }
    acc[messageIndex].conversation.push(message)
    acc[messageIndex].lastContacted = currentList[currentList.length-1].createdAt

    return acc
  }, [])

  return { sortedMessageList, totalUnreadCount}

})
export const addMessage = createAsyncThunk('message/addMessage', async ({messageData }: {messageData: IMessageOnAdd}) => {
  const { recipient, sender, message } = messageData
  const createdAt = timestamp()
  const messageRef = projectFirestore.collection('messages')
  messageRef.add({ access: [recipient, sender], createdAt, message, read: false, recipient, sender })
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
      state.messageList.filter(message => message.contact.email === action.payload)
      
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchmessages.fulfilled, (state, action) => {
      
      console.log(action.payload)
      state.messageList = action.payload.sortedMessageList
   
      state.totalUnreadCount = action.payload.totalUnreadCount
      // state.senderList = action.payload.senderList
      

    })
    .addCase(addMessage.fulfilled, (state, action) => {
      
    })
    .addCase(updatemessages.fulfilled, (state, action) => {
      // state.unreadCount = 0
      // state.messageList.forEach(note => note.read = true)

    })



  }
});

export const {  } = messageSlice.actions;



export const selectMessages = (state: RootState) => state.message.messageList
export const selectUndreadCount = (state: RootState) => state.message.totalUnreadCount
// export const selectSenderList = (state: RootState) => state.message.senderList

export default messageSlice.reducer;
