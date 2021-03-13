import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchmessages, selectMessages,   } from './messageSlice'
import { selectUser } from './userSlice'
interface MessageProps {

}

const Message: React.FC<MessageProps> = ({}) => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const messages = useSelector(selectMessages)
  console.log(messages)
  // const senderList = useSelector(selectSenderList)
  const [ currentContact, setCurrentContact ] = useState<any>()
  const [ currentChat, setCurrentChat ] = useState<any>([])
  useEffect(() => {

    if (user) {
      
      dispatch(fetchmessages({user: user.email}))
    }
  },[user])

  useEffect(() => {
    if (messages && currentContact) {
      setCurrentChat(() => {
        const currentMessageData = messages.find(m => m.contact.email === currentContact.email)
        return currentMessageData?.conversation
      })
    }
  }, [currentContact])

  console.log(currentChat)
  console.log(currentContact)
  const contactClickHandler = (contact: any) => {
    setCurrentContact(contact)
  }
  return (
    <div className="flex h-screen justify-center m-auto">
      
      {user && (
      
      <div className="bg-white sm:rounded-md shadow-md my-6 mx-2 h-4/6 divide-y">
        {messages.map(messageData => {
          return (
          <div key={messageData.contact.email} onClick={()=> contactClickHandler(messageData.contact)}>
            <div className="flex p-4">
              {messageData.contact.image && <img src={messageData.contact.image} className="h-10 w-10 rounded-full"/>}
              <p>{messageData.contact.name}</p>
              <p>{messageData.unreadCount}</p>
              <p>{messageData.lastContacted} Ago</p>

            </div>
            
          </div>)
        })}

      </div>
      )}
      {currentChat && user &&  (

        <div className="bg-white sm:rounded-md shadow-md my-6 h-4/6 py-6 px-10 col-span-2">
          {currentChat.map((messageData: any) => {
            return (
              <div key={messageData.id} >
                
               {messageData.sender===user?.email? 
                
                <div className="flex py-4 justify-end ">
                  <p className="text-gray-700 pr-6 w-9/12 bg-blue-200 mr-4 p-4 text-sm rounded-md">{messageData.message}</p> 
                  <div className="flex-shrink-0">
                    <p>{user.name}</p>
                    {user.image && <img src={user.image} className="rounded-full h-10 w-10 flex-shrink-0"/>}

                  </div>
                </div>
                 
                 :

                <div className="flex py-4">
                  <div className="flex-shrink-0">
                    <p>{currentContact.name}</p>
                    {currentContact.image && <img src={currentContact.image} className="rounded-full h-10 w-10 flex-shrink-0"/>}

                  </div>
                 <p className="text-gray-700 ml-4 p-4 w-9/12 bg-gray-200 rounded-md text-sm">{messageData.message}</p> 
                 
                </div>
              }
              </div>
            )
          })}

        </div>
      )}
   
      
      
      
      
    </div>
  )
}
export default Message