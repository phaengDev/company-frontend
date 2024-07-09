import React, { useState } from 'react';
import { Modal, Button, Uploader } from 'rsuite';
import axios from 'axios';
import { Config } from '../../config/connenct';
import {useToaster,Message} from 'rsuite';
const FormAddDoct = ({ id,idbuy, open, handleClose,preventDefault }) => {
    const api=Config.urlApi;
    const toaster = useToaster();
  const [fileList, setFileList] = useState([]);
  const handleAddDoct = async () => {
    const formData = new FormData();
    formData.append('contract_code_fk', id);
    
    fileList.forEach((file, index) => {
      formData.append(`files`, file.blobFile, file.name);
    });
    try {
        const response = await axios.post(api+'upload/create', formData)
          .then(function (response) {
            if (response.status === 200) {
                handleClose();
                setFileList([]);
                preventDefault(idbuy)
                toaster.push(
                  <Message type="success" showIcon> {response.data.message} </Message>,
                  { placement: 'topEnd' }
                );
            }
        });
       
      } catch (error) {
        console.error('Error uploading files:', error);
      }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Modal.Header>
        <Modal.Title>ເພີ່ມເອກະສານ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Uploader
          multiple
          listType="picture-text"
          defaultFileList={fileList}
          onChange={fileList => setFileList(fileList)}
          renderFileInfo={(file, fileElement) => (
            <>
              <span>ຊື່​ເອ​ກະ​ສານ: {file.name}</span>
              <p>File URL: {file.url}</p>
            </>
          )}
        >
          <Button color='fred' appearance="primary"><i class="fa-solid fa-folder-open me-2"></i>  ເລືອກໄຟລ໌...</Button>
        </Uploader>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleAddDoct} appearance="primary">
          Ok
        </Button>
        <Button onClick={handleClose} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormAddDoct;
