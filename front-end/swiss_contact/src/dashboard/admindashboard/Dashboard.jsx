import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
    const [schoolCount, setSchoolCount] = useState(0);
    const [projectCount, setProjectCount] = useState(0);
    const currentDate = new Date().toLocaleDateString();

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    return;
                }

                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                const schoolsResponse = await axios.get('/api/schools');
                setSchoolCount(schoolsResponse.data.length);

                const projectsResponse = await axios.get('http://localhost:5000/api/Projects');
                setProjectCount(projectsResponse.data.length);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen rounded-md">
            <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-semibold mb-2">Registered Schools</h3>
                    <p className="text-4xl font-bold text-blue-300">{schoolCount}</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-semibold mb-2">Submitted Projects</h3>
                    <p className="text-4xl font-bold text-green-600">{projectCount}</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-semibold mb-2">Current Date</h3>
                    <p className="text-4xl font-bold text-red-600">{currentDate}</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
