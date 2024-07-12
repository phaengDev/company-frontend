import React, { useState } from 'react'
import { SelectPicker, Input, InputGroup, DatePicker, InputPicker, Button, Loader } from 'rsuite'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Config, imageUrl } from '../../config/connenct';
import { useAgent, useCompany, useType, useCurrency } from '../../config/select-option';
import axios from 'axios';
import numeral from 'numeral';
import Alert from '../../utils/config';
export default function RetrunInsurance() {
  const api = Config.urlApi;
  const url = imageUrl.url;
  const itemAg = useAgent();
  const itemcn = useCompany();
  const itemType = useType();
  const itemCry = useCurrency();
  // const location = useLocation();

  const [itemOption, setItemOption] = useState([]);
  const handleOption = async (name, value) => {
    setInputs({
      ...inputs, [name]: value
    })
    try {
      const response = await fetch(api + `options/t/${value}`);
      const jsonData = await response.json();
      setItemOption(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const dataOption = itemOption.map(item => ({ label: item.options_name, value: item.options_Id }));

  const [itemBuy, setItemBuy] = useState([]);
  const [loading, setLoading] = useState(false)
  const handelCompany = async (name, value) => {
    setLoading(true);
    setInputs({
      ...inputs, [name]: value
    })
    try {
      const response = await fetch(api + `custom/cm/${value}`);
      const jsonData = await response.json();
      setItemBuy(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false)
    }
  }

  const dataBuy = itemBuy.map(item => ({ label: item.customer_name, value: item.custom_uuid }));

  const [inputs, setInputs] = useState({
    insurance_retrunId: '',
    company_id_fk: null,
    agent_id_fk: '',
    custom_buyer_id_fk: '',
    insurance_type_fk: '',
    option_id_fk: '',
    contract_number: '',
    retrun_balance: 0,
    currency_id_fk: 22001,
    status_company: 1,
    company_date: new Date(),
    percent_agent:0,
    status_agent: 1,
    agent_date: new Date(),
    percent_oac:0,
    status_oac: 1,
    oac_date: new Date(),
    remark_text: ''
  })
  const handelChange = (name, value) => {
    setInputs({
      ...inputs, [name]: value
    })
  }
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true)
    console.log(inputs)
    try {
      axios.post(api + 'retrun/create', inputs)
        .then(function (respones) {
          if (respones.status === 200) {
            Alert.successData(respones.data.message)
            setInputs({
              insurance_retrunId: '',
              company_id_fk: null,
              agent_id_fk: '',
              custom_buyer_id_fk: '',
              insurance_type_fk: '',
              option_id_fk: '',
              contract_number: '',
              retrun_balance: 0,
              currency_id_fk: 22001,
              status_company: 1,
              company_date: new Date(),
              percent_agent:0,
              status_agent: 1,
              agent_date: new Date(),
              percent_oac:0,
              status_oac: 1,
              oac_date: new Date(),
              remark_text: ''
            })
          } else {
            Alert.errorData(respones.data.message)
          }
        });
    } catch (error) {
      console.error('Error inserting data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div id="content" className="app-content">

        <ol className="breadcrumb float-end">
          <li className="breadcrumb-item">ໜ້າຫຼັກ</li>
          <li className="breadcrumb-item active">ແບບຟອມຮັບເງິນຄືນ</li>
        </ol>
        <h3 className="page-header fs-20px">
          <Link to={'/'} className='me-3 text-danger' ><i class="fa-solid fa-circle-arrow-left"></i> </Link>
          ລົງທະບຽນຮັບເງິນຄືນ
        </h3>

        <div className="panel  border-4 border-top border-red rounded-top-4">
          <div className="panel-body ">
            {isLoading && <Loader size='lg' backdrop content="ກຳລັງບັນທຶກ..." vertical />}
            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <h5 className='text-blue'><i class="fa-solid fa-user-pen"></i> ຟອມລົງທະບຽນຮັບເງິນຄືນ</h5>
              </div>
              <div className="row fs-15px mb-4">
                <div className="col-sm-3 mb-2">
                  <label htmlFor="" className='form-label'>ບໍລິສັດປະກັນໄພ</label>
                  <SelectPicker data={itemcn} value={inputs.company_id_fk} onChange={(e) => handelCompany('company_id_fk', e)} placeholder={'ບໍລິສັດປະກັນໄພ'} block required />
                </div>
                <div className="col-sm-3 mb-2">
                  <label htmlFor="" className='form-label'>ຜູ້ຊື້ປະກັນ</label>
                  <SelectPicker data={dataBuy} value={inputs.custom_buyer_id_fk} onChange={(e) => handelChange('custom_buyer_id_fk', e)} placeholder={'ຜູ້ຊື້ປະກັນ'} block loading={loading} required />
                </div>
                <div className="col-sm-3  mb-2">
                  <label htmlFor="" className='form-label'>ຕົວແທນຂາຍປະກັນ</label>
                  <SelectPicker data={itemAg} placeholder={'ຕົວແທນຂາຍ'} value={inputs.agent_id_fk} onChange={(e) => handelChange('agent_id_fk', e)} block required />
                </div>
                <div className="col-sm-3  mb-2">
                  <label htmlFor="" className='form-label'>ປະເພດປະກັນໄພ</label>
                  <SelectPicker data={itemType} value={inputs.insurance_type_fk} onChange={(e) => handleOption('insurance_type_fk', e)} placeholder={'ປະເພດປະກັນ'} block required />
                </div>
                <div className="col-sm-3  mb-2">
                  <label htmlFor="" className='form-label'>ທາງເລືອກ</label>
                  <SelectPicker data={dataOption} value={inputs.option_id_fk} onChange={(e) => handelChange('option_id_fk', e)} placeholder={'ທາງເລືອກ'} block required />
                </div>
                <div className="col-sm-3  mb-2">
                  <label htmlFor="" className='form-label'>ເລກທີສັນຍາ</label>
                  <InputGroup inside >
                    <InputGroup.Addon><i className="fa-regular fa-id-card" /></InputGroup.Addon>
                    <Input value={inputs.contract_number} onChange={(e) => handelChange('contract_number', e)} placeholder='xxx  xxx-xxx-xxxx' block required />
                  </InputGroup>
                </div>
                <div className="col-sm-3  mb-2">
                  <label htmlFor="" className='form-label'>ຍອດເງິນ</label>
                  <Input value={numeral(inputs.retrun_balance).format('0,00')} onChange={(e) => handelChange('retrun_balance', e)} placeholder='0,00' block required />
                </div>
                <div className="col-sm-3  mb-2">
                  <label htmlFor="" className='form-label'>ສະກຸນເງິນ</label>
                  <InputPicker data={itemCry} value={inputs.currency_id_fk} onChange={(e) => handelChange('currency_id_fk', e)} block />
                </div>

              </div>
              <div className="row">

              <div className="col-sm-4 mb-2">
                  <div className="form-group mb-2">
                    <label htmlFor="" className='form-label'>ສະຖານະຄືນບໍລິສັດ</label>
                    <select className='form-select' value={inputs.status_oac} onChange={(e) => handelChange('status_oac', e.target.value)}>
                      <option value="1">ຄ້າງຄືນບໍລິສັດ</option>
                      <option value="2">ຄືນບໍລິສັດແລ້ວ</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="" className='form-label'>ວັນທິຄືນບໍລິສັດ</label>
                    <DatePicker oneTap format='dd/MM/yyyy' value={inputs.oac_date} onChange={(e) => handelChange('oac_date', e)} block />
                  </div>
                </div>

                <div className="col-sm-4 mb-2">
                  <div className="form-group mb-2 row">
                    <div className="col-sm-6">
                    <label htmlFor="" className='form-label'>ເປິເຊັນຕົວແທນ {inputs.percent_agent}%</label>
                    <Input type='number' value={inputs.percent_agent} onChange={(e)=>handelChange('percent_agent',e)} />
                    </div>
                    <div className="col-sm-6">
                    <label htmlFor="" className='form-label'>ສະຖານະຕົວແທນ</label>
                    <select className='form-select' value={inputs.status_company} onChange={(e) => handelChange('status_company', e.target.value)}>
                      <option value="1">ຕົວແທນຄ້າງຄືນ</option>
                      <option value="2">ຕົວແທນຄືນແລ້ວ</option>
                    </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="" className='form-label'>ວັນທິຕົວແທນຄືນ</label>
                    <DatePicker oneTap format='dd/MM/yyyy' value={inputs.company_date} onChange={(e) => handelChange('company_date', e)} block />
                  </div>
                </div>
                
                <div className="col-sm-4 mb-2">
                  <div className="form-group mb-2 row">
                  <div className="col-sm-6">
                    <label htmlFor="" className='form-label'>ເປິເຊັນໂອເອຊີ {inputs.percent_oac}%</label>
                    <Input type='number' value={inputs.percent_oac} onChange={(e)=>handelChange('percent_oac',e)} />
                    </div>
                    <div className="col-sm-6">
                    <label htmlFor="" className='form-label'>ສະຖານະໂອເອຊີ</label>
                    <select className='form-select' value={inputs.status_agent} onChange={(e) => handelChange('status_agent', e.target.value)}>
                      <option value="1">ໂອເອຊີຄ້າງຄືນ</option>
                      <option value="2">ໂອເອຊີຄືນແລ້ວ</option>
                    </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="" className='form-label'>ວັນທິໂອເອຊີຄືນ</label>
                    <DatePicker oneTap format='dd/MM/yyyy' value={inputs.agent_date} onChange={(e) => handelChange('agent_date', e)} block />
                  </div>
                </div>

                <div className="col-sm-12 mt-2">
                  <label htmlFor="" className='form-label'>ໝາຍເຫດ</label>
                  <Input as='textarea' value={inputs.remark_text} onChange={(e) => handelChange('remark_text', e)} />
                </div>
              </div>

              <div className="row mt-4 mb-4">
                <div className="col-6">
                  <Button onClick={setInputs} appearance="primary" color='red' block> ເລີມໃໝ່ </Button>
                </div>
                <div className="col-6">
                  <Button type='submit' appearance="primary" block> ບັນທຶກ </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

    </>
  )
}
