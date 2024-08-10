import "./index.css";
import {useState, useRef} from "react";
import {Link} from "react-router-dom";
import {GoSearch} from "react-icons/go"
import axios from "axios";

function UserCard({user}){
    return (
        <div className="user-card" key={user._id}>
            <figure>
                <img src={user.profile_image ? `../images/${user.profile_image}` : "../default-profile-image.jpg"} alt=""/>
            </figure>
            <header>
                <Link to={`/:${user._id}`}>{user.username}</Link>
            </header>
        </div>
    );
}

export default function Search({user}){
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);
    const input = useRef();

    async function handleSearch(){
        if (input.current.value === ""){
            return;
        }
        const res = await axios.get(
            `http://localhost:8080/user/search?username=${input.current.value}`,
            {
                headers:{
                    authorization: user.token,
                }
            }
        );
        if (res.status === 200){
            setResults(res.data);
            setLoading(false);
        }
    }

    return (
        <div id="search-page">
            <header id="search-page-header">
                <input 
                    type="text" ref={input} placeholder="Tell us their username ..." 
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                    }}
                />
                <GoSearch transform="scale(2.5)" onClick={handleSearch}/>
            </header>
            {
                !loading && 
                <div id="search-result">
                    {results.map(
                        (user) => (<UserCard user={user}/>)
                    )}
                </div>
            }
        </div>
    );
}