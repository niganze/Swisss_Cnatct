import { Outlet } from "react-router-dom"



import Navbar from "./Navbar"
import SchoolSidebar from "./SchoolSidebar"


function LayoutS() {
  return (
    <div className="flex">
    <SchoolSidebar />
    <div className="flex-1">
        <Navbar />
        <div className="p-4">
            <Outlet />
        </div>
    </div>
</div>
  )
}

export default LayoutS