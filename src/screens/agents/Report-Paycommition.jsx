import React, { useState, useEffect } from 'react'
import { DatePicker, SelectPicker, Placeholder, Loader, Input, InputPicker } from 'rsuite'
import { useCompany, useType, suePage } from '../../config/select-option';
import { Config, imageUrl } from '../../config/connenct';
import axios from 'axios';
import moment from 'moment';
import numeral from 'numeral';
function ReportPaycommition() {
  const api = Config.urlApi;
  const url = imageUrl.url;
  const itemcm = useCompany();
  const itemType = useType();
  const agentId = localStorage.getItem('company_agent_id')

  const [itemOption, setItemOption] = useState([]);
  const handleOption = async (name, value) => {
    try {
      const response = await fetch(api + `options/t/${value}`);
      const jsonData = await response.json();
      setItemOption(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setData({
      ...data, [name]: value
    })

    // fetchReport();
  };
  const dataOption = itemOption.map(item => ({ label: item.options_name, value: item.options_Id }));

  const [data, setData] = useState({
    start_date: new Date(),
    end_date: new Date(),
    company_id_fk: '',
    insurance_type_fk: '',
    agent_id_fk: agentId,
    option_id_fk: '',
    status_doc: 2
  })
  const handleChange = (name, value) => {
    setData({
      ...data, [name]: value
    })
  }

  const [isLoading, setIsLoading] = useState(true)
  const [itemData, setItemData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [itemsPerPage, setItemsPerPage] = useState(100); 
  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(api + 'pays/report', data);
      setItemData(response.data);
      setDataFilter(response.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const Filter = (event) => {
    setItemData(dataFilter.filter(n => n.contract_number.toLowerCase().includes(event)))||
    setItemData(dataFilter.filter(n => n.customer_name.toLowerCase().includes(event)))||
    setItemData(dataFilter.filter(n => n.type_buyer_name.toLowerCase().includes(event)))

  }

  const pages = suePage(itemData.length);
  // ================================
  const sumData = itemData.reduce((acc, item) => {
    const currency = item.currency_name;
    if (!acc[currency]) {
      acc[currency] = {
        initial_fee: 0,
        pays_advance_fee: 0,
        money_percent_fee: 0,
        expences_pays_taxes: 0
      };
    }

    acc[currency].initial_fee += parseFloat(item.initial_fee);
    acc[currency].pays_advance_fee += parseFloat(item.pays_advance_fee);
    acc[currency].money_percent_fee += parseFloat(item.money_percent_fee);
    acc[currency].expences_pays_taxes += parseFloat(item.expences_pays_taxes);

    return acc;
  }, {});
  const formatNumber = (num) => numeral(num).format('0,00.00');
 // ================================
 const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;

// Slice the itemData based on the current page
const currentItems = itemData.slice(indexOfFirstItem, indexOfLastItem);
const totalPages = Math.ceil(itemData.length / itemsPerPage);
const handlePageChange = (page) => {
  setCurrentPage(page);
};

const nextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};

const prevPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};


  const handleDownload = async (fileUrl, constact) => {
    try {
      const response = await fetch(fileUrl); // Replace with your server URL
      if (!response.ok) {
        throw new Error('File download failed');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const fileExtension = fileUrl.split('.').pop(); // Get the extension from the URL
      const fileName = `${constact}.${fileExtension}`;

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
    fetchReport()
  }, [data, agentId])

  return (
    <div id="content" className="app-content p-0 bg-component">

      <div class="app-content-padding px-4 py-3">
        <div class="d-lg-flex mb-lg-3 mb-2">
          <h3 class="page-header mb-0 flex-1 fs-20px">ລາຍງານຈ່າຍຄາຄອມ</h3>
          {/* <span class="d-none d-lg-flex align-items-center">
          <button onClick={downloadPDF} class="btn btn-danger btn-sm d-flex me-2 pe-3 rounded-3">
            <i class="fa-solid fa-file-pdf fs-18px me-2 ms-n1"></i> Export PDF
          </button>
          <button onClick={downloadExcel} class="btn btn-success btn-sm d-flex me-2 pe-3 rounded-3">
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
            <label htmlFor="" className='form-label'>ບໍລິສັດປະກັນໄພ</label>
            <SelectPicker block data={itemcm} onChange={(e) => handleChange('company_id_fk', e)} />
          </div>
          <div className="col-sm-4 col-md-3  col-6">
            <label htmlFor="" className='form-label'>ປະເພດປະກັນ</label>
            <SelectPicker block data={itemType} onChange={(e) => handleOption('insurance_type_fk', e)} />
          </div>
          <div className="col-sm-4 col-md-2  col-6">
            <label htmlFor="" className='form-label'>ທາງເລືອກ</label>
            <SelectPicker block data={dataOption} onChange={(e) => handleChange('option_id_fk', e)} />
          </div>

        </div>
        <div className="row mb-3">
          <div className="col-sm-4 col-md-1  col-4">
            <InputPicker block value={itemsPerPage} data={pages} onChange={(e) => setItemsPerPage(e)} />
          </div>

          <div className="col-md-8  col-2"/>
          <div className="col-md-3  col-6">
            <Input block placeholder="ເລກທີສັນຍາ..." onChange={(e) => Filter(e)} />
          </div>
        </div>
        <div className="table-responsive ">
          <table className="table table-striped table-bordered align-middle w-100 text-nowrap">
            <thead className="fs-14px bg-header">
              <tr>
                <th width='1%' className="text-center bg-header sticky-col first-col">ລ/ດ</th>
                <th className="text-center">ວັນທີຈ່າຍ</th>
                <th className="">ເລກທີສັນຍາ</th>
                <th className="text-center">ວັນທີເລີມ</th>
                <th className="text-center">ວັນທີສິນສຸດ</th>
                <th className="">ລູກຄ້າຊື້ປະກັນ</th>
                <th className="">ປະເພດຜູ້ຊື້ປະກັນ</th>
                <th className="">ບໍລິສັນປະກັນໄພ</th>
                <th className="">ປະເພດປະກັນ</th>
                <th className="">ທາງເລືອກ</th>
                <th className="text-end">ຄ່າທຳນຽມເບື້ອງຕັ້ນ</th>
                <th className="text-center">ເປີເຊັນຈ່າຍ</th>
                <th className="text-end">ຄອມຈ່າຍ</th>
                <th className="text-end">ອາກອນ</th>
                <th className="text-end">ເປັນເງິນ</th>
                <th className="text-end">ຄອມຈ່າຍຫຼັງອາກອນ</th>
                <th className="">ລາຍລະອຽດ</th>
                <th width='5%' className="text-center">ເອກະສານ</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={19}>
                    <Placeholder.Grid rows={6} columns={10} active />
                    <Loader size="lg" center content="ກຳລັງໂຫດ......" />
                  </td>
                </tr>
              ) : (
                itemData.length > 0 ? (
                  <>
                    {currentItems.map((item, key) => (
                      <tr key={key}>
                        <td className='text-center'>{item.idAuto}</td>
                        <td>{moment(item.doccm_date).format('DD/MM/YYYY')}</td>
                        <td>{item.contract_number}</td>
                        <td>{moment(item.contract_start_date).format('DD/MM/YYYY')}</td>
                        <td>{moment(item.contract_end_date).format('DD/MM/YYYY')}</td>
                        <td>{item.customer_name}</td>
                        <td>{item.type_buyer_name}</td>
                        <td>{item.com_name_lao}</td>
                        <td>{item.type_in_name}</td>
                        <td>{item.options_name}</td>
                        <td className='text-end'>{numeral(item.initial_fee).format('0,00.00')} {item.genus}</td>
                        <td className='text-center'>{item.percent_eps}%</td>
                        <td className='text-end'>{numeral(item.pays_advance_fee).format('0,00.00')} {item.genus}</td>
                        <td className='text-center'>{item.percent_fee_eps}%</td>
                        <td className='text-end'>{numeral(item.money_percent_fee).format('0,00.00')} {item.genus}</td>
                        <td className='text-end'>{numeral(item.expences_pays_taxes).format('0,00.00')} {item.genus}</td>
                        <td>{item.debt_remark}</td>
                        <td className='text-center'>{item.docom_file && (<span role='button' onClick={() => handleDownload(`${url}docPay/${item.docom_file}`, item.contract_number)} className='text-danger fs-16px'><i class="fa-solid fa-download"></i></span>)}</td>
                      </tr>
                    ))}

                    {Object.keys(sumData).map((currency, key) => (
                      <tr key={`${key}`}>
                        <td colSpan={10} className='text-end'>ລວມຍອດຈ່າຍທັງໝົດ ({currency})</td>
                        <td className='text-end'>{formatNumber(sumData[currency].initial_fee)}</td>
                        <td></td>
                        <td className='text-end'>{formatNumber(sumData[currency].pays_advance_fee)}</td>
                        <td></td>
                        <td className='text-end'>{formatNumber(sumData[currency].money_percent_fee)}</td>
                        <td className='text-end'>{formatNumber(sumData[currency].expences_pays_taxes)}</td>
                        <td colSpan={2}></td>
                      </tr>
                    ))}
                  </>
                ) : (<tr><td colSpan={18} className='text-center text-red'>ບໍ່ພົບຂໍ້ມູນທີ່ມີການຄົ້ນຫາ.......</td></tr>)
              )}
            </tbody>
          </table>
        </div>
       {/* Pagination Controls */}
       <div className="d-md-flex align-items-center">
    <div className="me-md-auto text-md-left text-center mb-2 mb-md-0">
      {/* Showing X to Y of Z entries */}
      <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, itemData.length)} of {itemData.length} entries</span>
    </div>
    <ul className="pagination mb-0 justify-content-center">
      {/* Previous Button */}
      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button className="page-link" onClick={prevPage}>Previous</button>
      </li>

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, idx) => (
        <li key={idx} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
          <button
            className="page-link"
            onClick={() => handlePageChange(idx + 1)}
          >
            {idx + 1}
          </button>
        </li>
      ))}

      {/* Next Button */}
      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button className="page-link" onClick={nextPage}>Next</button>
      </li>
    </ul>
  </div>
      </div>
    </div>
  )
}

export default ReportPaycommition