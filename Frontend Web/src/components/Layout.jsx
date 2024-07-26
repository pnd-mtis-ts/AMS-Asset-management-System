import React, { useState } from 'react'
import SideBar from './SideBar'

const Layout = ({children}) => {
  const [sidebarToggle, setSidebarToggle] = useState(false);

  return (
    <React.Fragment>
        <div className='flex'>
          <div>
            <SideBar sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle}/>
          </div>
            <div >
                <div className={` ${sidebarToggle ? 'ml-72' : 'ml-20'}  p-10`}>{children}</div>
            </div>

        </div>
    </React.Fragment>
  )
}

export default Layout