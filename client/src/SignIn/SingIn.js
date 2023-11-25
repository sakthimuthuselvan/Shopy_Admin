import { Button, TextField, } from '@mui/material';
import React, { Suspense, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import HttpRequest from '../Utilities/ApiCall/HttpRequest';
// import { useDispatch, useSelector } from 'react-redux';
// import { someAction } from '../action/index';

// const Loader = React.lazy(() => import("../app/Utilities/Loader/Loader"))
function SignIn(props) {
    const { checkHandleFun } = props;
    // const dispatch = useDispatch();
    // const globalState = useSelector((state)=> state);
     
    const [state, setState] = useState({
        email: "",
        password: "",
        emailErr: false,
        passwordErr: false,
        errMsg: "",
        showLoader: false,
    })
    const navigate = useNavigate()
    const { email, password, emailErr, passwordErr, errMsg, showLoader } = state;


    const handleInputChange = (e, name, err) => {
        setState({
            ...state,
            [name]: e.target.value,
            [err]: false
        })
    }

    const submitFun = () => {
        if (!email) {
            setState({
                ...state,
                emailErr: true
            })
            document.getElementById("email").focus()
        } else if (!password) {
            setState({
                ...state,
                passwordErr: true
            })
            document.getElementById("password").focus()
        } else {
            if (!email === "sakthimsd531@gmail.com" && !password === "Sakthimsd531@") {
                setState({
                    ...state,
                    passwordErr: true
                })
            } else {
                logInApiCall()
            }
        }
    }

    const logInApiCall = () => {
        setState({ ...state, showLoader: true })
        const method = "Post";
        const url = "productBazzar/login";
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
                localStorage.setItem("Auth",res.token)

                const token = !!localStorage.getItem("Auth")
                    if(token){
                        // dispatch(someAction(true));

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

  
    return (
        <div className='row m-0 p-0 vh-100 d-flex justify-content-center align-items-center'>
            {/* <Suspense fallback={<h1> </h1>}><Loader showLoader={showLoader} /></Suspense> */}
            <div className='col-lg-4 col-md-4 col-sm-12  '>
                <div className='jr-card d-flex justify-content-center mx-3'>
                    <div className='text-center'>
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
                            <TextField
                                id='password'
                                value={password}
                                label="Password"
                                variant="outlined"
                                className='my-2 w-100'
                                onChange={(e) => handleInputChange(e, "password", "passwordErr")}
                                error={passwordErr}
                                helperText={emailErr ? errMsg : null}
                            />
                        </div>
                        <div>
                            <p className='text-start pt-4 text-primary '><span className='pointer'>Forgot Password</span></p>
                        </div>
                        <div className='mt-4 py-3 mt-4'>
                            <Button variant="contained"
                                className='w-100 bg-secondary mt-3 py-2'
                                onClick={() => submitFun()}
                            >Submit</Button>

                        </div>
                        <div className='pb-2 pt-1'>Don't have an account <span className='text-primary pointer' onClick={() => goSignUp()}>SignUp</span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn