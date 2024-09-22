import React from 'react'

export default function HomePageBuyer() {
  const suerName=localStorage.getItem('username')
  return (
    <div id="content" class="app-content text-center">
     <h3 ><span className='text-blue'>Hello  {suerName} Welcome </span> 
      <br />
      Using the insurance contract tracking system of OAC insurance sales agents </h3> 
      </div>
  ) 
}
