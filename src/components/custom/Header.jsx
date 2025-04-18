import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { UserButton, useUser } from '@clerk/clerk-react'

function Header() {
    const {  isSignedIn } = useUser();
    return (
        <div className='p-3 px-5 flex justify-between shadow-md'>
             <Link to={'/'}>
            <h1 className='cursor-pointer text-2xl font-bold'>ResuChamp</h1>
            </Link>
            {isSignedIn ?
                <div className='flex gap-2 items-center'>
                    <Link to={'/dashboard'}>
                        <Button variant="outline">Dashboard</Button>
                    </Link>
                    <UserButton />
                </div> :
                <Link to={'/auth/sign-up'}>
                    <Button style={{ backgroundColor: '#9f5bff' }}>Get Started</Button>
                </Link>
            }

        </div>
    )
}

export default Header