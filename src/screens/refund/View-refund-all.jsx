import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import {imageUrl } from '../../config/connenct';
import moment from 'moment';
import numeral from 'numeral';
export default function ViewRefundAll({ show, handleClose, data }) {
    const url = imageUrl.url;
const typeUser=localStorage.getItem('user_type');

    const [item, setItem] = useState('');
    useEffect(() => {
        if (data) {
            setItem(data)
        }
    }, [data]);

    const handleDownload = async (fileUrl,constact) => {
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

    return (
        <Modal show={show} size={'fullscreen'} onHide={handleClose}>
            <Modal.Header className='bg-red-700 text-white py-2' closeButton>
                <Modal.Title ><span className='text-orange' onClick={handleClose} role='button'><i class="fa-solid fa-circle-arrow-left fs-3"></i></span> ລາຍລະອຽດສັນຍາປະກັນໄພ {typeUser}</Modal.Title>
            </Modal.Header>
            <Modal.Body className='p-0'>
            <div class="container p-0">
            <table class="policy-table ">
                <thead>
                    <tr>
                        <th colspan="4" class="header ">
                            <img src={item.com_logo ? (url + 'logo/' + item.com_logo) : ('./assets/img/logo/oac.png')} alt="Logo" className="logo mt-3" />
                            <div class="company-details">
                                <h3> {item.com_name_lao}</h3>
                                <h3 className=''> {item.com_name_eng}</h3>
                                <p>Tel: {item.com_tel}</p>
                            </div>
                        </th>
                    </tr>
                    <tr>
                        <th colspan="4" class="title">Details of insurance reimbursement</th>
                    </tr>
                    <tr>
                        <th>ເລກທີສັນຍາ:</th>
                        <td colSpan={3}>{item.contract_number}</td>
                       
                    </tr>
                    <tr>
                        <th>ປະເພດປະກັນ:</th>
                        <td >{item.type_in_name} </td>
                        <th className='text-end'>ທາງເລືອກ:</th>
                        <td >{item.options_name} </td>
                    </tr>
                </thead>
                <tbody>
                    <tr class="section">
                        <th colspan="4" className='fs-17px'>ຂໍ້ມູນຜູ້ຊື້ປະກັນ</th>
                    </tr>
                    <tr>
                        <th>ຊື່ລູກຄ້າ:</th>
                        <td colspan="3">{item.customer_name}</td>
                    </tr>
                    <tr>
                        <th>ທີ່ຢູ່:</th>
                        <td colspan="3">{item.village_name + ', ' + item.district_name + ', ' + item.province_name}</td>
                    </tr>
                    <tr>
                        <th>ເບີໂທລະສັບ:</th>
                        <td colspan="3">{item.registra_tel}</td>
                    </tr>
                    <tr class="section">
                        <th colspan="4" className='fs-17px'>ຕົວແທນຂາຍ</th>
                    </tr>
                    <tr>
                        <th>ຊື່ຕົວແທນ:</th>
                        <td colspan="3">{item.agent_name}</td>
                    </tr>
                    <tr>
                        <th>ເບີໂທລະສັບ:</th>
                        <td colspan="3">{item.agent_tel}</td>
                    </tr>
                    <tr>
                        <th>ເປິເຊັນຂາຍ (%):</th>
                        <td>{item.percent_agent} %</td>
                        <th className='text-end'>ຄ່າຄອມມິດຊັ່ນ :</th>
                        <td>{numeral(item.balance_agent).format('0,0.00')} {item.genus}</td>
                    </tr>
                    <tr class="section">
                        <th colspan="4" className='fs-17px'>ຂໍ້ມູນຄ່າທຳນຽມປະກັນໄພ</th>
                    </tr>
                    <tr>
                        <th>ຄ່າທຳນຽມເບື້ອງຕົ້ນ:</th>
                        <td colSpan={3}>{numeral(item.retrun_balance).format('0,0.00')} {item.genus}</td>
                    </tr>
                   
                    <tr>
                        <th>ເປີເຊັນຮັບ (%): </th>
                        <td>{item.percent_oac} %</td>
                        <th className='text-end'>ຄ່າຄອມຮັບ:</th>
                        <td>{numeral(item.balance_oac).format('0,0.00')} {item.genus}</td>
                    </tr>
                    <tr>
                        <th>ເປີເຊັນຈ່າຍ (%): </th>
                        <td>{item.percent_agent} %</td>
                        <th className='text-end'>ຄ່າຄອມຈ່າຍ:</th>
                        <td>{numeral(item.balance_agent).format('0,0.00')} {item.genus}</td>
                    </tr>
                    
                    <tr>
                        <th>ຍອດຫຼັງຫັກຄອມ:</th>
                        <td colSpan={3}>{numeral(item.retrun_balance-item.balance_oac).format('0,0.00')} {item.genus}</td>
                    </tr>
                    <tr>
                        <th colspan='4' className='fs-17px'>ຕິດຕາມໜີ້</th>
                    </tr>
                    <tr>
                        <th>ສະຖານະຈ່າຍຄືນລູກຄ້າ:</th>
                        <td>{item.status_company === 1 ? 'ຄ້າງຈ່າຍຄືນລູກຄ້າ (' + item.day_cpn + ' )' : 'ຈ່າຍຄືນແລ້ວ'}
                        {
                                item.file_pay && (
                                    item.file_pay.filter(pay => pay.status_pay === 1)
                                        .map((pay, key) => (
                                            <div className='fs-11px text-blue'>{pay.desciption}</div>
                                        ))
                                )
                            }

                        </td>
                        <th className='text-end'>ວັນທີ:</th>
                        <td>{moment(item.company_date).format('DD/MM/YYYY')}
                            {
                                item.file_pay && (
                                    item.file_pay.filter(pay => pay.status_pay === 1)
                                        .map((pay, key) => (
                                            <span className='btn btn-danger btn-xs float-end mx-1' onClick={() => downloadFilePay(`${url}docPay/${pay.file_doct}`)} role='button'><i class="fa-solid fa-cloud-arrow-down" /></span>
                                        ))
                                )
                            }
                        </td>
                    </tr>
                    
                       
                    <tr>
                        <th>ສະຖານະຄືນຄອມມິດຊັ່ນ:</th>
                        <td>{item.status_agent === 1 ? 'ຄ້າງຄືນຄ່າຄອມມິດຊັ່ນ (' + item.day_agent + ' )' : (<><i className="fas fa-check text-green" />  ຄືນແລ້ວ</>)} 
                        {
                                item.file_pay &&(
                                item.file_pay
                                    .filter(pay => pay.status_pay === 2)
                                    .map((pay, key) => (
                            <div className='fs-11px text-blue'>{pay.desciption}</div>
                        )  ))}
                        </td>
                        <th className='text-end'>ວັນທີ:</th>
                        <td>{moment(item.agent_date).format('DD/MM/YYYY')}
                            {
                                item.file_pay &&(
                                item.file_pay
                                    .filter(pay => pay.status_pay === 2)
                                    .map((pay, key) => (
                                        <span className='btn btn-danger btn-xs float-end mx-1' onClick={() => downloadFilePay(`${url}docPay/${pay.file_doct}`)} role='button'><i class="fa-solid fa-cloud-arrow-down" /> </span>
                                  )  ))}
                        </td>
                    </tr>
                    {typeUser === '1' && (
                    <tr>
                        <th>ສະຖານະຈ່າຍຄືນບໍລິສັດ:</th>
                        <td>{item.status_oac === 1 ? 'ຄ້າງຈ່າຍບໍລິສັດ (' + item.day_oac + ' )' : 'ຈ່າຍແລ້ວ'}
                        {item.file_pay &&(
                                item.file_pay
                                    .filter(pay => pay.status_pay === 3)
                                    .map((pay, key) => (
                                        <div className='fs-11px text-blue'>{pay.desciption}</div>
                                   ) ))}
                        </td>
                        <th className='text-end'>ວັນທີ:</th>
                        <td>{moment(item.oac_date).format('DD/MM/YYYY')}
                            {item.file_pay &&(
                                item.file_pay
                                    .filter(pay => pay.status_pay === 3)
                                    .map((pay, key) => (
                                        <span className='btn btn-danger btn-xs float-end mx-1' onClick={() => downloadFilePay(`${url}docPay/${pay.file_doct}`)} role='button'><i class="fa-solid fa-cloud-arrow-down" /> </span>
                                   ) ))}
                        </td>
                    </tr>
                  
                     )}
                </tbody>
            </table>
            {item.file_doc &&(
                <div className='link ' onClick={() => handleDownload(`${url}docfile/${item.file_doc}`,`${item.contract_number}`)} role='button'><i class="fa-solid fa-cloud-arrow-down text-red" /> {item.file_doc}</div>
            )}
        </div>
            </Modal.Body>
        </Modal>
    )
}
