import React, { useState, useEffect } from "react";
import { Modal, Button } from 'rsuite';
import {Config,imageUrl} from "../../config/connenct";
import axios from 'axios';
import Alert from "../../utils/config";
import Swal from "sweetalert2";
function CompanyPage() {
    const api = Config.urlApi;
    const imgUrl = imageUrl.url;
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //============= action =============
    const [inputs, setInputs] = useState({
        companyId:'',
        com_logo:null,
        com_name_lao:'',
        com_name_eng:'',
        com_tel:'',
        com_address:'',
        com_status:'1',
    })
    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
        // const { name, value } = e.target;
        // setInputs({ ...inputs, [name]: value }); 
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const imputData=new FormData();
        for(const key in inputs){
            imputData.append(key,inputs[key])
        }
        try {
            axios.post(api + 'company/create', imputData)
                .then(function (respones) {
                    if (respones.status === 200) {
                        handleClose();
                        fetchCompany();
                        Alert.successData(respones.data.message)
                    } else {
                        Alert.errorData(respones.data.error)
                    }
                });
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    };


const headleEdit =(item)=>{
    setInputs({
        com_logo:null,
        companyId:item.company_Id,
        com_name_lao:item.com_name_lao,
        com_name_eng:item.com_name_eng,
        com_tel:item.com_tel,
        com_address:item.com_address,
    });
    if(item.com_logo !==''){
        setImgPart(imgUrl+'logo/'+item.com_logo)
    }else{
        setImgPart('/assets/img/logo/camera.png')
    }
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
                axios.delete(api + `company/${id}`).then(function (response) {
                    if (response.status === 200) {
                        fetchCompany()
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
    const [itemtCompany, setItimeComapany] = useState([]);
    const fetchCompany = async () => {
        try {
            const response = await fetch(api + 'company/fetch');
            const jsonData = await response.json();
            setItimeComapany(jsonData);
            setData(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    //====================
    const Filter = (event) => {
        setItimeComapany(data.filter(n => n.com_name_lao.toLowerCase().includes(event)))
    }
    const [currentPage, setcurrentPage] = useState(1);
    const [itemsPerPage, setitemsPerPage] = useState(20);

    const [pageNumberLimit, setpageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

    const handleClick = (event) => {
        setcurrentPage(Number(event.target.id));
        setI(indexOfLastItem + 1)
    };

    const pages = [];
    for (let i = 1; i <= Math.ceil(itemtCompany.length / itemsPerPage); i++) {
        pages.push(i);
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = itemtCompany.slice(indexOfFirstItem, indexOfLastItem);

    const [i, setI] = useState(1);
    const qtyItem = itemtCompany.length;
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
            setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
            setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
        }
    };

    const handlePrevbtn = () => {
        setcurrentPage(currentPage - 1);
        setI(indexOfLastItem - 1)

        if ((currentPage - 1) % pageNumberLimit === 0) {
            setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
            setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
        }
    };


    // const imageRef = useRef('/assets/img/logo/camera.png');
const [imgPart,setImgPart]=useState('/assets/img/logo/camera.png')
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setInputs({
            ...inputs,
            com_logo: file
        });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgPart(reader.result);
            };
            reader.readAsDataURL(file);
        }


        // if (file) {
        //     const imageUrl = URL.createObjectURL(file);
        //     imageRef.current.src = imageUrl;
        // }
        // setImgPart(imageRef)
        // setInputs({ ...inputs, [event.target.name]: event.target.value });
    };

    useEffect(() => {
        fetchCompany()
    }, []);
    return (
        <>
            <div id="content" class="app-content">
                <ol class="breadcrumb float-end">
                    <li class="breadcrumb-item"><span role='button' onClick={handleOpen} className='btn  btn-sm btn-danger'><i className="fa-solid fa-plus"></i> ເພີ່ມຂໍ້ມູນໃໝ່</span></li>
                </ol>
                <h3 class="page-header fs-20px">ຂໍ້ມູນບໍລິສັດປະກັນໄພ</h3>
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
                                        <th width='1%' className="text-center">ລ/ດ</th>
                                        <th width='1%' className="text-center with-img dt-type-numeric">ໂລໂກ</th>
                                        <th className="">ຊື່ບໍລິສັດພາສາລາວ</th>
                                        <th className="">ຊື່ບໍລິສັດພາສາອັງກິດ</th>
                                        <th className="">ເບີໂທລະສັບ</th>
                                        <th className="">ທີ່ຢູ່ບໍລິສັດ</th>
                                        <th width='10%' className="text-center">ການຕັ້ງຄ່າ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item, key) =>
                                        <tr>
                                            <td className="text-center">{key + 1}</td>
                                            <td className="text-center"><img src={item.com_logo ==='' ? `/assets/img/logo/camera.png`: imgUrl+'logo/'+item.com_logo} class="rounded h-30px my-n1 mx-n1" />  </td>
                                            <td>{item.com_name_lao}</td>
                                            <td>{item.com_name_eng}</td>
                                            <td>{item.com_tel}</td>
                                            <td>{item.com_address}</td>
                                            <td className='text-center'>
                                                <button type='button' onClick={()=>headleEdit(item)} class="btn btn-blue btn-xs me-2"><i class="fa-solid fa-pen-to-square"></i></button>
                                                <button type='button' onClick={() => headleDelete(item.company_Id)} class="btn btn-red btn-xs"><i class="fa-solid fa-trash"></i></button>
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
                        <Modal.Title className='pt-1'>ເພີ່ມຂໍ້ມູນບໍລິສັດປະກັນໄພ</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={handleSubmit} enctype="multipart/form-data">
                        <Modal.Body>
                            <div className="row">
                                <div className="col-md-12 text-center mb-3">
                                    <label className="border border-info rounded-pill" role="button">
                                        <input type="file" name="com_logo" onChange={handleImageChange} accept="image/*" className="hide" />
                                        <img src={imgPart} id="blah" alt="" class="w-120px h-120px rounded-pill" />
                                    </label>
                                </div>

                                <div className="form-group col-sm-6 mb-2">
                                    <label htmlFor="" className="form-label">ຊື່ບໍລິສັດພາສາລາວ</label>
                                    <input type="text" className="form-control border-info" name="com_name_lao" value={inputs.com_name_lao} onChange={handleChange} placeholder="ຊື່ບໍລິສັດພາສາລາວ" required />
                                </div>
                                <div className="form-group col-sm-6 mb-2">
                                    <label htmlFor="" className="form-label">ຊື່ບໍລິສັດພາສາອັງກິດ</label>
                                    <input type="text" className="form-control border-info" name="com_name_eng" value={inputs.com_name_eng} onChange={handleChange} placeholder="ຊື່ບໍລິສັດພາສາອັງກິດ" required />
                                </div>
                                <div className="form-group col-sm-12 mb-2">
                                    <label htmlFor="" className="form-label">ເບີໂທລະສັບ</label>
                                    <input type="tel" className="form-control border-info" name="com_tel" value={inputs.com_tel} onChange={handleChange} placeholder="ເບີໂທລະສັບ" required />
                                </div>
                                <div className="form-group col-sm-12 mb-2">
                                    <label htmlFor="" className="form-label">ທີ່ຢູ່ບໍລິສັດ</label>
                                    <textarea className="form-control border-info" name="com_address" value={inputs.com_address} onChange={handleChange} placeholder="ທີ່ຢູ່ບໍລິສັດ....." required />
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button type='submit' appearance="primary"> ບັນທຶກ </Button>
                            <Button color='red' onClick={handleClose} appearance="primary"> ຍົກເລີກ </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </div>
        </>
    )
}

export default CompanyPage