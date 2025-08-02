import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./../Slice/authSlice"
import cartReducer from "./../Slice/cartSlice"
import profileReducer from "./../Slice/profileSlice"

const rootReducer = combineReducers({
  auth: authReducer,
  cart:cartReducer,
  profile:profileReducer,
});

export default rootReducer;
