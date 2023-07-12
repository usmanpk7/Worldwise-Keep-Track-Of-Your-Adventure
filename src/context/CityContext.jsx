import { createContext, useState, useEffect, useContext, useReducer } from "react";

const CitiesContext = createContext();

function reducer(state,action){
  switch(action.type){
    case 'loading':
      return {...state, isLoading:true}
    case 'cities/loaded':
      return {...state, isLoading:false, cities:action.payLoad}
      case 'city/created':
        return {...state, isLoading:false, cities:[...state.cities,action.payLoad]}
        case 'city/deleted':
          return  {...state, isLoading:false, cities:state.cities.filter((city)=> city.id !== action.payLoad)}
          case 'rejected':
            return {...state, isLoading:false, error:action.payLoad}
            case 'city/loaded':
              return {...state, isLoading:false, currentCity:action.payLoad}
          default:
            throw new Error("Action not found")
  }
}
const INITIAL_STATE={
  cities:[],
  isLoading:false,
  currentCity:{},
  error:""
}
function CityProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  const [state, dispatch]=useReducer(reducer, INITIAL_STATE);
  const {cities, isLoading, currentCity, error}= state;

  useEffect(function () {
    async function fetchCities() { 

      dispatch({type:'loading'});

      try {
        const res = await fetch("http://localhost:2000/cities");
        const data = await res.json();
         
        dispatch({type:'cities/loaded', payLoad:data})
 
      } catch (err) {
        dispatch({type:'rejected', payLoad:"Error while loading"})
      } 
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    dispatch({type:'loading'});

      try {
        // setIsLoading(true);
        const res = await fetch(`http://localhost:2000/cities/${id}`);
        const data = await res.json();
        dispatch({action:'city/loaded', payLoad:data})
      } catch (err) {
        dispatch({type:'rejected', payLoad:"Error while loading data"})
      } 
    
  }

  async function createCity(newCity) {
    dispatch({type:'loading'});
    try {
      
      const res = await fetch(`http://localhost:2000/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
     dispatch({type:'city/created', payLoad:data})
       
    } catch (err) {
      dispatch({action:'rejected', payLoad:"Error while creating city"})
    } 
  }

  async function deleteCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:2000/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({type:'city/deleted', payLoad:id})

    } catch (err) {
      dispatch({action:'rejected', payLoad:"Error while delete city"})

    } 
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
        error
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined) throw new Error("Not a right place");
  return context;
}

export { CityProvider, useCities };
