import React, { useState, useEffect } from 'react'
import { SelectPicker, Input, InputGroup, DatePicker, InputPicker } from 'rsuite'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Config, imageUrl } from '../../config/connenct';
import { useAgent, useCompany, useType, useCurrency } from '../../config/select-option';
import axios from 'axios';
export default function RetrunInsurance() {
  const api = Config.urlApi;
  const url = imageUrl.url;
  const itemAg = useAgent();
  const itemcn = useCompany();
  const itemType = useType();
  const itemCry=useCurrency();
  const location = useLocation();

  const [itemOption, setItemOption] = useState([]);
  const handleOption = async (name, value) => {
    try {
      const response = await fetch(api + `options/t/${value}`);
      const jsonData = await response.json();
      setItemOption(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const dataOption = itemOption.map(item => ({ label: item.options_name, value: item.options_Id }));

  const [itemBuy,setItemBuy]=useState([]);
  const [loading,setLoading]=useState(false)
  const handelCompany = async (name,value) => {
    setLoading(true)
    try {
      const response = await fetch(api + `custom/cm/${value}`);
      const jsonData = await response.json();
      setItemBuy(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally{
      setLoading(false)
    }
  }

  const dataBuy = itemBuy.map(item => ({ label: item.customer_name, value: item.custom_uuid }));

const [inputs,setInputs]=useState({
  insurance_retrunId:'',
  company_id_fk:'',
  agent_id_fk:'',
  custom_buyer_id_fk:'',
  option_id_fk:'',
  constract_number:'',
  retrun_balance:'',
  currency_id_fk:'',
  status_company:'',
  company_date:'',
  status_agent:'',
  agent_date:'',
  status_oac:'',
  oac_date:'',
  remark_text:''
})
  const handelChange = (name, value) => {

  }
  return (
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
          <div className='mb-3'>
            <h5 className='text-blue'><i class="fa-solid fa-user-pen"></i> ຟອມລົງທະບຽນຊື້ປະກັນໄພ</h5>
          </div>
          <div className="row fs-15px mb-4">
            <div className="col-sm-3 mb-2">
              <label htmlFor="" className='form-label'>ບໍລິສັດປະກັນໄພ</label>
              <SelectPicker data={itemcn} onChange={(e) => handelCompany('company_id_fk', e)} placeholder={'ບໍລິສັດປະກັນໄພ'} block required />
            </div>
            <div className="col-sm-3 mb-2">
              <label htmlFor="" className='form-label'>ຜູ້ຊື້ປະກັນ</label>
              <SelectPicker data={dataBuy} onChange={(e) => handelChange('custom_buy_fk', e)} placeholder={'ຜູ້ຊື້ປະກັນ'} block loading={loading} required />
            </div>
            <div className="col-sm-3  mb-2">
              <label htmlFor="" className='form-label'>ຕົວແທນຂາຍປະກັນ</label>
              <SelectPicker data={itemAg} placeholder={'ຕົວແທນຂາຍ'} onChange={(e) => handelChange('agent_id_fk', e)} block required />
            </div>
            <div className="col-sm-3  mb-2">
              <label htmlFor="" className='form-label'>ປະເພດປະກັນໄພ</label>
              <SelectPicker data={itemType} onChange={(e) => handleOption('insurance_type_fk', e)} placeholder={'ປະເພດປະກັນ'} block required />
            </div>
            <div className="col-sm-3  mb-2">
              <label htmlFor="" className='form-label'>ທາງເລືອກ</label>
              <SelectPicker data={dataOption} onChange={(e) => handelChange('option_id_fk', e)} placeholder={'ທາງເລືອກ'} block required />
            </div>
            <div className="col-sm-3  mb-2">
              <label htmlFor="" className='form-label'>ເລກທີສັນຍາ</label>
              <InputGroup inside >
                <InputGroup.Addon><i className="fa-regular fa-id-card" /></InputGroup.Addon>
                <Input onChange={(e) => handelChange('contract_number', e)} placeholder='xxx  xxx-xxx-xxxx' block required />
              </InputGroup>
            </div>
            <div className="col-sm-3  mb-2">
              <label htmlFor="" className='form-label'>ຍອດເງິນ</label>
              <Input onChange={(e) => handelChange('contract_start_date', e)} placeholder='0,00' block required />
            </div>
            <div className="col-sm-3  mb-2">
            <label htmlFor="" className='form-label'>ສະກຸນເງິນ</label>
              <InputPicker data={itemCry} defaultValue={22001} block />
            </div>

          </div>
          <div className="row">



            <div className="col-sm-4 mb-2">
              <div className="form-group mb-2">
                <label htmlFor="" className='form-label'>ສະຖານະຕົວແທນ</label>
                <select className='form-select'>
                  <option value="1">ຕົວແທນຄ້າງຄືນ</option>
                  <option value="2">ຕົວແທນຄືນແລ້ວ</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="" className='form-label'>ວັນທິຕົວແທນຄືນ</label>
                <DatePicker oneTap format='dd/MM/yyyy' defaultValue={new Date()} block />
              </div>
            </div> 
            <div className="col-sm-4 mb-2">
              <div className="form-group mb-2">
                <label htmlFor="" className='form-label'>ສະຖານະໂອເອຊີ</label>
                <select className='form-select'>
                  <option value="1">ໂອເອຊີຄ້າງຄືນ</option>
                  <option value="2">ໂອເອຊີຄືນແລ້ວ</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="" className='form-label'>ວັນທິໂອເອຊີຄືນ</label>
                <DatePicker oneTap format='dd/MM/yyyy' defaultValue={new Date()} block />
              </div>
            </div>
            <div className="col-sm-4 mb-2">
              <div className="form-group mb-2">
                <label htmlFor="" className='form-label'>ສະຖານະຄືນບໍລິສັດ</label>
                <select className='form-select'>
                  <option value="1">ຄ້າງຄືນບໍລິສັດ</option>
                  <option value="2">ຄືນບໍລິສັດແລ້ວ</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="" className='form-label'>ວັນທິຄືນບໍລິສັດ</label>
                <DatePicker oneTap format='dd/MM/yyyy' defaultValue={new Date()} block />
              </div>
            </div>

            <div className="col-sm-12 mt-2">
              <label htmlFor="" className='form-label'>ໝາຍເຫດ</label>
            <Input as='textarea' />
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}
