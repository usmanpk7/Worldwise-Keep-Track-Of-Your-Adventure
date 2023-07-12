// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';


import styles from "./Form.module.css";
import Button from "./Button";
import useUrlPosition from "../Hooks/useUrlPosition";
import Message from "./Message";
import { useCities } from "../context/CityContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL="https://api.bigdatacloud.net/data/reverse-geocode-client"
function Form() {
  const [lat, lng]=useUrlPosition();
  const {createCity}=useCities();


  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingGeocoding, setIsLoadingGeocoding]=useState(false);
  const [emoji, setEmoji]=useState("");
  const [geoCodingError, setGeoCodingError]=useState("");
  const navigate= useNavigate();

  useEffect(function(){
    async function fetchCityData(){
        try{
            setIsLoadingGeocoding(true);
            setGeoCodingError('');
            const res=await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
            const data=await res.json();

            if(!data.countryCode) throw new Error('Not a city')
            // console.log(data);
            setCityName(data.city || data.locality || "");
            setCountry(data.countryName);
            setEmoji(convertToEmoji(data.countryCode));
        }
        catch(err){
             setGeoCodingError(err.message);
        }
        finally{
          setIsLoadingGeocoding(false)
        }
        
    }
    fetchCityData();
  },[lat,lng])

  async function handleSuubmit(e){
      e.preventDefault();
      
      if(!cityName && !date) return;

      const newCity={
        cityName,
        country,
        emoji,
        date,
        notes,
        position:{lat,lng}
      }
      // console.log(newCity);
     await createCity(newCity);
      navigate('/app/cities');
  }
  if(geoCodingError) return <Message message={geoCodingError}/>
  return (
    <form className={styles.form} onSubmit={handleSuubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}

        <DatePicker id="date" onChange={(e) => setDate(e.target.value)} selected={date} dateFormat='dd/MM/yyyy'/>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
       <Button type='primary'>Add</Button>
        <Button type='back' onClick={(e)=>{
          e.preventDefault();
          navigate(-1);
        }}>&larr; Back</Button>
      </div>
    </form>
  );
}

export default Form;
