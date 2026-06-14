import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [jobs, setJobs] = useState([]);

    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const appliedCount = jobs.filter(
        (job) => job.status === "Applied"
    ).length;

    const interviewCount = jobs.filter(
        (job) => job.status === "Interview"
    ).length;

    const offerCount = jobs.filter(
        (job) => job.status === "Offer"
    ).length;

    const rejectedCount = jobs.filter(
        (job) => job.status === "Rejected"
    ).length;

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = () => {
        axios
            .get("http://localhost:8080/jobs")
            .then((response) => {
                setJobs(response.data);
            })
            .catch((error) => {
                console.error("Error fetching jobs:", error);
            });
    };

    const addJob = () => {
        const newJob = {
            company,
            role,
            status,
        };

        axios
            .post("http://localhost:8080/jobs", newJob)
            .then(() => {
                fetchJobs();

                setCompany("");
                setRole("");
                setStatus("");
            })
            .catch((error) => {
                console.error("Error adding job:", error);
            });
    };

    const deleteJob = (id) => {
        axios
            .delete(`http://localhost:8080/jobs/${id}`)
            .then(() => {
                fetchJobs();
            })
            .catch((error) => {
                console.error("Error deleting job:", error);
            });
    };

    const updateJob = () => {
        const updatedJob = {
            company,
            role,
            status,
        };

        axios
            .put(`http://localhost:8080/jobs/${editingId}`, updatedJob)
            .then(() => {
                fetchJobs();

                setCompany("");
                setRole("");
                setStatus("");
                setEditingId(null);
            })
            .catch((error) => {
                console.error("Error updating job:", error);
            });
    };

    const startEdit = (job) => {
        setCompany(job.company);
        setRole(job.role);
        setStatus(job.status);
        setEditingId(job.id);
    };

    return (
        <div className="container">
            <h1>Job Tracker</h1>

            <div className="stats-container">
                <div className="stat-card">
                    <h3>{jobs.length}</h3>
                    <p>Total</p>
                </div>

                <div className="stat-card applied-card">
                    <h3>{appliedCount}</h3>
                    <p>Applied</p>
                </div>

                <div className="stat-card interview-card">
                    <h3>{interviewCount}</h3>
                    <p>Interview</p>
                </div>

                <div className="stat-card offer-card">
                    <h3>{offerCount}</h3>
                    <p>Offer</p>
                </div>

                <div className="stat-card rejected-card">
                    <h3>{rejectedCount}</h3>
                    <p>Rejected</p>
                </div>
            </div>

            <div className="form-card">
                <div>
                    <input
                        type="text"
                        placeholder="Company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                    />
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    />
                </div>

                <div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">Select Status</option>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                {editingId ? (
                    <button className="add-btn" onClick={updateJob}>
                        Update Job
                    </button>
                ) : (
                    <button className="add-btn" onClick={addJob}>
                        Add Job
                    </button>
                )}
            </div>

            <hr />
            <input
                type="text"
                placeholder="Search company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="All">All Statuses</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            <h2>Applications</h2>

            {jobs
                .filter((job) =>
                    job.company.toLowerCase().includes(search.toLowerCase())
                )
                .filter((job) =>
                    filterStatus === "All"
                        ? true
                        : job.status === filterStatus
                )
                .map((job) => (
                <div key={job.id} className="job-card">
                    <h3>{job.company}</h3>
                    <p>{job.role}</p>
                    <p className={`status ${job.status.toLowerCase()}`}>
                        {job.status}
                    </p>

                    <button
                        className="edit-btn"
                        onClick={() => startEdit(job)}
                    >
                        Edit
                    </button>

                    <button
                        className="delete-btn"
                        onClick={() => deleteJob(job.id)}
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}

export default App;
