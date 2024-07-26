import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getToken } from "../features/authSlice";
import DropdownComp from "./DropdownComp";
import ButtonBackComp from "./ButtonBackComp";
import AxiosContext from "../features/AxiosProvider";

const FormAddAsset = () => {
  const axiosInstance = useContext(AxiosContext);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const now = new Date();
  const currDate = new Date().toISOString().split('T')[0];
  const currTime = new Date().toLocaleTimeString();

  //add docs
  const [formData, setFormData] = useState({
    NoDocument: "",
    ExpiredDate: "",
    DocumentType: "",
  });
  const [dataArray, setDataArray] = useState([]);

  const [asset, setAsset] = useState([]);

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAsset((prev) => {
      return { ...prev, [name]: value };
    });
    console.log(e.target);
  };

  const handleDropdownChange = (name, value) => {
    setAsset((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleDateChange = (date, fieldName) => {
    setAsset({ ...asset, [fieldName]: date });
  };

  const handleDocsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handleDocsDateChange = (date) => {
    setFormData({ ...formData, ExpiredDate: date });
  };

  //tab layout
  const mainData = [
    {
      label: "Nama Asset",
      name: "FixedAssetName",
      value: asset.FixedAssetName,
      notNull: true,
    },
    {
      label: "Status",
      name: "Status",
      value: asset.Status,
      displayKey: "Name",
      valueKey: "value",
      notNull: true,
    },
    {
      label: "Entity",
      name: "Entity",
      value: asset.Entity,
      displayKey: "EntityName",
      valueKey: "Entity",
      notNull: true,
    },
    {
      label: "Entitas Bisnis",
      name: "IDNoEB",
      value: asset.IDNoEB,
      displayKey: "EBName",
      valueKey: "IDNo",
      notNull: true,
    },
    {
      label: "Group",
      name: "IDNoGR",
      value: asset.IDNoGR,
      displayKey: "Name",
      valueKey: "IDNo",
      notNull: true,
    },
    // { name: "RegDate", value: asset.RegDate},
  ];

  const generalInfo = [
    { label: "Akun Asset", name: "AccNo", value: asset.AccNo, notNull: true, },
    { label: "Akun Penyusutan", name: "AccDep", value: asset.AccDep },
    { label: "Tgl Akuisisi", name: "DateAq", value: asset.DateAq },
    { label: "Tgl Penyusutan", name: "DateDisp", value: asset.DateDisp },
    { label: "Cost Center", name: "CostCenterNo", value: asset.CostCenterNo },
    {
      label: "Profit Center",
      name: "ProfitCenterNo",
      value: asset.ProfitCenterNo,
    },
    {
      label: "Lokasi",
      name: "LocId",
      value: asset.LocId,
      displayKey: "LocationName",
      valueKey: "LocID",
    },
    { label: "PO", name: "IDNoPO", value: asset.IDNoPO },
    { label: "PR", name: "IDNoPR", value: asset.IDNoPR },
    { label: "PC", name: "IDNoPC", value: asset.IDNoPC },
    { label: "Line No BD", name: "LineNoBD", value: asset.LineNoBD },
    { label: "Order No", name: "OrderNo", value: asset.OrderNo },
    { label: "Pick Bill", name: "PickBill", value: asset.PickBill },
    { label: "Supplier", name: "SupplierId", value: asset.SupplierId },
    { label: "Jumlah", name: "Qty", value: asset.Qty, notNull: true, },
    { label: "Pick", name: "Pick", value: asset.Pick },
    { label: "Pick Group", name: "PickGR", value: asset.PickGR },
    { label: "Nomer Group", name: "GRNo", value: asset.GRNo },
    {
      label: "Unit",
      name: "Unit",
      value: asset.Unit,
      displayKey: "Unit",
      valueKey: "Unit",
    },
    { label: "Cost", name: "Cost", value: asset.Cost },
    { label: "S Unit", name: "SUnit", value: asset.SUnit },
    { label: "Salvage Value", name: "SalVageValue", value: asset.SalVageValue, notNull: true, },
    {
      label: "Salvage Value Original",
      name: "SalVageValueORG",
      value: asset.SalVageValueORG,
    },
    { label: "Remark", name: "Remark", value: asset.Remark },
    // { name: "Sqm", value: asset.Sqm },
    { label: "Kelompok", name: "Classification", value: asset.Classification },
    { label: "Brand", name: "Brand", value: asset.Brand },
    { label: "Chassis No", name: "ChassisNo", value: asset.ChassisNo },
    { label: "Engine NO", name: "EngineNo", value: asset.EngineNo },
    { label: "Weight", name: "Weight", value: asset.Weight },
    { label: "No Registrasi", name: "RegNo", value: asset.RegNo },
    { label: "Tgl Registrasi", name: "RegDate", value: asset.RegDate },
    { label: "Tgl Garansi", name: "GuaranteeDate", value: asset.GuaranteeDate },
    { label: "Nama Pengguna", name: "HolderName", value: asset.HolderName },
    { label: "Emp Id", name: "EmpId", value: asset.EmpID },
    { label: "User Id", name: "UserId", value: asset.UserID },
  ];

  //fixed group dropdown
  const [entity, setEntity] = useState([]);
  const [group, setGroup] = useState([]);
  const [entitasBisnis, setEntitasBisnis] = useState([]);
  const [location, setLocation] = useState([]);
  const [unit, setUnit] = useState([]);
  useEffect(() => {
    const fetchEntity = async () => {
      const res = await axiosInstance.get(`${apiUrl}/entity`, getToken());
      setEntity(res.data);
    };
    const fetchGroup = async () => {
      const res = await axiosInstance.get(`${apiUrl}/fixed-group`, getToken());
      setGroup(res.data);
    };
    const fetchEB = async () => {
      const res = await axiosInstance.get(`${apiUrl}/entitas-bisnis`, getToken());
      setEntitasBisnis(res.data);
    };
    const fetchLoc = async () => {
      const res = await axiosInstance.get(`${apiUrl}/location`, getToken());
      setLocation(res.data);
    };
    const fetchUnit = async () => {
      const res = await axiosInstance.get(`${apiUrl}/unit`, getToken());
      setUnit(res.data);
    };
    fetchEntity();
    fetchEB();
    fetchGroup();
    fetchLoc();
    fetchUnit();
  }, [setEntity, setGroup, setEntitasBisnis, setLocation, setUnit]);

  const statusOption = [
    { Name: "Inactive", value: 0 },
    { Name: "Active", value: 1 },
  ];

  // Form component logic for each field (replace with your actual components)

  const renderForm = (label, fieldName, value, displayKey, valueKey, notNull) => {
    const inputType = typeof value === "number" ? "number" : "text";

    const options = (() => {
      switch (fieldName) {
        case "Entity":
          return entity;
        case "IDNoGR":
          return group;
        case "IDNoEB":
          return entitasBisnis;
        case "Status":
          return statusOption;
        case "LocId":
          return location;
        case "Unit":
          return unit;
        default:
          return null;
      }
    })();

    if (
      fieldName === "DateAq" ||
      fieldName === "DateDisp" ||
      fieldName === "RegDate" ||
      fieldName === "GuaranteeDate"
    ) {
      return (
        <div key={fieldName} className="flex flex-row items-center mx-3">
          <label htmlFor={fieldName} className="label w-[45%]">
            {label}<span className={` ${notNull ? 'text-red-500' : 'hidden'}`}>*</span>
          </label>
          <DatePicker
            selected={value}
            onChange={(date) => handleDateChange(date.toLocaleDateString('en-US'), fieldName)}
            className="w-[55%] input p-1 shadow appearance-none border rounded focus:outline-none focus:shadow-outline my-2"
          />
        </div>
      );
    } else if (options) {
      return (
        <div key={fieldName} className="flex flex-row items-center mx-3">
          <DropdownComp
            label={label}
            name={fieldName}
            options={options}
            selectedOption={value}
            onOptionSelect={handleDropdownChange}
            placeholder={`Select ${label}`}
            displayKey={displayKey}
            valueKey={valueKey}
            enableSearch={false}
            notNull={true}
          />
        </div>
      );
    } else {
      return (
        <div key={fieldName} className="flex flex-row items-center mx-3">
          <label htmlFor={fieldName} className="label w-[45%]">
            {label}<span className={` ${notNull ? 'text-red-500' : 'hidden'}`}>*</span>
          </label>
          {/* {isOptional ? (
                    <input
                        type={inputType}
                        id={fieldName}
                        name={fieldName}
                        value={asset[fieldName]}
                        onChange={handleChange}
                        className="input p-3 shadow appearance-none border rounded w-full focus:outline-none focus:shadow-outline my-2 "
                    />
                    ) : ( */}
          <input
            type={inputType}
            id={fieldName}
            name={fieldName}
            // required
            value={value}
            onChange={handleInputChange}
            className="w-[55%] input p-1 shadow appearance-none border rounded focus:outline-none focus:shadow-outline my-2"
          />
          {/* )} */}
        </div>
      );
    }
  };

  //tab layout
  const [toggleState, setToggleState] = useState(1);
  const toggleTab = (index) => {
    setToggleState(index);
  };

  //tab document
  const handleAddDocs = () => {
    setDataArray((prevArray) => [
      ...prevArray,
      {
        NoDocument: formData.NoDocument,
        ExpiredDate: formData.ExpiredDate,
        DocumentType: formData.DocumentType,
      },
    ]);
    setFormData({ NoDocument: "", ExpiredDate: "", DocumentType: "" }); // Reset form
    console.log(dataArray);
  };
  const handleDelDocs = (index, key, value) => {
    setDataArray((prevArray) => prevArray.filter((_, i) => i !== index));
  };
  const mapDocs = (dataArray) => {
    return dataArray.map((data) => ({
      NoDocument: data.NoDocument,
      ExpiredDate: data.ExpiredDate,
      DocumentType: data.DocumentType,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Asset:', asset);
  console.log('DataArray:', dataArray);
    try {
      const response = await axiosInstance.post(
        `${apiUrl}/fixed`,
        {
          fixedData: {
            Entity: asset.Entity,
            FixedAssetName: asset.FixedAssetName,
            AccNo: asset.AccNo,
            IDNoEB: asset.IDNoEB,
            IDNoGR: asset.IDNoGR,
            Qty: asset.Qty,
            SalVageValue: asset.SalVageValue,
            Status: asset.Status,
            RegDate: currDate,
            DateAq: asset.DateAq,
            DateDisp: asset.DateDisp,
            CostCenterNo: asset.CostCenterNo,
            ProfitCenterNo: asset.ProfitCenterNo,
            LocId: asset.LocId,
            IDNoPO: asset.IDNoPO,
            IDNoPR: asset.IDNoPR,
            IDNoPC: asset.IDNoPC,
            LineNoBD: asset.LineNoBD,
            OrderNo: asset.OrderNo,
            InvNo: asset.InvNo,
            PickBill: asset.PickBill,
            SupplierId: asset.SupplierId,
            Pick: asset.Pick,
            PickGR: asset.PickGR,
            Unit: asset.Unit,
            SUnit: asset.SUnit,
            Cost: asset.Cost,
            SalVageValueORG: asset.SalVageValueORG,
            AccDep: asset.AccDep,
            Pict: asset.Pict,
            Remark: asset.Remark,
            IDNo: asset.IDNo,
            SQM: asset.SQM,
            Weight: asset.Weight,
            HolderName: asset.HolderName,
            Classification: asset.Classification,
            Brand: asset.Brand,
            ChassisNo: asset.ChassisNo,
            EngineNo: asset.EngineNo,
            RegNo: asset.RegNo,
            GuaranteeDate: asset.GuaranteeDate,
            EmpID: asset.EmpID,
            UserID: asset.UserID,
          },
          documentData: dataArray.filter(
            (doc) =>
              doc.NoDocument !== "" &&
              doc.ExpiredDate !== "" &&
              doc.DocumentType !== ""
          ),
        },
        getToken()
      );
      console.log("Data submitted successfully:", response.data);
      navigate("/dataaset");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
        console.log(msg);
        // console.log(date);
      }
    }
  };

  return (
    <div className="bg-white border rounded-xl p-5 min-h-full">
      <ButtonBackComp onClick={() => navigate("/dataaset", { replace: true })}/>
      <h2 className="text-2xl montserrat-bold">Add New Asset</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 w-full">
          {mainData.map((data) =>
            renderForm(
              data.label,
              data.name,
              data.value,
              data.displayKey,
              data.valueKey,
              data.notNull
            )
          )}
        </div>

        <div className="w-full mt-3 border-2 p-4 rounded-xl">
          <div className="flex flex-row border-b-2">
            <div
              className={
                toggleState === 1
                  ? "inline-block px-4 pb-2 border-b-2 rounded-t-lg text-pink_lavender-400 border-pink_lavender-400"
                  : "inline-block px-4 pb-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }
              onClick={() => toggleTab(1)}
            >
              General Info
            </div>
            <div
              className={
                toggleState === 2
                  ? "inline-block px-4 pb-2 border-b-2 rounded-t-lg text-pink_lavender-400 border-pink_lavender-400"
                  : "inline-block px-4 pb-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }
              onClick={() => toggleTab(2)}
            >
              Document
            </div>
          </div>

          <div className="w-full h-full">
            {/* generalInfo */}
            <div
              className={
                toggleState === 1
                  ? "flex flex-col xl:flex-row w-full"
                  : "hidden"
              }
            >
              <div className="grid gap-4 lg:grid-rows-12 lg:grid-flow-col sm:grid-cols-1 sm:grid-flow-row w-full">
                {generalInfo.map((data) =>
                  renderForm(
                    data.label,
                    data.name,
                    data.value,
                    data.displayKey,
                    data.valueKey,
                    data.notNull
                  )
                )}
              </div>
            </div>

            {/* document */}
            <div className={toggleState === 2 ? "" : "hidden"}>
              <div>
                {dataArray.length > 0 && (
                  <table className="w-full h-full text-sm text-center  text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th>No</th>
                        <th className="px-6 py-3">No Document</th>
                        <th>Document Type</th>
                        <th>Expired Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataArray.map((doc, i) => (
                        <tr
                          key={i}
                          className="odd:bg-white even:bg-gray-50"
                        >
                          <td>{i + 1}</td>
                          <td className="px-6 py-3">{doc.NoDocument}</td>
                          <td>{doc.DocumentType}</td>
                          <td>{doc.ExpiredDate}</td>
                          <td>
                            <button onClick={() => handleDelDocs(i)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="flex w-full p-3">
                <div className="flex flex-row items-center justify-between w-[45%]">
                  <label htmlFor="">No Document</label>
                  <input
                    name="NoDocument"
                    value={formData.NoDocument}
                    type="text"
                    onChange={handleDocsChange}
                    className="input p-1 mx-3 w-[65%] shadow appearance-none border rounded focus:outline-none focus:shadow-outline my-2"
                  />
                </div>
                <div className="flex flex-row items-center justify-between w-[45%]">
                  <label htmlFor="">Document Type</label>
                  <input
                    name="DocumentType"
                    value={formData.DocumentType}
                    type="text"
                    onChange={handleDocsChange}
                    className="input p-1 mx-3 w-[65%] shadow appearance-none border rounded focus:outline-none focus:shadow-outline my-2"
                  />
                </div>
                <div className="flex flex-row items-center justify-between w-[45%]">
                  <label htmlFor="">Expired Date</label>
                  <DatePicker
                    selected={formData.ExpiredDate}
                    onChange={(date) => handleDocsDateChange(date.toLocaleDateString('en-US'))}
                    className="w-[55%] input p-1 shadow appearance-none border rounded focus:outline-none focus:shadow-outline my-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddDocs}
                  className="p-2 rounded-md text-white bg-pink_lavender-400"
                >
                  Add
                </button>
              </div>
              {/* <div className="flex w-full justify-end ">
                </div> */}
            </div>
          </div>
        </div>

        {/* Add your logic for Submit Button and Dropdown Menus */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bold-20 text-white bg-pink_lavender-400 py-3 px-10 my-5 rounded-xl shadow-lg hover:bg-pink_lavender-300"
          >
            Add New Asset
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormAddAsset;
