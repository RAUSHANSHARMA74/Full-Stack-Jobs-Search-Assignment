import React, { useEffect, useState } from 'react';
import "./Jobs.css";
import { CiLocationOn, CiViewTimeline } from "react-icons/ci";
import { BiRupee } from "react-icons/bi";
import Swal from 'sweetalert2';
const api = import.meta.env.VITE_API_URL;

export default function Jobs() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const token = JSON.parse(localStorage.getItem("token"));
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const apiurl = `${api}/api/jobs`;

    if (!token || !token.token) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "You are not logged in. Please log in to see the jobs.",
            timer: 3000,
            timerProgressBar: true
        }).then(() => {
            window.location.href = "/login"
        })
    }

    const fetchJobs = async (url) => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': token.token,
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            if (result.status != 200) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data?.message || 'Error fetching user data',
                    timer: 3000,
                    timerProgressBar: true
                }).then(() => {
                    window.location.href = "/login"
                })
            }
            setData(result);
            setTotalPages(result.totalPages)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const constructQueryParams = () => {
        let params = [];
        if (currentPage) {
            params.push(`page=${currentPage}`);
        }
        if (search) {
            params.push(`text=${searchTerm}`);
        }
        return params;
    };

    useEffect(() => {
        const params = constructQueryParams();
        const fullUrl = params.length > 0 ? `${apiurl}?${params.join("&")}` : apiurl;
        fetchJobs(fullUrl);
    }, [searchTerm, currentPage]);

    const handleSearchChange = (event) => {
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm);
        setCurrentPage(1);

    };

    const applyJobs = async (jobId) => {
        try {
            const response = await fetch(`${api}/api/jobs`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token.token,

                },
                body: JSON.stringify({ id: jobId })
            });
            const result = await response.json();
            if (result.status == 200) {
                Swal.fire({
                    title: "Good job!",
                    text: result.message,
                    icon: "success"
                })
                fetchJobs(apiurl);
            } else if (result.status == 400) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: result.message,
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data?.message || 'Error fetching user data',
                    timer: 3000,
                    timerProgressBar: true
                }).then(() => {
                    window.location.href = "/login"
                })
            }

        } catch (error) {
            console.error('Error applying for the job:', error);
        }
    };

    const handleApplyJobs = (e) => {
        const jobId = e.target.id;
        applyJobs(jobId);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setCurrentPage(page);
        }
    };

    return (
        <div className="jobs">
            <div className="search-container">
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search jobs"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            {loading ? (
                <div className="loader_jobs">
                    <div className="custom-loader"></div>
                </div>
            ) : (
                <div>
                    <div className="job_company">
                        {data?.data?.map((job) => (
                            <div key={job._id} className="job_card">
                                <div className="position_logo">
                                    <h1>{job.jobDescription}</h1>
                                    <img src={job.logo} alt={`${job.company} logo`} className="company_logo" />
                                </div>
                                <p className="company_name">{job.company}</p>
                                <div className="location_experience_ctc">
                                    <div className="location">
                                        <CiLocationOn className="icon" />
                                        <p>{job.workLocation}</p>
                                    </div>
                                    <div className="experience">
                                        <CiViewTimeline className="icon" />
                                        <p>{job.experience || "N/A"}</p>
                                    </div>
                                    <div className="salary">
                                        <BiRupee className="icon" />
                                        <p>{job.ctc}</p>
                                    </div>
                                </div>
                                <div className="posted_date">
                                    <p>{new Date(job.postedDate).toDateString()}</p>
                                    <button className="apply_button" id={job._id} onClick={handleApplyJobs}>
                                        Apply
                                    </button>
                                </div>
                            </div>
                        ))}

                    </div>

                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                className={`pagination_button ${currentPage === index + 1 ? 'active' : ''}`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
