import React, { useEffect, useState } from 'react'
import { Input, Button } from 'rsuite';
import Select from 'react-select';
import { useNavigate,useLocation } from 'react-router-dom';
import {useProvince,useTypeBuyer } from '../../config/select-option';
import { Config,imageUrl } from '../../config/connenct';
import axios from 'axios';
import Alert from '../../utils/config';
function EditCustomer() {
  const api = Config.urlApi;
  const url=imageUrl.url;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const cusId = atob(searchParams.get('id'));
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
};
    const itempv=useProvince();
    const [inputs,setInputs]=useState({
        customUuid:'',
        type_buyer_fk:'',
        custom_profile:'',
        customer_name:'',
        district_fk:'',
        province_fk:'',
        village_name:'',
        registra_tel:''
      });
    const showCustomer = async () => {
        try {
          const response = await fetch(api+`custom/${cusId}`);
          const data = await response.json();
          setInputs({
        customUuid:data.custom_uuid,
        type_buyer_fk:data.type_buyer_fk,
        customer_name:data.customer_name,
        district_fk:data.district_fk,
        province_fk:data.provice_fk,
        village_name:data.village_name,
        registra_tel:data.registra_tel
          });
          setDisId(data.provice_fk);
          if(data.custom_profile){
            setImgPart(url+'profile/'+data.custom_profile);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }



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

const handlePorvince=(value)=>{
  setDisId(value)
  
}

  const typeUse = useTypeBuyer();
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



const hendleChange=(name,value)=>{
  setInputs({
    ...inputs,[name]:value
  })
}



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
            Alert.successData(respones.data.message)
            navigate(`/custom`);
          }else{
              Alert.errorData(respones.data.message)
          }
      });
  } catch (error) {
    console.error('Error inserting data:', error);
  }
};

useEffect(() => {
  showDistrict();
  showCustomer();
}, [disId]);

  return (
    <>
    <div id="content" class="app-content">
      <ol class="breadcrumb float-end">
        <li class="breadcrumb-item">ໜ້າຫຼັກ</li>
        <li class="breadcrumb-item active">ແບບຟອມລົງທະບຽນ</li>
      </ol>
      <h3 class="page-header fs-20px"><span className='me-3 text-danger' onClick={handleGoBack}><i class="fa-solid fa-circle-arrow-left"></i></span> ແກ້ໄຂຂໍ້ມູນຜູ້ຊື້ປະກັນ</h3>
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
                  <Select options={typeUse} value={typeUse.find(obj => obj.value === inputs.type_buyer_fk)} onChange={(e)=>hendleChange('type_buyer_fk',e.value)} placeholder='ເລືອກປະເພດ' required />
                </div>
                <div className="col-sm-4 mb-2">
                  <label htmlFor="" className='form-label'>ຊື່ລູກຄ້າ</label>
                  <Input value={inputs.customer_name} onChange={(e)=>hendleChange('customer_name',e)} placeholder='ຊື່ລູກຄ້າ' block required />
                </div>
                <div className="col-sm-4 mb-2">
                  <label htmlFor="" className='form-label'>ເບີໂທລະສັບ</label>
                  <Input value={inputs.registra_tel} onChange={(e)=>hendleChange('registra_tel',e)} placeholder='020 9999 9999' block  required />
                </div>
                <div className="col-sm-4 mb-2">
                  <label htmlFor="" className='form-label'>ແຂວງ</label>
                  <Select options={itempv} value={itempv.find(obj => obj.value === inputs.province_fk)} onChange={(e)=>handlePorvince(e.value)}  required />
                </div>
                <div className="col-sm-4 mb-2">
                  <label htmlFor="" className='form-label'>ເມືອງ</label>
                  <Select options={dataDist} value={dataDist.find(obj => obj.value === inputs.district_fk)} onChange={(e)=>hendleChange('district_fk',e.value)} required />
                </div>
                <div className="col-sm-4 mb-2">
                  <label htmlFor="" className='form-label'>ບ້ານ</label>
                  <Input value={inputs.village_name} onChange={(e)=>hendleChange('village_name',e)} placeholder='ຊື່ບ້ານ' block required />
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

export default EditCustomer