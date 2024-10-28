import React, { useState, useEffect } from 'react'
import { Loader } from 'rsuite';
import ReactApexChart from 'react-apexcharts';
import CanvasJSReact from '@canvasjs/react-charts';
import { Config } from '../../config/connenct';
import axios from 'axios';
import numeral from 'numeral';
export default function HomePageAgent() {
  const api = Config.urlApi;

  const user_type = localStorage.getItem('user_type');
  const companyId = localStorage.getItem('company_agent_id');

  const [isLoading, setIsLoading] = useState(true);
  const datack = {
    user_type: user_type,
    companyId: companyId
  };

  const [balance, setBalance] = useState({
    insuranc_included: 0,
    incom_finally: 0,
    expences_taxes: 0,
    net_income: 0,
    qtyAll: 0,
    qty_almost: 0,
    run_out: 0,
    arrears_commit: 0
  });

  const fetchData = async () => {
    try {
      const response = await axios.post(api + 'home/balanch', datack);
      const resData = response.data;
      setBalance({
        insuranc_included: resData.data1.insuranc_included,
        incom_finally: resData.data1.incom_finally,
        expences_taxes: resData.data1.expences_pays_taxes,
        net_income: resData.data1.net_income,
        arrears_commit: resData.data1.arrears_commit,
        qtyAll: resData.data2.qtyAll,
        qty_almost: resData.data2.qty_almost,
        run_out: resData.data2.run_out,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const CanvasJSChart = CanvasJSReact.CanvasJSChart;
  const optionsDonut = {
      exportEnabled: true,
      animationEnabled: true,
      title: {
          fontFamily: "LAOS",
          text: "ຍອດຂາຍ, ຍອດຮັບ"
      },
      data: [{
          type: "pie",
          startAngle: 75,
          toolTipContent: "<b>{label}</b>: {y} ₭",
          showInLegend: true,
          legendText: "{label}",
          indexLabelFontSize: 16,
          indexLabel: "{label} = {y} ₭",
          dataPoints: [
              { y: balance.insuranc_included, label: "ຍອດທັງໝົດ", exploded: true },
              { y: balance.expences_taxes, label: "ຄອມຮັບ" },
          ],

      }]
  };


  //================================
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'bar',
        height: 350
      },

      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '60%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['ມັງກອນ', 'ກຸມພາ', 'ມີນາ', 'ເມສາ', 'ພຶກສະພາ', 'ມີຖຸນາ', 'ກໍລະກົດ', 'ສີງຫາ', 'ກັນຍາ', 'ຕຸລາ', 'ພະຈິກ', 'ທັນວາ'],
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "₭ " + numeral(val).format('0,00') + " ກີບ";
          }
        },
      },
    }
  });

  const fetchDataMonth = async () => {
    try {
      const response = await fetch(api + 'home/chartAgent/' + companyId); // Adjust the API endpoint if necessary
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json(); // Parse JSON response
      setChartData(prevState => ({
        ...prevState,
        series: data.series
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };



  useEffect(() => {
    fetchDataMonth();
    fetchData();
  }, [companyId,user_type]);
  return (
    <div id="content" class="app-content">
      <div class="row">
        <div class="col-xl-3 col-md-6">
          <div class="widget widget-stats  bg-blue border-4 border-top border-red rounded-4">
            <div class="stats-icon text-white"><img src="./assets/img/icon/insurannce-All.png" width={'100%'} alt="" /></div>
            <div class="stats-info">
              <h4 className='fs-16px'>ຈຳນວນສັນຍາປະກັນໄພທັງໝົດ  </h4>
              <p>{isLoading === true ? (<Loader size="md" content="ກຳລັງໂຫລດ..." />) : (balance.qtyAll + ' (ສັນຍາ)')}</p>

            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6">
          <div class="widget widget-stats bg-blue border-4 border-top border-red rounded-4">
            <div class="stats-icon text-white"><i class="fa-solid fa-wallet"></i></div>
            <div class="stats-info">
              <h4 className='fs-16px'>ຍອດຄ່າຄອມຄ້າງຮັບ </h4>
              <p>{isLoading === true ? (<Loader size="md" content="ກຳລັງໂຫລດ..." />) : (numeral(balance.arrears_commit).format('0,00') + ' (₭)')} </p>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="widget widget-stats bg-blue border-4 border-top border-red rounded-4">
            <div class="stats-icon text-white"><i class="fa-solid fa-users-slash" /></div>
            <div class="stats-info">
              <h4 className='fs-16px'>ສັນຍາໝົດຄວາມຄຸ້ມຄອງ</h4>
              <p>{isLoading === true ? (<Loader size="md" content="ກຳລັງໂຫລດ..." />) : (balance.run_out + ' (ສັນຍາ)')} </p>
            </div>
          </div>
        </div>

      </div>

      <div className="row">
        <div className="col-sm-4">
        <div class="panel panel-inverse">
                <div class="panel-body">
                    <CanvasJSChart options={optionsDonut} />
                </div>
            </div>
        </div>
        <div className="col-sm-8">
          <div class="panel panel-inverse">
            <div class="panel-body">
              <h4 className='text-center'>ຍອດຂາຍປະຈຳເດືອນ</h4>
              <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={350} />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
