// import React from 'react';
// import PropTypes from 'prop-types';
// import { Button, Menu, MenuItem } from '@mui/material';
// import { saveAs } from 'file-saver';
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

// function SuaraTableExport({ tableData }) {
//     const [anchorEl, setAnchorEl] = React.useState(null);

//     const handleOpen = (event) => {
//         setAnchorEl(event.currentTarget);
//     };

//     const handleClose = () => {
//         setAnchorEl(null);
//     };

//     const exportToCSV = () => {
//         const csvContent = "data:text/csv;charset=utf-8,";
//         csvContent += Object.keys(tableData[0]).join(",") + "\n";

//         tableData.forEach((row) => {
//             const rowData = [];
//             Object.values(row).forEach((value) => rowData.push(value));
//             csvContent += rowData.join(",") + "\n";
//         });

//         const blob = new Blob([csvContent], { type: "text/csv" });
//         saveAs(blob, "table-data.csv");
//     };

//     const exportToPDF = () => {
//         const docDefinition = {
//             content: [
//                 { text: 'Table Data', style: 'header' },
//                 {
//                     table: {
//                         headerRows: 1,
//                         body: [
//                             Object.keys(tableData[0]),
//                             ...tableData.map(row => Object.values(row))
//                         ]
//                     }
//                 }
//             ]
//         };
//         pdfMake.createPdf(docDefinition).download('table-data.pdf');
//     };

//     const printTable = () => {
//         const printWindow = window.open('', '_blank');
//         const tableHtml = document.querySelector('#yourTableId').outerHTML;
//         printWindow.document.write(`
//             <html>
//                 <head>
//                 <title>Print table</title>
//                 <style>
//                     table { border-collapse: collapse; width: 100%; }
//                     th, td { border: 1px solid black; padding: 8px; text-align: left; }
//                 </style>
//                 </head>
//                 <body>
//                 ${tableHtml}
//                 </body>
//             </html>
//         `);
//         printWindow.document.close();
//         printWindow.focus();
//         printWindow.print();
//         printWindow.close();
//     };


//     return (
//         <>
//             <Button variant="contained" color="inherit" onClick={handleOpen}>
//                 Export Data
//             </Button>
//             <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
//                 <MenuItem onClick={exportToCSV}>Export to CSV</MenuItem>
//                 <MenuItem onClick={exportToPDF}>Export to PDF</MenuItem>
//                 <MenuItem onClick={printTable}>Print Table</MenuItem>
//             </Menu>
//         </>
//     );
// }

// SuaraTableExport.propTypes = {
//     tableData: PropTypes.arrayOf(PropTypes.object).isRequired,
// };

// export default SuaraTableExport;
