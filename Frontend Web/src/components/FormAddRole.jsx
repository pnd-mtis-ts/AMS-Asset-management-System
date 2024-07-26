import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../features/authSlice";
import ButtonBackComp from "./ButtonBackComp";
import AxiosContext from "../features/AxiosProvider";

const FormAddRole = () => {
  const axiosInstance = useContext(AxiosContext);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [, setMsg] = useState("");
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL;

  const saveRole = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(
        `${apiUrl}/role`,
        {
          name: name,
          slug: slug,
        },
        getToken()
      );
      navigate("/role");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div className="bg-white border rounded-xl p-5">
      <ButtonBackComp onClick={() => navigate("/role", { replace: true })}/>
      <h1 className="mb-3 text-2xl montserrat-bold">Add New Role</h1>
      <div>
        <form onSubmit={saveRole}>
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
            <label className="label">Slug</label>
            <div>
              <input
                type="text"
                className="input p-3 shadow appearance-none border rounded w-full focus:outline-none focus:shadow-outline my-2"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
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

export default FormAddRole;
