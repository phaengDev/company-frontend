import React, { useEffect, useState,useRef } from 'react'
import { Input, Button } from 'rsuite';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import {useProvince,useTypeBuyer } from '../../config/select-option';
import { Config } from '../../config/connenct';
import axios from 'axios';
import Alert from '../../utils/config';
function RegisterCustomer() {
  const api = Config.urlApi;
    const itempv=useProvince();
    const typeUse=useTypeBuyer();

  const [disId,setDisId] = useState('');
  const [itemDistrict, setItemDistrict] = useState([]);
  const showDistrict = async () => {
    if (disId === null) return; 
    try {
      const response = await fetch(api+`district/pv/${disId}`);
      const jsonData = await response.json();
      setItemDistrict(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
}
const dataDist = itemDistrict.map(item => ({ label: item.district_name, value: item.district_id }));

const handlePorvince=(name,value)=>{
  setInputs({
    ...inputs,[name]:value
  })
  setDisId(value)
  
}

  // const typeUse = [
  //   { value: '1', label: 'ແບບບຸກຄົນ' },
  //   { value: '2', label: 'ແບບອົງກອນ' }
  // ]
// const imageRef = useRef(null);
const [imgPart,setImgPart]=useState('/assets/img/logo/camera.png')
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setInputs({
          ...inputs,
          custom_profile: file
      });
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setImgPart(reader.result);
          };
          reader.readAsDataURL(file);
      }
    };


const [inputs,setInputs]=useState({
  customUuid:'',
  type_buyer_fk:'',
  custom_profile:'',
  customer_name:'',
  province_fk:'',
  district_fk:'',
  village_name:'',
  registra_tel:''
});
const hendleChange=(name,value)=>{
  setInputs({
    ...inputs,[name]:value
  })
}

const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  const imputData=new FormData();
  for(const key in inputs){
      imputData.append(key,inputs[key])
  }
  try {
      axios.post(api + 'custom/create', imputData)
      .then(function (respones) {
          if (respones.status === 200) {
            navigate(`/contract?id=${btoa(respones.data.id)}`);
          }else{
              Alert.errorData(respones.data.message)
          }
      });
  } catch (error) {
    console.error('Error inserting data:', error);
  }
};

useEffect(() => {
  showDistrict()
}, [disId]);

  return (
    <>
    <div id="content" class="app-content">
      <ol class="breadcrumb float-end">
        <li class="breadcrumb-item">ໜ້າຫຼັກ</li>
        <li class="breadcrumb-item active">ແບບຟອມລົງທະບຽນ</li>
      </ol>
      <h3 class="page-header fs-20px">ລົງທະບຽນຊື້ປະກັນ</h3>
      <div className="panel  border-4 border-top border-red rounded-top-4">
        <div className="panel-body ">
          <div className='mb-3'>
            <h5> ຟອມລົງທະບຽນຜູ້ຊື່ປະກັນໄພ</h5>
          </div>
            <form onSubmit={handleSubmit}>
              <div className="row">
              <div className="col-sm-12 mb-3 text-center">
                <label role='button' className=''>
                <input type="file" name="com_logo" onChange={handleImageChange} accept="image/*" className="hide" />
                  <img src={imgPart} id="blah"  alt="" class="w-120px h-120px rounded-pill" />
                </label>
              </div>
              <div className="col-sm-4 mb-2">
                  <label htmlFor="" className='form-label'>ປະເພດຜູ້ຊື້ປະກັນ</label>
                  <Select options={typeUse} onChange={(e)=>hendleChange('type_buyer_fk',e.value)} placeholder='ເລືອກປະເພດ' required />
                </div>
                <div className="col-sm-4 mb-2">
                  <label htmlFor="" className='form-label'>ຊື່ລູກຄ້າ</label>
                  <Input onChange={(e)=>hendleChange('customer_name',e)} placeholder='ຊື່ລູກຄ້າ' block required />
                </div>
                <div className="col-sm-4 mb-2">
                  <label htmlFor="" className='form-label'>ເບີໂທລະສັບ</label>
                  <Input onChange={(e)=>hendleChange('registra_tel',e)} placeholder='020 9999 9999' block  required />
                </div>
                <div className="col-sm-4 mb-2">
                  <label htmlFor="" className='form-label'>ແຂວງ</label>
                  <Select options={itempv} onChange={(e)=>handlePorvince('province_id_fk',e.value)}  required />
                </div>
                <div className="col-sm-4 mb-2">
                  <label htmlFor="" className='form-label'>ເມືອງ</label>
                  <Select options={dataDist} onChange={(e)=>hendleChange('district_fk',e.value)} required />
                </div>
                <div className="col-sm-4 mb-2">
                  <label htmlFor="" className='form-label'>ບ້ານ</label>
                  <Input onChange={(e)=>hendleChange('village_name',e)} placeholder='ຊື່ບ້ານ' block required />
                </div>
               
                <div className="col-6 mb-2 mt-3">
                  <Button color="red" appearance="primary" startIcon={<i class="fa-solid fa-rotate"/>} block>ເລີ່ມໃໝ່</Button>
                </div>
                <div className="col-6 mb-2 mt-3">
                <Button type='submit' color="blue" appearance="primary" startIcon={<i className='fas fa-save' />} block>ບັນທຶກ</Button>
                </div>
              </div>
              </form>
            </div>

      </div>
      </div>
    </>
  )
}

export default RegisterCustomer