import React, { useState, useEffect } from 'react'
import { Input, Message ,Loader} from 'rsuite'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Config } from '../../config/connenct';
import moment from 'moment';
export default function RegisterRenew() {
    const api = Config.urlApi;
    const [datas, setDatas] = useState({
        contract_number:''
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
    setDatasName(datas.contract_number);
}
const [isLoading,setIsLoading]=useState(false);
    const fetchCustom = async () => {
        try {
            const response = await axios.post(api + 'insurance/search', datas);
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
        navigate(`/from-renew?id=${btoa(id)}`);
    }
   
  return (
    <div id="content" class="app-content">
    <ol class="breadcrumb float-end">
        <li class="breadcrumb-item">ໜ້າຫຼັກ</li>
        <li class="breadcrumb-item active">ແບບຟອມລົງທະບຽນຕໍ່ສັນຍາ</li>
    </ol>
    <h3 class="page-header fs-20px">ລົງທະບຽນຕໍ່ສັນຍາ</h3>
    <div className="panel  border-4 border-top border-red rounded-top-4">
        <div className="panel-body ">
            <form onSubmit={handleSubmit}>
                <div className="row mb-5">
                    <div className="col-sm-12 mb-3 text-center">
                        <img src={'/assets/img/logo/oac-logo.jpg'} id="blah" alt="" class="w-120px h-120px rounded-pill" />
                    </div>
                    <div className="col-sm-2"></div>
                    <div className="col-sm-8 text-center fs-16px mt-3">
                        <label htmlFor="" className='form-label'>ປ້ອນເລກທີສັນຍາ</label>
                        <Input size='lg' autoFocus  onChange={(e)=>onchangeSearch('contract_number',e)}  className='text-center' placeholder='XXX-XXXXX-XXXX' required />
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
                                <th className="w-10">ເລກທີສັນຍາ</th>
                                <th className="">ວັນທີເລີມ</th>
                                <th className="">ວັນທີສິນສຸດ</th>
                                <th className="">ປະເພດປະກັນ</th>
                                <th className="">ທາງເລືອກ</th>
                                <th className="">ຜູ້ໄຮັບຜົນປະໂຫຍດ</th>
                                <th className="">ເບີໂທລະສັບ</th>
                                <th className="">ຕົວແທນ</th>
                                <th className="">ບໍລິສັດປະກັນໄພ</th>
                                <th width='10%' className="text-center">ລົງທະບຽນ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemCustom.map((item, key) => (
                                <tr key={key}>
                                    <td className='text-center'>{key + 1}</td>
                                    <td className=''>{item.contract_number}</td>
                                    <td className='text-center'>{moment(item.contract_start_date).format('DD/MM/YYYY')}</td>
                                    <td className='text-center'>{moment(item.contract_end_date).format('DD/MM/YYYY')}</td>
                                    <td className=''>{item.type_in_name}</td>
                                    <td className=''>{item.options_name}</td>
                                    <td className=''>{item.user_fname+''+item.user_lname}</td>
                                    <td className=''>{item.user_tel}</td>
                                    <td className=''>{item.agent_name}</td>
                                    <td>{item.com_name_lao}</td>
                                    <td className='text-center'>
                                        <button type='button' onClick={() => handleAdd(item.incuranec_code)} class="btn btn-blue btn-xs me-2"><i class="fa-solid fa-arrow-right"></i> ລົງທະບຽນຕໍ່ສັນຍາ</button>
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
