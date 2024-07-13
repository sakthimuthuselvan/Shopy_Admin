import React, { useEffect, useRef, useState } from 'react';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon, IconButton, TextField } from '@mui/material';
import HttpRequest from '../../Utilities/ApiCall/HttpRequest';
import HttpImageApiCall from '../../Utilities/ApiCall/HttpImageApiCall';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MuiTable from '../Common/MuiTable';
import CancelIcon from '@mui/icons-material/Cancel';
import MySnackbar from '../../AlertShow/Alert';
import Loader from '../../Utilities/Loader/Loader';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { base_url } from '../EnvImport/Index';

interface state {
  showLoader: boolean;
  openSnakbar: boolean;
  openSnakbarType: string;
  openSnakbarMsg: string;
  openDialog: boolean;
  isEdit: boolean;
  selectedItem: any;
  smallImageVal: any;
  smallImageValErr: boolean;
  largeImageVal: any;
  largeImageValErr: boolean;
  isCheck: boolean;
  submitDisable: boolean;
  deleteDialog: boolean;
  headerData: any;
  columnData: any;

  image1: boolean;
  image2: boolean;
  smallImgPath: string;
  largeImgPath: string;

  navigatePath: string;
  navigatePathErr: boolean;
  imgInputErr: boolean;
  uploadImgPath: any[];
  baseUrl: string;
  imageViewDialog: boolean;
  index: number;

}

const CardImage: React.FC = () => {
  const imageInputSmall = useRef<HTMLInputElement>(null);
  const imageInputLarge = useRef<HTMLInputElement>(null);

  const navigateInputFocus = useRef<HTMLInputElement>(null);
  const baseUrlPath: string = base_url ? base_url : '';

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
    smallImageVal: {},
    largeImageVal: {},
    isCheck: false,
    smallImageValErr: false,
    largeImageValErr: false,
    submitDisable: false,
    deleteDialog: false,
    uploadImgPath: [],
    baseUrl: baseUrlPath,
    imageViewDialog: false,
    index: 0,

    image1: false,
    image2: false,
    smallImgPath: "",
    largeImgPath: "",
  })

  const { showLoader, openSnakbarType, openSnakbar, openSnakbarMsg, openDialog, isEdit, selectedItem, imgInputErr, navigatePath, navigatePathErr, smallImageVal, isCheck, smallImageValErr, submitDisable, deleteDialog, columnData, headerData, uploadImgPath, baseUrl, imageViewDialog, largeImageVal, largeImageValErr, index, image1, image2, smallImgPath, largeImgPath } = state;


  useEffect(() => {
    console.log('Effect running');
    listApiCall();
  }, []);

  useEffect(() => {
    // Call the API only when uploadImgPath is not empty
    if (isEdit) {
      if (smallImgPath || largeImgPath) {
        editAPiCall()
        console.log("edit APi call");
      }
    } else {
      if (smallImgPath && largeImgPath) {
        AddAPiCall();
      }
    }
  }, [smallImgPath, largeImgPath]);


  const listApiCall = async (): Promise<void> => {
    const method: string = "GET";
    const url: string = "slider/get/slider/banner";
    const data: any = {}
    setState((pre) => ({ ...pre, showLoader: true }))
    try {
      const response = await HttpRequest({ method, url, data });
      console.log(response.response_data);
      setState((pre) => ({ ...pre, showLoader: false }))
      frameTableFun(response.response_data)
    } catch (error) {
      console.log(error.error_response);
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
        catgoryImage: <img src={baseUrl + item.sm_img} alt='ad_image_card' width={80} height={80} />,
        navigatePath: item.navigate_path ? item.navigate_path : "-",
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
    console.log(data);

    setState((pre) => ({
      ...pre,
      selectedItem: data,
      isEdit: true,
      isCheck: false,
      navigatePath: data.navigate_path,
      openDialog: true,
      image1: false,
      image2: false,
      smallImgPath: "",
      largeImgPath: ""
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
      smallImageValErr: false,
      smallImageVal: {},
      largeImageVal: {},
      largeImageValErr: false,
      navigatePathErr: false,
      imgInputErr: false,
      submitDisable: false,
      image1: false,
      image2: false,
      smallImgPath: "",
      largeImgPath: ""
    }))
  }

  const handleFileChange = (event: any, type: string): void => {
    const selectedFile = event.target.files[0]
    {
      if (type === "small") {
        setState((pre) => ({
          ...pre,
          smallImageVal: selectedFile,
          smallImageValErr: false,
          isCheck: true,
          submitDisable: false,
          image1: true
        }))
      } else {
        setState((pre) => ({
          ...pre,
          largeImageVal: selectedFile,
          largeImageValErr: false,
          isCheck: true,
          image2: true,
          submitDisable: false
        }))
      }

    }

  };
  const handleChange = (e: any): void => {
    setState((pre) => ({
      ...pre,
      navigatePath: e.target.value,
      navigatePathErr: false
    }))
  }

  const confirmDeleteBtnClick = async (): Promise<void> => {
    const method = "DELETE";
    const url = `slider/delete/slider/banner/${selectedItem._id}`;
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
    } else if (!smallImageVal || Object.keys(smallImageVal).length > 0) {
      setState((pre) => ({
        ...pre,
        smallImageVal: true
      }))
      imageInputSmall.current?.focus()

    } if (!largeImageVal || Object.keys(largeImageVal).length > 0) {
      setState((pre) => ({
        ...pre,
        largeImageVal: true
      }))
      imageInputLarge.current?.focus()

    } else {
      console.log("=============isEdit ", isEdit);
      console.log("============= isCheck", isCheck);
      if (isEdit && isCheck) {
        console.log("edit api call with imag");
        //img api call
        if (image1) {
          smallImgUpload()
        }
        if (image2) {
          largeImgUpload()
        }
        // imageUploadApiCall()

        // edit api call
      } else if (isEdit === false && isCheck === true) {
        console.log("addAPi call with imag");
        // image upload and add api call
        console.log("image1 ", image1);
        console.log("image2 ", image2);

        if (image1) {
          console.log("iamge 1");

          smallImgUpload()
        }
        if (image2) {
          console.log("iamge 2");

          largeImgUpload()
        }
        // imageUploadApiCall()
      } else {
        editAPiCall()
        console.log("edit api call without image api call");

      }
    }
  }

  // const imageUploadApiCall = async (): Promise<void> => {
  //   const formData = new FormData();
  //    formData.append('images', smallImageVal);
  //   formData.append('images', largeImageVal);

  //   const method: string = "POST";
  //   const url: string = "multiple/image/upload";
  //   const data: any = formData
  //   try {
  //     const response = await HttpImageApiCall({ method, url, data });
  //     console.log(response);
  //     setState((pre) => ({
  //       ...pre,
  //       uploadImgPath: response,
  //     }))
  //   } catch (error) {
  //     console.log(error.error_response);
  //     setState((pre) => ({
  //       ...pre,
  //       openSnakbar: true,
  //       openSnakbarType: "error",
  //       openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

  //     }))
  //   }
  // }

  // const imageUploadApiCall = async (): Promise<void> => {
  //   const formData = new FormData();

  //   if (smallImageVal) {
  //     formData.append('images', smallImageVal);
  //   } else {
  //     console.error("smallImageVal is not defined");
  //     return;
  //   }

  //   if (largeImageVal) {
  //     formData.append('images', largeImageVal);
  //   } else {
  //     console.error("largeImageVal is not defined");
  //     return;
  //   }

  //   const method: string = "POST";
  //   const url: string = "multiple/image/upload";
  //   const data: any = formData;

  //   try {
  //     const response = await HttpImageApiCall({ method, url, data });
  //     console.log(response);

  //     setState((prev) => ({
  //       ...prev,
  //       uploadImgPath: response,
  //       // Uncomment these if needed:
  //       // openSnackbar: true,
  //       // openSnackbarType: "success",
  //       // openDialog: false
  //     }));
  //   } catch (error) {
  //     console.log(error?.response?.data);

  //     setState((prev) => ({
  //       ...prev,
  //       openSnackbar: true,
  //       openSnackbarType: "error",
  //       openSnackbarMsg: error?.response?.data?.message ? error.response.data.message : "Something went wrong"
  //     }));
  //   }
  // };


  const smallImgUpload = async (): Promise<void> => {
    const formData = new FormData();
    formData.append('image', smallImageVal);


    const method: string = "POST";
    const url: string = "single/image/upload";
    const data: any = formData
    try {
      const response = await HttpImageApiCall({ method, url, data });
      console.log();
      setState((pre) => ({
        ...pre,
        smallImgPath: response.imageUrl,
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
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }



  const largeImgUpload = async (): Promise<void> => {
    const formData = new FormData();
    formData.append('image', largeImageVal);


    const method: string = "POST";
    const url: string = "single/image/upload";
    const data: any = formData
    try {
      const response = await HttpImageApiCall({ method, url, data });
      console.log();
      setState((pre) => ({
        ...pre,
        largeImgPath: response.imageUrl,
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
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }


  const editAPiCall = async (): Promise<void> => {
    console.log("selectedItem ", selectedItem);

    const method = "PUT";
    const url: string = `slider/update/slider/banner/${selectedItem._id}`;
    const data: any = {
      "sm_img": smallImgPath ? smallImgPath : selectedItem.sm_img,
      "lg_img": largeImgPath ? largeImgPath : selectedItem.lg_img,
      "navigate_path": navigatePath
    }

    try {
      const response = await HttpRequest({ method, url, data });
      console.log(response);
      setState((pre) => ({
        ...pre,
        openDialog: false,
        openSnakbar: true,
        openSnakbarType: "success",
        openSnakbarMsg: response.response_message ? response.response_message : "Something went wrong"
      }))
      listApiCall()
    } catch (error) {
      console.log(error);
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
    const url: string = "slider/create/banner";
    const data: any = {
      "sm_img": smallImgPath ? smallImgPath : "",
      "lg_img": largeImgPath ? largeImgPath : "",
      "navigate_path": navigatePath
    }

    try {
      const response = await HttpRequest({ method, url, data });
      console.log(response);
      setState((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "success",
        openSnakbarMsg: response.response_message ? response.response_message : "Something went wrong",
        openDialog: false
      }))
      listApiCall()
    } catch (error) {
      console.log(error);
      setState((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }
  console.log(isEdit);


  const viewImageDialog = (num: number): void => {
    setState((pre) => ({
      ...pre,
      imageViewDialog: true,
      index: num
    }))
  }
  return (
    <div>
      <Loader open={showLoader} />

      <MySnackbar open={openSnakbar} type={openSnakbarType} variant={"filled"} message={openSnakbarMsg} duration={3000} handleClose={() => setState((pre) => ({ ...pre, openSnakbar: false }))} />
      <div className='jr-card d-flex justify-content-between align-items-center'>
        <h4 className='bold'>Slider</h4>
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
                  ref={imageInputSmall}
                  id='ChildCategoryImg'
                  type="file"
                  label="Small Screen Image"
                  variant="outlined"
                  onChange={(e) => handleFileChange(e, "small")}
                  // value={ChildCategoryImg}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  inputProps={{ accept: 'image/*' }}  // Accept only image files
                  error={smallImageValErr}
                  helperText={smallImageValErr ? "This field is required" : null}
                />
              </div>
            </div>

            {isEdit ? <div className='col-2 d-flex align-items-center justify-content-center'>
              <IconButton onClick={() => viewImageDialog(0)}><RemoveRedEyeIcon className='text-primary' /></IconButton>
            </div> : null}
          </div>

          <div className='row'>
            <div className={isEdit ? "d-flex col-lg-10 col-md-10 col-sm-10" : ""}>
              <div className='mt-3 w-100'>
                <TextField
                  ref={imageInputLarge}
                  id='ChildCategoryImg'
                  type="file"
                  label="Large Screen Image"
                  variant="outlined"
                  onChange={(e) => handleFileChange(e, "large")}
                  // value={ChildCategoryImg}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  inputProps={{ accept: 'image/*' }}  // Accept only image files
                  error={largeImageValErr}
                  helperText={largeImageValErr ? "This field is required" : null}
                />
              </div>
            </div>

            {isEdit ? <div className='col-2 d-flex align-items-center justify-content-center'>
              <IconButton onClick={() => viewImageDialog(1)}><RemoveRedEyeIcon className='text-primary' /></IconButton>
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
          {Object.keys(selectedItem).length > 0 ?
            <img src={baseUrl + (index === 0 ? selectedItem.sm_img : selectedItem.lg_img)} alt='ad_image_card' width={"500px"} height={"500px"} />
            : null
          }

        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CardImage
