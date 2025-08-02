import React, { useEffect, useState } from "react";

import logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link, matchPath } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiShoppingCart } from "react-icons/fi";
import ProfileDropDown from "./../core/Auth/ProfileDropDown";
import { categories } from "../../services/apis";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { apiConnector } from "../../services/apiConnector";
import { GiHamburgerMenu } from "react-icons/gi";

const subLinks = [
  {
    title: "python",
    link: "course/python",
  },
  {
    title: "web-devlopment",
    link: "course/web-devlopment",
  },
];
const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.profile);

  // const [subLinks, setSubLink] = useState([]);

  // calling the api for geting the all categories
  // const fetchSublinks = async () => {
  //   try {
  //     const result = await apiConnector("GET", categories.CATEGORIES_API);
  //     console.log("Printing Sublinks Result", result);
  //     setSubLink(result.data.data);
  //   } catch (err) {
  //     console.log("Could not fetch the category list");
  //   }
  // };
  // useEffect(() => {
  //   fetchSublinks();
  // }, []);

  const location = useLocation();
  const matchRoute = (route) => {
    if (typeof route !== "string") return false;

    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div className="flex h-14 items-center justify-center border  border-b-richblack-700">
      <div className="flex max-w-maxContent justify-between w-11/12 items-center">
        {/* image */}
        <Link to="/">
          <img src={logo} width={160} height={42} loading="lazy" alt="logo" />
        </Link>

         {/* <button className="sm:hidden h-32 w-32 ">
            <GiHamburgerMenu className="text-white w-6 h-6  "></GiHamburgerMenu>
            </button> */}

        {/* Nav link */}
        <nav>
          <ul className="sm:flex sm:gap-x-6 sm:text-richblack-25 hidden " >
           
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div className="flex items-center gap-2 group relative ">
                    <p>{link.title}</p>
                    <IoIosArrowDropdownCircle></IoIosArrowDropdownCircle>

                    <div className="  invisible absolute left-[50%] top-[50%] flex flex-col rounded-md bg-richblack-5 p-3  opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[280px] -translate-x-[49%] translate-y-[20%] z-50 border border-b-richblack-400 border-l-richblack-400 border-r-richblack-400 shadow-lg group-hover/c:bg-richblack-200   " >
                      <div
                        className="absolute left-[50%] top-0 h-4 w-6 rotate-45 rounded bg-richblack-5  
                      translate-x-[80%]  translate-y-[-30%] " 
                      ></div>

                      {
                      subLinks.length ? (
                        subLinks.map((subLink, index) => (

                          <Link to={`${subLink.link}`} key={index}>
                            <p className="text-md capitalize text-richblack-900 font-medium hover:bg-richblack-200 hover:transition-all duration-100 hover:rounded-md m-1 py-3  px-3 z-10  ">{subLink.title}</p>
                          </Link>
                        )) ) : ( <div></div> )
                      }
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={` ${
                        matchRoute(link.path)
                          ? "text-yellow-5"
                          : "text-richblack-5  hover:text-richblack-50 font-md"
                      } `}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* login , singup ,dashboard */}
        {/* todo: style the cart  */}
        <div className="flex gap-x-4 items-center ">
          {user && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative">
              <FiShoppingCart />
              {totalItems > 0 && <span>{totalItems}</span>}
            </Link>
          )}

          {token === null && (
            <Link to="/login">
              <button className="bg-richblack-800 border border-richblack-700 px-[12px] py-[9px] text-richblack-100 rounded-md">
                Login
              </button>
            </Link>
          )}

          {token === null && (
            <Link to="/signup">
              <button className="bg-richblack-800 border border-richblack-700 px-3 w-fit py-[9px] text-richblack-100 rounded-md">
                Sign Up
              </button>
            </Link>
          )}
          {token != null && <ProfileDropDown></ProfileDropDown>}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
