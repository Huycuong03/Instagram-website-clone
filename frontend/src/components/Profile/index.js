import "./index.css";
import {useState, useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import Loading from "../Loading";

export default function Profile({rootUser, setRootUser}){
    const {_id} = useParams();
    const [loading, setLoading] = useState(true);
    const [follow, setFollow] = useState({following: false, nFollowers: 0});
    const [profileImage, setProfileImage] = useState("");
    const [user, setUser] = useState({});

    useEffect(() => {
        setLoading(true);
        async function fecthUserProfile(){
            const res = await axios.get(
                `http://localhost:8080/user/${_id}`,
                {
                    headers:{
                        Authorization: rootUser.token,
                    },
                }
            );
            if (res.status === 200){
                setUser(res.data);
                setFollow({following: res.data.following, nFollowers: res.data.follower_user_id.length});
                setProfileImage(res.data.profile_image);
                setLoading(false);
            }
        };
        fecthUserProfile();

    }, [_id, rootUser]);

    async function handleFollow(){
        const res = await axios.post(
            `http://localhost:8080/user/${_id}`,
            {
                following: !follow.following,
            },
            {
                headers:{
                    authorization: rootUser.token,
                }
            }
        );
        if (res.status === 200) {
            setFollow((prevFollow) => ({following: !prevFollow.following, nFollowers: prevFollow.following ? prevFollow.nFollowers - 1 : prevFollow.nFollowers + 1}));
        }
    };

    async function handleProfileImage (event) {
        event.preventDefault();
        const image = event.target.files[0];
        const formData = new FormData();
        formData.append("image", image);
        const resUpload = await fetch(
            `http://localhost:8080/upload/image/profile`,
            {
                method: "POST",
                body: formData,
                headers: {
                    authorization: rootUser.token,
                }
            }
        );
        if (resUpload.status === 200) {
            const resPost = await axios.post(
                "http://localhost:8080/user/",
                {
                    profile_image: image.name,
                },
                {
                    headers:{
                        authorization: rootUser.token,
                    }
                }
            );
            if (resPost.status === 200) {
                setRootUser((prevRootUser) => ({...prevRootUser, profile_image: image.name}));
            }
        }
    }

    return (
        loading ? <Loading/> :
        <div id="profile-page">
            <div id="profile">
                <figure>
                    <label>
                        <img src={profileImage ? `./images/${profileImage}` : "./default-profile-image.jpg"} alt=""/>
                        {rootUser._id === user._id && <input type="file" style={{display: "none"}} onChange={handleProfileImage}/>}
                    </label>
                </figure>
                <div>
                    <div id="user-detail">
                        <p>{user.username}</p>
                        {rootUser._id !== user._id && <button onClick={handleFollow}>{follow.following ? "Following" : "Follow"}</button>}
                    </div>
                    <div id="statistics">
                        <p>{user.posts ? user.posts.length : 0} posts</p>
                        <p>{follow.nFollowers} followers</p>
                        <p>{user.following_user_id ? user.following_user_id.length : 0} following</p>
                    </div>
                </div>
            </div>
            <div id="posts">
                {user.posts.map( (post) =>
                    <div key={post._id}>
                        <Link to={`/post/:${post._id}`} >
                            <img src={`./images/${post.images[0]}`} alt="" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}