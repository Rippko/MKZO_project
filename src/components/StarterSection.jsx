import React from 'react'
import '../App.css'
import './StarterSection.css'


function StarterSection() {
  return (
    <div className='hero-container'>
        <video src='/videos/video-2.mp4' autoPlay loop muted />
        <h1> Secure SIP Trunk between Asterisk PBX and
        Kamailio using TLS and certificates</h1>
    </div>
  )
}

export default StarterSection