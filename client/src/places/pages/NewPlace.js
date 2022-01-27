import React, { useCallback, useReducer } from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import './PlaceForm.css';

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
      }

    default:
      return state;
  }
};

function NewPlace() {
  // useReducer(set state callback, initial state)
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
    },
    isValid: false, //* overall form validity
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

  const placeSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
    debugger
  }

  console.log(formState.isValid);
  return (
    <form className="place-form" onSubmit={placeSubmitHandler}>
      <Input
        element="input"
        type="text"
        label="Title"
        placeholder="place's title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title!!"
        id="title"
        onInput={inputHandler}
      />
      <Input
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        id="description"
        onInput={inputHandler}
      />
      <Input
        element="input"
        label="Adress"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address."
        id="address"
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>Add Place</Button>
    </form>
  );
}

export default NewPlace;
