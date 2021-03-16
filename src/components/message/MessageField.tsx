import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage } from '../../pages/messageSlice'
import { selectUser } from '../../pages/userSlice'
import AutoTextArea from '../share/AutoTextArea'

interface MessageFieldProps {
  currentContact: {
    name: string
    email: string
  } | undefined
}

const MessageField: React.FC<MessageFieldProps> = ({ currentContact }) => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [ inputValue, setInputValue ] = useState<string>()

  const inputHandler = (e:React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    setInputValue(target.value)

  }
  const messageSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (user && currentContact && inputValue) {
      dispatch(addMessage({
        messageData: {
          sender: user.email,
          recipient: currentContact.email,
          message: inputValue
        }
      }))

    } 

    setInputValue('')
  

  } 



  return (

                
      <form onSubmit={messageSubmitHandler} className="pt-4 w-full flex items-end">

        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
        </label>
        <AutoTextArea className="w-full resize-none block border-gray-200 rounded-md text-gray-700 text-sm focus:ring-transparent focus:border-transparent overflow-hidden" name="message" placeholder="Send a message" onInput={inputHandler} value={inputValue}/>
        <button className=" btn-blue bg-blue-500 ml-2" type="submit" >Send</button>
      </form>
  
  )
}
export default MessageField