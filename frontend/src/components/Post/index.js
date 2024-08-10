import "./index.css";
import {useState, useEffect, useRef} from "react";
import {useParams, Link} from "react-router-dom";
import {GoDotFill, GoHeart, GoHeartFill, GoComment} from "react-icons/go";
import axios from "axios";
import Loading from "../Loading";

export default function Post({user}){
    const {_id} = useParams();
    const [needLoading, setNeedLoading] = useState(0);
    const [loading, setLoading] = useState(true);
    const [toggle, setToggle] = useState(0);
    const [post, setPost] = useState({});
    const [liked, setLiked] = useState(false);
    const newComment = useRef();

    useEffect(() => {
        setLoading(true);
        async function getPost() {
            try{
                const res = await axios.get(
                    `http://localhost:8080/post/${_id}`,
                    {
                        headers:{
                            authorization: user.token,
                        }
                    }
                );
                if (res.status === 200) {
                    setPost(res.data);
                    setLiked(res.data.like_user_id && res.data.like_user_id.length>0 ? res.data.like_user_id.some((like_user_id) => (like_user_id===user._id)) : false);
                    setLoading(false);
                }
            } catch (err) {
                console.error(err);
            }
        };
        getPost();
    }, [_id, user, needLoading]);

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
            setNeedLoading((prevNeedLoading) => (prevNeedLoading+1));
        }
    }

    async function handleComment(){
        const res = await axios.post(
            `http://localhost:8080/post/:${post._id}`,
            {comment: newComment.current.value},
            {
                headers: {
                    "content-type": "application/json",
                    "authorization": user.token,
                }
            }
        );
        if (res.status === 200){
            setNeedLoading((prevNeedLoading) => (prevNeedLoading+1));
            newComment.current.value = "";
        }
    }

    return (     
            loading ? <Loading/> :
            <div id="post-page">
                <div id="post" key={post._id}>
                    <figure>
                        <img 
                            src={`../images/${post.images[toggle]}`} 
                            alt="" key={post.images[toggle]} 
                            onClick={() => {setToggle( (prevToggle) => (
                                prevToggle === post.images.length - 1 ? 0 : prevToggle + 1
                            ) )}}
                        />
                    </figure>
                    <div id="post-detail">
                        <header>
                            <img className="small-profile" src={post.profile_image ? `../images/${post.profile_image}` : "../default-profile-image.jpg"} alt=""/>
                            <Link to={`/${post.user_id}`}>{post.username}</Link>
                            <GoDotFill transform="scale(0.5)"/>
                            <i>{(new Date(post.date_time)).toLocaleString()}</i>
                        </header>  
                        <p>{post.caption}</p>
                        <hr/>
                        <footer>
                            {liked ? <GoHeartFill onClick={handleLike} transform="scale(1.5)" color='lightcoral'/> : <GoHeart onClick={handleLike} transform="scale(1.5)" />}
                            <GoComment transform="scale(1.5)" onClick={handleComment}/>
                            <input 
                                type="text" placeholder="Comment here" ref={newComment} 
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleComment();
                                }}
                            />
                        </footer>
                        <div id="comment-section">
                            {post.comments.map(
                                (comment) => (
                                    <div className="comment" key={comment.user_id}>
                                        <header>
                                            <img className="small-profile" src={comment.profile_image ? `../images/${comment.profile_image}` : "../default-profile-image.jpg"} alt=""/>
                                            <Link to={`/${comment.user_id}`}>{comment.username}</Link>
                                            <GoDotFill transform="scale(0.5)"/>
                                            <i>{(new Date(comment.date_time)).toLocaleString()}</i>
                                        </header>
                                        <p>{comment.comment}</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div> 
            </div>
    );
}