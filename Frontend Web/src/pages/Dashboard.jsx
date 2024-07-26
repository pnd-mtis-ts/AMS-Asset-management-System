import React from 'react';
import Card from '../components/Card';
import Layout from '../components/Layout';

const Dashboard = () => {

  return (
        <div>
          <h1 className='text-2xl font-semibold'>Home Page</h1>
          
          <div className='flex flex-row flex-wrap'>
            <Card 
              imgSrc={process.env.PUBLIC_URL + '/building-icon.svg'}
              title={'Asset Master'}
              number={580}
              bgColor={'bg-byzantium'}
            />

            <Card 
              imgSrc={process.env.PUBLIC_URL + '/building-icon.svg'}
              title={'Relocation'}
              number={464}
              bgColor={'bg-byzantium-600'}
            />

            <Card 
              imgSrc={process.env.PUBLIC_URL + '/building-icon.svg'}
              title={'Asset Active'}
              number={890}
              bgColor={'bg-pink_lavender-500'}
            />

            
          <Card 
              imgSrc={process.env.PUBLIC_URL + '/building-icon.svg'}
              title={'Asset Inactive'}
              number={237}
              bgColor={'bg-wenge'}
            />
          </div>
        </div>
  )
}

export default Dashboard