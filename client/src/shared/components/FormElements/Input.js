import React, { useReducer, useEffect } from 'react';

import { validate } from '../../util/validators';
import './Input.css';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      // return { ...state, value: action.val, isValid: true };
      return {
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case 'BLUR': {
      return {
        ...state,
        isBlured: true
      }
    }
    default:
      return state;
  }
};

function Input(props) {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isBlured: false,
    initialValid: props.valid || false
  }); //* inputState changes whenever inputReducer is called (changeHandler -> dispatch -> inputReducer)

  const {id, onInput} = props,
        {value, isValid} = inputState;

  useEffect(() => {
    onInput(id, value, isValid)
  }, [id, value, isValid, onInput])

  const changeHandler = (event) => {
    // dispatch is useReducer's seter method
    dispatch({ type: 'CHANGE', val: event.target.value, validators: props.validators });
  };

  // is executed when user clicks out of the input
  const inputBlurHandler = () => {
    dispatch({type: 'BLUR'})
  };

  const element =
    props.element === 'input' ? (
      <input
        type={props.type}
        id={props.id}
        placeholder={props.placeholder}
        onChange={changeHandler}
        value={inputState.value}
        onBlur={inputBlurHandler}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 4}
        onChange={changeHandler}
        value={inputState.value}
        onBlur={inputBlurHandler}
      ></textarea>
    );

  // for is htmlFor in React
  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isBlured && 'form-control--invalid'
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isBlured && <p>{props.errorText}</p>}
    </div>
  );
}

export default Input;
