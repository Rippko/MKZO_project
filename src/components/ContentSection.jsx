import React from 'react';
import './ContentSection.css';

function ContentSection() {
    return (
      <div className="content-container">
        <div className="content">
          <h1 className="content-title">Cíle projektu</h1>
          <p className="content-description">
            Tento projekt se zaměřuje na vytvoření bezpečné a efektivní komunikace mezi Asterisk PBX a Kamailio pomocí TLS a certifikátů.
            Hlavními cíli bylo zajistit bezpečnost, spolehlivost a jednoduchou konfiguraci.
          </p>
          <a href="/files/project.zip" download className="content-button">
            Stáhnout projekt (ZIP)
          </a>
        </div>
      </div>
    );
  }
  
  export default ContentSection;