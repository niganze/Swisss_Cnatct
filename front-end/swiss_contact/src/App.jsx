import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from 'axios'; // Import Axios for configuration
import Login from "./page/Login";
import Layout from "./dashboard/admindashboard/Layout";
import Dashboard from "./dashboard/admindashboard/Dashboard";
import ManageSchools from "./dashboard/admindashboard/ManageSchools";
import ManageProjects from "./dashboard/admindashboard/ManageProjects";
import ManageSettings from "./dashboard/admindashboard/ManageSettings";



import LayoutS from "./dashboard/shooldashboard/LayoutS";
import DashboardC from "./dashboard/shooldashboard/DashboardC";
import ManageChProjects from "./dashboard/shooldashboard/ManageChProjects";
import Settings from "./dashboard/shooldashboard/Settings";
import LayoutSingle from "./dashboard/SingleDashoard/LayoutSingle";
import DashboardS from "./dashboard/SingleDashoard/DashboardS";
import ManagechProjectsSingle from "./dashboard/SingleDashoard/ManageChProjectsSingle";

function App() {
  // Optional: Set up default headers for axios
  axios.defaults.baseURL = 'http://localhost:5000'; // Set your backend URL
  axios.defaults.headers.common['Content-Type'] = 'application/json';

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="admin" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="manage-schools" element={<ManageSchools />} />
          <Route path="manage-projects" element={<ManageProjects />} />
          <Route path="manage-settings" element={<ManageSettings />} />
        </Route>

          <Route path="school/dashboard" element={<LayoutS />}>
          <Route path="school-dashboard" element={<DashboardC />} />
          <Route path="manage-schools" element={<ManageSchools />} />
          <Route path="school-manage-projects" element={<ManageChProjects />} />
          <Route path="school/school-settings" element={<Settings />} />
        </Route>

        <Route path="school/single" element ={<LayoutSingle/>}>
        <Route path="school-dashboard" element={<DashboardS />} />
        <Route path="school-manage-projects" element={<ManagechProjectsSingle />} />
        <Route path="single/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
