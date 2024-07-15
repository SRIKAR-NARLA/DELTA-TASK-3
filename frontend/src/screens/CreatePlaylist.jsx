import { useState } from "react";
import { assets } from "../assets/admin-assets/assets";
import styles from "./CreatePlaylist.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreatePlaylist() {
  const [image, setImage] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ownership, setOwnership] = useState('public'); // New state for ownership
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('owner', userInfo._id);
      formData.append('ownership', ownership); // Add ownership to form data
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.post('/api/playlists/add', formData);
      navigate('/playlists'); 
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <p>Upload Thumbnail (Optional)</p>
          <input
            type="file"
            id="imageFile"
            name="imageFile"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
          <label htmlFor="imageFile" className={styles.label}>
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="Upload Thumbnail"/>
          </label>
        </div>
        <div className={styles.formGroup}>
          <p>Playlist Name</p>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            className={styles.name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <p>Playlist Description</p>
          <textarea
            name="description"
            placeholder="Description"
            value={description}
            className={styles.desc}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <p>Ownership</p>
          <select
            name="ownership"
            value={ownership}
            className={styles.select}
            onChange={(e) => setOwnership(e.target.value)}
            required
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreatePlaylist;
