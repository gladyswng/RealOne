import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Input from '../components/share/Input'
import { auth, projectFirestore } from '../firebase/config'
import { useForm } from '../hooks/useForm'
import { ReactComponent as LogoIcon }from '../svg/logo.svg'
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../util/validators'

import {
  login,
  selectUser
} from './userSlice';

interface LoginProps {

}

const Login: React.FC<LoginProps> = ({}) => {
  const history = useHistory()
  const dispatch = useDispatch();
  const user = useSelector(selectUser)

   const [formState, inputHandler] = useForm({
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }

    }, 
    false,
    {})

    const { inputs, isValid } = formState



    const formHandler = async (e:React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      dispatch(login({ email: inputs.email.value, password: inputs.password.value }))
      history.push('/home')

      // const userRef: any = projectFirestore.collection('users')
      // try {
        
      //   const userCredential = await auth.signInWithEmailAndPassword(inputs.email.value, inputs.password.value)
      //   const userDoc = await userRef.doc(inputs.email.value).get()
      //   const user = userDoc.data()
      //   console.log(user)
      // } catch (e) {
      //   console.log(e)
      //   console.log(e.message)
      // }

    }
    // TODO - Remember

    return (
      <div className=" flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <LogoIcon className="mx-auto w-auto h-20"/>
          
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            
          </div>
          <form className="mt-8 space-y-6" action="#" onSubmit={formHandler}>
            <input type="hidden" name="remember" value="true"/>
            <div className="rounded-md shadow-sm -space-y-px" >
              <div className="relative">
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <Input 
                classes="form-input sm:text-sm pb-4 rounded-t-md " 
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
                classes="form-input sm:text-sm pb-4 rounded-b-md" 
                blur={true} 
                id="password"  
                type="password" 
                error="Must contain at least 6 characters"
                onInput={inputHandler} 
                placeholder="Password" validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}/>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember_me" name="remember_me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"></input>
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50" disabled={!isValid}>
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    )
}
export default Login