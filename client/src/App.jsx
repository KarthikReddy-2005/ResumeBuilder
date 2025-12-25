import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout";
import Preview from "./pages/Preview";
import ResumeBuilder from "./pages/ResumeBuilder";
import { useDispatch } from "react-redux";
import api from "./configs/api";
import { login, setLoading } from "./app/features/authSlice";
import { Toaster } from "react-hot-toast";

const App = () => {
  const dispatch = useDispatch();
  const getUserData = async () => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        const { data } = await api.get("/api/users/data", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.user) {
          dispatch(login({ token, user: data.user }));
        }
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
      }
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error.message);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="view/:resumeId" element={<Preview />} />

        <Route path="app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
