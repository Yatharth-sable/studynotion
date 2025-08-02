import React from 'react'
import Highlight from "../HomePage/Highlight"

const Quote = () => {
  return (
    <div className='text-white'> 
       We are passionate about revolutionizing the way we learn. Our innovative platform
       <Highlight text={" combines technology "}></Highlight>
       <span className='text-brown-200'> expertise </span>
        and community to create an
       <span>
          unparalleled educational experience
       </span>
    </div>
  )
}

export default Quote
