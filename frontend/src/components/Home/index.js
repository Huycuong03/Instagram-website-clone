import "./index.css";
import { useState, useEffect } from "react";
import axios from "axios";
import HomePost from "./HomePost";
import Loading from "../Loading";
import { Navigate } from "react-router-dom";

function Home({user}){
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        setLoading(true);
        setError(false);
        if (user._id){ 
            axios.get(
                "http://localhost:8080/post/",
                {
                    headers: {
                        "authorization": user.token
                    }
                }
            ).then((res) => {
                if (res.status === 200) {
                    setPosts(res.data);
                    setLoading(false);
                }else{
                    setError(true);
                }
            })
        } else {
            setLoading(false);
        }
    }, [user]);

    return (
        user._id ? 
        <div id="home-page">
            {loading && <Loading/>}
            {error && <div>Something went wrong. Please try again.</div>}
            {posts.map((post) => (<HomePost user={user} post={post} key={post._id}/>))}
        </div> 
        : <Navigate to="/login" replace />
    );
}
export default Home;