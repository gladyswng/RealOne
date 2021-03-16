import React, { useReducer, useState } from 'react'
import { projectFirestore, timestamp, auth } from '../firebase/config'
import Input from '../components/share/Input'
import { useForm } from '../hooks/useForm'
import {ReactComponent as LogoIcon }from '../svg/logo.svg'


import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH, VALIDATOR_MATCH, VALIDATOR_EMAIL } from '../util/validators'
import { useDispatch } from 'react-redux'
import { signUp } from './userSlice'
import { useHistory } from 'react-router-dom'

interface AddUserProps {

}

const AddUser: React.FC<AddUserProps> = ({}) => {
  const history = useHistory()
  const dispatch = useDispatch()
  
  const [ error, SetError ] = useState<string>()
  
   
  const [formState, inputHandler] = useForm({
      name: {
        value: 'asdf',
        isValid: false
      },
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      },
      confirmPassword: {
        value: '',
        isValid: false
      },

    }, 
    false,
    {})

    const { inputs, isValid } = formState
 

    const formHandler = async (e:  React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const userRef: any = projectFirestore.collection('users')
      // const checkUser = await userRef.doc(inputs.email.value).get()
      dispatch(signUp({ 
        name: inputs.name.value, 
        email: inputs.email.value, 
        password: inputs.password.value 
      }))
      history.push('/login')
    }

  return (
    <div className=" flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <LogoIcon className="mx-auto w-auto h-20"/>
          
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Share your thoughts
            </h2>
            
          </div>
          <form className="mt-8 space-y-6" action="#" onSubmit={formHandler} >
            
            <div className="rounded-md shadow-sm -space-y-px" >
              {error && <p className="text-sm text-red-500 text-center py-2">{error}</p>}
              <div className="relative">
              
                
                <label htmlFor="name" className="sr-only">Name</label>
                <Input 
                classes="sm:text-sm form-input rounded-t-md pb-4" 
                blur={true} 
                id="name"  
                type="text" 
                error="Invalid name"
                onInput={inputHandler} 
                placeholder="Name" 
                validators={[VALIDATOR_REQUIRE()]}/>
              </div>
              
              <div className="relative">
                <label htmlFor="email" className="sr-only">Email address</label>
                <Input 
                classes="form-input sm:text-sm pb-4" 
                blur={true} 
                id="email"  
                type="email" 
                error="Invalid email"
                onInput={inputHandler} 
                placeholder="Email" 
                validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}/>
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">Password</label>
                
                <Input 
                classes="form-input sm:text-sm pb-4" 
                blur={true} 
                id="password"  
                type="password" 
                error="Must contain at least 6 characters"
                onInput={inputHandler} 
                placeholder="Password" validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}/>
              </div>
              <div className="relative ">
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <Input 
                classes="form-input sm:text-sm rounded-b-md pb-4" 
                blur={true} 
                id="confirmPassword"  
                type="password" 
                error="Password does not match"
                onInput={inputHandler} 
                placeholder="Confirm password" validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6),  VALIDATOR_MATCH(inputs.password.value)]}/>
              </div>
            </div>


            <div>
              <button type="submit" className=" relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50" disabled={!isValid}>
                
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
  )
}
export default AddUser