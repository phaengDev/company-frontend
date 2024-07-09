import React, { useEffect, useState } from 'react'
import { Modal, Input, Button, DatePicker } from 'rsuite';
import numeral from 'numeral';
import axios from 'axios';
import { Config } from '../../config/connenct';
import Alert from '../../utils/config'
const FormPayDebtoac=({ show, handleClose, data,fetchReport,showTotalDebt,setCheckedItems })=> {
    const api=Config.urlApi
    // ================================
    
const sumData = data.reduce((acc, item) => {
    const currency = item.currency_name;
    if (!acc[currency]) {
        acc[currency] = {
            initial_fee: 0,
            pre_tax_profit: 0,
            incom_money: 0,
            incom_finally: 0,
        };
    }
    acc[currency].initial_fee += parseFloat(item.initial_fee);
    acc[currency].pre_tax_profit += parseFloat(item.pre_tax_profit);
    acc[currency].incom_money += parseFloat(item.incom_money);
    acc[currency].incom_finally += parseFloat(item.incom_finally);
    return acc;
}, {});

const formatNumber = (num) => numeral(num).format('0,00');


const [values,setValues]=useState({
    itemList: [],
    debt_remark:'',
    doccm_date:new Date(),
    status_doc:3,
    status_pay:1
})
    const handleChange=(name,value)=>{
        setValues({
            ...values,[name]:value
        })
    }
   
    const handlePaydebt = () => {
        try {
            axios.post(api + 'pays/createMT', values)
                .then(function (respones) {
                    if (respones.status === 200) {
                        handleClose()
                        fetchReport();
                        showTotalDebt();
                        setCheckedItems([])
                        Alert.successData(respones.data.message)
                    } else {
                        Alert.errorData(respones.data.error)
                    }
                });
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    }


    useEffect(() => {
        if (data && data.length > 0) {
          setValues((prevState) => ({
            ...prevState,
            itemList: data.map((item) => ({
            contract_code_fk: item.incuranec_code,
            contract_no: item.contract_number,
            })),
          }));
        }
      }, [data]);
  return (
    <Modal overflow={true} size={'lg'} open={show} onClose={handleClose}>
    <Modal.Header>
        <Modal.Title className='py-2'>ຕັດຍອດໜີ້ໂອເອຊີ </Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle w-100 text-nowrap">
                <thead className="fs-14px bg-header">
                    <tr>
                        <th width='1%' className="text-center bg-header sticky-col first-col">ລ/ດ</th>
                        <th className="">ເລກທີສັນຍາ</th>
                        <th className="text-end">ຄ່າທຳນຽມເບື້ອງຕັ້ນ	</th>
                        <th className="text-center">ເປີເຊັນຮັບ</th>
                        <th className="text-end">ຄອມຮັບ</th>
                        <th className="text-end">ອາກອນ</th>
                        <th className="text-end">ເປັນເງິນ</th>
                        <th className="text-end">ຄອມຈ່າຍຫຼັງອາກອນ</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, key) => (
                        <tr key={key}>
                            <td className='text-center bg-white sticky-col first-col'>{key + 1}</td>
                            <td className='text-center'>{item.contract_number}</td>
                            <td className='text-end'>{numeral(item.initial_fee).format('0,00')} {item.genus}</td>
                            <td className='text-center'>{item.precent_incom}%</td>
                            <td className='text-end'>{numeral(item.pre_tax_profit).format('0,00')} {item.genus}</td>
                            <td className='text-center'>{item.percent_akorn}%</td>
                            <td className='text-end'>{numeral(item.incom_money).format('0,00')} {item.genus}</td>
                            <td className='text-end'>{numeral(item.incom_finally).format('0,00')} {item.genus}</td>
                        </tr>
                    ))}
                    {Object.keys(sumData).map((currency, key) => (
                    <tr key={`${key}`}>
                        <td colSpan={2} className='text-end'>ລວມຍອດຮັບທັງໝົດ ({currency})</td>
                        <td className='text-end'>{formatNumber(sumData[currency].initial_fee)}</td>
                        <td></td>
                        <td className='text-end'>{formatNumber(sumData[currency].pre_tax_profit)}</td>
                        <td></td>
                        <td className='text-end'>{formatNumber(sumData[currency].incom_money)}</td>
                        <td className='text-end'>{formatNumber(sumData[currency].incom_finally)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        <div className="form-group mb-2">
            <label htmlFor="" className='form-label'>ວັນທີຈ່າຍ</label>
            <DatePicker oneTap value={values.doccm_date} format='dd/MM/yyyy' onChange={(e)=>handleChange('doccm_date',e)}  block/>
        </div>
        <div className="form-group">
            <label htmlFor="" className='form-label'>ໝາຍເຫດ</label>
            <Input as='textarea' value={values.debt_remark} onChange={(e)=>handleChange('debt_remark',e)} placeholder='ໝາຍເຫດ......' block/>
        </div>
    </Modal.Body>
    <Modal.Footer>
        <Button onClick={handlePaydebt} appearance="primary"> ບັນທຶກຕັດໜີ້ </Button>
        <Button onClick={handleClose} color='red' appearance="primary">  ຍົກເລີກ</Button>
    </Modal.Footer>
</Modal>
  )
}
export default FormPayDebtoac