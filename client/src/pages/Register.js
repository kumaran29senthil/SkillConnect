import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate", // Default role
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration Successful! Please Login.");
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error connecting to server");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required style={{ display: "block", width: "100%", margin: "10px 0", padding: "8px" }} />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required style={{ display: "block", width: "100%", margin: "10px 0", padding: "8px" }} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={{ display: "block", width: "100%", margin: "10px 0", padding: "8px" }} />
        
        <label>I am a:</label>
        <select name="role" onChange={handleChange} style={{ display: "block", width: "100%", margin: "10px 0", padding: "8px" }}>
          <option value="candidate">Candidate (Job Seeker)</option>
          <option value="employer">Employer (Job Poster)</option>
        </select>

        <button type="submit" style={{ width: "100%", padding: "10px", background: "green", color: "white" }}>Register</button>
      </form>
    </div>
  );
};

export default Register;