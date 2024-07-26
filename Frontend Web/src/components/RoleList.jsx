import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AlertComp from "./AlertComp";
import { getToken } from "../features/authSlice";
import AxiosContext from "../features/AxiosProvider";
import { toast } from "react-toastify";

const RoleList = () => {
  const axiosInstance = useContext(AxiosContext);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [originalPermissions, setOriginalPermissions] = useState({});
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  const getRoles = async () => {
    const response = await axiosInstance.get(`${apiUrl}/role`, getToken());
    setRoles(response.data);
  };
  useEffect(() => {
    getRoles();

    //Fetch permissions
    axiosInstance.get(`${apiUrl}/permissions`, getToken()).then((response) => {
      const organizedPermissions = organizePermissionsByResource(response.data);
      setPermissions(organizedPermissions);
    });
  }, []);

  useEffect(() => {
    if (selectedRole) {
      axiosInstance
        .get(`${apiUrl}/role-permissions/${selectedRole}`, getToken())
        .then((response) => {
          updateSelectedPermission(response.data);
        })
        .catch((error) => {
          console.error("Error retrieving role permissions:", error);
        });
    } else {
      setSelectedPermissions({});
      setOriginalPermissions({});
    }
  }, [selectedRole]);

  const organizePermissionsByResource = (permissions) => {
    const organize = {};
    permissions.forEach((permissions) => {
      const { resource, action, id } = permissions;
      if (!organize[resource]) {
        organize[resource] = {};
      }
      organize[resource][action] = id;
    });
    return organize;
  };

  const updateSelectedPermission = (rolePermission) => {
    const updatePermissions = {};
    const originalPerms = {};
    rolePermission.forEach(({ roleId, permissionId }) => {
      const foundPermission = Object.keys(permissions).find((resource) =>
        Object.values(permissions[resource]).includes(permissionId)
      );

      if (foundPermission) {
        const resource = foundPermission;
        const action = Object.keys(permissions[resource]).find(
          (action) => permissions[resource][action] === permissionId
        );
        if (!updatePermissions[resource]) {
          updatePermissions[resource] = {};
          originalPerms[resource] = {};
        }
        updatePermissions[resource][action] = permissionId;
        originalPerms[resource][action] = permissionId;
      }
    });
    setSelectedPermissions(updatePermissions);
    setOriginalPermissions(originalPerms);
  };

  const handlePermissionChange = (resource, action, checked) => {
    setSelectedPermissions((prevState) => {
      const newState = { ...prevState };

      const permission = permissions[resource][action];
      if (!permission) {
        console.error(
          `Permission ID not found for action '${action}' on resource '${resource}'`
        );
        return newState;
      }

      if (checked) {
        if (!newState[resource]) {
          newState[resource] = {};
        }
        newState[resource][action] = permission;
      } else {
        if (newState[resource]) {
          delete newState[resource][action];
        }
      }

      return newState;
    });
  };

  const handleSave = async () => {
    const addedPermissions = [];
    const removedPermissions = [];

    Object.keys(selectedPermissions).forEach((resource) => {
      Object.keys(selectedPermissions[resource]).forEach((action) => {
        const permissionId = selectedPermissions[resource][action];
        if (
          !originalPermissions[resource] ||
          originalPermissions[resource][action] !== permissionId
        ) {
          addedPermissions.push(permissionId);
        }
      });
    });

    Object.keys(originalPermissions).forEach((resource) => {
      Object.keys(originalPermissions[resource]).forEach((action) => {
        const permissionId = originalPermissions[resource][action];
        if (
          !selectedPermissions[resource] ||
          selectedPermissions[resource][action] !== permissionId
        ) {
          removedPermissions.push(permissionId);
        }
      });
    });

    if (selectedRole) {
      try {
        const promises = [];

        if (addedPermissions.length > 0) {
          promises.push(
            axiosInstance.post(
              `${apiUrl}/role-permissions`,
              {
                roleId: selectedRole,
                permissionId: addedPermissions,
              },
              getToken()
            )
          );
        }

        if (removedPermissions.length > 0) {
          promises.push(
            axiosInstance.delete(
              `${apiUrl}/role-permissions`,
              {
                data: {
                  roleId: selectedRole,
                  permissionId: removedPermissions,
                },
              },
              getToken()
            )
          );
        }

        await Promise.all(promises);

        // Update local state to reflect changes
        const updatedPermissions = { ...selectedPermissions };
        Object.keys(selectedPermissions).forEach((resource) => {
          Object.keys(selectedPermissions[resource]).forEach((action) => {
            if (
              removedPermissions.includes(selectedPermissions[resource][action])
            ) {
              delete updatedPermissions[resource][action];
            }
          });
        });
        setSelectedPermissions(updatedPermissions);
        setSelectedRole("");

        toast.success("Permission has been updated", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (error) {
        console.error("Error saving role permissions:", error);
        alert("Error saving role permissions");
      }
    } else {
      alert("Please select a role and at least one permission");
    }
  };

  const deleteRole = async (roleId) => {
    await axiosInstance.delete(`${apiUrl}/role/${roleId}`, getToken());
    setShowAlert(!showAlert);
    getRoles();
  };

  const handleDelete = (roleId) => {
    deleteRole(roleId);
    setShowAlert(null);
  };

  return (
    <div className="bg-white border rounded-xl p-5 min-h-full">
      <div className="flex w-full justify-between items-center">
        <h2 className="text-2xl montserrat-bold">Roles</h2>
        <button
          onClick={() => navigate("/role/add")}
          type="button"
          className="p-2 bg-byzantium-600 rounded-md text-white font-medium"
        >
          Add New
        </button>
      </div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg container mt-5">
        <table class="min-w-full  h-full text-sm text-center  text-gray-500  table-fixed">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-2 ">No</th>
              <th>Role Name</th>
              <th className="px-6 py-3">Permissions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, i) => (
              <>
                <tr
                  className="odd:bg-white even:bg-gray-50"
                  key={role.id}
                >
                  <td className="px-2">{i + 1}</td>
                  <td>{role.name}</td>
                  <td>
                    <button
                      onClick={
                        selectedRole
                          ? () => setSelectedRole("")
                          : () => setSelectedRole(role.id)
                      }
                    >
                      {selectedRole === role.id ? "Hide" : "Show"}
                    </button>
                  </td>
                  <td>
                    <Link to={`/role/edit/${role.id}`}>
                      <button className="items-center p-3">
                        <MdEdit
                          className="text-blue-700 items-center"
                          style={{ fontSize: "1.5rem" }}
                        />
                      </button>
                    </Link>
                    <button
                      onClick={() => setShowAlert(role.id)}
                      className="items-center"
                    >
                      <FaTrashAlt
                        className="text-red-600 items-center"
                        style={{ fontSize: "1.4rem" }}
                      />
                    </button>
                    {showAlert === role.id && (
                      <AlertComp
                        show={true}
                        title={"Delete User"}
                        message={`Are you sure to delete user ${role.name}?`}
                        onConfirm={() => handleDelete(role.id)}
                        onCancel={() => setShowAlert(null)}
                      />
                    )}
                  </td>
                </tr>
                {selectedRole === role.id && (
                  <tr class="border-none">
                    <td colSpan={4} className=" flex-col">
                      <div className="relative overflow-x-auto shadow-md p-3 m-3 border sm:rounded-md">
                        <div className="max-h-64 overflow-y-auto">
                          <table className="min-w-full table-auto border-collapse p-2 w-full">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                              <tr>
                                <th class="px-2 py-3 ">Resource</th>
                                <th class="px-2 py-3 ">Create</th>
                                <th class="px-2 py-3 ">Read</th>
                                <th class="px-2 py-3 ">Update</th>
                                <th class="px-2 py-3 ">Delete</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.keys(permissions).map((resource) => (
                                <tr key={resource}>
                                  <td>{resource}</td>
                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={
                                        !!selectedPermissions[resource]?.create
                                      }
                                      onChange={(e) =>
                                        handlePermissionChange(
                                          resource,
                                          "create",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={
                                        !!selectedPermissions[resource]?.read
                                      }
                                      onChange={(e) =>
                                        handlePermissionChange(
                                          resource,
                                          "read",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={
                                        !!selectedPermissions[resource]?.update
                                      }
                                      onChange={(e) =>
                                        handlePermissionChange(
                                          resource,
                                          "update",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={
                                        !!selectedPermissions[resource]?.delete
                                      }
                                      onChange={(e) =>
                                        handlePermissionChange(
                                          resource,
                                          "delete",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <button
                            className="bold-16 text-white bg-pink_lavender-400 py-3 px-10 my-5 rounded-xl shadow-lg hover:bg-pink_lavender-300"
                            onClick={handleSave}
                          >
                            Save Permissions
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleList;
