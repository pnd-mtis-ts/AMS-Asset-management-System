import AxiosContext from "../features/AxiosProvider";
import { getToken } from "../features/authSlice";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";

const GenerateAIN = ({ show, onClosed }) => {
  const axiosInstance = useContext(AxiosContext);
  const [fixeds, setFixed] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const ref = useRef([]);
  const [page, setPage] = useState(1);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchFixedAssets = async () => {
      try {
        const res = await axiosInstance.get(`${apiUrl}/fixed?page=${page}`, getToken());
        const filteredData = res.data.data.filter((d) => !d.FixedNo || d.FixedNo.trim() === "");
        setFixed(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchFixedAssets();
  }, [page]);

  const handleCheckboxChange = (event, item) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(selectedItems.filter((i) => i.FixedIDNo !== item.FixedIDNo));
    }
  };

  const handleNextPage = () => {
    setPage((prevState) => prevState + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevState) => prevState - 1);
    }
  };

  const handleGenerate = async () => {
    const fixedIds = selectedItems.map((item) => item.FixedIDNo);
    try {
      await axiosInstance.post(`${apiUrl}/generateFixedNoAndInvNo`, { fixedIds }, getToken());
      alert("FixedNo and InvNo generated successfully!");
      onClosed(); // Close the modal after generating FixedNo and InvNo
    } catch (error) {
      console.error(error);
      alert("An error occurred while generating FixedNo and InvNo.");
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 w-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full m-10 p-10 bg-white rounded-xl">
        <div className="flex justify-between items-center mb-3">
          <h2 className="bold-20 mb-3">Generate AIN</h2>
          <button className="text-white bg-red-600 rounded-[100%] py-2 px-3" onClick={onClosed}>
            X
          </button>
        </div>
        <table className="flex-row w-full overflow-y-auto text-sm text-center text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>AIN</th>
              <th>Fixed Group</th>
              <th>Entitas Bisnis</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {fixeds.length === 0 && (
              <tr>
                <td colSpan="6">No data available</td>
              </tr>
            )}
            {fixeds.map((d, i) => (
              <tr className="odd:bg-white even:bg-gray-50" key={d.FixedIDNo}>
                <td>{i + 1}</td>
                <td>{d.FixedAssetName}</td>
                <td>{d.FixedNo}</td>
                <td>{d.FixedGroup ? d.FixedGroup.Name : "N/A"}</td>
                <td>{d.EntitasBisni ? d.EntitasBisni.EBCode : "N/A"}</td>
                <td>
                  <input type="checkbox" checked={selectedItems.some((i) => i.FixedIDNo === d.FixedIDNo)} onChange={(event) => handleCheckboxChange(event, d)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="hidden">
          <div ref={ref} className="flex flex-row flex-wrap">
            {selectedItems.map((data, index) => (
              <div key={index} className="barcode-item p-5">
                <h1 className="items-center">{data.FixedNo}</h1>
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center py-4 px-2 right-3 ">
            <button onClick={handlePrevPage} disabled={page === 1}>
              Prev
            </button>
            <h2 className="p-5">{page}</h2>
            <button onClick={handleNextPage}>Next</button>
          </div>
          <button className="flex items-center h-10 px-3 bg-green-300 rounded-md" onClick={handleGenerate}>
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateAIN;
