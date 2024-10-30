import React from 'react'

function HomePageCompany() {
    const suerName=localStorage.getItem('username')
  return (
    <div id="content" class="app-content text-center">
      <h3 ><span className='text-blue'>Hello  {suerName} Welcome </span></h3>
      
      </div>
  )
}

export default HomePageCompany