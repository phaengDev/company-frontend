import React, { useState, useEffect } from "react";
import { Input, InputGroup, DatePicker, SelectPicker, Loader, Placeholder, Button } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import axios from 'axios';
import { Config } from "../../config/connenct";
import moment from "moment";
import numeral from "numeral";
import { useTypeCm, useOption } from "../../config/select-option";
export default function ContractItems() {
  const api = Config.urlApi;
  const companyId = localStorage.getItem('company_agent_id');

  const dataType = useTypeCm(companyId)
  const [typeId, setTypeId] = useState(null)
  const handleShowType = (e) => {
    setTypeId(e)
    setInputs({
      ...inputs,
      insurance_type_fk: e
    })
  }
  const dataOption = useOption(typeId)

  const [inputs, setInputs] = useState({
    companyId_fk: companyId,
    start_date: new Date(),
    end_date: new Date(),
    insurance_type_fk: '',
    option_id_fk: '',
    agent_id_fk: '',
    type_buyer_fk: '',
  })

  //======================================================

  const [data, setData] = useState([]);
  const [currentPage, setcurrentPage] = useState(1);
  const [itemsPerPage, setitemsPerPage] = useState(100);
  const handleShowLimit = (value) => {
    setitemsPerPage(value);
  };
  const [pageNumberLimit, setpageNumberLimit] = useState(5);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

  const handleClick = (event) => {
    setcurrentPage(Number(event.target.id));
  };

  const pages = [];
  for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
    pages.push(i);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const qtyItem = data.length;
  const renderPageNumbers = pages.map((number) => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <li key={number} className={`page-item ${currentPage == number ? "active" : ''}`} >
          <span role="button" id={number} onClick={handleClick} className="page-link border-blue">{number}</span>
        </li>
      );
    } else {
      <li key={number} className="page-item active" >
        <span role="button" className="page-link border-blue">1</span>
      </li>
    }
  });

  //================================

  const handleSearch = (name, value) => {
    setInputs({
      ...inputs, [name]: value
    })
  };

  const [loading, setLoading] = useState(false);
  const [dataFilter, setDataFilter] = useState([]);
  const fetchInsurance = async () => {
    axios.post(api + 'report/all', inputs)
      .then(response => {
        setData(response.data);
        setDataFilter(response.data)
      })
      .catch(error => {
        console.error('Error searching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }


  const handleFilter = (event) => {
    const searchTerm = event.toLowerCase(); // Ensure it's coming from an input event
    setData(dataFilter.filter(n =>
      n.contract_number.toLowerCase().includes(searchTerm) ||
      n.currency_name.toLowerCase().includes(searchTerm) ||
      n.customer_name.toLowerCase().includes(searchTerm)
    ));
  };

  useEffect(() => {
    fetchInsurance();
  }, [inputs]);
  // ===================== //=====================



  const groupedData = currentItems.reduce((acc, item) => {
    const currency = item.currency_name;
    if (!acc[currency]) {
      acc[currency] = {
        initial_fee: 0,
        money_taxes: 0,
        registration_fee: 0,
        insuranc_included: 0,
      };
    }

    acc[currency].initial_fee += parseFloat(item.initial_fee);
    acc[currency].money_taxes += parseFloat(item.money_taxes);
    acc[currency].registration_fee += parseFloat(item.registration_fee);
    acc[currency].insuranc_included += parseFloat(item.insuranc_included);

    return acc;
  }, {});
  const formatNumber = (num) => numeral(num).format('0,00.00');


  // ==================== //======================
  const handleNextbtn = () => {
    setcurrentPage(currentPage + 1);

    if (currentPage + 1 > maxPageNumberLimit) {
      setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  const handlePrevbtn = () => {
    setcurrentPage(currentPage - 1);
    if ((currentPage - 1) % pageNumberLimit == 0) {
      setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };
  return (
    <>
      <div id="content" class="app-content p-0 bg-component">
        <div class="app-content-padding px-4 py-3">
          <h1 className="page-header"> ຂໍ້ມູນສັນຍາປະກັນໄພ</h1>
          <div className="panel panel-inverse">
            <div className="panel-body p-0">
              <div className="row fs-14px mb-3">
                <div className="col-sm-8 col-lg-5">
                  <div className="row ">
                    <div className="col-6">
                      <label htmlFor="" className="form-label">ວັນທີ</label><br />
                      <DatePicker oneTap value={inputs.start_date} format="dd/MM/yyyy" onChange={value => handleSearch('start_date', value)} block placeholder='ວັນທີ' />
                    </div>
                    <div className="col-6">
                      <label htmlFor="" className="form-label">ຫາວັນທີ</label>
                      <DatePicker oneTap value={inputs.end_date} format="dd/MM/yyyy" onChange={value => handleSearch('end_date', value)} block placeholder='ວັນທີ' />
                    </div>
                  </div>
                </div>
                <div className="col-sm-4 col-lg-3 col-6">
                  <label htmlFor="" className="form-label">ປະເພດປະກັນ</label>
                  <SelectPicker name="type_fk" data={dataType} onChange={value => handleShowType(value)} placeholder={'- ເລືອກປະເພດ -'} block />
                </div>
                <div className="col-sm-4 col-lg-2 col-6">
                  <label htmlFor="" className="form-label">ທາງເລືອກ</label>
                  <SelectPicker name="" data={dataOption} placeholder={'ທາງເລືອກ'} onChange={value => handleSearch('option_id_fk', value)} block />
                </div>
                <div className="col-sm-4 col-lg-2  mt-4">
                  <Button color='red' appearance="primary" onClick={handleSearch} ><i className="fas fa-search fs-16px me-2"></i>  ຄົ້ນຫາ</Button>
                </div>
              </div>

              <div className="d-lg-flex align-items-center mb-3">
                <div className="d-lg-flex d-none align-items-center text-nowrap">
                  ສະແດງ:
                  <select onChange={(e) => handleShowLimit(e.target.value)} className="form-select border-blue form-select-sm ms-2  ps-2 pe-30px" >
                    <option value={100} selected>100</option>
                    <option value={250}>250</option>
                    <option value={500}>500</option>
                    <option value={1000}>1000</option>
                    <option value={2500}>2500</option>
                    <option value={5000}>5000</option>
                    <option value={qtyItem}>ທັງໝົດ</option>
                  </select>
                </div>
                <div className="d-lg-block d-none ms-2 text-body text-opacity-50">
                  ລາຍການ
                </div>
                <div className="pagination  mb-0 ms-auto ">
                  <InputGroup inside >
                    <InputGroup.Addon>
                      <SearchIcon />
                    </InputGroup.Addon>
                    <Input block onChange={(e) => handleFilter(e)} placeholder="ເລກທີສັນຍາ" />
                  </InputGroup>
                </div>

              </div>

              <div className="table-responsive">
                <table className="table table-striped table-bordered align-middle w-100 text-nowrap">
                  <thead className="fs-14px bg-header">
                    <tr>
                      <th className="text-center">ລ/ດ</th>
                      <th className="">ຊື່ລູກຄ້າ</th>
                      <th className="">ເລກທີສັນຍາ</th>
                      <th className="">ວັນທີເລີມສັນຍາ</th>
                      <th className="">ວັນທີສິນສຸດສັນຍາ</th>
                      <th className="">ປະເພດປະກັນ</th>
                      <th className="">ທາງເລືອກ</th>
                      <th className="text-end ">ຄ່າທຳນຽມເບື້ອງຕົ້ນ</th>
                      <th className="text-center">ຄ່າອາກອນ</th>
                      <th className="text-end">ເປັນເງິນ</th>
                      <th className="text-end">ຄ່າລົງທະບຽນ</th>
                      <th className="text-end">ຄ່າປະກັນໄພລວມ</th>
                    </tr>
                  </thead>
                  {loading === false ? (
                    <tbody>
                      {currentItems.length > 0 ? (
                        <>
                          {currentItems.map((item, key) => (
                            <tr key={key}>
                              <td className="text-center">{item.idAuto}</td>
                              <td>{item.customer_name}</td>
                              <td>{item.contract_number}</td>
                              <td>{moment(item.contract_start_date).format('DD/MM/YYYY')}</td>
                              <td>{moment(item.contract_end_date).format('DD/MM/YYYY')}</td>
                              <td>{item.type_in_name}</td>
                              <td>{item.options_name}</td>
                              <td className="text-end">{numeral(item.initial_fee).format('0,00')}</td>
                              <td className="text-center">{item.percent_taxes} %</td>
                              <td className="text-end">{numeral(item.money_taxes).format('0,00')}</td>
                              <td className="text-end">{numeral(item.registration_fee).format('0,00')}</td>
                              <td className="text-end">{numeral(item.insuranc_included).format('0,00')}</td>
                            </tr>
                          ))}
                          {Object.keys(groupedData).map((currency, key) => (
                            <tr key={`${key}`}>
                              <td colSpan={7} className='text-end'>ລວມຍອດຄ້າງຮັບທັງໝົດ ({currency})</td>
                              <td className='text-end'>{formatNumber(groupedData[currency].initial_fee)}</td>
                              <td></td>
                              <td className='text-end'>{formatNumber(groupedData[currency].money_taxes)}</td>
                              <td className='text-end'>{formatNumber(groupedData[currency].registration_fee)}</td>
                              <td className='text-end'>{formatNumber(groupedData[currency].insuranc_included)}</td>

                            </tr>
                          ))}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={12} className="text-center text-danger fs-16px">
                            ບໍ່ພົບຂໍ້ມູນ ໃນການຄົ້ນຫາ
                          </td>
                        </tr>
                      )}
                    </tbody>
                  ) : (<>
                    <tbody className="">
                      <tr className="">
                        <td colSpan={13} className="bg-info">
                          <Placeholder.Paragraph rows={5} />
                          <Loader center content="ກຳລັງໂຫລດຂໍ້ມູນ ........" className="mt-3" />
                        </td>
                      </tr>
                    </tbody>
                  </>)}
                </table>
              </div>
              <div className="d-md-flex align-items-center">
                <div className="me-md-auto text-md-left text-center mb-2 mb-md-0">
                  ສະແດງ 1 ຫາ {itemsPerPage} ຂອງ {qtyItem} ລາຍການ
                </div>
                <ul className="pagination  mb-0 ms-auto justify-content-center">
                  <li className="page-item "><span role="button" onClick={handlePrevbtn} className={`page-link  ${currentPage == pages[0] ? 'disabled' : 'border-blue'}`} ><i className="fa-solid fa-angles-left"></i></span></li>
                  {minPageNumberLimit >= 1 ? (
                    <li className="page-item"><span role="button" className="page-link disabled">...</span></li>
                  ) : ''}
                  {renderPageNumbers}
                  {pages.length > maxPageNumberLimit ? (
                    <li className="page-item"><span role="button" className="page-link disabled">...</span></li>
                  ) : ''}
                  <li className="page-item"><span role="button" onClick={handleNextbtn} className={`page-link  ${currentPage == pages[pages.length - 1] ? 'disabled' : 'border-blue'}`}><i className="fa-solid fa-angles-right"></i></span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  );

}
