import React, { useEffect, useState } from 'react'
import { ReactComponent as AddImageIcon } from '../svg/addImage.svg'
import { useImageUpload } from '../hooks/useImageUpload'

import { projectFirestore, timestamp } from '../firebase/config'
import { useDispatch, useSelector } from 'react-redux'
import {
  addPost
} from './postSlice';
import {
  selectUser,
} from './userSlice';

interface AddPostProps {

}

const AddPost: React.FC<AddPostProps> = ({}) => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)

  const { file, previewUrl, pickedHandler } = useImageUpload()

  const [ inputValue, setInputValue ] = useState<string>()
  // const [ loadedFile, setLoadedFile ] = useState<File>()
  // const { url } = useStorage(loadedFile)
  // useEffect(() => {
  //   if (file) {
  //     setLoadedFile(file)
  //   }
  // }, [file])
  const inputHandler = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    setInputValue(target.value)
  }
  const submitHandler = async (e:React.MouseEvent) => {
    e.preventDefault()
    // if (!previewUrl && !inputValue && !user && !inputValue) {
    //   return
    // }
    if (previewUrl && inputValue && user ) {
      
      dispatch(addPost({ text: inputValue, image: previewUrl, author: user }))

    } else {
      return
    }
    // const postRef = projectFirestore.collection('posts')
    // postRef.add({ text: inputValue, image: previewUrl, createdAt })
    // const id = (await doc).id
    // console.log(id)

  }
  return (
    <div className="max-w-md mx-auto bg-white md:rounded-md shadow-md overflow-hidden my-6 ">
      <form className="" >
        <div className="">
          <label className="block text-sm font-medium text-gray-700">
          </label>
          {previewUrl? <img src={previewUrl}/> : <div className="flex justify-center items-center h-60 px-6 pb-6 bg-gray-300 opacity-0.5 md:rounded-t-md ">
            <div className="space-y-1 text-center">
              <AddImageIcon className="mx-auto h-12 w-12 text-gray-400"/>
              
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
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
          
        </div>
        <div className="p-2 ">
          <div className="w-full">
            <label htmlFor="about" className="block text-sm font-medium text-gray-700">
            </label>
            <div className="mt-1">
              <textarea id="about" name="about" rows={6}  className="border-none focus:ring-transparent focus:border-transparent p-2 block w-full sm:text-sm border-gray-300 rounded-md text-gray-800 resize-none" placeholder="Write down your real thoughts..." onInput={inputHandler} value={inputValue} />
            </div>
          </div>  
        </div>
        <div className="w-full text-center">
          <button onClick={submitHandler} className="btn-blue bg-blue-500 my-4 mx-auto text-sm">ADD POST</button>

        </div>

      </form>
    </div>
  )
}
export default AddPost