import React, { useState,useEffect } from "react";
import {Input,InputGroup, DatePicker,SelectPicker,Loader, Placeholder  } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import {Config} from "../config/connenct";
import axios from 'axios';
export default function ReportsPay() {
  const api = Config.urlApi;
  const [itemtype,setItimeType] = useState([]);
  const fetchType = async () => {
    try {
      const response = await fetch(api + 'redType');
      const jsonData = await response.json();
      setItimeType(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  const dataType = itemtype.map(item => ({ label: item.type_in_name, value: item.type_in_code }));
  const [selectedValue, setSelectedValue] = useState('');
  const handleShowType=(e)=>{
    setSelectedValue(e)
    showOption(e)
    setTypeId(e)
}
const showOption =(event) =>{
  axios.get(api + 'redOption/'+event)
  .then(function(res){
    setItemOption(res.data);
  }).catch(err => {
      console.log(err)
  });
}



const handleSearch=()=>{
  // fetchInsruanceArrears();
}

const [startDate, setStartDate] = useState(new Date());
const [endDate, setEndDate] = useState(new Date());
const [typeId, setTypeId] = useState('');
const [optionId, setOptionId] = useState('');
const [datasearch,setDataSearch]=useState('');

useEffect(() => {
  fetchType()
}, []);
const [itemoption,setItemOption]=useState([]);
  const dataOption = itemoption.map(item => ({ label: item.options_name, value: item.options_code }));
  return (
    <>
      <div id="content" class="app-content">
        <h1 class="page-header"> ລາຍການຈ່າຍຄ່ປະກັນໄພ</h1>
        <div class="panel panel-inverse">
          <div class="panel-body">
          <div className="row fs-14px mb-3">
                <div className="col-sm-6 col-lg-4">
                    <div className="row ">
                    <div className="col-6">
                        <label htmlFor="" className="form-label">ວັນທີ</label>
                        <DatePicker oneTap value={startDate}  format="dd/MM/yyyy" onChange={value => setStartDate(value)} block placeholder='ວັນທີ' />
                    </div>
                    <div className="col-6">
                    <label htmlFor="" className="form-label">ຫາວັນທີ</label>
                    <DatePicker oneTap value={endDate}  format="dd/MM/yyyy" onChange={value => setEndDate(value)} block placeholder='ວັນທີ' />
                    </div>
                    </div>
                </div>
                <div className="col-sm-4 col-lg-2 col-6">
                <label htmlFor="" className="form-label">ປະເພດປະກັນ</label>
                <SelectPicker name="type_fk" data={dataType} onChange={value => handleShowType(value)} placeholder={'- ເລືອກປະເພດ -'} value={selectedValue} block />
              </div>
              <div className="col-sm-4 col-lg-2 col-6">
                <label htmlFor="" className="form-label">ທາງເລືອກ</label>
                <SelectPicker name="" data={dataOption} placeholder={'ທາງເລືອກ'} onChange={value => setOptionId(value)} value={optionId} block />
              </div>
                <div className="col-sm-4 col-lg-2">
                <label htmlFor="" className="form-label">ເລກທີສັນຍາ</label>
                <InputGroup inside >
                <InputGroup.Addon>
                  <SearchIcon />
                </InputGroup.Addon>
                <Input type="text" block value={datasearch} onChange={setDataSearch}  placeholder="ເລກທີສັນຍາ" />
              </InputGroup>
                </div>
                <div className="col-sm-4 col-lg-2  mt-4">
               <button type="button" onClick={handleSearch} className="btn btn-primary px-3 me-2"><i className="fas fa-search fs-16px"></i> ຄົ້ນຫາ</button>
               <button className="btn btn-danger px-3"><i className="fa-solid fa-file-excel fs-16px"></i> Excel</button>
                </div>
            </div>
            <div class="table-responsive">
              <table class="table table-striped table-bordered align-middle w-100 text-nowrap">
                <thead className="fs-14px">
                <tr>
                  <th className="text-nowrap">ລ/ດ</th>
                  <th className="text-nowrap">ວັນທີຈ່າຍ</th>
                  <th className="text-nowrap">ເລກທີສັນຍາ</th>
                  <th className="text-nowrap">ວັນທີເລີມສັນຍາ</th>
                  <th className="text-nowrap">ວັນທີສິນສຸດສັນຍາ</th>
                  <th className="text-nowrap">ຊື່ລູກຄ້າ</th>
                  <th className="text-nowrap">ປະເພດຜູ້ຊື້</th>
                  <th className="text-nowrap">ປະເພດປະກັນ</th>
                  <th className="text-nowrap">ທາງເລືອກ</th>
                  <th className="text-nowrap">ຄ່າທຳນຽມເບື້ອງຕົ້ນ</th>
                  <th className="text-nowrap">ຄ່າອາກອນ</th>
                  <th className="text-nowrap">ເປັນເງິນ</th>
                  <th className="text-nowrap">ຄ່າລົງທະບຽນ</th>
                  <th className="text-nowrap">ຄ່າປະກັນໄພລວມ</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>ໄພຳໄຳ</td>
                        <td>ໄພຳໄຳ</td>
                        <td>ໄພຳໄຳ</td>
                        <td>ໄພຳໄຳ</td>
                        <td>ໄພຳໄຳ</td>
                        <td>ໄພຳໄຳ</td>
                        <td>ໄພຳໄຳ</td>
                        <td>ໄພຳໄຳ</td>
                        <td>ໄພຳໄຳ</td>
                        <td>ໄພຳໄຳ</td>
                        <td>ໄພຳໄຳ</td>
                        <td>ໄພຳໄຳ</td>
                        <td>ໄພຳໄຳ</td>
                    </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
