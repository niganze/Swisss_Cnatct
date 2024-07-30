import { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";


const columns = [
  { field: "id", headerName: "ID", width: 30 },
  { field: "project_name", headerName: "Project Name", width: 200 },
  { field: "project_owner", headerName: "Project Owner", width: 200 },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    renderCell: (params) => {
      const handleChange = async (e) => {
        const newStatus = e.target.value;
        try {
          const token = localStorage.getItem("token");
          await axios.patch(`http://localhost:5000/api/projects/${params.row._id}/status`, 
            { status: newStatus },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          params.row.status = newStatus;
        } catch (error) {
          console.error(`Error setting status for project ID ${params.row._id}:`, error);
        }
      };

      return (
        <select value={params.row.status} onChange={handleChange} className="p-2 bg-yellow-500 text-white rounded">
          <option value="Pending">Pending</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>
      );
    },
  },
  {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      const handleDownloadProposal = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`http://localhost:5000/api/projects/${params.row._id}/download`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            responseType: 'blob' // Ensure the response type is blob for binary data
          });

          // Create a blob object from the response data
          const blob = new Blob([response.data], { type: response.headers['content-type'] });

          // Create a URL for the blob object
          const url = window.URL.createObjectURL(blob);

          // Create a temporary anchor element
          const a = document.createElement('a');
          a.href = url;
          a.download = `proposal_${params.row._id}.pdf`; // Set the download attribute with the desired file name
          document.body.appendChild(a); // Append anchor to body
          a.click(); // Click the anchor to trigger download
          document.body.removeChild(a); // Remove anchor from body

          // Revoke the URL to release the object from memory
          window.URL.revokeObjectURL(url);

          console.log(`Proposal downloaded successfully for project ID: ${params.row._id}`);
        } catch (error) {
          console.error(`Error downloading proposal for project ID ${params.row._id}:`, error);
        }
      };

      return (
        <button className="py-1 px-1 bg-blue-400 text-white rounded" onClick={handleDownloadProposal}>
        Download Proposal
      </button>
      
      );
    },
  },
];

function ManageProjects() {
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:5000/api/projects', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setRows(response.data.map((project, index) => ({ ...project, id: index + 1 })));
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredRows = rows.filter((row) => {
    return (
      row.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.project_owner.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search projects"
          className="ml-2 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <DataGrid
          rows={filteredRows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 6,
              },
            },
          }}
          checkboxSelection
          pageSizeOptions={[5, 10, 25]}
          getRowId={(row) => row._id}
          autoHeight // This will make the table adjust its height based on the number of rows
        />
      </div>
    </div>
  );
}

export default ManageProjects;
