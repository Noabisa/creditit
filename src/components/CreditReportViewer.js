import React from 'react';
import './CreditReportViewer.css';

const CreditReportViewer = ({ report }) => {
  if (!report) return null;

  return (
    <div className="credit-report-viewer">
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
  );
};

export default CreditReportViewer;
