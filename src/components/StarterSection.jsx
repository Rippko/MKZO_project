import React from 'react'
import '../App.css'
import './StarterSection.css'

function StarterSection() {
  return (
    <div className='hero-container'>
        <video src={`${process.env.PUBLIC_URL}/videos/video_2.mp4`} autoPlay loop muted playsInline style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          position: "fixed",
          zIndex: -1
        }} />
        <h1> Secure SIP Trunk between Asterisk PBX and
        Kamailio using TLS and certificates</h1>
    </div>
  )
}

export default StarterSection