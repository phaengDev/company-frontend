import React from 'react';
import numeral from 'numeral';
import moment from 'moment';
import '../../style-report.css'
const GetReportData = ({ item }) => {
  return (
    <div id="exportData">
      <table width={'100%'} className='mb-3'>
        <tr>
          <td rowSpan={3} width={'50%'}><img src='./assets/img/logo/oac-invoice.png' width={'40%'} /></td>
          <td className=' fs-28px' width={'50%'}>COMMISSION PAYMENT</td>
        </tr>
        <tr>
          <td className='fs-20px'><span className='ms-5'>AGENT CODE: {item.idcrad_code}</span></td>
        </tr>
        <tr>
          <td className='fs-18px'><span className='ms-5'>AGENT NAME: {item.agent_name}</span></td>
        </tr>
      </table>
      <p className='fs-20px text-end'>NO: OAC /{moment(new Date()).format('DD - MM')}-_ _ _</p>
      <table className='table-r'>
        <thead>
          <tr>
            <th className='center'>NO.</th>
            <th>Agent</th>
            <th>Name and Surname</th>
            <th>Policy Number</th>
            <th className='center'>MFG</th>
            <th className='center'>EXP</th>
            <th>Plat / Type</th>
            <th>Option</th>
            <th>Option</th>
            <th className="right">Net Premium</th>
            <th className="right">Register Fee</th>
            <th className="right">Vat 10%</th>
            <th className="right">Total Premium</th>
            <th className='center'>Rate</th>
            <th className="right">Total Commission</th>
            <th className='center'>Vat 5%</th>
            <th className="right">Net Commission</th>
            <th className="right">Total Premium After Commission</th>
          </tr>
        </thead>
        <tbody>
          {/* {itemData.map((item, index) => ( */}
          <tr>
            <td className="text-center">1</td>
            <td>{item.agent_name}</td>
            <td>{item.customer_name}</td>
            <td>{item.contract_number}</td>
            <td className='center'>{moment(item.contract_start_date).format('DD/MM/YYYY')}</td>
            <td className='center'>{moment(item.contract_end_date).format('DD/MM/YYYY')}</td>
            <td>{item.status_ins===1? item.type_buyer_name:item.car_registration}</td>
            <td>{item.type_in_name}</td>
            <td>{item.options_name}</td>
            <td className="right">{numeral(item.initial_fee).format('0,00.00')}  {item.genus}</td>
            <td className="right">{numeral(item.registration_fee).format('0,00.00')}  {item.genus}</td>
            <td className="right">{numeral(item.money_taxes).format('0,00.00')}  {item.genus}</td>
            <td className="right">{numeral(item.insuranc_included).format('0,00.00')}  {item.genus}</td>
            <td className="center">{item.percent_eps}%</td>
            <td className="right">{numeral(item.pays_advance_fee).format('0,00.00')}  {item.genus}</td>
            <td className="center">{item.percent_fee_eps}% = {numeral(item.money_percent_fee).format('0,00.00')}  {item.genus}</td>
            <td className="right">{numeral(item.expences_pays_taxes).format('0,00.00')} {item.genus}</td>
            <td className="right">{numeral(item.insuranc_included - item.expences_pays_taxes).format('0,00.00')} {item.genus}</td>
          </tr>
        </tbody>
      </table>
      <p className='right fs-14px'>Vientiance Capital the Date : {moment(new Date()).format('DD/MM/YYYY')}</p>
      <table width={'100%'} className='mt-5 mb-4'>
        <tr>
          <td className='center'><h4><u>ຜູ້ສະເໜີ</u></h4> </td>
          <td className='center'><h4><u>ຜູ້ຈ່າຍ</u></h4></td>
          <td className='center'><h4><u>ຜູ້ຮັບ</u></h4></td>
        </tr>
        <br />
      <br />
      <br />
      <br />
        <tr>
          <td className='center fs-14px'><h5><u>ວັນທີ:</u> ____/____/______</h5> </td>
          <td className='center fs-14px'><h5><u>ວັນທີ:</u> ____/____/______</h5></td>
          <td className='center fs-14px'><h5><u>ວັນທີ:</u> ____/____/______</h5></td>
        </tr>
      </table>
      <br />
      <br />
      <br />
      <br />
      <p className='mt-4 text-center' style={{ position: 'absolute', bottom: '0px',textAlign: 'center', width: '100%' }}>
        <span style={{textAlign: 'center' }}>
        Address: Kamphengmeuang Rd,Thadluangkang Village xaysettha District, Vientiane Capital, Lao PDR
        <br />
        Tel: 030 290 0026 / 020 29 888 668, www.oacbroker.com, Facebok Page: OAC Insurance Broker
        </span>
      </p>
    </div>
  );
};

export default GetReportData;
