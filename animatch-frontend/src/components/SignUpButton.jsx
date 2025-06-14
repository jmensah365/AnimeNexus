import React from 'react'
import Button from './StyledButton2'

function SignUpButton() {
    return (
        <>
        <div className='flex flex-row items-center justify-center gap-25 mt-20'>
            <Button text={'Sign Up'} path={'/register'} />
        </div>
        </>
    )
}

export default SignUpButton