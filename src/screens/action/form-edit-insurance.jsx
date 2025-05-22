import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { Input, InputNumber, SelectPicker, InputGroup, DatePicker, Button, InputPicker } from 'rsuite';
import { useAgent, useCompany, useType, useTypeCar, useBrandCar,  useCurrency } from '../../config/select-option';
import Select from 'react-select'
import { Config } from '../../config/connenct';
import axios from 'axios';
import numeral from 'numeral';
import Alert from '../../utils/config';
import moment from 'moment';
export default function FormEditInsurance() {
  const api = Config.urlApi;
  const itemAg = useAgent();
  const itemcn = useCompany();
  const itemType = useType();
  const itemTypeCar = useTypeCar();
  const itemBrand = useBrandCar();
  const location = useLocation();
  const itemCry = useCurrency();
  const searchParams = new URLSearchParams(location.search);
  const Id = atob(searchParams.get('id'));


  //============fetchComission===============
  const fetchComission = async (companyId, agentId, typeinsId) => {
    try {
      const response = await axios.post(`${api}comisget/single`, {
        companyId: companyId,
        agentId: agentId,
        typeinsId: typeinsId
      });
      const jsonData = response.data;
      // console.log('Commission data received:', jsonData);

      setInputs((prevInputs) => ({
        ...prevInputs,
        precent_incom: jsonData.percentGet,
        percent_eps: jsonData.percentPay,
      }));
    } catch (error) {
      console.error('Error fetching commission data:', error);
    }
  };



  const [typeInsurance, setTypeInsurance] = useState(2);
  const [inputs, setInputs] = useState({});
  const showDataInsurance = async () => {
    try {
      const response = await fetch(api + `insurance/${Id}`);
      const data = await response.json();
      setTypeInsurance(data.status_ins);
      setInputs({
        incuranecCode: data.incuranec_code,
        custom_id_fk: data.custom_id_fk,
        company_id_fk: data.company_id_fk,
        agent_id_fk: data.agent_id_fk,
        insurance_type_fk: data.insurance_type_fk,
        option_id_fk: data.option_id_fk,
        currency_id_fk: data.currency_id_fk,
        contract_number: data.contract_number,
        contract_number2: data.contract_number,
        contract_start_date: new Date(data.contract_start_date),
        contract_end_date: new Date(data.contract_end_date),
        user_fname: data.user_fname,
        user_lname: data.user_lname,
        user_gender: data.user_gender,
        user_dob: new Date(data.user_dob),
        user_tel: data.user_tel,
        user_province_id: data.user_province_id,
        user_district_fk: data.user_district_fk,
        user_village: data.user_village,
        file_doct: '',

        // ----------- ຂໍມູນລົດ
        statusIns: data.statusIns,
        car_type_id_fk: data.car_type_id_fk,
        car_brand_id_fk: data.car_brand_id_fk,
        version_name: data.version_name,
        car_registration: data.car_registration,
        vehicle_number: data.vehicle_number,
        tank_number: data.tank_number,
        // ---------- ຂໍ້ມູນຄ່າປະກັນໄພ
        initial_fee: data.initial_fee,//c
        percent_taxes: data.percent_taxes === '' ? 0 : data.percent_taxes,//cc
        registration_fee: data.registration_fee,//c
        insuranc_included: data.insuranc_included,//c
        precent_incom: data.precent_incom,//c
        percent_akorn: data.percent_akorn,//c
        percent_eps: data.percent_eps,//c
        percent_fee_eps: data.percent_fee_eps,//c
        status_company: data.status_company,
        company_date: new Date(data.company_date),
        status_agent: data.status_agent,
        agent_date: new Date(data.agent_date),
        status_oac: data.status_oac,
        oac_date: new Date(data.oac_date)
      })
      // setValueComis({
      //   companyId:data.custom_id_fk,
      //   agentId:data.agent_id_fk,
      //   typeinsId:data.insurance_type_fk
      // })

      // toThousands(data.initial_fee)
      setInitialFee(parseInt(data.initial_fee)); // c
      setPercentTaxes(data.percent_taxes);//c
      setRegistrationFee(parseInt(data.registration_fee));//c
      // setTaxProfit(data.precent_incom);//c
      // stePercentAkorn(data.percent_akorn)//c
      // setPercentEps(parseInt(data.percent_eps));//c
      // setPcfeeEps(data.percent_fee_eps);//c
      await handleOption(data.insurance_type_fk);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };



  const [itemOption, setItemOption] = useState([]);
  const handleOption = async (value) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      insurance_type_fk: value,
    }));
    fetchComission(inputs.company_id_fk, inputs.agent_id_fk, value);
    try {
      const response = await fetch(api + `options/t/${value}`);
      const jsonData = await response.json();
      setItemOption(jsonData);

      const res = await fetch(api + 'type-ins/' + value);
      const jsonType = await res.json();
      setTypeInsurance(jsonType.status_ins);
      setInputs((prevInputs) => ({
        ...prevInputs,
        statusIns: jsonType.status_ins,
      }));
      await fetchComission(inputs.company_id_fk, inputs.agent_id_fk, value);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const dataOption = itemOption.map(item => ({ label: item.options_name, value: item.options_Id, percent: item.option_vat }));


  const handelChange = (name, value) => {
    setInputs({
      ...inputs, [name]: value
    })

    if (name === 'company_id_fk') {
      fetchComission(value, inputs.agent_id_fk, inputs.insurance_type_fk);
    } else if (name === 'agent_id_fk') {
      fetchComission(inputs.company_id_fk, value, inputs.insurance_type_fk);
    } else if (name === 'insurance_type_fk') {
      fetchComission(inputs.company_id_fk, inputs.agent_id_fk, value);
    }

    if (name === 'contract_start_date') {
       const nextYear = moment(value).add(1, 'year').toDate();
      setInputs({
        ...inputs,
        contract_start_date:new Date(value),
        contract_end_date: new Date(nextYear),
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


  //==================================

  const [initialFee, setInitialFee] = useState(0);//---- ຄ່າທຳນຽມເບື້ອງຕົ້ນ c
  const [percentTaxes, setPercentTaxes] = useState(10);//c
  const moneyTaxes = (initialFee * percentTaxes) / 100;

  const [registrationFee, setRegistrationFee] = useState(0)//c

  const insurancIncluded = numeral(parseFloat(initialFee) + parseFloat(moneyTaxes) + parseFloat(registrationFee)).format('0,00.00');

  // -------------------- ຄ່າຄອມຮັບ
  // const [taxProfit, setTaxProfit] = useState(0);//----ເປີເຊັນຮັບ c
  // const [percentAkorn, stePercentAkorn] = useState(5)//c
  // const precentIncom = (initialFee * taxProfit) / 100; //----- ຄອມກ່ອນອາກອນ

  // const incomMoney = (precentIncom * percentAkorn) / 100; //-- ອ.ກ ລາຍໄດ້  (ຄອມຮັບ)
  // const incomFinally = (precentIncom - incomMoney) //-- ຄອມຫຼັງຫັກອາກອນ
  //-------------------- ຄ່າຄອມຈ່າຍ
  // const [percentEps, setPercentEps] = useState(0); //-------ເປີເຊັນຈ່າຍ c
  // const advanceFee = (initialFee * percentEps) / 100; //-------ຄອມຈ່າຍກ່ອນອາກອນ
  // const [pcfeeEps, setPcfeeEps] = useState(5); //---ອ/ກ.ຈ່າຍ c

  // const moneyPsFee = (advanceFee * pcfeeEps) / 100; //---ອ.ກ ລາຍໄດ້ (ຄອມຈ່າຍ)
  // const expencesTaxes = (advanceFee - moneyPsFee);  //----ຄອມຈ່າຍຫຼັງຫັກອາກອນ
  // const netIncome = (incomFinally - expencesTaxes);//--ລາຍຮັບສຸທິ



  const onkeyup_premiums = (name, value) => {
    // const values = value ? value.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : value;
    const values = isNaN(value) ? 0 : value
    setInputs({
      ...inputs, [name]: values
    })

    if (name === 'initial_fee') {
      toThousands(values)
      setInitialFee(values);
    }
    if (name === 'percent_taxes') {
      setPercentTaxes(values)
    }
    if (name === 'registration_fee') {
      toThousandsFee(values)
      setRegistrationFee(values)
    }

  }

  //============ select file doct ===============
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


  //================= insert to data database
  const handleSubmit = (event) => {
    event.preventDefault();
    const imputData = new FormData();
    for (const key in inputs) {
      imputData.append(key, inputs[key])
    }
    try {
      axios.post(api + 'insurance/create', imputData)
        .then(function (respones) {
          if (respones.status === 200) {
            Alert.Successlocation('/report');
          } else if(respones.status === 201){
            Alert.infoData(respones.data.message)
          }else {
            Alert.errorData(respones.data.message)
          }
        });
    } catch (error) {
      Alert.errorData(error)
      console.error('Error inserting data:', error);
    }
  }

  function toThousands(value) {
    return value ? `${value}`.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : value;
  }
  function toThousandsFee(value){
    return value ? `${value}`.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : value;
  }
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
                <SelectPicker data={itemAg} value={inputs.agent_id_fk} onChange={(e) => handelChange('agent_id_fk', e)} placeholder={'ຕົວແທນຂາຍ'} block required />
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
                <label htmlFor="" className='form-label'>ວັນທີເລີມສັນຍາ </label>
                <DatePicker oneTap format="dd/MM/yyyy" value={inputs.contract_start_date} onChange={(e) => handelChange('contract_start_date', e)} placeholder='ວັນທີເລີມ' block required />
              </div>
              <div className="col-sm-4  mb-2">
                <label htmlFor="" className='form-label'>ວັນທີສິນສຸດສັນຍາ</label>
                <DatePicker oneTap format="dd/MM/yyyy" value={inputs.contract_end_date} onChange={(e) => handelChange('contract_end_date', e)} placeholder='ວັນທີສິນສຸດ' block required />
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
                  <Input value={inputs.version_name} onChange={(e) => handelChange('version_name', e)} placeholder='ລຸ່ນລົດ' />
                  {/* <Select options={itemVersion} value={itemVersion.find(obj => obj.value === inputs.car_version_id_fk)} onChange={(e) => handelChange('car_version_id_fk', e.value)} placeholder="ເລືອກ" /> */}
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
                <label htmlFor="" className='form-label'>ຄ່າທຳນຽມເບື້ອງຕົ້ນ </label>
                <InputNumber value={inputs.initial_fee} formatter={toThousands} onChange={(e) => onkeyup_premiums('initial_fee', e)} placeholder='xxx xxxx' block required />
              </div>
              <div className="col-sm-2 col-6 mb-2">
                <label htmlFor="" className='form-label'>ອາກອນ {inputs.percent_taxes}</label>
                <InputNumber value={inputs.percent_taxes} onChange={(e) => onkeyup_premiums('percent_taxes', e)} block placeholder='0.%' required />
              </div>
              <div className="col-sm-3 col-6 mb-2">
                <label htmlFor="" className='form-label'>ຄ່າລົງທະບຽນ </label>
                <InputNumber value={inputs.registration_fee} formatter={toThousandsFee} onChange={(e) => onkeyup_premiums('registration_fee', e)} placeholder='00.000' block required />
              </div>
              <div className="col-sm-4 col-6 mb-2">
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
              <div className="col-sm-2 col-6 mb-2">
                <label htmlFor="" className='form-label'>ອ/ກ.ຮ  </label>
                <InputNumber value={inputs.percent_akorn} onChange={(e) => onkeyup_premiums('percent_akorn', e)} placeholder='0.%' block required />
              </div>
              <div className="col-sm-2 col-6 mb-2">
                <label htmlFor="" className='form-label'>ເປີເຊັນ ຈ່າຍ</label>
                <InputNumber value={inputs.percent_eps} onChange={(e) => onkeyup_premiums('percent_eps', e)} placeholder='0.%' block required />
              </div>
              <div className="col-sm-2 col-6 mb-2">
                <label htmlFor="" className='form-label'>ອ/ກ.ຮ {inputs.percent_fee_eps}% </label>
                <InputNumber value={inputs.percent_fee_eps} onChange={(e) => onkeyup_premiums('percent_fee_eps', e)} placeholder='0.%' block required />
              </div>
              <div className="col-sm-3 col-6 mb-2">
                <label htmlFor="" className='form-label'>ສະກຸນເງິນ</label>
                <InputPicker value={inputs.currency_id_fk} data={itemCry} onChange={(e) => handelChange('currency_id_fk', e)} block />
              </div>
              <div className="col-sm-6 mt-4 ">
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
