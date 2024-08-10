import './App.css';
import { useState } from "react";
import { Routes, Route, Link, useNavigate} from "react-router-dom";
import { GoHomeFill, GoSearch, GoPlusCircle} from "react-icons/go"; 
import Home from "./components/Home";
import Search from "./components/Search";
import Post from "./components/Post";
import NewPost from "./components/NewPost";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Signup from './components/Signup';
import NotFound from "./components/NotFound";

function App() {
  const [user, setUser] = useState({_id: null});
  const navigate = useNavigate();
  return (
    <div id="app">
      {user._id && <ul>
        <li><img id="logo" src="./logo.png" alt=""/></li>
        <li><GoHomeFill transform='scale(1.5)' /><Link to="/">Home</Link></li>
        <li><GoSearch transform='scale(1.5)'/><Link to="/search">Search</Link></li>
        <li><GoPlusCircle transform='scale(1.5)'/><Link to="/post">Create</Link></li>
        <li>
          <img className='small-profile' src={user.profile_image ? `./images/${user.profile_image}` : "./default-profile-image.jpg"} alt=""/>
          <Link to={`/:${user._id}`} >Profile</Link>
        </li>
        <li><button onClick={() => {setUser({_id: null}); navigate("/login");}}>Log out</button></li>
      </ul>}
      <Routes>
          <Route path="/" element={<Home user={user}/>}/>
          <Route path="/:_id" element={<Profile rootUser={user} setRootUser={setUser}/>}/>
          <Route path="/search" element={<Search user={user}/>}/>
          <Route path="/post" element={<NewPost user={user} navigate={navigate}/>}/>
          <Route path="/post/:_id" element={<Post user={user}/>}/>
          <Route path="/login" element={<Login setUser={setUser} navigate={navigate}/>}/>
          <Route path='/signup' element={<Signup setUser={setUser} navigate={navigate}/>}/>
          <Route path="*" element={<NotFound/>}/>
      </Routes>
    </div>
  );
}

export default App;
