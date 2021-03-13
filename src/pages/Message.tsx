import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchmessages, selectMessages } from './messageSlice'
import { selectUser } from './userSlice'
interface MessageProps {

}

const Message: React.FC<MessageProps> = ({}) => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const messages = useSelector(selectMessages)
  console.log(messages)
  useEffect(() => {

    if (user) {
      console.log('dispatched')
      dispatch(fetchmessages({user: user.email}))
    }
  },[user])
  return (
    <div className="grid grid-cols-3 h-screen">
      <div className="mx-auto bg-white sm:rounded-md shadow-md my-6 h-4/6">
        hi
      </div>
    </div>
  )
}
export default Message