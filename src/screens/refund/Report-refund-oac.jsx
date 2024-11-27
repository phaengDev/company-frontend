import React, { useState, useEffect } from 'react'
import { DatePicker, SelectPicker, Input, InputGroup, Placeholder, Loader, Modal, Button } from 'rsuite'
import {useType, useOption } from '../../config/select-option';
import { Config,imageUrl } from '../../config/connenct';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
function ReportRefundOac() {
  const api = Config.urlApi;
const url =imageUrl.url;
  const companyId = parseInt(localStorage.getItem('company_agent_id'), 10);

  const itemType = useType();
  const [data, setData] = useState({
    status: 3,
    statusRetrun: 2,
    datecheck: 'oac_date',
    start_date: new Date(),
    end_date: new Date(),
    companyId_fk: '',
    insurance_typeId: '',
    agentId_fk: '',
    option_id_fk: '',
  })
  const handleChange = (name, value) => {
    setData({
      ...data, [name]: value
    })
  }
  const handleShowOption = (name, value) => {
    setData({
      ...data, [name]: value
    })
    setTypeId(value)
  }
  const [typeId, setTypeId] = useState(null)
  const itemOption = useOption(typeId);


  const [isLoading, setIsLoading] = useState(true);
  const [itemData, setItemData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(api + 'retrun/report-pay/', data);
      console.log(response.data);
      setItemData(response.data);
      setDataFilter(response.data);
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
        n.currency_name.toLowerCase().includes(query)
    ));
};
  const [itemsPerPage, setitemsPerPage] = useState(100);
  const handleShowLimit = (value) => {
    setitemsPerPage(value);
  };
  const indexOfLastItem = 1 * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = itemData.slice(indexOfFirstItem, indexOfLastItem);

  const groupedData = currentItems.reduce((acc, item) => {
    const currency = item.currency_name;
    if (!acc[currency]) {
      acc[currency] = {
        retrun_balance: 0,
        balance_oac:0
      };
    }
    acc[currency].retrun_balance += parseFloat(item.retrun_balance);
    acc[currency].balance_oac += parseFloat(item.balance_oac);
    return acc;
  }, {});
  const formatNumber = (num) => numeral(num).format('0,00.00');


  
const handleDownload = async (fileUrl,constact) => {
  try {
      const response = await fetch(fileUrl); // Replace with your server URL
      if (!response.ok) {
          throw new Error('File download failed');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const fileExt = fileUrl.split('.').pop(); // Get the extension from the URL
      const fileName = `pay-${constact}.${fileExt}`; 
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
  } catch (error) {
      alert('ຂໍອະໄພບໍ່ມີໄຟລ໌ໃນໂຟນເດີ ກະລຸນາອັບເດດໄຟລ໌ເຂົ້າໃໝ່!', error);
  }
};


  useEffect(() => {
    fetchReport();
setData({
  ...data,
  companyId_fk:companyId
})
  }, [companyId])

  return (
    <div id="content" className="app-content p-0 bg-component">
    <div class="app-content-padding px-4 py-3">
      <div class="d-lg-flex mb-lg-3 mb-2">
        <h3 class="page-header mb-0 flex-1 fs-20px">ລາງການສັນຍາຮັບຄ່າຄອມຄືນ</h3>
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
          <DatePicker oneTap value={data.start_date} onChange={(e) => handleChange('start_date', e)} format="dd/MM/yyyy" placeholder='ວັນທີ' block />
        </div>
        <div className="col-sm-4 col-md-2  col-6">
          <label htmlFor="" className='form-label'>ຫາວັນທີ</label>
          <DatePicker oneTap value={data.end_date} onChange={(e) => handleChange('end_date', e)} format="dd/MM/yyyy" placeholder='ຫາວັນທີ' block />
        </div>
        
        <div className="col-sm-4 col-md-3  col-12">
          <label htmlFor="" className='form-label'>ປະເພດປະກັນ</label>
          <SelectPicker block data={itemType} value={data.insurance_typeId} onChange={(e) => handleShowOption('insurance_typeId', e)} />
        </div>
        <div className="col-sm-4 col-md-2  col-8">
          <label htmlFor="" className='form-label'>ທາງເລືອກ</label>
          <SelectPicker block data={itemOption} value={data.option_id_fk} onChange={(e) => handleChange('option_id_fk', e)} />
        </div>
        <div className="col-sm-4 col-md-2  col-4">
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
              <th className="text-center">ເປິເຊັນຂາຍ</th>
              <th className="text-end">ຍອດຮັບຄືນ</th>
              <th className="text-center">ວັນທີຮັບ</th>
              <th className="">ໝາຍເຫດ</th>
              <th width='5%' className="text-center sticky-col first-col-end">#</th>
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
                      <td className='text-center'>{item.percent_oac} %</td>
                      <td className='text-end'>{numeral(item.balance_oac).format('0,00.00')} {item.genus}</td>
                      <td className="text-center">{moment(item.company_date).format('DD/MM/YYYY')}</td>
                      <td className="">{item.remark_text}</td>
                     <td className='text-center bg-white sticky-col first-col-end'>
                      {item.file_pay ?(
                      <button type='button' onClick={() => handleDownload(`${url}docPay/${item.file_pay}`,item.contract_number)} className='btn btn-green btn-xs'><i class="fa-solid fa-cloud-arrow-down"/></button>
                    ):(<i class="fa-solid fa-file-circle-xmark text-red"></i>)}
                      </td>
                    </tr>
                  ))}
                  {Object.keys(groupedData).map((currency, key) => (
                    <tr key={`${key}`}>
                      <td colSpan={7} className='text-end'>ລວມຍອດທັງໝົດ ({currency})</td>
                      <td className='text-end'>{formatNumber(groupedData[currency].retrun_balance)}</td>
                      <td colSpan={2} className='text-end'>{formatNumber(groupedData[currency].balance_oac)}</td>
                      <td colSpan={5}></td>
                    </tr>
                  ))}
                </>
              ) : (<tr><td colSpan={18} className='text-center text-red'>ບໍ່ພົບຂໍ້ມູນທີ່ມີການຄົ້ນຫາ.......</td></tr>)
            )}
          </tbody>
        </table>
      </div>
    </div>
  
  </div>
  )
}

export default ReportRefundOac