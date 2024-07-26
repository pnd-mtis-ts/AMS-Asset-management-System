import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import { Button } from 'bootstrap';
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import AlertComp from "./AlertComp";
import { getToken } from "../features/authSlice";
import AxiosContext from "../features/AxiosProvider";

function Userlist() {
  const axiosInstance = useContext(AxiosContext);
  const [data, setdata] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showAlert, setShowAlert] = useState(null);
  const [selectRole, setSelectRole] = useState(null);
  const accessToken = getToken();
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    getRoles();
    getUserRoles();
  }, []);

  const getRoles = async () => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/role`, accessToken);
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching user roles:", error);
      if(error.isForbidden){
        console.log("you're not allowed to access this data")
      }
    }
  };

  const getUserRoles = async () => {
    try {
      const userResponse = await axiosInstance.get(`${apiUrl}/users`, accessToken);
      const userRolesResponse = await axios.get(
        `${apiUrl}/user-role`,
        accessToken
      );
      const rolesResponse = await axiosInstance.get(`${apiUrl}/role`, accessToken);

      const users = userResponse.data;
      const userRoles = userRolesResponse.data.userRoles;
      const roles = rolesResponse.data;

      // Create a map to efficiently lookup role IDs by user ID
      const roleIdsByUserId = userRoles.reduce((acc, { userId, roleId }) => {
        if (!acc[userId]) {
          acc[userId] = [];
        }
        acc[userId].push(roleId);
        return acc;
      }, {});

      // Update users with their corresponding roles and role IDs
      const updatedUsers = users.map((user) => {
        const roleIds = roleIdsByUserId[user.id] || [];
        const userRole = roleIds.map(
          (roleId) => roles.find((role) => role.id === roleId)?.name
        );
        return { ...user, roles: userRole, roleIds: roleIds }; // Assign roleIds to user
      });

      setdata(updatedUsers);
      console.log(data);
    } catch (error) {
      console.error("Error fetching user roles:", error);
      if(error.isForbidden){
        console.log("you're not allowed to access this data")
      }
    }
  };

  const deleteUser = async (userId) => {
    await axiosInstance.delete(`${apiUrl}/users/${userId}`, accessToken);
    setShowAlert(false);
    getUserRoles(); // Update users after deletion
  };

  const addRole = async (userId, roleId) => {
    try {
      await axiosInstance.post(
        `${apiUrl}/user-role`,
        {
          userId: userId,
          roleId: roleId,
        },
        accessToken
      );
      await getUserRoles();
      setSelectRole(null);
    } catch (error) {
      console.error("Error adding role:", error);
      setSelectRole(null);
    }
  };

  const deleteRole = async (userId, roleId) => {
    try {
      await axiosInstance.delete(`${apiUrl}/user-role`, {
        ...getToken(), 
        data: { userId: userId, roleId: roleId },
      });
      // Update user data after role deletion
      await getUserRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const toggleDropdown = (index) => {
    setSelectRole((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleDelete = (userId) => {
    deleteUser(userId);
    setShowAlert(null);
  };

  return (
    <div className="bg-white border rounded-xl p-5 min-h-full">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-2xl montserrat-bold">User List</h1>
        <button
          onClick={() => navigate("/users/add")}
          type="button"
          className="p-2 bg-byzantium-600 rounded-md text-white font-medium"
        >
          Add New
        </button>
       
      </div>

      <div className=" overflow-x-auto shadow-md sm:rounded-lg container mt-5 w-full">
        <table className="w-full h-full text-sm text-center text-gray-500  ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th>No</th>
              <th>Name</th>
              <th className="px-6 py-3">Email</th>
              <th>Roles</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr
                className="odd:bg-whit even:bg-gray-50 border-b "
                key={d.id}
              >
                <td>{i + 1}</td>
                <td>{d.name}</td>
                <td className="px-6 py-3">{d.email}</td>
                <td className="px-4 py-2 block sm:table-cell">
                  {d.roles &&
                    d.roles.map((role, idx) => (
                      <span
                        className={`xl:px-3 py-1 md:inline-block block`}
                        key={idx}
                      >
                        {role}
                        <button
                          onClick={() => {
                            console.log("User ID:", d.id);
                            console.log("Role IDs:", d.roleIds);
                            console.log("Current Index:", idx);
                            if (d.roleIds && idx < d.roleIds.length) {
                              console.log("Deleting Role ID:", d.roleIds[idx]);
                              deleteRole(d.id, d.roleIds[idx]);
                            }
                          }}
                          className="px-2 py-1 ml-1 mt-1 rounded-full text-white"
                          style={{ backgroundColor: "red" }}
                        >
                          x
                        </button>
                        {idx < d.roles.length - 1 && "  "}
                      </span>
                    ))}
                  <div className="relative inline-block text-left ml-2">
                    <button
                      onClick={() => toggleDropdown(i)}
                      type="button"
                      class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      id="menu-button"
                      aria-expanded="true"
                      aria-haspopup="true"
                    >
                      Roles
                      <svg
                        class="-mr-1 h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>

                    <div
                      className={`${
                        selectRole === i
                          ? "absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                          : "hidden"
                      }`}
                    >
                      {roles.map((roles, i) => (
                        <div key={i}>
                          <button onClick={() => addRole(d.id, roles.id)}>
                            {roles.name}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </td>
                <td>
                  <Link to={`/users/edit/${d.id}`}>
                    <button className="p-3">
                      <MdEdit
                        className="text-blue-700"
                        style={{ fontSize: "1.5rem" }}
                      />
                    </button>
                  </Link>
                  <button onClick={() => setShowAlert(d.id)}>
                    <FaTrashAlt
                      className="text-red-600"
                      style={{ fontSize: "1.4rem" }}
                    />
                  </button>
                  {showAlert === d.id && (
                    <AlertComp
                      show={true}
                      title={"Delete User"}
                      message={`Are you sure to delete user ${d.name}?`}
                      onConfirm={() => handleDelete(d.id)}
                      onCancel={() => setShowAlert(null)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Userlist;
