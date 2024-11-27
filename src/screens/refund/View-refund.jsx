import React,{useEffect,useState} from 'react'
import { Modal } from 'rsuite';
import { Config,imageUrl } from '../../config/connenct';
import moment from 'moment';
import numeral from 'numeral';
function ViewRefund({open,handleClose,data}) {
const url=imageUrl.url;
const [item, setItem] = useState('');

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

const downloadFilePay =()=>{

}

useEffect(()=>{
    if(data){
        setItem(data)
    }
},[data])
  return (
    <Modal overflow={true} open={open} onClose={handleClose} size="full">
    <Modal.Header>
      <Modal.Title className='py-1'><span className="text-danger me-2" onClick={handleClose} role='button'><i class="fa-solid fa-circle-arrow-left fs-3"></i></span> ລາຍລະອຽດສັນຍາ</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <div class="container">
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
                        <th>ເປິເຊັນຂາຍ (%):</th>
                        <td>{item.percent_oac} %</td>
                        <th className='text-end'>ຄ່າຄອມມິດຊັ່ນ :</th>
                        <td>{numeral(item.balance_oac).format('0,0.00')} {item.genus}</td>
                    </tr>
                    <tr class="section">
                        <th colspan="4" className='fs-17px'>ຂໍ້ມູນຄ່າທຳນຽມປະກັນໄພ</th>
                    </tr>
                    <tr>
                        <th>ຄ່າທຳນຽມເບື້ອງຕົ້ນ:</th>
                        <td colSpan={3}>{numeral(item.retrun_balance).format('0,0.00')} {item.genus}</td>
                    </tr>
                   
                    <tr>
                        <th>ເປີເຊັນຈ່າຍ (%): </th>
                        <td>{item.percent_oac} %</td>
                        <th className='text-end'>ຄ່າຄອມຈ່າຍ:</th>
                        <td>{numeral(item.balance_oac).format('0,0.00')} {item.genus}</td>
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
                        <td>{item.status_company === 1 ? 'ຄ້າງຈ່າຍຄືນລູກຄ້າ (' + item.day_cpn + ' )' : 'ຈ່າຍຄືນແລ້ວ'}</td>
                        <th className='text-end'>ວັນທີ:</th>
                        <td>{moment(item.company_date).format('DD/MM/YYYY')}
                            {/* {
                                item.file_comits && (
                                    item.file_comits.filter(pay => pay.status_doc === 1)
                                        .map((pay, key) => (
                                            <span className='float-end text-red' onClick={() => downloadFilePay(`${url}docPay/${pay.docom_file}`)} role='button'><i class="fa-solid fa-download" /> {pay.docom_file}</span>
                                        ))
                                )
                            } */}
                        </td>
                    </tr>
                    <tr>
                        <th>ສະຖານະຮັບຄອມຄືນ:</th>
                        <td>{item.status_oac === 1 ? 'ຄ້າງຈ່າຍຕົວແທນ (' + item.day_oac + ' )' : 'ຈ່າຍແລ້ວ'}</td>
                        <th className='text-end'>ວັນທີຈ່າຍ:</th>
                        <td>{moment(item.oac_date).format('DD/MM/YYYY')}
                            {/* {
                                item.file_comits  &&(
                                item.file_comits
                                    .filter(pay => pay.status_doc === 2)
                                    .map((pay, key) => (
                                        <span className='float-end text-red' onClick={() => downloadFilePay(`${url}docPay/${pay.docom_file}`)} role='button'><i class="fa-solid fa-download" /> {pay.docom_file}</span>
                                  )  ))} */}
                        </td>
                    </tr>
                    {/* <tr>
                        <th>ສະຖານະຮັບ:</th>
                        <td>{item.status_oac === 1 ? 'ຄ້າງຮັບ (' + item.day_oac + ' )' : 'ຮັບແລ້ວ'}</td>
                        <th className='text-end'>ວັນທີຮັບ:</th>
                        <td>{moment(item.oac_date).format('DD/MM/YYYY')}
                            {item.file_comits &&(
                                item.file_comits
                                    .filter(pay => pay.status_doc === 3)
                                    .map((pay, key) => (
                                        <span className='float-end text-red' onClick={() => downloadFilePay(`${url}docPay/${pay.docom_file}`)} role='button'><i class="fa-solid fa-download" /> {pay.docom_file}</span>
                                   ) ))}
                        </td>
                    </tr> */}
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

export default ViewRefund