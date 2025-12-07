import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State for Form
  const [jobForm, setJobForm] = useState({ title: "", description: "", requiredSkills: "", location: "" });
  // State for Applications List
  const [applications, setApplications] = useState([]);

  // FETCH & REDIRECT LOGIC
  useEffect(() => {
    // 1. Define function inside effect to avoid warning
    const fetchApplications = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/applications", {
              headers: { "x-auth-token": token }
          });
          const data = await res.json();
          setApplications(data);
        } catch (err) { console.error(err); }
    };

    // 2. Run Logic
    if (!user || user.role !== "employer") {
      navigate("/");
    } else {
        fetchApplications();
    }
  }, [user, navigate, token]); // Now we track token too

  const handlePostJob = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
      body: JSON.stringify(jobForm),
    });
    if (res.ok) {
        alert("Job Posted Successfully!");
        setJobForm({ title: "", description: "", requiredSkills: "", location: "" }); 
    }
  };

  return (
  <div className="container">
    <h2 style={{ marginBottom: '20px' }}>Employer Dashboard</h2>
    
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
      
      {/* Post Job Section */}
      <div className="card">
          <h3 style={{ marginTop: 0 }}>Post a New Job</h3>
          <form onSubmit={handlePostJob}>
              <input placeholder="Job Title" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} required />
              <textarea placeholder="Description" rows="4" value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} required style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '15px'}} />
              <input placeholder="Required Skills" value={jobForm.requiredSkills} onChange={e => setJobForm({...jobForm, requiredSkills: e.target.value})} required />
              <input placeholder="Location" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} required />
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Post Job</button>
          </form>
      </div>

      {/* Applications Section */}
      <div className="card">
          <h3 style={{ marginTop: 0 }}>Applications Received</h3>
          {applications.length === 0 ? <p style={{ color: 'gray' }}>No applications yet.</p> : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                  {applications.map(app => (
                      <li key={app._id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                          <strong style={{ color: 'var(--primary)' }}>{app.candidateId?.name}</strong> 
                          <br/> applied for <strong>{app.jobId?.title}</strong>
                          <br/>
                          <small style={{ color: 'gray' }}>{app.candidateId?.email}</small>
                      </li>
                  ))}
              </ul>
          )}
      </div>
    </div>
  </div>
);
};

export default Dashboard;