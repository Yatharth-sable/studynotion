import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OTPInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../services/operation/authApi";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { signUp } from "./../services/operation/authApi";
import { FaRedoAlt } from "react-icons/fa";


const VerifyEmail = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const { loading, signupData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!signupData) {
      console.log("Signup data not found");
      navigate("/signup");
    }
  }, []);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      contactNumber,
    } = signupData;

    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,    
        contactNumber,
        navigate
      )
    );
  };

  return (
    <div className="text-white w-full justify-center flex items-center min-h-screen ">
      {loading ? (
        <div></div>
      ) : (
        <div className="w-fit justify-center flex flex-col border ">
          <h1 className="text-white py-2 text-xl">Verfiy Email</h1>
          <p className="text-richblack-100  ">A Verification code has been sent to you. Enter the code below</p>
 
          <form 
          onSubmit={handleOnSubmit} className="py-2 mt-2 items-center flex flex-col w-full " >
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span>-</span>}
              renderInput={(props) => <input  // ...props hataya yha se
                    inputMode="numeric"
                 className="h-16 m-2 w-12 px-4 rounded-md text-center bg-richblack-700 text-white border border-richblack-600 focus:outline-none focus:border-richblack-500 z-10 caret-white "
              />}
            ></OTPInput>

            <button type="submit" className="bg-yellow-50 py-2 sm:w-full w-fit px-3 rounded-lg text-black font-semibold my-3">
              Verify Email
            </button>
          </form>

          <div className="flex flex-row justify-between">
            <Link
              to="/login"
              className="flex flex-row items-center gap-2 text-richblack-50 hover:text-white"
            >
              <p>
                <FaArrowLeft></FaArrowLeft>
              </p>
              <p>Back to login</p>
            </Link>
             <button
              className="flex flex-row items-center gap-2 text-richblack-50 hover:text-white"
             onClick={() => dispatch(sendOtp(signupData.email, navigate))} >
            <FaRedoAlt  className="font-bold "></FaRedoAlt>
            Resend it
          </button>
          </div>

         
          {
            console.log(signupData.email)
          }
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
