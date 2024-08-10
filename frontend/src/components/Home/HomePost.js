import "./index.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoHeart, GoHeartFill, GoComment, GoDotFill} from "react-icons/go"; 
import axios from "axios";

export default function HomePost({post, user}){
    const [toggle, setToggle] = useState(0);
    const [liked, setLiked] = useState(post.like_user_id.some((like_user_id) => (like_user_id===user._id)));
    const navigate = useNavigate();

    async function handleLike(){
        const res = await axios.post(
            `http://localhost:8080/post/:${post._id}`,
            {like: !liked},
            {
                headers: {
                    "content-type": "application/json",
                    "authorization": user.token,
                }
            }
        );
        if (res.status === 200){
            setLiked(!liked);
        }
    }

    return (
        <div className="post" key={post._id}>
            <header>
                <img className="small-profile" src={post.profile_image ? `./images/${post.profile_image}` : "./default-profile-image.jpg"} alt=""/>
                <Link to={post.user_id}>{post.username}</Link>
                <GoDotFill transform="scale(0.5)"/>
                <i>{(new Date(post.date_time)).toLocaleString()}</i>
            </header>
                <figure>
                    <figcaption>{post.caption}</figcaption>
                    <img 
                        src={`./images/${post.images[toggle]}`} 
                        alt="" 
                        onClick={() => {setToggle( (prevToggle) => (
                            prevToggle === post.images.length - 1 ? 0 : prevToggle + 1
                        ) )}}
                    />
                </figure>
            <footer>
                {liked ? <GoHeartFill onClick={handleLike} transform="scale(2)" color='lightcoral'/> : <GoHeart onClick={handleLike} transform="scale(2)" />}
                <GoComment transform="scale(2)" onClick={() => {navigate(`/post/:${post._id}`)}} />
            </footer>
        </div>
    );
}