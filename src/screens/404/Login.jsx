import React, { useEffect, useState } from 'react'
import { Config } from "../../config/connenct";
import { Loader } from 'rsuite';
import axios from 'axios';
export default function Login() {
    const api = Config.urlApi;
    const [inputs, setInputs] = useState({
        userEmail: '',
        userPassword: ''
    })

    const handelChange = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        })
    }
    const [showPassword, setShowPassword] = useState(true);
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const [dataError, setDataError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true)
        try {
            axios.post(api + 'login/check', inputs)
                .then(function (res) {
                    console.log(res.data)
                    if (res.status === 200) {
                        localStorage.setItem('token', res.data.token);
                        localStorage.setItem('userId', res.data.user_Id);
                        localStorage.setItem('username', res.data.username);
                        localStorage.setItem('user_type', res.data.user_type_fk);
                        localStorage.setItem('userEmail', res.data.userEmail);
                        localStorage.setItem('company_agent_id', res.data.company_agent_fk);
                        localStorage.setItem('statusUse', res.data.statusUse);
                        window.location.href = '/home';
                    }
                })
                .catch(function (error) {
                    setDataError(true);
                    setIsLoading(false)
                });
        } catch (error) {
            setDataError(true);
            setIsLoading(false)
        }
    }

    return (
        <>

            <div id="app" class="app">
                <div class="login login-with-news-feed">
                    <div class="news-feed">
                        <div class="news-image" style={{ backgroundImage: "url('/assets/img/login-bg/bg-insurance.png')", backgroundRepeat: 'no-repeat' }} ></div>
                        <div class="news-caption">
                            <h4 class="caption-title"><b>OAC</b> Insurance Broker  </h4>
                        </div>
                    </div>
                    {isLoading === true ? (
                        <>
                            <Loader size='lg' color='red' backdrop content="ກຳລັງກວດສອມຂໍ້ມູນ..." vertical />
                        </>
                    ) : ('')}
                    <div class="login-container bg-info">
                        <div class="login-header mb-30px">
                            <div class="brand">
                                <div class="d-flex align-items-center">
                                    <img src="./assets/img/logo/oac-1.png" className='me-2' alt="" width={40} />
                                    <b>ເຂົ້າສູ່ລະບົບ</b>
                                </div>
                                <small>ກະລຸນາປ້ອນຂໍ້ມູນທີ່ຖຶກຕ້ອງເພື່ອເຂົ້າສູ່ລະບົບ</small>
                            </div>
                            <div class="icon">
                                <i class="fas fa-sign-in-alt"></i>
                            </div>
                        </div>

                        <div class="login-content">
                            <form onSubmit={handleSubmit} class="fs-13px">
                                <div class="form-floating mb-15px">
                                    <input type="text" onChange={(e) => handelChange('userEmail', e.target.value)} class="form-control h-45px fs-13px" placeholder="ຊື່ຜູ້ເຂົ້າໃຊ້" required />
                                    <label for="user_email" class="d-flex align-items-center fs-13px text-gray-600">ຊື່ຜູ້ເຂົ້າໃຊ້</label>
                                </div>
                                <div class="form-floating mb-15px">
                                    <input type={showPassword ? 'text' : 'password'} onChange={(e) => handelChange('userPassword', e.target.value)} class="form-control h-45px fs-13px" placeholder="ລະຫັດຜ່ານ" required />
                                    <label for="user_password" class="d-flex align-items-center fs-13px text-gray-600">ລະຫັດຜ່ານ</label>
                                </div>
                                <div class="form-check mb-30px">
                                    <input class="form-check-input" type="checkbox" checked={showPassword} onChange={handleShowPassword} />
                                    <label class="form-check-label" for="showPassword">
                                        ສະແດງລະຫັດຜ່ານ
                                    </label>
                                </div>
                                <div class="mb-15px">
                                    <button type="submit" class="btn btn-danger d-block h-45px w-100 btn-lg fs-14px">ເຂົ້າສູ່ລະບົບ</button>
                                </div>
                                {dataError && (
                                    <div class="toast show mb-3" role="alert" aria-live="assertive" aria-atomic="true">
                                        <div class="toast-header bg-warning">
                                            <div class="bg-white rounded w-25px h-25px d-flex align-items-center justify-content-center text-warning">
                                                <i class="fa fa-warning"></i>
                                            </div>
                                            <strong class="me-auto ms-2 text-white"> ຊື່ ແລະ ລະຫັດຜ່ານບໍ່ຖຶກຕ້ອງ.</strong>
                                            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                                        </div>
                                    </div>
                                )}
                                <hr class="bg-gray-600 opacity-2" />
                                <div class="text-gray-600 text-center mb-0">
                                    &copy; OAC Broker -@- V 2.2.10
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
