import React, { useState, useEffect } from 'react'
import { Input, Loader } from 'rsuite';
import { Config, imageUrl } from '../../config/connenct';
import axios from 'axios';
import moment from 'moment/moment';
import numeral from 'numeral';
import FormEditDebtcom from '../debt/Form-EditDebtcom';
import Alert from '../../utils/config';
import Swal from 'sweetalert2';
export default function DocCommitoin() {
  const api = Config.urlApi;
  const url = imageUrl.url;

  const [values, setValues] = useState({
    contractNumber: '',
    statusUse: '1',
  });

  const [itemDoct, setItemDoct] = useState([]);
  const [insuranceId, setInsuranceId] = useState(null);
  const handleShowCommitoin = async (data) => {
    if (!data || !data.incuranec_code) {
      console.error("Invalid data or insurance code missing");
      return;
    }
    setInsuranceId(data.incuranec_code);
    setValues((prevValues) => ({
      ...prevValues,
      contractNumber: data.contract_number,
    }));

  };

  const fetchDataPay = async () => {
    try {
      const response = await fetch(`${api}pays/contract/${insuranceId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonData = await response.json(); // Parse JSON data
      setItemDoct(jsonData); // Update itemDoct with the response data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const [itemContract, setItemContract] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const handleContract = async () => {
    if (values.contractNumber.length > 4) {
      try {
        const response = await axios.post(api + 'insurance/contract', values);
        const jsonData = response.data;
        setItemContract(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const [show, setShow] = useState(false);
  const [data, setData] = useState({});
  const handleEdit = (item) => {
    setShow(true);
    setData(item);
  }

  const handleDelete = (data) => {
    try {
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
      axios.post(api + 'pays/delete', data)
        .then(function (respones) {
          if (respones.status === 200) {
            fetchDataPay()
            Alert.successData(respones.data.message)
          } else {
            Alert.errorData(respones.data.error)
          }
        });
      }
    })  
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  }




  useEffect(() => {
    handleContract();
    fetchDataPay();
  }, [values, insuranceId]);


  const [loadingFile, setLoadingFile] = useState({});
  const downloadFilePay = async (fileName, index) => {
    setLoadingFile((prevState) => ({ ...prevState, [index]: true }));
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
    } finally {
      setLoadingFile((prevState) => ({ ...prevState, [index]: false }));
    }
  }
  return (
    <div className="panel panel-inverse flex-1 m-0 d-flex flex-column overflow-hidden">
      <div className="panel-body p-0 flex-1 overflow-hidden">
        <div className="file-manager h-100" id="fileManager">
          <div className="file-manager-toolbar">
            <button type="button" className="btn shadow-none text-body border-0" disabled>
              <i className="fa fa-lg me-1 fa-plus" /> File
            </button>
            <button type="button" className="btn shadow-none text-body border-0" disabled>
              <i className="fa fa-lg me-1 fa-plus" /> Folder
            </button>
            <button type="button" className="btn shadow-none text-body  border-0" disabled >
              <i className="fa fa-lg me-1 fa-copy" /> Copy
            </button>
            <button type="button" className="btn shadow-none text-body  border-0" disabled >
              <i className="fa fa-lg me-1 fa-move" /> Move
            </button>
            <button type="button" className="btn shadow-none text-body border-0" disabled>
              <i className="fa fa-lg me-1 fa-upload" /> Upload
            </button>
            <button type="button" className="btn shadow-none text-body  border-0" disabled  >
              <i className="fa fa-lg me-1 fa-download" /> Download
            </button>
            <button type="button" disabled className="btn shadow-none text-body"  >
              <i className="fa fa-lg me-1 fa-xmark" /> Delete
            </button>
            <button type="button" className="btn shadow-none text-body  border-0" disabled  >
              <i className="fa fa-lg me-1 fa-rotate-left" /> Restore
            </button>
            <button type="button" className="btn shadow-none text-body  border-0" disabled >
              <i className="fa fa-lg me-1 fa-file" /> Rename
            </button>
            <button type="button" className="btn shadow-none text-body  border-0" disabled >
              <i className="fa fa-lg me-1 fa-pen" /> Edit
            </button>
            <button type="button" className="btn shadow-none text-body  border-0" disabled >
              <i className="fa fa-lg me-1 fa-pen-to-square" /> HTML Editor
            </button>
            <button type="button" className="btn shadow-none text-body  border-0" disabled >
              <i className="fa fa-lg me-1 fa-key" /> Permissions
            </button>
            <button type="button" className="btn shadow-none text-body  border-0" disabled >
              <i className="fa fa-lg me-1 fa-file" /> View
            </button>
            <button type="button" className="btn shadow-none text-body  border-0" disabled>
              <i className="fa fa-lg me-1 fa-lock-open" /> Extract
            </button>
            <button type="button" className="btn shadow-none text-body  border-0" disabled >
              <i className="fa fa-lg me-1 fa-file-zipper" /> Compress
            </button>
          </div>
          <div className="file-manager-container">
            <div className="file-manager-sidebar">
              <div className="file-manager-sidebar-mobile-toggler">
                <button type="button" className="btn btn-danger" data-toggle-class="file-manager-sidebar-mobile-toggled" data-target="#fileManager"  >
                  <i className="fas fa-lg fa-search" />
                </button>
              </div>

              <div class="file-manager-sidebar-content">
                <div data-scrollbar="true" data-height="100%" className="p-1">
                  <Input value={values.contractNumber} onChange={(e) => setValues({ ...values, contractNumber: e })} placeholder="ຄົນຫາເລກທີ່ສັນຍາ..." />
                  <div className="file-tree mb-3 mt-2 h-550px " data-scrollbar="true">
                    <div class="file-node has-sub expand selected">
                      {
                        itemContract.length > 0 ?
                          itemContract.map((item) => (
                            <a href="javascript:;" onClick={() => handleShowCommitoin(item)} className="file-link">
                              <span className={`file-info ${values.contractNumber === item.contract_number ? 'text-blue' : ''}`}>
                                <span class="file-icon"><i class="far fa-file-code fa-lg text-body text-opacity-50"></i></span>
                                <span class="file-text">{item.contract_number} </span>
                              </span>
                            </a>
                          )) : (
                            <a href="javascript:;" class="file-link text-red">
                              <img src="./assets/img/icon/infographic.png" className='w-100' alt="" />
                            </a>
                          )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="file-manager-content d-flex flex-column">
              <div class="flex-1 overflow-hidden">
                <div data-scrollbar="true" data-skip-mobile="true" data-height="100%" className="scrollable-div">
                  <table class="table table-striped table-borderless table-sm m-0 text-nowrap">
                    <thead>
                      <tr class="border-bottom">
                        <th class="w-10px ps-10px"></th>
                        <th class="">ລາຍການ</th>
                        <th class="">ວັນທີຈ່າຍ</th>
                        <th class="text-end">ຄ່າທຳນຽມປະກັນໄພລວມ</th>
                        <th class="text-end">ຄ່າຄອມ</th>
                        <th class="">ໝາຍເຫດ</th>
                        <th class="text-center">ເອກະສານ</th>
                        <th class="text-center">ການຕັ້ງຄ່າ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemDoct.length > 0 ?
                        itemDoct.map((item, index) => (
                          <tr key={index}>
                            <td class="ps-10px text-center"><i class="far fa-file-image text-teal fa-lg"></i></td>
                            <td class="">{item.status_doc === 1 ? 'ຈ່າຍຄ່າປະກັນໄພ' : item.status_doc === 2 ? 'ຈ່າຍຄ່າຄອມຕົວແທນ' : 'ຈ່າຍຄ່າຄອມ oac'}</td>
                            <td class="">{moment(item.doccm_date).format('DD/MM/YYYY')}</td>
                            <td class="text-end"> {numeral(item.insuranc_included).format('0,0.00')} {item.genus}</td>
                            <td class="text-end">
                              {numeral(item.status_doc === 1 ? item.insuranc_included : item.status_doc === 2 ? item.expences_pays_taxes : item.incom_finally).format('0,0.00')} {item.genus}
                            </td>
                            <td class="">{item.debt_remark}</td>
                            <td class="text-center">
                              <button className='btn btn-xs btn-danger rounded-pill' onClick={() => downloadFilePay(`${url}docPay/${item.docom_file}`, index)} disabled={loadingFile[index]}> {loadingFile[index] ? (<Loader content="ກຳລັງໂຫລດ..." />) : (<><i class="fa-solid fa-cloud-arrow-down" /> ໂຫລດ</>)} </button>
                            </td>
                            <td class="text-center">
                              <button type="button" class="btn btn-xs btn-blue me-2" onClick={() => handleEdit(item)}><i class="fa-solid fa-pen-to-square"></i></button>
                              <button type="button" class="btn btn-xs btn-danger" onClick={() => handleDelete(item)} ><i class="fa-solid fa-trash"></i></button>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={8} className='text-center text-danger'>ບໍ່ພົບລາຍການທີ່ທ່ານຊອກຫາ....</td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
      <FormEditDebtcom
        show={show}
        handleClose={() => setShow(false)}
        fetchData={fetchDataPay}
        data={data} />
    </div>

  )
}
