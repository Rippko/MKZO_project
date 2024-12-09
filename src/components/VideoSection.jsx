import React from "react";
import { useState } from "react";
import "./VideoSection.css";

const VideoSection = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);
  
    const openModal = () => setIsModalOpen(false);
    const closeModal = () => setIsModalOpen(true);
  
    return (
      <section>
        <h3>Ukázka komunikace</h3>
        <div className="video-container" style={{ position: "relative" }}>
          <video controls style={{ zIndex: 0, width: "100%" }}>
            <source src={`${process.env.PUBLIC_URL}/videos/ukazka.mkv`} />
          </video>
        </div>
  
        {/* Modální okno */}
        {isModalOpen && (
          <div className="modal" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <img
                src={`${process.env.PUBLIC_URL}/images/sngrep.png`}
                alt="Fullscreen Screenshot"
                style={{
                  maxWidth: "100%",
                  maxHeight: "90vh",
                  borderRadius: "8px"
                }}
              />
            </div>
          </div>
        )}
      </section>
    );
  };
  
  export default VideoSection;