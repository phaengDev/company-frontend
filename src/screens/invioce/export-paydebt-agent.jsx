import React, { useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import numeral from 'numeral';
import moment from 'moment';

const ExportPaydebtAgent = ({itemData}) => {
  // Calculate sumData
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
        expences_pays_taxes: 0,
        Total_Premium: 0
      };
    }

    acc[currency].initial_fee += parseFloat(item.initial_fee);
    acc[currency].registration_fee += parseFloat(item.registration_fee);
    acc[currency].money_taxes += parseFloat(item.money_taxes);
    acc[currency].insuranc_included += parseFloat(item.insuranc_included);
    acc[currency].pays_advance_fee += parseFloat(item.pays_advance_fee);
    acc[currency].money_percent_fee += parseFloat(item.money_percent_fee);
    acc[currency].expences_pays_taxes += parseFloat(item.expences_pays_taxes);
    acc[currency].Total_Premium += parseFloat(item.insuranc_included - item.expences_pays_taxes);
    return acc;
  }, {});

  const formatNumber = (num) => numeral(num).format('0,00.00');

  useEffect(() => {
    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(document.getElementById('exportData'));
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        const s2ab = (s) => {
          const buf = new ArrayBuffer(s.length);
          const view = new Uint8Array(buf);
          for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
          return buf;
        };
        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
        saveAs(blob, 'file2.xlsx');
    };

    exportToExcel();
  }, [itemData]); // Include 'data' in the dependency array if 'data' changes and you want to re-export

  return (
    <div id="exportData">
      <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
        <thead>
          <tr>
            <th>NO.</th>
            <th>Agent</th>
            <th>Name and Surname</th>
            <th>Policy Number</th>
            <th>MFG</th>
            <th>EXP</th>
            <th>Plat / Type</th>
            <th>Option</th>
            <th>Option</th>
            <th>Net Premium</th>
            <th>Register Fee</th>
            <th>Vat 10%</th>
            <th>Total Premium</th>
            <th>Rate</th>
            <th>Total Commission</th>
            <th>Vat 5%</th>
            <th>Net Commission</th>
            <th>Total Premium After Commission</th>
          </tr>
        </thead>
        <tbody>
          {itemData.map((item, index) => (
            <tr key={index}>
              <td className="text-center">{index + 1}</td>
              <td>{item.agent_name}</td>
              <td>{item.customer_name}</td>
              <td>{item.contract_number}</td>
              <td>{moment(item.contract_start_date).format('DD/MM/YYYY')}</td>
              <td>{moment(item.contract_end_date).format('DD/MM/YYYY')}</td>
              <td>{item.type_buyer_name}</td>
              <td>{item.type_in_name}</td>
              <td>{item.options_name}</td>
              <td className="text-end">{numeral(item.initial_fee).format('0,00.00')}  {item.genus}</td>
              <td className="text-end">{numeral(item.registration_fee).format('0,00.00')}  {item.genus}</td>
              <td className="text-end">{numeral(item.money_taxes).format('0,00.00')}  {item.genus}</td>
              <td className="text-end">{numeral(item.insuranc_included).format('0,00.00')}  {item.genus}</td>
              <td className="text-center">{item.percent_eps}%</td>
              <td className="text-end">{numeral(item.pays_advance_fee).format('0,00.00')}  {item.genus}</td>
              <td className="text-center">{item.percent_fee_eps}% = {numeral(item.money_percent_fee).format('0,00.00')}  {item.genus}</td>
              <td className="text-end">{numeral(item.expences_pays_taxes).format('0,00.00')} {item.genus}</td>
              <td className="text-end">{numeral(item.insuranc_included - item.expences_pays_taxes).format('0,00.00')} {item.genus}</td>
            </tr>
          ))}
          {Object.keys(sumData).map((currency, key) => (
            <tr key={key}>
              <td colSpan={10} className="text-end">ລວມຍອດຄ້າງຈ່າຍທັງໝົດ ({currency})</td>
              <td className="text-end">{formatNumber(sumData[currency].initial_fee)}</td>
              <td className="text-end">{formatNumber(sumData[currency].registration_fee)}</td>
              <td className="text-end">{formatNumber(sumData[currency].money_taxes)}</td>
              <td className="text-end">{formatNumber(sumData[currency].insuranc_included)}</td>
              <td></td>
              <td className="text-end">{formatNumber(sumData[currency].pays_advance_fee)}</td>
              <td className="text-end">{formatNumber(sumData[currency].money_percent_fee)}</td>
              <td className="text-end">{formatNumber(sumData[currency].expences_pays_taxes)}</td>
              <td className="text-end">{formatNumber(sumData[currency].Total_Premium)}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExportPaydebtAgent;
