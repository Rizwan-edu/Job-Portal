import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './Nav';
import Loginpage from './Loginpage';
import Home from './Home';
import Signup from './Signup';

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route
          path="/"
          element={<Home/>}
        />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/signup" element={<Signup />} />
        {/* Add more routes as needed */}
      
      </Routes>
    </BrowserRouter>
  );
}
export default App;