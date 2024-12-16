import React, { useEffect, useState } from 'react'
import { Modal, Input, Button, DatePicker } from 'rsuite';
import numeral from 'numeral';
import axios from 'axios';
import { Config } from '../../config/connenct';
import Alert from '../../utils/config';
import moment from 'moment';
const FormEditDebtcom=({ show, handleClose, data,fetchData })=> {
    const api=Config.urlApi
    // ================================


const [values,setValues]=useState({
    docoment_id:'',
    contract_code_fk:'',
    docom_file:'',
    status_doc:'',
    debt_remark:'',
    doccm_date:new Date(),
    status_pay:1,
    fileNameck:''
})
    const handleChange=(name,value)=>{
        setValues({
            ...values,[name]:value
        })
    }
   
    const handleSubmit = (event) => {
        event.preventDefault();
        const imputData = new FormData();
        for (const key in values) {
            imputData.append(key, values[key])
        }
        try {
            axios.post(api + 'pays/edit', imputData)
                .then(function (respones) {
                    if (respones.status === 200) {
                        fetchData();
                        handleClose();
                        Alert.successData(respones.data.message)
                    } else {
                        Alert.errorData(respones.data.error)
                    }
                });
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    }

    const [fileName, setFileName] = useState('');
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            setValues({
                ...values, docom_file: file,
                fileNameck: data.docom_file
            })
        } else {
            setFileName('');
            setValues({
                ...values, docom_file: '',
                fileNameck: ''
            })
        }
    };
    const closeFile = () => {
        setFileName('');
        setValues({
           ...values, docom_file: '',
           fileNameck: ''
        })
    }

    useEffect(() => {
        setValues({
            ...values,
            docoment_id: data.docoment_id,
            contract_code_fk: data.contract_code_fk,
            status_doc: data.status_doc,
            debt_remark: data.debt_remark,
            doccm_date: new Date(data.doccm_date),
            fileNameck: ''
        })
      }, [data]);

  return (
    <Modal open={show} size='lg' onClose={handleClose}>
    <form onSubmit={handleSubmit}>
        <Modal.Body className='px-3'>
            <h4 className='text-center'>ຟອມຊຳລະໜີ້</h4>
            <div className="mb-2 row">
                <table className='table' width={'100%'}>
                    <tr>
                        <td>ເລກທີສັນຍາ: <span className='fs-18px'>{data.contract_number}</span> </td>
                        <td rowSpan={3}>
                            <span className='fs-16px'>ຍອດເງິນ</span>
                            <h3 className='text-red'>
                                {numeral(data.status_doc===1 ? data.insuranc_included : data.status_doc===2 ? data.expences_pays_taxes: data.incom_finally).format('0,0.00')} {data.genus}</h3>
                        </td>
                    </tr>
                    <tr>
                        <td>ວັນທີເລີມ: {moment(data.contract_start_date).format('DD/MM/YYYY')}</td>
                    </tr>
                    <tr>
                        <td>ວັນທີສິນສຸດ: {moment(data.contract_end_date).format('DD/MM/YYYY')}</td>
                    </tr>
                </table>
                <div className="form-group col-sm-7">
                    <label htmlFor="" className='form-label'>ວັນທີຈ່າຍ</label>
                    <DatePicker oneTap format="dd/MM/yyyy" onChange={(e) => handleChange('doccm_date', e)} value={values.doccm_date} block />
                </div>
                <div className="form-group col-sm-5">
                    <label htmlFor="" className='form-label'>ເອກະສານແນບ</label>
                    <div className="mb-1">
                        <label className='btn btn-blue fs-15px'> <i class="fa-regular fa-folder-open fs-5"></i> ເລືອກໄຟລ໌....
                            <input type='file' onChange={handleFileChange} className='hide' />
                        </label>
                    </div>
                    {fileName &&
                        <div class="alert alert-success alert-dismissible fade show">
                            <strong className='fs-16px ms-2'><i class="fa-solid fa-paperclip" /> </strong>
                            {fileName}
                            <button type="button" onClick={closeFile} class="btn-close"></button>
                        </div>
                    }
                </div>
                <div className="form-group">
                    <label htmlFor="" className='form-label'>ໝາຍເຫດ</label>
                    <Input as='textarea' value={values.debt_remark} onChange={(e) => handleChange('debt_remark', e)} block />
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button type='submit' appearance="primary" >ບັນທຶກການຈ່າຍ </Button>
            <Button color='red' appearance="primary" onClick={handleClose}>
                ຍົກເລີກ
            </Button>
        </Modal.Footer>
    </form>
</Modal>
  )
}
export default FormEditDebtcom
