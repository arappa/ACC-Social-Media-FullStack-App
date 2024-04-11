import {BrowserRouter, Routes, Route} from 'react-router-dom';
import MainFeedContainer from './components/common/MainFeedContainer';
import Register from './components/login/register';
import Login from './components/login/login';
import ProfilePage from './components/profile';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainFeedContainer/>}/>
        <Route path="/login" element={<Login></Login>} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/profile/:userId" element={<ProfilePage></ProfilePage>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

