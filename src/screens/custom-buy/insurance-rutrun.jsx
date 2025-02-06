import React, { useState, useEffect } from 'react'
import { DatePicker, SelectPicker, Input, InputGroup, Placeholder, Loader } from 'rsuite'
import { useCompanyCust, useTypeCust, useAgentCust, useOption } from '../../config/select-option';
import { Config, imageUrl } from '../../config/connenct';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
function InsuranceRetrun() {
    const api = Config.urlApi;
    const url = imageUrl.url;

    const user_type = parseInt(localStorage.getItem('user_type'), 10);
    const companyId = parseInt(localStorage.getItem('company_agent_id'), 10);
    const sts = [
        {
            label: 'ຄ້າງຄືນ',
            value: 1
        },
        {
            label: 'ຄືນແລ້ວ',
            value: 2
        }]


    const itemcm = useCompanyCust(companyId);
    const itemType = useTypeCust(companyId);
    const [data, setData] = useState({
        start_date: new Date(),
        end_date: new Date(),
        companyId_fk: '',
        insurance_typeId: '',
        agentId_fk: '',
        option_id_fk: '',
        custom_buyerId_fk: companyId,
        datecheck: 'company_date',
        status: user_type,
        statusRetrun: ''
    })
    const handleChange = (name, value) => {
        if (name === 'insurance_typeId') {
            setTypeId(value)
        }
        setData({
            ...data, [name]: value
        });
    }

    const [typeId, setTypeId] = useState(null)
    const itemOption = useOption(typeId);

    const [isLoading, setIsLoading] = useState(true)
    const [itemData, setItemData] = useState([]);
    const [dataFilter, setDataFilter] = useState([]);
    const fetchReport = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(api + 'retrun/report', data);
            setItemData(response.data);
            setDataFilter(response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const Filter = (event) => {
        const query = event.toLowerCase();
        setItemData(dataFilter.filter(n =>
            n.contract_number.toLowerCase().includes(query) ||
            n.currency_name.toLowerCase().includes(query) ||
            n.customer_name.toLowerCase().includes(query)
        ));
    };
    const [itemsPerPage, setitemsPerPage] = useState(100);
    const handleShowLimit = (value) => {
        setitemsPerPage(value);
    };
    const indexOfLastItem = 1 * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = itemData.slice(indexOfFirstItem, indexOfLastItem);


    const sumData = currentItems.reduce((acc, item) => {
        const currency = item.currency_name;
        if (!acc[currency]) {
            acc[currency] = {
                retrun_balance: 0,
                balance_agent: 0,
                balance_oac: 0,
            };
        }
        acc[currency].retrun_balance += parseFloat(item.retrun_balance);
        acc[currency].balance_agent += parseFloat(item.balance_agent);
        acc[currency].balance_oac += parseFloat(item.balance_oac);
        return acc;
    }, {});
    const formatNumber = (num) => numeral(num).format('0,00.00');


    const handleDownload = async (fileName) => {
        try {
            const response = await fetch(fileName); // Replace with your server URL
            if (!response.ok) {
                throw new Error('File download failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            alert('ຂໍອະໄພບໍ່ມີໄຟລ໌ໃນໂຟນເດີ ກະລຸນາອັບເດດໄຟລ໌ເຂົ້າໃໝ່!', error);
            // Handle error as needed
        }
    };


    const downloadFilePay = async (fileName) => {
        try {
            const response = await fetch(fileName); // Replace with your server URL
            if (!response.ok) {
                throw new Error('File download failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            alert('ຂໍອະໄພບໍ່ມີໄຟລ໌ໃນໂຟນເດີ ກະລຸນາອັບເດດໄຟລ໌ເຂົ້າໃໝ່!', error);
        }
    }


    useEffect(() => {
        fetchReport();
    }, [data, user_type, companyId])
    return (
        <div id="content" className="app-content p-0 bg-component">
            <div class="app-content-padding px-4 py-3">
                <div class="d-lg-flex mb-lg-3 mb-2">
                    <h3 class="page-header mb-0 flex-1 fs-20px">ລາຍການສັນຍາຍົກເລີກຮັບເງິນຄືນ </h3>
                    {/* <span class="d-none d-lg-flex align-items-center">
                        <button class="btn btn-danger btn-sm d-flex me-2 pe-3 rounded-3">
                            <i class="fa-solid fa-file-pdf fs-18px me-2 ms-n1"></i> Export PDF
                        </button>
                        <button class="btn btn-success btn-sm d-flex me-2 pe-3 rounded-3">
                            <i class="fa-solid fa-cloud-arrow-down fs-18px me-2 ms-n1"></i>
                            Export Excel
                        </button>
                    </span> */}
                </div>

                <div className="row mb-3">
                    <div className="col-sm-4 col-md-2 col-6">
                        <label htmlFor="" className='form-label'>ວັນທີ</label>
                        <DatePicker oneTap value={data.start_date} onChange={(e) => handleChange('start_date', e)} format="dd/MM/yyyy" block />
                    </div>
                    <div className="col-sm-4 col-md-2  col-6">
                        <label htmlFor="" className='form-label'>ຫາວັນທີ</label>
                        <DatePicker oneTap value={data.end_date} onChange={(e) => handleChange('end_date', e)} format="dd/MM/yyyy" block />
                    </div>
                    <div className="col-sm-4 col-md-2">
                        <label htmlFor="" className='form-label'>ບໍລິສັດປະກັນໄພ</label>
                        <SelectPicker block data={itemcm} onChange={(e) => handleChange('companyId_fk', e)} />
                    </div>
                    <div className="col-sm-4 col-md-2  col-6">
                        <label htmlFor="" className='form-label'>ປະເພດປະກັນ</label>
                        <SelectPicker block data={itemType} onChange={(e) => handleChange('insurance_typeId', e)} />
                    </div>
                    <div className="col-sm-4 col-md-2  col-6">
                        <label htmlFor="" className='form-label'>ທາງເລືອກ </label>
                        <SelectPicker block data={itemOption} value={data.option_id_fk} onChange={(e) => handleChange('option_id_fk', e)} />
                    </div>
                    <div className="col-sm-4 col-md-2  col-6">
                        <label htmlFor="" className='form-label'>ສະຖານະ </label>
                        <SelectPicker block data={sts} value={data.statusRetrun} onChange={(e) => handleChange('statusRetrun', e)} />
                    </div>
                </div>

                <div class="d-lg-flex align-items-center mb-3">
                    <div class="d-lg-flex d-none align-items-center text-nowrap">
                        ສະແດງ:
                        <select onChange={(e) => handleShowLimit(e.target.value)} class="form-select form-select-sm ms-2 ps-2 pe-30px">
                            <option value={100}>100</option>
                            <option value={205}>250</option>
                            <option value={500}>500</option>
                            <option value={1000}>1000</option>
                            <option value={itemData.length}>-All-</option>
                        </select>
                    </div>
                    <div class="d-lg-block d-none ms-2 text-body text-opacity-50">
                        ລາຍການ
                    </div>
                    <ul class="pagination pagination-sm mb-0 ms-auto justify-content-center">
                        <InputGroup inside>
                            <InputGroup.Addon> <i className="fas fa-search" /> </InputGroup.Addon>
                            <Input block onChange={(e) => Filter(e)} className='w-250px' placeholder='ຄົ້ນຫາ...' />
                        </InputGroup>
                    </ul>
                </div>
                <div class="table-responsive">
                    <table class="table table-striped  table-bordered align-middle w-100 text-nowrap">
                        <thead className="fs-14px bg-header">
                            <tr>
                                <th width='1%' className="text-center">ລ/ດ</th>
                                <th className="">ວັນທີລົງຂໍ້ມູນ</th>
                                <th className="">ເລກທີສັນຍາ</th>
                                <th className="">ບໍລິສັດປະກັນໄພ</th>
                                <th className="">ປະເພດປະກັນ</th>
                                <th className="">ທາງເລືອກ</th>
                                <th className="text-end">ຍອດເງິນ</th>
                                <th className="">ໝາຍເຫດ</th>
                                <th className="text-center">ສະຖານະ	</th>
                                <th className="">ວັນທີ	</th>
                                <th className="text-center">ເອກະສານ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={27}>
                                        <Placeholder.Grid rows={6} columns={10} active />
                                        <Loader size="lg" center content="ກຳລັງໂຫດ......" />
                                    </td>
                                </tr>
                            ) : (
                                currentItems.length > 0 ? (
                                    <>
                                        {currentItems.map((item, key) => (
                                            <tr key={key}>
                                                <td className='text-center'>{item.idAuto}</td>
                                                <td>{moment(item.register_date).format('DD/MM/YYYY')}</td>
                                                <td>{item.contract_number}</td>
                                                <td>{item.com_name_lao}</td>
                                                <td>{item.type_in_name}</td>
                                                <td>{item.options_name}</td>
                                                <td className='text-end'>{numeral(item.retrun_balance).format('0,00.00')} {item.genus}</td>
                                                <td className="">{item.remark_text}</td>
                                                <td className="text-center">{item.status_company === 1 ? (<span className='text-danger'>ຄ້າງຄືນ ({item.day_cpn})</span>) : (<span className='text-success'><i class="fa-solid fa-circle-check"></i> ຄືນແລ້ວ</span>)}</td>
                                                <td className="">{moment(item.company_date).format('DD/MM/YYYY')}</td>
                                                <td className="text-center">
                                                {item.doc_pays && (
                                                        item.doc_pays.filter(pay => pay.status_pay === 1)
                                                            .map((pay, key) => (
                                                                <span className='btn btn-xs btn-success me-2' onClick={() => downloadFilePay(`${url}docPay/${pay.file_doct}`)} role='button'><i class="fa-solid fa-download" /> </span>
                                                            ))
                                                            )}
                                                    {item.file_doc !== '' && (
                                                        <a href="javascript:;" onClick={() => handleDownload(`${url}docfile/${item.file_doc}`)} className='link'> <i class="fa-solid fa-cloud-arrow-down fs-4" />ສັນຍາ</a>
                                                    )}
                                                </td>

                                            </tr>
                                        ))}
                                        {Object.keys(sumData).map((currency, key) => (
                                            <tr key={`${key}`}>
                                                <td colSpan={6} className='text-end'>ລວມຍອດທັງໝົດ ({currency})</td>
                                                <td className='text-end'>{formatNumber(sumData[currency].retrun_balance)}</td>

                                                <td colSpan={5}></td>

                                            </tr>
                                        ))}
                                    </>
                                ) : (<tr><td colSpan={14} className='text-center text-red'>ບໍ່ພົບຂໍ້ມູນທີ່ມີການຄົ້ນຫາ.......</td></tr>)
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default InsuranceRetrun