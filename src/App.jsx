import { useState } from 'react'
import { Routes, Route ,useLocation} from 'react-router-dom'
import Login from './Login'
import Signup from './Signup'
import NotFound from './NotFound'
import ForgetPassword from './Forget'
import ProtectedRoute from './ProtectedRouter'
import Deshboard from './Admin/Dashboard'
import Header from './Admin/Header'
import Adminsidebar from './Admin/Adminsidebar'
import Jobs from './Admin/Jobs'
import Companie from './Admin/Companie'
import Application from './Admin/Application'
import Profile from './Admin/Profile'
import User from './Admin/User'
import Condidate from './Admin/Condidate'
import Reset from './Admin/Reset'
import FullProfile from './Candidate/FullProfile'
import SidebarProfile from './Candidate/SidebarProfile'
import CandidateJobs from './Candidate/CandidateJobs'
import EmployeeDashboard from './Employe/EmployeeDashboard'
import CompanyJobs from './Employe/CompanyJobs'
import JobApplications from './Employe/JobApplications'
import CompanyProfile from './Employe/CompanyProfile'
// import AddJob from './Employe/AddJob'
import Signupemployee from './Employe/Signupemployee'
import AllCompanies from './Candidate/AllCompanies'
import CompanyJobsPublic from './Candidate/CompanyJobsPublic'
import Post from './Candidate/Post'
import MyPost from './Candidate/MyPost'
import Alladitpost from './Admin/Alladitpost'
import PostDetail from './Candidate/PostDetail'
import PendingCompanies from './Admin/PendingCompanies'
function App() {
    const location = useLocation();
    const hideHeaderFooter = location.pathname === '/login' || location.pathname === '/signup'
     || location.pathname === '/forget';
  return (
    <>
        {!hideHeaderFooter &&<Header /> }
        
        <Routes>
          {/* <Route path="/" element={<Deshboard />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/signupemployee" element={<Signupemployee />} />
          <Route path="/user" element={<div><User /><Deshboard /></div>} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forget" element={<ForgetPassword />} />
          <Route path="*" element={<NotFound />} />
           <Route path="/post" element={<Post/> } />
           <Route path="/mypost" element={<MyPost/>}/>
           <Route path="/post/:id" element={<PostDetail/>}/>
             <Route path="/adminsidebar" element={
          <ProtectedRoute allowedRoles={["admin"]}>
             <Adminsidebar/>
         </ProtectedRoute>
        } />
         <Route path="/" element={
          <ProtectedRoute allowedRoles={["admin"]}>
             <Deshboard/>
         </ProtectedRoute>
        } />
         <Route path="/candidate" element={
          <ProtectedRoute allowedRoles={["admin"]}>
             <Condidate/>
         </ProtectedRoute>
        } />
         <Route path="/panding" element={
          <ProtectedRoute allowedRoles={["admin"]}>
             <PendingCompanies/>
         </ProtectedRoute>
        } />
         <Route path="/alladitpost" element={
          <ProtectedRoute allowedRoles={["admin"]}>
             <Alladitpost/>
         </ProtectedRoute>
        } />
           <Route path="/companie" element={
          <ProtectedRoute allowedRoles={["admin"]}>
             <Companie/>
          </ProtectedRoute>
        } />
          <Route path="/application" element={  
          <ProtectedRoute allowedRoles={["admin"]}>
              <Application/>
            </ProtectedRoute>
          } />
        <Route path="/jobs" element={
          <ProtectedRoute allowedRoles={["admin"]}>
             <Jobs/>
          </ProtectedRoute>
        } />
         <Route path="/company/jobapplications/:jobId" element={
          <ProtectedRoute allowedRoles={["admin"]}>
             <JobApplications/>
          </ProtectedRoute>
        } />
         <Route path="/candidatejobs" element={  
          <ProtectedRoute allowedRoles={["candidate"]}>
              <EmployeeDashboard/>
            </ProtectedRoute>
          } />
          <Route path="/candidate/allcompanies" element={  
          <ProtectedRoute allowedRoles={["candidate"]}>
              <AllCompanies/>
            </ProtectedRoute>
          } />
          <Route path="/candidate/companyjobs/:id" element={  
          <ProtectedRoute allowedRoles={["candidate"]}>
              <CompanyJobsPublic/>
            </ProtectedRoute>
          } />
           <Route path="/sidebarprofile" element={  
          <ProtectedRoute allowedRoles={["candidate"]}>
              <SidebarProfile/>
            </ProtectedRoute>
          } />
           <Route path="/sidebarprofile/candidatejobs" element={  
          <ProtectedRoute allowedRoles={["candidate"]}>
               <CandidateJobs/>
            </ProtectedRoute>
          } />
           <Route path="/fullprofile" element={  
          <ProtectedRoute allowedRoles={["candidate"]}>
              <FullProfile/>
            </ProtectedRoute>
          } />
             <Route path="/company" element={  
          <ProtectedRoute allowedRoles={["companie"]}>
              <CompanyProfile/>
            </ProtectedRoute>
          } />
            <Route path="/company/jobs" element={
          <ProtectedRoute allowedRoles={["companie"]}>
             <CompanyJobs/>
          </ProtectedRoute>
        } />
         <Route path="/company/jobapplications/:jobId" element={
          <ProtectedRoute allowedRoles={["companie"]}>
             <JobApplications/>
          </ProtectedRoute>
        } />
         <Route path="/company/company" element={
          <ProtectedRoute allowedRoles={["companie"]}>
             <CompanyProfile/>
          </ProtectedRoute>
        } />
         {/* <Route path="/company/addjob" element={
          <ProtectedRoute allowedRoles={["companie"]}>
             <AddJob/>
          </ProtectedRoute>
        } /> */}

        </Routes>
        
   
     </>
  )
}

export default App
