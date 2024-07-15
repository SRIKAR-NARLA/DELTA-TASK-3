import { useState } from "react";
import { assets } from "../assets/admin-assets/assets";
import styles from "./UploadSong.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function UploadSong() {
    const [image,setImage] = useState(false);
    const [song,setSong] = useState(false);
    const [name,setName] = useState('');
    const [description,setDescription] = useState('');
    const [genre,setGenre] = useState('');
    const [language,setLanguage] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault();
        try{
            const formData = new FormData();
            formData.append('name',name);
            formData.append('artist',localStorage.getItem('userInfo').name);
            formData.append('description',description);
            formData.append('genre',genre);
            formData.append('language',language);
            formData.append('image',image);
            formData.append('audio',song);

            const response = await axios.post('/api/songs/add',formData);
            
        }catch(error){

        }
    }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.upload}>
        <div className={styles.formGroup}>
          <p>Upload Song</p>
          <input
            type="file"
            id="audioFile"
            name="audioFile"
            accept="audio/*"
            hidden
            onChange={(e)=>setSong(e.target.files[0])}
          />
          <label htmlFor="audioFile">
            <img src={song?assets.upload_added:assets.upload_song} alt="Upload Song" />
          </label>
        </div>
        <div className={styles.formGroup}>
          <p>Upload Image</p>
          <input
            type="file"
            id="imageFile"
            name="imageFile"
            accept="image/*"
            hidden
            onChange={(e)=>setImage(e.target.files[0])}
          />
          <label htmlFor="imageFile">
            <img src={image? URL.createObjectURL(image):assets.upload_area} alt="Upload" />
          </label>
        </div>
        </div>
        <div className={styles.formGroup}>
          <p>Song Name</p>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            className={styles.name}
            onChange={(e)=>setName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <p>Song Description</p>
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={description}
            className={styles.desc}
            onChange={(e)=>setDescription(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <p>Song Genre</p>
          <select
            name="genre"
            value={genre}
            onChange={(e)=>setGenre(e.target.value)}
            required
          >
            <option value="">Select Genre</option>
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
            <option value="jazz">Jazz</option>
            <option value="classical">Classical</option>
            <option value="hiphop">Hip-Hop</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <p>Song Language</p>
          <select
            name="language"
            value={language}
            onChange={(e)=>setLanguage(e.target.value)}
            required
          >
            <option value="">Select Language</option>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="telugu">Telugu</option>
            <option value="tamil">Tamil</option>
            <option value="malayalam">Malayalam</option>
          </select>
        </div>
        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default UploadSong;
