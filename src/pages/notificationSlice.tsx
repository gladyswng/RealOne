
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { create } from 'domain';
import { AppThunk, RootState } from '../app/store';
import { projectFirestore, timestamp, postsRef, auth, projectStorage } from '../firebase/config'
import { timeAgoCalculator } from '../util/timeAgoCalculator';




interface INotification {
  createdAt: string
  postId: string
  read: boolean
  recipient: string
  sender: string
  id: string
  type: 'like' | 'comment'
}





interface INotificationState {
  notifications: INotification[]
  unreadCount: number
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected'
}

const initialState: INotificationState = {
  notifications: [],
  unreadCount: 0,
  status: 'idle'
}


export const fetchNotifications = createAsyncThunk('notification/fetchNotifications', async ({ user }: {user: string}) => {
  let notificationList:any[] = []
  // const userRef = projectFirestore.collection('users')
  const notificationRef = projectFirestore.collection('notifications')

  const notificationsSnapshot = await notificationRef.where('recipient', '==', user ).orderBy('createdAt', 'desc').get()
  const result = notificationsSnapshot.docs.map(async doc => {
    const notification = doc.data()
    const time = await notification.createdAt.toDate()
    notification.createdAt = timeAgoCalculator(time)
    notification.id = doc.id
    notificationList = [...notificationList, notification]

    await Promise.all(notificationList)
    return notificationList
  })
  await Promise.all(result)
  return notificationList

})

export const updateNotifications = createAsyncThunk('notification/updateNotifications ', async ({ user }: {user: string}) => {
  console.log('dispatched update')
  const batch = projectFirestore.batch()
  const notifications = await projectFirestore.collection('notifications').where('recipient', '==', user).get()
  notifications.forEach(doc => {
    batch.update(doc.ref, { read: true })
  })
  await batch.commit()
   

})


export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {

  },
  extraReducers: builder => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      
      state.unreadCount = action.payload.filter(notification => !notification.read).length
  
      state.notifications = action.payload
    })
    .addCase(updateNotifications.fulfilled, (state, action) => {
      state.unreadCount = 0
      state.notifications.forEach(note => note.read = true)

    })



  }
});

export const {  } = notificationSlice.actions;



export const selectNotification = (state: RootState) => state.notification.notifications
export const selectUndreadCount = (state: RootState) => state.notification.unreadCount

export default notificationSlice.reducer;
