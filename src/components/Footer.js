import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>
          <strong>Credit Bureau Management System</strong> | Faculty of ICT – Limkokwing University
        </p>
        <p>
          <strong>Course:</strong> BIDB2210 | <strong>Semester:</strong> 2, 2025 | <strong>Project:</strong> Group Assignment
        </p>
        <p>
          <strong>Contact:</strong> 
          <a href="mailto:assginluct@gmail.com"> assginluct@gmail.com</a> | 
          <a href="mailto:mpho.takalimane@limkokwing.ac.ls"> mpho.takalimane@limkokwing.ac.ls</a>
        </p>
        <p>© {new Date().getFullYear()} All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
