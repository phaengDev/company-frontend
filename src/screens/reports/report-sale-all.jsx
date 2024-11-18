import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DatePicker, Input, InputGroup, SelectPicker, Placeholder, Loader } from 'rsuite'
import { useCompany, useType, useTypeBuyer,useAgent } from '../../config/select-option';
import { Config } from '../../config/connenct';
import axios from 'axios';
import moment from 'moment';
import numeral from 'numeral';
import { ViewInsturance } from '../invioce/view-data-insturance';
import Alert from '../../utils/config';
import Swal from 'sweetalert2';
import FormBeneficiaries from '../Modal/Form-Beneficiaries';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
export default function ReportSaleAll() {
    const api = Config.urlApi;
    const itemcm = useCompany();
    const itemType = useType();
    const itemAgent = useAgent();
    const navigate = useNavigate();

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
    };
    const dataOption = itemOption.map(item => ({ label: item.options_name, value: item.options_Id }));
    const [data, setData] = useState({
        start_date: new Date(),
        end_date: new Date(),
        company_id_fk: '',
        insurance_type_fk: '',
        agent_id_fk: '',
        type_buyer_fk: '',
        option_id_fk: ''
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
            const response = await axios.post(api + 'report/all', data);
            setItemData(response.data); // Axios already parses the response
            setDataFilter(response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleFilter = (event) => {
        const searchTerm = event.toLowerCase(); // Ensure it's coming from an input event
        setItemData(dataFilter.filter(n =>
            n.contract_number.toLowerCase().includes(searchTerm) ||
            n.currency_name.toLowerCase().includes(searchTerm) ||
            n.customer_name.toLowerCase().includes(searchTerm)
        ));
    };


    // =================== custom pages============
    const [currentPage, setcurrentPage] = useState(1);
    const [itemsPerPage, setitemsPerPage] = useState(100);
    const handleShowLimit = (value) => {
        setitemsPerPage(value);
    };
    // const [pageNumberLimit, setpageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

    const handlePageClick = (event) => {
        setcurrentPage(Number(event.target.id));
        setI(indexOfLastItem + 1)
    };

    const pages = [];
    for (let i = 1; i <= Math.ceil(itemData.length / itemsPerPage); i++) {
        pages.push(i);
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = itemData.slice(indexOfFirstItem, indexOfLastItem);

    const [i, setI] = useState(1);
    const qtyItem = itemData.length;
    const renderPageNumbers = pages.map((number) => {
        if (number > minPageNumberLimit && number <= maxPageNumberLimit) {
            return (
                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                    <span role="button" id={number} onClick={handlePageClick} className="page-link border-blue">
                        {number}
                    </span>
                </li>
            );
        } else {
            return (
                <li key={number} className="page-item active" >
                    <span role="button" className="page-link border-blue">1</span>
                </li>
            )
        }
    });

    const handleNextbtn = () => {
        setcurrentPage(currentPage + 1);

        if (currentPage + 1 > maxPageNumberLimit) {
            setmaxPageNumberLimit(maxPageNumberLimit + 5);
            setminPageNumberLimit(minPageNumberLimit + 5);
        }
    };

    const handlePrevbtn = () => {
        setcurrentPage(currentPage - 1);
        setI(indexOfLastItem - 1)

        if ((currentPage - 1) % 5 === 0) {
            setmaxPageNumberLimit(maxPageNumberLimit - 5);
            setminPageNumberLimit(minPageNumberLimit - 5);
        }
    };


  
const handleExportExcel = () => {
    const table = document.getElementById('table-export');
    if (table) {
      const worksheet = XLSX.utils.table_to_sheet(table);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Export');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(data, 'ລາຍງານສັນຍາປະກັນໄພທັງໝົດ.xlsx');
    }
  };

    const handleEportPdf = () => {

    }

    const handleEdit = (id) => {
        navigate(`/editIn?id=${btoa(id)}`);
    }


    const [view, setView] = useState(false);
    const handleView = (index, value) => {
        setView(value)
        console.log(value)
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: "ຢືນຢັນ?",
            text: "ທ່ານຕ້ອງການລົບຂໍ້ມູນນີ້ແທ້ບໍ່!",
            icon: "warning",
            width: 400,
            showDenyButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ຕົກລົງ",
            denyButtonText: `ຍົກເລີກ`
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(api + `insurance/${id}`).then(function (response) {
                    if (response.status === 200) {
                        fetchReport();
                        Alert.successData(response.data.message)
                    } else {
                        Alert.errorData(response.data.message)
                    }
                });
            }
        });
    }

    const groupedData = currentItems.reduce((acc, item) => {
        const currency = item.currency_name;
        if (!acc[currency]) {
            acc[currency] = {
                initial_fee: 0,
                money_taxes: 0,
                registration_fee: 0,
                insuranc_included: 0,
                pre_tax_profit: 0,
                incom_money: 0,
                incom_finally: 0,
                pays_advance_fee: 0,
                money_percent_fee: 0,
                expences_pays_taxes: 0,
                net_income: 0
            };
        }

        acc[currency].initial_fee += parseFloat(item.initial_fee);
        acc[currency].money_taxes += parseFloat(item.money_taxes);
        acc[currency].registration_fee += parseFloat(item.registration_fee);
        acc[currency].insuranc_included += parseFloat(item.insuranc_included);
        acc[currency].pre_tax_profit += parseFloat(item.pre_tax_profit);
        acc[currency].incom_money += parseFloat(item.incom_money);
        acc[currency].incom_finally += parseFloat(item.incom_finally);
        acc[currency].pays_advance_fee += parseFloat(item.pays_advance_fee);
        acc[currency].money_percent_fee += parseFloat(item.money_percent_fee);
        acc[currency].expences_pays_taxes += parseFloat(item.expences_pays_taxes);
        acc[currency].net_income += parseFloat(item.net_income);

        return acc;
    }, {});
    const formatNumber = (num) => numeral(num).format('0,00.00');




    const [show, setShow] = useState(false);
    const [idInsrance, setIdInsrance] = useState('');
    const addBeneficiaRies = (id) => {
        setIdInsrance(id);
        setShow(true)
    }


    useEffect(() => {
        fetchReport();
    }, [data])



    return (
        <div id="content" className="app-content p-0 bg-component">

            <div class="app-content-padding px-4 py-3">
                <div class="d-lg-flex mb-lg-3 mb-2">
                    <h3 class="page-header mb-0 flex-1 fs-20px">ລາຍການສັນຍາປະກັນໄພທັງໝົດ</h3>
                    <span class="d-none d-lg-flex align-items-center">
                        <button onClick={handleEportPdf} class="btn btn-danger btn-sm d-flex me-2 pe-3 rounded-3">
                            <i class="fa-solid fa-file-pdf fs-18px me-2 ms-n1"></i> Export PDF
                        </button>
                        <button onClick={handleExportExcel} class="btn btn-success btn-sm d-flex me-2 pe-3 rounded-3">
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
                    <div className="col-sm-4 col-md-2  col-6">
                        <label htmlFor="" className='form-label'>ທາງເລືອກ</label>
                        <SelectPicker block data={dataOption} onChange={(e) => handleChange('option_id_fk', e)} />
                    </div>
                    <div className="col-sm-4 col-md-2">
                        <label htmlFor="" className='form-label'>ຕົວແທນຂາຍ</label>
                        <SelectPicker block data={itemAgent} onChange={(e) => handleChange('agent_id_fk', e)} />
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
                            <option value={qtyItem}>-All-</option>
                        </select>
                    </div>
                    <div class="d-lg-block d-none ms-2 text-body text-opacity-50">
                        ລາຍການ
                    </div>
                    <ul class="pagination pagination-sm mb-0 ms-auto justify-content-center">
                        <InputGroup inside>
                            <InputGroup.Addon> <i className="fas fa-search" /> </InputGroup.Addon>
                            <Input block onChange={(e) => handleFilter(e)} className='w-250px' placeholder='ໍຊື່ລູກຄ້າ/ສະກຸນເງິນ/ເລກທີສັນຍາ...' />
                        </InputGroup>
                    </ul>
                </div>
                <div id='table-export' class="table-responsive">
                    <table class="table table-striped  table-bordered align-middle w-100 text-nowrap">
                        <thead className="fs-14px bg-header">
                            <tr>
                                <th width='1%' className="text-center">ລ/ດ</th>
                                <th className="">ຊື່ລູກຄ້າ</th>
                                <th className="">ເລກທີສັນຍາ</th>
                                <th className="">ວັນທີເລີມ</th>
                                <th className="">ວັນທີສິນສຸດ</th>
                                <th className="">ບໍລິສັດປະກັນໄພ</th>
                                <th className="">ປະເພດຜູ້ຊື້</th>
                                <th className="">ປະເພດປະກັນ	</th>
                                <th className="">ທາງເລືອກ</th>
                                <th className="">ຕົວແທນຂາຍ</th>
                                <th className="text-end">ຄ່າທຳນຽມເບື້ອງຕົ້ນ</th>
                                <th className="text-end">ຄ່າອາກອນ</th>
                                <th className="text-end">ເປັນເງິນ</th>
                                <th className="text-end">ຄ່າລົງທະບຽນ</th>
                                <th className="text-end">ຄ່າປະກັນໄພລວມ</th>
                                <th className='text-center'>ເປີເຊັນ ຮັບ</th>
                                <th className="text-end">ຄອມກ່ອນ ອກ</th>
                                <th className='text-center'>ອ.ກ ລາຍໄດ້</th>
                                <th className="text-end">ອ.ກ ລາຍໄດ້(ຄອມຮັບ)</th>
                                <th className="text-end">ຄອມຫຼັງຫັກອາກອນ</th>
                                <th className='text-center'>ເປີເຊັນ ຈ່າຍ</th>
                                <th className="text-end">ຄອມຈ່າຍກ່ອນອາກອນ</th>
                                <th className="text-center">ອ.ກ ຈ່າຍ</th>
                                <th className="text-end">ອ.ກ ລາຍໄດ້(ຄອມຈ່າຍ)</th>
                                <th className="text-end">ຄອມຈ່າຍຫຼັງຫັກອາກອນ</th>
                                <th className="text-end">ລາຍຮັບສຸທິ</th>
                                <th width='10%' className="text-center">ຈັດການ</th>
                                <th width='10%' className="text-center">ການຕັ້ງຄ່າ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={28}>
                                        <Placeholder.Grid rows={6} columns={20} active />
                                        <Loader size="lg" center content="ກຳລັງໂຫດ......" />
                                    </td>
                                </tr>
                            ) : (
                                currentItems.length > 0 ? (
                                    <>
                                        {currentItems.map((item, key) => (
                                            <tr key={key}>
                                                <td className='text-center'>{item.idAuto}</td>
                                                <td>{item.customer_name}</td>
                                                <td>{item.contract_number}</td>
                                                <td>{moment(item.contract_start_date).format('DD/MM/YYYY')}</td>
                                                <td>{moment(item.contract_end_date).format('DD/MM/YYYY')}</td>
                                                <td>{item.com_name_lao}</td>
                                                <td>{item.type_buyer_name}</td>
                                                <td>{item.type_in_name}</td>
                                                <td>{item.options_name}</td>
                                                <td>{item.agent_name}</td>
                                                <td className='text-end'>{numeral(item.initial_fee).format('0,00.00')} {item.genus}</td>
                                                <td className='text-center'>{item.percent_taxes}%</td>
                                                <td className='text-end'>{numeral(item.money_taxes).format('0,00.00')} {item.genus}</td>
                                                <td className='text-end'>{numeral(item.registration_fee).format('0,00.00')} {item.genus}</td>
                                                <td className='text-end'>{numeral(item.insuranc_included).format('0,00.00')} {item.genus}</td>
                                                <td className='text-center'>{item.precent_incom}%</td>
                                                <td className='text-end'>{numeral(item.pre_tax_profit).format('0,00.00')} {item.genus}</td>
                                                <td className='text-center'>{item.percent_akorn}%</td>
                                                <td className='text-end'>{numeral(item.incom_money).format('0,00.00')} {item.genus}</td>
                                                <td className='text-end'>{numeral(item.incom_finally).format('0,00.00')} {item.genus}</td>
                                                <td className='text-center'>{item.percent_eps}%</td>
                                                <td className='text-end'>{numeral(item.pays_advance_fee).format('0,00.00')} {item.genus}</td>
                                                <td className='text-center'>{item.percent_fee_eps}%</td>
                                                <td className='text-end'>{numeral(item.money_percent_fee).format('0,00.00')} {item.genus}</td>
                                                <td className='text-end'>{numeral(item.expences_pays_taxes).format('0,00.00')} {item.genus}</td>
                                                <td className='text-end'>{numeral(item.net_income).format('0,00.00')} {item.genus}</td>
                                                <td className='text-center'>
                                                    <button type='button' onClick={() => handleView(true, item)} className='btn btn-xs btn-orange me-2'> <i class="fa-solid fa-eye"></i> </button>
                                                    <button type='button' onClick={() => addBeneficiaRies(item.incuranec_code)} className='btn btn-xs btn-blue'> <i class="fa-solid fa-user-shield"/> </button>
                                                </td>
                                                <td>
                                                    {item.contract_status===1 && (
                                                        <>
                                                    <button onClick={() => handleEdit(item.incuranec_code)} className='btn btn-xs btn-green ms-2'> <i class="fa-solid fa-file-pen"></i> </button>
                                                    <button onClick={() => handleDelete(item.incuranec_code)} className='btn btn-xs btn-danger ms-2'> <i class="fa-solid fa-trash"></i> </button>
                                                    </>
                                                 )}
                                                    </td>
                                            </tr>
                                        ))}
                                        {Object.keys(groupedData).map((currency, key) => (
                                            <tr key={`${key}`}>
                                                <td colSpan={10} className='text-end'>ລວມຍອດຄ້າງຮັບທັງໝົດ ({currency})</td>
                                                <td className='text-end'>{formatNumber(groupedData[currency].initial_fee)}</td>
                                                <td></td>
                                                <td className='text-end'>{formatNumber(groupedData[currency].money_taxes)}</td>
                                                <td className='text-end'>{formatNumber(groupedData[currency].registration_fee)}</td>
                                                <td className='text-end'>{formatNumber(groupedData[currency].insuranc_included)}</td>
                                                <td></td>
                                                <td className='text-end'>{formatNumber(groupedData[currency].pre_tax_profit)}</td>
                                                <td></td>
                                                <td className='text-end'>{formatNumber(groupedData[currency].incom_money)}</td>
                                                <td className='text-end'>{formatNumber(groupedData[currency].incom_finally)}</td>
                                                <td></td>
                                                <td className='text-end'>{formatNumber(groupedData[currency].pays_advance_fee)}</td>
                                                <td></td>
                                                <td className='text-end'>{formatNumber(groupedData[currency].money_percent_fee)}</td>
                                                <td className='text-end'>{formatNumber(groupedData[currency].expences_pays_taxes)}</td>
                                                <td className='text-end'>{formatNumber(groupedData[currency].net_income)}</td>
                                                <td colSpan={2}></td>
                                            </tr>
                                        ))}
                                    </>
                                ) : (<tr><td colSpan={28} className='text-center text-red'>ບໍ່ພົບຂໍ້ມູນທີ່ມີການຄົ້ນຫາ.......</td></tr>)
                            )}
                        </tbody>
                    </table>

                </div>
                <div class="d-md-flex align-items-center">
                    <div class="me-md-auto text-md-left text-center mb-2 mb-md-0">
                        ສະແດງ 1 ຫາ {itemsPerPage} ຂອງ {qtyItem} ລາຍການ
                    </div>
                    <ul className="pagination  mb-0 ms-auto justify-content-center">
                        <li className="page-item "><span role="button" onClick={handlePrevbtn} className={`page-link  ${currentPage === pages[0] ? 'disabled' : 'border-blue'}`} >ກອນໜ້າ</span></li>
                        {minPageNumberLimit >= 1 ? (
                            <li className="page-item"><span role="button" className="page-link disabled">...</span></li>
                        ) : ''}
                        {renderPageNumbers}
                        {pages.length > maxPageNumberLimit ? (
                            <li className="page-item"><span role="button" className="page-link disabled">...</span></li>
                        ) : ''}
                        <li className="page-item"><span role="button" onClick={handleNextbtn} className={`page-link  ${currentPage === pages[pages.length - 1] ? 'disabled' : 'border-blue'}`}>ໜ້າຕໍ່ໄປ</span></li>
                    </ul>
                </div>
                {view && (
                    <div class="panel panel-inverse panel-expand">
                        <div class="panel-heading bg-red-700 text-white ui-sortable-handle">
                            <h4 class="panel-title fs-16px"><span role='button' onClick={() => handleView(false, '')} className='fs-16px me-2'><i class="fa-solid fa-circle-arrow-left"></i></span>  ລາຍລະອຽດສັນຍາ</h4>
                            <div class="panel-heading-btn">
                                <button type='button' onClick={() => handleView(false, '')} class="btn btn-xs btn-icon btn-danger" ><i class="fa fa-times"></i></button>
                            </div>
                        </div>
                        <div class="panel-body">
                            <ViewInsturance data={view} />
                        </div>
                    </div>
                )}
            </div>

            <FormBeneficiaries
                show={show}
                handleClose={() => setShow(false)}
                idIn={idInsrance}
            />
        </div >
    )
}
