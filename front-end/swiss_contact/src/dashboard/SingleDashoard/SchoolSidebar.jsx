import { NavLink } from 'react-router-dom'

function SchoolSidebar() {
  return (
    <div className="sidebar bg-gray-800 text-white w-64 min-h-screen">
            <div className="p-4">
                <h1 className="text-2xl font-bold">Schools Panel</h1>
            </div>
            <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
            <NavLink to="school-dashboard" className="block py-2.5 px-4 rounded hover:bg-gray-700">Dashboard</NavLink>
            <NavLink to="school-manage-projects" className="block py-2.5 px-4 rounded hover:bg-gray-700">Manage Projects</NavLink>
            <NavLink to="single/settings" className="block py-2.5 px-4 rounded hover:bg-gray-700">Manage Settings</NavLink>
            <NavLink to="/" className="block py-2.5 px-4 rounded hover:bg-gray-700">Logout</NavLink>
        </div>
        </div>
  )
}

export default SchoolSidebar