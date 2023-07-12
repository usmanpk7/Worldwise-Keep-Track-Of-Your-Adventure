import React from 'react';
import styles from './CountryList.module.css';
import Spinner from './Spinner';
import CountryItem from './CountryItem';
import Message from './Message';
import { useCities } from '../context/CityContext';


export default function Countrieslist() {
  const {cities,isLoading}=useCities();

  if (isLoading) return <Spinner />;
  if (!cities.length) return <Message message='Add your first city by clicking on the map' />;
  
  const countries=cities.reduce((acc,city)=>{
      if(!acc.map((el)=>el.country).includes(city.country)){
        return [...acc,{country:city.country, emoji:city.emoji}]
      }
      else return acc;
  },[])
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country}/>
      ))}
    </ul>
  );
}
