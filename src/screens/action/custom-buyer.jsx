
import React, { useState, useEffect } from 'react'
import { SelectPicker, InputPicker, Placeholder, Input, Button } from 'rsuite';
import { Config, imageUrl } from '../../config/connenct';
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment';
import {useCompany, useProvince, useTypeBuyer, suePage } from '../../config/select-option';
import Alert from '../../utils/config';
import axios from 'axios';
import Swal from 'sweetalert2';
export default function CustomBuyer() {
    const api = Config.urlApi;
    const url = imageUrl.url;
    const itemPv = useProvince();
    const type = useTypeBuyer();
    const [iDdis, setIdDis] = useState('');
    const itemCompany = useCompany();
    const [itemDis, setItemDis] = useState([]);
    const showDis = async () => {
        if (iDdis === null) return;
        try {
            const response = await fetch(api + `district/pv/${iDdis}`);
            const jsonData = await response.json();
            setItemDis(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const Dist = itemDis.map(item => ({ label: item.district_name, value: item.district_id }));

    const provinceSearch = (name, value) => {
        setIdDis(value)
        setDataSearch({
            ...dataSearch, [name]: value
        })
    }

    const chengeSearch = (name, value) => {
        setDataSearch({
            ...dataSearch, [name]: value
        })
    }
    const [dataSearch, setDataSearch] = useState({
        provinceId: '',
        districtId: '',
        type_buyerId: '',
        companyId: ''
    });

    const [data, setData] = useState([]);
    const [itemCustom, setItemCustom] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const fetchCustom = async () => {
        try {
            const response = await axios.post(api + 'custom/', dataSearch);
            const jsonData = response.data;
            setItemCustom(jsonData);
            setData(jsonData)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }
    const Filter = (event) => {
        setItemCustom(data.filter(n => n.customer_name.toLowerCase().includes(event)))
    }


    const itemLimit = suePage(itemCustom.length);
    //=====================

    const [currentPage, setcurrentPage] = useState(1);
    const [itemsPage, setitemsPage] = useState(100);
    const handleShowLimit = (value) => {
        setitemsPage(value);
    };
    // const [pageNumberLimit, setpageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

    const handleClick = (event) => {
        setcurrentPage(Number(event.target.id));
        setI(indexOfLastItem + 1)
    };

    const pages = [];
    for (let i = 1; i <= Math.ceil(itemCustom.length / itemsPage); i++) {
        pages.push(i);
    }

    const indexOfLastItem = currentPage * itemsPage;
    const indexOfFirstItem = indexOfLastItem - itemsPage;
    const currentItems = itemCustom.slice(indexOfFirstItem, indexOfLastItem);

    const [i, setI] = useState(1);
    const qtyItem = itemCustom.length;
    const renderPageNumbers = pages.map((number) => {
        if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
            return (
                <li key={number} className={`page-item ${currentPage === number ? "active" : ''}`} >
                    <span role="button" id={number} onClick={handleClick} className="page-link border-blue">{number}</span>
                </li>
            );
        } else {
            <li key={number} className="page-item active" >
                <span role="button" className="page-link border-blue">1</span>
            </li>
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

    //=====================


    const navigate = useNavigate();
    const handleEidt = (id) => {
        navigate('/editCus?id=' + btoa(id));
    };


    const headleDelete = (id) => {
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
                axios.delete(api + `custom/${id}`).then(function (response) {
                    if (response.status === 200) {
                        fetchCustom()
                        Alert.successData(response.data.message)
                    } else {
                        Alert.errorData(response.data.message)
                    }
                }).catch((error) => {
                    Alert.infoData('ການລົບຂໍ້ມູນບໍ່ສຳເລັດ ກະລຸນາກວອຄືນ');
                });
            }
        })
    }

    useEffect(() => {
        fetchCustom();
        showDis();
    }, [iDdis])

    return (
        <div id="content" className="app-content">
            <ol className="breadcrumb float-end">
                <li className="breadcrumb-item"><Link to={'/home'}>home</Link> </li>
                <li className="breadcrumb-item active">ລາຍການລູກຄ້າ</li>
            </ol>
            <h3 className="page-header fs-20px">ຂໍ້ມູນລູກຄ້າຊື້ປະກັນ</h3>
            <div className="panel panel-inverse">
                <div className="panel-body">
                    <div className="row mb-3">
                        <div className="col-sm-2 col-6">
                            <label htmlFor="" className='form-label'>ແຂວງ</label>
                            <SelectPicker data={itemPv} onChange={(e) => provinceSearch('provinceId', e)} block />
                        </div>
                        <div className="col-sm-2 col-6">
                            <label htmlFor="" className='form-label'>ເມືອງ</label>
                            <SelectPicker data={Dist} onChange={(e) => chengeSearch('districtId', e)} block />
                        </div>
                        <div className="col-sm-3">
                            <label htmlFor="" className='form-label'>ບໍລິສັດປະກັນໄພ</label>
                            <SelectPicker data={itemCompany} onChange={(e) => chengeSearch('companyId', e)}  block />
                        </div>
                        <div className="col-sm-2 col-8">
                            <label htmlFor="" className='form-label'>ປະເພດ</label>
                            <SelectPicker data={type} onChange={(e) => chengeSearch('type_buyerId', e)} block />
                        </div>
                        <div className="col-sm-1 col-4 mt-4">
                            <Button type="button" appearance="primary" color='blue' onClick={fetchCustom} >ຄົ້ນຫາ</Button>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-sm-1 col-3">
                            <InputPicker data={itemLimit} value={itemsPage} onChange={(e) => handleShowLimit(e)} className="" />
                        </div>
                        <div className="col-sm-8 col-3"></div>
                        <div className="col-sm-3 col-6">
                            <Input onChange={(e) => Filter(e)} placeholder="ຄົ້ນຫາ..." />
                        </div>

                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered align-middle w-100 text-nowrap">
                            <thead className="fs-14px bg-header">
                                <tr>
                                    <th width='1%' className="text-center">ລ/ດ</th>
                                    <th className="text-center">ຮູບ/ໂລໂກ</th>
                                    <th className="w-10">ຊື່ບຸກຄົນ ຫຼື ອົງກອນ</th>
                                    <th className="">ເບີໂທລະສັບ</th>
                                    <th className="">ບ້ານ</th>
                                    <th className="">ເມືອງ</th>
                                    <th className="">ແຂວງ</th>
                                    <th className="">ປະເພດ</th>
                                    <th className="">ສັນຍາ</th>
                                    <th className="">ວັນທິລົງທະບຽນ</th>
                                    <th width='10%' className="text-center">ການຕັ້ງຄ່າ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="11">
                                            <Placeholder.Grid rows={5} columns={11} active />
                                        </td>
                                    </tr>
                                ) : (
                                    currentItems.length > 0 ? (
                                        currentItems.map((item, key) => (
                                            <tr key={key}>
                                                <td className='text-center'>{key + 1}</td>
                                                <td className='text-center'><img src={item.custom_profile === '' ? `/assets/img/logo/camera.png` : url + 'profile/' + item.custom_profile} class="rounded h-30px my-n1 mx-n1" /></td>
                                                <td className=''>{item.customer_name}</td>
                                                <td className=''>{item.registra_tel}</td>
                                                <td className=''>{item.village_name}</td>
                                                <td className=''>{item.district_name}</td>
                                                <td className=''>{item.province_name}</td>
                                                <td className=''>{item.type_buyer_fk === 1 ? 'ແບບບຸກຄົນ' : 'ແບບອົງກອນ'}</td>
                                                <td className='text-center'>{item.qtycontart} ສ/ຍ</td>
                                                <td className=''>{moment(item.create_date).format('DD/MM/YYYY')}</td>
                                                <td className='text-center'>
                                                    <button type='button' onClick={() => handleEidt(item.custom_uuid)} class="btn btn-blue btn-xs me-2"><i class="fa-solid fa-pen-to-square"></i></button>
                                                    <button type='button' onClick={() => headleDelete(item.custom_uuid)} class="btn btn-red btn-xs"><i class="fa-solid fa-trash"></i></button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="11" className='text-center text-danger'>ບໍ່ພົບລາຍຊື່ຜູ້ຊື້ປະກັນໄພ</td>
                                        </tr>
                                    )
                                )}

                            </tbody>
                        </table>
                        {currentItems.length > 0 ? (
                            <div class="d-md-flex align-items-center">
                                <div class="me-md-auto text-md-left text-center mb-2 mb-md-0">
                                    ສະແດງ 1 ຫາ {itemsPage} ຂອງ {qtyItem} ລາຍການ
                                </div>
                                <ul className="pagination  mb-0 ms-auto justify-content-center">
                                    <li className="page-item "><span role="button" onClick={handlePrevbtn} className={`page-link  ${currentPage === pages[0] ? 'disabled' : 'border-blue'}`} ><i class="fa-solid fa-angles-left" /></span></li>
                                    {minPageNumberLimit >= 1 ? (
                                        <li className="page-item"><span role="button" className="page-link disabled">...</span></li>
                                    ) : ''}
                                    {renderPageNumbers}
                                    {pages.length > maxPageNumberLimit ? (
                                        <li className="page-item"><span role="button" className="page-link disabled">...</span></li>
                                    ) : ''}
                                    <li className="page-item"><span role="button" onClick={handleNextbtn} className={`page-link  ${currentPage === pages[pages.length - 1] ? 'disabled' : 'border-blue'}`}><i class="fa-solid fa-angles-right" /></span></li>
                                </ul>
                            </div>
                        ) : ''}
                    </div>

                </div>
            </div>
        </div>
    )
}
