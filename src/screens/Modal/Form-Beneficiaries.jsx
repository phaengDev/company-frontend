import React, { useState, useEffect } from 'react'
import { Input, DateInput, SelectPicker, Button, Modal, Tabs } from 'rsuite';
import { useProvince, useStatus, useDistrict } from '../../config/select-option';
import { Config } from '../../config/connenct';
import Alert from '../../utils/config';
import axios from 'axios';
import moment from 'moment';
import { Notific } from '../../utils/Notific';
const FormBeneficiaries = ({ show, handleClose, idIn }) => {
    const api = Config.urlApi;
    const itemPv = useProvince();
    const itemStatus = useStatus();

    const [itemDistrict, setItemDistrict] = useState([]);
    const handelShowDist = async (value) => {
        try {
            const response = await fetch(api + `district/pv/${value}`);
            const jsonData = await response.json();
            setItemDistrict(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const dataDist = itemDistrict.map(item => ({ label: item.district_name, value: item.district_id }));

    const [inputs, setInputs] = useState({
        insurance_id_fk: idIn,
        statuStaff: [{
            no_contract: '',
            user_fname: '',
            user_lname: '',
            user_gender: 'F',
            user_dob: '',
            user_tel: '',
            user_district_fk: '',
            user_village: '',
            status_use: ''
        }]
    }
    );
    const handleAddRow = () => {
        const newRow = {
            no_contract: '',
            user_fname: '',
            user_lname: '',
            user_gender: 'F',
            user_dob: '',
            user_tel: '',
            user_district_fk: '',
            user_village: '',
            status_use: ''
        };

        setInputs((prevState) => ({
            ...prevState,
            statuStaff: [...prevState.statuStaff, newRow],
        }));
    };
    const handleRemoveRow = (index) => {
        if (inputs.statuStaff.length > 1) {
            const updatedStatuStaff = inputs.statuStaff.filter((_, rowIndex) => rowIndex !== index);
            setInputs((prevState) => ({
                ...prevState,
                statuStaff: updatedStatuStaff,
            }));
        }
    };


    const handleChangeStatus = (index, name, value) => {
        const updatedStatuStaff = inputs.statuStaff.map((row, rowIndex) => {
            if (rowIndex === index) {
                return { ...row, [name]: value };
            }
            return row;
        });

        setInputs((prevState) => ({
            ...prevState,
            statuStaff: updatedStatuStaff,
        }));
    };
// ============= ເພີ່ມ ຜູ້ໄດ້ຮັບການຄຸມຄ້ອງ==============
    const handleAddBeneficiaries = () => {
        try {
            axios.post(api + 'insurance/addbene', inputs)
                .then(function (respones) {
                    if (respones.status === 200) {
                        Notific("success", "ຢືນຢັນ", respones.data.message);
                        setFrom(1)
                        setItab(1)
                        fetchBeneficiarice()
                    } else {
                        Alert.errorData(respones.data.error)
                    }
                });
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    }

    const [values, setValues] = useState({
        _id: '',
        no_contract: '',
        user_fname: '',
        user_lname: '',
        user_gender: 'F',
        user_dob: '',
        user_tel: '',
        user_district_fk: '',
        user_village: '',
        status_use: ''
    })

    const handleChangeBene = (name, value) => {
        setValues({
            ...values, [name]: value
        })
    }
    // ================  edit ຜູ້ໄດ້ຮັບການຄຸມຄ້ອງ ================
    const handleEditBeneficiaries = () => {
        try {
            axios.post(api + 'insurance/editbene', values)
                .then(function (respones) {
                    if (respones.status === 200) {
                        Notific("success", "ຢືນຢັນ", respones.data.message);
                        setFrom(1)
                        setItab(1)
                        fetchBeneficiarice()
                    } else {
                        Alert.errorData(respones.data.error)
                    }
                });
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    }

    const [idProvince,setIdProvince]=useState('')
    const [from, setFrom] = useState(2);
    const [itab, setItab] = useState(1)
    const handleEdit = (data) => {
        console.log(data)
        setFrom(3)
        setItab(3);
        setValues({
            _id: data._id,
            no_contract: data.no_contract,
            user_fname: data.user_fname,
            user_lname: data.user_lname,
            user_gender: data.user_gender,
            user_dob: new Date(data.user_dob),
            user_tel: data.user_tel,
            user_district_fk: data.user_district_fk,
            user_village: data.user_village,
            status_use: data.status_use
        });
        setIdProvince(data.provice_fk);
    }

    const handelShowDistrict=(id)=>{
        setIdProvince(id)
    }

    const itemDist = useDistrict(idProvince);
    // ============= delete ===========
    const handleDelete = (id) => {
        axios.delete(api + `insurance/bene/${id}`).then(function (response) {
            if (response.status === 200) {
                fetchBeneficiarice();
                Notific("success", "ຢືນຢັນ", "ການລົບຂໍ້ມູນສຳເລັດແລ້ວ!");
            } else {
                Notific("error", "ແຈັງເຕືອນ", "ການລົບຂໍ້ມູນບໍ່ສຳເລັດແລ້ວ!");
            }
          });
    }

    const [itemBene, setItemBene] = useState([]);
    const fetchBeneficiarice = async () => {
        try {
            const response = await fetch(api + `report/bene/${idIn}`);
            const jsonData = await response.json();
            setItemBene(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        fetchBeneficiarice();
        if (itab === 1) {
            setFrom(2)
        }
        if (idIn) {
            setInputs(prevState => ({ ...prevState, insurance_id_fk: idIn }));
          }
    }, [idIn,itab])
    return (
        <>
            <Modal
                open={show}
                onClose={handleClose}
                backdrop="static"
                keyboard={false}
                size='lg'
            >
                <Modal.Header closeButton>
                    <Modal.Title className='py-1'>ຂໍ້ມູນຜູ້ທີ່ໄດ້ຮັບຄວາມຄຸ້ມຄອງ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs activeKey={itab.toString()} onSelect={(key) => setItab(parseInt(key))} appearance="pills">
                        <Tabs.Tab eventKey='1' title={<><i class="fa-solid fa-list me-2"></i> ລາຍການຜູ້ໄດ້ຮັບຄວາມຄຸມຄ້ອງ</>}>
                            <div class="table-responsive">
                                <table class="table table-striped  table-bordered align-middle w-100 text-nowrap">
                                    <thead className="fs-14px bg-header">
                                        <tr>
                                            <th width='1%' className="text-center">ລ/ດ</th>
                                            <th className="">ຊື່ ແລະ ນາມສະກຸນ</th>
                                            <th className="text-center">ເພດ</th>
                                            <th className="">ວັນເດືອນປີເກິດ</th>
                                            <th className="">ເບີໂທລະສັບ</th>
                                            <th className="text-center" colSpan={3}>ທີ່ຢູ່</th>
                                            <th className="">ສະຖານະ</th>
                                            <th className="">ລະຫັດບັດ</th>
                                            <th width='10%' className="text-center">ການຕັ້ງຄ່າ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itemBene.map((item, index) => (
                                            <tr>
                                                <td className='text-center'>{index + 1}</td>
                                                <td>{item.user_fname} {item.user_lname}</td>
                                                <td>{item.user_gender === 'F' ? 'ເພດຍີງ' : 'ເພດຊາຍ'}</td>
                                                <td>{item.user_dob !== '' ? moment(item.user_dob).format('DD/MM/YYYY') : ''}</td>
                                                <td>{item.user_tel}</td>
                                                <td>{item.user_village}</td>
                                                <td>{item.district_name}</td>
                                                <td>{item.province_name}</td>
                                                <td>{item.status_name}</td>
                                                <td>{item.no_contract}</td>
                                                <td className='text-center'>
                                                    <button onClick={() => handleEdit(item)} className='btn btn-xs btn-green ms-2'> <i class="fa-solid fa-pen"></i> </button>
                                                    <button onClick={() => handleDelete(item._id)} className='btn btn-xs btn-danger ms-2'> <i class="fa-solid fa-trash"></i> </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Tabs.Tab>
                        {from === 2 && (
                            <Tabs.Tab eventKey='2' title={<><i class="fa-solid fa-pen me-2" />  ແບບຟອມເພີ່ມຜູ້ໄດ້ຮັບຄວາມຄຸມຄ້ອງ</>}>
                                {inputs.statuStaff.map((row, index) => (
                                    <>
                                        <fieldset className='px-3 mb-2' key={index}>
                                            <legend>ຜູ້ທີ່: {index + 1}</legend>
                                            <div className="row fs-15px mb-3">
                                                <div className="col-sm-2 col-6 mb-2">
                                                    <label htmlFor="" className='form-label'>ເພດ</label>
                                                    <select className='form-select' value={row.user_gender || 'F'} onChange={(e) => handleChangeStatus(index, 'user_gender', e.target.value)} >
                                                        <option value="F">ເພດຍິງ</option>
                                                        <option value="M">ເພດຊາຍ</option>
                                                    </select>
                                                </div>
                                                <div className="col-sm-4 col-6 mb-2">
                                                    <label htmlFor="" className='form-label'>ຊື່ແທ້</label>
                                                    <Input onChange={(e) => handleChangeStatus(index, 'user_fname', e)} placeholder="ຊື່ແທ້" />
                                                </div>
                                                <div className="col-sm-3 col-6 mb-2">
                                                    <label htmlFor="" className='form-label'>ນາມສະກຸນ</label>
                                                    <Input onChange={(e) => handleChangeStatus(index, 'user_lname', e)} placeholder="ນາມສະກຸນ" />
                                                </div>
                                                <div className="col-sm-3 col-6 mb-2">
                                                    <label htmlFor="" className='form-label'>ວັນເດືອນປີເກິດ</label>
                                                    <DateInput format='dd/MM/yyyy' oneTap block onChange={(e) => handleChangeStatus(index, 'user_dob', e)} placeholder="ວັນ/ເດືອນ/ປີ" />
                                                </div>
                                                <div className="col-sm-3 col-6 mb-2">
                                                    <label htmlFor="" className='form-label'>ແຂວງ </label>
                                                    <SelectPicker data={itemPv}  onChange={(e) => handelShowDist(e)} placeholder='ເລືອກ' block />
                                                </div>
                                                <div className="col-sm-3 col-6 mb-2">
                                                    <label htmlFor="" className='form-label'>ເມືອງ</label>
                                                    <SelectPicker data={dataDist} onChange={(e) => handleChangeStatus(index, 'user_district_fk', e)} placeholder='ເລືອກ' block />
                                                </div>
                                                <div className="col-sm-3 col-6 mb-2">
                                                    <label htmlFor="" className='form-label'>ບ້ານ</label>
                                                    <Input onChange={(e) => handleChangeStatus(index, 'user_village', e)} placeholder='ບ້ານ' block />
                                                </div>
                                                <div className="col-sm-3 col-6 mb-2">
                                                    <label htmlFor="" className='form-label'>ເບີໂທລະສັບ</label>
                                                    <Input type='tel' onChange={(e) => handleChangeStatus(index, 'user_tel', e)} placeholder='020 999999999' block />
                                                </div>

                                                <div className="col-sm-4 col-6 mb-2">
                                                    <label htmlFor="" className='form-label'>ລະຫັດບັດ</label>
                                                    <Input type='text' onChange={(e) => handleChangeStatus(index, 'no_contract', e)} placeholder='XXX-XXXX-XXXXXX' block />
                                                </div>
                                                <div className="col-sm-3 col-6 mb-2">
                                                    <label htmlFor="" className='form-label'>ສະຖານະພະນັກງານ</label>
                                                    <SelectPicker data={itemStatus} onChange={(e) => handleChangeStatus(index, 'status_use', e)} placeholder='ເລືອກ' block />
                                                </div>
                                                <div className="col-sm-1 col-6 mb-2 mt-4">
                                                    {index === 0 && (
                                                        <Button appearance="primary" onClick={handleAddRow} color='blue' className='mt-1'>
                                                            <i className="fas fa-plus"></i>
                                                        </Button>
                                                    )}
                                                    {index > 0 && (
                                                        <Button appearance="primary" onClick={() => handleRemoveRow(index)} color='red' className='mt-1'>
                                                            <i class="fa-solid fa-circle-minus" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </fieldset>
                                    </>
                                ))}
                            </Tabs.Tab>
                        )}

                        {from === 3 && (
                            <Tabs.Tab eventKey='3' title={<><i class="fa-solid fa-pen me-2" />  ແບບຟອມເແກ້ໄຂຜູ້ໄດ້ຮັບຄວາມຄຸມຄ້ອງ</>}>

                                <div className="row fs-15px mb-3">
                                    <div className="col-sm-2 col-6 mb-2">
                                        <label htmlFor="" className='form-label'>ເພດ</label>
                                        <select className='form-select' value={values.user_gender || 'F'} onChange={(e) => handleChangeBene('user_gender', e.target.value)} >
                                            <option value="F">ເພດຍິງ</option>
                                            <option value="M">ເພດຊາຍ</option>
                                        </select>
                                    </div>
                                    <div className="col-sm-4 col-6 mb-2">
                                        <label htmlFor="" className='form-label'>ຊື່ແທ້ {values.user_fname}</label>
                                        <Input value={values.user_fname} onChange={(e) => handleChangeBene('user_fname', e)} placeholder="ຊື່ແທ້" />
                                    </div>
                                    <div className="col-sm-3 col-6 mb-2">
                                        <label htmlFor="" className='form-label'>ນາມສະກຸນ</label>
                                        <Input value={values.user_lname} onChange={(e) => handleChangeBene('user_lname', e)} placeholder="ນາມສະກຸນ" />
                                    </div>
                                    <div className="col-sm-3 col-6 mb-2">
                                        <label htmlFor="" className='form-label'>ວັນເດືອນປີເກິດ</label>
                                        <DateInput format='dd/MM/yyyy' oneTap block value={values.user_dob} onChange={(e) => handleChangeBene('user_dob', e)} placeholder="ວັນ/ເດືອນ/ປີ" />
                                    </div>
                                    <div className="col-sm-3 col-6 mb-2">
                                        <label htmlFor="" className='form-label'>ແຂວງ</label>
                                        <SelectPicker data={itemPv} defaultValue={idProvince} onChange={(e) => handelShowDistrict(e)} placeholder='ເລືອກ' block />
                                    </div>
                                    <div className="col-sm-3 col-6 mb-2">
                                        <label htmlFor="" className='form-label'>ເມືອງ</label>
                                        <SelectPicker data={itemDist} value={values.user_district_fk} onChange={(e) => handleChangeBene('user_district_fk', e)} placeholder='ເລືອກ' block />
                                    </div>
                                    <div className="col-sm-3 col-6 mb-2">
                                        <label htmlFor="" className='form-label'>ບ້ານ</label>
                                        <Input value={values.user_village} onChange={(e) => handleChangeBene('user_village', e)} placeholder='ບ້ານ' block />
                                    </div>
                                    <div className="col-sm-3 col-6 mb-2">
                                        <label htmlFor="" className='form-label'>ເບີໂທລະສັບ</label>
                                        <Input type='tel' value={values.user_tel} onChange={(e) => handleChangeBene('user_tel', e)} placeholder='020 999999999' block />
                                    </div>

                                    <div className="col-sm-4 col-6 mb-2">
                                        <label htmlFor="" className='form-label'>ລະຫັດບັດ</label>
                                        <Input type='text' value={values.no_contract} onChange={(e) => handleChangeBene('no_contract', e)} placeholder='XXX-XXXX-XXXXXX' block />
                                    </div>
                                    <div className="col-sm-3 col-6 mb-2">
                                        <label htmlFor="" className='form-label'>ສະຖານະພະນັກງານ</label>
                                        <SelectPicker data={itemStatus} value={values.status_use} onChange={(e) => handleChangeBene('status_use', e)} placeholder='ເລືອກ' block />
                                    </div>
                                </div>
                            </Tabs.Tab>
                        )}
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    {from === 2 && itab !==1 ? (
                        <Button appearance="primary" onClick={handleAddBeneficiaries}> ບັນທຶກຂໍ້ມູນ</Button>
                    ) :from === 3 && itab !==1 && (
                        <Button appearance="primary" color='green' onClick={handleEditBeneficiaries}> ແກ້ໄຂຂໍ້ມູນ</Button>
                    )}
                    <Button color="red" appearance="primary" onClick={handleClose}> ຍົກເລີກ </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default FormBeneficiaries