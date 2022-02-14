import React, {useContext} from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import useForm from '../../shared/hooks/form-hook';
import useHttp from '../../shared/hooks/http-hook';
import {AuthContext} from '../../shared/context/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import './PlaceForm.css';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';


function NewPlace() {
  const {isLoading, error, sendRequest, clearError} = useHttp();
  const auth = useContext(AuthContext);
  
  const history = useHistory();

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
      },
      image: {
        value: null,
        isValid: false
      }
    },
    false, //* overall form validity
  );


  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs);

    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('creator', auth.userId);
      formData.append('image', formState.inputs.image.value);

      await sendRequest(process.env.REACT_APP_BACKEND_URL+'/api/places', 'POST', 
      formData,
      );
      //push the user to a path
      history.push('/');
    } catch (error) {
      console.log(error);
    }
  }

  // console.log(formState.isValid);
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
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
        <ImageUpload id='image' onInput={inputHandler} center/>
        <Button type="submit" disabled={!formState.isValid}>Add Place</Button>
      </form>
    </React.Fragment>
  );
}

export default NewPlace;