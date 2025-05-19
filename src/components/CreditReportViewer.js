// src/components/CreditReportViewer.jsx
import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './CreditReportViewer.css';

const CreditReportViewer = ({ report }) => {
  const reportRef = useRef();

  const handleDownloadPDF = async () => {
    const element = reportRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('credit_report.pdf');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  if (!report) return null;

  return (
    <div className="credit-report-viewer">
      <div ref={reportRef}>
        <h3>Latest Credit Report</h3>
        <p><strong>Date:</strong> {new Date(report.calculatedOn).toLocaleString()}</p>
        <h4>Score Factors:</h4>
        <ul>
          {report.scoreFactors?.map((f, index) => (
            <li key={index}>
              <strong>{f.reason}:</strong> {f.impact > 0 ? `+${f.impact}` : `${f.impact}`} points
            </li>
          ))}
        </ul>
      </div>
      <button className="download-button" onClick={handleDownloadPDF}>
        Download as PDF
      </button>
    </div>
  );
};

export default CreditReportViewer;
