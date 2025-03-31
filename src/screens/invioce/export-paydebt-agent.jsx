import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import numeral from 'numeral';
import moment from 'moment';

// Example base64 logo string (replace this with your own base64 string)
const logoBase64 = 'data:image/png;base64,iVBORw...'; // Your base64 string here

const ExportPaydebtAgent = (itemData, agentData) => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Sheet1');

  // Add logo to the sheet using base64 image
  ws.addImage({
    base64: logoBase64, // Base64 image string
    extension: 'png',
    tl: { col: 0, row: 0 }, // Position of the image in the sheet
    ext: { width: 100, height: 50 } // Set image dimensions
  });

  // Set up the title and agent information in the Excel sheet
  const titleRow = ws.addRow([{ text: 'COMMISSION PAYMENT', style: { font: { bold: true, size: 18 } } }]);
  titleRow.eachCell((cell) => {
    cell.alignment = { horizontal: 'center', vertical: 'middle' }; // Center alignment for the title
  });

  const agentInfoRows = [
    `Agent Code: 2424324`,
    `Agent Name: 2424242`,
    `NO: OAC /${moment(new Date()).format('DD - MM')} - _ _ _`
  ];

  // Add agent info rows and align them to the right
  agentInfoRows.forEach((info) => {
    const row = ws.addRow([info]);
    row.eachCell((cell) => {
      cell.alignment = { horizontal: 'right', vertical: 'middle' }; // Right alignment for agent info
    });
  });

  // Add a header row for the table
  const headerRow = ws.addRow([
    "NO.", "Agent", "Name and Surname", "Policy Number", "MFG", "EXP", "Plat / Type",
    "Option", "Option", "Net Premium", "Register Fee", "Vat 10%", "Total Premium",
    "Rate", "Total Commission", "Vat 5%", "Net Commission", "Total Premium After Commission"
  ]);

  // Apply a style for the header row (bold, centered)
  headerRow.eachCell((cell, colNumber) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    // Apply borders to the header cells
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Initialize totals
  let totalNetPremium = 0;
  let totalRegisterFee = 0;
  let totalTotalPremium = 0;
  let totalCommission = 0;
  let totalNetCommission = 0;
  let totalPremiumAfterCommission = 0;

  // Map itemData to rows
  itemData.forEach((item, index) => {
    const row = ws.addRow([
      index + 1,
      item.agent_name,
      item.customer_name,
      item.contract_number,
      moment(item.contract_start_date).format('DD/MM/YYYY'),
      moment(item.contract_end_date).format('DD/MM/YYYY'),
      item.type_buyer_name,
      item.type_in_name,
      item.options_name,
      numeral(item.initial_fee).format('0,00.00') + " " + item.genus,
      numeral(item.registration_fee).format('0,00.00') + " " + item.genus,
      numeral(item.money_taxes).format('0,00.00') + " " + item.genus,
      numeral(item.insuranc_included).format('0,00.00') + " " + item.genus,
      item.percent_eps + "%",
      numeral(item.pays_advance_fee).format('0,00.00') + " " + item.genus,
      item.percent_fee_eps + "% = " + numeral(item.money_percent_fee).format('0,00.00') + " " + item.genus,
      numeral(item.expences_pays_taxes).format('0,00.00') + " " + item.genus,
      numeral(item.insuranc_included - item.expences_pays_taxes).format('0,00.00') + " " + item.genus
    ]);

    // Add the values to the totals
    totalNetPremium += item.initial_fee;
    totalRegisterFee += item.registration_fee;
    totalTotalPremium += item.insuranc_included;
    totalCommission += item.pays_advance_fee;
    totalNetCommission += item.money_percent_fee;
    totalPremiumAfterCommission += item.insuranc_included - item.expences_pays_taxes;

    // Apply borders to each cell in the row
    row.eachCell((cell, colNumber) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });

  // Add a total row at the bottom
  const totalRow = ws.addRow([
    '', '', '', '', '', '', '', '', '', 
    numeral(totalNetPremium).format('0,00.00'),
    numeral(totalRegisterFee).format('0,00.00'),
    '', // You can leave empty if no total for this column
    numeral(totalTotalPremium).format('0,00.00'),
    '', // You can leave empty if no total for this column
    numeral(totalCommission).format('0,00.00'),
    '', // You can leave empty if no total for this column
    numeral(totalNetCommission).format('0,00.00'),
    numeral(totalPremiumAfterCommission).format('0,00.00')
  ]);

  // Apply a style for the total row (bold and center-aligned)
  totalRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Save the workbook as an Excel file
  wb.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'exported_file.xlsx');
  });
};

export default ExportPaydebtAgent;
