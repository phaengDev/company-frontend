import React,{useEffect,useState} from 'react'
import Header from '../layout/Header'
import Navbar from '../layout/Navbar'
import AppContent from './Paste'
import Loader from '../layout/loader'
import _ from 'lodash';
import { useLocation,useNavigate } from 'react-router-dom';
export default function Application() {
  const location = useLocation();
  const pathName = location.pathname;
  const [path, setPath] = useState(pathName);
  const [minified,setMinified]=useState(false);
  const routes=['/report-getin','/scanOut','/scanIn','/ScanInzero','/ScanOutzero','/report-Sin','/report-SOut','/report-sorting-in','/report-sorting-out']
  const navigate = useNavigate();
  const token=localStorage.getItem('token');
 
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    setPath(pathName);
    if(_.includes(routes,path)){
      setMinified(true);
    }
  }, [pathName]);
  return (
    <>
      <Loader />
      {path=== "/login" ? (
        <AppContent />
      ) : (
      <div id="app" className="app app-header-fixed app-sidebar-fixed app-without-sidebar app-with-top-menu">
        <Header />
        <Navbar />
        <AppContent />
        <a href="javascript:;" class="btn btn-icon btn-circle btn-theme btn-scroll-to-top" data-toggle="scroll-to-top"><i class="fa fa-angle-up"></i></a>
      </div>
      )}
    </>
  )
}
