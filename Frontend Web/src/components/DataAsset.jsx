import React, { useEffect, useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { IoMdBarcode } from "react-icons/io";
import { HiDocumentText } from "react-icons/hi2";
import axios from "axios";
import Barcode from "react-barcode";
import ReactToPrint from "react-to-print";
import QRCode from "react-qr-code";
import PrintQRModal from "./PrintQRModal";
import AlertComp from "./AlertComp";
import { getToken } from "../features/authSlice";
import GenerateAIN from "./GenerateAIN";
import QrPrintLayout from "./QrPrintLayout";
import AxiosContext from "../features/AxiosProvider";

const DataAsset = () => {
  const axiosInstance = useContext(AxiosContext);
  const [fixeds, setFixed] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showNull, setShowNull] = useState(false);
  const [showAlert, setShowAlert] = useState(null);

  const ref = useRef([]);
  const multiRef = useRef([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState();
  const [search, setSearch] = useState("");

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    getFixed(page, pageSize, search);
    console.log(fixeds);
  }, [page, pageSize, search]);

  const getFixed = async (page, pageSize, search) => {
    try {
      const response = await axiosInstance.get(
        `${apiUrl}/fixed?page=${page}&pageSize=${pageSize}&search=${search}`, getToken()
      );
      setFixed(response.data.data);
      setTotalPage(response.data.totalPages)
      console.log(response)
      console.log(totalPage);
      console.log(fixeds);
    } catch (error) {
      setError("Failed to fetch fixed assets");
    }
  };

  const deleteFixed = async (FixedIDNo) => {
    await axiosInstance.delete(`${apiUrl}/fixed/${FixedIDNo}`, getToken());
    getFixed(page, pageSize);
  };

  const handleNextPage = () => {
    setPage((prevState) => prevState + 1);
  };

  const handlePrevPage = () => {
    setPage((prevState) => prevState - 1);
  };

  const handlePageSize = (e) => {
    const value = e.target.value;
    setPageSize(value);
    getFixed(page, pageSize);
  };

  const handleDelete = (fixedId) => {
    deleteFixed(fixedId);
    setShowAlert(null);
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch(value);
    console.log(e.target);
  };

  return (
    <div className="bg-white border rounded-xl p-5 min-h-full">
      <div className="w-full flex items-baseline justify-between">
        <h1 className="text-2xl montserrat-bold">Data Asset Page</h1>
        <div>
          <button
            onClick={() => setShowNull(true)}
            className="mx-2 p-2 bg-byzantium-800 rounded-md text-white font-medium">
            Generate AIN
          </button>
          <button
            className="mx-2 p-2 bg-byzantium-700 rounded-md text-white font-medium"
            type="button"
            onClick={() => navigate("/dataaset/printqr")}
          >
            Print Barcode
          </button>
          <button className="mx-2 p-2 bg-byzantium-600 rounded-md text-white font-medium" type="button" onClick={() => navigate("/dataaset/add")}>
            Add New
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="flex flex-row-reverse justify-between w-full m-3">
          <div className="w-[30%] mx-3">
            <form className="xl:w-full mx-auto">
              <label
                for="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
                  className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search name or AIN..."
                  onChange={handleSearchChange}
                  value={search}
                />
              </div>
            </form>
          </div>
          <div className="flex items-end">
            <p>Show</p>
            <select
              name=""
              id=""
              onChange={handlePageSize}
              className="mx-3 border rounded-md"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </div>
        </div>
        <div className="w-full shadow-md sm:rounded-lg  mt-5">
          {isLoading && <p>Loading assets...</p>}
          {error && <p className="error-message">{error}</p>}
          {/* {!isLoading && !error  && <p>No assets found.</p>} */}
          {!isLoading && !error && fixeds.length > 0 && (
            <>
              <table className="flex-row  overflow-y-auto w-full text-sm text-center  text-gray-500   table-auto">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                  <tr>
                    <th className="px-6 py-3">No</th>
                    <th>Asset Name</th>
                    <th>Entity</th>
                    <th>Acc No</th>
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
                        className=" odd:bg-white even:bg-gray-50 border-b "
                        key={d.FixedIDNo}
                      >
                        <td className=" ">{(page - 1) * pageSize + i + 1}</td>
                        <td>{d.FixedAssetName}</td>
                        <td className=" ">{d.EntityRelations.EntityName}</td>
                        <td className=" overflow-hidden  ">{d.AccNo}</td>
                        <td className="p-3 relative overflow-hidden">
                          {d.FixedNo}
                        </td>
                        <td className=" ">
                          {d.FixedGroup ? d.FixedGroup.Name : "N/A"}
                        </td>
                        <td className=" ">
                          {d.EntitasBisni ? d.EntitasBisni.EBCode : "N/A"}
                        </td>
                        <td className="overflow-x-auto hidden">
                          <div ref={(el) => (multiRef.current[i] = el)} className="max-w-85">
                            <QrPrintLayout
                              FixedNo={d.FixedNo}
                              FixedAssetName={d.FixedAssetName}
                              EntityName={d?.EntityRelations?.EntityName}
                              GroupName={d?.FixedGroup?.Name}
                            />
                          </div>
                        </td>
                        <td className="">
                          <Link to={`/dataaset/detail/${d.FixedIDNo}`}>
                            <button className="">
                              <HiDocumentText 
                                className="text-green-300"
                                style={{ fontSize: "1.5rem" }}
                              />
                            </button>
                          </Link>
                          <Link to={`/dataaset/edit/${d.FixedIDNo}`}>
                            <button className="p-3">
                              <MdEdit
                                className="text-blue-700"
                                style={{ fontSize: "1.5rem" }}
                              />
                            </button>
                          </Link>
                          <ReactToPrint
                            trigger={() => (
                              <button className="pr-3">
                                {" "}
                                <IoMdBarcode
                                  className="text-gray-400"
                                  style={{ fontSize: "1.4rem" }}
                                />
                              </button>
                            )}
                            content={() => multiRef.current[i]}
                          />
                          <button onClick={() => setShowAlert(d.FixedIDNo)}>
                            <FaTrashAlt
                              className="text-red-600"
                              style={{ fontSize: "1.4rem" }}
                            />
                          </button>
                          
                          {showAlert === d.FixedIDNo && (
                            <AlertComp
                              show={true}
                              title={"Delete Data"}
                              message={`Are you sure to delete data ${d.FixedNo}?`}
                              onConfirm={() => handleDelete(d.FixedIDNo)}
                              onCancel={() => setShowAlert(null)}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </>
          )}
        </div> 
        <div className="flex justify-end items-baseline px-2 pt-3">
          <button onClick={handlePrevPage} disabled={page === 1}>Prev</button>
          <h2 className="px-5 ">{page}</h2>
          <button onClick={handleNextPage} disabled={page === totalPage-1}>Next</button>
        </div>
      </div>
      
      <GenerateAIN
        show={showNull}
        onClosed={() => setShowNull(!showNull)}
      />
    </div>
  );
};

export default DataAsset;
