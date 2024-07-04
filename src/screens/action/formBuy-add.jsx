import React, { useState, useEffect } from 'react'
import { Input, Message ,Loader} from 'rsuite'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Config } from '../../config/connenct';
export default function FormBuyAdd() {
    const api = Config.urlApi;
    const [datas, setDatas] = useState({
        customName:''
    });
    const onchangeSearch=(name,value)=>{
        setDatas({
            ...datas,[name]:value
        })
    if(!value){
        setDatasName('')
    }
    }
const [datasName,setDatasName]=useState('');
    const [itemCustom, setItemCustom] = useState([]);
const handleSubmit=(e)=>{
    e.preventDefault();
    fetchCustom();
    setIsLoading(true);
    setDatasName(datas.customName);
}
const [isLoading,setIsLoading]=useState(false);
    const fetchCustom = async () => {
        try {
            const response = await axios.post(api + 'custom/search', datas);
            const jsonData = response.data;
            setItemCustom(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }finally {
            setIsLoading(false);
        }
    }
    const navigate = useNavigate();
    const handleAdd = (id) => {
        navigate(`/contract?id=${btoa(id)}`);
    }
   
    return (
        <div id="content" class="app-content">
            <ol class="breadcrumb float-end">
                <li class="breadcrumb-item">ໜ້າຫຼັກ</li>
                <li class="breadcrumb-item active">ແບບຟອມລົງທະບຽນ</li>
            </ol>
            <h3 class="page-header fs-20px">ລົງທະບຽນຊື້ປະກັນເພີ່ມ</h3>
            <div className="panel  border-4 border-top border-red rounded-top-4">
                <div className="panel-body ">
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-5">
                            <div className="col-sm-12 mb-3 text-center">
                                <img src={'/assets/img/logo/oac-logo.jpg'} id="blah" alt="" class="w-120px h-120px rounded-pill" />
                            </div>
                            <div className="col-sm-2"></div>
                            <div className="col-sm-8 text-center fs-16px mt-3">
                                <label htmlFor="" className='form-label'>ລູກຄ້າຜູ້ຊື້ປະກັນ</label>
                                <Input size='lg' autoFocus  onChange={(e)=>onchangeSearch('customName',e)}  className='text-center' placeholder='ລູກຄ້າຜູ້ຊື້ປະກັນ' required />
                            </div>
                            <div className="col-sm-2"></div>
                        </div>
                    </form>
                    {isLoading === false ? (
                    itemCustom.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered align-middle w-100 text-nowrap">
                                <thead className="fs-14px bg-header">
                                    <tr>
                                        <th width='1%' className="text-center">ລ/ດ</th>
                                        <th className="w-10">ຊື່ບຸກຄົນ ຫຼື ອົງກອນ</th>
                                        <th className="">ປະເພດ</th>
                                        <th className="">ເບີໂທລະສັບ</th>
                                        <th className="">ບ້ານ</th>
                                        <th className="">ເມືອງ</th>
                                        <th className="">ແຂວງ</th>
                                        <th width='10%' className="text-center">ລົງທະບຽນ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemCustom.map((item, key) => (
                                        <tr key={key}>
                                            <td className='text-center'>{key + 1}</td>
                                            <td className=''>{item.customer_name}</td>
                                            <td className=''>{item.type_buyer_fk === 1 ? 'ແບບບຸກຄົນ' : 'ແບບອົງກອນ'}</td>
                                            <td className=''>{item.registra_tel}</td>
                                            <td className=''>{item.village_name}</td>
                                            <td className=''>{item.district_name}</td>
                                            <td className=''>{item.province_name}</td>
                                            <td className='text-center'>
                                                <button type='button' onClick={() => handleAdd(item.custom_uuid)} class="btn btn-blue btn-xs me-2"><i class="fa-solid fa-arrow-right"></i> ລົງທະບຽນເພີ່ມ</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                         datasName !==''?(
                        <div className="row">
                            <div className="col-sm-2"></div>
                            <div className="col-sm-8">
                                <Message type="warning" centered showIcon header="ຂໍອະໄພ ບໍ່ພົບຂໍ້ມູນທີ່ທ່ານກຳລັງຊອກຫາ !">
                                    <p>
                                        ກະລຸນາກວດຄືນ ລາຍຊື່ທີ່ທ່ານຕ້ອງການຊອກຫານ ແລ້ວ ພີມຊື່ໃຫ້ຖຶກຕ້ອງ ເພື່ອທຳການລົງທະບຽນຊື້ປະກັນໄພເພີ່ມ
                                    </p>
                                    <p>
                                       ຂໍຂອບໃຈ
                                    </p>
                                </Message>
                            </div>
                            <div className="col-sm-2"></div>
                        </div>
                    ):''
                    )):(
                        <div className="text-center">
                            <Loader size="lg" content="ກຳລັງຄົ້ນຫາຂໍ້ມູນ...." />
                        </div>
                        
                    )}
                </div>

            </div>
        </div>
    )
}
