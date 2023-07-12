import React from 'react'
import { useNavigate } from "react-router-dom";

export default function ButtonBack() {
  const navigate=useNavigate();

  return (
    <button type='back' onClick={(e)=>{
        e.preventDefault();
        navigate(-1);
      }}>&larr; Back</button>
  )
}
