import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./component/Navbar/navbar.jsx";
import AlbumList from "./component/AlbumList/albumList.jsx";

function App() {
  return (
    <>
      <Navbar/>
      <ToastContainer/>
      <div style={{maxWidth:"1000px", margin:"0 auto"}}>
        <AlbumList/>
      </div>
    </>
  )
}

export default App
