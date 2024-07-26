import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { BsArrowLeftShort } from "react-icons/bs";
// import { GiHamburgerMenu } from "react-icons/gi";
import Hamburger from "hamburger-react";
import { BiSolidEditLocation } from "react-icons/bi";
import { FaFolder, FaUserAlt, FaUsers } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { LuFolderInput, LuFolderOutput } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import { RiDashboardFill } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch } from 'react-redux';
import { LogOut, axiosInstance, getMe, getToken, reset } from "../features/authSlice";
import AlertLogout from './AlertLogout';
import axios from 'axios';
import AxiosContext from '../features/AxiosProvider';

const SideBar = ({ children, isHidden }) => {
  const axiosInstance = useContext(AxiosContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleItemClick = (index) => {
    setActiveIndex(index);
    setIsMobileOpen(false);
  };

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Get data user
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    // const res = getMe();
    // console.log(res);
    // setUsername(res.name);
    // setRole(res.email);

    axiosInstance.get(`${apiUrl}/me`,  getToken() ).then(res => {
      setUsername(res.data.User.name);
      setRole(res.data.role.name);
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  }, []);

  // Logout
  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  const menus = [
    { name: "Dashboard", link: "/dashboard", icon: RiDashboardFill },
    { name: "User", link: "/users", icon: FaUserAlt },
    { name: "Data Asset", link: "/dataaset", icon: FaFolder },
    { name: "Role", link: "/role", icon: FaUsers },
    { name: "Relokasi", link: "/relocation", icon: BiSolidEditLocation },
    // { name: "Asset Masuk", link: "/master", icon: LuFolderInput },
    // { name: "Asset Keluar", link: "#", icon: LuFolderOutput },
    // { name: "Laporan", link: "#", icon: TbReportAnalytics },
    // { name: "Settings", link: "#", icon: IoSettingsOutline, margin: true },
    { name: "LogOut", link: "#", icon: MdLogout, onClick: () => setShowLogoutAlert(true) },
  ];

  return (
    <div className={`flex flex-row ${isHidden ? "hidden" : ""}`}>
      <button className={`md:hidden flex items-center fixed top-5 right-5 z-50 space-x-2 `} onClick={handleMobileToggle}>
        <Hamburger toggle={setIsMobileOpen} toggled={isMobileOpen} size={25} />
      </button>
      <aside
        className={`flex h-screen overflow-y-auto overflow-x-hidden bg-wenge-500 transition-transform transform 
          ${isMobileOpen ? "-translate-y-px-" : "-translate-x-full"} md:translate-x-0`}
        style={{ borderRadius: "0px 30px 30px 0px" }}
      >
        <div className={`p-5 ${sidebarToggle ? "w-72" : "w-20"} duration-300 relative`}>
          <div className="flex justify-around items-center">
            {/* <img
              src={process.env.PUBLIC_URL + "/arrow_sb.svg"}
              alt="icon"
              className={`hidden md:block bg-wenge-700 text-white text-3xl rounded-full cursor-pointer 
                ${!sidebarToggle && "rotate-180"} ${sidebarToggle ? "absolute right-3 top-5" : "absolute justify-center mb-2 "}`}
              onClick={() => setSidebarToggle(!sidebarToggle)}
            /> */}
            <IoIosArrowBack 
              className={`hidden md:block bg-wenge-700 text-white text-3xl rounded-full cursor-pointer p-1
                ${!sidebarToggle && "rotate-180"} ${sidebarToggle ? "absolute right-3 top-5" : "absolute justify-center mb-2 "}`}
              onClick={() => setSidebarToggle(!sidebarToggle)}
            />
            <div className="mb-2 items-center">
              <h1 className={`text-xl font-semibold text-white ${!sidebarToggle && `invisible`}`}>Logo</h1>
            </div>
          </div>
          <div className={`my-3 flex flex-row items-center ${sidebarToggle && `p-3 bg-slate-100 rounded-xl`} hover:bg-light-white`}>
            <img src={process.env.PUBLIC_URL + "profile-avatar.svg"} alt="profile" className="w-[40px] h-[40px]" />
            <div className={`flex flex-col mx-3 ${!sidebarToggle && `invisible`}`}>
              {username && <h2 className="text-xl font-bold">{username}</h2>}
              {role && <h3 className="text-xs text-grey truncate">{role}</h3>}
            </div>
          </div>
          <div className="flex flex-col gap-4 relative">
            {menus.map((menu, i) => (
              <Link
                to={menu?.link}
                key={i}
                className={`${menu?.margin && "mt-5"} flex items-center text-sm gap-3.5 font-medium p-2 rounded-md  ${activeIndex === i ? "bg-gray-200 text-wenge" : "text-wenge-900 hover:bg-gray-200 hover:text-wenge"} ${menu.name === "LogOut" && `bottom-3`}`}
                onClick={() => {
                  handleItemClick(i);
                  if (menu?.onClick) {
                    menu.onClick();
                  }
                }}
                style={{ paddingRight: "30px", marginRight: "-20px", width: "calc(100% + 20px)", borderRadius: "20px 0px 0px 20px" }}
              >
                <div>{React.createElement(menu?.icon, { size: "20" })}</div>
                <h2
                  // style={{ transitionDelay: `${i + 3}00ms` }}
                  className={` ${!sidebarToggle && "opacity-0 overflow-hidden"}
                   ${!sidebarToggle && "opacity-0 "} `}
                >
                  {menu?.name}
                </h2>
              </Link>
            ))}
          </div>
        </div>
      </aside>
      <main className="p-3 w-full h-screen overflow-auto">{children}</main>
      <AlertLogout show={showLogoutAlert} onConfirm={logout} onCancel={() => setShowLogoutAlert(false)} />
    </div>
  );
};

export default SideBar;
