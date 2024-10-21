import React, { useState, useEffect } from 'react'
import { DatePicker, Input, InputGroup, SelectPicker, Placeholder, Loader, Dropdown, IconButton, InputPicker } from 'rsuite'
import { useCompany, useType, useTypeBuyer } from '../../config/select-option';
import { Config, imageUrl } from '../../config/connenct';
import axios from 'axios';
import moment from 'moment';
import numeral from 'numeral';
import { ViewInsturance } from '../invioce/view-data-insturance';
import FileDownloadIcon from '@rsuite/icons/FileDownload';
function HistoryInsurnceBay() {
    const api = Config.urlApi;
    const url = imageUrl.url;
    const itemcm = useCompany();
    const itemType = useType();
    const typebuyer = useTypeBuyer();
    const customId = localStorage.getItem('company_agent_id')

    const [itemOption, setItemOption] = useState([]);
    const handleOption = async (name, value) => {
        try {
            const response = await fetch(api + `options/t/${value}`);
            const jsonData = await response.json();
            setItemOption(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setData({
            ...data, [name]: value
        })
    };
    const dataOption = itemOption.map(item => ({ label: item.options_name, value: item.options_Id }));
    const [data, setData] = useState({
        years_start: new Date().getFullYear(),
        years_end: new Date().getFullYear(),
        company_id_fk: '',
        insurance_type_fk: '',
        custom_id_fk: customId,
        option_id_fk: '',
    })
    const handleChange = (name, value) => {
        setData({
            ...data, [name]: value
        })
    }
    const [isLoading, setIsLoading] = useState(true)
    const [itemData, setItemData] = useState([]);
    const [dataFilter, setDataFilter] = useState([]);
    const fetchReport = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(api + 'report/historybuy', data);
            setItemData(response.data);
            setDataFilter(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const Filter = (event) => {
        setItemData(dataFilter.filter(n =>
            n.contract_number.toLowerCase().includes(event) ||
            n.currency_name.toLowerCase().includes(event)
        ))
    }

    // =================== custom pages============
    const [currentPage, setcurrentPage] = useState(1);
    const [itemsPerPage, setitemsPerPage] = useState(100);
    const handleShowLimit = (value) => {
        setitemsPerPage(value);
    };
    // const [pageNumberLimit, setpageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

    const handlePageClick = (event) => {
        setcurrentPage(Number(event.target.id));
        setI(indexOfLastItem + 1)
    };

    const pages = [];
    for (let i = 1; i <= Math.ceil(itemData.length / itemsPerPage); i++) {
        pages.push(i);
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = itemData.slice(indexOfFirstItem, indexOfLastItem);

    const [i, setI] = useState(1);
    const qtyItem = itemData.length;
    const renderPageNumbers = pages.map((number) => {
        if (number > minPageNumberLimit && number <= maxPageNumberLimit) {
            return (
                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                    <span role="button" id={number} onClick={handlePageClick} className="page-link border-blue">
                        {number}
                    </span>
                </li>
            );
        } else {
            return (
                <li key={number} className="page-item active" >
                    <span role="button" className="page-link border-blue">1</span>
                </li>
            )
        }
    });

    const handleNextbtn = () => {
        setcurrentPage(currentPage + 1);

        if (currentPage + 1 > maxPageNumberLimit) {
            setmaxPageNumberLimit(maxPageNumberLimit + 5);
            setminPageNumberLimit(minPageNumberLimit + 5);
        }
    };

    const handlePrevbtn = () => {
        setcurrentPage(currentPage - 1);
        setI(indexOfLastItem - 1)

        if ((currentPage - 1) % 5 === 0) {
            setmaxPageNumberLimit(maxPageNumberLimit - 5);
            setminPageNumberLimit(minPageNumberLimit - 5);
        }
    };


    const handleEportEcel = () => {

    }
    const handleEportPdf = () => {

    }


    const [view, setView] = useState(false);
    const handleView = (index, value) => {
        setView(value)
    }

    const sumData = currentItems.reduce((acc, item) => {
        const currency = item.currency_name;
        if (!acc[currency]) {
            acc[currency] = {
                initial_fee: 0,
                money_taxes: 0,
                registration_fee: 0,
                insuranc_included: 0,
                genus: item.genus
            };
        }

        acc[currency].initial_fee += parseFloat(item.initial_fee);
        acc[currency].money_taxes += parseFloat(item.money_taxes);
        acc[currency].registration_fee += parseFloat(item.registration_fee);
        acc[currency].insuranc_included += parseFloat(item.insuranc_included);

        return acc;
    }, {});
    const formatNumber = (num) => numeral(num).format('0,00');

    // ============

    const renderIconButton = (props, ref) => {
        return (
            <IconButton {...props} ref={ref} icon={<i class="fa-regular fa-folder-open" />} size='xs' color="blue" appearance="primary" />
        );
    };

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

    useEffect(() => {
        fetchReport();
    }, [data, customId])

   
    
    const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i <= 10; i++) {
    years.push({ label: (currentYear - i).toString(), value: currentYear - i });
  }

  const [selectedStartYear, setSelectedStartYear] = useState(currentYear); // Default to current year
  const [selectedEndYear, setSelectedEndYear] = useState(currentYear + 1); // Default to next year

  const handleStartYearChange = (value) => {
    setData({
        ...data, years_start: value
    })
    setSelectedStartYear(value); 
    if (value > selectedEndYear) {
      setSelectedEndYear(value);
    }
  };

  const endYears = [];
  for (let i = selectedStartYear; i <= currentYear + 0; i++) {
    endYears.push({ label: i.toString(), value: i });
  }


    return (
        <div id="content" className="app-content p-0 bg-component">

            <div class="app-content-padding px-4 py-3">
                <div class="d-lg-flex mb-lg-3 mb-2">
                    <h3 class="page-header mb-0 flex-1 fs-20px">ປະຫວັດການຕໍ່ສັນຍາປະກັນໄຟ</h3>
                    <span class="d-none d-lg-flex align-items-center">
                        <button onClick={handleEportPdf} class="btn btn-danger btn-sm d-flex me-2 pe-3 rounded-3">
                            <i class="fa-solid fa-file-pdf fs-18px me-2 ms-n1"></i> Export PDF
                        </button>
                        <button onClick={handleEportEcel} class="btn btn-success btn-sm d-flex me-2 pe-3 rounded-3">
                            <i class="fa-solid fa-cloud-arrow-down fs-18px me-2 ms-n1"></i>
                            Export Excel
                        </button>
                    </span>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-4 col-md-2 col-6">
                        <label htmlFor="" className='form-label'>ປີສິນສຸດ</label>
                        <SelectPicker  data={years} defaultValue={data.years_start} onChange={(e)=>handleStartYearChange(e)}   block  />
                    </div>
                    <div className="col-sm-4 col-md-2 col-6">
                        <label htmlFor="" className='form-label'>ຫາປີສິນສຸດ</label>
                        <SelectPicker  data={endYears} defaultValue={data.years_end} onChange={(e) => handleChange('years_end', e)} block />
                    </div>
                    <div className="col-sm-4 col-md-3">
                        <label htmlFor="" className='form-label'>ບໍລິສັດປະກັນໄພ</label>
                        <SelectPicker block data={itemcm} onChange={(e) => handleChange('company_id_fk', e)} />
                    </div>
                    <div className="col-sm-4 col-md-3 col-6">
                        <label htmlFor="" className='form-label'>ປະເພດປະກັນ</label>
                        <SelectPicker block data={itemType} onChange={(e) => handleOption('insurance_type_fk', e)} />
                    </div>
                    <div className="col-sm-4 col-md-2 col-6">
                        <label htmlFor="" className='form-label'>ທາງເລືອກ</label>
                        <SelectPicker block data={dataOption} onChange={(e) => handleChange('option_id_fk', e)} />
                    </div>
                </div>
                <div class="d-lg-flex align-items-center mb-3">
                    <div class="d-lg-flex d-none align-items-center text-nowrap">
                        ສະແດງ:
                        <select onChange={(e) => handleShowLimit(e.target.value)} class="form-select form-select-sm ms-2 ps-2 pe-30px">
                            <option value={100}>100</option>
                            <option value={205}>250</option>
                            <option value={500}>500</option>
                            <option value={1000}>1000</option>
                            <option value={qtyItem}>-All-</option>
                        </select>
                    </div>
                    <div class="d-lg-block d-none ms-2 text-body text-opacity-50">
                        ລາຍການ
                    </div>
                    <ul class="pagination pagination-sm mb-0 ms-auto justify-content-center">
                        <InputGroup inside>
                            <InputGroup.Addon> <i className="fas fa-search" /> </InputGroup.Addon>
                            <Input block onChange={(e) => Filter(e)} className='w-250px' placeholder='ຄົ້ນຫາ...' />
                        </InputGroup>
                    </ul>
                </div>
                <div class="table-responsive">
                    <table class="table table-striped  table-bordered align-middle w-100 text-nowrap">
                        <thead className="fs-14px bg-header">
                            <tr>
                                <th width='1%' className="text-center">ລ/ດ</th>
                                <th className="">ເລກທີສັນຍາ</th>
                                <th className="">ວັນທີເລີມ</th>
                                <th className="">ວັນທີສິນສຸດ</th>
                                <th className="">ບໍລິສັດປະກັນໄພ</th>
                                <th className="">ປະເພດປະກັນ	</th>
                                <th className="">ທາງເລືອກ</th>
                                <th className="">ທະບຽນລົດ</th>
                                <th className="text-end">ຄ່າທຳນຽມເບື້ອງຕົ້ນ</th>
                                <th className="text-end">ອາກອນ</th>
                                <th className="text-end">ຄ່າອາກອນ</th>
                                <th className="text-end">ຄ່າລົງທະບຽນ</th>
                                <th className="text-end">ຄ່າປະກັນໄພລວມ</th>
                                <th width='10%' className="text-center">ການຕັ້ງຄ່າ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={27}>
                                        <Placeholder.Grid rows={6} columns={20} active />
                                        <Loader size="lg" center content="ກຳລັງໂຫດ......" />
                                    </td>
                                </tr>
                            ) : (
                                currentItems.length > 0 ? (
                                    <>
                                        {currentItems.map((item, key) => (
                                            <tr key={key}>
                                                <td className='text-center'>{item.idAuto}</td>
                                                <td>{item.contract_number}</td>
                                                <td>{moment(item.contract_start_date).format('DD/MM/YYYY')}</td>
                                                <td>{moment(item.contract_end_date).format('DD/MM/YYYY')}</td>
                                                <td>{item.com_name_lao}</td>
                                                <td>{item.type_in_name}</td>
                                                <td>{item.options_name}</td>
                                                <td>{item.car_registration}</td>
                                                <td className='text-end'>{numeral(item.initial_fee).format('0,00')} {item.genus}</td>
                                                <td className='text-center'>{item.percent_taxes}%</td>
                                                <td className='text-end'>{numeral(item.money_taxes).format('0,00')} {item.genus}</td>
                                                <td className='text-end'>{numeral(item.registration_fee).format('0,00')} {item.genus}</td>
                                                <td className='text-end'>{numeral(item.insuranc_included).format('0,00')} {item.genus}</td>
                                                <td className='text-center'>
                                                    <Dropdown renderToggle={renderIconButton} placement="bottomEnd">
                                                        {item.file_doc.map((val, index) =>
                                                            <Dropdown.Item icon={<FileDownloadIcon />} onClick={() => handleDownload(`${url}docfile/${val.file_insurance}`)}> {val.file_insurance}</Dropdown.Item>
                                                        )}
                                                    </Dropdown>
                                                    <button type='button' onClick={() => handleView(true, item)} className='btn btn-xs btn-orange ms-2'> <i class="fa-solid fa-eye"></i> </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {Object.keys(sumData).map((currency, key) => (
                                            <tr key={`${key}`}>
                                                <td colSpan={8} className='text-end'>ລວມຍອດຄ້າງຮັບທັງໝົດ ({currency})</td>
                                                <td className='text-end'>{formatNumber(sumData[currency].initial_fee)} {sumData[currency].genus}</td>
                                                <td></td>
                                                <td className='text-end'>{formatNumber(sumData[currency].money_taxes)} {sumData[currency].genus}</td>
                                                <td className='text-end'>{formatNumber(sumData[currency].registration_fee)} {sumData[currency].genus}</td>
                                                <td className='text-end'>{formatNumber(sumData[currency].insuranc_included)} {sumData[currency].genus}</td>
                                                <td></td>
                                            </tr>
                                        ))}
                                    </>
                                ) : (<tr><td colSpan={27} className='text-center text-red'>ບໍ່ພົບຂໍ້ມູນທີ່ມີການຄົ້ນຫາ.......</td></tr>)
                            )}
                        </tbody>
                    </table>

                </div>
                <div class="d-md-flex align-items-center">
                    <div class="me-md-auto text-md-left text-center mb-2 mb-md-0">
                        ສະແດງ 1 ຫາ {itemsPerPage} ຂອງ {qtyItem} ລາຍການ
                    </div>
                    <ul className="pagination  mb-0 ms-auto justify-content-center">
                        <li className="page-item "><span role="button" onClick={handlePrevbtn} className={`page-link  ${currentPage === pages[0] ? 'disabled' : 'border-blue'}`} >ກອນໜ້າ</span></li>
                        {minPageNumberLimit >= 1 ? (
                            <li className="page-item"><span role="button" className="page-link disabled">...</span></li>
                        ) : ''}
                        {renderPageNumbers}
                        {pages.length > maxPageNumberLimit ? (
                            <li className="page-item"><span role="button" className="page-link disabled">...</span></li>
                        ) : ''}
                        <li className="page-item"><span role="button" onClick={handleNextbtn} className={`page-link  ${currentPage === pages[pages.length - 1] ? 'disabled' : 'border-blue'}`}>ໜ້າຕໍ່ໄປ</span></li>
                    </ul>
                </div>
                {view && (
                    <div class="panel panel-inverse panel-expand">
                        <div class="panel-heading bg-red-700 text-white ui-sortable-handle">
                            <h4 class="panel-title fs-16px"><span role='button' onClick={() => handleView(false, '')} className='fs-16px me-2'><i class="fa-solid fa-circle-arrow-left"></i></span>  ລາຍລະອຽດສັນຍາ</h4>
                            <div class="panel-heading-btn">
                                <button type='button' onClick={() => handleView(false, '')} class="btn btn-xs btn-icon btn-danger" ><i class="fa fa-times"></i></button>
                            </div>
                        </div>
                        <div class="panel-body">
                            <ViewInsturance data={view} />
                        </div>
                    </div>
                )}

            </div>
        </div >
    )
}

export default HistoryInsurnceBay