import React, { useEffect, useState } from 'react';
import { Link,useLocation } from 'react-router-dom';
import mainMenu from '../utils/menuPage.json'
export default function Navbar() {
  const dataMain=mainMenu.main;
  const location = useLocation();
  const pathName = location.pathname;
  const [path, setPath] = useState(pathName);

  const [dataMenu, setDataMenu] = useState([]);
  const type=localStorage.getItem('user_type');
  useEffect(()=>{
    setPath(pathName);

    const filtered = dataMain.filter(item => item.typeUser === type);
    setDataMenu(filtered);
  },[dataMain,pathName,type])
  return (
    <>
      <div id="top-menu" className="app-top-menu" data-bs-theme="dark">
        <div className="menu">
        {dataMenu.map((item, index) =>
        item.subMenu.length <= 0? (
          <div className={`menu-item ${path === `/${item.link}` ? 'active' : ''}`} >
            <Link to={item.link} className="menu-link">
              <div className="menu-icon">
                <i className={item.icon}></i>
              </div>
              <div className="menu-text fs-14px">
                {item.mainName}
              </div>
            </Link>
          </div>
        ):(
          <div className={`menu-item has-sub  ${item.subMenu.some(subMenu => path === `/${subMenu.sublink}`) ? 'active' : '' }`}>
            <a href="javascript:;" className="menu-link ">
              <div className="menu-icon">
              <i className={item.icon} />
              </div>
              <div className="menu-text">{item.mainName}</div>
              <div className="menu-caret"></div>
            </a>
            <div className="menu-submenu ">
            {item.subMenu.map((val,key)=>
              <div key={key} className={`menu-item ${path === `/${val.sublink}` ? 'active' : ''}`}>
                <Link to={val.sublink} className="menu-link">
                  <div className="menu-text">{val.subName}</div>
                </Link>
              </div>
               )}
             
            </div>
          </div>
        )
)}
          <div className="menu-item menu-control menu-control-start">
            <a href="javascript:;" className="menu-link" data-toggle="app-top-menu-prev"  >
              <i className="fa fa-angle-left" />
            </a>
          </div>
          <div className="menu-item menu-control menu-control-end">
            <a href="javascript:;" className="menu-link" data-toggle="app-top-menu-next" >
              <i className="fa fa-angle-right" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
