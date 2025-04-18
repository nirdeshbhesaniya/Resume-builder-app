import React, { useState } from 'react';
import { SignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
    const navigate = useNavigate();
    const [errorPopup, setErrorPopup] = useState(false);

    return (
        <div>
            <div className='flex justify-center my-20 items-center'>
                <SignIn
                    redirectUrl="/"
                    // Called after successful sign-in
                    afterSignIn={() => {
                        navigate('/');
                    }}
                    // Called on sign-in failure
                    signInFallback={(err) => {
                        console.error('Sign-in error:', err);
                        setErrorPopup(true); // Show popup
                        navigate('/'); // Redirect to home
                    }}
                />
            </div>

            {/* Simple popup for error */}
            {errorPopup && (
                <div className="fixed top-5 right-5 bg-red-500 text-white px-4 py-2 rounded shadow-md z-50">
                    Sign-in failed. Please try again.
                    <button onClick={() => setErrorPopup(false)} className="ml-2 text-white font-bold">
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
};

export default SignInPage;
