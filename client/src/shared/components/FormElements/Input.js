import React, { useReducer } from 'react';

import './Input.css';
import { validate } from '../../util/validators';

const inputReducer = (state, action) => {
  debugger;
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
  const initialState = {
    value: '',
    isValid: false,
  };
  const [inputState, dispatch] = useReducer(inputReducer, initialState);
  //* inputState changes whenever inputReducer is called (changeHandler -> dispatch -> inputReducer)

  const changeHandler = (event) => {
    // dispatch is useReducer's seter method
    dispatch({ type: 'CHANGE', val: event.target.value, validators: props.validators });
  };

  // is executed when user clicks out of the input
  const inputBlurHandler = () => {
    debugger;
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
