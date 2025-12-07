import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const JobBoard = () => {
  // --- STATE MANAGEMENT ---
  const [jobs, setJobs] = useState([]);           // Stores the list of jobs from the server
  const [searchTerm, setSearchTerm] = useState(""); // Stores the user's search input
  
  // --- CONTEXT & HOOKS ---
  const { user, token } = useContext(AuthContext); // Access global user data
  const navigate = useNavigate();                  // For redirecting users

  // --- 1. FETCH JOBS (ON LOAD) ---
  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  // --- 2. HANDLE APPLY LOGIC ---
  const handleApply = async (jobId) => {
    // Validation: Must be logged in
    if (!user) {
      alert("Please login to apply!");
      return navigate("/login");
    }

    // Validation: Must be a Candidate (RBAC)
    if (user.role !== "candidate") {
      return alert("Only Candidates can apply for jobs!");
    }

    try {
      // API Call: Send application to backend
      const response = await fetch("http://localhost:5000/api/applications/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token, // Attach the user's ID card (Token)
        },
        body: JSON.stringify({ jobId }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(data.message || "Application submitted successfully!");
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Apply Error:", err);
      alert("Failed to connect to the server.");
    }
  };

  // --- 3. SEARCH FILTER LOGIC ---
  // Filters the 'jobs' array based on the 'searchTerm'
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- RENDER UI ---
  return (
    <div className="container">
      <h2 style={{ marginBottom: "20px", color: "var(--primary)" }}>Available Jobs</h2>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search for a job title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "30px" }}
      />

      {/* JOB LIST GRID */}
      <div style={{ display: "grid", gap: "20px" }}>
        
        {/* If no jobs found, show a message */}
        {filteredJobs.length === 0 && <p>No jobs found.</p>}

        {/* Map through filtered jobs */}
        {filteredJobs.map((job) => (
          <div key={job._id} className="card">
            
            {/* Job Header */}
            <h3 style={{ margin: "0 0 10px 0" }}>{job.title}</h3>
            
            {/* Job Details */}
            <p style={{ color: "var(--text-light)", margin: "5px 0" }}>
              <strong>Location:</strong> {job.location}
            </p>
            <p style={{ margin: "10px 0" }}>{job.description}</p>
            
            {/* Footer: Employer Name & Apply Button */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginTop: "15px", 
              borderTop: "1px solid #eee", 
              paddingTop: "10px" 
            }}>
              <small style={{ color: "gray" }}>
                Posted by: {job.employerId?.name || "Unknown Employer"}
              </small>

              {/* Conditional Button: Hide for Employers */}
              {user?.role !== "employer" && (
                <button 
                  onClick={() => handleApply(job._id)} 
                  className="btn-primary"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobBoard;