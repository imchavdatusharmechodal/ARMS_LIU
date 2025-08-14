import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './components/Dashboard';
import Scrolltotop from './Scrolltotop';
import Login from './components/Login';
import Registration from './components/Registration';
import NewAppliction from './components/NewAppliction';
import ApplyNow from './components/ApplyNow';
import UploadPhotos from './components/UploadPhotos';
import UploadSuccess from './components/UploadSuccess';
import ValidationReport from './components/ValidationReport';
import FilledPdf from './components/FilledPdf';
import PsReport from './components/PsReport';
import { useEffect } from 'react';


function App() {

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const user_id = params.get('user_id');
  const role = params.get('role');
  if (token) localStorage.setItem('ps_token', token);
  if (user_id) localStorage.setItem('user_id', user_id);
  if (role) localStorage.setItem('role', role);
}, []);


  return (
    <div className="App"> 
      <Router>
      <Scrolltotop/>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/registration' element={<Registration/>}/>
          <Route path='/Dashboard' element={<Dashboard/>}/>
          <Route path='/new-appliction' element={<NewAppliction/>}/>
          <Route path='/apply-now' element={<ApplyNow/>}/>
          <Route path='/upload-photos' element={<UploadPhotos/>}/>
          <Route path='/upload-success' element={<UploadSuccess/>}/>
          <Route path='/validation-report/:id' element={<ValidationReport/>}/>
          <Route path='/filled-pdf/:id' element={<FilledPdf/>}/>
          <Route path="/ps-report/:id" element={<PsReport />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
