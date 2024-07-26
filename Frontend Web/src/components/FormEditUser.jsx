import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getToken } from "../features/authSlice";
import ButtonBackComp from "./ButtonBackComp";
import AxiosContext from "../features/AxiosProvider";

const FormEditUser = () => {
  const axiosInstance = useContext(AxiosContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setMsg] = useState("");
  const navigate = useNavigate();

  const { id } = useParams();

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (id) {
      const getUserById = async () => {
        try {
          const response = await axiosInstance.get(`${apiUrl}/users/${id}`, getToken());
          setName(response.data.name);
          setEmail(response.data.email);
        } catch (error) {
          if (error.response) {
            setMsg(error.response.data.msg);
          }
        }
      };
      getUserById();
    }
  }, [id]);

  const saveUser = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(
        `${apiUrl}/users/${id}`,
        {
          name: name,
          email: email,
          password: password,
        },
        getToken()
      );
      navigate("/users");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div className="bg-white border rounded-xl p-5">
      <ButtonBackComp onClick={() => navigate("/users", { replace: true })}/>
      <h1 className="mb-3 text-2xl montserrat-bold">Edit User</h1>
      <div>
        <form onSubmit={saveUser}>
          <div>
            <label className="label">Name</label>
            <div>
              <input
                type="text"
                className="input p-3 shadow appearance-none border rounded w-full focus:outline-none focus:shadow-outline my-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <div>
              <input
                type="text"
                className="input p-3 shadow appearance-none border rounded w-full focus:outline-none focus:shadow-outline my-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="label">Password</label>
            <div>
              <input
                type="text"
                className="input p-3 shadow appearance-none border rounded w-full focus:outline-none focus:shadow-outline my-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex xl:justify-end mt-5 md:justify-center">
            <button
              type="submit"
              className="text-2xl montserrat-bold p-3 rounded-xl shadow-lg  text-white bg-pink_lavender-400 hover:bg-pink_lavender-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormEditUser;
