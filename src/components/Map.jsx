import React, { useContext, useEffect, useState } from 'react'
import styles from "./Map.module.css"
import { useNavigate, useSearchParams } from 'react-router-dom'
import {MapContainer, TileLayer, Popup, Marker, useMap, useMapEvents} from 'react-leaflet'
import { useCities } from '../context/CityContext';
import useGeolocation from '../Hooks/useGeolocation';
import Button from './Button';
import useUrlPosition from '../Hooks/useUrlPosition';

export default function Map() {


  const [mapPosition, setMapPosition]=useState([40,0]);
  const {cities}=useCities(); 

  const {
        isLoading: isLoadingPosition,
        position:geoLocationPOsition,
        getPosition,
        }=useGeolocation();

  const [mapLatitude, mapLongitude]=useUrlPosition();

  useEffect(function(){
    if(mapLatitude && mapLongitude) setMapPosition([mapLatitude,mapLongitude])
  },[mapLatitude,mapLongitude])

  useEffect(function(){
   if(geoLocationPOsition) setMapPosition([geoLocationPOsition.lat, geoLocationPOsition.lng])
  },[geoLocationPOsition])

  return (
    <div className={styles.mapContainer}>
      {!geoLocationPOsition && <Button type="position" onClick={getPosition}>
        {isLoadingPosition ? "Loading..." : "USe Your"}
      </Button>}
      <MapContainer center={mapPosition} zoom={6} scrollWheelZoom={true} className={styles.map}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
    />

    {cities.map((city)=>(
    <Marker position={[city.position.lat,city.position.lng]} key={city.id}>
      <Popup>
        <span>{city.emoji}</span> <span>{city.cityName}</span>
      </Popup>
    </Marker>
    ))}

    <ChangeCenter position={mapPosition} />
    <DetectClick />
  </MapContainer>
  
    </div>
  )
}

function ChangeCenter({position}){
  const map=useMap();
  map.setView(position);
  return null;
}

function DetectClick(){
  const navigate=useNavigate();

  useMapEvents({
    click:(e) =>navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
  })
}