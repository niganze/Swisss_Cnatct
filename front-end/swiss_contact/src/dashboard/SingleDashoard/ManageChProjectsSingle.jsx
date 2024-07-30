import { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

const ManageProjectsSingle = () => {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('email');

            const response = await axios.get('/api/projects', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const filteredProjects = response.data.filter(project => project.school && project.school.email === email);
            setProjects(filteredProjects);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDownloadProposal = async (projectId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/projects/${projectId}/download`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `proposal_${projectId}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            console.log(`Proposal downloaded successfully for project ID: ${projectId}`);
        } catch (error) {
            console.error(`Error downloading proposal for project ID ${projectId}:`, error);
        }
    };

    const handleSetStatus = async (projectId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/projects/${projectId}/status`, { status: newStatus }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const updatedProjects = projects.map(project => 
                project._id === projectId ? { ...project, status: newStatus } : project
            );
            setProjects(updatedProjects);
        } catch (error) {
            console.error(`Error setting status for project ID ${projectId}:`, error);
        }
    };

    const handlePrintProjects = () => {
        const printContent = document.getElementById('projects-list').innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
    };

    const columns = [
        { field: 'project_name', headerName: 'Project Name', width: 200 },
        { field: 'project_owner', headerName: 'Project Owner', width: 200 },
        { field: 'school', headerName: 'School Name', width: 200 },
        { field: 'status', headerName: 'Status', width: 120 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 300,
            renderCell: (params) => (
                <div>
                    <button onClick={() => handleDownloadProposal(params.row.id)} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">Download Proposal</button>
                    <select onChange={(e) => handleSetStatus(params.row.id, e.target.value)} value={params.row.status} className="p-2 bg-yellow-500 text-white rounded-md ml-2">
                        <option value="Pending">Pending</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            )
        },
    ];

    if (projects.length === 0) {
        return <div className="p-6">Loading...</div>;
    }

    const filteredProjects = projects.filter(project =>
        project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.project_owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.school && project.school.school_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        project.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const rows = filteredProjects.map((project) => ({
        id: project._id,
        ...project,
        school: project.school ? project.school.school_name : ''
    }));

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Projects</h2>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search for a project"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="p-2 border border-gray-300 rounded-md w-full max-w-sm"
                />
            </div>

            <div id="projects-list" className="h-96 mb-6">
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 4,
                          },
                        },
                      }}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                />
            </div>
            <button onClick={handlePrintProjects} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 mt-2">Print Projects</button>
        </div>
    );
};

export default ManageProjectsSingle;
