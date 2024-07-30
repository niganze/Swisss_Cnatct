import { useEffect, useState } from 'react';
import axios from 'axios';

function DashboardS() {
    const [projectsCount, setProjectsCount] = useState(0);
    const [currentDateTime, setCurrentDateTime] = useState(new Date().toLocaleString());
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem('token');
                const email = localStorage.getItem('email');
                
                if (!token) {
                    console.error('No token found');
                    return;
                }

                setUserEmail(email);

                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const projectsResponse = await axios.get('http://localhost:5000/api/Projects');
                setProjectsCount(projectsResponse.data.length);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();

        // Update current date and time every second
        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date().toLocaleString());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Welcome {userEmail}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-300 text-gray-600 p-3 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium">Number of Projects Submitted</h3>
                    <p className="text-4xl font-bold mt-2">{projectsCount}</p>
                </div>
                <div className="bg-green-300 text-gray-600 p-3 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium">Current Date and Time</h3>
                    <p className="text-2xl font-semibold mt-2">{currentDateTime}</p>
                </div>
            </div>
        </div>
    );
}

export default DashboardS;
