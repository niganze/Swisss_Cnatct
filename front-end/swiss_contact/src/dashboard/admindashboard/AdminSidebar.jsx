import { NavLink } from 'react-router-dom'

function AdminSidebar() {

    
    return (
        <div className="sidebar bg-gray-800 text-white w-64 min-h-screen">
            <div className="p-4">
                <h1 className="text-2xl font-bold">Admin Panel</h1>
            </div>
            <nav className="mt-10">
                <NavLink to="/admin/dashboard" className="block py-2.5 px-4 rounded hover:bg-gray-700">Dashboard</NavLink>
                <NavLink to="/admin/manage-schools" className="block py-2.5 px-4 rounded hover:bg-gray-700">Manage Schools</NavLink>
                <NavLink to="/admin/manage-projects" className="block py-2.5 px-4 rounded hover:bg-gray-700">Manage Projects</NavLink>
                <NavLink to="/admin/manage-settings" className="block py-2.5 px-4 rounded hover:bg-gray-700">Manage Settings</NavLink>
                <NavLink to="/" className="block py-2.5 px-4 rounded hover:bg-gray-700">Logout</NavLink>
            </nav>
        </div>
    );
}

export default AdminSidebar