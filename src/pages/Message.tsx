import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchmessages, selectMessages, selectNewCreatedContact,   } from './messageSlice'
import { selectUser } from './userSlice'

import { ReactComponent as ProfileIcon } from '../svg/profile.svg'
import AutoTextArea from '../components/share/AutoTextArea'
import MessageField from '../components/message/MessageField'

interface MessageProps {

}

interface IContact {
  name: string
  email: string
  image?: string
}

interface IChat {
  message: string
  read: boolean
  id: string
  createdAt: string
  sender: string
}



const Message: React.FC<MessageProps> = ({}) => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const messages = useSelector(selectMessages)
  const newCreatedContact = useSelector(selectNewCreatedContact)
  // const senderList = useSelector(selectSenderList)
  const [ currentContact, setCurrentContact ] = useState<IContact>()
  const [ currentChat, setCurrentChat ] = useState<IChat[]>([])
  // const [ inputValue, setInputValue ] = useState<string>()


  useEffect(() => {
    if (user) { 
      dispatch(fetchmessages({user: user.email}))
    }
  },[user])

  useEffect(() => {
    if (messages && currentContact) {
      setCurrentChat((prevState) => {
        const currentMessageData = messages.find(m => m.contact.email === currentContact.email)
        if(currentMessageData) {
          return currentMessageData.conversation
        } else {
          return []
        }
      })
    }
  }, [currentContact])

  useEffect(() => {
    if (newCreatedContact) {
      setCurrentContact(newCreatedContact)
    }
  }, [])
 


  const contactClickHandler = (contact: any) => {
 
    setCurrentContact(contact)
  }
  console.log(currentContact)
  // const inputHandler = (e:React.FormEvent<HTMLTextAreaElement>) => {
  //   const target = e.target as HTMLTextAreaElement
  //   setInputValue(target.value)

  // }

  // const messageSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   console.log(inputValue)
  // } 


  return (
    <div className="flex h-screen justify-center m-auto">
      
      {user && messages && (
      
      <div className="bg-white sm:rounded-md shadow-md  mx-2 h-4/6 divide-y">
        {messages.map(messageData => {
          return (
          <div key={messageData.contact.email} className={`${messageData.contact.email===currentContact?.email&& 'bg-gray-100'} hover:bg-gray-100 w-48 flex p-4 relative`} onClick={()=> contactClickHandler(messageData.contact)}>
          
            {messageData.contact.image? <img src={messageData.contact.image} className="h-10 w-10 rounded-full"/> : <div className="text-blue-500 flex-shrink-0"><ProfileIcon className=" h-10 w-10 rounded-full fill-current"/></div> }
            <div className="ml-2">
              <span className="block">{messageData.contact.name}</span>
              <span className="block text-gray-500 text-sm">{messageData?.lastContacted} ago</span>
              

            </div>

     
            {messageData?.unreadCount > 0 && <span className="absolute top-4 right-8 bg-red-500 rounded-full text-white text-xs text-center w-4 h-4 ">{messageData.unreadCount}</span>}
            
          </div>)
        })}
        {/* Create new contact on list and set to current contact */}
        {newCreatedContact && !messages.some(message => message.contact.email === newCreatedContact.email) && <div key={newCreatedContact.email} className={`${newCreatedContact.email===currentContact?.email&& 'bg-gray-100'} hover:bg-gray-100 w-48 flex p-4 relative`} onClick={()=> contactClickHandler(newCreatedContact)}>
          
          {newCreatedContact.image? <img src={newCreatedContact.image} className="h-10 w-10 rounded-full"/> : <div className="text-blue-500 flex-shrink-0"><ProfileIcon className=" h-10 w-10 rounded-full fill-current"/></div> }
          <div className="ml-2">
            <span className="block">{newCreatedContact.name}</span>
          </div>
          
        </div>}
        

      </div>
      )}

        <div className="bg-white sm:rounded-md shadow-md h-4/6 py-6 px-10 flex flex-col justify-between w-9/12">
          { !currentContact && <div className="text-gray-500">No selected contact yet</div> }
          {currentChat && user && currentContact && (
            <div className="overflow-hidden">
              {currentChat.map((messageData: any) => {
                return (
                  <div key={messageData.id} >
                    
                  {messageData.sender===user?.email? 
                    
                    <div className="flex py-4 justify-end ">
                      <div className=" w-9/12 mr-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">{messageData.createdAt} ago</span>
                          <span className="block text-right">{user.name}</span>

                        </div>
                        <p className="text-gray-700 pr-6 w-full bg-blue-200 mr-4 p-4 text-sm rounded-md">{messageData.message}</p> 

                      </div>
                    
                        
                      {user.image && <img src={user.image} className="rounded-full h-10 w-10 flex-shrink-0"/>}

                    </div>
                    
                    :

                    <div className="flex py-4">
                    
                      {currentContact.image && <img src={currentContact.image} className="rounded-full h-10 w-10 flex-shrink-0"/>}
                      <div className="w-9/12 ml-4">
                        <div className="flex justify-between text-sm">
                        <span>{currentContact.name}</span>
                        <span className="text-gray-500">{messageData.createdAt} ago</span>

                        </div>
                        <p className="text-gray-700 p-4  bg-gray-200 rounded-md text-sm">{messageData.message}</p> 
                      </div>
                    
                    </div>
                  }
                  </div>
                )
              })}

            </div>
          )}
          <MessageField currentContact={currentContact}/>


        

        </div>
   
      
      
      
      
    </div>
  )
}
export default Message