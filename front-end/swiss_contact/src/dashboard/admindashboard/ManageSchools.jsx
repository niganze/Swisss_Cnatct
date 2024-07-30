import { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function ManageSchools() {
  const [schools, setSchools] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newSchool, setNewSchool] = useState({
    school_name: "",
    district: "",
    sector: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    active: true,
  });
  const [editSchool, setEditSchool] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/schools", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (Array.isArray(response.data)) {
        setSchools(
          response.data.map((school, index) => ({ ...school, id: index + 1 }))
        );
      } else {
        console.error("Fetched data is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  const handleAddSchool = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/schools",
        newSchool,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSchools([...schools, { ...response.data, id: schools.length + 1 }]);
      setNewSchool({
        school_name: "",
        district: "",
        sector: "",
        phone: "",
        email: "",
        username: "",
        password: "",
        active: true,
      });
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error adding school:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request data:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };

  const handleEditSchool = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/schools/${editSchool._id}`,
        editSchool,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSchools(
        schools.map((school) =>
          school._id === editSchool._id ? response.data : school
        )
      );
      setEditSchool(null);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error editing school:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredSchools = schools.filter((school) => {
    // Convert searchTerm to lowercase for case insensitive search
    const term = searchTerm.toLowerCase();
    // Iterate through each school object
    for (let key in school) {
      // Check if the current key is a string and contains the searchTerm
      if (typeof school[key] === "string" && school[key].toLowerCase().includes(term)) {
        return true; // Return true if found
      }
    }
    return false; // Return false if not found in any key
  });

  const columns = [
    { field: "id", headerName: "ID", width: 10 },
    { field: "school_name", headerName: "School Name", width: 100 },
    { field: "district", headerName: "District", width: 100 },
    { field: "sector", headerName: "Sector", width: 150 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => {
        const handleEdit = () => {
          setEditSchool(params.row);
          setShowEditModal(true);
        };

        const handleDelete = async () => {
          try {
            const token = localStorage.getItem("token");
            await axios.delete(
              `http://localhost:5000/api/schools/${params.row._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setSchools((prevSchools) =>
              prevSchools.filter((school) => school._id !== params.row._id)
            );
          } catch (error) {
            console.error("Error deleting school:", error);
          }
        };

        const handleRevokeGrant = async () => {
          try {
            const token = localStorage.getItem("token");
            await axios.patch(
              `http://localhost:5000/api/schools/${params.row._id}/revoke-grant`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setSchools((prevSchools) =>
              prevSchools.map((school) =>
                school._id === params.row._id
                  ? { ...school, active: !school.active }
                  : school
              )
            );
          } catch (error) {
            console.error("Error revoking/granting school:", error);
          }
        };

        return (
          <>
            <Button
              onClick={handleEdit}
              variant="contained"
              color="primary"
              size="small"
            >
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="secondary"
              size="small"
              style={{ marginLeft: 8 }}
            >
              Delete
            </Button>
            <Button
              onClick={handleRevokeGrant}
              variant="contained"
              color={params.row.active ? "warning" : "success"}
              size="small"
              style={{ marginLeft: 8 }}
            >
              {/* {params.row.active ? "Revoke" : "Grant"} */}
              {params.row.active ? "Grant" : "Revoke"}
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowModal(true)}
        >
          Add School
        </Button>
        <input
          type="text"
          placeholder="Search for a school"
          value={searchTerm}
          onChange={handleSearch}
          className="ml-2 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <DataGrid
          rows={filteredSchools}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          checkboxSelection
          pageSizeOptions={[5, 10, 25]}
          getRowId={(row) => row._id}
          autoHeight
        />
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box
          className="bg-white p-4 rounded shadow-md w-1/2 mx-auto mt-10"
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <h3 className="text-lg mb-2">Add New School</h3>
          <TextField
            fullWidth
            margin="normal"
            label="School Name"
            value={newSchool.school_name}
            onChange={(e) =>
              setNewSchool({ ...newSchool, school_name: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="District"
            value={newSchool.district}
            onChange={(e) =>
              setNewSchool({ ...newSchool, district: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Sector"
            value={newSchool.sector}
            onChange={(e) =>
              setNewSchool({ ...newSchool, sector: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone"
            value={newSchool.phone}
            onChange={(e) =>
              setNewSchool({ ...newSchool, phone: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={newSchool.email}
            onChange={(e) =>
              setNewSchool({ ...newSchool, email: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            value={newSchool.username}
            onChange={(e) =>
              setNewSchool({ ...newSchool, username: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={newSchool.password}
            onChange={(e) =>
              setNewSchool({ ...newSchool, password: e.target.value })
            }
          />
          <div className="flex justify-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddSchool}
            >
              Add School
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setShowModal(false)}
              style={{ marginLeft: 8 }}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>

      <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
        <Box
          className="bg-white p-4 rounded shadow-md w-1/2 mx-auto mt-10"
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <h3 className="text-lg mb-2">Edit School</h3>
          <TextField
            fullWidth
            margin="normal"
            label="School Name"
            value={editSchool?.school_name}
            onChange={(e) =>
              setEditSchool({ ...editSchool, school_name: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="District"
            value={editSchool?.district}
            onChange={(e) =>
              setEditSchool({ ...editSchool, district: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Sector"
            value={editSchool?.sector}
            onChange={(e) =>
              setEditSchool({ ...editSchool, sector: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone"
            value={editSchool?.phone}
            onChange={(e) =>
              setEditSchool({ ...editSchool, phone: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={editSchool?.email}
            onChange={(e) =>
              setEditSchool({ ...editSchool, email: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            value={editSchool?.username}
            onChange={(e) =>
              setEditSchool({ ...editSchool, username: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={editSchool?.password}
            onChange={(e) =>
              setEditSchool({ ...editSchool, password: e.target.value })
            }
          />
          <div className="flex justify-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditSchool}
            >
              Save Changes
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setShowEditModal(false)}
              style={{ marginLeft: 8 }}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default ManageSchools;
