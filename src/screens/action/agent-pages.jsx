import React, { useState, useEffect } from 'react'
import { Modal, Button, InputGroup, Input, DatePicker, SelectPicker } from 'rsuite';
import { Config } from '../../config/connenct';
import moment from 'moment';
import { useProvince } from '../../config/select-option';
import Alert from '../../utils/config';
import axios from 'axios';
import Swal from 'sweetalert2';
function AgentPages() {
    const api = Config.urlApi;
    const [open, setOpen] = useState(false);
    const handleOpen = (index) => {
        setOpen(index)
    }
    const itemPv = useProvince();

    const [disId, setDisId] = useState('');
    const [itemDistrict, setItemDistrict] = useState([]);
    const showDistrict = async () => {
        if (disId === null) return;
        try {
            const response = await fetch(api + `district/pv/${disId}`);
            const jsonData = await response.json();
            setItemDistrict(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const dataDist = itemDistrict.map(item => ({ label: item.district_name, value: item.district_id }));

    const handlePorvince = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        })
        setDisId(value)

    }
    //================
    const [data, setData] = useState([]);
    const [itemAgent, setItemAgent] = useState([]);
    const fetchAgent = async () => {
        try {
            const response = await fetch(api + 'agent/');
            const jsonData = await response.json();
            setItemAgent(jsonData);
            setData(jsonData)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const Filter = (event) => {
        const searchText = event.toLowerCase();
        const filteredData = data.filter(n =>
            n.idcrad_code.toLowerCase().includes(searchText) ||
            n.agent_name.toLowerCase().includes(searchText)
        );
        setItemAgent(filteredData);

        // setItemAgent(itemAgent.filter(n => n.agent_name.toLowerCase().includes(event)))
    }


    const [inputs, setInputs] = useState({
        agentId: '',
        idcrad_code: '',
        agent_name: '',
        agent_dob: new Date(),
        district_id_fk: '',
        agent_village: '',
        agent_tel: '',
        agent_status: '1'
    });
    const handleChange = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        })
    }

    const hanndleSubmit = (e) => {
        e.preventDefault();
        try {
            axios.post(api + 'agent/create', inputs)
                .then(function (respones) {
                    if (respones.status === 200) {
                        Alert.successData(respones.data.message);
                        setOpen(false);
                        fetchAgent();
                    } else {
                        Alert.errorData(respones.data.error)
                    }
                });
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    }

    const headleEdit = (item) => {
        setInputs({
            agentId: item.agent_Id,
            idcrad_code: item.idcrad_code,
            agent_name: item.agent_name,
            agent_dob: new Date(item.agent_dob),
            district_id_fk: item.district_id_fk,
            agent_village: item.agent_village,
            agent_tel: item.agent_tel,
            agent_status: item.agent_status,
            provice_fk: item.provice_fk
        });
        setDisId(item.provice_fk)
        setOpen(true)
    }

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
                axios.delete(api + `agent/${id}`).then(function (response) {
                    if (response.status === 200) {
                        fetchAgent()
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
    //=================================

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
    for (let i = 1; i <= Math.ceil(itemAgent.length / itemsPage); i++) {
        pages.push(i);
    }
    const indexOfLastItem = currentPage * itemsPage;
    const indexOfFirstItem = indexOfLastItem - itemsPage;
    const currentItems = itemAgent.slice(indexOfFirstItem, indexOfLastItem);

    const [i, setI] = useState(1);
    const qtyItem = itemAgent.length;
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

    useEffect(() => {
        fetchAgent();
        showDistrict();
    }, [disId])

    return (
        <div id="content" className="app-content">
            <ol className="breadcrumb float-end">
                <li className="breadcrumb-item"><span role='button' onClick={() => handleOpen(true)} className='btn  btn-sm btn-danger'><i className="fa-solid fa-plus"></i> ເພີ່ມຂໍ້ມູນໃໝ່</span></li>
            </ol>
            <h3 className="page-header fs-20px">ຂໍ້ມູນຕົວແທນຂາຍປະກັນ</h3>
            <div className="panel panel-inverse">
                <div className="panel-body">
                    <div className="table-responsive">
                        <div className="d-lg-flex align-items-center mb-3">
                            <div className="d-lg-flex d-none align-items-center text-nowrap">
                                ສະແດງ:
                                <select onChange={(e) => handleShowLimit(e.target.value)} className="form-select border-blue form-select-sm ms-2  ps-2 pe-30px" >
                                    <option value={100} selected>100</option>
                                    <option value={250}>250</option>
                                    <option value={500}>500</option>
                                    <option value={1000}>1000</option>
                                    <option value={qtyItem}>ທັງໝົດ</option>
                                </select>
                            </div>
                            <div className="d-lg-block d-none ms-2 text-body text-opacity-50"> ລາຍການ </div>
                            <div className="pagination  mb-0 ms-auto justify-content-center">
                                <input type='search' onChange={(e) => Filter(e.target.value)} className='form-control' placeholder='ຄົ້ນຫາ...' />
                            </div>
                        </div>
                        <table className="table table-striped table-bordered align-middle w-100 text-nowrap">
                            <thead className="fs-14px bg-header">
                                <tr>
                                    <th width='1%' className="text-center">ລ/ດ</th>
                                    <th className="text-center">ລະຫັດບັດ</th>
                                    <th className="">ຊື່ແລະນາມສະກຸນ</th>
                                    <th className="">ວັນເດືອນປິເກດ</th>
                                    <th className="">ເບີໂທລະສັບ</th>
                                    <th className="">ບ້ານ</th>
                                    <th className="">ເມືອງ</th>
                                    <th className="">ແຂວງ</th>
                                    <th className="">ສັນຍາ</th>
                                    <th width='10%' className="text-center">ການຕັ້ງຄ່າ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, key) =>
                                    <tr>
                                        <td className='text-center'>{key + 1}</td>
                                        <td className='text-center'>{item.idcrad_code}</td>
                                        <td className=''>{item.agent_name}</td>
                                        <td className=''>{moment(item.agent_dob).format('DD/MM/YYYY')}</td>
                                        <td className=''>{item.agent_tel}</td>
                                        <td className=''>{item.agent_village}</td>
                                        <td className=''>{item.district_name}</td>
                                        <td className=''>{item.province_name}</td>
                                        <td className='text-center'>{item.qtycontart} ສ/ຍ</td>
                                        <td className='text-center'>
                                            <button type='button' onClick={() => headleEdit(item)} class="btn btn-blue btn-xs me-2"><i class="fa-solid fa-pen-to-square"></i></button>
                                            <button type='button' onClick={() => headleDelete(item.agent_Id)} class="btn btn-red btn-xs"><i class="fa-solid fa-trash"></i></button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div class="d-md-flex align-items-center">
                            <div class="me-md-auto text-md-left text-center mb-2 mb-md-0">
                                ສະແດງ 1 ຫາ {itemsPage} ຂອງ {qtyItem} ລາຍການ
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
                    </div>
                </div>
            </div>
            <Modal size={'lg'} open={open} onClose={() => handleOpen(false)}>
                <form onSubmit={hanndleSubmit}>
                    <Modal.Header>
                        <Modal.Title><i class="fa-solid fa-user-pen"></i> ຟອມລົງທະບຽນຕົວແທນຂາຍ</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-sm-6 mb-2">
                                <label htmlFor="" className='form-label'>ຊື່ ແລະ ນາມສະກຸນ</label>
                                <Input value={inputs.agent_name} onChange={(e) => handleChange('agent_name', e)} placeholder='ຊື່ ແລະ ນາມສະກຸນ' />
                            </div>
                            <div className="col-sm-6 mb-2">
                                <label htmlFor="" className='form-label'>ວັນເດືອນປີເກີດ</label>
                                <DatePicker oneTap format="dd/MM/yyyy" value={inputs.agent_dob} onChange={(e) => handleChange('agent_dob', e)} block />
                            </div>
                            <div className="col-sm-6 mb-2">
                                <label htmlFor="" className='form-label'>ລະຫັດບັດ</label>
                                <InputGroup inside >
                                    <InputGroup.Addon><i class="fa-solid fa-address-card" /></InputGroup.Addon>
                                    <Input value={inputs.idcrad_code} onChange={(e) => handleChange('idcrad_code', e)} placeholder='xxxxx-xxx' />
                                </InputGroup>
                            </div>
                            <div className="col-sm-6 mb-2">
                                <label htmlFor="" className='form-label'>ເບີໂທລະສັບ</label>
                                <InputGroup inside >
                                    <InputGroup.Addon><i class="fa-solid fa-phone" /></InputGroup.Addon>
                                    <Input value={inputs.agent_tel} onChange={(e) => handleChange('agent_tel', e)} placeholder='020 9999 9999' />
                                </InputGroup>
                            </div>
                            <div className="col-sm-6 mb-2">
                                <label htmlFor="" className='form-label'>ແຂວງ</label>
                                <SelectPicker data={itemPv} value={inputs.provice_fk} onChange={(e) => handlePorvince('province_id_fk', e)} block />
                            </div>
                            <div className="col-sm-6 mb-2">
                                <label htmlFor="" className='form-label'>ເມືອງ</label>
                                <SelectPicker data={dataDist} value={inputs.district_id_fk} onChange={(e) => handleChange('district_id_fk', e)} block />
                            </div>
                            <div className="col-sm-6 mb-2">
                                <label htmlFor="" className='form-label'>ບ້ານ</label>
                                <Input value={inputs.agent_village} onChange={(e) => handleChange('agent_village', e)} />
                            </div>
                            <div className="col-sm-6 mb-2">
                                <label htmlFor="" className='form-label'>ສະຖານະ</label>
                                <select className='form-select' value={inputs.agent_status} onChange={(e) => handleChange('agent_status', e.target.value)}>
                                    <option value="1">ເປິດນຳໃຊ້</option>
                                    <option value="2">ປິດນຳໃຊ້</option>
                                </select>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='submit' appearance="primary"> ບັນທຶກ</Button>
                        <Button onClick={() => handleOpen(false)} color='red' appearance="primary">
                            ຍົກເລີກ
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>

    )
}

export default AgentPages