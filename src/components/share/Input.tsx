import React, { useEffect, useReducer, useState } from 'react'
import { validate } from '../../util/validators'


interface InputProps {
  classes: string 
  blur: boolean
  id: string
  type: string
  initValue?: string
  onInput: (id: string, value: string, isValid: boolean) => void
  validators?: {
    type: string,
    val?: string | number
  }[]
  placeholder?: string
  error: string
}

interface IState {
  value: string 
  isValid: boolean
  isTouched: boolean
}

interface IAction {
  type: string,
  val?: string ,
  validators?: {
    type: string,
    val?: number | string
  }[]
}

const Input: React.FC<InputProps> = ({ 
  classes, id, blur, validators, onInput, placeholder, type, error, initValue }) => {
  
  
  const inputReducer  = (state: IState, action: IAction): IState => {
    
    switch (action.type) {
      case 'CHANGE': {
       
        if (action.val===undefined || !action.validators) {
          return state
        }
        return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators)
        }
      }

      case 'TOUCH': {
        return {
        ...state,
        isTouched: true
        }
      }
      default:
      return state
    }

    
  }

  const [inputState, dispatch] = useReducer(inputReducer, {
    value:  initValue || '',
    isTouched: false, 
    isValid: !blur || false
    // If want to blur, meaning no content yet, meaning valid should be false
  })
  const { value, isValid, isTouched } = inputState
  

  useEffect(() => {
    onInput(id, value, isValid)
  }, [id, value, isValid, onInput])
 
  
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ 
      type: 'CHANGE', 
      val: event.target.value, 
      validators: validators 
    })
  }
  
  const touchHandler = () => {
    if (blur) {
      dispatch({ 
        type: 'TOUCH'
      })

    }
    return
  }

  // const inputChangeHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
  //   setInputValue(e.target.value)
  // }


  
  return (
    <>
      <input 
      id={id}
      name={id}
      className={classes} 
      onChange={changeHandler}
      onBlur={touchHandler} 
      type={type}
      value={inputState.value} 
      placeholder={placeholder}/>
      <p className={`text-xs pl-2 text-red-500 absolute bottom-0 z-10  ${!isValid && isTouched ? 'transition-all duration-300 ease-in-out transform -translate-y-1' : 'hidden'} ` }>* {error}</p>
    </>
  )
}

export default Input

