import React, { useEffect, useState } from 'react'
import { ReactComponent as PictureIcon } from '../svg/picture.svg'
import { ReactComponent as AddIcon } from '../svg/add_filled.svg'
import { ReactComponent as RemoveIcon } from '../svg/remove.svg'
import { ReactComponent as SpinnerIcon } from '../svg/spinner.svg'
import { useImageUpload } from '../hooks/useImageUpload'

import { projectFirestore, timestamp } from '../firebase/config'
import { useDispatch, useSelector } from 'react-redux'
import {
  addPost
} from './postSlice';
import {
  selectUser,
} from './userSlice';
import { useHistory } from 'react-router-dom'
import MultipleImageUpload from '../components/share/MultipleImageUpload'
import { unwrapResult } from '@reduxjs/toolkit'

interface AddPostProps {

}

const AddPost: React.FC<AddPostProps> = ({}) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)


  const { file, previewUrl, pickedHandler } = useImageUpload()

  const [ inputValue, setInputValue ] = useState<string>()
  const [ tagValue, setTagValue ] = useState<string>()
  const [ tagList, setTagList ] = useState<string[]>([])

  const [ requestStatus, setRequestStatus ] = useState('idle')




  const inputHandler = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    setInputValue(target.value)
  }
  const tagsHandler = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    setTagValue(target.value)
  }

  const tagAddHandler = (e:React.MouseEvent) => {
    e.preventDefault()
    if (!tagValue) {
      return
    } 
    const tagExisted = tagList.includes(tagValue) 
    if (!tagExisted) {
      setTagList([...tagList, tagValue])
    }
  }

  const tagRemoveHandler = (tagItem: string) => {
    setTagList(tagList.filter(tag => tag !== tagItem))
  }
  // submit and check status
  
  const canSend = [previewUrl, inputValue, user].every(Boolean) && requestStatus === 'idle'
  const submitHandler = async (e:React.MouseEvent) => {
    e.preventDefault()
    if (canSend ) {
      
      try {
        setRequestStatus('pending')
        const resultAction = await dispatch(addPost({ text: inputValue!, image: previewUrl, author: user!, tags: tagList }))
        unwrapResult({payload: resultAction})
        setInputValue('')
      } catch (err) {
        console.error('Failed to fetch posts: ', err)
      } finally {
        setRequestStatus('idle')
      }
      // TODO - Loading before change sites
      // history.push('/home')

    } else {
      return
    }

  }


  return (
    <div className="max-w-md mx-auto bg-white md:rounded-md shadow-md overflow-hidden my-6 ">
      <form className="" >

        <div className="p-2 w-full">
         
          <div>

            <label htmlFor="post" className="block text-sm font-medium text-gray-700">
            </label>
            <div className="mt-1">
              <textarea id="post" name="post" rows={6}  className="border-none focus:ring-transparent focus:border-transparent block w-full sm:text-sm border-gray-300 rounded-md text-gray-800 resize-none" placeholder="Write down your real thoughts..." onInput={inputHandler} value={inputValue} />
            </div>
          </div>
          <div className="p-2 text-sm flex items-center">
            <label htmlFor="tags" className="block pr-4 font-medium text-gray-700">Tags
            </label>
            <input id="tags" name="tags" placeholder="Topics" className="border border-gray-300 rounded-md p-1 mr-4 flex-grow-1" onInput={tagsHandler}/>
            <button className="text-blue-500 rounded-full" onClick={tagAddHandler}>
              <AddIcon className="h-8 fill-current"/>
            </button>
          </div>

          <div className="mt-4 flex space-x-2">
            {tagList.map(tag => {
              return (
                <div className="" key={tag}>
                  <span className="tag-blue text-white flex items-center">#{tag} <button className="ml-1 h-4 rounded-full flex-shrink-0" onClick={()=> tagRemoveHandler(tag)}><RemoveIcon className="fill-current h-3 w-3 brounded-full flex-shrink-0"/></button></span>
                  
                </div>
              )
            })}
          </div>
         
        </div>
        <div className="">
      
          {previewUrl? <img src={previewUrl} className="overflow-hide h-60 object-cover w-full"/> : <div className="flex justify-center items-center h-60 px-6 pb-6 bg-gray-300 opacity-0.5  ">
            <div className="space-y-1 text-center text-gray-400">
              <PictureIcon className="mx-auto h-12 w-12 fill-current"/>
              
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-blue-500">
                  <span>Upload an image</span>
                  <input 
                  id="file-upload" 
                  name="file-upload" 
                  accept=".jpg,.png,.jpeg"
                  type="file" 
                  onChange={pickedHandler}
                  className="sr-only" />
                </label>
              </div>

            </div>
          </div>
          }
          {/* <MultipleImageUpload /> */}
          
        </div>
        <div className="w-full text-center">
                  <button onClick={submitHandler} className="btn-blue bg-blue-500 my-4 mx-auto text-sm flex">
                      {requestStatus==='pending' &&<SpinnerIcon className="animate-spin h-5 w-5 mr-3"/>}
                    ADD POST
                  </button>

        </div>

      </form>
    </div>
  )
}
export default AddPost