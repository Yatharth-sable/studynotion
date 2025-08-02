import { createSlice } from "@reduxjs/toolkit";
import {toast} from "react-hot-toast"

const initialState = {
 totalItems :localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem("totalItems")): 0
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    setTotalItems(state, value) {
      state.token = value.payload;
    },
    // add to cart 
    // remove from cart
    // reset cart
 
    resetCart(state,value){ // temp
      state.token = value.payload;
    }
  },
});

export  const {setTotalItems,resetCart} = cartSlice.actions;
export default cartSlice.reducer