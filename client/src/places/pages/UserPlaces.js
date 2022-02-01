import React from 'react'
import { useParams } from 'react-router-dom'

import PlaceList from '../components/PlaceList'

const DUMMY_PLACES = [{
  id: 'p1',
  title: 'Empire state building',
  description: 'One of the most iconic buildings in the world !!!',
  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg/447px-Empire_State_Building_from_the_Top_of_the_Rock.jpg',
  address: '20 W 34th St, New York, NY 10001, Ηνωμένες Πολιτείες',
  creator: 'u1',
  location: {
    lat: 40.7484405,
    lng: -73.9856644
  }
},
{
  id: 'p2',
  title: 'Emp. state building',
  description: 'One of the most iconic buildings in the world !!!',
  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg/447px-Empire_State_Building_from_the_Top_of_the_Rock.jpg',
  address: '20 W 34th St, New York, NY 10001, Ηνωμένες Πολιτείες',
  creator: 'u1',
  location: {
    lat: 40.7484405,
    lng: -73.9856644
  }
}]

// const DUMMY_PLACES =[] To test no places found

function UserPlaces() {
  const userId = useParams().userId;
  const currentUserPlaces = DUMMY_PLACES.filter(place => place.creator === userId)
  // better name items to places
  return <PlaceList items={currentUserPlaces} />
}

export default UserPlaces
