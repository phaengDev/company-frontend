import React, { useState } from 'react'
import { IconButton, Input, InputGroup } from 'rsuite';
import axios from 'axios';
import moment from 'moment';
import numeral from 'numeral';
import { Config, imageUrl } from '../../config/connenct';
import FormEditrefund from './Form-Edit-refund';
function DocumentRefund() {
    const api = Config.urlApi;
    const img = imageUrl.url;
    const [searchText, setSearchText] = useState("");
    const [itemData, setItemData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("ບໍ່ພົບຂໍ້ມູນທີ່ມີການຄົ້ນຫາ");
    const handleSearch = async () => {
        if (searchText.length < 3) {
            setErrorMessage("ກະລຸນາໃສ່ຕົວອັກສອນຫຼືຕົວເລກຢ່າງໜ້ອຍ 3 ຕົວເພື່ອຊອກຫາ.");
            return;
        }
        try {
            const response = await axios.post(api + 'retrun/search', { contract_number: searchText });
            const jsonData = response.data;
            setItemData(jsonData);
            setErrorMessage("ບໍ່ພົບຂໍ້ມູນທີ່ມີການຄົ້ນຫາ");
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const [open, setOpen] = useState(false);
    const [dataEdit, setDataEdit] = useState([]);
    const handleEdist = async (data) => {
        setOpen(true);
        setDataEdit(data);
    }


    const downloadFilePay = async (fileUrl, constact) => {
        try {
            const response = await fetch(fileUrl); // Replace with your server URL
            if (!response.ok) {
                throw new Error('File download failed');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const fileExtension = fileUrl.split('.').pop(); // Get the extension from the URL
            const fileName = `${constact}.${fileExtension}`;

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            alert('ຂໍອະໄພບໍ່ມີໄຟລ໌ໃນໂຟນເດີ ກະລຸນາອັບເດດໄຟລ໌ເຂົ້າໃໝ່!', error);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('ຕ້ອງການລຶບຂໍ້ມູນນີ້ບໍ່?')) {
            axios.get(api + 'retrun/del-file/' + id)
                .then(response => {
                    const filteredData = itemData.filter(item => item.file_id !== id);
                    setItemData(filteredData);
                })
                .catch(error => {
                    console.error('Error deleting data:', error);
                });
        }
    }

    return (
        <div id="content" className="app-content p-0 bg-component">
            <div className="app-content-padding px-4 py-3">
                <div className="d-lg-flex mb-lg-3 mb-2">
                    <h3 className="page-header mb-0 flex-1 fs-20px">ຊອກຫາເອກະສານຄື່ນເງິນລູກຄ້າ</h3>
                    <span className="align-items-center">
                        <InputGroup inside className='rounded-pill'>
                            <Input className='w-300px rounded-pill' onChange={(value) => setSearchText(value)} value={searchText}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder='ຄົ້າຫາເລກທີ່ສັນຍາ' />
                            {searchText.length >= 3 &&
                                <IconButton appearance='primary' onClick={handleSearch} color='red' size='sm' icon={<i className="fa-solid fa-magnifying-glass" />} className='rounded-pill px-2 mt-1 mb-1 me-1 ms-1'></IconButton>
                            }
                        </InputGroup>
                    </span>
                </div>

                <div className="table-responsive">
                    {itemData.length > 0 ? (
                        <table className="table table-striped  table-bordered align-middle w-100 text-nowrap">
                            <thead className='bg-header'>
                                <tr>
                                    <th className='text-center w-5'>ລ/ດ</th>
                                    <th className='text-center'>ວັນທີຈ່າຍ</th>
                                    <th className='text-center'>ປະເພດ</th>
                                    <th>ເລກທີສັນຍາ</th>
                                    <th>ຊື່ລູກຄ້າ</th>
                                    <th>ເບີໂທລະສັບ</th>
                                    <th>ບໍລິສັດປະກັນໄພ</th>
                                    <th>ປະເພດປະກັນ</th>
                                    <th>ທາງເລື່ອນ</th>
                                    <th>ຕົວແທນຂາຍ</th>
                                    <th>ໝາຍເຫດ</th>
                                    <th className='text-center'>ເອກະສານ</th>
                                    <th className='text-center'>ຕັ້ງຄ່າ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemData.map((item, index) => (
                                    <tr key={index}>
                                        <td className='text-center'>{index + 1}</td>
                                        <td className='text-center'>{moment(item.file_dates).format('DD/MM/YYYY')}</td>
                                        <td className='text-center'>{item.status_pay_label}</td>
                                        <td>{item.contract_number}</td>
                                        <td>{item.customer_name}</td>
                                        <td>{item.registra_tel}</td>
                                        <td>{item.com_name_lao}</td>
                                        <td>{item.type_in_name}</td>
                                        <td>{item.options_name}</td>
                                        <td>{item.agent_name}</td>
                                        <td>{item.desciption}</td>
                                        <td className='text-center'>
                                            {item.file_doct &&
                                                <a href='javascript:void(0)' onClick={() => downloadFilePay(`${img}docPay/${item.file_doct}`, item.contract_number)} rel="noopener noreferrer">
                                                    <i className="fa-solid fa-cloud-arrow-down text-red fs-4" />
                                                </a>
                                            }
                                        </td>
                                        <td className='text-center'>
                                            <button type='button' className='btn btn-xs btn-blue me-2' onClick={() => handleEdist(item)} >
                                                <i className="fa-solid fa-pen-to-square" />
                                            </button>
                                            <button type='button' className='btn btn-xs btn-red me-2' onClick={() => handleDelete(item.file_id)} >
                                                <i class="fa-solid fa-trash" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className='text-center'>
                            <img src="../assets/img/icon/infographic.png" className='w-25' alt="" />
                            <h5 className='text-red'>{errorMessage}</h5>
                        </div>
                    )}
                </div>
            </div>
            {open &&
                <FormEditrefund open={open} handleClose={() => setOpen(false)} data={dataEdit} fetchData={handleSearch} />
            }
        </div>
    )
}

export default DocumentRefund