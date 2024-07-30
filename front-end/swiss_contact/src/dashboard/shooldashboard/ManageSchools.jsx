

import { useState, useEffect } from 'react';
import axios from 'axios';

function ManageSchools() {
    const [schools, setSchools] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newSchool, setNewSchool] = useState({
        school_name: '',
        district: '',
        sector: '',
        phone: '',
        email: '',
        username: '',
        password: '',
        active: true
    });
    const [editSchool, setEditSchool] = useState(null);

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        try {
            const token = localStorage.getItem('accessToken'); // Get the access token from local storage or context
            const response = await axios.get('/api/schools', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (Array.isArray(response.data)) {
                setSchools(response.data);
            } else {
                console.error('Fetched data is not an array:', response.data);
            }
        } catch (error) {
            console.error('Error fetching schools:', error);
        }
    };

    const handleAddSchool = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/schools', newSchool, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSchools([...schools, response.data]);
            setNewSchool({
                school_name: '',
                district: '',
                sector: '',
                phone: '',
                email: '',
                username: '',
                password: '',
                active: true
            });
        } catch (error) {
            console.error('Error adding school:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            } else if (error.request) {
                console.error('Request data:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
        }
    };

    const handleEditSchool = async () => {
        try {
            const token = localStorage.getItem('token'); 
            const response = await axios.put(`/api/schools/${editSchool._id}`, editSchool, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSchools(schools.map(school => school._id === editSchool._id ? response.data : school));
            setEditSchool(null);
        } catch (error) {
            console.error('Error editing school:', error);
        }
    };

    const handleDeleteSchool = async (id) => {
        try {
            const token = localStorage.getItem('token'); 
            await axios.delete(`/api/schools/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSchools(schools.filter(school => school._id !== id));
        } catch (error) {
            console.error('Error deleting school:', error);
        }
    };

    const handleRevokeGrant = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/schools/${id}/revoke-grant`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSchools(schools.map(school => school._id === id ? { ...school, active: !school.active } : school));
        } catch (error) {
            console.error('Error revoking/granting school:', error);
        }
    };
    

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredSchools = schools.filter(school =>
        school.school_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="p-4">
            
            <h2 className="text-xl mb-4">Manage Schools</h2>
            <input 
                type="text" 
                placeholder="Search for a school" 
                value={searchTerm} 
                onChange={handleSearch} 
                className="mb-4 p-2 border border-gray-300"
            />
            
            <div>
                <h3 className="text-lg mb-2">Add New School</h3>
                <input 
                    type="text" 
                    placeholder="School Name" 
                    value={newSchool.school_name} 
                    onChange={(e) => setNewSchool({ ...newSchool, school_name: e.target.value })} 
                    className="mb-2 p-2 border border-gray-300"
                />
                <input 
                    type="text" 
                    placeholder="District" 
                    value={newSchool.district} 
                    onChange={(e) => setNewSchool({ ...newSchool, district: e.target.value })} 
                    className="mb-2 p-2 border border-gray-300"
                />
                <input 
                    type="text" 
                    placeholder="Sector" 
                    value={newSchool.sector} 
                    onChange={(e) => setNewSchool({ ...newSchool, sector: e.target.value })} 
                    className="mb-2 p-2 border border-gray-300"
                />
                <input 
                    type="text" 
                    placeholder="Phone" 
                    value={newSchool.phone} 
                    onChange={(e) => setNewSchool({ ...newSchool, phone: e.target.value })} 
                    className="mb-2 p-2 border border-gray-300"
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={newSchool.email} 
                    onChange={(e) => setNewSchool({ ...newSchool, email: e.target.value })} 
                    className="mb-2 p-2 border border-gray-300"
                />
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={newSchool.username} 
                    onChange={(e) => setNewSchool({ ...newSchool, username: e.target.value })} 
                    className="mb-2 p-2 border border-gray-300"
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={newSchool.password} 
                    onChange={(e) => setNewSchool({ ...newSchool, password: e.target.value })} 
                    className="mb-2 p-2 border border-gray-300"
                />
                <button onClick={handleAddSchool} className="p-2 bg-blue-500 text-white">Add School</button>
            </div>
            
            {editSchool && (
                <div>
                    <h3 className="text-lg mb-2">Edit School</h3>
                    <input 
                        type="text" 
                        placeholder="School Name" 
                        value={editSchool.school_name} 
                        onChange={(e) => setEditSchool({ ...editSchool, school_name: e.target.value })} 
                        className="mb-2 p-2 border border-gray-300"
                    />
                    <input 
                        type="text" 
                        placeholder="District" 
                        value={editSchool.district} 
                        onChange={(e) => setEditSchool({ ...editSchool, district: e.target.value })} 
                        className="mb-2 p-2 border border-gray-300"
                    />
                    <input 
                        type="text" 
                        placeholder="Sector" 
                        value={editSchool.sector} 
                        onChange={(e) => setEditSchool({ ...editSchool, sector: e.target.value })} 
                        className="mb-2 p-2 border border-gray-300"
                    />
                    <input 
                        type="text" 
                        placeholder="Phone" 
                        value={editSchool.phone} 
                        onChange={(e) => setEditSchool({ ...editSchool, phone: e.target.value })} 
                        className="mb-2 p-2 border border-gray-300"
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={editSchool.email} 
                        onChange={(e) => setEditSchool({ ...editSchool, email: e.target.value })} 
                        className="mb-2 p-2 border border-gray-300"
                    />
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={editSchool.username} 
                        onChange={(e) => setEditSchool({ ...editSchool, username: e.target.value })} 
                        className="mb-2 p-2 border border-gray-300"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={editSchool.password} 
                        onChange={(e) => setEditSchool({ ...editSchool, password: e.target.value })} 
                        className="mb-2 p-2 border border-gray-300"
                    />
                    <button onClick={handleEditSchool} className="p-2 bg-blue-500 text-white">Save Changes</button>
                </div>
            )}
            

            <table className="table-auto w-full mt-4">
                <thead>
                    <tr>
                        <th>School Name</th>
                        <th>District</th>
                        <th>Sector</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSchools.map(school => (
                        <tr key={school._id}>
                            <td>{school.school_name}</td>
                            <td>{school.district}</td>
                            <td>{school.sector}</td>
                            <td>{school.phone}</td>
                            <td>{school.email}</td>
                            <td>{school.username}</td>
                            <td>{school.active ? 'Active' : 'Inactive'}</td>
                            <td>
                                <button onClick={() => setEditSchool(school)} className="p-2 bg-yellow-500 text-white">Edit</button>
                                <button onClick={() => handleDeleteSchool(school._id)} className="p-2 bg-red-500 text-white">Delete</button>
                                <button onClick={() => handleRevokeGrant(school._id)} className="p-2 bg-green-500 text-white">Toggle Status</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <button onClick={handlePrint} className="p-2 bg-gray-500 text-white mt-4">Print List</button>
        </div>
    );
}

export default ManageSchools;
