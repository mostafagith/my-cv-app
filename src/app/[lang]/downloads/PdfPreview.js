"use client";

import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfPreview({ pdfData }) {
  return (
    <div className="w-full h-80 flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden relative ">
      <Document
        file={pdfData}
        loading={<div className="text-gray-500">Loading preview...</div>}
        error={<div className="text-red-500">Failed to load PDF</div>}
      >
        <Page pageNumber={1} width={300} />
      </Document>
    </div>
  );
}
