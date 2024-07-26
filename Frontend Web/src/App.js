import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SideBar from "./components/SideBar";
import { getMe } from "./features/authSlice";
import AddAssets from "./pages/AddAssets";
import AddRole from "./pages/AddRole";
import AddUser from "./pages/AddUser";
import Dashboard from "./pages/Dashboard";
import DataAset from "./pages/DataAset";
import EditAssets from "./pages/EditAssets";
import EditRole from "./pages/EditRole";
import EditUser from "./pages/EditUser";
import Login from "./pages/Login";
import Master from "./pages/Master";
import Relocation from "./pages/Relocation";
import Roles from "./pages/Roles";
import Users from "./pages/Users";
import AddRelocation from "./pages/AddRelocation";
import PrintQRCode from "./pages/PrintQRCode";
import Detail from "./pages/Detail";
import { AxiosProvider } from "./features/AxiosProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const [hideSidebar, setHideSidebar] = useState(true);
  const { Error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (Error) {
      setHideSidebar(true);
    } else {
      setHideSidebar(false);
    }
  }, [Error, setHideSidebar]);

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <AxiosProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="*"
              element={
                <SideBar isHidden={hideSidebar}>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dataaset" element={<DataAset />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/users/add" element={<AddUser />} />
                    <Route path="/users/edit/:id" element={<EditUser />} />
                    <Route path="/role" element={<Roles />} />
                    <Route path="/relocation" element={<Relocation />} />
                    <Route
                      path="/relocation/add/:id?"
                      element={<AddRelocation />}
                    />
                    <Route path="/role/add/" element={<AddRole />} />
                    <Route path="/role/edit/:id" element={<EditRole />} />
                    <Route path="/dataaset/detail/:id" element={<Detail />} />
                    <Route path="/dataaset/add" element={<AddAssets />} />
                    <Route path="/dataaset/edit/:id" element={<EditAssets />} />
                    <Route path="/dataaset/printqr" element={<PrintQRCode />} />
                    <Route path="/master" element={<Master />} />
                  </Routes>
                </SideBar>
              }
            />
          </Routes>
        </AxiosProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
