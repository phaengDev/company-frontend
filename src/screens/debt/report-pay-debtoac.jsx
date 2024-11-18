import React, { useState, useEffect } from 'react'
import { Input, DatePicker, SelectPicker, Placeholder, Loader } from 'rsuite'
import { useCompany, useType, useAgent } from '../../config/select-option';
import { Config } from '../../config/connenct';
import axios from 'axios';
import moment from 'moment';
import numeral from 'numeral';
export default function ReportPayDebtoac() {
    const api = Config.urlApi;
    const itemcm = useCompany();
    const itemType = useType();
    const itemAgent = useAgent();

    const [itemOption, setItemOption] = useState([]);
    const handleOption = async (name, value) => {
        try {
            const response = await fetch(api + `options/t/${value}`);
            const jsonData = await response.json();
            setItemOption(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setData({
            ...data, [name]: value
        })

        // fetchReport();
    };
    const dataOption = itemOption.map(item => ({ label: item.options_name, value: item.options_Id }));

    const [data, setData] = useState({
        start_date: new Date(),
        end_date: new Date(),
        company_id_fk: '',
        insurance_type_fk: '',
        agent_id_fk: '',
        option_id_fk: '',
        status_doc: 2
    })
    const handleChange = (name, value) => {
        setData({
            ...data, [name]: value
        })
    }

    const [isLoading, setIsLoading] = useState(true)
    const [itemData, setItemData] = useState([]);
    const [dataFilter, setDataFilter] = useState([]);
    const fetchReport = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(api + 'pays/report', data);
            setItemData(response.data);
            setDataFilter(response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleFilter = (event) => {
        const searchTerm = event.toLowerCase(); // Convert input to lowercase for case-insensitive filtering
        setItemData(dataFilter.filter(item =>
            item.contract_number.toLowerCase().includes(searchTerm) ||
            item.customer_name.toLowerCase().includes(searchTerm) ||
            item.currency_name.toLowerCase().includes(searchTerm)
        ));
    };

    const sumData = itemData.reduce((acc, item) => {
        const currency = item.currency_name;
        if (!acc[currency]) {
            acc[currency] = {
                initial_fee: 0,
                pre_tax_profit: 0,
                incom_money: 0,
                incom_finally: 0
            };
        }
        acc[currency].initial_fee += parseFloat(item.initial_fee);
        acc[currency].pre_tax_profit += parseFloat(item.pre_tax_profit);
        acc[currency].incom_money += parseFloat(item.incom_money);
        acc[currency].incom_finally += parseFloat(item.incom_finally);
        return acc;
    }, {});

    const formatNumber = (num) => numeral(num).format('0,00');

    useEffect(() => {
        fetchReport()
    }, [data])

    return (
        <div id="content" className="app-content p-0 bg-component">

            <div class="app-content-padding px-4 py-3">
                <div class="d-lg-flex mb-lg-3 mb-2">
                    <h3 class="page-header mb-0 flex-1 fs-20px">ລາຍງານຈ່າຍໜີ້ຄອມຮັບ OAC</h3>
                    <span class="d-none d-lg-flex align-items-center">
                        <button class="btn btn-danger btn-sm d-flex me-2 pe-3 rounded-3">
                            <i class="fa-solid fa-file-pdf fs-18px me-2 ms-n1"></i> Export PDF
                        </button>
                        <button class="btn btn-success btn-sm d-flex me-2 pe-3 rounded-3">
                            <i class="fa-solid fa-cloud-arrow-down fs-18px me-2 ms-n1"></i>
                            Export Excel
                        </button>
                    </span>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-4 col-md-2 col-6">
                        <label htmlFor="" className='form-label'>ວັນທີ</label>
                        <DatePicker oneTap defaultValue={data.start_date} onChange={(e) => handleChange('start_date', e)} format="dd/MM/yyyy" block />
                    </div>
                    <div className="col-sm-4 col-md-2  col-6">
                        <label htmlFor="" className='form-label'>ຫາວັນທີ</label>
                        <DatePicker oneTap defaultValue={data.end_date} onChange={(e) => handleChange('end_date', e)} format="dd/MM/yyyy" block />
                    </div>
                    <div className="col-sm-4 col-md-2">
                        <label htmlFor="" className='form-label'>ບໍລິສັດປະກັນໄພ</label>
                        <SelectPicker block data={itemcm} onChange={(e) => handleChange('company_id_fk', e)} />
                    </div>
                    <div className="col-sm-4 col-md-2  col-6">
                        <label htmlFor="" className='form-label'>ປະເພດປະກັນ</label>
                        <SelectPicker block data={itemType} onChange={(e) => handleOption('insurance_type_fk', e)} />
                    </div>

                    <div className="col-sm-4 col-md-2">
                        <label htmlFor="" className='form-label'>ຕົວແທນຂາຍ</label>
                        <SelectPicker block data={itemAgent} onChange={(e) => handleChange('agent_id_fk', e)} />
                    </div>
                    <div className="col-sm-4 col-md-2  col-6">
                        <label htmlFor="" className='form-label'>ຄົ້ນຫາ</label>
                        <Input block onChange={(e) => handleFilter(e)} placeholder='ຊື່ລູກຄ້າ/ສະກຸນເງິນ/ເລກທີສັນຍາ' />
                    </div>
                </div>

                <div className="table-responsive ">
                    <table className="table table-striped table-bordered align-middle w-100 text-nowrap">
                        <thead className="fs-14px bg-header">
                            <tr>
                                <th width='1%' className="text-center bg-header sticky-col first-col">ລ/ດ</th>
                                <th className="text-center">ວັນທີຈ່າຍ</th>
                                <th className="">ເລກທີສັນຍາ</th>
                                <th className="text-center">ວັນທີເລີມ</th>
                                <th className="text-center">ວັນທີສິນສຸດ</th>
                                <th className="">ລູກຄ້າຊື້ປະກັນ</th>
                                <th className="">ຕົວແທນຂາຍ</th>
                                <th className="">ປະເພດຜູ້ຊື້ປະກັນ</th>
                                <th className="">ບໍລິສັນປະກັນໄພ</th>
                                <th className="">ປະເພດປະກັນ</th>
                                <th className="">ທາງເລືອກ</th>
                                <th className="text-end">ຄ່າທຳນຽມເບື້ອງຕັ້ນ</th>
                                <th className="text-center">ເປີເຊັນຮັບ</th>
                                <th className="text-end">ຄອມຮັບ</th>
                                <th className="text-end">ອາກອນ</th>
                                <th className="text-end">ເປັນເງິນ</th>
                                <th className="text-end">ຄອມຈ່າຍຫຼັງອາກອນ</th>
                                <th className="">ລາຍລະອຽດ</th>
                                <th width='5%' className="text-center">ເອກະສານ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={19}>
                                        <Placeholder.Grid rows={6} columns={10} active />
                                        <Loader size="lg" center content="ກຳລັງໂຫດ......" />
                                    </td>
                                </tr>
                            ) : (
                                itemData.length > 0 ? (
                                    <>
                                        {itemData.map((item, key) => (
                                            <tr key={key}>
                                                <td className='text-center'>{key + 1}</td>
                                                <td>{moment(item.doccm_date).format('DD/MM/YYYY')}</td>
                                                <td>{item.contract_number}</td>
                                                <td>{moment(item.contract_start_date).format('DD/MM/YYYY')}</td>
                                                <td>{moment(item.contract_end_date).format('DD/MM/YYYY')}</td>
                                                <td>{item.customer_name}</td>
                                                <td>{item.agent_name}</td>
                                                <td>{item.type_buyer_name}</td>
                                                <td>{item.com_name_lao}</td>
                                                <td>{item.type_in_name}</td>
                                                <td>{item.options_name}</td>
                                                <td className='text-end'>{numeral(item.initial_fee).format('0,00')} {item.genus}</td>
                                                <td className='text-center'>{item.precent_incom}%</td>
                                                <td className='text-end'>{numeral(item.pre_tax_profit).format('0,00')} {item.genus}</td>
                                                <td className='text-center'>{item.percent_akorn}%</td>
                                                <td className='text-end'>{numeral(item.incom_money).format('0,00')} {item.genus}</td>
                                                <td className='text-end'>{numeral(item.incom_finally).format('0,00')} {item.genus}</td>
                                                <td>{item.debt_remark}</td>
                                                <td>{item.docom_file && (<span role='button' className='text-danger fs-16px'><i class="fa-solid fa-download"></i></span>)}</td>
                                            </tr>
                                        ))}

                                        {Object.keys(sumData).map((currency, key) => (
                                            <tr key={key}>
                                                <td colSpan={11} className='text-end'>ລວມຍອດຄ້າງຮັບທັງໝົດ ({currency})</td>
                                                <td className='text-end'>{formatNumber(sumData[currency].initial_fee)}</td>
                                                <td></td>
                                                <td className='text-end'>{formatNumber(sumData[currency].pre_tax_profit)}</td>
                                                <td></td>
                                                <td className='text-end'>{formatNumber(sumData[currency].incom_money)}</td>
                                                <td className='text-end'>{formatNumber(sumData[currency].incom_finally)}</td>
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
    )
}
