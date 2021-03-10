import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../components/counter/counterSlice';
import postReducer from '../pages/postSlice'
import userReducer from '../pages/userSlice'
import notificationReducer from '../pages/notificationSlice'

// import { firebaseReducer } from 'react-redux-firebase'

// interface Profile {
//   name: string
//   email: string
// }
// interface Post {
//   text: string
// }

// interface RootState {
//   firebase: FirebaseReducer.Reducer<Profile, Post>
// }


export const store = configureStore({
  reducer: {
    post: postReducer,
    user: userReducer,
    notification: notificationReducer,
    counter: counterReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
