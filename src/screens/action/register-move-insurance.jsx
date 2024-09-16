import React, { useEffect, useState } from 'react'
import { Button, SelectPicker, Loader, Placeholder, Input, InputGroup } from 'rsuite'
import { useCompany, useType, useAgent } from '../../config/select-option';
import { Config } from '../../config/connenct';
import axios from 'axios';
import moment from 'moment';
import Alert from '../../utils/config';
export default function MoveInsurance() {
    const api = Config.urlApi;
    const itemcm = useCompany();
    const itemType = useType();
    const itemAgent = useAgent();
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

    //=======================
    const [dataCus, setDataCus] = useState([]);
    const [loading, setLoading] = useState(true);
    const showCustom = async () => {
        try {
            const response = await fetch(api + `custom/option/2202`);
            const jsonData = await response.json();
            setDataCus(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            setLoading(false)
        }
    };
    const itemCustom = dataCus.map(item => ({
        label: item.customer_name, value: item.custom_uuid
    }))

    const [data, setData] = useState({
        custom_id_fk: '',
        company_id_fk: '',
        insurance_type_fk: '',
        agent_id_fk: '',
        type_buyer_fk: '',
        option_id_fk: ''
    })
    const handleChange = (name, value) => {
        setData({
            ...data,[name]: value
        })
    }

    const [isLoading, setIsLoading] = useState(true);
    const [itemData, setItemData] = useState([]);
    const [filter, setFilter] = useState([]);
    const fetchDatas = async () => {
        try {
            const response = await axios.post(api + 'report/move', data);
            setItemData(response.data);
            setFilter(response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const Filter = (event) => {
        setItemData(filter.filter(n => n.contract_number.toLowerCase().includes(event)))
    }
    //===========================
    const [contract_end, setContractEnd] = useState('');
    const [checkedItems, setCheckedItems] = useState({});
    const [isAllChecked, setIsAllChecked] = useState(false);
  
    const handleCheckAll = () => {
      const newCheckedItems = {};
      if (!isAllChecked) {
        itemData.forEach((item, index) => {
          newCheckedItems[index] = true;
        });
      }
      setCheckedItems(newCheckedItems);
      setIsAllChecked(!isAllChecked);
    };
  
    const handleCheckboxChange = (index) => {
      const newCheckedItems = { ...checkedItems, [index]: !checkedItems[index] };
      setCheckedItems(newCheckedItems);
      setIsAllChecked(Object.keys(newCheckedItems).length === itemData.length && Object.values(newCheckedItems).every(Boolean));
    };

    
    const handleSubmit = () => {
        const selectedIds = itemData.filter((item, index) => checkedItems[index])
        .map(item => ({ incuranec_code: item.incuranec_code })); 
        const formData = {
                    contract_end,
                    contract_start: selectedIds,
                };
                try {
                axios.post(api + 'insurance/movedata', formData)
                .then(function (respones) {
                    if (respones.status === 200) {
                        Alert.successData(respones.data.message)
                        fetchDatas();
                        setView(false);
                        setContractEnd('')
                    }else{
                        Alert.errorData(respones.data.message)
                    }
                });
            } catch (error) {
              console.error('Error inserting data:', error);
            }
    }

    //================================================
    const [view, setView] = useState(false)
    const handleSetMove = (value) => {
            setContractEnd(value)
        if (value !==null) {
            setView(true);
        }else{
            setView(false);
        }
    }

    useEffect(() => {
        showCustom();
        fetchDatas();
        setCheckedItems(itemData.map(() => false));
    }, [data])
    return (
        <div id="content" className="app-content p-0 bg-component">
            <div class="app-content-padding px-4 py-3">
                <div class="d-lg-flex mb-lg-3 mb-2">
                    <h3 class="page-header mb-0 flex-1 fs-20px">ຈັດການຍ້າຍຂໍ້ມູນ ສັນຍາປະກັນໄພ</h3>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-4 col-md-3">
                        <label htmlFor="" className='form-label'>ຜູ້ຊື້ປະກັນທີ່ຍ້າຍອອກ <span className='text-red'>*</span> </label>
                        <SelectPicker block data={itemCustom} onChange={(e) => handleChange('custom_id_fk', e)} loading={loading} placeholder='ເລືອກ' />
                    </div>
                    <div className="col-sm-4 col-md-3">
                        <label htmlFor="" className='form-label'>ຕົວແທນຂາຍ</label>
                        <SelectPicker block data={itemAgent} onChange={(e) => handleChange('agent_id_fk', e)} placeholder='ເລືອກ' />
                    </div>
                    <div className="col-sm-4 col-md-2">
                        <label htmlFor="" className='form-label'>ບໍລິສັດປະກັນໄພ</label>
                        <SelectPicker block data={itemcm} onChange={(e) => handleChange('company_id_fk', e)} placeholder='ເລືອກ' />
                    </div>
                    <div className="col-sm-4 col-md-2  col-6">
                        <label htmlFor="" className='form-label'>ປະເພດປະກັນ</label>
                        <SelectPicker block data={itemType} onChange={(e) => handleOption('insurance_type_fk', e)} placeholder='ເລືອກ' />
                    </div>
                    <div className="col-sm-4 col-md-2  col-6">
                        <label htmlFor="" className='form-label'>ທາງເລືອກ</label>
                        <SelectPicker block data={dataOption} onChange={(e) => handleChange('option_id_fk', e)} placeholder='ເລືອກ' />
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-sm-4 col-lg-3">
                        <label htmlFor="" className='form-label'> ເລືອກບໍລິສັດທີ່ຕ້ອງການຍ້າຍເຂົ້າເພີ່ມ <span className='text-red'>*</span></label>
                        <SelectPicker data={itemCustom} value={contract_end} onChange={(e) => handleSetMove(e)} loading={loading} placeholder='ເລືອກ' block />
                    </div>
                    <div className="col-sm-3 mt-4">
                    {view===true  && (
                    <Button color="blue" onClick={handleSubmit} appearance="primary" startIcon={<i class="fa-solid fa-share-from-square" />}> ຢືນຢັນການຍ້າຍຂໍ້ມູນ</Button>
                    )}  
                    </div>
                    <div className="col-sm-2 col-lg-3"></div>
                    <div className="col-sm-3 ">
                        <label htmlFor="" className='form-label'>ຄົ້ນຫາ</label>
                        <InputGroup inside >
                        <InputGroup.Addon><i className='fas fa-search' /></InputGroup.Addon>
                        <Input block onChange={(event)=>Filter(event)} placeholder='ຄົ້ນຫາ....' />
                        </InputGroup>
                        </div>
                </div>
                <div class="table-responsive">
                    <table class="table table-striped  table-bordered align-middle w-100 text-nowrap">
                        <thead className="fs-14px bg-header">
                            <tr>
                                <th width='1%' className="text-center sticky-col first-col">ລ/ດ</th>
                                <th width='10%' className="text-center sticky-col first-col">
                                    <input class="form-check-input" type="checkbox"  checked={isAllChecked} onChange={handleCheckAll} />
                                </th>
                                <th className="">ຊື່ລູກຄ້າ</th>
                                <th className="">ເລກທີສັນຍາ</th>
                                <th className="text-center">ວັນທີເລີມ</th>
                                <th className="text-center">ວັນທີສິນສຸດ</th>
                                <th className="">ບໍລິສັດປະກັນໄພ</th>
                                <th className="">ປະເພດຜູ້ຊື້</th>
                                <th className="">ປະເພດປະກັນ	</th>
                                <th className="">ທາງເລືອກ</th>
                                <th className="">ຕົວແທນຂາຍ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={13} className='text-center'>
                                        <Placeholder.Grid rows={5} columns={6} active />
                                        <Loader size='lg' center content="ກຳລັງໂຫລດ...." />
                                    </td>
                                </tr>
                            ) : (
                                itemData.length > 0 ? (
                                    <>
                                        {itemData.map((item, index) =>
                                            <tr key={index}>
                                                <td className='text-center bg-white sticky-col first-col'>{index + 1}</td>
                                                <td className='text-center bg-white sticky-col first-col'>
                                                    <input class="form-check-input" type="checkbox"  checked={checkedItems[index] || false}
                                                 onChange={() => handleCheckboxChange(index)}  />
                                                </td>
                                                <td className=''>{item.customer_name}</td>
                                                <td className=''>{item.contract_number}</td>
                                                <td className='text-center'>{moment(item.contract_start_date).format('DD/MM/YYYY')}</td>
                                                <td className='text-center'>{moment(item.contract_end_date).format('DD/MM/YYYY')}</td>
                                                
                                                <td>{item.com_name_lao}</td>
                                                <td>{item.type_buyer_name}</td>
                                                <td>{item.type_in_name}</td>
                                                <td>{item.options_name}</td>
                                                <td>{item.agent_name}</td>
                                            </tr>
                                        )}
                                    </>
                                ) : (
                                    <tr className='border-0'>
                                        <td colSpan={13} className='text-center border-0 bg-white'>
                                            <img src="./assets/img/cover/cover-board.png" className='h-150px' alt="" />
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
