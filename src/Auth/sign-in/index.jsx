import React from 'react'
import { SignIn } from '@clerk/clerk-react'
const SignInPage = () => {
    return (
        <div>
            <div className='flex justify-center my-20 items-center'>
                <SignIn />
            </div>
        </div>
    )
}

export default SignInPage;