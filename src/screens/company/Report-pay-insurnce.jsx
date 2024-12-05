import React, { useState, useEffect } from "react";
import { Input, InputGroup, DatePicker, SelectPicker, Loader, Placeholder, Button, InputPicker } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import { Config,imageUrl } from "../../config/connenct";
import axios from 'axios';
import { useTypeCm, useOption } from "../../config/select-option";
import moment from "moment";
import numeral from "numeral";
export default function ReportsPay() {
  const api = Config.urlApi;
  const url=imageUrl.url;
  const companyId = localStorage.getItem('company_agent_id');

const typeget=[
  {
    label:'ຈ່າຍຄ່າປະກັນໄພ',
    value:1
  },
  {
    label:'ຈ່າຍຄ່າຄອມ',
    value:3
  }
];

  const dataType = useTypeCm(companyId)
  const [typeId, setTypeId] = useState(null)
  const handleShowType = (value) => {
    setTypeId(value);
    setInputs({
      ...inputs,
      insurance_type_fk: value
    })
  }
  const dataOption = useOption(typeId)
  const [inputs, setInputs] = useState({
    start_date: new Date(),
    end_date: new Date(),
    company_id_fk: companyId,
    insurance_type_fk: '',
    agent_id_fk: '',
    option_id_fk: '',
    status_doc: 1,
  });
  const handelShearch = (name, value) => {
    setInputs({
      ...inputs, [name]: value
    })
  }
const [validated,setValidated]=useState()

  const [isLoading, setIsLoading] = useState(true)
  const [itemData, setItemData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const fetchReport = async () => {
    if(!inputs.status_doc){
      setValidated('!ກະລຸນາເລືອກປະເພດຢ່າງໃດຢ່າງໜື້ງກ່ອນ')
    }else{
    setIsLoading(true);
    setValidated('')
    try {
      const response = await axios.post(api + 'pays/report', inputs);
      setItemData(response.data);
      setDataFilter(response.data)
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }
  };
  const Filter = (event) => {
    setItemData(dataFilter.filter(n =>
      n.contract_number.toLowerCase().includes(event) ||
      n.customer_name.toLowerCase().includes(event)
    ));
    // setItemData(dataFilter.filter(n => n.contract_number.toLowerCase().includes(event)))
  }

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


// =========================================
  const sumData = itemData.reduce((acc, item) => {
    const currency = item.currency_name;
    if (!acc[currency]) {
        acc[currency] = {
            initial_fee: 0,
            registration_fee: 0,
            insuranc_included: 0,
            incom_finally: 0
        };
    }
    acc[currency].initial_fee += parseFloat(item.initial_fee);
    acc[currency].registration_fee += parseFloat(item.registration_fee);
    acc[currency].insuranc_included += parseFloat(item.insuranc_included);
    acc[currency].incom_finally += parseFloat(item.incom_finally);
    return acc;
}, {});

const formatNumber = (num) => numeral(num).format('0,00.00');

// ==================
const [selectedItems, setSelectedItems] = useState([]);
const [isCheckAll, setIsCheckAll] = useState(false);
const handleCheckboxChange = (index) => {
  setSelectedItems(prevState => {
    if (prevState.includes(index)) {
        return prevState.filter(i => i !== index);
    } else {
        return [...prevState, index];
    }
});
}

const handleCheckAll = () => {
  if (isCheckAll) {
    setSelectedItems([]);
  } else {
    setSelectedItems([...paginatedData]);
  }
  setIsCheckAll(!isCheckAll);
}

const handleExportPDF = () => {
  
}


const handleDownload = async (fileUrl,constact) => {
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
    fetchReport();
  }, [companyId]);
  return (
    <>
      <div id="content" class="app-content p-0 bg-component">
        <div class="app-content-padding px-4 py-3">
        <div className="breadcrumb float-end">
            {selectedItems.length > 0 &&
            <Button appearance="primary" color="red" size="sm" onClick={handleExportPDF}><i class="fa-solid fa-cloud-arrow-down me-2"/> PDF</Button>
          }
          </div>
          <h1 class="page-header"> ລາຍງານການຊຳລະ </h1>
          <div class="panel">
            <div class="panel-body p-0">
              <div className="row fs-14px mb-3">
                <div className="col-sm-6 col-lg-4 mb-2">
                  <div className="row ">
                    <div className="col-6">
                      <label htmlFor="" className="form-label">ວັນທີ</label>
                      <DatePicker oneTap value={inputs.start_date} format="dd/MM/yyyy" onChange={value => handelShearch('start_date', value)} block placeholder='ວັນທີ' />
                    </div>
                    <div className="col-6">
                      <label htmlFor="" className="form-label">ຫາວັນທີ</label>
                      <DatePicker oneTap value={inputs.end_date} format="dd/MM/yyyy" onChange={value => handelShearch('end_date', value)} block placeholder='ວັນທີ' />
                    </div>
                  </div>
                </div>
                <div className="col-sm-4 col-lg-3 col-6 mb-2">
                  <label htmlFor="" className="form-label">ປະເພດປະກັນ</label>
                  <SelectPicker data={dataType} value={typeId} onChange={value => handleShowType(value)} placeholder={'- ເລືອກປະເພດ -'} block />
                </div>
                <div className="col-sm-4 col-lg-2 col-6 mb-2">
                  <label htmlFor="" className="form-label">ທາງເລືອກ</label>
                  <SelectPicker data={dataOption}  value={inputs.option_id_fk} placeholder={'ທາງເລືອກ'} onChange={value => handelShearch('option_id_fk', value)} block />
                </div>
                <div className="col-sm-4 col-lg-2 col-6 mb-2">
                  <label htmlFor="" className="form-label">ປະເພດຈ່າຍ</label>
                  <SelectPicker data={typeget}   placeholder={'ທາງເລືອກ'} defaultValue={inputs.status_doc} onChange={value => handelShearch('status_doc', value)} block />
                  <label className="text-red fs-12px">{validated}</label>
                </div>
                <div className="col-sm-2 col-lg-1  mt-4">
                  <Button color="red" appearance="primary" onClick={() => fetchReport()}>ດືງລາຍງານ</Button>
                </div>
              </div>

              <div className="mt-3">
                <div class="breadcrumb w-250px float-end">
                  <InputGroup inside >
                    <InputGroup.Addon>
                      <SearchIcon />
                    </InputGroup.Addon>
                    <Input type="text" block onChange={(e) => Filter(e)} placeholder="ເລກທີສັນຍາ" />
                  </InputGroup>
                </div>
                <div className="page-header w-100px">
                <select value={itemsPerPage} onChange={handlePageSizeChange} className="form-select" >
                  <option value={100} selected>100</option>
                  <option value={250}>250</option>
                  <option value={500}>500</option>
                  <option value={1000}>1000</option>
                  <option value={2500}>2500</option>
                  <option value={5000}>5000</option>
                  <option value={itemData.length}>ທັງໝົດ</option>
                </select>
                </div>
              </div>

              <div className="table-responsive ">
                    <table className="table table-striped table-bordered align-middle w-100 text-nowrap">
                        <thead className="fs-14px bg-header">
                            <tr>
                                <th width='1%' className="text-center bg-header sticky-col first-col">
                                  <input type="checkbox" checked={isCheckAll} onChange={handleCheckAll} className="form-check-input" />
                                </th>
                                <th width='1%' className="text-center">ລ/ດ</th>
                                <th className="text-center">ວັນທີຈ່າຍ</th>
                                <th className="">ເລກທີສັນຍາ</th>
                                <th className="text-center">ວັນທີເລີມ</th>
                                <th className="text-center">ວັນທີສິນສຸດ</th>
                                <th className="">ລູກຄ້າຊື້ປະກັນ</th>
                                <th className="">ປະເພດຜູ້ຊື້ປະກັນ</th>
                                <th className="">ປະເພດປະກັນ</th>
                                <th className="">ທາງເລືອກ</th>
                                <th className="text-end">ຄ່າທຳນຽມເບື້ອງຕັ້ນ</th>
                                <th className="text-center">ອາກອນ</th>
                                <th className="text-end">ຄ່າລົງທະບຽນ</th>
                                <th className="text-end">ຄ່າທຳນຽມປະກັນລວມ</th>
                                <th className="text-center">ເປີເຊັນຈ່າຍ</th>
                                <th className="text-center">ອາກອນ</th>
                                <th className="text-end">ຄອມຈ່າຍຫຼັງອາກອນ</th>
                                <th className="">ລາຍລະອຽດ</th>
                                <th className="text-center">ເອກະສານຈ່າຍ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={120}>
                                        <Placeholder.Grid rows={6} columns={10} active />
                                        <Loader size="lg" center content="ກຳລັງໂຫດ......" />
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.length > 0 ? (
                                    <>
                                        {paginatedData.map((item, key) => (
                                            <tr key={key}>
                                              <td className="text-center bg-white sticky-col first-col">
                                                <input type="checkbox" checked={selectedItems.includes(item)} onChange={() => handleCheckboxChange(item)} className="form-check-input" />
                                              </td>
                                                <td className='text-center'>{key + 1}</td>
                                                <td>{moment(item.doccm_date).format('DD/MM/YYYY')}</td>
                                                <td>{item.contract_number}</td>
                                                <td>{moment(item.contract_start_date).format('DD/MM/YYYY')}</td>
                                                <td>{moment(item.contract_end_date).format('DD/MM/YYYY')}</td>
                                                <td>{item.customer_name}</td>
                                                <td>{item.type_buyer_name}</td>
                                                <td>{item.type_in_name}</td>
                                                <td>{item.options_name}</td>
                                                <td className='text-end'>{numeral(item.initial_fee).format('0,00.00')} {item.genus}</td>
                                                <td className='text-center'>{item.percent_taxes}%</td>
                                                <td className='text-end'>{numeral(item.registration_fee).format('0,00.00')} {item.genus}</td>
                                                <td className={`text-end ${item.status_doc === 1 ? 'text-blue' : ''}`}>{numeral(item.insuranc_included).format('0,00.00')} {item.genus}</td>
                                                <td className='text-center'>{item.precent_incom}%</td>
                                                <td className='text-center'>{item.percent_akorn}%</td>
                                                <td className={`text-end ${item.status_doc === 3 ? 'text-blue' : ''}`}>{numeral(item.incom_finally).format('0,00.00')} {item.genus}</td>
                                                <td>{item.debt_remark}</td>
                                                <td className="text-center">
                                                  {item.docom_file ?(
                                                  <button type="button" onClick={()=>handleDownload(`${url}docPay/${item.docom_file}`,item.contract_number)} className="btn btn-green btn-xs"><i class="fa-solid fa-cloud-arrow-down"/></button>
                                                ):(<i class="fa-solid fa-file-circle-xmark text-red"></i>)}
                                                  </td>
                                                </tr>
                                        ))}
                                       
                                        {Object.keys(sumData).map((currency, key) => (
                                        <tr key={key}>
                                            <td colSpan={10} className='text-end'>ລວມຍອດຄ້າງຮັບທັງໝົດ ({currency})</td>
                                            <td className='text-end'>{formatNumber(sumData[currency].initial_fee)}</td>
                                            <td></td>
                                            <td className='text-end'>{formatNumber(sumData[currency].registration_fee)}</td>
                                            <td className={`text-end ${inputs.status_doc === 1 ? 'text-blue' : ''}`}>{formatNumber(sumData[currency].insuranc_included)}</td>
                                            <td colSpan={2}></td>
                                            <td className={`text-end ${inputs.status_doc === 3 ? 'text-blue' : ''}`}>{formatNumber(sumData[currency].incom_finally)}</td>
                                            <td colSpan={3}></td>
                                        </tr>
                                         ))}
                                    </>
                                ) : (<tr><td colSpan={19} className='text-center text-red'>ບໍ່ພົບຂໍ້ມູນທີ່ມີການຄົ້ນຫາ.......</td></tr>)
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
      </div>
    </>
  );
}
