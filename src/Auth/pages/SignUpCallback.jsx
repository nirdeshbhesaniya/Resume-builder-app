import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/auth/sign-in');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
        <h1 className="text-2xl font-semibold mb-2">Redirecting...</h1>
        <p className="text-gray-500">Finishing sign-up process, please wait.</p>
      </div>
    </div>
  );
};

export default SignUpCallback;
