import { createContext, useContext, useReducer } from "react";


const AuthContext=createContext();

const FAKE_USER = {
    name: "Usman",
    email: "Usman@example.com",
    password: "qwerty",
    avatar: "https://i.pravatar.cc/100?u=zz",
  };

const initial_state={
    isAuthenticated:false,
    user:null
}

function reducer(state,action){
   switch(action.type){
    case 'loginUser':
        return {...state,user:action.payLoad, isAuthenticated:true}
        case 'logout':
            return {...state, isAuthenticated:false, user:null}
            default:
                throw new Error("Action Not found")
   }
}
function AuthProvider({children}){
    const [state, dispatch]=useReducer(reducer, initial_state);
    const {user, isAuthenticated}=state;

    function login(email,pass){
        if(email ===  FAKE_USER.email && pass === FAKE_USER.password){
            dispatch({type:'loginUser', payLoad:FAKE_USER})
        }
    }

    function logout(){
      dispatch({type:'logout'})
    }

   return <AuthContext.Provider value={{
    isAuthenticated,
    user,
    login,
    logout
   }}>
        {children}
    </AuthContext.Provider>
}
function useAuth(){
    const context= useContext(AuthContext);
    if(context === undefined) throw new Error('Used outside of provider')
    return context;
}

export {AuthProvider, useAuth}