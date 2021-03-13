
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { create } from 'domain';
import { send } from 'process';
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

export const addMessage = createAsyncThunk('message/addMessage', async ({messageData }: {messageData: IMessageOnAdd}) => {
  const { recipient, sender, message } = messageData
  const createdAt = timestamp()
})

export const fetchmessages = createAsyncThunk('message/fetchmessages', async ({ user }: {user: string}) => {
  let messageList:any[] = []

  // const userRef = projectFirestore.collection('users')
  const messageRef = projectFirestore.collection('messages')
  const userRef = projectFirestore.collection('users')
  

  const messagesSnapshot = await messageRef.where('access', 'array-contains', user).get()
  // Get all messages
  const result = messagesSnapshot.docs.map(async doc => {
    const message = doc.data()
    const contactEmail = message.access.filter((user:any) => user !== '123123@123.com').toString()
    const contactRef = await userRef.doc(contactEmail).get()
    const userData = contactRef.data()

    message.contact = {name: userData?.name, email: userData?.email, image: userData?.image}
    // const sender = await senderRef.data()
    // message.sender = {name: sender.name, email: sender.email, image: sender.image}
    
    const time = await message.createdAt.toDate()
    message.createdAt = timeAgoCalculator(time)
    message.id = doc.id
  

    messageList = [...messageList, message]
    await Promise.all(messageList)
    return messageList
  })
  await Promise.all(result)

 
  // sort messages after conversation users
  const totalUnreadCount = messageList.filter(message => !message.read).length

  const sortedMessageList = messageList.reduce((acc, message,_, currentList) => {
  
    if (acc.every((messageData: any) => messageData.contact.email !== message.contact.email)) {
      acc.push({
        contact: message.contact,
        conversation: [],
        unreadCount: 0
      })
    }
    const messageIndex = acc.findIndex((messageData: any) => messageData.contact.email === message.contact.email)
    if (!message.read) {
      acc[messageIndex].unreadCount += 1
    }
    acc[messageIndex].conversation.push(message)
    acc[messageIndex].lastContacted = currentList[currentList.length-1].createdAt

    return acc
  }, [])

      // const unsortedSenderList = action.payload.map(message => message.sender)
      // const senderList = unsortedSenderList.filter((user, index, self) => self.findIndex(u => u.name === user.name) === index)
     //     if (acc.every((messageData: any) => !messageData.access.includes(sender) && sender !== '123123@123.com')) {
    //   acc.push({
    //     sender: message.sender,
    //     conversation: [],
    //     unreadCount: 0
    //   })
    // }
    // // console.log(currentList)

    // const messageIndex = acc.findIndex((messageData: any) => messageData.sender === sender && sender !== '123123@123.com')
    // console.log(messageIndex)
 // populate user data
  // const contactEmailList  = sortedMessageList.map((m:any) => m.contact)
  // const contactRef = projectFirestore.collection('users')
  // let contactList:any = []
  // const contactDetails = await contactEmailList.map(async (con:any) => {
  //   const contactDoc = await contactRef.doc(con).get()
  //   const contact = contactDoc.data()
  //   const contactInfo = { name: contact?.name, email: contact?.email, image: contact?.image}
  //   contactList = [...contactList, contactInfo]
  //   await Promise.all(contactList)
  //   return contactList
  // })
  // await Promise.all(contactDetails)
  // console.log(contactList)


  // await Promise.all(sortedMessageList)
  // const senderList = sortedMessageList.map((messageData: any) => { return {...messageData.sender, unreadCount: messageData.unreadCount}})
  // console.log(senderList)
  return { sortedMessageList, totalUnreadCount}

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
