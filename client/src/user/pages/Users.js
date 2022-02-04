import React, { useState, useEffect } from 'react';

import UsersList from '../components/UsersList';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import useHttp from '../../shared/hooks/http-hook';

const Users = () => {
  // const USERS = [
  //   {
  //     id: 'u1',
  //     name: 'Max Schwarz',
  //     image:
  //       'https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  //     places: 3
  //   }
  // ];
  
  const {isLoading, error, sendRequest, clearError} = useHttp();
  const [users, setUsers] = useState();

  useEffect(() => {
    //! useEffect callback does not want to return a promise so we define another async function (fetchUsers here)

    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest('http://localhost:5000/api/users');
  
        console.log(responseData.users);
        setUsers(responseData.users);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, [sendRequest]);



  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          {/* Kalo tha htan na exw kai prop pou tha allazei to xrwma tou spinner */}
          <LoadingSpinner />
        </div>
      )}
      {users && !isLoading && <UsersList items={users} />}
    </React.Fragment>
  );
};

export default Users;

//* Edw fortwnw thn lista me tous xrhstes (UsersList)