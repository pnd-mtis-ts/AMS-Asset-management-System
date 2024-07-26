import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { Axios } from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AxiosContext from "./AxiosProvider";

const apiUrl = process.env.REACT_APP_API_URL;
// const axiosInstance = useContext(AxiosContext);

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const LoginAuth = createAsyncThunk(
  "user/LoginUser",
  async (user, thunkAPI) => {
    try {
      const response = await axios.post(`${apiUrl}/login`, {
        email: user.email,
        password: user.password,
      });

      const { accessToken } = response.data;

      localStorage.setItem("accessToken", accessToken);

      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.response) {
        const message = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
      }
    }
  }
);

export const getMe = createAsyncThunk("user/getMe", async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/me`, getToken());
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      const message = error.response.data.msg;
      return thunkAPI.rejectWithValue(message);
    }
  }
});

export const LogOut = createAsyncThunk("user/LogOut", async () => {
  await axios.delete(`${apiUrl}/logout`);
  localStorage.removeItem("accessToken");
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.user = null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(LoginAuth.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(LoginAuth.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload;
    });
    builder.addCase(LoginAuth.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    //Get user login
    builder.addCase(getMe.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getMe.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload;
    });
    builder.addCase(getMe.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;

export const getToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response;

    if (status === 403) {
      console.error("Token expired or invalid");
      LogOut();
    }
  }
);
