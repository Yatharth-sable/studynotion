import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import ForgotPassword from "./Pages/ForgotPassword"
import UpdatePassword from "./Pages/UpdatePassword"
import VerifyEmail from "./Pages/VerifyEmail";
import OpenRoute from "./components/core/loginSignup/OpenRoute";
import {  useState } from "react";
import Navbar from "./components/common/Navbar";

import AboutPage from "./Pages/AboutPage";



function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <div className="flex flex-col font-inter w-full min-h-[100vh] bg-richblack-900 overflow-x-hidden">

      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn}></Home>}></Route>
        <Route path="/login" element={ <OpenRoute><Login> </Login> </OpenRoute>}></Route>
        <Route path="/signup" element={<OpenRoute><SignUp> </SignUp> </OpenRoute>}></Route>
        <Route path="/forgot-password" element={<OpenRoute><ForgotPassword> </ForgotPassword> </OpenRoute>}></Route>
        <Route path="/update-password/:id" element={<OpenRoute><UpdatePassword> </UpdatePassword> </OpenRoute>}></Route>
        <Route path="/verify-email" element={<OpenRoute><VerifyEmail> </VerifyEmail> </OpenRoute>}></Route>
        <Route path="/about" element={<AboutPage> </AboutPage>}></Route>
      </Routes>
    </div>
  );
}

export default App;
