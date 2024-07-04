import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Modal, InputGroup, Input, SelectPicker, Button, Grid, Row, Col, Form, Radio, RadioGroup } from 'rsuite';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import axios from 'axios';
import Swal from "sweetalert2";
import { Config } from '../../config/connenct';
import Alert from '../../utils/config';
export default function UserCompany() {

  const api = Config.urlApi;
  const [visible, setVisible] = React.useState(false);
  const handleShow = () => {
    setVisible(!visible);
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const [itemCompany, setItemCompany] = useState([]);
  const fetchCompany = async () => {
    try {
      const response = await fetch(api + 'company/fetch');
      const jsonData = await response.json();
      setItemCompany(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  const data = itemCompany.map(item => ({ label: item.com_name_lao, value: item.company_Id }));
  //=================
  const [inputs, setInputs] = useState({
    userId:'',
    userName: '',
    userEmail: '',
    userPassword: '',
    user_type_fk: '4',
    company_agent_fk: '',
    depart_id_fk: '',
    statusUse: '1',
    statusOff:'1'
  })
  const handleChange = (name, value) => {
    setInputs({
      ...inputs, [name]: value
    });
  }
  //==========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios.post(api + 'user/create', inputs)
        .then(function (respones) {
          if (respones.status === 200) {
            handleClose();
            fetchUsers();
            Alert.successData(respones.data.message)
          } else {
            Alert.errorData(respones.data.message)
          }
        });
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };

const  handleEdit=(item)=>{
  setInputs({
    userId:item.user_Id,
    userName: item.userName,
    userEmail: item.userEmail,
    userPassword: item.userPassword,
    company_agent_fk: item.company_agent_fk,
    user_type_fk: '4',
    statusUse: '1',
    statusOff:item.statusOff
  })
  setOpen(true);
}
  

  const headleDelete = (id) => {
    Swal.fire({
      title: "ຢືນຢັນ?",
      text: "ທ່ານຕ້ອງການລົບຂໍ້ມູນນີ້ແທ້ບໍ່!",
      icon: "warning",
      width: 400,
      showDenyButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ຕົກລົງ",
      denyButtonText: `ຍົກເລີກ`
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(api + `user/${id}`).then(function (response) {
          if (response.status === 200) {
            fetchUsers();
            Alert.successData(response.data.message)
          } else {
            Alert.errorData(response.data.message)
          }
        });
      }
    });
  }

  //===============

  const [filter, setFilter] = useState([])
  const [itemUser, setItemUser] = useState([]);
  const fetchUsers = async () => {
    try {
      const response = await fetch(api + 'user/cmn');
      const jsonData = await response.json();
      setItemUser(jsonData);
      setFilter(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  const Filter = (event) => {
    setItemUser(filter.filter(n => n.customer_name.toLowerCase().includes(event)))
  }


  const [currentPage, setcurrentPage] = useState(1);
  const [itemsPerPage, setitemsPerPage] = useState(100);
  // const handleShowLimit = (value) => {
  //   setitemsPerPage(value);
  // };
  // const [pageNumberLimit, setpageNumberLimit] = useState(5);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

  const handleClick = (event) => {
    setcurrentPage(Number(event.target.id));
    setI(indexOfLastItem + 1)
  };

  const pages = [];
  for (let i = 1; i <= Math.ceil(itemUser.length / itemsPerPage); i++) {
    pages.push(i);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = itemUser.slice(indexOfFirstItem, indexOfLastItem);

  const [i, setI] = useState(1);
  const qtyItem = itemUser.length;
  const renderPageNumbers = pages.map((number) => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <li key={number} className={`page-item ${currentPage === number ? "active" : ''}`} >
          <span role="button" id={number} onClick={handleClick} className="page-link border-blue">{number}</span>
        </li>
      );
    } else {
      <li key={number} className="page-item active" >
        <span role="button" className="page-link border-blue">1</span>
      </li>
    }
  });

  const handleNextbtn = () => {
    setcurrentPage(currentPage + 1);

    if (currentPage + 1 > maxPageNumberLimit) {
      setmaxPageNumberLimit(maxPageNumberLimit + 5);
      setminPageNumberLimit(minPageNumberLimit + 5);
    }
  };

  const handlePrevbtn = () => {
    setcurrentPage(currentPage - 1);
    setI(indexOfLastItem - 1)

    if ((currentPage - 1) % 5 === 0) {
      setmaxPageNumberLimit(maxPageNumberLimit - 5);
      setminPageNumberLimit(minPageNumberLimit - 5);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCompany();
  }, []);

  return (
    <>
      <div id="content" className="app-content">
        <ol class="breadcrumb float-end">
          <li class="breadcrumb-item"><span role='button' onClick={handleOpen} className='btn  btn-sm btn-danger'><i className="fa-solid fa-user-plus"></i> ເພີ່ມຂໍ້ມູນໃໝ່</span></li>
        </ol>
        <h2 class="page-header">ການຕັ້ງຄ່າຊື້ຜູ້ໃຊ້ງານລະບົບ </h2>
        <div className="panel panel-inverse panel-with-tabs">
          <div className="panel-heading p-0">
            <div className="tab-overflow px-3">
              <ul className="nav nav-tabs nav-tabs-inverse py-1  ">
                <li className="nav-item prev-button">
                  <a href="javascript:;"
                    data-click="prev-tab"
                    className="nav-link text-primary"  >
                    <i className="fa fa-arrow-left" />
                  </a>
                </li>
                <li className="nav-item">
                  <Link to={'/user'} className="nav-link ">
                    ຂໍ້ມູນຜູ້ເຂົ້າໃຊ້ ໂອເອຊີ
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={'/user-ag'} className="nav-link ">
                    ຂໍ້ມູນຜູ້ເຂົ້າໃຊ້ ຕົວແທນຂາຍປະກັນ
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={'/user-buy'} className="nav-link ">
                    ຂໍ້ມູນຜູ້ເຂົ້າໃຊ້ ລູກຄ້າຊື້ປະກັນໄພ
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={'/user-cn'} className="nav-link active">
                    ຂໍ້ມູນຜູ້ເຂົ້າໃຊ້ ບໍລິສັດປະກັນໄພ
                  </Link>
                </li>

                <li className="nav-item next-button">
                  <a href="javascript:;"
                    data-click="next-tab"
                    className="nav-link text-primary" >
                    <i className="fa fa-arrow-right" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="panel-heading-btn me-2 ms-2 d-flex">
              <a href="javascript:;"
                className="btn btn-xs btn-icon btn-circle btn-secondary"
                data-toggle="panel-expand" >
                <i className="fa fa-expand" />
              </a>
            </div>
          </div>
          <div className="panel-body tab-content">
            <div className="tab-pane fade active show" >
              <div className="table-responsive">
                <div className="row mb-3">
                  <div className="col-sm-9 fs-20px">ລາຍການຜູ້ໃຊ້ ບໍລິສັດປະກັນໄພ</div>
                  <div className="col-sm-3">
                    <div className='input-group' >
                      <InputGroup.Addon>
                        <i className="fas fa-search"></i>
                      </InputGroup.Addon>
                      <input className='form-control' onChange={(event) => Filter(event.target.value)} placeholder="ຄົ້ນຫາ" />
                    </div>
                  </div>
                </div>
                <table id="data-table-default" className="table table-striped table-bordered align-middle w-100 text-nowrap">
                  <thead className='bg-header'>
                    <tr>
                      <th width="1%" className='text-center'>ລ/ດ</th>
                      <th>ຊື່ຜູ້ໃຊ້ຕົວແທນ</th>
                      <th>ອິເມວ</th>
                      <th>ລະຫັດຜ່ານ</th>
                      <th>ສະຖານະ</th>
                      <th className='text-center'>ການຕັ້ງຄ່າ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, key) => (
                      <tr key={key}>
                        <td className='text-center'>{key + 1}</td>
                        <td>{item.com_name_lao}</td>
                        <td>{item.userEmail}</td>
                        <td>{item.userPassword}</td>
                        <td><span class={`badge ${item.statusOff === 1 ? 'bg-primary' : 'bg-danger'} `}>{item.offName}</span></td>
                        <td className='text-center'>
                          <button type='button' onClick={()=>handleEdit(item)} class="btn btn-blue btn-xs me-2"><i class="fa-solid fa-pen-to-square"></i></button>
                          <button type='button' onClick={() => headleDelete(item.user_Id)} class="btn btn-red btn-xs"><i class="fa-solid fa-trash"></i></button>
                        </td>
                      </tr>
                    )
                    )}
                  </tbody>
                </table>
              </div>
              <div class="d-md-flex align-items-center">
                <div class="me-md-auto text-md-left text-center mb-2 mb-md-0">
                  ສະແດງ 1 ຫາ {itemsPerPage} ຂອງ {qtyItem} ລາຍການ
                </div>
                <ul className="pagination  mb-0 ms-auto justify-content-center">
                  <li className="page-item "><span role="button" onClick={handlePrevbtn} className={`page-link  ${currentPage === pages[0] ? 'disabled' : 'border-blue'}`} >ກອນໜ້າ</span></li>
                  {minPageNumberLimit >= 1 ? (
                    <li className="page-item"><span role="button" className="page-link disabled">...</span></li>
                  ) : ''}
                  {renderPageNumbers}
                  {pages.length > maxPageNumberLimit ? (
                    <li className="page-item"><span role="button" className="page-link disabled">...</span></li>
                  ) : ''}
                  <li className="page-item"><span role="button" onClick={handleNextbtn} className={`page-link  ${currentPage === pages[pages.length - 1] ? 'disabled' : 'border-blue'}`}>ໜ້າຕໍ່ໄປ</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <Modal open={open} onClose={handleClose}>
          <Modal.Header>
            <Modal.Title className='pt-1'>ເພີ່ມຂໍ້ມູນເຂົ້າໃຊ້ລະບົບ</Modal.Title>
          </Modal.Header>
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <Grid fluid>
                <Row>
                  <Col lg={24} sm={24} md={12} className='mb-2'>
                    <label htmlFor="" className='form-label'>ບໍລິສັດປະກັນໄພ</label>
                    <SelectPicker data={data} value={inputs.company_agent_fk}  onChange={(e) => handleChange('company_agent_fk', e)} block placeholder='-  ບໍລິສັດປະກັນໄພ  -' />
                  </Col>

                  <Col lg={12} sm={6} md={12} className='mb-2'>
                    <label htmlFor="" className='form-label'>Email</label>
                    <Input placeholder="Email" value={inputs.userEmail} onChange={(e) => handleChange('userEmail', e)} required />
                  </Col>
                  <Col lg={12} sm={6} md={12} className='mb-2'>
                    <label htmlFor="" className='form-label'>Password</label>
                    <InputGroup inside>
                      <Input type={visible ? 'text' : 'password'} value={inputs.userPassword} onChange={(e) => handleChange('userPassword', e)} required />
                      <InputGroup.Button onClick={handleShow}>
                        {visible ? <EyeIcon /> : <EyeSlashIcon />}
                      </InputGroup.Button>
                    </InputGroup>
                  </Col>
                  <Col lg={24}  className='mb-2'>
                  <label htmlFor="" className='form-label'>ສະຖານະ</label>
                  <select value={inputs.statusOff} onChange={(e) => handleChange('statusOff', e.target.value)} className='form-select'>
                    <option value="1">ເປິດນຳໃຊ້</option>
                    <option value="2">ປິດນຳໃຊ້</option>
                  </select>
                  </Col>
                </Row>
              </Grid>
            </Modal.Body>
            <Modal.Footer>
              <Button type='submit' appearance="primary">ບັນທຶກ </Button>
              <Button color='red' onClick={handleClose} appearance="primary"> ຍົກເລີກ </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    </>
  )
}
