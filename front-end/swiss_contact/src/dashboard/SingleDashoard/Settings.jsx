import { useState, useEffect } from 'react';
import axios from 'axios';

function Settings() {
    const [profileData, setProfileData] = useState({
        Names: '',
        email: '',
        Username: '',
        role: '',
    });

    const [passwords, setPasswords] = useState({
        currentpassword: '',
        newpassword: ''
    });

    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const id = localStorage.getItem('userId');
                const response = await axios.get(`http://localhost:5000/api/auth/getUserById/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProfileData({
                    Names: response.data.data.Names,
                    email: response.data.data.email,
                    Username: response.data.data.Username,
                    role: response.data.data.role,
                });
            } catch (error) {
                console.error('Error fetching user data:', error.response ? error.response.data : error.message);
                setMessage({ text: 'Error fetching user data.', type: 'error' });
            }
        };

        fetchUserData();
    }, []);

    const handleProfileChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmitProfile = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const id = localStorage.getItem('userId');
            const response = await axios.patch(`http://localhost:5000/api/auth/updateUserById/${id}`, profileData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Profile change response:', response.data);
            setMessage({ text: 'Profile updated successfully.', type: 'success' });
        } catch (error) {
            console.error('Error updating profile:', error.response ? error.response.data : error.message);
            setMessage({ text: 'Error updating profile.', type: 'error' });
        }
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/auth/change', {
                currentpassword: passwords.currentpassword,
                newpassword: passwords.newpassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Password change response:', response);
            setMessage({ text: 'Password updated successfully.', type: 'success' });
            setPasswords({
                currentpassword: '',
                newpassword: ''
            });
        } catch (error) {
            console.error('Error changing password:', error.response ? error.response.data : error.message);
            setMessage({ text: 'Error changing password.', type: 'error' });
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-2xl font-bold mb-4">Manage Settings</h2>

            {/* Change Profile Form */}
            <form onSubmit={handleSubmitProfile} className="space-y-4">
                <h3 className="text-lg font-semibold">Change Profile</h3>
                <input
                    type="text"
                    name="Names"
                    placeholder="Names"
                    value={profileData.Names}
                    onChange={handleProfileChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    name="Username"
                    placeholder="Username"
                    value={profileData.Username}
                    onChange={handleProfileChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save Changes</button>
            </form>

            {/* Change Password Form */}
            <form onSubmit={handleSubmitPassword} className="space-y-4">
                <h3 className="text-lg font-semibold">Change Password</h3>
                <input
                    type="password"
                    name="currentpassword"
                    placeholder="Current Password"
                    value={passwords.currentpassword}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                    type="password"
                    name="newpassword"
                    placeholder="New Password"
                    value={passwords.newpassword}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save Changes</button>
            </form>

            {message.text && (
                <p className={`mt-4 p-2 rounded ${message.type === 'error' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
                    {message.text}
                </p>
            )}
        </div>
    );
}

export default Settings;
