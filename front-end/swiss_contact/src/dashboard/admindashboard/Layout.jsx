import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

import AdminSidebar from "./AdminSidebar"

function Layout() {
  return (
    <div className="flex">
            <AdminSidebar />
            <div className="flex-1">
                <Navbar />
                <div className="p-4">
                    <Outlet />
                </div>
            </div>
        </div>
  )
}

export default Layout