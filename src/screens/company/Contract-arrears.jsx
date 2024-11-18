import React, { useState, useEffect } from "react";
import { Input, InputGroup, DatePicker, SelectPicker, Loader, Placeholder, Button } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import { Config } from "../../config/connenct";
import axios from 'axios';
import moment from "moment";
import numeral from "numeral";
import { useTypeCm, useOption } from "../../config/select-option";
export default function ContractArrears() {
  const api = Config.urlApi;
  const companyId = localStorage.getItem('company_agent_id');

  const dataType = useTypeCm(companyId)
  const [typeId, setTypeId] = useState(null)
  const handleShowType = (value) => {
    setTypeId(value);
    setItemData(filter.filter(n => n.insurance_type_fk === value));
  }


  const dataOption = useOption(typeId)
  const [inputs, setInputs] = useState({
    start_date: new Date(),
    end_date: new Date(),
    company_id_fk: companyId,
    option_id_fk: '',
    agent_id_fk: '',
    status_pay: '1',
  });

  //======================================================

  const handleSearch = (name, value) => {
    setInputs({
      ...inputs, [name]: value
    })
  }

  const [isLoading, setIsLoading] = useState(true)
  const [itemData, setItemData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(api + 'debt/company', inputs);
      setItemData(response.data);
      console.log(response.data)
      setFilter(response.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const Filter = (value) => {
    setItemData(filter.filter(n =>
      n.contract_number.toLowerCase().includes(value) ||
      n.customer_name.toLowerCase().includes(value)
    ));
  };

  const handlePageSizeChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page when page size changes
  };

  const paginatedData = itemData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(itemData.length / itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };


  // ============================

  const sumData = itemData.reduce((acc, item) => {
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
  const formatNumber = (num) => numeral(num).format('0,00');


  useEffect(() => {
    fetchReport();
  }, [companyId]);


  return (
    <>
      <div id="content" className="app-content p-0 bg-white">
        <h1 className="page-header px-3 pt-4"> ລາຍງານຕິດຕາມໜີ້ຄ້າງຮັບ</h1>
        <div className="panel panel-inverse">

          <div className="panel-body">
            <div className="row fs-14px mb-3">
              <div className="col-sm-6 col-lg-5">
                <div className="row ">
                  <div className="col-6">
                    <label htmlFor="" className="form-label">ວັນທີ</label>
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
                <SelectPicker data={dataType} onChange={value => handleShowType(value)} placeholder={'- ເລືອກປະເພດ -'} value={inputs.insurance_type_fk} block />
              </div>
              <div className="col-sm-4 col-lg-2 col-6">
                <label htmlFor="" className="form-label">ທາງເລືອກ</label>
                <SelectPicker data={dataOption} placeholder={'ທາງເລືອກ'} onChange={value => handleSearch('option_id_fk', value)} value={inputs.option_id_fk} block />
              </div>

              <div className="col-sm-4 col-lg-2">
                <Button color="red" appearance="primary" className="mt-4" onClick={fetchReport}>ດຶງລາຍງານ</Button>
              </div>
            </div>
            <div className="d-lg-flex align-items-center mb-3">
              <div className="d-lg-flex d-none align-items-center text-nowrap">
                ສະແດງ:
                <select value={itemsPerPage} onChange={handlePageSizeChange} className="form-select border-blue form-select-sm ms-2  ps-2 pe-30px" >
                  <option value={100} selected>100</option>
                  <option value={250}>250</option>
                  <option value={500}>500</option>
                  <option value={1000}>1000</option>
                  <option value={2500}>2500</option>
                  <option value={5000}>5000</option>
                  <option value={itemData.length}>ທັງໝົດ</option>
                </select>
              </div>
              <div className="d-lg-block d-none ms-2 text-body text-opacity-50"> ລາຍການ </div>
              <div className="pagination  mb-0 ms-auto">
                <InputGroup inside >
                  <InputGroup.Addon>
                    <SearchIcon />
                  </InputGroup.Addon>
                  <Input type="text" block  onChange={(event) => Filter(event)} placeholder="ເລກທີສັນຍາ/ຊື່ລູກຄ້າ" />
                </InputGroup>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle w-100 text-nowrap">
                <thead className="fs-14px bg-header">
                  <tr>
                    <th width='1%' className="text-center sticky-col first-col">ລ/ດ</th>
                    <th className="">ຊື່ລູກຄ້າ</th>
                    <th className="">ເລກທີສັນຍາ</th>
                    <th className="text-center">ວັນທີເລີມ</th>
                    <th className="text-center">ວັນທີສິນສຸດ</th>
                    <th className="">ປະເພດປະກັນ</th>
                    <th className="">ທາງເລືອກ</th>
                    <th className="text-end">ຄ່າທຳນຽມເບື້ອງຕັ້ນ	</th>
                    <th className="text-center">ອາກອນ</th>
                    <th className="text-end">ເປັນເງິນ</th>
                    <th className="text-end">ຄ່າລົງທະບຽນ</th>
                    <th className="text-end">ຄ່າທຳນຽມປະກັນລວມ</th>
                    <th className="text-center">ວັນທີຄ້າງ</th>
                    <th className="text-center">ຈຳນວນວັນ</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={19} className='text-center'>
                        <Placeholder.Grid rows={6} columns={10} active />
                        {/* <Loader size="lg" center content="ກຳລັງໂຫດ......" /> */}
                      </td>
                    </tr>
                  ) : (
                    paginatedData.length > 0 ? (
                      <>
                        {paginatedData.map((item, key) => (
                          <tr key={key}>
                            <td className='text-center bg-white sticky-col first-col'>{key + 1}</td>
                            <td>{item.customer_name}</td>
                            <td className=''>{item.contract_number}</td>
                            <td className='text-center'>{moment(item.contract_start_date).format('DD/MM/YYYY')}</td>
                            <td className='text-center'>{moment(item.contract_end_date).format('DD/MM/YYYY')}</td>
                            <td>{item.type_in_name}</td>
                            <td>{item.options_name}</td>
                            <td className='text-end'>{numeral(item.initial_fee).format('0,00')} {item.genus}</td>
                            <td className='text-center'>{item.percent_taxes}%</td>
                            <td className='text-end'>{numeral(item.money_taxes).format('0,00')} {item.genus}</td>
                            <td className='text-end'>{numeral(item.registration_fee).format('0,00')} {item.genus}</td>
                            <td className='text-end'>{numeral(item.insuranc_included).format('0,00')} {item.genus}</td>
                            <td className='text-center'>{moment(item.company_date).format('DD/MM/YYYY')}</td>
                            <td className='text-center'>{item.day_company} ວັນ</td>

                          </tr>
                        ))}

                        {Object.keys(sumData).map((currency, key) => (
                          <tr key={key}>
                            <td colSpan={7} className='text-end'>ລວມຍອດຮັບທັງໝົດ ({currency})</td>
                            <td className='text-end'>{formatNumber(sumData[currency].initial_fee)}</td>
                            <td></td>
                            <td className='text-end'>{formatNumber(sumData[currency].money_taxes)}</td>
                            <td className='text-end'>{formatNumber(sumData[currency].registration_fee)}</td>
                            <td className='text-end'>{formatNumber(sumData[currency].insuranc_included)}</td>
                            <td colSpan={3}></td>
                          </tr>
                        ))}
                      </>
                    ) : (<tr><td colSpan={26} className='text-center text-red'>ບໍ່ພົບຂໍ້ມູນທີ່ມີການຄົ້ນຫາ.......</td></tr>)
                  )}
                </tbody>
              </table>
            </div>
            <div className="d-md-flex align-items-center">
              <div className="me-md-auto text-md-left text-center mb-2 mb-md-0">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, itemData.length)} to {Math.min(currentPage * itemsPerPage, itemData.length)} of {itemData.length} entries
              </div>
              <ul className="pagination mb-0 justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <a href="javascript:void(0)" className="page-link" onClick={goToPreviousPage}>Previous</a>
                </li>
                {Array.from({ length: totalPages }, (_, index) => (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <a href="javascript:void(0)" className="page-link" onClick={() => goToPage(index + 1)}>
                      {index + 1}
                    </a>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <a href="javascript:void(0)" className="page-link" onClick={goToNextPage}>Next</a>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
      {/* <Placeholder.Grid rows={5} columns={11} active   color='red' /> */}
    </>
  );
}
