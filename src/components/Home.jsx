import React from 'react'
import chat from "../images/chat.jpeg"

function Home() {
  return (
    <div className='home-container'>
      <img className='homepage-image' src={chat} alt='chatimg' />
    </div>
  )
}

export default Home
