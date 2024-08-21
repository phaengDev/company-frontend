import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Config, imageUrl } from "../config/connenct";
export default function Header() {
  const api = Config.urlApi;
  const url = imageUrl.url;
  const navigate = useNavigate();
  const userName = localStorage.getItem('username');
  const user_type = parseInt(localStorage.getItem('user_type'), 10);
  const companyId = parseInt(localStorage.getItem('company_agent_id'), 10);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('user_type');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('companyID');
    localStorage.removeItem('statusUse');
    navigate('/login');
  }

  const datack = {
    user_type: user_type,
    companyId: companyId
  }

  const [isLoading, setIsLoading] = useState(true);
  const [itemData, setItemData] = useState([]);
  const fetchNotific = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(api + 'report/notific',datack);
      setItemData(response.data); // Axios already parses the response
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentItems = itemData.slice(0, 5);

  useEffect(() => {
    fetchNotific();
  }, [])

  return (
    <div id="header" className="app-header">
      <div className="navbar-header">
        <Link to={"home"} className="navbar-brand">
          <span className="navbar-logo">
            <img src="./assets/img/logo/oac-logo.jpg" />
          </span>
          <b className="me-1 text-danger">OAC</b>
          <span className="text-white">broker</span>
        </Link>
        <button
          type="button"
          className="navbar-mobile-toggler"
          data-toggle="app-top-menu-mobile"
        >
          <span className="icon-bar" />
          <span className="icon-bar" />
          <span className="icon-bar" />
        </button>
      </div>
      <div className="navbar-nav">
        <div className="navbar-item navbar-form">
          <form action="" method="POST" name="search">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter keyword"
              />
              <button type="submit" className="btn btn-search">
                <i className="fas fa-search" />
              </button>
            </div>
          </form>
        </div>
        <div class="navbar-item dropdown">
          <a href="#" data-bs-toggle="dropdown" class="navbar-link dropdown-toggle icon ">
            <i class="fa fa-bell"></i>
            <span class="badge bg-danger text-white">{itemData.length > 9 ? '+9' : itemData.length}</span>
          </a>
          <div class="dropdown-menu media-list dropdown-menu-end">
            <div class="dropdown-header fs-14px">ສັນຍາໃກ້ຈະໝົດຄວາມຄຸ້ມຄອງ ({itemData.length})</div>
            {currentItems.length > 0 ? (
              currentItems.map((val, index) =>
                <div key={index} class="dropdown-item media">
                  <div class="media-left">
                    <img src={val.custom_profile === '' ? './assets/img/logo/user1.png' : url + 'profile/' + val.custom_profile} class="media-object" alt />
                    <i class="fa-regular fa-address-card text-blue media-object-icon"></i>
                  </div>
                  <div class="media-body">
                    <h6 class="media-heading">{val.contract_number}</h6>
                    <p>{val.customer_name}, || {val.registra_tel}</p>
                    <div class="text-muted fs-10px">{val.day_contract} ວັນ</div>
                  </div>
                </div>
              )
            ) : (<div class="dropdown-item text-center">
              <img src="./assets/img/icon/infographic.png" className="w-100px" alt="" />
            </div>)}


            <div class="dropdown-footer text-center">
              <Link to={'/almost'} class="text-decoration-none">====<i class="fa-solid fa-angles-right"></i> ທັງໝົດ === <i class="fa-solid fa-hand-point-down"></i></Link>
            </div>
          </div>
        </div>
        <div className="navbar-item navbar-user dropdown">
          <a
            href="#"
            className="navbar-link dropdown-toggle d-flex align-items-center"
            data-bs-toggle="dropdown"
          >
            <img src="./assets/img/logo/user1.png" alt="" />
            <span>
              <span className="d-none d-md-inline">{userName}</span>
              <b className="caret" />
            </span>
          </a>
          <div className="dropdown-menu dropdown-menu-end me-1">
            <button type="button" className="dropdown-item">
              Edit Profile
            </button>
            <button type="button" className="dropdown-item">
              Calendar
            </button>
            <button type="button" className="dropdown-item">
              Settings
            </button>
            <div className="dropdown-divider" />
            <button type="button" onClick={handleLogout} className="dropdown-item ">
              <i class="fa-solid fa-right-from-bracket"></i> Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
