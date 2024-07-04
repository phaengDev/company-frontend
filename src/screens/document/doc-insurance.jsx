import React, { useState, useEffect } from 'react'
import { Input, InputGroup, Placeholder, Loader } from 'rsuite'
import { Config,imageUrl } from '../../config/connenct';
import axios from 'axios';
import moment from 'moment';
export default function DocInsurance() {
  const api = Config.urlApi;
  const url = imageUrl.url;
  const [itemCustom, setItemCustom] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const showCustomBuyer = async () => {
    try {
      const response = await axios.post(api + 'custom/all');
      const jsonData = response.data;
      console.log(jsonData);
      setItemCustom(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [valueName, setValueName] = useState("")
  const [filterDate, setFilterDate] = useState([]);
  const handleInputChange = async (value) => {
    setValueName(value)
    if (value) {
      setFilterDate(itemCustom.filter(n =>
        n.customer_name.toLowerCase().includes(value) ||
        n.custom_uuid.toLowerCase().includes(value)));
    } else {
      setFilterDate([]); // Clear filter if input is empty
    }
  };

  const [itemData, setItemData] = useState([]);
  const [loadingView, setLoadingView] = useState(false)
  const preventDefault = async (id) => {
    setLoadingView(true)
    try {
      const response = await axios.get(api + 'insurance/viewBuy/' + id);
      const jsonData = response.data;
      setItemData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingView(false);
    }
  }

//======================


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
    // Handle error as needed
  }
};

  useEffect(() => {
    showCustomBuyer();
  }, [])
  return (
    <div id="content" className="app-content d-flex flex-column p-0">
      <div className="panel panel-inverse flex-1 m-0 d-flex flex-column overflow-hidden">
        <div className="panel-body p-0 flex-1 overflow-hidden">
          <div className="file-manager h-100" id="fileManager">
            <div className="file-manager-toolbar">
              <button type="button" className="btn shadow-none text-body border-0">
                <i className="fa fa-lg me-1 fa-plus" /> File
              </button>
              <button type="button" className="btn shadow-none text-body border-0">
                <i className="fa fa-lg me-1 fa-plus" /> Folder
              </button>
              <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled="" >
                <i className="fa fa-lg me-1 fa-copy" /> Copy
              </button>
              <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled="" >
                <i className="fa fa-lg me-1 fa-move" /> Move
              </button>
              <button type="button" className="btn shadow-none text-body border-0">
                <i className="fa fa-lg me-1 fa-upload" /> Upload
              </button>
              <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled=""  >
                <i className="fa fa-lg me-1 fa-download" /> Download
              </button>
              <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled=""  >
                <i className="fa fa-lg me-1 fa-xmark" /> Delete
              </button>
              <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled=""  >
                <i className="fa fa-lg me-1 fa-rotate-left" /> Restore
              </button>
              <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled="" >
                <i className="fa fa-lg me-1 fa-file" /> Rename
              </button>
              <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled="" >
                <i className="fa fa-lg me-1 fa-pen" /> Edit
              </button>
              <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled="" >
                <i className="fa fa-lg me-1 fa-pen-to-square" /> HTML Editor
              </button>
              <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled="" >
                <i className="fa fa-lg me-1 fa-key" /> Permissions
              </button>
              <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled="" >
                <i className="fa fa-lg me-1 fa-file" /> View
              </button>
              <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled="">
                <i className="fa fa-lg me-1 fa-lock-open" /> Extract
              </button>
              <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled="" >
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
                <div className="file-manager-sidebar-content "  >
                  <div data-scrollbar="true" data-height="100%" className="p-3 ">
                    <Input onChange={(e) => handleInputChange(e)} placeholder='ຄົ້ນຫານຜູ້ຊື້ປະກັນ' />
                    <div className="file-tree mb-3 mt-2 h-550px " data-scrollbar="true">
                      {
                        isLoading ? (
                          <>
                            <Placeholder.Paragraph rows={5} />
                            <Loader size='md' center content="ກຳລັງໂຫລດ...." />
                          </>
                        ) : (
                          <>
                            {
                              filterDate.length > 0 ? (
                                filterDate.map((item, key) => (
                                  <>
                                    <div className="file-node" key={key}>
                                      <a href="javascript:;" className="file-link active" onClick={() => preventDefault(item.custom_uuid)}>
                                        <span className="file-info">
                                          <span className="file-icon">
                                            <img src="assets/img/logo/user1.png" className="w-100" alt="User" />
                                          </span>
                                          <span className="file-text">{item.customer_name}</span>
                                        </span>
                                      </a>
                                    </div>
                                    <hr className='mt-2 mb-1' />
                                  </>
                                ))) : (
                                <div className="file-node">
                                  <img src="./assets/img/icon/infographic.png" className='w-100' alt="" />
                                </div>
                              )}
                          </>
                        )
                      }

                    </div>
                  </div>
                </div>

              </div>
              <div className="file-manager-content d-flex flex-column">
                <div className="mb-0 text-nowrap p-2 border-bottom">
                  <div className="row">
                    <div className="col-sm-3">
                      <InputGroup inside>
                        <Input />
                        <InputGroup.Button>
                          <i className='fas fa-search' />
                        </InputGroup.Button>
                      </InputGroup>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden ">
                  <div data-scrollbar="true" data-skip-mobile="true" data-height="100%" className="p-0 h-550px" >
                    <div className="row">
                      <div className="col-sm-12">
                        {loadingView === true ? (
                          <>
                            {/* <Placeholder.Paragraph rows={8} /> */}
                            <div className='p-4'>
                            <Placeholder.Paragraph graph="image" active className='mb-3' />
                            <Placeholder.Paragraph graph="image" active className='mb-3' />
                            <Placeholder.Paragraph graph="circle" active />
                            <Loader size='lg' center content="ກຳລັງໂຫລດ...." vertical />
                            </div>
                          </>
                        ) : (
                          <>
                            {itemData.length > 0 ? (
                              <div className="table-responsive">
                                <table className="table table-striped table-borderless table-sm m-0 text-nowrap">
                                  <thead>
                                    <tr className="border-bottom">
                                      <th className="w-10px ps-10px" />
                                      <th className="px-10px">ເລກທີສັນຍາ</th>
                                      <th className="px-10px">ວັນທີເລີມ</th>
                                      <th className="px-10px">ວັນທີສິນສຸດ</th>
                                      <th className="px-10px">ປະເພດປະກັນ</th>
                                      <th className="px-10px">ທາງເລືອກ</th>
                                      <th className="px-10px">ບໍລິສັດປະກັນໄພ</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {itemData.map((row, index) =>
                                      <tr>
                                        <td className="ps-10px border-0 text-center">
                                        <a href="#" class="btn btn-xs btn-danger dropdown-toggle" data-bs-toggle="dropdown">
                                        <i class="fa fa-caret-down"></i>
                                      </a>
                                      <div class="dropdown-menu dropdown-menu-start">
                                      <a href="javascript:;" class="px-3 text-green fs-14px"><i class="fa-solid fa-file-circle-plus "></i> ເພີ່ມເອກະສານ</a>
                                      <div class="dropdown-divider"></div>
                                      {row.file_doc.map((file,index)=>
                                      <div class="dropdown-item"><a href="javascript:;" onClick={() => handleDownload(`${url}docfile/${file.file_insurance}`)}><i class="fa-solid fa-cloud-arrow-down fs-4"></i></a> : {file.file_insurance}</div>
                                      )}
                                      </div>
                                         
                                        </td>
                                        <td className="px-10px border-0">{row.contract_number}</td>
                                        <td className="px-10px">{moment(row.contract_start_date).format('DD/MM/YYYY')}</td>
                                        <td className="px-10px">{moment(row.contract_end_date).format('DD/MM/YYYY')}</td>
                                        <td className="px-10px">{row.type_in_name}</td>
                                        <td className="px-10px border-0">{row.options_name}</td>
                                        <td className="px-10px border-0">{row.com_name_lao}</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className='text-center'>
                                <img src='./assets/img/icon/protection.png' className='w-25' />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
