import { NACDetailHistory } from '../../../type/nacType';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportToExcel = (rows: NACDetailHistory[]) => {

  const getFormattedDate = (): string => {
    const today: Date = new Date();
    const day: string = String(today.getDate()).padStart(2, '0');
    const month: string = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year: string = String(today.getFullYear());
    return `${day}${month}${year}`;
  };

  const formatDateTime = (dateInput: Date | string): string => {
    if (!dateInput) return 'Invalid date';
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return 'Invalid date';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const formattedDate: string = getFormattedDate();

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('NAC Data');

  // Define headers
  const headers = [
    { key: 'nacdtl_assetsCode', header: 'รหัสทรัพย์สิน', },
    { key: 'nacdtl_assetsName', header: 'ชื่อทรัพย์สิน', },
    { key: 'name', header: 'หัวข้อรายการ', },
    { key: 'nacdtl_assetsPrice', header: 'ราคาทุน', },
    { key: 'nacdtl_bookV', header: 'BV', },
    { key: 'nacdtl_PriceSeals', header: 'ราคาขาย', },
    { key: 'nacdtl_profit', header: 'Group Profit', },
    { key: 'nac_code', header: 'NAC', },
    { key: 'create_by', header: 'ผู้ทำรายการ', },
    { key: 'source_approve_userid', header: 'ผู้อนุมัติ', },
    { key: 'account_aprrove_id', header: 'ผู้ปิดรายการ', },
    { key: 'update_date', header: 'วันที่ปิดรายการ', }
  ];

  // Add headers to worksheet
  worksheet.columns = headers.map(header => ({
    header: header.header,
    key: header.key,
    width: 20 // Set initial width, adjust later based on content
  }));

  // Style header row
  worksheet.getRow(1).eachCell(cell => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '404040' }
    };
    cell.font = {
      bold: true,
      color: { argb: 'FFFFFF' }
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Add rows to the worksheet
  rows.forEach(item => {
    const formattedItem = {
      ...item,
    };

    const row = worksheet.addRow(formattedItem);

    // Apply border, alignment, and status-specific font color
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.alignment = {
        wrapText: true,
        horizontal: 'left',
        vertical: 'top'
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });

  // Adjust column widths based on content
  worksheet.columns.forEach(column => {
    let maxLength = 0;
    if (column.eachCell) {
      column.eachCell({ includeEmpty: true }, cell => {
        const cellValue = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, cellValue.length);
      });
    }
    column.width = Math.min(40, maxLength + 2); // Set a limit for the maximum column width
  });

  // Generate Excel file and trigger download
  workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `NAC_Export_${formattedDate}.xlsx`);
  }).catch((error: Error) => {
    console.error('Error exporting Excel:', error);
  });
};
