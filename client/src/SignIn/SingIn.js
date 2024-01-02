import { Button, IconButton, InputLabel, TextField, } from '@mui/material';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import HttpRequest from '../Utilities/ApiCall/HttpRequest';
import login from "../asset/login2.jpg"
import "./signin.css"
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import WindowWidth from "../Utilities/index"
import { useDispatch } from 'react-redux';
function SignIn() {
    const [state, setState] = useState({
        email: "",
        password: "",
        emailErr: false,
        passwordErr: false,
        errMsg: "",
        showLoader: false,
        showPassword: false,
        
    })
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const { email, password, emailErr, passwordErr, errMsg, showPassword } = state;

    
    const handleInputChange = (e, name, err) => {
        setState({
            ...state,
            [name]: e.target.value,
            [err]: false
        })
    }
    const updateThemeColors = (isDarkMode) => {
        const body = document.body;
        const primaryColor = isDarkMode ? '#343a40' : '#007bff';
        const secondaryColor = isDarkMode ? '#ffc107' : '#6c757d';
    
        body.style.setProperty('--primary-color', primaryColor);
        body.style.setProperty('--secondary-color', secondaryColor);
      };
    const submitFun = () => {
        updateThemeColors()
        
        emailOPt()
        let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (!email) {
            setState((prev) => ({
                ...prev,
                emailErr: true
            }));
            document.getElementById("email").focus()
        } else if (!regex.test(email)) {
            setState((prev) => ({
                ...prev,
                emailErr: true
            }));
            document.getElementById("email").focus()
        } else if (!password) {
            setState((prev) => ({
                ...prev,
                passwordErr: true
            }));
            document.getElementById("password").focus()
        } else {
            if (!email === "sakthimsd531@gmail.com" && !password === "Sakthimsd531@") {
                setState((prev) => ({
                    ...prev,
                    passwordErr: true
                }));
            } else {
                logInApiCall()
            }
        }
    }

    const emailOPt = () => {
        setState({ ...state, showLoader: true })
        const method = "Post";
        const url = "shopy/send/email";
        const data = {
            "email": "sakthimsd531@gmail.com",
           
        }

        const response = HttpRequest({ method, url, data });
        response
            .then((res) => {
                console.log(res);
                // setState({
                //     ...state,
                //     showLoader: false
                // })
                // localStorage.setItem("Auth", res.token)

                // const token = !!localStorage.getItem("Auth")
                // if (token) {
                //     // dispatch(someAction(true));

                // }
                // navigate("/")

            }).catch((err) => {
                setState({
                    ...state,
                    showLoader: false
                })
            })
    }



    const logInApiCall = () => {
        setState({ ...state, showLoader: true })
        const method = "Post";
        const url = "shopy/user/login";
        const data = {
            "email": email,
            "password": password
        }

        const response = HttpRequest({ method, url, data });
        response
            .then((res) => {
                console.log(res);
                setState({
                    ...state,
                    showLoader: false
                })
                localStorage.setItem("Auth", res.token)

                const token = !!localStorage.getItem("Auth")
                if (token) {
                    
                    dispatch({type:"Auth"})
                }
                navigate("/")

            }).catch((err) => {
                setState({
                    ...state,
                    showLoader: false
                })
            })
    }

    const goSignUp = () => {
        navigate("/signUp")
    }

    const handleClickShowPassword = () => {
        setState((pre) => {
            return {
                ...pre,
                showPassword: !showPassword
            }
        })
    }

    const forgotPassFun=()=>{
        navigate("otp/valid")
    }
    console.log();
const size = WindowWidth()
    return (
        <div>
            <div className={size === "lg" ? 'overall-signin rounded': "overall-small"}>
                <div className={`p-0 w-100 d-flex ${size === "lg" ? "jr-card jr-card-style" : ""}`}>

                    {size === "lg" ?<div className='box-1 w-60'>
                        <img src={login} alt='login' className='w-100' />
                    </div> : null}
                    <div className={size ==="lg" ? 'box-2 w-40 bg-white': "w-100"}>
                        <div className='d-flex justify-content-center mx-3 ml-4'>
                            <div className='text-center mt-4 mx-3'>
                                <h2>LogIn</h2>
                                <p>LogIn into the account</p>
                                <div className='pt-4'>
                                    <TextField
                                        id='email'
                                        value={email}
                                        label="Email"
                                        variant="outlined"
                                        className='my-2 w-100'
                                        onChange={(e) => handleInputChange(e, "email", "emailErr")}
                                        error={emailErr}
                                        helperText={emailErr ? errMsg : null}
                                    />

                                    <FormControl className='my-2 w-100' variant="outlined" error={passwordErr}>
                                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                        <OutlinedInput
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Password"
                                            onChange={(e) => handleInputChange(e, "password", "passwordErr")}
                                            error={passwordErr}
                                            helperText={passwordErr ? errMsg : null}
                                        />
                                    </FormControl>
                                </div>
                                <div>
                                    <p className='text-start pt-4 text-info '><span className='pointer' onClick={()=> forgotPassFun()}>Forgot Password</span></p>
                                </div>
                                <div className='mt-4 py-3 mt-4'>
                                    <Button variant="contained"
                                        className='w-100 bg-primary mt-3 py-2'
                                        onClick={() => submitFun()}
                                    >Submit</Button>

                                </div>
                                <div className='pb-2 pt-1'>Don't have an account <span className='text-info pointer' onClick={() => goSignUp()}>SignUp</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn