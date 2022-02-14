import React, {useEffect, useState, useContext} from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import useForm from '../../shared/hooks/form-hook';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import useHttp from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';



function UpdatePlace() {
  const placeId = useParams().placeId;
  const [placeToUpdate, setPlaceToUpdate] = useState();
  const {isLoading, error, sendRequest, clearError} = useHttp();
  const history = useHistory();
  const auth = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
    },
    false
  );

  //! we need useEffect to avoid many re-renders which cause infinite loop
  //* kathe fora pou ginetai render to UpdatePlace tha briskoume to place by id
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL+`/api/places/${placeId}`)
// debugger
        setPlaceToUpdate(responseData.place);

        setFormData({
          title: {
            value: responseData.place.title,
            isValid: true // einai hdh true afou to exw kataxorisei kai paw na kanw edit
          },
          description: {
            value: responseData.place.description,
            isValid: true
          }
        },
          true //overall form validity
        );
        
      } catch (error) {
        console.log(error);
      }
    }
    
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);



  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs);

    try {
      await sendRequest(process.env.REACT_APP_BACKEND_URL+`/api/places/${placeId}`, 'PATCH',
      JSON.stringify({
        title: formState.inputs.title.value,
        description: formState.inputs.description.value
      }),
      {
        'Content-Type': 'application/json'
      }
    );

      history.push(`/${auth.userId}/places`)
    } catch (error) {
      console.log(error);
    }

  }

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!placeToUpdate) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }


  console.log(formState);
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && placeToUpdate && (
      <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input
          element="input"
          type="text"
          label="Title"
          placeholder="place's title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title!!"
          id="title"
          onInput={inputHandler}
          initialValue={placeToUpdate.title}
          initialValid={true}
        />
        <Input
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          id="description"
          onInput={inputHandler}
          initialValue={placeToUpdate.description}
          initialValid={true}
  />
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE PLACE
        </Button>
      </form>)}
    </React.Fragment>
  );
  //TODO formState.isvalid is undefined
}

export default UpdatePlace;
