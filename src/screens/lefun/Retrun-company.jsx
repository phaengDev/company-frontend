import React, { useState, useEffect } from 'react'
import { DatePicker, SelectPicker, Input, InputGroup, Placeholder, Loader, Modal, Button } from 'rsuite'
import { useCompany, useType, useAgent } from '../../config/select-option';
import { Config } from '../../config/connenct';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import Alert from '../../utils/config';
export default function RetrunCompany() {
  const api = Config.urlApi;
  const itemcm = useCompany();
  const itemType = useType();
  const itemAg = useAgent();

  const [data, setData] = useState({
    status: 1,
    statusRetrun: 1,
    datecheck: 'company_date',
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


  const status = [{
    label: 'ຄ້າງຄືນ', value: 1
  }, {
    label: 'ຄືນແລ້ວ', value: 2
  }, {
    label: 'ທັງໝົດ', value: ''
  }];
  const [isLoading, setIsLoading] = useState(true);
  const [itemData, setItemData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(api + 'retrun/report/', data);
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
      };
    }
    acc[currency].retrun_balance += parseFloat(item.retrun_balance);
    return acc;
  }, {});
  const formatNumber = (num) => numeral(num).format('0,00');



  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const [values, setValues] = useState({
    insurance_retrun_id: '',
    remark_text: '',
    status_retrun: 2,
    retrun_date: new Date(),
    retrun_balance: 0,
    genus: ''
  })
  const handleRetrun = (item) => {
    setValues({
      insurance_retrun_id: item.insurance_retrun_id,
      remark_text: item.remark_text,
      retrun_date: new Date(),
      retrun_balance: item.retrun_balance,
      genus: item.genus,
      status_retrun: 1,
    })
    setOpen(true);
  }
  const handledUseRetrun = (name, value) => {
    setValues({
      ...values, [name]: value
    })
  }

  const handledSubmit = (e) => {
    e.preventDefault();
    try {
      axios.post(api + 'retrun/retrun', values)
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

  useEffect(() => {
    fetchReport();
  }, [data])

  return (

    <div id="content" className="app-content p-0 bg-component">
      <div class="app-content-padding px-4 py-3">
        <div class="d-lg-flex mb-lg-3 mb-2">
          <h3 class="page-header mb-0 flex-1 fs-20px">ລາງການສັນຍາສົ່ງເງິນຄືນລູກຄ້າ</h3>
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
            <DatePicker oneTap defaultValue={data.start_date} onChange={(e) => handleChange('start_date', e)} format="dd/MM/yyyy" placeholder='ວັນທີ' block />
          </div>
          <div className="col-sm-4 col-md-2  col-6">
            <label htmlFor="" className='form-label'>ຫາວັນທີ</label>
            <DatePicker oneTap defaultValue={data.end_date} onChange={(e) => handleChange('end_date', e)} format="dd/MM/yyyy" placeholder='ຫາວັນທີ' block />
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
            <SelectPicker block data={status} defaultValue={1} onChange={(e) => handleChange('statusRetrun', e)} />
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
                <th className="text-end">ຍອດເງິນ</th>
                <th className="text-center">ສະຖານະບໍລິສັດ</th>
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
                        <td className='text-end'>{numeral(item.retrun_balance).format('0,00')} {item.genus}</td>
                        <td className="text-center">{item.status_company === 1 ? 'ຄ້າງຄືນ' : 'ຄືນແລ້ວ'}</td>
                        <td className="text-center">{moment(item.company_date).format('DD/MM/YYYY')}</td>
                        <td className="">{item.remark_text}</td>
                        <td className="text-center">
                          {item.status_company === 1 ? (
                            <button onClick={() => handleRetrun(item)} className='btn btn-xs btn-blue ms-2'> <i class="fa-solid fa-pen-to-square"></i> ຢືນຢັນ</button>
                          ) : (<i class="fa-solid fa-circle-check text-green fs-4"></i>)}

                        </td>
                      </tr>
                    ))}
                    {Object.keys(groupedData).map((currency, key) => (
                      <tr key={`${key}`}>
                        <td colSpan={9} className='text-end'>ລວມຍອດທັງໝົດ ({currency})</td>
                        <td className='text-end'>{formatNumber(groupedData[currency].retrun_balance)}</td>
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
      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>ຢືນຢັນການສົ່ງເງິນຄືນ</Modal.Title>
        </Modal.Header>
        <form onSubmit={handledSubmit}>
          <Modal.Body>
            <h2 className='text-center text-red'>{numeral(values.retrun_balance).format('0,00')} {values.genus}</h2>
            <div className="form-group mb-2">
              <label htmlFor="" className='form-label'>ໝາຍເຫດ</label>
              <Input as='textarea' value={values.remark_text} onChange={(e) => handledUseRetrun('remark_text', e)} placeholder='ໝາຍເຫດ....' />
            </div>
            <div className="form-group mb-2">
              <label htmlFor="" className='form-label'>ວັນທີ</label>
              <DatePicker block oneTap value={values.retrun_date} onChange={(e) => handledUseRetrun('retrun_date', e)} format='dd/MM/yyyy' />
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
