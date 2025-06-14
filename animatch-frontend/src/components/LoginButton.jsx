import React from 'react'
import {useNavigate} from 'react-router-dom'
import Button from './StyledButton2';

import '../App.css'

function LoginButton() {
  const navigate = useNavigate();
  const navigateTo = (path) => {
    navigate(path);
  }
  return (
    <>
    <div className='flex flex-row items-center justify-center gap-25 mt-20'>
      <Button text={'Login'} path={'/login'} />
    </div>
    </>
  )
}

export default LoginButton