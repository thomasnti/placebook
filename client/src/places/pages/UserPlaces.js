import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import useHttp from '../../shared/hooks/http-hook';

// const DUMMY_PLACES = [{
//   id: 'p1',
//   title: 'Empire state building',
//   description: 'One of the most iconic buildings in the world !!!',
//   imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg/447px-Empire_State_Building_from_the_Top_of_the_Rock.jpg',
//   address: '20 W 34th St, New York, NY 10001, Ηνωμένες Πολιτείες',
//   creator: 'u1',
//   location: {
//     lat: 40.7484405,
//     lng: -73.9856644
//   }
// },
// {
//   id: 'p2',
//   title: 'Emp. state building',
//   description: 'One of the most iconic buildings in the world !!!',
//   imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg/447px-Empire_State_Building_from_the_Top_of_the_Rock.jpg',
//   address: '20 W 34th St, New York, NY 10001, Ηνωμένες Πολιτείες',
//   creator: 'u1',
//   location: {
//     lat: 40.7484405,
//     lng: -73.9856644
//   }
// }]

// const DUMMY_PLACES =[] To test no places found

function UserPlaces() {
  const userId = useParams().userId;
  const {isLoading, error, sendRequest, clearError} = useHttp();
  const [currentUserPlaces, setCurrentUserPlaces] = useState([]);

  useEffect(() => {
    const fetchUserPlaces = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`);
  
        setCurrentUserPlaces(responseData.places)
      } catch (error) {
        console.log(error);
      }
    }

    fetchUserPlaces();
  }, [sendRequest, userId]);

  const deletePlaceHandler = (placeId) => {
    setCurrentUserPlaces(prevPlaces => {
      // debugger
      return prevPlaces.filter(place => place.id !== placeId);
    })
  }

  // better name items to places
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && currentUserPlaces && <PlaceList items={currentUserPlaces} onDeletePlace={deletePlaceHandler}  />}
    </React.Fragment>
  );
}

export default UserPlaces;
