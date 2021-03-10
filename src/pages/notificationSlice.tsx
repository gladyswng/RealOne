
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
  type: 'like' | 'comment'
}





interface INotificationState {
  notifications: INotification[]
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected'
}

const initialState: INotificationState = {
  notifications: [],
  status: 'idle'
}


export const fetchNotifications = createAsyncThunk('notification/fetchNotifications', async ({ user }: {user: string}) => {
  let notificationList:any[] = []
  // const userRef = projectFirestore.collection('users')
  const notificationRef = projectFirestore.collection('notifications')

  const notificationsSnapshot = await notificationRef.where('recipient', '==', user ).get()
  const result = notificationsSnapshot.docs.map(async doc => {
    const notification = doc.data()
    const time = await notification.createdAt.toDate()
    notification.createdAt = timeAgoCalculator(time)
    notificationList = [...notificationList, notification]

    await Promise.all(notificationList)
    return notificationList
  })
  await Promise.all(result)
  return notificationList

})


export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {

  },
  extraReducers: builder => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
     
      state.notifications = action.payload
    })



  }
});

export const {  } = notificationSlice.actions;



export const selectnotification = (state: RootState) => state.notification.notifications;

export default notificationSlice.reducer;
