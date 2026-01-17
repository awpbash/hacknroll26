const XLSX = require('xlsx');
const path = require('path');

// Read the Excel file
const filePath = path.join(__dirname, '../data/cloud_resources.xlsx');
const workbook = XLSX.readFile(filePath);

// Get all sheet names
console.log('📊 Excel Sheets:', workbook.SheetNames);

// Read each sheet
workbook.SheetNames.forEach(sheetName => {
  console.log(`\n📄 Sheet: ${sheetName}`);
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);
  
  console.log(`   Rows: ${data.length}`);
  if (data.length > 0) {
    console.log('   Columns:', Object.keys(data[0]));
    console.log('   Sample row:', data[0]);
  }
});
