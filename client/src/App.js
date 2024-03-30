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
import "./sakthi.scss"
function App() {
  let size = WindowWidth()
  const globalState = useSelector((state) => state);
  const isAuth = !!localStorage.getItem("_Auth")
  return (
    <div>

      <BrowserRouter>
        {isAuth ?
           <div className="app-container">
           <div className="sidebar">
             {/* Sidebar Content */}
             <SideBar />
           </div>
           <div className="main-content">
            <Routes>
                {
                  RouteList.map(({ path, component: Component }, index) => {
                    return (

                      <Route exact path={path} element={<Suspense fallback={<h1> </h1>}><Component /></Suspense>} />
                    )
                  })
                }
              </Routes>
           </div>
         </div>

            //  <div style={{display:size === "lg" ? "flex": ""}}>
            // {size === "sm" || size === "md" ? <NavBar /> : <SideBar />}
            // <div style={{ marginLeft: `${size !== "lg" ? "20px" : "20px"}`, marginRight: 20,width:'100%' }}>
              // <Routes>
              //   {
              //     RouteList.map(({ path, component: Component }, index) => {
              //       return (

              //         <Route exact path={path} element={<Suspense fallback={<h1> </h1>}><Component /></Suspense>} />
              //       )
              //     })
              //   }
              // </Routes>
          //   </div>
          // </div>
          :
          <Routes>
            <Route exact path="/" element={<SingIn />} />
            <Route exact path="/signUp" element={<SignUp />} />
            <Route exact path="/otp/valid" element={<OtpCom />} />
            <Route exact path="/reset/password" element={<ResetPassword />} />
          </Routes>
        }
      </BrowserRouter>

    
    

    </div>

  )
}

export default App