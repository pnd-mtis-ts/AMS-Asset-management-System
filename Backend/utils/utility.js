import { Sequelize } from "sequelize";
import EntitasBisnis from "../models/EntitasBisnisModel.js";
import FixedGroup from "../models/FixedGroupModel.js";
import Fixed from "../models/FixedModel.js";

const generateFixedAndInvNo = async (fixedIds) => {
  const updatedFixedAssets = [];

  for (const fixedId of fixedIds) {
    const fixed = await Fixed.findByPk(fixedId);

    if (!fixed) {
      throw new Error(`Fixed asset with ID ${fixedId} not found.`);
    }

    const { IDNoEB, IDNoGR, Qty } = fixed;
    const eb = await EntitasBisnis.findByPk(IDNoEB);
    const fg = await FixedGroup.findByPk(IDNoGR);

    if (!eb || !fg) {
      throw new Error("Related EntitasBisnis or FixedGroup record not found.");
    }

    const EBCode = eb.EBCode;
    const NamePrefix = fg.CodeGR;
    const currentDate = new Date();
    const year = String(currentDate.getFullYear()).slice(-2);
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const DateSuffix = `${year}${month}`;

    const Increment =
      (await Fixed.count({
        where: {
          FixedNo: { [Sequelize.Op.like]: `${EBCode}.${NamePrefix}.${DateSuffix}.%` },
        },
      })) + 1;

    const IncrementFormatted = ("00" + Increment).slice(-2);

    fixed.FixedNo = `${EBCode}.${NamePrefix}.${DateSuffix}.${IncrementFormatted}.${("00" + Qty).slice(-3)}`;
    fixed.InvNo = `${EBCode}.${NamePrefix}.${DateSuffix}.${IncrementFormatted}.${("00" + Qty).slice(-3)}`;

    await fixed.save();
    updatedFixedAssets.push(fixed);
  }

  return updatedFixedAssets;
};

export { generateFixedAndInvNo };
