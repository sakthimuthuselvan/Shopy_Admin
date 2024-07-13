import React, { useEffect, useRef, useState } from 'react';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TextField } from '@mui/material';
import HttpRequest from '../../Utilities/ApiCall/HttpRequest';
import HttpImageApiCall from '../../Utilities/ApiCall/HttpImageApiCall';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MuiTable from '../Common/MuiTable';
import CancelIcon from '@mui/icons-material/Cancel';
import MySnackbar from '../../AlertShow/Alert';
import Loader from '../../Utilities/Loader/Loader';
import { base_url } from '../EnvImport/Index';


interface state {
  showLoader: boolean;
  openSnakbar: boolean;
  openSnakbarType: string;
  openSnakbarMsg: string;
  openDialog: boolean;
  isEdit: boolean;
  selectedItem: any;
  imageVal: any;
  imageValErr: boolean;
  isCheck: boolean;
  submitDisable: boolean;
  deleteDialog: boolean;
  headerData: any;
  columnData: any;


  navigatePath: string;
  navigatePathErr: boolean;
  imgInputErr: boolean;
  uploadImgPath: string;
  baseUrl: string;
  imageViewDialog: boolean;
}

const CardImage: React.FC = () => {
  const imageInput = useRef<HTMLInputElement>(null);
  const navigateInputFocus = useRef<HTMLInputElement>(null);
  const baseUrlPath: string = base_url;

  const [state, setState] = useState<state>({
    headerData: [

      {
        accessorKey: 'catgoryImage',
        header: 'Ad Image',
        size: 150,
        enableClickToCopy: false,
      },
      {
        accessorKey: 'navigatePath', //access nested data with dot notation
        header: 'Navigate Path',
        size: 150,
      },
      {
        accessorKey: 'action', //normal accessorKey
        header: 'Action',
        size: 200,
        enableSorting: false,
        enableColumnActions: false,
        enableClickToCopy: false,
      },
    ],
    columnData: [],
    showLoader: false,
    openSnakbar: false,
    openSnakbarType: "",
    openSnakbarMsg: "",
    openDialog: false,
    isEdit: false,
    selectedItem: {},
    imgInputErr: false,
    navigatePath: "",
    navigatePathErr: false,
    imageVal: {},
    isCheck: false,
    imageValErr: false,
    submitDisable: false,
    deleteDialog: false,
    uploadImgPath: "",
    baseUrl: baseUrlPath,
    imageViewDialog: false
  })

  const { showLoader, openSnakbarType, openSnakbar, openSnakbarMsg, openDialog, isEdit, selectedItem, imgInputErr, navigatePath, navigatePathErr, imageVal, isCheck, imageValErr, submitDisable, deleteDialog, columnData, headerData, uploadImgPath, baseUrl, imageViewDialog } = state;


  useEffect(() => {
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


  const listApiCall = async (): Promise<void> => {
    const method: string = "GET";
    const url: string = "addvertisment/get/image/ads";
    const data: any = {}
    setState((pre) => ({ ...pre, showLoader: true }))
    try {
      const response = await HttpRequest({ method, url, data });
      setState((pre) => ({ ...pre, showLoader: false }))
      frameTableFun(response.response_data)
    } catch (error) {
      setState((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }



  const frameTableFun = (data: any): void => {
    // parentCategory,catgoryImage,childCategoryName,description,action
    const frameColumnData = data.map((item: any): any => {

      let obj: any = {
        catgoryImage: <img src={baseUrl + item.image} alt='ad_image_card' width={80} height={80} />,
        navigatePath: item.path,
        action: <div>
          <IconButton onClick={() => editBtnClick(item)}><EditIcon className='text-primary' /></IconButton>
          <IconButton onClick={() => deleteBtnClick(item)}> <DeleteIcon className='text-danger' /></IconButton>
        </div>
      }

      return obj;
    })

    setState((pre) => ({
      ...pre,
      columnData: frameColumnData
    }))
  }
  const editBtnClick = (data: any): void => {
    setState((pre) => ({
      ...pre,
      selectedItem: data,
      isEdit: true,
      isCheck: false,
      navigatePath: data.path,
      openDialog: true,
    }))
  }
  const deleteBtnClick = (data: any): void => {
    setState((pre) => ({
      ...pre,
      deleteDialog: true,
      selectedItem: data
    }))
  }

  const addBtnClickFun = (): void => {
    setState((pre) => ({
      ...pre,
      openDialog: true,
      isEdit: false,
      navigatePath: "",
      imageValErr: false,
      imageVal: {},
      navigatePathErr: false,
      imgInputErr: false,
      submitDisable: false,
    }))
  }

  const handleFileChange = (event: any): void => {
    const selectedFile = event.target.files[0]
    // Handle the selected file as needed
   
      setState((pre) => ({
        ...pre,
        imageVal: selectedFile,
        imageValErr: false,
        isCheck: true,
        submitDisable: false
      }))
    }

  const handleChange = (e): void => {
    setState((pre) => ({
      ...pre,
      navigatePath: e.target.value,
      navigatePathErr: false
    }))
  }

  const confirmDeleteBtnClick = async (): Promise<void> => {
    const method = "DELETE";
    const url = `addvertisment/delete/image/ads/${selectedItem._id}`;
    const data = {}
    try {
      const response = await HttpRequest({ method, url, data });
      setState((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "success",
        openSnakbarMsg: response.response_message,
        deleteDialog: false
      }))
      listApiCall()
    } catch (error) {
      setState((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"
      }))
    }

  }


  const handleClose = (): void => {
    setState((pre) => ({
      ...pre,
      openDialog: false
    }))
  }

  const submitBtnClickFun = (): void => {
    if (!navigatePath) {
      setState((pre) => ({
        ...pre,
        navigatePathErr: true
      }))
      navigateInputFocus.current?.focus()
    } else if (!imageVal || Object.keys(imageVal).length > 0) {
      setState((pre) => ({
        ...pre,
        imgInputErr: true
      }))
      imageInput.current?.focus()

    } else {
      if (isEdit && isCheck) {
        //edit api call with imag
        imageUploadApiCall()
      } else if (isEdit === false && isCheck === true) {
        // addAPi call with imag
        imageUploadApiCall()
      } else {
        //edit api call without image api call
        editAPiCall()
      }
    }
  }

  const imageUploadApiCall = async (): Promise<void> => {
    const formData = new FormData();
    formData.append('image', imageVal);

    const method: string = "POST";
    const url: string = "single/image/upload";
    const data: any = formData
    try {
      const response = await HttpImageApiCall({ method, url, data });
      setState((pre) => ({
        ...pre,
        uploadImgPath: response.imageUrl,
        openSnakbar: true,
        openSnakbarType: "success",
        openDialog: false
      }))
    } catch (error) {
      setState((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }

  const editAPiCall = async (): Promise<void> => {
    const method = "PUT";
    const url: string = `addvertisment/update/image/ads/${selectedItem._id}`;
    const data: any = {
      "image": uploadImgPath ? uploadImgPath : selectedItem.image,
      "path": navigatePath
    }
    try {
      const response = await HttpRequest({ method, url, data });
      setState((pre) => ({
        ...pre,
        openDialog: false,
        openSnakbar: true,
        openSnakbarType: "success",
        openSnakbarMsg: response.response_message ? response.response_message : "Something went wrong"
      }))
      listApiCall()
    } catch (error) {
      setState((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }

  const AddAPiCall = async (): Promise<void> => {
    const method = "POST";
    const url: string = "addvertisment/create/image/ads";
    const data: any = {
      "image": uploadImgPath,
      "path": navigatePath
    }
    try {
      const response = await HttpRequest({ method, url, data });
      setState((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "success",
        openSnakbarMsg: response.response_message ? response.response_message : "Something went wrong"

      }))
      listApiCall()
    } catch (error) {
      setState((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }

  const viewImageDialog = (): void => {
    setState((pre) => ({
      ...pre,
      imageViewDialog: true
    }))
  }
  return (
    <div>
      <Loader open={showLoader} />

      <MySnackbar open={openSnakbar} type={openSnakbarType} variant={"filled"} message={openSnakbarMsg} duration={3000} handleClose={() => setState((pre) => ({ ...pre, openSnakbar: false }))} />
      <div className='jr-card d-flex justify-content-between align-items-center'>
        <h4 className='bold'>Card Advertisment</h4>
        {/* Button component with onClick event */}
        <Button
          variant="contained"
          size="small"
          className='bg-primary'
          onClick={addBtnClickFun} // Call the addBtnClickFun function when the button is clicked
        >
          Add
        </Button>
      </div>

      <div>
        <MuiTable
          headerData={headerData}
          columnData={columnData}
          options={""}
        />
      </div>


      <Dialog
        fullWidth
        maxWidth={"md"}
        open={openDialog}
      >
        <DialogTitle className='border fs-15 bold border-primary text-white bg-primary d-flex justify-content-between align-items-center mb-3' >
          {isEdit ? "Edit Ads Image Card " : "Add New Ads Image Card"}
          <IconButton onClick={handleClose}><CancelIcon className='text-white' /></IconButton>
        </DialogTitle>
        <DialogContent>

          <div className='mt-3'>
            <TextField
              ref={navigateInputFocus}
              id="category_name"
              label="Navigate Path"
              variant="outlined"
              value={navigatePath}
              autoComplete='off'
              onChange={(e) => handleChange(e)}
              error={navigatePathErr}
              helperText={navigatePathErr ? "This field is required" : null}
              fullWidth
            />
          </div>
          <div className='row'>
            <div className={isEdit ? "d-flex col-lg-10 col-md-10 col-sm-10" : ""}>
              <div className='mt-3 w-100'>
                <TextField
                  ref={imageInput}
                  id='ChildCategoryImg'
                  type="file"
                  label="Choose File"
                  variant="outlined"
                  onChange={handleFileChange}
                  // value={ChildCategoryImg}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  inputProps={{ accept: 'image/*' }}  // Accept only image files
                  error={imgInputErr}
                  helperText={imgInputErr ? "This field is required" : null}
                />
              </div>
            </div>

            {isEdit ? <div className='col-2 d-flex align-items-center justify-content-center'>
              <span onClick={() => viewImageDialog()}>view Image</span>
            </div> : null}
          </div>
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


      <Dialog
        fullWidth
        maxWidth={"md"}
        open={imageViewDialog}
      >
        <DialogTitle className='border fs-15 bold border-primary text-white bg-primary d-flex justify-content-between align-items-center mb-3' >
          {"View Image"}
          <IconButton onClick={() => setState((pre) => ({ ...pre, imageViewDialog: false }))}><CancelIcon className='text-white' /></IconButton>
        </DialogTitle>
        <DialogContent>
          <img src={baseUrl + selectedItem.image} alt='ad_image_card' width={"100%"} height={"100%"} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CardImage
