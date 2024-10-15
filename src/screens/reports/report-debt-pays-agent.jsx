import React, { useState, useEffect } from 'react'
import { DatePicker, SelectPicker, Placeholder, InputGroup, Input } from 'rsuite'
import axios from 'axios';
import { Config } from '../../config/connenct';
import moment from 'moment';
import numeral from 'numeral';
import { useCompany, useType } from '../../config/select-option';
function ReportDebtPayAgent() {
    const api = Config.urlApi;
    const idAgent = localStorage.getItem('company_agent_id');
    const itemType = useType();
    const itemCompay = useCompany();

    const [data, setData] = useState({
        start_date: '',
        end_date: '',
        company_id_fk: '',
        agent_id_fk: idAgent,
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
            const response = await axios.post(api + 'debt/company', data);
            setItemData(response.data);
            setFilter(response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }

    };
    const Filter = (value) => {
        setItemData(filter.filter(n =>
            n.contract_number.toLowerCase().includes(value) ||
            n.currency_name.toLowerCase().includes(value) ||
            n.customer_name.toLowerCase().includes(value)
        ));
    };

    const typeFilter = (value) => {
        setItemData(filter.filter(n =>
            n.insurance_type_fk === parseInt(value)
        ));
    };

    const sumData = itemData.reduce((acc, item) => {
        const currency = item.currency_name;
        if (!acc[currency]) {
            acc[currency] = {
                initial_fee: 0,
                money_taxes: 0,
                registration_fee: 0,
                insuranc_included: 0,
            };
        }
        acc[currency].initial_fee += parseFloat(item.initial_fee);
        acc[currency].money_taxes += parseFloat(item.money_taxes);
        acc[currency].registration_fee += parseFloat(item.registration_fee);
        acc[currency].insuranc_included += parseFloat(item.insuranc_included);
        return acc;
    }, {});

    const formatNumber = (num) => numeral(num).format('0,00');


    useEffect(() => {
        fetchReport();
    }, [data, idAgent])
    return (
        <div id="content" className="app-content">
            <ol className="breadcrumb float-end">
                <li className="breadcrumb-item">ໜ້າຫຼັກ</li>
                <li className="breadcrumb-item active">ລາຍການໜີ້</li>
            </ol>
            <h3 className="page-header fs-20px">ຂໍ້ມູນໜີ້ທັງໝົດ </h3>

            <div className="panel panel-inverse">
                <div class="panel-heading bg-white">
                    <h4 class="panel-title text-dark fs-18px">ລາຍການໜີ້ຄ້າງຈ່າຍບໍລິສັດ</h4>
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
                            <label htmlFor="" className='form-label'>ປະເພດປະກັນ</label>
                            <SelectPicker data={itemType} onChange={(e) => typeFilter(e)} block />
                        </div>
                        <div className="col-sm-3 mb-2">
                            <label htmlFor="" className='form-label'>ຄົ້ນຫາ</label>
                            <InputGroup inside >
                                <InputGroup.Addon>
                                    <i className='fas fa-search' />
                                </InputGroup.Addon>
                                <Input onChange={(e) => Filter(e)} placeholder='ເລກທີສັນຍາ/ສະກຸນເງິນ/ຊື່ລູກຄ້າ' />
                            </InputGroup>
                           
                        </div>
                    </div>
                    <div className="table-responsive ">
                        <table className="table table-striped table-bordered align-middle w-100 text-nowrap">
                            <thead className="fs-14px bg-header">
                                <tr>
                                    <th width='1%' className="text-center bg-header sticky-col first-col">ລ/ດ</th>
                                    <th className="">ຊື່ລູກຄ້າ</th>
                                    <th className="">ບໍລິສັນປະກັນໄພ</th>
                                    <th className="">ເລກທີສັນຍາ</th>
                                    <th className="text-center">ວັນທີເລີມ</th>
                                    <th className="text-center">ວັນທີສິນສຸດ</th>
                                    <th className="">ປະເພດຜູ້ຊື້ປະກັນ</th>
                                    <th className="">ປະເພດປະກັນ</th>
                                    <th className="">ທາງເລືອກ</th>
                                    <th className="text-end">ຄ່າທຳນຽມເບື້ອງຕັ້ນ	</th>
                                    <th className="text-center">ອາກອນ</th>
                                    <th className="text-end">ເປັນເງິນ</th>
                                    <th className="text-end">ຄ່າລົງທະບຽນ</th>
                                    <th className="text-end">ຄ່າທຳນຽມປະກັນລວມ</th>
                                    <th className="text-center">ວັນທີຄ້າງ</th>
                                    <th className="text-center">ຈຳນວນວັນ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={19} className='text-center'>
                                            <Placeholder.Grid rows={6} columns={10} active />
                                            {/* <Loader size="lg" center content="ກຳລັງໂຫດ......" /> */}
                                        </td>
                                    </tr>
                                ) : (
                                    itemData.length > 0 ? (
                                        <>
                                            {itemData.map((item, key) => (
                                                <tr key={key}>
                                                    <td className='text-center bg-white sticky-col first-col'>{key + 1}</td>
                                                    <td>{item.customer_name}</td>
                                                    <td>{item.com_name_lao}</td>
                                                    <td className='text-center'>{item.contract_number}</td>
                                                    <td className='text-center'>{moment(item.contract_start_date).format('DD/MM/YYYY')}</td>
                                                    <td className='text-center'>{moment(item.contract_end_date).format('DD/MM/YYYY')}</td>
                                                    <td>{item.type_buyer_name}</td>
                                                    <td>{item.type_in_name}</td>
                                                    <td>{item.options_name}</td>
                                                    <td className='text-end'>{numeral(item.initial_fee).format('0,00')} {item.genus}</td>
                                                    <td className='text-center'>{item.percent_taxes}%</td>
                                                    <td className='text-end'>{numeral(item.money_taxes).format('0,00')} {item.genus}</td>
                                                    <td className='text-end'>{numeral(item.registration_fee).format('0,00')} {item.genus}</td>
                                                    <td className='text-end'>{numeral(item.insuranc_included).format('0,00')} {item.genus}</td>
                                                    <td className='text-center'>{moment(item.company_date).format('DD/MM/YYYY')}</td>
                                                    <td className='text-center'>{item.day_company} ວັນ</td>
                                                </tr>
                                            ))}

                                            {Object.keys(sumData).map((currency, key) => (
                                                <tr key={key}>
                                                    <td colSpan={9} className='text-end'>ລວມຍອດຮັບທັງໝົດ ({currency})</td>
                                                    <td className='text-end'>{formatNumber(sumData[currency].initial_fee)}</td>
                                                    <td></td>
                                                    <td className='text-end'>{formatNumber(sumData[currency].money_taxes)}</td>
                                                    <td className='text-end'>{formatNumber(sumData[currency].registration_fee)}</td>
                                                    <td className='text-end'>{formatNumber(sumData[currency].insuranc_included)}</td>
                                                    <td colSpan={2}></td>
                                                </tr>
                                            ))}
                                        </>
                                    ) : (<tr><td colSpan={26} className='text-center text-red'>ບໍ່ພົບຂໍ້ມູນທີ່ມີການຄົ້ນຫາ.......</td></tr>)
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ReportDebtPayAgent