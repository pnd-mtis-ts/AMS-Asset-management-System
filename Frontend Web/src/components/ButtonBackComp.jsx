import React from 'react'
import { IoIosArrowBack } from "react-icons/io";

const ButtonBackComp = ({onClick}) => {
  return (
    <div>
        <button
          type="button"
          onClick={onClick}
          className="mb-3 bg-pink_lavender p-1 rounded-xl"
        >
            <div className='flex items-center'>
                <IoIosArrowBack className='text-white'/>
                <h1 className='mx-1 text-white font-medium'>Back</h1>
            </div>
        </button>
    </div>
  )
}

export default ButtonBackComp