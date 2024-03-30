import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CancelIcon from '@mui/icons-material/Cancel';
import HttpRequest from '../../Utilities/ApiCall/HttpRequest';
import HttpImageApiCall from '../../Utilities/ApiCall/HttpImageApiCall';
import MySnackbar from '../../AlertShow/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MuiTable from '../Common/MuiTable';

const Index = () => {
    const baseUrl = process.env.REACT_APP_BASE_URL;

    const [state, setState] = useState({

        headerData: [
            {
                accessorKey: 'catgoryImage',
                header: 'Category Image',
                size: 150,
                enableClickToCopy: false

            },
            {
                accessorKey: 'categoryName', //access nested data with dot notation
                header: 'Category Name',
                size: 150,
            },
            {
                accessorKey: 'action', //normal accessorKey
                header: 'Action',
                size: 200,
                enableSorting: false,
                enableColumnActions: false,
                enableClickToCopy: false
            },

        ],
        overallData: [],
        columnData: [],
        openDialog: false,
        categoryName: "",
        description: "",
        categoryImg: "",
        uploadImgPath: "",
        categoryImgErr: false,
        descriptionErr: false,
        categoryNameErr: false,
        openSnakbar: false,
        openSnakbarType: "",
        openSnakbarMsg: "",
        isEdit: false,
        isCheck: false,
        submitDisable: false,
        selectedItem: {},
        deleteDialog: false
    })
    const { openDialog, categoryName, deleteDialog, isCheck, submitDisable, isEdit, selectedItem, columnData, headerData, categoryImg, categoryImgErr, categoryNameErr, uploadImgPath, openSnakbar, openSnakbarType, openSnakbarMsg } = state;


    useEffect(() => {
        console.log('Effect running');
        listApiCall();
    }, []);

    useEffect(() => {
        if (uploadImgPath) {
            // Call the API only when uploadImgPath is not empty
            if (isEdit) {
                editAPiCall()
            } else {
                AddAPiCall();
            }
        }
    }, [uploadImgPath]);


   

    const listApiCall = async () => {
        const method = "GET";
        const url = "category/get/parentCategory";
        const data = {}

        try {
            const response = await HttpRequest({ method, url, data });
            console.log(response.response_data);
            setState((pre) => ({
                ...pre,
                overallData: response.response_data
            }))
            frameTableFun(response.response_data)
        } catch (error) {
            console.log(error.error_response);
            setState((pre) => ({
                ...pre,
                openSnakbar: true,
                openSnakbarType: "error",
                openSnakbarMsg: error.response_message

            }))
        }
    }

    const frameTableFun = (data) => {
        const framed = data.map((item) => {
            let obj = {
                catgoryImage: <div style={{ width: 80, height: 80, }}><img src={`http://127.0.0.1:4000/${item.category_img}`} className='w-100 h-100' /></div>,
                categoryName: item.name,
                action: <div>
                    <IconButton onClick={() => editBtnClick(item)}><EditIcon className='text-primary' /></IconButton>
                    <IconButton onClick={() => deleteBtnClick(item)}> <DeleteIcon className='text-danger' /></IconButton>
                </div>,
                disableFilters: true
            }
            return obj
        })

        setState((pre) => ({
            ...pre,
            columnData: framed
        }))
    }

    const handleClose = () => {
        setState((pre) => ({
            ...pre,
            openDialog: false
        }))
    }

    const addBtnClickFun = () => {
        setState((pre) => ({
            ...pre,
            openDialog: true,
            isEdit: false,
            categoryImg: "",
            categoryName: "",
            categoryNameErr: false,
            categoryImgErr: false,
            submitDisable: false
        }))
    }
    const handleChange = (e) => {
        setState((pre) => ({
            ...pre,
            categoryName: e.target.value,
            categoryNameErr: false,
            submitDisable: false
        }))
    }
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0]
        // Handle the selected file as needed
        if (selectedFile.size > 200 * 1024) {
            setState((pre) => ({
                ...pre,
                categoryImgErr: true
            }))
            document.getElementById("categoryImg").value = ""
            document.getElementById("categoryImg").focus()
        } else {
            setState((pre) => ({
                ...pre,
                categoryImg: selectedFile,
                categoryImgErr: false,
                isCheck: true,
                submitDisable: false
            }))
        }

    };

    const submitBtnClickFun = () => {
        if (!categoryName) {
            setState((pre) => ({
                ...pre,
                categoryNameErr: true
            }))
            document.getElementById("category_name").focus()
        } else if (!categoryImg) {
            setState((pre) => ({
                ...pre,
                categoryImgErr: true
            }))
            document.getElementById("categoryImg").focus()
        } else {

            if (isEdit && isCheck) {
                console.log("edit api call with imag");
                //img api call
                imageUploadApiCall()

                // edit api call
            } else if (isEdit === false && isCheck === true) {
                console.log("addAPi call with imag");
                // image upload and add api call
                imageUploadApiCall()
            } else {
                editAPiCall()
                console.log("edit api call without image api call");

            }


        }
    }

    const imageUploadApiCall = async () => {
        const formData = new FormData();
        formData.append('image', categoryImg);

        const method = "POST";
        const url = "single/image/upload";
        const data = formData
        try {
            const response = await HttpImageApiCall({ method, url, data });
            console.log();
            setState((pre) => ({
                ...pre,
                uploadImgPath: response.imageUrl,
                openSnakbar: true,
                openSnakbarType: "success",
                openDialog: false
            }))
        } catch (error) {
            console.log(error.error_response);
            setState((pre) => ({
                ...pre,
                openSnakbar: true,
                openSnakbarType: "error",
                openSnakbarMsg: error.response_message

            }))
        }
    }
    const AddAPiCall = async () => {
        const method = "POST";
        const url = "category/create/parentCategory";
        const data = {
            "name": categoryName.trim(),
            "cate_img": uploadImgPath
        }

        try {
            const response = await HttpRequest({ method, url, data });
            console.log(response);
            setState((pre) => ({
                ...pre,
                openSnakbar: true,
                openSnakbarType: "success",
                openSnakbarMsg: response.response_message

            }))
            listApiCall()
        } catch (error) {
            console.log(error);
            setState((pre) => ({
                ...pre,
                openSnakbar: true,
                openSnakbarType: "error",
                openSnakbarMsg: error.response_message

            }))
        }
    }


    const editBtnClick = (item) => {
        setState((pre) => ({
            ...pre,
            openDialog: true,
            categoryName: item.name,
            categoryImg: item.category_img,
            isEdit: true,
            submitDisable: true,
            selectedItem: item
        }))
    }

    const deleteBtnClick = (item) => {
        setState((pre) => ({
            ...pre,
            deleteDialog: true,
            selectedItem: item
        }))
    }


    const editAPiCall = async () => {
        const method = "PUT";
        const url = `category/update/parentCategory/${selectedItem._id}`;
        const data = {
            "name": categoryName.trim(),
            "category_img": uploadImgPath ? uploadImgPath : selectedItem.category_img
        }

        try {
            const response = await HttpRequest({ method, url, data });
            console.log(response);
            setState((pre) => ({
                ...pre,
                openSnakbar: true,
                openSnakbarType: "success",
                openSnakbarMsg: response.response_message,
                openDialog: false
            }))
            listApiCall()
        } catch (error) {
            console.log(error.response_message);
            setState((pre) => ({
                ...pre,
                openSnakbar: true,
                openSnakbarType: "error",
                openSnakbarMsg: error.response_message

            }))
        }
    }

    const deleteAPICall = async () => {
        const method = "DELETE";
        const url = `category/delete/parentCategory/${selectedItem._id}`;
        const data = {}
        try {
            const response = await HttpRequest({ method, url, data });
            console.log(response);
            setState((pre) => ({
                ...pre,
                openSnakbar: true,
                openSnakbarType: "success",
                openSnakbarMsg: response.response_message,
                deleteDialog: false
            }))
            listApiCall()
        } catch (error) {
            console.log(error.response_message);
            setState((pre) => ({
                ...pre,
                openSnakbar: true,
                openSnakbarType: "error",
                openSnakbarMsg: error.response_message

            }))
        }
    }

    const confirmDeleteBtnClick = () => {
        deleteAPICall()
    }

    return (
        <div className='pt-3'>
            <div className='jr-card mt-0 d-flex justify-content-between align-items-center'>
                <h3 className='font-weight-bold'>Category</h3>
                <Button variant="contained" size="small" className='bg-primary'
                    onClick={() => addBtnClickFun()}
                >Add </Button>
            </div>
            <MySnackbar open={openSnakbar} type={openSnakbarType} variant={"filled"} message={openSnakbarMsg} duration={3000} handleClose={() => setState((pre) => ({ ...pre, openSnakbar: false }))} />

            <div>
                <MuiTable
                    headerData={headerData}
                    columnData={columnData}
                />
            </div>

            <Dialog
                fullWidth
                maxWidth={"md"}
                open={openDialog}
            >
                <DialogTitle className='border fs-15 bold border-primary text-white bg-primary d-flex justify-content-between align-items-center mb-3' >
                    {isEdit ? selectedItem.name : "Add New Category"}
                    <IconButton onClick={handleClose}><CancelIcon className='text-white' /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <form>
                        <div className='mt-3'>
                            <TextField
                                id="category_name"
                                label="Category Name"
                                variant="outlined"
                                value={categoryName}
                                onChange={(e) => handleChange(e)}
                                error={categoryNameErr}
                                helperText={categoryNameErr ? "This field is required" : null}
                                fullWidth
                            />
                        </div>

                        <div className='mt-3'>
                            <TextField
                                id='categoryImg'
                                type="file"
                                label="Choose File"
                                variant="outlined"
                                onChange={handleFileChange}
                                // value={categoryImg}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                inputProps={{ accept: 'image/*' }}  // Accept only image files
                                error={categoryImgErr}
                                helperText={categoryImgErr ? "This field is required" : null}
                            />
                        </div>
                    </form>
                </DialogContent>
                <DialogActions >
                    <div className='pr-3'>
                        <Button variant="contained" size="medium" color='success'
                            onClick={() => submitBtnClickFun()}
                            className='mx-4 mb-3'
                            disabled={submitDisable}
                        >Submit </Button>
                    </div>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure to want to delete {selectedItem.name}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setState((pre) => ({ ...pre, deleteDialog: false }))}>Cancel</Button>
                    <Button className='text-danger' onClick={() => confirmDeleteBtnClick()} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Index
