import React, { useState, useEffect } from 'react'
import { DatePicker, SelectPicker, Input, InputGroup, Placeholder, Loader, Button } from 'rsuite'
import { useOption, useType } from '../../config/select-option';
import { Config, imageUrl } from '../../config/connenct';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import ViewRefund from './View-refund';
function ReprtRefundCompany() {
  const api = Config.urlApi;
  const url = imageUrl.url;
  const itemType = useType();
  const companyId = parseInt(localStorage.getItem('company_agent_id'), 10);
const [open, setOpen] = useState(false);
const stsrefund = [
  { label: '== ທັງໝົດ ==', value: '' },
  { label: ' ຄ້າງຄືນລູກຄ້າ', value: 'cm-1' },
  { label: ' ຄືນລູກຄ້າແລ້ວ', value: 'cm-2' },
  { label: ' ຄ້າງຮັບຄອມຄືນ', value: 'ac-1' },
  { label: ' ຮັບຄອມຄືນແລ້ວ', value: 'ac-2' },
];

  const [data, setData] = useState({
    start_date: new Date(),
    end_date: new Date(),
    companyId_fk: companyId,
    insurance_typeId: '',
    option_id_fk: '',
    status_refund: '',
  })
  const handleChange = (name, value) => {
    setData({
      ...data, [name]: value
    })
  }

  const [typeId, setTypeId] = useState(null)
  const itemOption = useOption(typeId);
  const handleShowOption = (name, value) => {
    setData({
      ...data, [name]: value
    })
    setTypeId(value)
  }



  const [isLoading, setIsLoading] = useState(true)
  const [itemData, setItemData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(api + 'retrun/cn', data);
      setItemData(response.data);
      setDataFilter(response.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const Filter = (event) => {
    const query = event.toLowerCase();
    setItemData(dataFilter.filter(n =>
      n.contract_number.toLowerCase().includes(query) ||
      n.currency_name.toLowerCase().includes(query) ||
      n.customer_name.toLowerCase().includes(query)
    ));
    setCurrentPage(1);
  };
  const handleShowLimit = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = itemData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle pagination
const totalPages = Math.ceil(itemData.length / itemsPerPage);
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const sumData = currentItems.reduce((acc, item) => {
    const currency = item.currency_name;
    if (!acc[currency]) {
      acc[currency] = {
        retrun_balance: 0,
        balance_agent: 0,
        balance_oac: 0,
      };
    }
    acc[currency].retrun_balance += parseFloat(item.retrun_balance);
    acc[currency].balance_agent += parseFloat(item.balance_agent);
    acc[currency].balance_oac += parseFloat(item.balance_oac);
    return acc;
  }, {});
  const formatNumber = (num) => numeral(num).format('0,00.00');


  const handleDownload = async (fileName) => {
    try {
      const response = await fetch(fileName); // Replace with your server URL
      if (!response.ok) {
        throw new Error('File download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      alert('ຂໍອະໄພບໍ່ມີໄຟລ໌ໃນໂຟນເດີ ກະລຸນາອັບເດດໄຟລ໌ເຂົ້າໃໝ່!', error);
      // Handle error as needed
    }
  };

const [item,setItem]=useState();
const handleView=(item)=>{
  setItem(item)
  setOpen(true);
}

  useEffect(() => {
    fetchReport();
    setData({
      ...data,
      companyId_fk: companyId
    })
  }, [companyId])
  return (
    <div id="content" className="app-content p-0 bg-component">
      <div class="app-content-padding px-4 py-3">
        <div class="d-lg-flex mb-lg-3 mb-2">
          <h3 class="page-header mb-0 flex-1 fs-20px">ລາຍການສັນຍາສົ່ງເງິນຄືນ</h3>
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
          <div className="col-sm-4 col-md-3">
            <label htmlFor="" className='form-label'>ປະເພດປະກັນ</label>
            <SelectPicker block data={itemType} onChange={(e) => handleShowOption('insurance_typeId', e)} />
          </div>
          <div className="col-sm-4 col-md-2  col-8">
            <label htmlFor="" className='form-label'>ທາງເລືອກ </label>
            <SelectPicker block data={itemOption} value={data.option_id_fk} onChange={(e) => handleChange('option_id_fk', e)} />
          </div>
          <div className="col-sm-4 col-md-2  col-8">
            <label htmlFor="" className='form-label'>ສະຖານະ </label>
            <SelectPicker block data={stsrefund} value={data.status_refund} onChange={(e) => handleChange('status_refund', e)}  />
          </div>
          <div className="col-sm-4 col-md-1  col-4">
            <Button onClick={fetchReport} color="red" appearance="primary" className='mt-4'>ດຶງລາຍງານ</Button>
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
              <option value={itemData.length}>-All-</option>
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
                <th className="">ວັນທີລົງຂໍ້ມູນ</th>
                <th className="">ເລກທີສັນຍາ</th>
                <th className="">ຊື່ລູກຄ້າ</th>
                <th className="">ເບີໂທລະສັບ</th>
                <th className="">ປະເພດປະກັນ</th>
                <th className="">ທາງເລືອກ</th>
                <th className="text-end">ຍອດເງິນ</th>
                <th className="text-end">%ຈ່າຍ</th>
                <th className="text-center">ຈ່າຍຄືນລູກຄ້າ</th>
                <th className="text-center">ວັນທີ</th>
                <th className='text-center'>ຮັບຄອມຄືນ</th>
                <th className="text-center">ວັນທີ</th>
                <th className="text-center sticky-col first-col-end">#</th>
                <th className="text-center">ເອກະສານ</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={27}>
                    <Placeholder.Grid rows={6} columns={10} active />
                    <Loader size="lg" center content="ກຳລັງໂຫດ......" />
                  </td>
                </tr>
              ) : (
                currentItems.length > 0 ? (
                  <>
                    {currentItems.map((item, key) => (
                      <tr key={key}>
                        <td className='text-center'>{item.idAuto}</td>
                        <td>{moment(item.register_date).format('DD/MM/YYYY')}</td>
                        <td>{item.contract_number}</td>
                        <td>{item.customer_name}</td>
                        <td>{item.registra_tel}</td>
                        <td>{item.type_in_name}</td>
                        <td>{item.options_name}</td>
                        <td className='text-end'>{numeral(item.retrun_balance).format('0,00.00')} {item.genus}</td>
                        <td className='text-end'>{item.percent_oac}% </td>
                        <td className="text-center">{item.status_company === 1 ? (<>ຄ້າງຄືນ<span className='text-red px-2'>{item.day_cpn}</span>ວັນ</>) : (<><i class="fa-solid fa-circle-check text-green"/> ຈ່າຍຄືນແລ້ວ</>)}</td>
                        <td className="text-center">{moment(item.oac_date).format('DD/MM/YYYY')}</td>
                        <td className="text-center">{item.status_oac === 1 ? (<>ຄ້າງຄືນ<span className='text-red px-2'>{item.day_oac}</span>ວັນ</>) : (<><i class="fa-solid fa-circle-check text-green"/> ຮັບຄືນແລ້ວ</>)}</td>
                        <td className="text-center">{moment(item.company_date).format('DD/MM/YYYY')}</td>
                        <td className='text-center bg-white sticky-col first-col-end'>
                          <button type='button' onClick={() => handleView(item)} className='btn btn-xs btn-orange'><i class="fa-solid fa-eye"></i></button>
                        </td>
                        <td className="text-center">
                          {item.file_doc !== '' && (
                            <a href="javascript:;" onClick={() => handleDownload(`${url}docfile/${item.file_doc}`)} className='link'> <i class="fa-solid fa-cloud-arrow-down fs-4" /> ໂຫລດເອກະສານ</a>
                          )}
                        </td>
                        
                      </tr>
                    ))}
                    {Object.keys(sumData).map((currency, key) => (
                      <tr key={`${key}`}>
                        <td colSpan={7} className='text-end'>ລວມຍອດທັງໝົດ ({currency})</td>
                        <td className='text-end'>{formatNumber(sumData[currency].retrun_balance)}</td>
                          <td colSpan={7}></td>
                      </tr>
                    ))}
                  </>
                ) : (<tr><td colSpan={21} className='text-center text-red'>ບໍ່ພົບຂໍ້ມູນທີ່ມີການຄົ້ນຫາ.......</td></tr>)
              )}
            </tbody>
          </table>
        </div>
        <div className="d-md-flex align-items-center">
        <div className="me-md-auto text-md-left text-center mb-2 mb-md-0">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, itemData.length)} of {itemData.length} entries
        </div>
        <ul className="pagination mb-0 justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={goToPreviousPage}>Previous</button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageClick(index + 1)}>{index + 1}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={goToNextPage}>Next</button>
          </li>
        </ul>
      </div>
      </div>

<ViewRefund open={open} handleClose={()=>setOpen(false)} data={item} />
    </div>
  )
}

export default ReprtRefundCompany