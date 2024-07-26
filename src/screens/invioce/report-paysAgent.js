import React from 'react';
import numeral from 'numeral';
import moment from 'moment';
import '../../style-report.css'
const GetReportAgent = ({ itemData }) => {
  const sumData = itemData.reduce((acc, item) => {
    const currency = item.currency_name;
    if (!acc[currency]) {
      acc[currency] = {
        initial_fee: 0,
        money_taxes: 0,
        registration_fee: 0,
        insuranc_included: 0,
        pays_advance_fee: 0,
        money_percent_fee: 0,
        expences_pays_taxes: 0
      };
    }
    acc[currency].initial_fee += parseFloat(item.initial_fee);
    acc[currency].money_taxes += parseFloat(item.money_taxes);
    acc[currency].registration_fee += parseFloat(item.registration_fee);
    acc[currency].insuranc_included += parseFloat(item.insuranc_included);
    acc[currency].pays_advance_fee += parseFloat(item.pays_advance_fee);
    acc[currency].money_percent_fee += parseFloat(item.money_percent_fee);
    acc[currency].expences_pays_taxes += parseFloat(item.expences_pays_taxes);
    return acc;
  }, {});
  const formatNumber = (num) => numeral(num).format('0,00');


  const data = itemData.reduce((acc, item) => {
    const agent = item.agent_name;

    if (!acc[agent]) {
      acc[agent] = {
        agent_name: '',
        idcrad_code: '',
      };
    }
    acc[agent].agent_name = item.agent_name;
    acc[agent].idcrad_code = item.idcrad_code;

    return acc;
  }, {});
  const agentKey = Object.keys(data)[0]; // Get the first agent (or specify the agent key if known)
  const agentData = data[agentKey];

  return (
    <div id="exportData">
      <table width={'100%'} className='mb-3'>
        <tr>
          <td rowSpan={3} width={'50%'}><img src='./assets/img/logo/oac-invoice.png' width={'40%'} /></td>
          <td className=' fs-28px' width={'50%'}>ຈ່າຍຄ່າຄອມມິດຊັນ</td>
        </tr>
        <tr>
          <td className='fs-20px'>Agent Code: {agentData.idcrad_code}</td>
        </tr>
        <tr>
          <td className='fs-18px text-red'>Agent Name: {agentData.agent_name}</td>
        </tr>
      </table>
      <p className='fs-20px text-end'>No: OAC /{moment(new Date()).format('DD - MM')}</p>
      <table className='table-r table-striped'>
        <thead>
          <tr>
            <th className='center'>NO.</th>
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
          {itemData.map((item, index) => (
            <tr key={index}>
              <td className="text-center">{index + 1}</td>
              <td>{item.customer_name}</td>
              <td>{item.contract_number}</td>
              <td className='center'>{moment(item.contract_start_date).format('DD/MM/YYYY')}</td>
              <td className='center'>{moment(item.contract_end_date).format('DD/MM/YYYY')}</td>
              <td>{item.status_ins===1? item.type_buyer_name:item.car_registration}</td>
              <td>{item.type_in_name}</td>
              <td>{item.options_name}</td>
              <td className="right">{numeral(item.initial_fee).format('0,00')}  {item.genus}</td>
              <td className="right">{numeral(item.registration_fee).format('0,00')}  {item.genus}</td>
              <td className="right">{numeral(item.money_taxes).format('0,00')}  {item.genus}</td>
              <td className="right">{numeral(item.insuranc_included).format('0,00')}  {item.genus}</td>
              <td className="center">{item.percent_eps}%</td>
              <td className="right">{numeral(item.pays_advance_fee).format('0,00')}  {item.genus}</td>
              <td className="center">{item.percent_fee_eps}% = {numeral(item.money_percent_fee).format('0,00')}  {item.genus}</td>
              <td className="right">{numeral(item.expences_pays_taxes).format('0,00')} {item.genus}</td>
              <td className="right">{numeral(item.insuranc_included - item.expences_pays_taxes).format('0,00')} {item.genus}</td>
            </tr>
          ))
          }
        </tbody>
        <tfoot className='tfoot-r bg-cyan-100'>
          {Object.keys(sumData).map((currency, key) => (
            <tr key={`${key}`}>
              <td colSpan={8} className='text-end'>ລວມຍອດຄ້າງຈ່າຍທັງໝົດ ({currency})</td>
              <td className='text-end'>{formatNumber(sumData[currency].initial_fee)}</td>
              <td className='text-end'>{formatNumber(sumData[currency].registration_fee)}</td>
              <td className='text-end'>{formatNumber(sumData[currency].money_taxes)}</td>
              <td className='text-end'>{formatNumber(sumData[currency].insuranc_included)}</td>
              <td></td>
              <td className='text-end'>{formatNumber(sumData[currency].pays_advance_fee)}</td>
              <td className='text-end'>{formatNumber(sumData[currency].money_percent_fee)}</td>
              <td className='text-end'>{formatNumber(sumData[currency].expences_pays_taxes)}</td>
              <td className='text-end'>{formatNumber(sumData[currency].insuranc_included - sumData[currency].expences_pays_taxes)}</td>

            </tr>
          ))}
        </tfoot>
      </table>
      <p className='right fs-14px'>Vientiance Capital the Date : {moment(new Date()).format('DD/MM/YYYY')}</p>
      <table width={'100%'} className='mt-5 mb-4'>
        <tr>
          <td className='center'><h4><u>ຜູ້ສະເໜີ</u></h4> </td>
          <td className='center'><h4><u>ຜູ້ອະນຸມັດ</u></h4></td>
          <td className='center'><h4><u>ຜູ້ຮັບ</u></h4></td>
        </tr>
      </table>
      <br />
      <br />
      <br />
      <br />
      <p className='mt-4 center'>ສຳນັກງານຕັ້ງຢູ່: ໜ່າຍ19 ບ້ານທາດຫຼວງກາງ, ເມືອງໄຊເສດຖາ, ນະຄອນຫຼວງວຽງຈັນ ໂທລະສັບ: 030 290 0026 / 020 5645 5595.  ເວັບໄຊທ໌: www.oacbroker.com, ເຟດບຸກ: OAC Insurance Broker</p>
    </div>
  );
};

export default GetReportAgent;
