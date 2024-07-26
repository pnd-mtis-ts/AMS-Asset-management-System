import axios from "axios";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useReactToPrint } from "react-to-print";

const PrintQRModal = ({ show, onClosed }) => {
  const [fixeds, setFixed] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const ref = useRef([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // getFixed();
    axios.get(`http://localhost:5000/fixed?page=${page}`).then((res) => {
      const filteredData = res.data.data.filter((d) => d.FixedNo);
      setFixed(filteredData);
    });
    console.log(fixeds);
  }, [page]);

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

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 w-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full m-10 p-10 bg-white rounded-xl">
        <div className="flex justify-between items-center mb-3">
          <h2 className="bold-20 mb-3">Print QR Code</h2>
          <button className="text-white bg-red-600 rounded-[100%] py-2 px-3" onClick={onClosed}>
            X
          </button>
        </div>
        <table class="flex-row w-full overflow-y-auto text-sm text-center  text-gray-500 dark:text-gray-400  table-fixed mb-3">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                <tr class=" odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700" key={d.FixedIDNo}>
                  <td class=" ">{i + 1}</td>
                  <td class=" ">{d.FixedAssetName}</td>
                  <td class="p-3 relative overflow-hidden">{d.FixedNo}</td>
                  <td class=" ">{d.FixedGroup ? d.FixedGroup.Name : "N/A"}</td>
                  <td class=" ">{d.EntitasBisni ? d.EntitasBisni.EBCode : "N/A"}</td>
                  <td class=" ">
                    <input type="checkbox" checked={selectedItems.some((i) => i.FixedNo === d.FixedNo)} onChange={(event) => handleCheckboxChange(event, d)} />
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
                className="barcode-item p-5"
                // ref={(el) => (multiRef.current[index] = el)}
              >
                <QRCode value={data.FixedNo} size={200} />
                <h1 className="items-center">{data.FixedNo}</h1>
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center py-4 px-2 right-3 ">
            <button onClick={handlePrevPage}>Prev</button>
            <h2 className="p-5">{page}</h2>
            <button onClick={handleNextPage}>Next</button>
          </div>
          <button className="flex items-center h-10 px-3 bg-green-300 rounded-md" onClick={handlePrint}>
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintQRModal;
