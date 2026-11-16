import { Routes, Route } from 'react-router';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Issues from './pages/Issues';
import IssueDetail from './pages/IssueDetail';
import MyIssues from './pages/MyIssues';
import ReportIssue from './pages/ReportIssue';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/issues/:id" element={<IssueDetail />} />
          <Route path="/my-issues" element={<MyIssues />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
