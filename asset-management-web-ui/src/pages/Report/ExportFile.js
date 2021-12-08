import { Button } from "react-bootstrap";
import FileSaver from "file-saver";
import XLSX from "xlsx";

const ExportFile = ({apiData, fileName}) => {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const exportToCSV = (apiData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  return (
    <Button variant={"danger"} className={"mx-5"} onClick={e => exportToCSV(apiData, fileName)}>
      Export
    </Button>
  );
}


export default ExportFile;