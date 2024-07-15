import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import Profile from './screens/ProfileScreen';
import Playlist from './screens/Playlist.jsx';
import Playlists from './screens/Playlists.jsx';
import UploadSong from './screens/UploadSong.jsx';
import CreatePlaylist from './screens/CreatePlaylist.jsx';
import Songs from './screens/Songs.jsx';
import Song from './screens/Song.jsx';
import Friend from './screens/Friend.jsx';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<DashboardScreen/>}>
          <Route path="/add-playlist" element={<CreatePlaylist />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/playlist/:id" element={<Playlist />} />
            <Route path="/songs" element={<Songs />} />
            <Route path="/song/:id" element={<Song />} />
            <Route path="/add-song" element={<UploadSong/>}/>
            <Route path="/friends/:id" element={<Friend/>}/>
            {/* <Route path="/songs/" element={<Genre />} />
            <Route path="/songs/:id" element={<Genre />} /> */}
          </Route>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/users" element={<Users />} /> */}
        </Routes>
      </Router>
      <audio preload='auto'></audio>
      <ToastContainer/>
    </>
  );
}

export default App;

