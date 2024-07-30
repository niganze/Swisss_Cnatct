import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });
           
            console.log("--------------", response.data);
            // Assuming response.data includes user information and access_token
            const { access_token, user } = response.data;
            const {Username, } = response.data.user;
            
            console.log("User role:", user.role);
               console.log(user.email);
            // Store token in localStorage
            localStorage.setItem('Username', Username);
            localStorage.setItem('email', user.email);
            localStorage.setItem('token', access_token);
            localStorage.setItem('userId', user._id);
      
            // Navigate based on user role
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (user.role === 'school') {
                navigate('/school/dashboard'); // Replace with actual school dashboard route
            } else if (user.role === 'schooll') {
                navigate('/school/single'); // Navigate to the new path for the "schooll" role
            } else {
                // Handle other roles or unknown roles
                console.log("Unknown user role:", user.role);
                setErrorMessage('Unknown user role');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            if (error.response) {
                console.log("Error response:", error.response.data);
                setErrorMessage(error.response.data.msg || 'Error logging in');
            } else {
                console.log("Unknown error:", error);
                setErrorMessage('Error logging in');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login Portal</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    {errorMessage && (
                        <div className="text-red-500 text-center mb-4">
                            {errorMessage}
                        </div>
                    )}
                    <div>
                        <label className="block mb-1 text-gray-600">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-gray-600">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
