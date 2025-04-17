// src/components/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#f5f5f5', padding: '20px 0', textAlign: 'center', marginTop: 'auto' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ fontSize: '1rem', color: '#333' }}>
          🚀 <strong>ResuChamp</strong> – The ultimate resume builder to land your dream job.
        </p>
        <p style={{ fontSize: '0.9rem', color: '#777' }}>
          Made with ❤️ by ResuChamp Team · © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
