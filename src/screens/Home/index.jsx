import React,{useState} from 'react'
import HomePageOac from './homePage-oac';
import HomePageAgent from './homePage-agent';
import HomePageBuyer from './homePage-buyer';
import HomePageCompany from './HomePage-company';
export default function HomePage() {
   const typeUser=localStorage.getItem('user_type');
    return (
       <>
      {typeUser === '1' ? (
        <HomePageOac />
      ) : typeUser === '2' ? (
        <HomePageAgent />
      ) : typeUser === '3' ?(
        <HomePageBuyer />
      ):(
      <HomePageCompany/>
      )}
    </>
    )
}
