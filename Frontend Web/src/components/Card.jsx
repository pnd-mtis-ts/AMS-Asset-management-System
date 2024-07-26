import React from 'react'

function Card({imgSrc, title, number, bgColor}) {
  return (
    <div className={`relative mx-3 my-5 p-5 rounded-xl flex flex-row w-[18rem] h-[11rem] shadow-2xl ${bgColor}`}>
        <div className='flex-col text-center my-auto mx-3'>
            <h1 className='text-3xl font-bold text-white'>{number}</h1>
            <h3 className='text-m font-semibold text-white'>{title}</h3>
        </div>
        <div className='absolute right-0 bottom-4'>
            <img 
                src={imgSrc}
                alt={title}
                width={180}
                height={180}
            />
        </div>
    </div>
  )
}

export default Card