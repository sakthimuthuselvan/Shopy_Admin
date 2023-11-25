import React, { Suspense, useState } from 'react'
import SideBar from './SideBar/SideBar'
import "./App.css"
import "./custom.scss"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import WindowWidth from './Utilities';
import NavBar from "./NavBar/Index";
import SingIn from './SignIn/SingIn';
import SignUp from './SignUp/SignUp';
function App() {
  let size = WindowWidth()

  return (
    <div>
      <div>
        {size === "sm" || size === "md" ? <NavBar /> :  <SideBar /> }  
        {/* <BrowserRouter>
          <Routes>
            <Route path="/" element={<SingIn />} />
            <Route path="/signUp" element={<SignUp />} />
          </Routes>
        </BrowserRouter> */}

      </div>
    </div>
  )
}

export default App