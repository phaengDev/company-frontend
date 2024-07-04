import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {

  return (
    <>
      <div id="top-menu" className="app-top-menu" data-bs-theme="dark">
        <div className="menu">
          <div className={`menu-item `} >
            <Link to={'home'} className="menu-link">
              <div className="menu-icon">
                <i className="fa-solid fa-house-chimney bg-info"></i>
              </div>
              <div className="menu-text fs-14px">
                ໜ້າຫຼັກ
              </div>
            </Link>
          </div>
          <div className="menu-item has-sub active">
            <a href="javascript:;" className="menu-link ">
              <div className="menu-icon">
                <i class="fa-solid fa-indent bg-gradient-blue"></i>
              </div>
              <div className="menu-text">ລົງທະບຽນຊື້ປະກັນ</div>
              <div className="menu-caret"></div>
            </a>
            <div className="menu-submenu ">
              <div className="menu-item">
                <Link to={'regits'} className="menu-link">
                  <div className="menu-text">ລົງທະບຽນຊື້ປະກັນໃໝ່</div>
                </Link>
              </div>
              <div className="menu-item">
                <Link to={'regis-more'} className="menu-link">
                  <div className="menu-text">ລົງທະບຽນຊື້ປະກັນເພີ່ມ</div>
                </Link>
              </div>
              <div className="menu-item">
                <Link to={'regis-renew'} className="menu-link">
                  <div className="menu-text">ລົງທະບຽນຕໍ່ສັນຍາ</div>
                </Link>
              </div>
              <div className="menu-item">
                <Link to={'move-contract'} className="menu-link">
                  <div className="menu-text">ລົງທະບຽນຍ້າຍສັນຍາ</div>
                </Link>
              </div>
              <div className="menu-item">
                <Link to={'rigits-retrun'} className="menu-link">
                  <div className="menu-text">ລົງທະບຽນສົ່ງເງິນຄືນ</div>
                </Link>
              </div>
            </div>
          </div>
          <div className="menu-item has-sub">
            <a href="javascript:;" className="menu-link">
              <div className="menu-icon">
              <i class="fa-solid fa-list bg-green-500"></i>
              </div>
              <div className="menu-text">ລາຍງານ</div>
              <div className="menu-caret"></div>
            </a>
            <div className="menu-submenu">
              <div className="menu-item">
                <Link to={'report'} className="menu-link">
                  <div className="menu-text">ລາຍງານການຂາຍ</div>
                </Link>
              </div>
              <div className="menu-item">
                <Link to={'comsIn'} className="menu-link">
                  <div className="menu-text">ລາຍງານຄອມຮັບ</div>
                </Link>
              </div>
              <div className="menu-item">
                <Link to={'comsPay'} className="menu-link">
                  <div className="menu-text">ລາຍງານຄອມຈ່າຍ</div>
                </Link>
              </div>
              <div className="menu-item">
                <Link to={'report-ends'} className="menu-link">
                  <div className="menu-text">ສັນຍາໝົດຄວາມຄຸ້ມຄອງ</div>
                </Link>
              </div>
              <div className="menu-item">
                <Link to={'history'} className="menu-link">
                  <div className="menu-text">ປະຫວັນການຕໍ່ສັນຍາ</div>
                </Link>
              </div>
            </div>
          </div>
          <div className="menu-item has-sub">
            <a href="javascript:;" className="menu-link">
              <div className="menu-icon">
              <i class="fa-solid fa-wallet bg-red-500" />
              </div>
              <div className="menu-text">ລາຍງານໜີ້</div>
              <div className="menu-caret"></div>
            </a>
            <div className="menu-submenu">
            <div className="menu-item">
                <Link to={'debt'} className="menu-link">
                  <div className="menu-text">ຂໍ້ມູນໜີ້ທັງໝົດ</div>
                </Link>
              </div>
              <div className="menu-item">
                <Link to={'r-debcom'} className="menu-link">
                  <div className="menu-text">ລາຍງານໜີ້ຈ່າຍບໍລິສັດ</div>
                </Link>
              </div>
              <div className="menu-item">
                <Link to={'r-debagent'} className="menu-link">
                  <div className="menu-text">ລາຍງານໜີ້ຈ່າຍຕົວແທນ</div>
                </Link>
              </div>
              <div className="menu-item">
                <Link to={'r-deboac'} className="menu-link">
                  <div className="menu-text">ລາຍງານໜີ້ຮັບບໍລິສັດ</div>
                </Link>
              </div>
            </div>
          </div>


          <div className="menu-item has-sub">
            <a href="javascript:;" className="menu-link">
              <div className="menu-icon">
              <i class="fa-solid fa-folder-open"></i>
              </div>
              <div className="menu-text">ເອກສານ</div>
              <div className="menu-caret"></div>
            </a>
            <div className="menu-submenu">
            <div className="menu-item">
                <Link to={'doc'} className="menu-link">
                  <div className="menu-text">ເອກສານປະກັນໄພ</div>
                </Link>
              </div>
              <div className="menu-item">
                <Link to={'doct-com'} className="menu-link">
                  <div className="menu-text">ເອກສານຈ່າຍຄ່າຄອມ</div>
                </Link>
              </div>
            </div>
          </div>
          

          {/* <div className={`menu-item`}>
            <Link to={'item'} className="menu-link">
              <div className="menu-icon">
                <i className="fa-solid fa-money-check bg-green fs-18px"></i>
              </div>
              <div className="menu-text fs-14px">
                ລາຍການສັນຍາທັງໝົດ
              </div>
            </Link>
          </div>
          <div className={`menu-item`}>
            <Link to={'arrears'} className="menu-link">
              <div className="menu-icon">
                <i className="fa-solid fa-money-check-dollar bg-gradient-yellow-red  fs-18px"></i>
              </div>
              <div className="menu-text fs-14px">
                ສັນຍາຄ້າງຈ່າຍ
              </div>
            </Link>
          </div>
          <div className={`menu-item `}>
            <Link to={'report-pay'} className="menu-link">
              <div className="menu-icon">
                <i className="fa-solid fa-calendar-days bg-pink md hydrated" role="img"></i>
              </div>
              <div className="menu-text fs-14px">
                ລາຍການຈ່າຍ
              </div>
            </Link>
          </div> */}
          <div className="menu-item has-sub">
            <a href="javascript:;" className="menu-link">
              <div className="menu-icon">
              <i class="fa-solid fa-users bg-gradient-orange"></i>
              </div>
              <div className="menu-text">ຂໍ້ມູນຜູ້ຊື້ປະກັນ</div>
              <div className="menu-caret"></div>
            </a>
            <div className="menu-submenu">
              <div className="menu-item">
                <Link to={'company'} className="menu-link">
                  <div className="menu-text">ບໍລິສັດປະກັນໄພ</div>
                </Link>
              </div>
              
              <div className="menu-item">
                <Link to={'agent'} className="menu-link">
                  <div className="menu-text">ຕົວແທນຂາຍປະກັນ</div>
                </Link>
              </div>
              <div className="menu-item">
                <Link to={'custom'} className="menu-link">
                  <div className="menu-text">ຂໍ້ມູນລູກຄ້າຊື້ປະກັນ</div>
                </Link>
              </div>
              
            </div>
          </div>
          <div className="menu-item has-sub">
            <a href="javascript:;" className="menu-link">
              <div className="menu-icon">
                {/* <i className="fa fa-cash-register"></i> */}
                <i className="fa-solid fa-sliders"></i>
              </div>
              <div className="menu-text">ການຕັ້ງຄ່າ</div>
              <div className="menu-caret"></div>
            </a>
            <div className="menu-submenu">
              
              <div className="menu-item">
                <Link to={'type-in'} className="menu-link">
                  <div className="menu-text">ປະເພດປະກັນໄພ</div>
                </Link>
              </div>
              <div className="menu-item">
                <Link to={'type-car'} className="menu-link">
                  <div className="menu-text">ຕັ້ງຄ່າປະເພດລົດ</div>
                </Link>
              </div>
              <div className="menu-item">
                <Link to={'brand'} className="menu-link">
                  <div className="menu-text">ຕັ້ງຄ່າຍີ່ຫໍ້ລົດ</div>
                </Link>
              </div>
              <div className="menu-item">
                <Link to={'version'} className="menu-link">
                  <div className="menu-text">ຕັ້ງຄ່າລຸ້ນລົດ</div>
                </Link>
              </div>
              <div className="menu-item">
                <Link to={'user'} className="menu-link">
                  <div className="menu-text">ລົງທະບຽນຜູ້ເຂົ້າໃຊ້</div>
                </Link>
              </div>
              <div className="menu-item">
                <Link to={'currency'} className="menu-link">
                  <div className="menu-text">ຕັ້ງຄ່າສະກຸນເງິນ</div>
                </Link>
              </div>
            </div>
          </div>
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
