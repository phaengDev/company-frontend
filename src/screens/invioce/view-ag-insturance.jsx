import React from 'react'
import '../../View-insurance.css'
import { calculateAge } from '../../utils/utils';
import moment from 'moment';
import numeral from 'numeral';
import { imageUrl } from '../../config/connenct';
export const ViewInsturance = ({ data }) => {
    const url = imageUrl.url
    const item = data;
    const age = calculateAge(item.agent_dob);


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
        <div class="container">
            <table class="policy-table ">
                <thead>
                    <tr>
                        <th colspan="4" class="header ">
                            <img src={item.com_logo ? (url + 'logo/' + item.com_logo) : ('./assets/img/logo/oac.png')} alt="Logo" class="logo" />
                            <div class="company-details">
                                <h3> {item.com_name_lao}</h3>
                                <h3 className=''> {item.com_name_eng}</h3>
                                <p>Tel: {item.com_tel}</p>
                            </div>
                        </th>
                    </tr>
                    <tr>
                        <th colspan="4" class="title">Details of the insurance policy</th>
                    </tr>
                    <tr>
                        <th>ເລກທີສັນຍາ:</th>
                        <td>{item.contract_number}</td>
                        <th className='text-end'>ວັນທີຄຸມຄ້ອງ</th>
                        <td>{moment(item.contract_start_date).format('DD/MM/YYYY')} - {moment(item.contract_end_date).format('DD/MM/YYYY')}</td>
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
                        <td colspan="3">{item.village_name + ', ' + item.cut_district_ncme + ', ' + item.cut_province_name}</td>
                    </tr>
                    <tr>
                        <th>ເບີໂທລະສັບ:</th>
                        <td colspan="3">{item.registra_tel}</td>
                    </tr>
                    {item.status_ins === 2 && (
                        <>
                            <tr class="section">
                                <th colspan="4" className='fs-17px'>2. ຂໍ້ມູນລົດ</th>
                            </tr>
                            <tr>
                                <th>ທະບຽນລົດ:</th>
                                <td colspan="3">{item.car_registration}</td>
                            </tr>
                            <tr>
                                <th>ເລກຈັກ:</th>
                                <td>{item.vehicle_number}</td>
                                <th>ເລກຖັງ:</th>
                                <td>{item.tank_number}</td>
                            </tr>
                        </>
                    )}

                    {item.beneficiaries && item.beneficiaries.length > 0 && (
                        <>

                            {item.beneficiaries.map((rows, key) => (
                                <React.Fragment key={key}>
                                    <tr class="section">
                                        <th colspan="4" className='fs-17px text-blue'>ຂໍ້ມູນຜູ້ທີ່ໄດ້ຮັບຄວາມຄຸ້ມຄອງ ( ຜູ້ທີ່ {key + 1})</th>
                                    </tr>
                                    <tr>
                                        <th>ຊື່ ແລະ ນາມສະກຸນ:</th>
                                        <td>{rows.user_fname} {rows.user_lname}</td>
                                        <th className='text-end'>ວັນເດືອນປີເກິດ:</th>
                                        <td>{moment(rows.user_dob).format('DD/MM/YYYY')}</td>
                                    </tr>
                                    <tr>
                                        <th>ເບີໂທລະສັບ:</th>
                                        <td>{rows.user_tel}</td>
                                        <th className='text-end'>ທີ່ຢູ່:</th>
                                        <td>{rows.user_village + ', ' + rows.district_name + ', ' + rows.province_name}</td>
                                    </tr>
                                    <tr>
                                        <th>ສະຖານະ:</th>
                                        <td>{rows.status_name} </td>
                                        <th className='text-end'>ລະຫັດບັດ :</th>
                                        <td>{rows.no_contract}</td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </>
                    )}
                   
                    <tr>
                        <th>ເປິເຊັນຂາຍ (%):</th>
                        <td>{item.percent_eps} %</td>
                        <th className='text-end'>ຄ່າຄອມມິດຊັ່ນ :</th>
                        <td>{numeral(item.expences_pays_taxes).format('0,00')}</td>
                    </tr>
                    <tr class="section">
                        <th colspan="4" className='fs-17px'>ຂໍ້ມູນຄ່າທຳນຽມປະກັນໄພ</th>
                    </tr>
                    <tr>
                        <th>ຄ່າທຳນຽມເບື້ອງຕົ້ນ:</th>
                        <td>{numeral(item.initial_fee).format('0,00')}</td>
                        <th className='text-end'>ຄ່າອາກອນ {item.percent_taxes}%:</th>
                        <td>{numeral(item.money_taxes).format('0,00')}</td>
                    </tr>
                    <tr>
                        <th>ຄ່າລົງທະບຽນ:</th>
                        <td>{numeral(item.registration_fee).format('0,00')}</td>
                        <th className='text-end'>ຄ່າປະກັນໄພລວມ:</th>
                        <td>{numeral(item.insuranc_included).format('0,00')}</td>
                    </tr>
                   
                    <tr>
                        <th>ຄອມຈ່າຍ ({item.percent_eps}%):</th>
                        <td>{numeral(item.pays_advance_fee).format('0,00')}</td>
                        <th className='text-end'>ຫັກອາກອນ: ({item.percent_fee_eps}%)</th>
                        <td >{numeral(item.money_percent_fee).format('0,00')}</td>
                    </tr>
                    <tr>
                        <th>ຄອມຈ່າຍຫຼັງຫັກອາກອນ:</th>
                        <td colSpan={3}>{numeral(item.expences_pays_taxes).format('0,00')}</td>
                       
                    </tr>
                    <tr>
                        <th colspan='4' className='fs-17px'>ຕິດຕາມໜີ້</th>
                    </tr>
                    <tr>
                        <th>ສະຖານະຈ່າຍບໍລິສັດ:</th>
                        <td>{item.status_company === 1 ? 'ຄ້າງຈ່າຍບໍ່ລິສັດ (' + item.day_company + ' )' : 'ຈ່າຍແລ້ວ'}</td>
                        <th className='text-end'>ວັນທີ:</th>
                        <td>{moment(item.company_date).format('DD/MM/YYYY')}
                            {
                                item.file_comits && (
                                    item.file_comits.filter(pay => pay.status_doc === 1)
                                        .map((pay, key) => (
                                            <span className='float-end text-red' onClick={() => downloadFilePay(`${url}docPay/${pay.docom_file}`)} role='button'><i class="fa-solid fa-download" /> {pay.docom_file}</span>
                                        ))
                                )
                            }
                        </td>
                    </tr>
                    <tr>
                        <th>ສະຖານະຈ່າຍຕົວແທນ:</th>
                        <td>{item.status_agent === 1 ? 'ຄ້າງຈ່າຍຕົວແທນ (' + item.day_agent + ' )' : 'ຈ່າຍແລ້ວ'}</td>
                        <th className='text-end'>ວັນທີຈ່າຍ:</th>
                        <td>{moment(item.agent_date).format('DD/MM/YYYY')}
                            {
                                item.file_comits  &&(
                                item.file_comits
                                    .filter(pay => pay.status_doc === 2)
                                    .map((pay, key) => (
                                        <span className='float-end text-red' onClick={() => downloadFilePay(`${url}docPay/${pay.docom_file}`)} role='button'><i class="fa-solid fa-download" /> {pay.docom_file}</span>
                                  )  ))}
                        </td>
                    </tr>
                   
                </tbody>
            </table>
            {item.file_doc.map((doc, key) => (
                <div className='link ' onClick={() => handleDownload(`${url}docfile/${doc.file_insurance}`)} role='button'><i class="fa-solid fa-cloud-arrow-down text-red" /> {doc.file_insurance}</div>
            ))}

        </div>
    )
}
