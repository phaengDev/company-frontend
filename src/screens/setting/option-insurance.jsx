import React, { useState, useEffect } from "react";
import { Modal, Button } from 'rsuite';
import { useNavigate,useLocation } from 'react-router-dom'; 
import {Config} from '../../config/connenct';
import axios from 'axios';
import Alert from "../../utils/config";
import Swal from "sweetalert2";
import { useParams } from 'react-router-dom';
export default function OptionInsurance() {
    const api = Config.urlApi;
    const { type_insid } = useParams();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const typeId = atob(searchParams.get('id'));

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
        setInputs({
        insurance_type_fk:typeId,
        optionsId:'',
        options_name:'',
        option_vat:''
        });
    }
    const handleClose = () => setOpen(false);

    //=====================
    const navigate = useNavigate();
    const headleBack =()=> {
     navigate(`/type-in`);
    }


    //============= action =============
    const [inputs, setInputs] = useState({
        insurance_type_fk:typeId,
        optionsId:'',
        options_name:'',
        option_vat:''

    })
    const handleChange = (name,value) => {
        setInputs({ ...inputs, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            axios.post(api + 'options/create', inputs)
                .then(function (res) {
                    if (res.status === 200) {
                        handleClose();
                        fetchOption();
                        Alert.successData(res.data.message);
                        setInputs({
                            optionsId:'',
                            options_name:'',
                            option_vat:''
                            });
                    } else {
                        Alert.errorData(res.data.error);
                    }
                });
        } catch (error) {
            Alert.errorData('ເກີດຂໍ້ຜິດພາດບາງຢ່າງ ກະລຸນາກວດສອບ')
        }
    };

    const handleEdit=(item)=>{
        setInputs({
        insurance_type_fk:typeId,
        optionsId:item.options_Id,
        options_name:item.options_name,
        option_vat:item.option_vat
        });
        setOpen(true);
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
                axios.delete(api + `options/${id}`).then(function (response) {
                    if (response.status === 200) {
                        fetchOption()
                        Alert.successData(response.data.message)
                    } else {
                        Alert.errorData(response.data.message)
                    }
                });
            }
        });
    }

    //=======================
    const [data, setData] = useState([]);
    const [itemOtion, setItimeOption] = useState([]);
    const fetchOption = async () => {
        try {
            const response = await fetch(api + 'options/t/'+typeId);
            const jsonData = await response.json();
            setItimeOption(jsonData);
            setData(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
//=================
const [itype,setItype]=useState('')
const fetchType = async () => {
    try {
        const response = await fetch(api + 'type-ins/'+typeId);
        const jsonData = await response.json();
        setItype(jsonData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

    //====================
    const Filter = (event) => {
        setItimeOption(data.filter(n => n.options_name.toLowerCase().includes(event)))
    }


    const [currentPage, setcurrentPage] = useState(1);
    const [itemsPerPage, setitemsPerPage] = useState(10);

    // const [pageNumberLimit, setpageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

    const handleClick = (event) => {
        setcurrentPage(Number(event.target.id));
        setI(indexOfLastItem + 1)
    };

    const pages = [];
    for (let i = 1; i <= Math.ceil(itemOtion.length / itemsPerPage); i++) {
        pages.push(i);
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = itemOtion.slice(indexOfFirstItem, indexOfLastItem);

    const [i, setI] = useState(1);
    const qtyItem = itemOtion.length;
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
        fetchType();
        fetchOption()
    }, [type_insid]);
    return (
        <>
            <div id="content" class="app-content">
                <ol class="breadcrumb float-end">
                    <li class="breadcrumb-item"><span role='button' onClick={handleOpen} className='btn  btn-sm btn-danger'><i className="fa-solid fa-plus"></i> ເພີ່ມຂໍ້ມູນໃໝ່</span></li>
                </ol>
                <h3 class="page-header fs-20px"><span role="button" onClick={()=>headleBack()} className="fs-22px text-danger me-4"><i class="fa-solid fa-circle-arrow-left"></i>  </span> ລາຍການທາງເລືອກ / <span className="text-blue"> {itype.type_in_name}</span></h3>
                <div class="panel panel-inverse">
                    <div class="panel-body">
                        <div className="row mb-3">
                            <div className="col-sm-9"></div>
                            <div className="col-sm-3">
                                <input type="text" className="form-control" onChange={(e) => Filter(e.target.value)} placeholder="ຄົນຫາ..." />
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-striped table-bordered align-middle w-100 text-nowrap">
                                <thead className="fs-14px bg-header">
                                    <tr>
                                        <th className="text-center">ລ/ດ</th>
                                        <th className="">ຊື່ທາງເລືອກ</th>
                                        <th className="">ອາກອນ</th>
                                        <th className="text-center">ການຕັ້ງຄ່າ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item, key) =>
                                        <tr>
                                            <td className="text-center">{key + 1}</td>
                                            <td>{item.options_name}</td>
                                            <td>{item.option_vat === 0 ? `ຍົກເວັ້ນ`: item.option_vat+'%' } </td>
                                            <td className='text-center'>
                                                <button type='button' onClick={()=>handleEdit(item)} class="btn btn-blue btn-xs me-2"><i class="fa-solid fa-pen-to-square"></i></button>
                                                <button type='button' onClick={() => headleDelete(item.options_Id)} class="btn btn-red btn-xs"><i class="fa-solid fa-trash"></i></button>
                                            </td>
                                        </tr>
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
                    </div>
                </div>

                <Modal open={open} onClose={handleClose}>
                    <Modal.Header>
                        <Modal.Title className='pt-1'>ເພີ່ມຂໍ້ມູນປະເພດປະກັນໄພ</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <div className="from-group mb-2">
                                <label htmlFor="" className="from-label">ສະດັບປະກັນ</label>
                                <input type="text" className="form-control border-blue" value={inputs.options_name} onChange={(e)=>handleChange('options_name',e.target.value)} placeholder="ຊື່ປະເພດປະກັນ" required />
                            </div>
                            <div className="from-group">
                                <label htmlFor="" className="from-label">ອາກອນ</label>
                                <select className="form-select border-blue" value={inputs.option_vat} onChange={(e)=>handleChange('option_vat',e.target.value)} required>
                                    <option value=''>- ເລືອກອາກອນ -</option>
                                    <option value="10" >10%</option>
                                    <option value="0">ຍົກເວັ້ນ</option>
                                </select>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button type='submit' appearance="primary">ບັນທຶກ </Button>
                            <Button color='red' onClick={handleClose} appearance="primary"> ຍົກເລີກ </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </div>
        </>
    );
}
