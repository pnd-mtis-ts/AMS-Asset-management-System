import { Link } from 'react-router-dom';
import axios from 'axios';
// import { Button } from 'bootstrap';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { MdEdit } from 'react-icons/md';
import { FaTrashAlt } from "react-icons/fa";

const MasterList = () => {
    const[master,setMaster] = useState([]);
    useEffect(()=>{
        axios.get('http://localhost:5000/fixed-group')
        .then(res => setMaster(res.data))
        .catch(err => console.log(err));
    },[])
  return (
    <div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg container mt-5">
                <h2 className='bold-32 my-5'>Asset Information</h2>
                <Link to={`/role/add/`}>Add</Link>
        <table class="flex-row  w-full text-sm text-center  text-gray-500 dark:text-gray-400  table-fixed">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr >
                        <th >
                            No
                        </th>
                        <th >
                            Name
                        </th>
                        <th >
                            ID No
                        </th>
                        <th >
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        master.map((d, i)=>(
                            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                            key={i}>
                            
                                <td class=" ">{d.AccNo}</td>
                                <td class=" ">{d.Name}</td>
                                <td class=" ">{d.IDNo}</td>
                                <td class=" ">
                                    <button className='p-3'><MdEdit className='text-blue-700' style={{  fontSize: '1.5rem' }}/></button>
                                    <button><FaTrashAlt className='text-red-600' style={{  fontSize: '1.4rem' }}/></button>
                                </td>
                                
                            </tr>
                        ))
                    }
                    
                    
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default MasterList
