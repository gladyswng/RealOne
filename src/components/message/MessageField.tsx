import React, { useState } from 'react'
import AutoTextArea from '../share/AutoTextArea'

interface MessageFieldProps {

}

const MessageField: React.FC<MessageFieldProps> = ({}) => {
  const [ inputValue, setInputValue ] = useState<string>()

  const inputHandler = (e:React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    setInputValue(target.value)

  }
  const messageSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(inputValue)
  } 


  return (

                
      <form onSubmit={messageSubmitHandler} className="pt-4 w-full flex items-end">

        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
        </label>
        <AutoTextArea className="w-full resize-none block border-gray-200 rounded-md text-gray-700 text-sm focus:ring-transparent focus:border-transparent overflow-hidden" name="message" placeholder="Leave a message" onInput={inputHandler} />
        <button className=" btn-blue bg-blue-500 ml-2" type="submit" >Send</button>
      </form>
  
  )
}
export default MessageField