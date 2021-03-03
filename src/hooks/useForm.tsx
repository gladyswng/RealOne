import { useCallback, useReducer } from 'react'

const formReducer = (state: any, action: any) => {
  
  switch (action.type) {
    case 'INPUT_CHANGE':
      let formIsValid = true
  
      for (const inputId in state.inputs) { 
        if (inputId === action.inputId)  {
          formIsValid = formIsValid && action.isValid
        
          
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid
        }
      }
  
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid }
        },
        isValid: formIsValid

      }

    case 'SET_DATA': 
    return {
      inputs: action.inputs,
      isValid: action.formIsValid
    }
    
    default:   
      return state  
  }
}


export const useForm = (initialInputs: object, initialFormValidity: boolean, otherData: object) => {
  
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
    otherData: otherData
    

  })

  
  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: 'INPUT_CHANGE', 
      value: value, 
      inputId: id, 
      isValid: isValid
    })
  }, [])


  const setFormData = useCallback((inputData: object, formValidity: boolean) => {

    dispatch({
      type: "SET_DATA",
      inputs: inputData,
      formIsValid: formValidity
    })
  }, [])

  return [formState, inputHandler, setFormData ]
}