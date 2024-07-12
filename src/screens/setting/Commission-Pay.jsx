import React, { useState, useEffect } from 'react'
import { Button, SelectPicker, Modal, Input, useToaster, Message } from 'rsuite';
import { useCompany, useType,useAgent } from '../../config/select-option';
import axios from 'axios';
import { Config } from '../../config/connenct';
import Alert from '../../utils/config';
import { useNavigate } from 'react-router-dom';
export default function CommissionPay() {
    const api = Config.urlApi;
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
    const itemcom = useCompany();
    const dataType = useType();
    const itemagent=useAgent();

    const toaster = useToaster();
    const [inputs, setInputs] = useState({
        typeList: [],
    })

    const [itemType, setItemType] = useState([]);
    const handleShowData = async () => {
        setOpen(true);
        try {
            const response = await fetch(api + 'type-ins/');
            const jsonData = await response.json();
            setItemType(jsonData);
            setInputs((prevState) => ({
                ...prevState,
                typeList: jsonData.map(item => ({ insurnce_type_fk: item.type_insid, percent: 0 }))
            }));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleChange = (index, event) => {
        const newTypeList = [...inputs.typeList];
        newTypeList[index].percent = event;
        setInputs((prevState) => ({
            ...prevState,
            typeList: newTypeList
        }));
    };
    const [disable, setDisable] = useState(true)
    const handleChangeCom = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        })
        if (value) {
            setDisable(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(api + 'comispay/create', inputs)
            .then(response => {
                if (response.status === 200) {
                    setOpen(false);
                    fetchCommission();
                    Alert.successData(response.data.message);
                } else {
                    Alert.errorData(response.data.message);
                }
            })
            .catch(error => {
                console.error('Error inserting data:', error);
                Alert.errorData('ການໃສ່ຂໍ້ມູນຜິດພາດ ກະລຸນາກວດຄືນໃໝ່');
            });
    };


    const [values, setValues] = useState({
        companyId_fk: '',
        insurnce_typeId: '',
        agentId_fk:'',
    })
    const handelSearch = (name, value) => {
        setValues({
            ...values, [name]: value
        });
    }
    const [itemCommis, setItemCommis] = useState([]);
    const fetchCommission = async () => {
        try {
            const response = await axios.post(api + 'comispay/fetch', values);
            const jsonData = response.data;
            setItemCommis(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    //=============================

    const [opened, setOpened] = useState(false);
    const handleCloseEd = () => setOpened(false);
    const [val, setVal] = useState({
        comis_agent_id: '',
        percent: '',
        com_name_lao: '',
        type_in_name: '',
        agent_name:''
    });

    const handleChangeEdit = (name, value) => {
        setVal({
            ...val, [name]: value
        })
    }

    const headleEdit = (item) => {
        setOpened(true);
        setVal({
            comis_agent_id: item.comis_agent_id,
            percent: item.percent,
            com_name_lao: item.com_name_lao,
            type_in_name: item.type_in_name,
            agent_name:item.agent_name
        })
    }

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        axios.put(api + 'comispay/edit', val)
            .then(response => {
                if (response.status === 200) {
                    setOpened(false);
                    fetchCommission();
                    Alert.successData(response.data.message);
                } else {
                    Alert.errorData(response.data.message);
                }
            })
            .catch(error => {
                console.error('Error updating data:', error);
                Alert.errorData('ການແກ້ໄຂຂໍ້ມູນຜິດພາດ ກະລຸນາກວດຄືນໃໝ່');
            });
    }

    const headleDelete = (id) => {
        axios.delete(api + `comispay/${id}`).then(function (response) {
            if (response.status === 200) {
                fetchCommission()
                toaster.push(
                    <Message showIcon type="success" closable>
                        <strong>ຢືນຢັນ!</strong> {response.data.message}
                    </Message>,
                    { placement: 'topEnd', duration: 5000 }
                );
            } else {
                Alert.errorData(response.data.message)
            }
        });
    }

    const navigate = useNavigate();
    const handleNew = () => {
        navigate('/comission')
    }


    // =================== custom pages============
    const [currentPage, setcurrentPage] = useState(1);
    const [itemsPerPage, setitemsPerPage] = useState(100);
    const handleShowLimit = (value) => {
        setitemsPerPage(value);
    };
    const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setminPageNumberLimit] = useState(0);
    const handlePageClick = (event) => {
        setcurrentPage(Number(event.target.id));
        setI(indexOfLastItem + 1)
    };
    const pages = [];
    for (let i = 1; i <= Math.ceil(itemCommis.length / itemsPerPage); i++) {
        pages.push(i);
    }
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = itemCommis.slice(indexOfFirstItem, indexOfLastItem);

    const [i, setI] = useState(1);
    const qtyItem = itemCommis.length;
    const renderPageNumbers = pages.map((number) => {
        if (number > minPageNumberLimit && number <= maxPageNumberLimit) {
            return (
                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                    <button role="button" id={number} onClick={handlePageClick} className="page-link border-blue">
                        {number}
                    </button>
                </li>
            );
        } else {
            return (
                <li key={number} className="page-item active" >
                    <button role="button" className="page-link border-blue">1</button>
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

    useEffect(() => {
        fetchCommission()
    }, [values])

  return (
    <div id="content" className="app-content p-3">
    <ol class="breadcrumb float-xl-end">
        <li class="breadcrumb-item"><a href="javascript:;">ໜ້າຫຼັກ</a></li>
        <li class="breadcrumb-item active">ຄ່າຄອມມິດຊັນ</li>
    </ol>
    <h1 class="page-header">ຕັ້ງຄ່າ ຄ່າຄອມມິດຊັນຂາຍປະກັນໄພ </h1>
    <div class="row">
        <div class="col-xl-4 col-md-6">
            <div role='button' onClick={handleNew} class="widget widget-stats bg-orange rounded-4">
                <div class="stats-icon text-white"><i class="fa-solid fa-percent"></i></div>
                <div class="stats-info">
                    <h3>ຄ່າຄອມມິດຊັນຮັບ</h3>
                    <p>ບໍລິສັດໂອເອຊີ</p>
                </div>
            </div>
        </div>
        <div class="col-xl-4 col-md-6">
            <div  class="widget widget-stats bg-blue border-4 border-top border-red rounded-4">
                <div class="stats-icon text-white"><i class="fa-solid fa-percent"></i></div>
                <div class="stats-info">
                    <h3>ຄ່າຄອມມິດຊັນຈ່າຍ</h3>
                    <p>ຕົວແທນຂາຍ</p>
                </div>
            </div>
        </div>
    </div>

    <div className="panel">
        <div class="panel-heading ui-sortable-handle">
            <h4 class="panel-title fs-20px">ລາຍການຄ່າຄອມມິດຊັນ ຄອມຮັບ</h4>
            <div class="panel-heading-btn">
                <Button appearance="primary" onClick={handleShowData} ><i className="fas fa-plus"></i> ເພີ່ມຂໍ້ມູນ</Button>
            </div>
        </div>
        <div className="panel-body">
            <div className="row mb-3">
                <div className="col-sm-3">
                    <label htmlFor="" className='form-label'>ບໍລິສັດປະກັນໄພ</label>
                    <SelectPicker data={itemcom} onChange={(e) => handelSearch('companyId_fk', e)} block />
                </div>
                <div className="col-sm-3">
                    <label htmlFor="" className='form-label'>ປະເພດປະກັນ</label>
                    <SelectPicker data={dataType} onChange={(e) => handelSearch('insurnce_typeId', e)} block />
                </div>
                <div className="col-sm-3">
                    <label htmlFor="" className='form-label'>ຕົວແທນຂາຍ</label>
                    <SelectPicker data={itemagent} onChange={(e) => handelSearch('agentId_fk', e)} block />
                </div>
            </div>
            <div class="table-responsive">
                <table class="table table-striped  table-bordered align-middle w-100 text-nowrap">
                    <thead className="fs-14px bg-header">
                        <tr>
                            <th width='1%' className="text-center">ລ/ດ</th>
                            <th className="">ຕົວແທນຂາຍ</th>
                            <th className="">ບໍລິສັດປະກັນໄພ</th>
                            <th className="">ປະເພດປະກັນ</th>
                            <th className="">ເປີເຊັນຂາຍ</th>
                            <th width='10%' className="text-center">ການຕັ້ງຄ່າ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                    <tr>
                                        <td className='text-centner'>{index + 1}</td>
                                        <td>{item.agent_name}</td>
                                        <td>{item.com_name_lao}</td>
                                        <td>{item.type_in_name}</td>
                                        <td className='text-center'>{item.percent} %</td>
                                        <td className='text-center'>
                                            <button type='button' onClick={() => headleEdit(item)} class="btn btn-blue btn-xs me-2"><i class="fa-solid fa-pen-to-square"></i></button>
                                            <button type='button' onClick={() => headleDelete(item.comis_oac_id)} class="btn btn-red btn-xs"><i class="fa-solid fa-trash"></i></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className='text-center text-red'> ບໍ່ພົບຂໍ້ມູນທີ່ມີການທີ່ມີການບັນທຶກ</td>
                                </tr>
                            )}
                    </tbody>
                </table>
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
            </div>
        </div>
    </div>

    <Modal overflow={true} open={open} onClose={handleClose}>
        <Modal.Header>
            <Modal.Title className='py-2'>ເພີ່ມຂໍ້ມູນຄອມມິດຊັນ</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
            <Modal.Body>
                <div class="table-responsive row">
                    <div className="mb-3 col-sm-6">
                        <label htmlFor="" className='form-label'>ເລືອກບໍລິສັດປະກັນ</label>
                        <SelectPicker data={itemcom} onChange={(e) => handleChangeCom('company_id_fk', e)} block />
                    </div>
                    <div className="mb-3 col-sm-6">
                        <label htmlFor="" className='form-label'>ຕົວແທນຂາຍ</label>
                        <SelectPicker data={itemagent} onChange={(e) => handleChangeCom('agent_id_fk', e)} block />
                    </div>
                    <table class="table table-striped  table-bordered align-middle w-100 text-nowrap">
                        <thead className="fs-14px bg-header">
                            <tr>
                                <th width='1%' className="text-center">ລ/ດ</th>
                                <th className="">ປະເພດປະກັນ</th>
                                <th className="" width='30%'>ເປີເຊັນຂາຍ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemType.map((item, index) => (
                                <tr key={index}>
                                    <td className='text-center'>{index + 1}</td>
                                    <td>{item.type_in_name}</td>
                                    <td>
                                        <Input type='number' value={item.percent} onChange={(e) => handleChange(index, e)} size='sm' />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button type='submit' disabled={disable} appearance="primary"> ບັນທຶກ</Button>
                <Button onClick={handleClose} appearance="primary" color='red'> ຍົກເລີກ</Button>
            </Modal.Footer>
        </form>
    </Modal>


    <Modal overflow={true} open={opened} onClose={handleCloseEd}>
        <Modal.Header>
            <Modal.Title className='py-2'>ແກ້ໄຂຂໍ້ມູນຄອມມິດຊັນ</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmitEdit}>
            <Modal.Body>
                <div className="row">
                    <div className="col-sm-6">
                        <label htmlFor="" className='form-label'>ບໍລິສັດປະກັນໄພ</label>
                        <Input value={val.com_name_lao} readOnly />
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor="" className='form-label'>ປະເພດປະກັນ</label>
                        <Input value={val.type_in_name} readOnly />
                    </div>
                    <div className="col-sm-8 mt-2">
                        <label htmlFor="" className='form-label'>ຕົວແທນຂາຍ</label>
                        <Input  value={val.agent_name}  />
                    </div>
                    <div className="col-sm-4 mt-2">
                        <label htmlFor="" className='form-label'>ເປີເຊັນ</label>
                        <Input type='number' defaultValue={val.percent} onChange={(e) => handleChangeEdit('percent', e)} />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button type='submit' appearance="primary"> ບັນທຶກ</Button>
                <Button onClick={handleCloseEd} appearance="primary" color='red'> ຍົກເລີກ</Button>
            </Modal.Footer>
        </form>
    </Modal>
</div>
  )
}
