import React, { Suspense } from 'react'
import SideBar from './SideBar/SideBar'
import "./App.css"
import "./custom.scss"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import WindowWidth from './Utilities';
import NavBar from "./NavBar/Index";
import SingIn from './SignIn/SingIn';
import SignUp from './SignUp/SignUp';
import RouteList from "./Routes/index"
import { useSelector } from "react-redux";
import OtpCom from './OtpCom/OtpCom';
import ResetPassword from './ResetPssword/ResetPassword';

function App() {
  let size = WindowWidth()
  const globalState = useSelector((state) => state);
  const isAuth = !!localStorage.getItem("_Auth")
  console.log(" isAuth",isAuth);
  return (
    <div>

      <BrowserRouter>
        {isAuth ?
          <div>
            {size === "sm" || size === "md" ? <NavBar /> : <SideBar />}
            <div style={{ marginLeft: `${size !== "lg" ? "20px" : "80px"}`, marginRight: 20 }}>
              <Routes>
                {
                  RouteList.map(({ path, component: Component }, index) => {
                    return (

                      <Route path={path} element={<Suspense fallback={<h1> </h1>}><Component /></Suspense>} />
                    )
                  })
                }
              </Routes>
            </div>
          </div>
          :
          <Routes>
            <Route path="/" element={<SingIn />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/otp/valid" element={<OtpCom />} />
            <Route path="/reset/password" element={<ResetPassword />} />
          </Routes>
        }
      </BrowserRouter>
    </div>

  )
}

export default App