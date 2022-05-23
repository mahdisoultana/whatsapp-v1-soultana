import "./Login.css";
import { auth, provider } from "../firebase";
import src from "./login-logo.png";
// import { useHistory } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  function login() {
    auth.signInWithRedirect(provider);
  }
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="shadow-lg  lg:rounded-2xl  rounded-none py-8  bg-white dark:bg-gray-800 w-full max-w-[500px] m-auto">
        <div className="w-full h-full text-center">
          <div className="flex h-full flex-col justify-between">
            <h1 className="text-2xl font-semibold text-gray-600 dark:text-gray-100 text-md py-2 px-6">
              New Whatsapp Features
            </h1>
            <img
              src={src}
              alt="Logo"
              className="h-24 w-24 mt-4 m-auto text-green-500"
            />

            <div className="flex items-center justify-between gap-4 w-full mt-8">
              <button
                onClick={login}
                type="button"
                className="py-2 px-4 flex justify-center items-center  bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white  transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg  w-auto m-auto"
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="mr-2"
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M896 786h725q12 67 12 128 0 217-91 387.5t-259.5 266.5-386.5 96q-157 0-299-60.5t-245-163.5-163.5-245-60.5-299 60.5-299 163.5-245 245-163.5 299-60.5q300 0 515 201l-209 201q-123-119-306-119-129 0-238.5 65t-173.5 176.5-64 243.5 64 243.5 173.5 176.5 238.5 65q87 0 160-24t120-60 82-82 51.5-87 22.5-78h-436v-264z"></path>
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
