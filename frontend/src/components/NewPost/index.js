import "./index.css";
import { useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function NewPost({user, navigate}){
    const caption = useRef();
    const [images, setImages] = useState([]);

    async function handleSubmit(e){
        e.preventDefault();
        if (caption.current.value === "" || images.length === 0) return;
        const formData = new FormData();
        images.forEach((image) => {
            formData.append('image', image);
        });
        const resUpload = await fetch(
            `http://localhost:8080/upload/image/post`,
            {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: user.token,
                }
            }
        );
        if (resUpload.status === 200) {
            const resPost = await axios.post(
                "http://localhost:8080/post/",
                {
                    user_id: user._id,
                    caption: caption.current.value,
                    images: images.map((image) => image.name),
                    like_user_id: [],
                    comments: [],
                },
                {
                    headers:{
                        Authorization: user.token,
                    }
                }
            );
            if (resPost.status === 200) {
                caption.current.value = "";
                navigate("/");
            }
        }
    }

    return(
        <div id="new-post-page">
            <header>
                <img className="small-profile" src={user.profile_image ? `./images/${user.profile_image}` : "./default-profile-image.jpg"} alt=""/>
                <Link to={user.user_id}>{user.username}</Link>
            </header>
            <input type="text" ref={caption} placeholder="Tell people something about these picture"/>
            <div id="image-section">
                {images.map((image) => (<img key={image.name} src={URL.createObjectURL(image)} alt=""/>))}
            </div>
            <footer>
                <label htmlFor="image-upload">
                    <input id="image-upload" type="file" name="image" onChange={(e) => {setImages([...e.target.files])}} multiple/>
                    Upload images
                </label>
                <input type="submit" onClick={handleSubmit}/>
            </footer>
        </div>
    );
}