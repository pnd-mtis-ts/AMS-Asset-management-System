import React from "react";
import QRCode from "react-qr-code";

const QrPrintLayout = ({ FixedNo, FixedAssetName, EntityName, GroupName }) => {
  return (
    <div className="flex items-center barcode-item p-3 m-3 border rounded-md max-w-85">
      <QRCode value={FixedNo} size={50} />
      <div className="px-1">
        <p className="items-center text-xs">{FixedNo}</p>
        <p className="items-center text-xs">{FixedAssetName}</p>
        <p className="items-center text-xs">{EntityName}</p>
        <p className="items-center text-xs">{GroupName}</p>
      </div>
    </div>
  );
};

export default QrPrintLayout;
