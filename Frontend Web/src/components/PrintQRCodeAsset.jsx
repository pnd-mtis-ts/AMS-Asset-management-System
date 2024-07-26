import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import { useReactToPrint } from "react-to-print";
import { getToken } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import QrPrintLayout from "./QrPrintLayout";
import ButtonBackComp from "./ButtonBackComp";
import AxiosContext from "../features/AxiosProvider";

const PrintQRCodeAsset = () => {
  const axiosInstance = useContext(AxiosContext);
  const [fixeds, setFixed] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const ref = useRef([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL;

  const getAsset = async (page, pageSize, search) => {
    try {
      const response = await axiosInstance.get(
        `${apiUrl}/fixed?page=${page}&pageSize=${pageSize}&search=${search}`,
        getToken()
      );
      setFixed(response.data.data);
      setTotalPage(response.data.totalPages);
      console.log(fixeds);
    } catch (error) {
      console.log("Failed to fetch fixed assets");
    }
  };

  useEffect(() => {
    getAsset(page, pageSize, search);
    console.log(fixeds);
  }, [page, pageSize, search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearch(value);
    console.log(e.target);
  };

  const handleCheckboxChange = (event, item) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(selectedItems.filter((i) => i.FixedNo !== item.FixedNo));
    }
    console.log(selectedItems);
  };

  const handleNextPage = () => {
    setPage((prevState) => prevState + 1);
  };

  const handlePrevPage = () => {
    setPage((prevState) => prevState - 1);
  };

  const handlePrint = useReactToPrint({
    content: () => ref.current,
    onAfterPrint: () => setSelectedItems([]),
  });
  return (
    <div className="w-full m-3 p-3 px-5 bg-white rounded-xl min-h-full">
      <div className=" justify-between items-center">
       <ButtonBackComp onClick={() => navigate("/dataaset", { replace: true })}/>
        <h2 className="bold-20 mb-3">Print QR Code</h2>
      </div>
      <div>
        <form class="xl:w-full mx-auto mb-5 ">
          <label
            for="default-search"
            class="mb-2 text-sm font-medium text-gray-900 sr-only"
          >
            Search
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                class="w-4 h-4 text-gray-500 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search name or AIN..."
              onChange={handleChange}
              value={search}
            />
          </div>
        </form>
      </div>
      <table class="flex-row w-full overflow-y-auto text-sm text-center  text-gray-500 table-fixed mb-3">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
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
          {fixeds &&
            fixeds.map((d, i) => (
              <tr
                class=" odd:bg-white even:bg-gray-50"
                key={d.FixedIDNo}
              >
                <td class=" ">{(page - 1) * pageSize + i + 1}</td>
                <td class=" ">{d.FixedAssetName}</td>
                <td class="p-3 relative overflow-hidden">{d.FixedNo}</td>
                <td class=" ">{d.FixedGroup ? d.FixedGroup.Name : "N/A"}</td>
                <td class=" ">
                  {d.EntitasBisni ? d.EntitasBisni.EBCode : "N/A"}
                </td>
                <td class=" ">
                  <input
                    type="checkbox"
                    checked={selectedItems.some((i) => i.FixedNo === d.FixedNo)}
                    onChange={(event) => handleCheckboxChange(event, d)}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="hidden">
        <div ref={ref} className="flex flex-row flex-wrap">
          {selectedItems.map((data, index) => (
            <div
              key={index}
            >
              <QrPrintLayout
                FixedNo={data.FixedNo}
                FixedAssetName={data.FixedAssetName}
                EntityName={data?.EntityRelations?.EntityName}
                GroupName={data?.FixedGroup?.Name}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center py-4 px-2 right-3 ">
          <button onClick={handlePrevPage} disabled={page === 1}>Prev</button>
          <h2 className="p-5">{page}</h2>
          <button onClick={handleNextPage} disabled={page === totalPage-1}>Next</button>
        </div>
        <button
          className="flex items-center h-10 px-3  text-white bg-pink_lavender-400 hover:bg-pink_lavender-300 rounded-md"
          onClick={handlePrint}
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default PrintQRCodeAsset;
