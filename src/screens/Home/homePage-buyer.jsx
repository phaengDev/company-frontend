import React, { useState, useEffect } from 'react'
import { Loader } from 'rsuite';
import ReactApexChart from 'react-apexcharts';
import { Config } from '../../config/connenct';
import axios from 'axios';
import numeral from 'numeral';
export default function HomePageBuyer() {
  const suerName = localStorage.getItem('username');

  const api = Config.urlApi;
  const user_type=localStorage.getItem('user_type');
  const custom_id_fk=localStorage.getItem('company_agent_id');
  
  const [isLoading, setIsLoading] = useState(true);

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
          const response = await fetch(api + 'home/chartBuy/' + custom_id_fk); // Adjust the API endpoint if necessary
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const data = await response.json(); // Parse JSON response
          console.log(data)
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
  }, []);
  return (
    <div id="content" class="app-content text-center">
      <h3 ><span className='text-blue'>Hello  {suerName} Welcome </span>
        <br />
        Using the insurance contract tracking system of OAC insurance sales agents </h3>


        <div class="panel panel-inverse">
                <div class="panel-body">
                    <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={350} />
                </div>
            </div>
    </div>
  )
}
