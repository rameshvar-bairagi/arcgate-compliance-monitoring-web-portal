/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ExportAsCsv,
  ExportAsExcel,
  ExportAsPdf,
  PrintDocument,
} from '@siamf/react-export';

type ExportButtonsProps = {
  data: any[];
  fileName?: string;
  headers: string[];
  showCsv?: boolean;
  showExcel?: boolean;
  showPdf?: boolean;
  showPrint?: boolean;
};

const ExportButtons = ({
  data,
  fileName = "Report",
  headers,
  showCsv = true,
  showExcel = true,
  showPdf = true,
  showPrint = true,
}: ExportButtonsProps) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="d-flex gap-2 flex-wrap">
      {showCsv && (
        <ExportAsCsv data={data}>
          {(props) => (
            <button {...props} className="btn btn-outline-secondary mr-2">
              <i className="fa fa-file-csv" />
            </button>
          )}
        </ExportAsCsv>
      )}

      {showExcel && (
        <ExportAsExcel data={data} headers={headers} fileName={fileName}>
          {(props) => (
            <button {...props} className="btn btn-outline-success mr-2">
              <i className="fa fa-file-excel" />
            </button>
          )}
        </ExportAsExcel>
      )}

      {showPdf && (
        <ExportAsPdf data={data} headers={headers} fileName={fileName}>
          {(props) => (
            <button {...props} className="btn btn-outline-danger mr-2">
              <i className="fas fa-file-pdf" />
            </button>
          )}
        </ExportAsPdf>
      )}

      {showPrint && (
        <PrintDocument data={data} headers={headers}>
          {(props) => (
            <button {...props} className="btn btn-outline-primary">
              <i className="fas fa-print" />
            </button>
          )}
        </PrintDocument>
      )}
    </div>
  );
};

export default ExportButtons;