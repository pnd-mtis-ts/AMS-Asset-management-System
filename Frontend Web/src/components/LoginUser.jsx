import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginAuth, reset } from "../features/authSlice.js";
import { toast } from "react-toastify";

function LoginUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, isSuccess, isLoading, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user || isSuccess) {
      toast.success("LoginSuccess!")
      navigate("/dashboard");
    }

    if (isError) {
      toast.error("Username or Password is not correct");
    }

    dispatch(reset());
  }, [user, isSuccess, isError, message, dispatch, navigate]);

  const Auth = (e) => {
    e.preventDefault();
    dispatch(LoginAuth({ email, password }));
  };

  return (
    <main className="flex flex-1 h-screen w-full mx-0 flex-row bg-gradient-to-b from-purple-500 to-yellow-300">
      <img 
        src={process.env.PUBLIC_URL + "/logo1.svg"} 
        alt="logo" 
        width={150} 
        className="absolute py-5" 
      />
      <div className="relative z-20 md:flex flex-col pl-0 w-[60%] hidden">
        <img 
          src={process.env.PUBLIC_URL + "/building.png"} 
          alt="building" 
          width={1000} 
          height={900} 
          className="absolute bottom-0 object-contain" 
        />
      </div>
      <div className="relative w-full md:w-[50%] xl:w-[40%] bg-none md:bg-white">
        <img
          src={process.env.PUBLIC_URL + "/decoration1.svg"}
          alt="decoration"
          width={200}
          height={200}
          className="absolute right-0"
        />
        <img
          src={process.env.PUBLIC_URL + "/decoration2.svg"}
          alt="decoration"
          width={150}
          height={150}
          className="absolute bottom-0 left-0"
        />
        <img
          src={process.env.PUBLIC_URL + "/decoration3.svg"}
          alt="decoration"
          width={250}
          height={250}
          className="absolute right-20"
        />
        <div className="w-[80%] h-[500px] absolute inset-0 mx-auto my-auto object-cover bg-white border-2 border-gray-200 rounded-md shadow-lg">
          <div className="flex w-full flex-wrap items-end md:flex-nowrap mb-6 p-8 md:mb-0 gap-4">
            <form onSubmit={Auth} className="w-full">
              <h1 className="inter-semiBold text-4xl  my-3">Log In</h1>
              <h3 className=" inter-semiBold text-m pb-5">Log in with registered account</h3>
              {isError && (
                <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {message}
                </div>
              )}
              <div className="field">
                <label className="inter-semiBold text-m pb-2">Email</label>
                <div className="control montserrat-medium">
                  <input
                    type="text"
                    className="montserrat-medium input p-3 shadow appearance-none border rounded w-full focus:outline-none focus:shadow-outline my-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="field">
                <label className="inter-semiBold text-m label">Password</label>
                <div className="control">
                  <input
                    type="password"
                    className="montserrat-medium input p-3 shadow appearance-none border rounded w-full focus:outline-none focus:shadow-outline my-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                  />
                </div>
              </div>
              <a href="#" className="inter-light italic">Forget password?</a>
              <div className="field mt-5">
                <button type="submit" className="inter-semiBold text-5xl bg-yellow-300 p-3 w-full rounded-xl shadow-lg hover:bg-yellow-400">
                  {isLoading ? "Loading..." : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginUser;
