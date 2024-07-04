import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Input, InputNumber, SelectPicker, InputGroup, DatePicker, Button, InputPicker } from 'rsuite';
import { useAgent, useCompany, useType, useTypeCar, useBrandCar, useVersion,useProvince,useCurrency } from '../../config/select-option';
import Select from 'react-select'
import { Config, imageUrl } from '../../config/connenct';
import axios from 'axios';
import numeral from 'numeral';
import Alert from '../../utils/config';

export default function FormEditInsurance() {
    const api = Config.urlApi;
  const url = imageUrl.url;
  const itemAg = useAgent();
  const itemcn = useCompany();
  const itemType = useType();
  const itemTypeCar = useTypeCar();
  const itemBrand = useBrandCar();
  const itemVersion = useVersion();
  const location = useLocation();
  const itemPv=useProvince();
  const itemCry=useCurrency();
  const searchParams = new URLSearchParams(location.search);
  const Id = atob(searchParams.get('id'));


  //===========================

  const gender = [{
    label: 'ເພດຍິງ',
    value: 'F'
  },
  {
    label: 'ເພດຊາຍ',
    value: 'M'
  }]

  const [itemDistrict, setItemDistrict] = useState([]);
  const handelShowDist = async (value) => {
    try {
      const response = await fetch(api+`district/pv/${value}`);
      const jsonData = await response.json();
      setItemDistrict(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  const dataDist = itemDistrict.map(item => ({ label: item.district_name, value: item.district_id }));


  const [typeInsurance, setTypeInsurance] = useState(2);
  const [inputs, setInputs] = useState({
    incuranecCode: '',
    custom_id_fk: '',
    company_id_fk: '',
    agent_id_fk: '',
    insurance_type_fk: '',
    option_id_fk: '',
    currency_id_fk:22001,
    contract_number: '',
    contract_start_date: '',
    contract_end_date: '',
    user_fname: '',
    user_lname: '',
    user_gender: 'F',
    user_dob: '',
    user_tel: '',
    user_district_fk: '',
    user_village: '',
    file_doct: '',

    // ----------- ຂໍມູນລົດ
    statusIns: '',
    car_type_id_fk: '',
    car_brand_id_fk: '',
    car_version_id_fk: '',
    car_registration: '',
    vehicle_number: '',
    tank_number: '',
    // ---------- ຂໍ້ມູນຄ່າປະກັນໄພ
    initial_fee: '',
    percent_taxes: '7',
    money_taxes: '',
    registration_fee: '0',
    insuranc_included: '',
    precent_incom: '',
    pre_tax_profit: '',
    percent_akorn: '5',
    incom_money: '',
    incom_finally: '',
    percent_eps: '',
    pays_advance_fee: '',
    percent_fee_eps: '5',
    money_percent_fee: '',
    expences_pays_taxes: '',
    net_income: '',
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
  }
  
  const showDataInsurance = async () => {
    try {
      const response = await fetch(api + `insurance/${Id}`);
      const data = await response.json();
      if(data.user_province_id){
        handelShowDist(data.user_province_id)
      }
      setTypeInsurance(data.status_ins);
      setInputs({
        incuranecCode: data.incuranec_code,
        custom_id_fk: data.custom_id_fk,
        company_id_fk: data.company_id_fk,
        agent_id_fk: data.agent_id_fk,
        insurance_type_fk: data.insurance_type_fk,
        option_id_fk: data.option_id_fk,
        currency_id_fk:data.currency_id_fk,
        contract_number: data.contract_number,
        contract_start_date: new Date(data.contract_start_date),
        contract_end_date: new Date(data.contract_end_date),
        user_fname: data.user_fname,
        user_lname: data.user_lname,
        user_gender: data.user_gender,
        user_dob: new Date(data.user_dob),
        user_tel: data.user_tel,
        user_province_id:data.user_province_id,
        user_district_fk: data.user_district_fk,
        user_village: data.user_village,
        file_doct: '',
    
        // ----------- ຂໍມູນລົດ
        statusIns: data.statusIns,
        car_type_id_fk: data.car_type_id_fk,
        car_brand_id_fk: data.car_brand_id_fk,
        car_version_id_fk: data.car_version_id_fk,
        car_registration: data.car_registration,
        vehicle_number: data.vehicle_number,
        tank_number: data.tank_number,
        // ---------- ຂໍ້ມູນຄ່າປະກັນໄພ
        initial_fee: data.initial_fee,
        percent_taxes: data.percent_taxes,
        money_taxes: data.money_taxes,
        registration_fee: data.registration_fee,
        insuranc_included: data.insuranc_included,
        precent_incom: data.precent_incom,
        pre_tax_profit: data.pre_tax_profit,
        percent_akorn: data.percent_akorn,
        incom_money: data.incom_money,
        incom_finally: data.incom_finally,
        percent_eps: data.percent_eps,
        pays_advance_fee: data.pays_advance_fee,
        percent_fee_eps: data.percent_fee_eps,
        money_percent_fee: data.money_percent_fee,
        expences_pays_taxes: data.expences_pays_taxes,
        net_income: data.net_income,
        status_company: data.status_company,
        company_date: new Date(data.company_date),
        status_agent: data.status_agent,
        agent_date: new Date(data.agent_date),
        status_oac: data.status_oac,
        oac_date: new Date(data.oac_date)
      })
      setInitialFee(parseInt(data.initial_fee));
      setPercentTaxes(data.percent_taxes);
      setRegistrationFee(parseInt(data.registration_fee));
      setTaxProfit(data.precent_incom);
      stePercentAkorn(data.percent_akorn)
      setPercentEps(parseInt(data.percent_eps));
      setPcfeeEps(data.percent_fee_eps);
      handleOption(data.insurance_type_fk)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const imputData=new FormData();
    for(const key in inputs){
        imputData.append(key,inputs[key])
    }
    try {
      axios.post(api + 'insurance/create', imputData)
        .then(function (respones) {
          if (respones.status === 200) {
            // Alert.successData(respones.data.message)
            Alert.Successlocation('/report');
          } else {
            Alert.errorData(respones.data.error)
          }
        });
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  }

  const [itemOption, setItemOption] = useState([]);
  const handleOption = async (value) => {
    try {
      const response = await fetch(api + `options/t/${value}`);
      const jsonData = await response.json();
      setItemOption(jsonData);

      await showType(value); // Ensure showType is awaited here
    } catch (error) {
      console.error('Error fetching data:', error);
    }   
  };

  const showType = async (value) => {
    try {
      const res = await fetch(api + 'type-ins/' + value);
      const jsonType = await res.json();
      setTypeInsurance(jsonType.status_ins);
      setInputs((prevInputs) => ({
        ...prevInputs,
        statusIns: jsonType.status_ins,
      }));
    } catch (error) {
      console.error('Error fetching type:', error);
    }
  };

  const dataOption = itemOption.map(item => ({ label: item.options_name, value: item.options_Id }));


  const [initialFee, setInitialFee] = useState(0);//---- ຄ່າທຳນຽມເບື້ອງຕົ້ນ
  const [percentTaxes, setPercentTaxes] = useState(7);
  const moneyTaxes = (initialFee * percentTaxes) / 100;

  const [registrationFee, setRegistrationFee] = useState(0)
  const insurancIncluded = numeral(parseInt(initialFee) + parseInt(moneyTaxes) + parseInt(registrationFee)).format('0,00');

  // -------------------- ຄ່າຄອມຮັບ
  const [taxProfit, setTaxProfit] = useState(0);//----ເປີເຊັນຮັບ 
  const [percentAkorn, stePercentAkorn] = useState(5)
  const precentIncom = (initialFee * taxProfit) / 100; //----- ຄອມກ່ອນອາກອນ

  const incomMoney = (precentIncom * percentAkorn) / 100; //-- ອ.ກ ລາຍໄດ້  (ຄອມຮັບ)
  const incomFinally = (precentIncom - incomMoney) //-- ຄອມຫຼັງຫັກອາກອນ
  //-------------------- ຄ່າຄອມຈ່າຍ
  const [percentEps, setPercentEps] = useState(0); //-------ເປີເຊັນຈ່າຍ
  const advanceFee = (initialFee * percentEps) / 100; //-------ຄອມຈ່າຍກ່ອນອາກອນ
  const [pcfeeEps, setPcfeeEps] = useState(5); //---ອ/ກ.ຈ່າຍ
  const moneyPsFee = (advanceFee * pcfeeEps) / 100; //---ອ.ກ ລາຍໄດ້ (ຄອມຈ່າຍ)
  const expencesTaxes = (advanceFee - moneyPsFee);  //----ຄອມຈ່າຍຫຼັງຫັກອາກອນ
  const netIncome = (incomFinally - expencesTaxes);//--ລາຍຮັບສຸທິ
  const onkeyup_premiums = (name, value) => {
    const values = parseFloat(value.replace(/,/g, ''));
    setInputs({
      ...inputs, [name]: value
    })
    if (name === 'initial_fee') {
      setInitialFee(isNaN(values) ? 0 : parseInt(values));
    } else if (name === 'percent_taxes') {
      setPercentTaxes(values)
    } else if (name === 'registration_fee') {
      setRegistrationFee(isNaN(values) ? 0 : parseInt(values))
    }
    else if (name === 'precent_incom') {
      setTaxProfit(values)
    } else if (name === 'percent_akorn') {
      stePercentAkorn(values)
    } else if (name === 'percent_eps') {
      setPercentEps(values);
    } else if (name === 'percent_fee_eps') {
      setPcfeeEps(values)
    }
  }

  const [fileName, setFileName] = useState('');
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setInputs({
        ...inputs,file_doct:file
      })
      setFileName(file.name);
      const reader = new FileReader();
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    showDataInsurance();
  }, []);
  return (
    <div id="content" className="app-content">
      <ol className="breadcrumb float-end">
        <li className="breadcrumb-item">ໜ້າຫຼັກ</li>
        <li className="breadcrumb-item active">ຟອມແກ້ໄຂສັນຍາຊື້ປະກັນໄພ</li>
      </ol>
      <h3 className="page-header fs-20px"><Link to={'/report'} className='me-3 text-danger' ><i class="fa-solid fa-circle-arrow-left"></i></Link> ຟອມແກ້ໄຂສັນຍາຊື້ປະກັນໄພ </h3>
      <form onSubmit={handleSubmit}>
        <div className="panel  border-4 border-top border-red rounded-top-4">
          <div className="panel-body ">

            <div className='mb-3'>
              <h5 className='text-blue'><i class="fa-solid fa-user-pen"></i> ຂໍ້ມູນສັນຍາຊື້ປະກັນໄພ</h5>
            </div>
            <div className="row fs-15px mb-4">
              <div className="col-sm-6 mb-2">
                <label htmlFor="" className='form-label'>ບໍລິສັດປະກັນໄພ </label>
                <SelectPicker data={itemcn} value={inputs.company_id_fk} onChange={(e) => handelChange('company_id_fk', e)} placeholder={'ບໍລິສັດປະກັນໄພ'} block required />
              </div>
              <div className="col-sm-6  mb-2">
                <label htmlFor="" className='form-label'>ຕົວແທນຂາຍປະກັນ</label>
                <SelectPicker data={itemAg} value={inputs.agent_id_fk}  onChange={(e) => handelChange('agent_id_fk', e)} placeholder={'ຕົວແທນຂາຍ'} block required />
              </div>
              <div className="col-sm-6  mb-2">
                <label htmlFor="" className='form-label'>ປະເພດປະກັນໄພ </label>
                <SelectPicker data={itemType} value={inputs.insurance_type_fk} onChange={(e) => handleOption(e)} placeholder={'ປະເພດປະກັນ'} block required />
              </div>
              <div className="col-sm-6  mb-2">
                <label htmlFor="" className='form-label'>ທາງເລືອກ </label>
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
                <h5>ຂໍ້ມູນຜູ້ທີ່ໄດ້ຮັບຄວາມຄຸ້ມຄອງ</h5>
              </span>
            </div>
            <div id="collapseOne" class={`accordion-collapse collapse ${inputs.type_buyer_fk==='2201'?'show':''}`} data-bs-parent="#accordion">
              <div className="accordion-body row fs-15px">
                <div className="col-sm-1 col-6 mb-2">
                  <label htmlFor="" className='form-label'>ເພດ</label>
                  <InputPicker data={gender}  defaultValue={'F'} onChange={(e) => handelChange('user_gender', e)} placeholder="ເລືອກ" />
                </div>
                <div className="col-sm-4 col-6 mb-2">
                  <label htmlFor="" className='form-label'>ຊື່ແທ້</label>
                  <Input value={inputs.user_fname} onChange={(e) => handelChange('user_fname', e)} placeholder="ຊື່ແທ້" />
                </div>
                <div className="col-sm-4 col-6 mb-2">
                  <label htmlFor="" className='form-label'>ນາມສະກຸນ</label>
                  <Input value={inputs.user_lname} onChange={(e) => handelChange('user_lname', e)} placeholder="ນາມສະກຸນ" />
                </div>
                <div className="col-sm-3 col-6 mb-2">
                  <label htmlFor="" className='form-label'>ວັນເດືອນປີເກິດ</label>
                  <DatePicker format='dd/MM/yyyy' value={inputs.user_dob}  oneTap block onChange={(e) => handelChange('user_dob', e)} placeholder="ເລືອກ" />
                </div>
                <div className="col-sm-3 col-6 mb-2">
                  <label htmlFor="" className='form-label'>ແຂວງ {inputs.user_province_id}</label>
                  <SelectPicker data={itemPv} defaultValue={inputs.user_province_id} onChange={(e) => handelShowDist(e)} placeholder='ເລືອກ' block />
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
                  <Select options={itemTypeCar} value={itemTypeCar.find(obj => obj.value === inputs.car_type_id_fk)} onChange={(e) => handelChange('car_type_id_fk', e.value)} placeholder="ເລືອກ" />
                </div>
                <div className="col-sm-4 col-6 mb-2">
                  <label htmlFor="" className='form-label'>ຢີ່ຫໍ້ລົດ</label>
                  <Select options={itemBrand} value={itemBrand.find(obj => obj.value === inputs.car_brand_id_fk)} onChange={(e) => handelChange('car_brand_id_fk', e.value)} placeholder="ເລືອກ" />
                </div>
                <div className="col-sm-4 col-6 mb-2">
                  <label htmlFor="" className='form-label'>ລຸ່ນລົດ</label>
                  <Select options={itemVersion} value={itemVersion.find(obj => obj.value === inputs.car_version_id_fk)} onChange={(e) => handelChange('car_version_id_fk', e.value)} placeholder="ເລືອກ" />
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
              <h5>I. ຄ່າທຳນຽມທັງໝົດ</h5>
            </div>

            <div className="row fs-15px">
              <div className="col-sm-3 col-6 mb-2">
                <label htmlFor="" className='form-label'>ຄ່າທຳນຽມເບື້ອງຕົ້ນ</label>
                <Input value={numeral(inputs.initial_fee).format('0,00')} onChange={(e) => onkeyup_premiums('initial_fee', e)} placeholder='xxx xxxx' block required />
              </div>
              <div className="col-sm-1 col-6 mb-2">
                <label htmlFor="" className='form-label'>ອາກອນ</label>
                <InputNumber value={inputs.percent_taxes} onChange={(e) => onkeyup_premiums('percent_taxes', e)} block placeholder='0.%' required />
              </div>
              <div className="col-sm-2 col-6 mb-2">
                <label htmlFor="" className='form-label'>ຄ່າອາກອນ {inputs.percent_taxes}%</label>
                <Input value={inputs.money_taxes = numeral(moneyTaxes).format('0,00')} placeholder='00.000' className='bg-teal-100' block readOnly />
              </div>
              <div className="col-sm-3 col-6 mb-2">
                <label htmlFor="" className='form-label'>ຄ່າລົງທະບຽນ </label>
                <Input value={numeral(inputs.registration_fee).format('0,00')} onChange={(e) => onkeyup_premiums('registration_fee', e)} placeholder='00.000' block required />
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
                <label htmlFor="" className='form-label'>ເປີເຊັນ ຮັບ</label>
                <InputNumber value={inputs.precent_incom} onChange={(e) => onkeyup_premiums('precent_incom', e)} placeholder='0.%' block required />
              </div>
              <div className="col-sm-3 col-6 mb-2">
                <label htmlFor="" className='form-label'>ຄອມກ່ອນອາກອນ {inputs.pre_tax_profit}</label>
                <Input value={inputs.pre_tax_profit = numeral(precentIncom).format('0,00')} placeholder='00.000' className='bg-lime-100' block readOnly />
              </div>
              <div className="col-sm-2 col-6 mb-2">
                <label htmlFor="" className='form-label'>ອ/ກ.ຮ  </label>
                <InputNumber value={inputs.percent_akorn} onChange={(e) => onkeyup_premiums('percent_akorn', e)} placeholder='0.%' block required />
              </div>
              <div className="col-sm-2 col-6 mb-2">
                <label htmlFor="" className='form-label'>ອ.ກ ລາຍໄດ້ {inputs.percent_akorn}% (ຄອມຮັບ)</label>
                <Input value={inputs.incom_money = numeral(incomMoney).format('0,00')} placeholder='00.000' className='bg-lime-100' block readOnly />
              </div>
              <div className="col-sm-3 col-6 mb-2">
                <label htmlFor="" className='form-label'>ຄອມຫຼັງຫັກອາກອນ </label>
                <Input value={inputs.incom_finally = numeral(incomFinally).format('0,00')} placeholder='00.000' className='bg-lime-100' block readOnly />
              </div>
            </div>

            <div className="mb-3">
              <h5>II. ລາຍຈ່າຍຄ່າຄອມ</h5>
            </div>
            <div className="row fs-15px">
              <div className="col-sm-2 col-6 mb-2">
                <label htmlFor="" className='form-label'>ເປີເຊັນ ຈ່າຍ</label>
                <InputNumber value={inputs.percent_eps} onChange={(e) => onkeyup_premiums('percent_eps', e)} placeholder='0.%' block required />
              </div>
              <div className="col-sm-3 col-6 mb-2">
                <label htmlFor="" className='form-label'>ຄອມຈ່າຍກ່ອນອາກອນ</label>
                <Input value={inputs.pays_advance_fee = numeral(advanceFee).format(0.00)} placeholder='00.000' className='bg-orange-100' block readOnly />
              </div>
              <div className="col-sm-2 col-6 mb-2">
                <label htmlFor="" className='form-label'>ອ/ກ.ຮ {inputs.percent_fee_eps}% </label>
                <InputNumber value={inputs.percent_fee_eps} onChange={(e) => onkeyup_premiums('percent_fee_eps', e)} placeholder='0.%' block required />
              </div>
              <div className="col-sm-2 col-6 mb-2">
                <label htmlFor="" className='form-label'>ອ.ກ ລາຍໄດ້ {inputs.percent_fee_eps}% (ຄອມຈ່າຍ)</label>
                <Input value={inputs.money_percent_fee = numeral(moneyPsFee).format('0,00')} placeholder='00.000' className='bg-orange-100' block readOnly />
              </div>
              <div className="col-sm-3 col-6 mb-2">
                <label htmlFor="" className='form-label'>ຄອມຈ່າຍຫຼັງຫັກອາກອນ </label>
                <Input value={inputs.expences_pays_taxes = numeral(expencesTaxes).format('0,00')} placeholder='00.000' className='bg-orange-100' block readOnly />
              </div>

              <div className="col-sm-4 col-6 mt-4 text-center">
                <label htmlFor="" className='form-label'>ລາຍຮັບສຸທິ </label>
                <Input value={inputs.net_income = numeral(netIncome).format('0,00')} placeholder='00.000' size="lg" className='bg-green-100 text-center' block readOnly />
              </div>
              <div className="col-sm-3 col-6 mt-4">
                <label htmlFor="" className='form-label'>ສະກຸນ </label>
                <InputPicker defaultValue={inputs.currency_id_fk} data={itemCry} onChange={(e) => handelChange('currency_id_fk', e)} block/>
              </div>
              <div className="col-sm-5 mt-4 ">
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
