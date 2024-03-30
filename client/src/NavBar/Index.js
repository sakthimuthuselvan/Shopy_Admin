import React, { useState } from 'react'
import "./nav.css"
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SideBarList from "../SideBar/SidebarList";
import { useNavigate} from "react-router-dom";

function Index() {
  const [state, setState] = useState({
    isClicked: false,
    SideBarList: SideBarList
  })

  const navigate = useNavigate()
  const {isClicked} =state;
  
  const menuBtnClick = () => {
    setState({
      ...state,
      isClicked: true
    })
  }

  const closeBtnClick=()=>{
    setState({
      ...state,
      isClicked: false
    })
  }

  const listBtnClick=(item)=>{
    navigate(item.path)
    setState((pre)=>({
      ...pre,
      isClicked: false
    }))
  }
  return (
    <div className={'nav'}>
      <div className='overall-nav primary-bg text-white'>
        <div className='icon'>
          <IconButton onClick={() => menuBtnClick()}>
            {isClicked ?  null : <MenuIcon className='iconItem text-white' />}

          </IconButton>
        </div>
        <div className='title'>
          <h3>heading</h3>
        </div>

      </div>
      {isClicked ? <div className='layer'></div> : null}
      <div className={isClicked ? "open-screen primary-bg " : 'screen primary-bg '}>
      <div className='sideBar-content primary-bg '>
       <IconButton onClick={()=> closeBtnClick()}><CloseIcon className='iconItem text-white' /></IconButton>

       <div className='mt-3'>
          {SideBarList.map((item)=>{
            return(
              <div className='item'>
                <h5 onClick={()=> listBtnClick(item)}><span className='icon-right'>{item.icon}</span>{item.name}</h5>
                </div>
            )
          })}
       </div>
      </div>
      </div>
    </div>
  )
}

export default Index