import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SignUpPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <div className='flex justify-center my-20 items-center'>
                <SignUp
                    routing="path"
                    path="/auth/sign-up"
                    // After successful sign-up
                    afterSignUp={() => {
                        toast.success("Account created successfully!");
                        navigate('/');
                    }}
                    // On sign-up failure
                    signUpFallback={(err) => {
                        console.error("Sign-up failed:", err);
                        toast.error("Sign-up failed. Please try again.");
                    }}
                />
            </div>
        </div>
    );
};

export default SignUpPage;
