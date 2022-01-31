import { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
  debugger;
  switch (action.type) {
    case 'INPUT_CHANGE':
      let isFormValid = true;
      for (const inputId in state.inputs) {
        if (inputId === action.inputId) {
          isFormValid = isFormValid && action.isValid
        } else {
          isFormValid = isFormValid && state.inputs[inputId].isValid
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: {value: action.value, isValid: action.isValid} // σε περίπτωση που δεν εχω κάποια input στο state την βάζω στο inputs object
        },
        isValid: isFormValid
      };
      case 'SET_DATA':
        return {
          inputs: action.inputs,
          isValid: action.isFormValid
        };
    default:
      return state;
  }
};

//* Custom hook for general form validation
function useForm(initialInputs, initialFormValidity) {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity
  });

  const inputHandler = useCallback((id, value, isValid) => {
    //* dispatch(action) takes the action object as parameter
    dispatch({
      type: 'INPUT_CHANGE',
      inputId: id,
      value: value,
      isValid: isValid,
    });
  }, []); //? if the second argument is an empty array, the value will be memoized once and always returned. If the second argument is omitted, the value will never be memoized, and the useCallback and the useMemo doesn't do anything.

  const setFormData = useCallback((inputData, formValidity) => {
    console.log('setFormData');
    dispatch({
      type: 'SET_DATA',
      inputs: inputData,
      isFormValid: formValidity 
    });
  }, []);

  return [formState, inputHandler, setFormData];
}


export default useForm;