import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Input from '../components/share/Input'
import { useForm } from '../hooks/useForm'
import { useImageUpload } from '../hooks/useImageUpload'
import { ReactComponent as ProfileIcon } from '../svg/profile.svg'
import { VALIDATOR_REQUIRE } from '../util/validators'

import { selectUser, updateUser } from './userSlice'

interface UserProfileProps {

}

const UserProfile: React.FC<UserProfileProps> = ({}) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser) 
  
  // const [ imageUrl, setImageUrl ] = useState<string>()
  const {  previewUrl, pickedHandler } = useImageUpload(user?.image)


  const [formState, inputHandler, setFormData] = useForm({
      name: {
        value: user?.name,
        isValid: true
      },
      // image: {
      //   value: user?.image,
      //   isValid: true
      // }
    }, 
    false,
    {})

  const { inputs, isValid } = formState



  // Do i actually need this useEffect to retrieve user name?
  // useEffect(() => {
  //   if (!user) {
  //     return
  //   }
  //   console.log('tried set' + user.name,)
   
  //   setFormData({
  //     name: {
  //       value: user.name,
  //       isValid: true
  //     }
  //   }, true, {})
    
  // }, [user?.name, setFormData])
 
  const submitHandler = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputs.name && user ) {
      
      dispatch(updateUser( { image: previewUrl, name: inputs.name.value, email: user.email, oldImage: user.image, likes: user.likes }))

    } else {
      return
    }
    // const postRef = projectFirestore.collection('posts')
    // postRef.add({ text: inputValue, image: previewUrl, createdAt })
    // const id = (await doc).id
    // console.log(id)

  }
  return (
    <div className="space-y-1 text-center">
      

      {user && <form className="mt-8 space-y-6 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8  max-w-md m-auto" action="#" onSubmit={submitHandler}>

      <div className="flex text-sm text-gray-600">
        <label htmlFor="file-upload" className="cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none text-center m-auto py-2">
          {previewUrl? <img src={previewUrl} className="rounded-full w-44 h-44 object-cover"/> : <ProfileIcon className="mx-auto w-44 text-blue-600 fill-current"/>}
          
          <span>Change profile</span>
          <input 
          id="file-upload" 
          name="file-upload" 
          
          accept=".jpg,.png,.jpeg"
          type="file" 
          onChange={pickedHandler}
          className="sr-only" />
        </label>
      </div>

      <div className="relative w-full">
              
                
        <label htmlFor="name" className="sr-only">Name</label>
        
         <Input 
          classes="sm:text-sm form-input rounded-md pb-4 w-full" 
          blur={false} 
          id="name"  
          type="text" 
          error="Invalid name"
          initValue={user.name}
          onInput={inputHandler} 
          placeholder="Name" 
          validators={[VALIDATOR_REQUIRE()]}/>
      </div>

      <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50" disabled={!isValid}>
        Update Profile
      </button>

      </form>
      }
      

    </div>
    
  )
}
export default UserProfile