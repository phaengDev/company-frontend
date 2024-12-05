import React, { useState, useEffect } from 'react'
import { DatePicker, SelectPicker, Input, InputGroup, Placeholder, Loader, Modal, Button } from 'rsuite'
import { useCompany, useType, useAgent } from '../../config/select-option';
import { Config, imageUrl } from '../../config/connenct';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import Alert from '../../utils/config';
export default function RetrunOacborker() {
  const api = Config.urlApi;
  const url=imageUrl.url;
  const itemcm = useCompany();
  const itemType = useType();
  const itemAg = useAgent();

  const status = [{
    label: 'ຄ້າງຄືນ', value: 1
  }, {
    label: 'ຄືນແລ້ວ', value: 2
  }, {
    label: 'ທັງໝົດ', value: ''
  }];

  const [data, setData] = useState({
    status: 3,
    statusRetrun: 1,
    datecheck: 'agent_date',
    start_date: '',
    end_date: '',
    companyId_fk: '',
    insurance_typeId: '',
    agentId_fk: '',
    custom_buyer_id_fk: '',
  })
  const handleChange = (name, value) => {
    setData({
      ...data, [name]: value
    })
  }

  const [isLoading, setIsLoading] = useState(true)
  const [itemData, setItemData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(api + 'retrun/report/', data);
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

  const sumData = currentItems.reduce((acc, item) => {
    const currency = item.currency_name;
    if (!acc[currency]) {
      acc[currency] = {
        retrun_balance: 0,
        balance_oac:0,
      };
    }
    acc[currency].retrun_balance += parseFloat(item.retrun_balance);
    acc[currency].balance_oac += parseFloat(item.balance_oac);
    return acc;
  }, {});
  const formatNumber = (num) => numeral(num).format('0,00.00');


  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const [values, setValues] = useState({
    insurance_retrun_id: '',
    remark_text: '',
    status_retrun: 3,
    retrun_date: new Date(),
    retrun_balance: 0,
    genus: '',
    percent_oac:0,
    balance_oac:0,
    file_pay: '',
    status_pay: 3,
  })
  const handleRetrun = (item) => {
    setValues({
      insurance_retrun_id: item.insurance_retrun_id,
      remark_text: item.remark_text,
      retrun_date: new Date(),
      retrun_balance: item.retrun_balance,
      genus: item.genus,
      status_retrun: 3,
      percent_oac:item.percent_oac,
      balance_oac:item.balance_oac,
      file_pay: '',
      status_pay: 3,
    })
    setOpen(true);
  }
  const handledUseRetrun = (name, value) => {
    setValues({
      ...values, [name]: value
    })
  }
  const handledSelectFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setValues((prev) => ({
        ...prev,
        file_pay: file, // Store the file object for upload
      }));
    }
  };

  const handledSubmit = (e) => {
    e.preventDefault();
    const imputData = new FormData();
    for (const key in values) {
      imputData.append(key, values[key])
    }
    try {
      axios.post(api + 'retrun/retrun', imputData)
        .then(function (respones) {
          if (respones.status === 200) {
            fetchReport();
            setOpen(false);
            Alert.successData(respones.data.message)
          } else {
            Alert.errorData(respones.data.message)
          }
        });
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  }


  const downloadFilePay = async (fileUrl,constact) => {
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
  }, [data])
  return (
    <div id="content" className="app-content p-0 bg-component">
      <div class="app-content-padding px-4 py-3">
        <div class="d-lg-flex mb-lg-3 mb-2">
          <h3 class="page-header mb-0 flex-1 fs-20px">ລາຍການສັນຍາສົ່ງເງິນຄືນບໍລິສັດປະກັນ</h3>
          <span class="d-none d-lg-flex align-items-center">
            <button class="btn btn-danger btn-sm d-flex me-2 pe-3 rounded-3">
              <i class="fa-solid fa-file-pdf fs-18px me-2 ms-n1"></i> Export PDF
            </button>
            <button class="btn btn-success btn-sm d-flex me-2 pe-3 rounded-3">
              <i class="fa-solid fa-cloud-arrow-down fs-18px me-2 ms-n1"></i>
              Export Excel
            </button>
          </span>
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
            <SelectPicker block data={itemcm} onChange={(e) => handleChange('companyId_fk', e)} />
          </div>
          <div className="col-sm-4 col-md-2  col-6">
            <label htmlFor="" className='form-label'>ປະເພດປະກັນ</label>
            <SelectPicker block data={itemType} onChange={(e) => handleChange('insurance_typeId', e)} />
          </div>
          <div className="col-sm-4 col-md-2  col-6">
            <label htmlFor="" className='form-label'>ຕົວແທນຂາຍ</label>
            <SelectPicker block data={itemAg} onChange={(e) => handleChange('agentId_fk', e)} />
          </div>
          <div className="col-sm-4 col-md-2  col-6">
            <label htmlFor="" className='form-label'>ສະຖານະ</label>
            <SelectPicker block data={status} defaultValue={data.statusRetrun} onChange={(e) => handleChange('statusRetrun', e)} />
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
                <th className="">ບໍລິສັດປະກັນໄພ</th>
                <th className="">ປະເພດປະກັນ</th>
                <th className="">ທາງເລືອກ</th>
                <th className="">ຕົວແທນຂາຍ	</th>
                <th className="text-end">ລວມຍອດເງິນ</th>
                <th className="text-center">ເປີເຊັນ</th>
                <th className="text-end">ຍອດເງິນ</th>
                <th className="text-center">ສະຖານະ</th>
                <th className="text-center">ວັນທີ</th>
                <th className="">ໝາຍເຫດ</th>
                <th width='10%' className="text-center">ການຕັ້ງຄ່າ</th>
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
                        <td>{item.com_name_lao}</td>
                        <td>{item.type_in_name}</td>
                        <td>{item.options_name}</td>
                        <td>{item.agent_name}</td>
                        <td className='text-end'>{numeral(item.retrun_balance).format('0,00.00')} {item.genus}</td>
                        <td className="text-center">{item.percent_oac}%</td>
                        <td className='text-end'>{numeral(item.balance_oac).format('0,00.00')} {item.genus}</td>
                        <td className="text-center">{item.status_oac === 1 ? 'ຄ້າງຄືນ' : 'ຄືນແລ້ວ'}</td>
                        <td className="text-center">{moment(item.oac_date).format('DD/MM/YYYY')}</td>
                        <td className="">{item.remark_text}</td>
                        <td className="text-center">
                          {item.status_oac === 1 ? (
                            <button onClick={() => handleRetrun(item)} className='btn btn-xs btn-blue ms-2'> <i class="fa-solid fa-pen-to-square"></i> ຢືນຢັນ</button>
                          ) : (<><i class="fa-solid fa-circle-check text-green fs-4"></i>
                            {item.doc_pays &&(
                                 item.doc_pays
                                     .filter(pay => pay.status_pay === 2)
                                     .map((pay, key) => (
                                   <button type='button' onClick={() => downloadFilePay(`${url}docPay/${pay.file_doct}`,item.contract_number)} className='btn btn-xs btn-blue ms-2'><i class="fa-solid fa-cloud-arrow-down"/></button>
                                 )))
                               }
                           </>)}
                        </td>
                      </tr>
                    ))}
                    {Object.keys(sumData).map((currency, key) => (
                      <tr key={`${key}`}>
                        <td colSpan={9} className='text-end'>ລວມຍອດທັງໝົດ ({currency})</td>
                        <td className='text-end'>{formatNumber(sumData[currency].retrun_balance)}</td>
                        <td></td>
                        <td className='text-end'>{formatNumber(sumData[currency].balance_oac)}</td>
                        <td colSpan={4}></td>

                      </tr>
                    ))}
                  </>
                ) : (<tr><td colSpan={20} className='text-center text-red'>ບໍ່ພົບຂໍ້ມູນທີ່ມີການຄົ້ນຫາ.......</td></tr>)
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>ຢືນຢັນການສົ່ງເງິນຄືນ</Modal.Title>
        </Modal.Header>
        <form onSubmit={handledSubmit}>
          <Modal.Body>
            <h2 className='text-center text-red'>
              {numeral(values.retrun_balance).format('0,00.00')} {values.genus}
            <hr className='mt-2 mb-1' />
              <div className='text-blue fs-25px'>{numeral(values.balance_oac).format('0,00.00')} {values.genus} <span className='text-green'>({values.percent_oac} %) <i class="fa-solid fa-check"/></span> </div>
            </h2>
            <div className="form-group mb-2">
              <label htmlFor="" className='form-label'>ໝາຍເຫດ</label>
              <Input as='textarea' value={values.remark_text} onChange={(e) => handledUseRetrun('remark_text', e)} placeholder='ໝາຍເຫດ....' />
            </div>
            <div className="row">
            <div className="form-group col-sm-8 mb-2">
              <label htmlFor="" className='form-label'>ວັນທີ</label>
              <DatePicker block oneTap value={values.retrun_date} onChange={(e) => handledUseRetrun('retrun_date', e)} format='dd/MM/yyyy' />
            </div>
            <div className="form-group col-sm-4 mb-2">
                <label htmlFor="" className='form-label'>ໄຟລ໌ແນບ</label>
                <label className={`btn ${values.file_pay ? 'btn-success' : 'btn-primary'} w-100 text-start`}>
                  {values.file_pay ? (
                    <> <i class="fa-solid fa-file-pen"></i> ເລືອກໃຫມ່ </>
                  ) : (
                    <>  <i class="fa-solid fa-paperclip"></i> ເລືອກໄຟລ໌ແນບ</>
                  )}
                  <input type="file" hidden onChange={handledSelectFile} accept='image/*' />
                </label>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' appearance="primary"> ບົນທຶກ</Button>
            <Button onClick={handleClose} appearance="subtle"> ຍົກເລີກ</Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  )
}
