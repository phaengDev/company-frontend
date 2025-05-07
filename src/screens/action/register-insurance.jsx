import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { Input, InputNumber, SelectPicker, InputGroup, DatePicker, Button, InputPicker, DateInput } from 'rsuite';
import { useAgent, useCompany, useType, useTypeCar, useBrandCar, useProvince, useCurrency, useStatus } from '../../config/select-option';
import Select from 'react-select'
import { Config, imageUrl } from '../../config/connenct';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import Alert from '../../utils/config';
export default function RegisterInsurance() {
  const api = Config.urlApi;
  const url = imageUrl.url;
  const itemAg = useAgent();
  const itemcn = useCompany();
  const itemType = useType();
  const itemTypeCar = useTypeCar();
  const itemBrand = useBrandCar();
  const itemStatus = useStatus();
  const itemPv = useProvince()
  const itemCry = useCurrency();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const customId = atob(searchParams.get('id'));

  const [opId, setOpId] = useState(null);
  const [itemOption, setItemOption] = useState([]);
  const showOption = async () => {
    if (opId === null) return; // Do nothing if opId is null
    try {
      const response = await fetch(api + `options/t/${opId}`);
      const jsonData = await response.json();
      setItemOption(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const dataOption = itemOption.map(item => ({ label: item.options_name, value: item.options_Id, percent: item.option_vat }));

  //===========================
  const [profile, setProfile] = useState('./assets/img/logo/camera.png');
  const [custom, steCustom] = useState({})
  const showCustom = async () => {
    try {
      const response = await fetch(api + `custom/${customId}`);
      const jsonData = await response.json();
      if (jsonData.custom_profile) {
        setProfile(url + 'profile/' + jsonData.custom_profile);
      }
      steCustom(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const [itemDistrict, setItemDistrict] = useState([]);
  const handelShowDist = async (value) => {
    try {
      const response = await fetch(api + `district/pv/${value}`);
      const jsonData = await response.json();
      setItemDistrict(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  const dataDist = itemDistrict.map(item => ({ label: item.district_name, value: item.district_id }));
  const [typeInsurance, setTypeInsurance] = useState(2);

  const [valueComis, setValueComis] = useState({
    companyId: '',
    agentId: '',
    typeinsId: ''
  })

  const handleOption = async (name, value) => {
    setValueComis({
      ...valueComis, typeinsId: value
    })
    setOpId(value);
    // setInputs({
    //   ...inputs, [name]: value
    // });

    const response = await fetch(api + 'type-ins/' + value)
    const data = await response.json();
    setTypeInsurance(data.status_ins);
    setInputs({
      ...inputs,
      [name]: value,
       statusIns: data.status_ins
    })
  }

  // const [comis, setComis] = useState({ comisget: 0, comispay: 0 });

  const fetchComission = async () => {
    try {
      const response = await axios.post(api + 'comisget/single', valueComis);
      const jsonData = response.data;

      // setTaxProfit(jsonData.percentGet);
      // setPercentEps(jsonData.percentPay);
      setInputs((prevInputs) => ({
        ...prevInputs,
        precent_incom: jsonData.percentGet,
        percent_eps: jsonData.percentPay,
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }



  const [initialFee, setInitialFee] = useState(0);//---- ຄ່າທຳນຽມເບື້ອງຕົ້ນ
  const [percentTaxes, setPercentTaxes] = useState(10);
  const moneyTaxes = (initialFee * percentTaxes) / 100;

  const [registrationFee, setRegistrationFee] = useState(0)
  const insurancIncluded = numeral(parseFloat(initialFee) + parseFloat(moneyTaxes) + parseFloat(registrationFee)).format('0,00.00');

  const onkeyup_premiums = (name, value) => {
    // const valuese = parseFloat(value.replace(/,/g, ''));
    const values = isNaN(value) ? 0 : value
    setInputs({
      ...inputs, [name]: values
    })
    if (name === 'initial_fee') {
      toThousands(values);
      setInitialFee(values);
    } else if (name === 'percent_taxes') {
      setPercentTaxes(values)
    } else if (name === 'registration_fee') {
      toThousandsFee(values)
      setRegistrationFee(values)
    }

  }

  const nextYear = moment(new Date()).add(1, 'year').toDate();
  const [inputs, setInputs] = useState({
    incuranecCode: '',
    custom_id_fk: customId,
    company_id_fk: '',
    agent_id_fk: '',
    insurance_type_fk: '',
    option_id_fk: '',
    currency_id_fk: 22001,
    contract_number: '',
    contract_number2: '',
    contract_start_date: new Date(),
    contract_end_date: new Date(nextYear),
    file_doct: '',
    // statuStaff: [{}],
    no_contract: '',
    user_fname: '',
    user_lname: '',
    user_gender: 'F',
    user_dob: '',
    user_tel: '',
    user_district_fk: '',
    user_village: '',
    status_use: '',
    // ----------- ຂໍມູນລົດ
    statusIns: '',
    car_type_id_fk: '',
    car_brand_id_fk: '',
    version_name: '',
    car_registration: '',
    vehicle_number: '',
    tank_number: '',
    // ---------- ຂໍ້ມູນຄ່າປະກັນໄພ
    initial_fee: 0,//c
    percent_taxes: '10',//c
    registration_fee: '0',//c
    insuranc_included: 0,//c
    precent_incom: 0,//c
    percent_akorn: '5',//c
    percent_eps: 0,//c
    percent_fee_eps: '5',//c
    status_company: '1',
    company_date: new Date(),
    status_agent: '1',
    agent_date: new Date(),
    status_oac: '1',
    oac_date: new Date()
  });
  const handelChange = (name, value) => {
    setInputs({
      ...inputs, [name]: value
    })
    if (name === 'company_id_fk') {
      setValueComis({
        ...valueComis, companyId: value
      })
    }
    if (name === 'agent_id_fk') {
      setValueComis({
        ...valueComis, agentId: value
      })
    }

    if (name === 'contract_start_date') {
      const nextYear = moment(value).add(1, 'year').toDate();
      setInputs({
        ...inputs,
        contract_start_date:new Date(value),
        contract_end_date: new Date(nextYear),
        company_date: new Date(value),
        agent_date: new Date(value),
        oac_date: new Date(value)
      });
    }

    if (name === 'option_id_fk') {
      const selectedOption = dataOption.find(option => option.value === value);
      const percent_taxes = selectedOption ? selectedOption.percent : '10';
      setInputs(prevInputs => ({
        ...prevInputs,
        percent_taxes: percent_taxes,
      }));
    }

  }



  const [fileName, setFileName] = useState('');
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setInputs({
        ...inputs, file_doct: file
      })
      setFileName(file.name);
      const reader = new FileReader();
      reader.readAsText(file);
    }
  };

  //=================================== insert data to datablse============
  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(inputs);return;
    const imputData = new FormData();
    for (const key in inputs) {
      imputData.append(key, inputs[key])
    }

    try {
      axios.post(api + 'insurance/create', imputData)
        .then(function (respones) {
          if (respones.status === 200) {
            Alert.Successreload(respones.data.message)
          } else if(respones.status === 201){
            Alert.infoData(respones.data.message)
          } else {
            Alert.errorData(respones.data.message)
          }
        });
    } catch (error) {
      Alert.errorData(error);
      console.error('Error inserting data:', error);
    }
  }
  useEffect(() => {
    showOption();
    showCustom();
    fetchComission();


  }, [opId, customId, valueComis]);
  // const [rows, setRows] = useState([{}]);
  function toThousands(value) {
    return value ? `${value}`.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : value;
  }
  function toThousandsFee(value) {
    return value ? `${value}`.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : value;
  }

  return (
    <div id="content" className="app-content">
      <ol className="breadcrumb float-end">
        <li className="breadcrumb-item">ໜ້າຫຼັກ</li>
        <li className="breadcrumb-item active">ແບບຟອມລົງທະບຽນ</li>
      </ol>
      <h3 className="page-header fs-20px"><Link to={'/report'} className='me-3 text-danger' ><i class="fa-solid fa-circle-arrow-left"></i></Link> ລົງທະບຽນຊື້ປະກັນ </h3>
      <form onSubmit={handleSubmit} >

        <div className="panel  border-4 border-top border-red rounded-top-4">
          <div className="panel-body ">
            <div className="d-flex align-items-center mb-15px">
              <div className="widget-img rounded-3 me-10px bg-white w-80px h-80px">
                <img src={profile} className='w-80px h-80px' alt="" />
              </div>
              <div className="text-truncate">
                <div>ປະເພດຜູ້ຊື້ປະກັນ: {custom.type_buyer_name}</div>
                <div className='w-bold'>ຊື່ລູກຄ້າ: {custom.customer_name}</div>
                <div className="text-gray-500">ເບີໂທລະສັບ: {custom.registra_tel}</div>
              </div>
            </div>

            <hr className='border-blue' />
            <div className='mb-3'>
              <h5 className='text-blue'><i class="fa-solid fa-user-pen"></i> ຟອມລົງທະບຽນຊື້ປະກັນໄພ </h5>
            </div>
            <div className="row fs-15px mb-4">
              <div className="col-sm-6 mb-2">
                <label htmlFor="" className='form-label'>ບໍລິສັດປະກັນໄພ</label>
                <SelectPicker data={itemcn} value={inputs.company_id_fk} onChange={(e) => handelChange('company_id_fk', e)} placeholder={'ບໍລິສັດປະກັນໄພ'} block required />
              </div>
              <div className="col-sm-6  mb-2">
                <label htmlFor="" className='form-label'>ຕົວແທນຂາຍປະກັນ</label>
                <SelectPicker data={itemAg} value={inputs.agent_id_fk} placeholder={'ຕົວແທນຂາຍ'} onChange={(e) => handelChange('agent_id_fk', e)} block required />
              </div>
              <div className="col-sm-6  mb-2">
                <label htmlFor="" className='form-label'>ປະເພດປະກັນໄພ</label>
                <SelectPicker data={itemType} value={inputs.insurance_type_fk} onChange={(e) => handleOption('insurance_type_fk', e)} placeholder={'ປະເພດປະກັນ'} block required />
              </div>
              <div className="col-sm-6  mb-2">
                <label htmlFor="" className='form-label'>ທາງເລືອກ</label>
                <SelectPicker data={dataOption} value={inputs.option_id_fk} onChange={(e) => handelChange('option_id_fk', e)} placeholder={'ທາງເລືອກ'} block required />
              </div>
              <div className="col-sm-4  mb-2">
                <label htmlFor="" className='form-label'>ເລກທີສັນຍາ</label>
                <InputGroup inside >
                  <InputGroup.Addon><i className="fa-regular fa-id-card" /></InputGroup.Addon>
                  <Input value={inputs.contract_number} onChange={(e) => handelChange('contract_number', e)} placeholder='xxx  xxx-xxx-xxxx' block required />
                </InputGroup>
              </div>
              <div className="col-sm-4  mb-2">
                <label htmlFor="" className='form-label'>ວັນທີເລີມສັນຍາ</label>
                <DatePicker oneTap format="dd/MM/yyyy" value={inputs.contract_start_date} onChange={(e) => handelChange('contract_start_date', e)} placeholder='ວັນທີເລີມ' block required />
              </div>
              <div className="col-sm-4  mb-2">
                <label htmlFor="" className='form-label'>ວັນທີສິນສຸດສັນຍາ</label>
                <DatePicker oneTap format="dd/MM/yyyy" value={inputs.contract_end_date} onChange={(e) => handelChange('contract_end_date', e)} placeholder='ວັນທີສິນສຸດ' block required />
              </div>
            </div>
          </div>
        </div>
        <div className="panel border-4 border-top border-red rounded-top-4 mb-3 text-dark">
          <div className="panel-body accordion" id="accordion">
            <div class="bg-white" id="headingOne">
              <span class="accordion-button bg-white py-5px " type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                <h5>ຂໍ້ມູນຜູ້ທີ່ໄດ້ຮັບຄວາມຄຸ້ມຄອງ </h5>
              </span>
            </div>
            <div id="collapseOne" class={`accordion-collapse collapse ${custom.type_buyer_fk === 2201 ? 'show' : ''}`} data-bs-parent="#accordion">
              <div className="accordion-body ">
                {/* {inputs.statuStaff.map((row, index) => ( */}
                <>
                  <fieldset className='px-3 mb-2'>
                    <legend className='fs-18px'>ຜູ້ທີ່ໄດ້ຮັບຄວາມຄຸ້ມຄອງ</legend>
                    <div className="row fs-15px mb-3">
                      <div className="col-sm-2 col-6 mb-2">
                        <label htmlFor="" className='form-label'>ເພດ</label>
                        <select className='form-select' value={inputs.user_gender || 'F'} onChange={(e) => handelChange('user_gender', e.target.value)} >
                          <option value="F">ເພດຍິງ</option>
                          <option value="M">ເພດຊາຍ</option>
                        </select>
                      </div>
                      <div className="col-sm-4 col-6 mb-2">
                        <label htmlFor="" className='form-label'>ຊື່ແທ້</label>
                        <Input value={inputs.user_fname} onChange={(e) => handelChange('user_fname', e)} placeholder="ຊື່ແທ້" />
                      </div>
                      <div className="col-sm-3 col-6 mb-2">
                        <label htmlFor="" className='form-label'>ນາມສະກຸນ</label>
                        <Input value={inputs.user_lname} onChange={(e) => handelChange('user_lname', e)} placeholder="ນາມສະກຸນ" />
                      </div>
                      <div className="col-sm-3 col-6 mb-2">
                        <label htmlFor="" className='form-label'>ວັນເດືອນປີເກິດ</label>
                        <DateInput format='dd/MM/yyyy' value={inputs.user_dob} oneTap block onChange={(e) => handelChange('user_dob', e)} placeholder="ວັນ/ເດືອນ/ປີ" />
                      </div>
                      <div className="col-sm-3 col-6 mb-2">
                        <label htmlFor="" className='form-label'>ແຂວງ</label>
                        <SelectPicker data={itemPv}  onChange={(e) => handelShowDist(e)} placeholder='ເລືອກ' block />
                      </div>
                      <div className="col-sm-3 col-6 mb-2">
                        <label htmlFor="" className='form-label'>ເມືອງ</label>
                        <SelectPicker data={dataDist} value={inputs.user_district_fk} onChange={(e) => handelChange('user_district_fk', e)} placeholder='ເລືອກ' block />
                      </div>
                      <div className="col-sm-3 col-6 mb-2">
                        <label htmlFor="" className='form-label'>ບ້ານ</label>
                        <Input value={inputs.user_village} onChange={(e) => handelChange('user_village', e)} placeholder='ບ້ານ' block />
                      </div>
                      <div className="col-sm-3 col-6 mb-2">
                        <label htmlFor="" className='form-label'>ເບີໂທລະສັບ</label>
                        <Input type='tel' value={inputs.user_tel} onChange={(e) => handelChange('user_tel', e)} placeholder='020 999999999' block />
                      </div>
                      <div className="col-sm-4 col-6 mb-2">
                        <label htmlFor="" className='form-label'>ລະຫັດບັດ</label>
                        <Input type='text'  value={inputs.no_contract} onChange={(e) => handelChange('no_contract', e)} placeholder='XXX-XXXX-XXXXXX' block />
                      </div>
                      <div className="col-sm-3 col-6 mb-2">
                        <label htmlFor="" className='form-label'>ສະຖານະພະນັກງານ</label>
                        <SelectPicker data={itemStatus} value={inputs.status_use} onChange={(e) => handelChange('status_use', e)} placeholder='ເລືອກ' block />
                      </div>
                    </div>
                  </fieldset>
                </>
                {/* ))} */}

              </div>
            </div>
          </div>
        </div>
        {typeInsurance === 2 && (
          <div className="panel border-4 border-top border-red rounded-top-4 mb-3 text-dark">
            <div className="panel-body">
              <div className="mb-3">
                <h5>ຂໍ້ມູນລົດທີ່ຊື້ປະກັນໄພ</h5>
              </div>

              <div className="row fs-15px">
                <div className="col-sm-4 col-6 mb-2">
                  <label htmlFor="" className='form-label'>ປະເພດລົດ</label>
                  <Select options={itemTypeCar} value={inputs.car_type_id_fk} onChange={(e) => handelChange('car_type_id_fk', e.value)} placeholder="ເລືອກ" />
                </div>
                <div className="col-sm-4 col-6 mb-2">
                  <label htmlFor="" className='form-label'>ຢີ່ຫໍ້ລົດ</label>
                  <Select options={itemBrand} value={inputs.car_brand_id_fk} onChange={(e) => handelChange('car_brand_id_fk', e.value)} placeholder="ເລືອກ" />
                </div>
                <div className="col-sm-4 col-6 mb-2">
                  <label htmlFor="" className='form-label'>ລຸ່ນລົດ</label>
                  <Input value={inputs.version_name}  onChange={(e) => handelChange('version_name', e)} placeholder='ລຸ່ນລົດ' />
                </div>
                <div className="col-sm-4 col-6 mb-2">
                  <label htmlFor="" className='form-label'>ທະບຽນລົດ</label>
                  <Input value={inputs.car_registration} onChange={(e) => handelChange('car_registration', e)} placeholder='xxx xxxx' block />
                </div>
                <div className="col-sm-4 col-6 mb-2">
                  <label htmlFor="" className='form-label'>ເລກຈັກ</label>
                  <Input value={inputs.vehicle_number} onChange={(e) => handelChange('vehicle_number', e)} placeholder='xxx-xxxx-xxxxx' block />
                </div>
                <div className="col-sm-4 col-6 mb-2">
                  <label htmlFor="" className='form-label'>ເລກຖັງ</label>
                  <Input value={inputs.tank_number} onChange={(e) => handelChange('tank_number', e)} placeholder='xxx-xxxx-xxxxx' block />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="panel border-4 border-top border-red rounded-top-4 mb-3 text-dark">
          <div className="panel-body">
            <div className="mb-3">
              <h5>I. ຄ່າທຳນຽມທັງໝົດ </h5>
            </div>

            <div className="row fs-15px">
              <div className="col-sm-4 col-6 mb-2">
                <label htmlFor="" className='form-label'>ຄ່າທຳນຽມເບື້ອງຕົ້ນ</label>
                <InputNumber value={inputs.initial_fee} formatter={toThousands} onChange={(e) => onkeyup_premiums('initial_fee', e)} placeholder='xxx xxxx' block required />
              </div>
              <div className="col-sm-2 col-6 mb-2">
                <label htmlFor="" className='form-label'>ອາກອນ {inputs.money_taxes}</label>
                <InputNumber value={inputs.percent_taxes} onChange={(e) => onkeyup_premiums('percent_taxes', e)} block placeholder='0.%' min={0} required />
              </div>
              <div className="col-sm-3 col-6 mb-2">
                <label htmlFor="" className='form-label'>ຄ່າລົງທະບຽນ </label>
                <InputNumber value={inputs.registration_fee} formatter={toThousandsFee} onChange={(e) => onkeyup_premiums('registration_fee', e)} placeholder='00.000' block required />
              </div>
              <div className="col-sm-3 col-6 mb-2">
                <label htmlFor="" className='form-label'>ຄ່າທຳນຽມປະກັນໄພລວມ </label>
                <Input value={inputs.insuranc_included = insurancIncluded} placeholder='00.000' className='bg-teal-100' block readOnly />
              </div>
            </div>
            <div className="mb-3">
              <h5>II. ລາຍຮັບຄ່າຄອມ</h5>
            </div>
            <div className="row fs-15px">
              <div className="col-sm-2 col-6 mb-2">
                <label htmlFor="" className='form-label'>ເປີເຊັນ ຮັບ </label>
                <InputNumber value={inputs.precent_incom} onChange={(e) => onkeyup_premiums('precent_incom', e)} placeholder='0.%' block required readOnly />
              </div>
              <div className="col-sm-2 col-6 mb-2">
                <label htmlFor="" className='form-label'>ອ/ກ.ຮ  </label>
                <InputNumber value={inputs.percent_akorn} onChange={(e) => onkeyup_premiums('percent_akorn', e)} placeholder='0.%' block required />
              </div>
              <div className="col-sm-2 col-6 mb-2">
                <label htmlFor="" className='form-label'>ເປີເຊັນ ຈ່າຍ</label>
                <InputNumber value={inputs.percent_eps} onChange={(e) => onkeyup_premiums('percent_eps', e)} placeholder='0.%' block required readOnly />
              </div>
              <div className="col-sm-2 col-6 mb-2">
                <label htmlFor="" className='form-label'>ອ/ກ.ຮ {inputs.percent_fee_eps}% </label>
                <InputNumber value={inputs.percent_fee_eps} onChange={(e) => onkeyup_premiums('percent_fee_eps', e)} placeholder='0.%' block required />
              </div>
              <div className="col-sm-3 col-6 mb-2">
                <label htmlFor="" className='form-label'>ສະກຸນ </label>
                <InputPicker value={inputs.currency_id_fk} data={itemCry} onChange={(e) => handelChange('currency_id_fk', e)} block />
              </div>

              <div className="col-sm-12 mt-4 ">
                <label htmlFor="" className='form-label'>ເອກະສານຕິດຄັດ </label>
                <br />
                <label className='btn btn-primary'>
                  <i className="fa-solid fa-folder-open" /> ເລືອກໄຟລ໌ເອກະສານ...
                  <input type="file" onChange={handleFileChange} className='hide' />
                </label>
                {fileName && (
                  <div class="alert alert-green alert-dismissible fade show mt-3">
                    <i class="fa-solid fa-paperclip"></i>  :{fileName}
                    <button type="button" class="btn-close" ></button>
                  </div>
                )}
              </div>
            </div>


          </div>
        </div>

        <div className="panel border-4 border-top border-red rounded-top-4 mb-3 text-dark">
          <div className="panel-body">
            <div className="mb-3">
              <h5>IV. ການຕິດຕາມໜີ້</h5>
            </div>

            <div className="row fs-15px">
              <div className="col-sm-4 col-6 mb-2">
                <label htmlFor="" className='form-label'>ບໍລິສັດປະກັນໄພ</label>
                <select className='form-select' defaultValue={inputs.status_company} onChange={(e) => handelChange('status_company', e.target.value)}>
                  <option value="1">ຄ້າງຈ່າຍ</option>
                  <option value="2">ຈ່າຍແລ້ວ</option>
                </select>
              </div>
              <div className="col-sm-4 col-6 mb-2">
                <label htmlFor="" className='form-label'>ຕົວແທນ</label>
                <select className='form-select' value={inputs.status_agent} onChange={(e) => handelChange('status_agent', e.target.value)} >
                  <option value="1">ຄ້າງຈ່າຍ</option>
                  <option value="2">ຈ່າຍແລ້ວ</option>
                </select>
              </div>
              <div className="col-sm-4 col-6 mb-2">
                <label htmlFor="" className='form-label'>OAC</label>
                <select className='form-select' value={inputs.status_oac} onChange={(e) => handelChange('status_oac', e.target.value)}>
                  <option value="1">ຄ້າງຮັບ</option>
                  <option value="2">ຮັບແລ້ວ</option>
                </select>
              </div>
              <div className="col-sm-4 col-6 mb-2">
                <label htmlFor="" className='form-label'>ວັນທີຈ່າຍ</label>
                <DatePicker oneTap format="dd/MM/yyyy" value={inputs.company_date} onChange={(e) => handelChange('company_date', e)} placeholder='ວັນທີຈ່າຍ' placement={"autoVerticalStart"} required block />
              </div>
              <div className="col-sm-4 col-6 mb-2">
                <label htmlFor="" className='form-label'>ວັນທີຈ່າຍ</label>
                <DatePicker oneTap format="dd/MM/yyyy" value={inputs.agent_date} onChange={(e) => handelChange('agent_date', e)} placeholder='ວັນທີຈ່າຍ' placement={"auto"} required block />
              </div>
              <div className="col-sm-4 col-6 mb-2">
                <label htmlFor="" className='form-label'>ວັນທີຮັບ-ຈ່າຍ</label>
                <DatePicker oneTap format="dd/MM/yyyy" value={inputs.oac_date} onChange={(e) => handelChange('oac_date', e)} placeholder='ວັນທີຈ່າຍ' placement={"autoVerticalStart"} required block />
              </div>
            </div>

            <div className="row mt-4 mb-3">
              <div className="col-6">
                <Button color="red" appearance="primary" startIcon={<i className="fa-solid fa-rotate" />} block>ເລີ່ມໃໝ່</Button>
              </div>
              <div className="col-6">
                <Button type='submit' color="blue" appearance="primary" startIcon={<i className='fas fa-save' />} block> ບັນທຶກ</Button>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}
