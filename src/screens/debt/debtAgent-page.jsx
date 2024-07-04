import React, { useState, useEffect } from 'react'
import { DatePicker, SelectPicker, Placeholder, Loader,Modal,Button,Input } from 'rsuite'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Config } from '../../config/connenct';
import moment from 'moment';
import numeral from 'numeral';
import Alert from '../../utils/config';
import { useCompany, useAgent } from '../../config/select-option';
export default function DebtAgent() {
    const api = Config.urlApi;
    const itemCompay = useCompany();
    const itemAgent = useAgent();

    const [data, setData] = useState({
        start_date: '',
        end_date: '',
        company_id_fk: '',
        agent_id_fk: '',
        status_pay: '1'
    })
    const handleChange = (name, value) => {
        setData({
            ...data, [name]: value
        })
    }
    const [isLoading, setIsLoading] = useState(true)
    const [itemData, setItemData] = useState([]);
    const [filter, setFilter] = useState([]);
    const fetchReport = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(api + 'debt/agent', data);
            setItemData(response.data);
            setFilter(response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }

    };
    const Filter = (event) => {
        setItemData(filter.filter(n => n.contract_number.toLowerCase().includes(event)))
    }
    const [sum, steSum] = useState({})
    const [loading, setLoading] = useState(true)
    const showTotalDebt = async () => {
        try {
            const response = await fetch(api + `debt/sum`);
            const jsonData = await response.json();
            steSum(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    //======================
    const [show, setShow] = useState(false);
    const handleShow = (index) => {
        setShow(index);
    }
    const [debt, setDdebt] = useState({})
    const handlePayDebt = (data) => {
        setShow(true);
        setDdebt(data)
        setInputs({
            ...inputs, 
            contract_code_fk: data.incuranec_code,
            contract_no: data.contract_number,
        })
    }

    const [inputs, setInputs] = useState({
        contract_code_fk: '',
        contract_no: '',
        doccm_file: '',
        status_pay: 1,
        status_doc: 2,
        debt_remark: '',
        doccm_date: new Date()
    });

    const handleChangeDate = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        })
    }

    const [fileName, setFileName] = useState('');
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            setInputs({
                ...inputs, doccm_file: file
            })
        } else {
            setFileName('');
        }
    };
    const closeFile = () => {
        setFileName('');
        setInputs({
            doccm_file: ''
        })
    }
const handleSubmit =(event)=>{
    event.preventDefault();
    const imputData=new FormData();
  for(const key in inputs){
      imputData.append(key,inputs[key])
  }
  try {
    axios.post(api + 'pays/create', imputData)
      .then(function (respones) {
        if (respones.status === 200) {
            fetchReport();
            showTotalDebt();
            setShow(false);
          Alert.successData(respones.data.message)
        } else {
          Alert.errorData(respones.data.error)
        }
      });
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

 // ================================
 const sumData = itemData.reduce((acc, item) => {
    const currency = item.currency_name;
    if (!acc[currency]) {
        acc[currency] = {
            initial_fee: 0,
            pays_advance_fee: 0,
            money_percent_fee: 0,
            expences_pays_taxes: 0
        };
    }

    acc[currency].initial_fee += parseFloat(item.initial_fee);
    acc[currency].pays_advance_fee += parseFloat(item.pays_advance_fee);
    acc[currency].money_percent_fee += parseFloat(item.money_percent_fee);
    acc[currency].expences_pays_taxes += parseFloat(item.expences_pays_taxes);

    return acc;
}, {});
const formatNumber = (num) => numeral(num).format('0,00');


    useEffect(() => {
        fetchReport();
        showTotalDebt();
    }, [data])
    return (
        <div id="content" className="app-content">
            <ol className="breadcrumb float-end">
                <li className="breadcrumb-item">ໜ້າຫຼັກ</li>
                <li className="breadcrumb-item active">ລາຍການໜີ້</li>
            </ol>
            <h3 className="page-header fs-20px">ຂໍ້ມູນໜີ້ທັງໝົດ</h3>

            <div class="row">
                <div class="col-xl-4 col-md-6">
                    <div class="widget widget-stats bg-orange">
                        <div class="stats-icon text-white"><i class="fa-solid fa-wallet" /></div>
                        <div class="stats-info">
                            <h4 className='fs-16px'>ໜີ້ຄ້າງຈ່າຍບໍລິສັດປະກັນໄພ</h4>
                            {loading === true ? (
                                <Loader size="md" content="ກຳລັງໂຫລດ..." />
                            ) : (
                                <p>{numeral(sum.insuranc_included).format('0,00')} kip</p>
                            )}
                        </div>
                        <div class="stats-link">
                            <Link to={'/debt'}>ເບີ່ງລາຍລະອຽດ <i class="fa fa-arrow-alt-circle-right"></i></Link>
                        </div>
                    </div>
                </div>

                <div class="col-xl-4 col-md-6">
                    <div class="widget widget-stats  bg-primary border-4 border-top border-orange rounded-4">
                        <div class="stats-icon text-white"><i class="fa fa-users" /></div>
                        <div class="stats-info">
                            <h4 className='fs-16px'>ໜີ້ຄ້າງຈ່າຍຕົວແທນ</h4>
                            {loading === true ? (
                                <Loader size="md" content="ກຳລັງໂຫລດ..." />
                            ) : (
                                <p>{numeral(sum.expences_pays_taxes).format('0,00')} kip</p>
                            )}
                        </div>
                        <div class="stats-link">
                            <a href="javascript:;">ເບີ່ງລາຍລະອຽດ <i class="fa fa-arrow-alt-circle-right"></i></a>
                        </div>
                    </div>
                </div>


                <div class="col-xl-4 col-md-6">
                    <div class="widget widget-stats bg-orange">
                        <div class="stats-icon text-white"><i class="fa-solid fa-wallet" /></div>
                        <div class="stats-info">
                            <h4 className='fs-16px'>ໜີ້ຄ້າງຮັບ oac</h4>
                            {loading === true ? (
                                <Loader size="md" content="ກຳລັງໂຫລດ..." />
                            ) : (
                                <p>{numeral(sum.incom_finally).format('0,00')} kip</p>
                            )}
                        </div>
                        <div class="stats-link">
                            <Link to={'/debt-oac'}>ເບີ່ງລາຍລະອຽດ <i class="fa fa-arrow-alt-circle-right"></i></Link>
                        </div>
                    </div>
                </div>

            </div>
            <div className="panel panel-inverse">
                <div class="panel-heading bg-white">
                    <h4 class="panel-title text-dark fs-18px">ລາຍການໜີ້ຄ້າງຈ່າຍ ຕົວແທນ</h4>
                    <div class="panel-heading-btn">
                        <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
                        <a href="javascript:;" class="btn btn-xs btn-icon btn-danger" data-toggle="panel-remove"><i class="fa fa-times"></i></a>
                    </div>
                </div>
                <div className="panel-body">
                    <div className="row mb-3">
                    <div className="col-sm-2 col-6 mb-2">
                            <label htmlFor="" className='form-label'>ວັນທີ</label>
                            <DatePicker oneTap onChange={(e) => handleChange('start_date', e)} format="dd/MM/yyyy" block />
                        </div>
                        <div className="col-sm-2 col-6 mb-2">
                            <label htmlFor="" className='form-label'>ວັນທີ</label>
                            <DatePicker oneTap onChange={(e) => handleChange('end_date', e)} format="dd/MM/yyyy" block />
                        </div>
                        <div className="col-sm-3 mb-2">
                            <label htmlFor="" className='form-label'>ບໍລິສັດປະກັນໄພ</label>
                            <SelectPicker data={itemCompay} onChange={(e) => handleChange('company_id_fk', e)} block />
                        </div>
                        <div className="col-sm-2 mb-2">
                            <label htmlFor="" className='form-label'>ຕົວແທນຂາຍປະກັນ</label>
                            <SelectPicker data={itemAgent} onChange={(e) => handleChange('agent_id_fk', e)} block />
                        </div>
                        <div className="col-sm-3 mb-2">
                            <label htmlFor="" className='form-label'>ຄົ້ນຫາ</label>
                            <div class="input-group">
                                <input type='search' onChange={(e)=>Filter(e.target.value)} className='form-control rounded fs-14px' placeholder='ຄົ້ນຫາ...' />
                                <button type="button" class="btn btn-blue  rounded ms-2" >
                                    <i className="fas fa-search fs-5"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered align-middle w-100 text-nowrap">
                            <thead className="fs-14px bg-header">
                                <tr>
                                <th width='1%' className="text-center bg-header sticky-col first-col">ລ/ດ</th>
                                <th width='1%' className="text-center bg-header sticky-col first-col">ຕັດໜີ້</th>
                                    <th className="">ບໍລິສັນປະກັນໄພ</th>
                                    <th className="">ເລກທີສັນຍາ</th>
                                    <th className="text-center">ວັນທີເລີມ</th>
                                    <th className="text-center">ວັນທີສິນສຸດ</th>
                                    <th className="">ຕົວແທນຂາຍ</th>
                                    <th className="">ປະເພດຜູ້ຊື້ປະກັນ</th>
                                    <th className="">ປະເພດປະກັນ</th>
                                    <th className="">ທາງເລືອກ</th>
                                    <th className="text-end">ຄ່າທຳນຽມເບື້ອງຕັ້ນ	</th>
                                    <th className="text-center">ເປີເຊັນຈ່າຍ</th>
                                    <th className="text-end">ຄອມຈ່າຍ</th>
                                    <th className="text-end">ອາກອນ</th>
                                    <th className="text-end">ເປັນເງິນ</th>
                                    <th className="text-end">ຄອມຈ່າຍຫຼັງອາກອນ</th>
                                    <th className="text-center">ວັນທີຄ້າງ</th>
                                    <th className="text-center">ຈຳນວນວັນ</th>
                                    <th width='10%' className="text-center">ການຕັ້ງຄ່າ</th>
                                </tr>
                            </thead>
                            <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={19}>
                                        <Placeholder.Grid rows={6} columns={20} active />
                                        {/* <Loader backdrop size="lg"  content="ກຳລັງໂຫດ......" vertical /> */}
                                    </td>
                                </tr>
                            ) : (
                                itemData.length > 0 ? (
                                    <>
                                            {itemData.map((item, key) => (
                                                <tr key={key}>
                                                    <td className='text-center bg-white sticky-col first-col'>{key + 1}</td>
                                                    <td className='text-center bg-white sticky-col first-col'>{item.status_company===1?'ຄັ້ງຈ່າຍບໍລິສັດ':( <span onClick={() => handlePayDebt(item)} role='button' class="badge bg-primary"><i class="fa-brands fa-paypal"></i> ຕັດໜີ້ບໍລິສັດ</span>)}</td>
                                                    <td>{item.com_name_lao}</td>
                                                    <td className='text-center'>{item.contract_number}</td>
                                                    <td className='text-center'>{moment(item.contract_start_date).format('DD/MM/YYYY')}</td>
                                                    <td className='text-center'>{moment(item.contract_end_date).format('DD/MM/YYYY')}</td>
                                                    <td>{item.agent_name}</td>
                                                    <td>{item.type_buyer_name}</td>
                                                    <td>{item.type_in_name}</td>
                                                    <td>{item.options_name}</td>
                                                    <td className='text-end'>{numeral(item.initial_fee).format('0,00')} {item.genus}</td>
                                                    <td className='text-center'>{item.percent_eps}%</td>
                                                    <td className='text-end'>{numeral(item.pays_advance_fee).format('0,00')} {item.genus}</td>
                                                    <td className='text-center'>{item.percent_fee_eps}%</td>
                                                    <td className='text-end'>{numeral(item.money_percent_fee).format('0,00')} {item.genus}</td>
                                                    <td className='text-end'>{numeral(item.expences_pays_taxes).format('0,00')} {item.genus}</td>
                                                    <td className='text-center'>{moment(item.agent_date).format('DD/MM/YYYY')}</td>
                                                    <td className='text-center'>{item.day_agent} ວັນ</td>
                                                    <td>
                                                        <button type='button' className='btn btn-xs btn-red'> PDF </button>
                                                        <button className='btn btn-xs btn-green ms-2'> Excel </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        
                                        {Object.keys(sumData).map((currency, key) => (
                                                <tr key={`${key}`}>
                                                    <td colSpan={10} className='text-end'>ລວມຍອດຄ້າງຈ່າຍທັງໝົດ ({currency})</td>
                                                    <td className='text-end'>{formatNumber(sumData[currency].initial_fee)}</td>
                                                    <td></td>
                                                    <td className='text-end'>{formatNumber(sumData[currency].pays_advance_fee)}</td>
                                                    <td></td>
                                                    <td className='text-end'>{formatNumber(sumData[currency].money_percent_fee)}</td>
                                                    <td className='text-end'>{formatNumber(sumData[currency].expences_pays_taxes)}</td>
                                                    <td colSpan={3}></td>
                                                </tr>
                                        ))}
                                        </>
                                    ) : (<tr><td colSpan={19} className='text-center text-red'>ບໍ່ພົບຂໍ້ມູນທີ່ມີການຄົ້ນຫາ.......</td></tr>)
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal open={show} size='lg' onClose={() => handleShow(false)}>
                <form onSubmit={handleSubmit}>
                <Modal.Body>
                    <h4 className='text-center'>ຟອມຊຳລະໜີ້</h4>
                    <div className="mb-2 row">
                        <table className='table' width={'100%'}>
                            <tr>
                                <td>ເລກທີສັນຍາ: <span className='fs-18px'>{debt.contract_number}</span> </td>
                                <td rowSpan={3}>
                                    <span className='fs-16px'>ຍອດເງິນ</span>
                                    <h3 className='text-red'>{numeral(debt.expences_pays_taxes).format('0,00')} ₭</h3>
                                </td>
                            </tr>
                            <tr>
                                <td>ວັນທີເລີມ: {moment(debt.contract_start_date).format('DD/MM/YYYY')}</td>
                            </tr>
                            <tr>
                                <td>ວັນທີສິນສຸດ: {moment(debt.contract_end_date).format('DD/MM/YYYY')}</td>
                            </tr>
                        </table>
                        <div className="form-group col-sm-7">
                            <label htmlFor="" className='form-label'>ວັນທີຈ່າຍ</label>
                            <DatePicker oneTap format="dd/MM/yyyy" onChange={(e) => handleChangeDate('doccm_date', e)} defaultValue={new Date()} block />
                        </div>
                        <div className="form-group col-sm-5">
                            <label htmlFor="" className='form-label'>ເອກະສານແນບ</label>
                            <div className="mb-1">
                                <label className='btn btn-blue fs-15px'> <i class="fa-regular fa-folder-open fs-5"></i> ເລືອກໄຟລ໌....
                                    <input type='file' onChange={handleFileChange} className='hide' />
                                </label>
                            </div>
                            {fileName &&
                                <div class="alert alert-success alert-dismissible fade show">
                                    <strong className='fs-16px ms-2'><i class="fa-solid fa-paperclip" /> </strong>
                                    {fileName}
                                    <button type="button" onClick={closeFile} class="btn-close"></button>
                                </div>
                            }
                        </div>
                        <div className="form-group">
                            <label htmlFor="" className='form-label'>ໝາຍເຫດ</label>
                            <Input as='textarea' onChange={(e) => handleChangeDate('debt_remark', e)} block />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type='submit' appearance="primary" >ບັນທຶກການຈ່າຍ </Button>
                    <Button color='red' appearance="primary" onClick={() => handleShow(false)}>
                        ຍົກເລີກ
                    </Button>
                </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}
