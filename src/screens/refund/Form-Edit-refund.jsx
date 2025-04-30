import React, { useState, useEffect } from 'react'
import { Modal, Button, Input, DatePicker } from 'rsuite';
import { Config } from '../../config/connenct';
import axios from 'axios';
import Alert from '../../utils/config';
function FormEditrefund({ open, handleClose, data, fetchData }) {
    const api = Config.urlApi;

    const [values, setValues] = useState({
        file_id: data.file_id,
        file_doct: data.file_doct,
        file_pay: null,
        desciption: data.desciption,
        file_dates: new Date(data.file_dates),
    })
    const handledUseRetrun = (name, value) => {
        setValues({
            ...values, [name]: value
        })
    }
    const handledSelectFile = (event) => {
        const file = event.target.files[0];
        if (file) {
            setValues((prev) => ({
                ...prev,
                file_pay: file, // Store the file object for upload
            }));
        }
    };


  const handledSubmit = (e) => {
    e.preventDefault();
    const imputData = new FormData();
    for (const key in values) {
      imputData.append(key, values[key])
    }
    try {
      axios.post(api + 'retrun/retrun-edit', imputData)
        .then(function (respones) {
          if (respones.status === 200) {
            fetchData();
            handleClose();
            Alert.successData(respones.data.message)
          } else {
            Alert.errorData(respones.data.message)
          }
        });
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  }

    useEffect(() => {

    }, [data]);
    return (
        <Modal open={open} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title>ຢືນຢັນການສົ່ງເງິນຄືນ</Modal.Title>
            </Modal.Header>
            <form onSubmit={handledSubmit}>
                <Modal.Body>
                    <div className="form-group mb-2">
                        <label htmlFor="" className='form-label'>ໝາຍເຫດ</label>
                        <Input as='textarea' value={values.desciption} onChange={(e) => handledUseRetrun('desciption', e)} placeholder='ໝາຍເຫດ....' required />
                    </div>
                    <div className="row">
                        <div className="form-group col-sm-8 mb-2">
                            <label htmlFor="" className='form-label'>ວັນທີ</label>
                            <DatePicker block oneTap value={values.file_dates} onChange={(e) => handledUseRetrun('file_dates', e)} format='dd/MM/yyyy' />
                        </div>

                        <div className="form-group col-sm-4 mb-2">
                            <label htmlFor="" className='form-label'>ໄຟລ໌ແນບ</label>
                            <label className={`btn ${values.file_pay ? 'btn-success' : 'btn-primary'} w-100 text-start`}>
                                {values.file_pay ? (
                                    <> <i class="fa-solid fa-file-pen"></i> ເລືອກໃຫມ່ </>
                                ) : (
                                    <>  <i class="fa-solid fa-paperclip"></i> ເລືອກໄຟລ໌ແນບ</>
                                )}
                                <input type="file" hidden onChange={handledSelectFile} accept='image/*,.pdf' />
                            </label>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type='submit' appearance="primary"> ແກ້ໄຂ</Button>
                    <Button onClick={handleClose} color='red' appearance="primary"> ຍົກເລີກ</Button>
                </Modal.Footer>
            </form>
        </Modal>
    )
}

export default FormEditrefund