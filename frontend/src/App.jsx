import { Routes, Route } from 'react-router';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Issues from './pages/Issues';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';


function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
                    <Route path="*" element={<NotFound />} />

        </Routes>
      </main>
    </div>
  );
}

export default App;
