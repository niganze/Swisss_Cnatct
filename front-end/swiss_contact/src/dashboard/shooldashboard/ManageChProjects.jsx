


// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { DataGrid } from '@mui/x-data-grid';
// import Modal from '@mui/material/Modal';

// const ManageProjects = () => {
//     const [projects, setProjects] = useState([]);
//     const [schools, setSchools] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [newProject, setNewProject] = useState({
//         project_name: '',
//         project_owner: '',
//         project_file: null,
//         fileName: '',
//         selectedSchool: null
//     });
//     const [selectedSchool, setSelectedSchool] = useState(null);
//     const [showModal, setShowModal] = useState(false);

   

//     const fetchProjects = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.get('/api/projects', {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             setProjects(response.data);
//         } catch (error) {
//             console.error('Error fetching projects:', error);
//         }
//     };

//     const fetchSchools = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.get('http://localhost:5000/api/schools', {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             setSchools(response.data);
//         } catch (error) {
//             console.error('Error fetching schools:', error);
//             if (error.response) {
//                 console.error('Error response data:', error.response.data);
//             }
//         }
//     };
//     useEffect(() => {
//         fetchProjects();
//         fetchSchools();
//     }, []);

//     const handleSearch = (event) => {
//         setSearchTerm(event.target.value);
//     };

//     const handleFileChange = (event) => {
//         const file = event.target.files[0];
//         setNewProject({
//             ...newProject,
//             project_file: file,
//             fileName: file.name
//         });
//     };

//     const handleAddProject = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const formData = new FormData();
//             formData.append('project_name', newProject.project_name);
//             formData.append('project_owner', newProject.project_owner);
//             formData.append('project_file', newProject.project_file);
//             formData.append('school', newProject.selectedSchool._id);

//             const response = await axios.post('http://localhost:5000/api/projects', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//            console.log(response);
//             setProjects([...projects, response.data]);
//             setNewProject({
//                 project_name: '',
//                 project_owner: '',
//                 project_file: null,
//                 fileName: '',
//                 school: null,
//             });
//             setShowModal(false); // Close modal after adding project
//         } catch (error) {
//             console.error('Error adding project:', error);
//         }
//     };

//     const handleDownloadProposal = async (projectId) => {
//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.get(`http://localhost:5000/api/projects/${projectId}/download`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 },
//                 responseType: 'blob'
//             });

//             const blob = new Blob([response.data], { type: response.headers['content-type'] });
//             const url = window.URL.createObjectURL(blob);
//             const a = document.createElement('a');
//             a.href = url;
//             a.download = `proposal_${projectId}.pdf`;
//             document.body.appendChild(a);
//             a.click();
//             document.body.removeChild(a);
//             window.URL.revokeObjectURL(url);

//             console.log(`Proposal downloaded successfully for project ID: ${projectId}`);
//         } catch (error) {
//             console.error(`Error downloading proposal for project ID ${projectId}:`, error);
//         }
//     };

//     const handleSetStatus = async (projectId, newStatus) => {
//         try {
//             const token = localStorage.getItem('token');
//             await axios.patch(`http://localhost:5000/api/projects/${projectId}/status`, { status: newStatus }, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });

//             const updatedProjects = projects.map(project => {
//                 if (project._id === projectId) {
//                     return { ...project, status: newStatus };
//                 }
//                 return project;
//             });
//             setProjects(updatedProjects);
//         } catch (error) {
//             console.error(`Error setting status for project ID ${projectId}:`, error);
//         }
//     };

//     const handlePrintSchoolProjects = () => {
//         const printContent = document.getElementById('school-projects-list').innerHTML;
//         const originalContent = document.body.innerHTML;

//         document.body.innerHTML = printContent;
//         window.print();
//         document.body.innerHTML = originalContent;
//     };

//     const handlePrintAllProjects = () => {
//         const printContent = document.getElementById('all-projects-list').innerHTML;
//         const originalContent = document.body.innerHTML;

//         document.body.innerHTML = printContent;
//         window.print();
//         document.body.innerHTML = originalContent;
//     };

//     // Filter projects based on selected school
//     const filteredProjects = projects.filter(project =>
//         project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const filteredProjectsWithId = filteredProjects.map((project) => ({
//         id: project._id,
//         ...project
//     }));

//     // Update schoolProjects based on selectedSchool
//     let schoolProjects = [];
//     if (selectedSchool) {
//         schoolProjects = projects.filter(project => project.school_id === selectedSchool._id);
//     }

//     const schoolProjectsWithId = schoolProjects.map((project) => ({
//         id: project._id,
//         ...project
//     }));

//     const columns = [
//         { field: 'project_name', headerName: 'Project Name', width: 200 },
//         { field: 'project_owner', headerName: 'Project Owner', width: 200 },
//         { field: 'school.school_name', headerName: 'School Name', width: 200 }, 
//         { field: 'status', headerName: 'Status', width: 120 },
//         {
//             field: 'actions',
//             headerName: 'Actions',
//             width: 300,
//             renderCell: (params) => (
//                 <div>
//                     <button onClick={() => handleDownloadProposal(params.row.id)} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">Download Proposal</button>
//                     <select onChange={(e) => handleSetStatus(params.row.id, e.target.value)} value={params.row.status} className="p-2 bg-yellow-500 text-white rounded-md ml-2">
//                         <option value="Pending">Pending</option>
//                         <option value="Selected">Selected</option>
//                         <option value="Rejected">Rejected</option>
//                     </select>
//                 </div>
//             )
//         },
//     ];
    

//     return (
//         <div className="p-6">
//             <h2 className="text-2xl font-bold mb-6">Manage Projects</h2>

//             <div className="mb-6">
//                 <input
//                     type="text"
//                     placeholder="Search for a project"
//                     value={searchTerm}
//                     onChange={handleSearch}
//                     className="p-2 border border-gray-300 rounded-md w-full max-w-sm"
//                 />
//             </div>

//             <div className="mb-6">
//                 <button onClick={() => setShowModal(true)} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">Add Project</button>
//             </div>

//             <Modal open={showModal} onClose={() => setShowModal(false)}>
//                 <div className="flex justify-center items-center h-full">
//                     <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
//                         <h3 className="text-lg font-semibold mb-2">Add New Project</h3>
//                         <input
//                             type="text"
//                             placeholder="Project Name"
//                             value={newProject.project_name}
//                             onChange={(e) => setNewProject({ ...newProject, project_name: e.target.value })}
//                             className="p-2 border border-gray-300 rounded-md mb-2 w-full"
//                         />
//                         <input
//                             type="text"
//                             placeholder="Project Owner"
//                             value={newProject.project_owner}
//                             onChange={(e) => setNewProject({ ...newProject, project_owner: e.target.value })}
//                             className="p-2 border border-gray-300 rounded-md mb-2 w-full"
//                         />
//                         <div className="flex items-center mb-2">
//                             <input
//                                 type="file"
//                                 onChange={handleFileChange}
//                                 className="p-2 border border-gray-300 rounded-md w-full"
//                             />
//                             {newProject.fileName && <p className="ml-2">{newProject.fileName}</p>}
//                         </div>
//                         <select
//                             value={newProject.selectedSchool ? newProject.selectedSchool._id : ''}
//                             onChange={(e) => {
//                                 const selectedSchoolObj = schools.find(school => school._id === e.target.value);
//                                 setNewProject({ ...newProject, selectedSchool: selectedSchoolObj });
//                             }}
//                             className="p-2 border border-gray-300 rounded-md mb-2 w-full"
//                         >
//                             <option value="">Select School</option>
//                             {schools.map(school => (
//                                 <option key={school._id} value={school._id}>{school.school_name}</option>
//                             ))}
//                         </select>
//                         <div className="flex justify-between">
//                             <button onClick={handleAddProject} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">Add Project</button>
//                             <button onClick={() => setShowModal(false)} className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300">Cancel</button>
//                         </div>
//                     </div>
//                 </div>
//             </Modal>

//             <div id="all-projects-list" className="h-96 mb-6">
//                 <DataGrid rows={filteredProjectsWithId} columns={columns} pageSize={5} />
//             </div>

//             <div className="mb-6">
//                 <select
//                     value={selectedSchool ? selectedSchool._id : ''}
//                     onChange={(e) => {
//                         const selectedSchoolObj = schools.find(school => school._id === e.target.value);
//                         setSelectedSchool(selectedSchoolObj);
//                     }}
//                     className="p-2 border border-gray-300 rounded-md w-full max-w-sm"
//                 >
//                     <option value="">Select School to filter projects</option>
//                     {schools.map(school => (
//                         <option key={school._id} value={school._id}>{school.school_name}</option>
//                     //
//                     ))}
//                 </select>
//             </div>

//             <div id="school-projects-list" className="h-96 mb-6">
//                 <DataGrid rows={schoolProjectsWithId} columns={columns} pageSize={5} />
//             </div>

//             <div className="flex justify-between">
//                 <button onClick={handlePrintAllProjects} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 ml-2">Print All Projects List</button>
//                 <button onClick={handlePrintSchoolProjects} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 ml-2">Print School Projects List</button>
//             </div>
//         </div>
//     );
// };

// export default ManageProjects;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import Modal from '@mui/material/Modal';

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [schools, setSchools] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newProject, setNewProject] = useState({
        project_name: '',
        project_owner: '',
        project_file: null,
        fileName: '',
        selectedSchool: null
    });
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/projects', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const fetchSchools = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/schools', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSchools(response.data);
        } catch (error) {
            console.error('Error fetching schools:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
            }
        }
    };

    useEffect(() => {
        fetchProjects();
        fetchSchools();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setNewProject({
            ...newProject,
            project_file: file,
            fileName: file.name
        });
    };

    const handleAddProject = async () => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('project_name', newProject.project_name);
            formData.append('project_owner', newProject.project_owner);
            formData.append('project_file', newProject.project_file);
            formData.append('school', newProject.selectedSchool._id);

            const response = await axios.post('http://localhost:5000/api/projects', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            setProjects([...projects, response.data]);
            setNewProject({
                project_name: '',
                project_owner: '',
                project_file: null,
                fileName: '',
                school: null,
            });
            setShowModal(false); // Close modal after adding project
        } catch (error) {
            console.error('Error adding project:', error);
        }
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

            const updatedProjects = projects.map(project => {
                if (project._id === projectId) {
                    return { ...project, status: newStatus };
                }
                return project;
            });
            setProjects(updatedProjects);
        } catch (error) {
            console.error(`Error setting status for project ID ${projectId}:`, error);
        }
    };

    const handlePrintSchoolProjects = () => {
        const printContent = document.getElementById('school-projects-list').innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
    };

    const handlePrintAllProjects = () => {
        const printContent = document.getElementById('all-projects-list').innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
    };

    // Filter projects based on selected school
    const filteredProjects = projects.filter(project =>
        project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.project_owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.school && project.school.school_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        project.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredProjectsWithId = filteredProjects.map((project) => ({
        id: project._id,
        ...project,
        school: project.school ? project.school.school_name : '' // Extract school_name for display
    }));

    // Update schoolProjects based on selectedSchool
    let schoolProjects = [];
    if (selectedSchool) {
        schoolProjects = projects.filter(project => project.school && project.school._id === selectedSchool._id);
    }

    const schoolProjectsWithId = schoolProjects.map((project) => ({
        id: project._id,
        ...project,
        school: project.school ? project.school.school_name : '' // Extract school_name for display
    }));

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

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Projects</h2>

            <div className="mb-6 flex flex-row">
                <input
                    type="text"
                    placeholder="Search for a project"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="p-2 border border-gray-300 rounded-md w-full max-w-sm"
                />
                <button onClick={() => setShowModal(true)} className="ml-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">Add Project</button>
                <button onClick={handlePrintAllProjects} className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300">Print Projects</button>
            </div>

            <Modal open={showModal} onClose={() => setShowModal(false)}>
                <div className="flex justify-center items-center h-full">
                    <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
                        <h3 className="text-lg font-semibold mb-2">Add New Project</h3>
                        <input
                            type="text"
                            placeholder="Project Name"
                            value={newProject.project_name}
                            onChange={(e) => setNewProject({ ...newProject, project_name: e.target.value })}
                            className="p-2 border border-gray-300 rounded-md mb-2 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Project Owner"
                            value={newProject.project_owner}
                            onChange={(e) => setNewProject({ ...newProject, project_owner: e.target.value })}
                            className="p-2 border border-gray-300 rounded-md mb-2 w-full"
                        />
                        <div className="flex items-center mb-2">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="border border-gray-300 rounded-md"
                            />
                            {newProject.fileName && <span className="ml-2">{newProject.fileName}</span>}
                        </div>
                        <select
                            value={newProject.selectedSchool ? newProject.selectedSchool._id : ''}
                            onChange={(e) => {
                                const selected = schools.find(school => school._id === e.target.value);
                                setNewProject({ ...newProject, selectedSchool: selected });
                            }}
                            className="p-2 border border-gray-300 rounded-md mb-2 w-full"
                        >
                            <option value="">Select School</option>
                            {schools.map(school => (
                                <option key={school._id} value={school._id}>{school.school_name}</option>
                            ))}
                        </select>
                        <button onClick={handleAddProject} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 w-full">Add Project</button>
                    </div>
                </div>
            </Modal>

            <div id="all-projects-list" style={{ height: '500px', width: '100%' }}>
                <DataGrid
                    rows={filteredProjectsWithId}
                    columns={columns}
                    initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 6,
                          },
                        },
                      }}
                    rowsPerPageOptions={[5, 10, 20]}
                    disableSelectionOnClick
                />
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">School Projects</h3>
                <select
                    value={selectedSchool ? selectedSchool._id : ''}
                    onChange={(e) => {
                        const selected = schools.find(school => school._id === e.target.value);
                        setSelectedSchool(selected);
                    }}
                    className="p-2 border border-gray-300 rounded-md mb-2"
                >
                    <option value="">Select School</option>
                    {schools.map(school => (
                        <option key={school._id} value={school._id}>{school.school_name}</option>
                    ))}
                </select>

                {selectedSchool && (
                    <>
                        <button onClick={handlePrintSchoolProjects} className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300">Print Projects</button>
                        <div id="school-projects-list" style={{ height: '400px', width: '100%' }}>
                            <DataGrid
                                rows={schoolProjectsWithId}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5, 10, 20]}
                                disableSelectionOnClick
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ManageProjects;
