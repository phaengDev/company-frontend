import React, { useState, useEffect } from 'react'
import { DatePicker, Input, InputGroup, SelectPicker, Placeholder, Loader } from 'rsuite'
import { useCompany, useTypeincar, useAgent,useTypeCar,useOption } from '../../config/select-option';
import { Config, imageUrl } from '../../config/connenct';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { ViewInsturance } from '../invioce/view-data-insturance';
function ReportInsuranceCar() {
    const api = Config.urlApi;
  const url = imageUrl.url;
  const itemcm = useCompany();
  const itemType = useTypeincar();
  const itemtypecar = useTypeCar();
  const itemagent = useAgent();
  const user_type = parseInt(localStorage.getItem('user_type'), 10);
  const companyId = parseInt(localStorage.getItem('company_agent_id'), 10);


  const handleOption = async (name, value) => {
    setTypeId(value);
    setData({
      ...data, [name]: value
    })
  };
const [typeId, setTypeId] = useState(null)
const dataOption=useOption(typeId)
  
  const [data, setData] = useState({
    start_date: new Date(),
    end_date: new Date(),
    company_id_fk: '',
    insurance_type_fk: '',
    agent_id_fk: '',
    custom_id_fk:'',
    car_type_id_fk: '',
    option_id_fk: '',
  })
  const handleChange = (name, value) => {
    setData({
      ...data, [name]: value
    })
  }

  const [isLoading, setIsLoading] = useState(true)
  const [itemData, setItemData] = useState([]);
  const [filter, setFilter] = useState([]);
  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(api + 'report/cars', data);
      setItemData(response.data); // Axios already parses the response
      setFilter(response.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const Filter = (event) => {
    const searchTerm = event.toLowerCase();
    setItemData(
        filter.filter(
            n => n.contract_number.toLowerCase().includes(searchTerm) || 
                 n.car_registration.toLowerCase().includes(searchTerm) ||
                 n.vehicle_number.toLowerCase().includes(searchTerm) ||
                 n.tank_number.toLowerCase().includes(searchTerm)
        )
    );
};



  // =================== custom pages============
  const [currentPage, setcurrentPage] = useState(1);

  const [itemsPerPage, setitemsPerPage] = useState(100);
  const handleShowLimit = (value) => {
    setitemsPerPage(value);
  };
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

  const handlePageClick = (event) => {
    setcurrentPage(Number(event.target.id));
    setI(indexOfLastItem + 1)
  };

  const pages = [];
  for (let i = 1; i <= Math.ceil(itemData.length / itemsPerPage); i++) {
    pages.push(i);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = itemData.slice(indexOfFirstItem, indexOfLastItem);

  const [i, setI] = useState(1);
  const qtyItem = itemData.length;
  const renderPageNumbers = pages.map((number) => {
    if (number > minPageNumberLimit && number <= maxPageNumberLimit) {
      return (
        <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
          <span role="button" id={number} onClick={handlePageClick} className="page-link border-blue">
            {number}
          </span>
        </li>
      );
    } else {
      return (
        number = ''
      )
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

    if ((currentPage - 1) % 5 == 0) {
      setmaxPageNumberLimit(maxPageNumberLimit - 5);
      setminPageNumberLimit(minPageNumberLimit - 5);
    }
  };

  // =======================\\
const [showView, setShowView] = useState(false);
const [dataView, setDataView] = useState(null);
const handleView = (value) => {
    setDataView(value)
    setShowView(true)
}

  useEffect(() => {
    fetchReport();
  }, [data]);
  return (
    <div id="content" className="app-content p-0 bg-component">

      <div class="app-content-padding px-4 py-3">
        <div class="d-lg-flex mb-lg-3 mb-2">
          <h3 class="page-header mb-0 flex-1 fs-20px">ລາຍງານປະກັນໄພລົດ </h3>
          {/* <span class="d-none d-lg-flex align-items-center">
            <button class="btn btn-danger btn-sm d-flex me-2 pe-3 rounded-3">
              <i class="fa-solid fa-file-pdf fs-18px me-2 ms-n1"></i> Export PDF
            </button>
            <button class="btn btn-success btn-sm d-flex me-2 pe-3 rounded-3">
              <i class="fa-solid fa-cloud-arrow-down fs-18px me-2 ms-n1"></i>
              Export Excel
            </button>
          </span> */}
        </div>
        <div className="row mb-3">
          <div className="col-sm-4 col-md-2 col-6">
            <label htmlFor="" className='form-label'>ວັນທີ</label>
            <DatePicker oneTap defaultValue={data.start_date} onChange={(e) => handleChange('start_date', e)} format="dd/MM/yyyy" block />
          </div>
          <div className="col-sm-4 col-md-2  col-6">
            <label htmlFor="" className='form-label'>ຫາວັນທີ</label>
            <DatePicker oneTap defaultValue={data.end_date} onChange={(e) => handleChange('end_date', e)} format="dd/MM/yyyy" block />
          </div>
          <div className="col-sm-4 col-md-2">
            <label htmlFor="" className='form-label'>ບໍລິສັດປະກັນໄພ</label>
            <SelectPicker block data={itemcm} onChange={(e) => handleChange('company_id_fk', e)} />
          </div>
          <div className="col-sm-4 col-md-2  col-6">
            <label htmlFor="" className='form-label'>ປະເພດປະກັນ</label>
            <SelectPicker block data={itemType} onChange={(e) => handleOption('insurance_type_fk', e)} />
          </div>
          <div className="col-sm-4 col-md-2  col-6">
            <label htmlFor="" className='form-label'>ທາງເລືອກ</label>
            <SelectPicker block data={dataOption} onChange={(e) => handleChange('option_id_fk', e)} />
          </div>
          <div className="col-sm-4 col-md-2">
            <label htmlFor="" className='form-label'>ປະເພດລົດ</label>
            <SelectPicker block data={itemtypecar} value={data.car_type_id_fk} onChange={(e) => handleChange('car_type_id_fk', e)} readOnly={user_type === 2 && 'readOnly'} />
          </div>
        </div>
        <div class="d-lg-flex align-items-center mb-3">
          <div class="d-lg-flex d-none align-items-center text-nowrap">
            ສະແດງ:
            <select onChange={(e) => handleShowLimit(e.target.value)} class="form-select form-select-sm ms-2 ps-2 pe-30px">
              <option value={100}>100</option>
              <option value={205}>250</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
              <option value={qtyItem}>-All-</option>
            </select>
          </div>
          <div class="d-lg-block d-none ms-2 text-body text-opacity-50">
            ລາຍການ
          </div>
          <ul class="pagination pagination-sm mb-0 ms-auto justify-content-center">
            <InputGroup inside>
              <InputGroup.Addon> <i className="fas fa-search" /> </InputGroup.Addon>
              <Input block onChange={(e) => Filter(e)} className='w-250px' placeholder='ຄົ້ນຫາ...' />
            </InputGroup>
          </ul>
        </div>
        <div class="table-responsive">
          <table class="table table-striped  table-bordered align-middle w-100 text-nowrap">
            <thead className="fs-14px bg-header">
              <tr>
                <th width='1%' className="text-center">ລ/ດ</th>
                <th className="">ຊື່ລູກຄ້າຊື້ປະກັນ</th>
                <th className="">ເບີໂທລະສັບ</th>
                <th className="">ເລກທີສັນຍາ</th>
                <th className="text-center">ວັນທີເລີມ</th>
                <th className="text-center">ວັນທີສິນສຸດ</th>
                <th className="">ປະເພດຜູ້ຊື້</th>
                <th className="">ບໍລິສັດປະກັນໄພ</th>
                <th className="">ປະເພດປະກັນ</th>
                <th className="">ທາງເລືອກ</th>
                <th className="">ປະເພດລົດ</th>
                <th className="">ຍີ່ຫໍ້ລົດ</th>
                <th className="">ທະບຽນລົດ</th>
                <th className="">ເລກຈັກ</th>
                <th className="">ເລກຖັງ</th>
                <th className="">ຕົວແທນຂາຍ</th>
                <th className="">ເບີໂທລະສັບ</th>
                <th width='10%' className="text-center">ການຕັ້ງຄ່າ</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
               <> <Placeholder.Grid rows={5} columns={6} active />
                    <Loader size="lg" center content="ກຳລັງໂຫດ......" vertical />
                    </>
              ) : (
                currentItems.length > 0 ? (
                  <>
                    {currentItems.map((item, key) => (
                      <tr key={key}>
                        <td className='text-center'>{item.idAuto}</td>
                        <td>{item.customer_name}</td>
                        <td className='text-center'>{item.registra_tel}</td>
                        <td>{item.contract_number}</td>
                        <td>{moment(item.contract_start_date).format('DD/MM/YYYY')}</td>
                        <td>{moment(item.contract_end_date).format('DD/MM/YYYY')}</td>
                        <td>{item.type_buyer_name}</td>
                        <td>{item.com_name_lao}</td>
                        <td>{item.type_in_name}</td>
                        <td>{item.options_name}</td>
                        <td>{item.typecar_name}</td>
                        <td>{item.brands_name}</td>
                        <td>{item.car_registration}</td>
                        <td>{item.vehicle_number}</td>
                        <td>{item.tank_number}</td>
                        <td>{item.agent_name}</td>
                        <td>{item.agent_tel}</td>
                        <td className='text-center'>
                            <button className='btn btn-orange btn-xs' onClick={() => handleView(item)} ><i class="fa-solid fa-eye"/></button>
                         </td>
                      </tr>
                    ))}
                  </>
                ) : (<tr><td colSpan={26} className='text-center text-red'>ບໍ່ພົບຂໍ້ມູນທີ່ມີການຄົ້ນຫາ.......</td></tr>)
              )}
            </tbody>
          </table>
        </div>
        <div class="d-md-flex align-items-center">
          <div class="me-md-auto text-md-left text-center mb-2 mb-md-0">
            ສະແດງ 1 ຫາ {itemsPerPage} ຂອງ {qtyItem} ລາຍການ
          </div>
          <ul className="pagination  mb-0 ms-auto justify-content-center">
            <li className="page-item "><span role="button" onClick={handlePrevbtn} className={`page-link  ${currentPage === pages[0] ? 'disabled' : 'border-blue'}`} ><i class="fa-solid fa-angles-left"></i></span></li>
            {minPageNumberLimit >= 1 ? (
              <li className="page-item"><span role="button" className="page-link disabled">...</span></li>
            ) : ''}
            {renderPageNumbers}
            {pages.length > maxPageNumberLimit ? (
              <li className="page-item"><span role="button" className="page-link disabled">...</span></li>
            ) : ''}
            <li className="page-item"><span role="button" onClick={handleNextbtn} className={`page-link  ${currentPage === pages[pages.length - 1] ? 'disabled' : 'border-blue'}`}><i class="fa-solid fa-angles-right"></i></span></li>
          </ul>
        </div>
      </div>

      <ViewInsturance show={showView} handleClose={() => setShowView(false)} data={dataView} />
                 
    </div>
  )
}

export default ReportInsuranceCar