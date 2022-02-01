import React from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import useForm from '../../shared/hooks/form-hook';
import './PlaceForm.css';


function NewPlace() {
  // useReducer(set state callback, initial state)
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      address: {
        value: '',
        isValid: false
      }
    },
    false, //* overall form validity
  );


  const placeSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
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
