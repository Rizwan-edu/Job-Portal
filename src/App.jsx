import React, { useState, useEffect, createContext, useContext, useRef } from 'react';

// --- Auth Context and Provider (No Firebase) ---
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(false); // No async loading for simple auth

    // Simulate persistent login for demonstration (optional)
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        const storedUserId = localStorage.getItem('userId');
        const storedIsAdmin = localStorage.getItem('isAdmin');
        if (storedUser && storedUserId) {
            setCurrentUser(JSON.parse(storedUser));
            setUserId(storedUserId);
            setIsAdmin(storedIsAdmin === 'true');
        }
    }, []);

    const login = (email, password) => {
        // Simple mock authentication
        if (email === 'admin@jobportal.com' && password === 'password123') {
            setCurrentUser({ email: 'admin@jobportal.com' });
            setUserId('admin-id-123');
            setIsAdmin(true);
            localStorage.setItem('currentUser', JSON.stringify({ email: 'admin@jobportal.com' }));
            localStorage.setItem('userId', 'admin-id-123');
            localStorage.setItem('isAdmin', 'true');
            return { success: true };
        } else if (password === 'user123') { // Simple password for all non-admin users
            setCurrentUser({ email });
            setUserId(email); // Using email as user ID for simplicity
            setIsAdmin(false);
            localStorage.setItem('currentUser', JSON.stringify({ email }));
            localStorage.setItem('userId', email);
            localStorage.setItem('isAdmin', 'false');
            return { success: true };
        } else {
            return { success: false, message: "Invalid email or password." };
        }
    };

    const signup = (email, password) => {
        // Simple mock signup - always successful for unique email
        // In a real app, you'd check if email exists and store user data
        if (email === 'admin@jobportal.com') {
            return { success: false, message: "Email already registered as admin." };
        }
        // In a real app, you'd save this user to a "database"
        return { success: true };
    };

    const logout = () => {
        setCurrentUser(null);
        setUserId(null);
        setIsAdmin(false);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userId');
        localStorage.removeItem('isAdmin');
    };

    return (
        <AuthContext.Provider value={{ currentUser, userId, isAdmin, loadingAuth, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// --- Data Context and Provider (No Firebase) ---
// This context will manage all job and application data in-memory
const DataContext = createContext();

const DataProvider = ({ children }) => {
    // Initial dummy data for jobs
    const [jobs, setJobs] = useState([
        { id: 'job1', title: 'Senior React Developer', description: 'Experienced React dev for challenging projects.', requirements: '5+ years React, Redux, Node.js', location: 'Remote', salary: '$120,000 - $150,000', jobType: 'Full-time', createdAt: new Date() },
        { id: 'job2', title: 'UI/UX Designer', description: 'Creative designer with a passion for user-centered design.', requirements: 'Portfolio, Figma, Adobe XD', location: 'New York', salary: '$80,000 - $100,000', jobType: 'Full-time', createdAt: new Date() },
        { id: 'job3', title: 'Part-time Content Writer', description: 'Write engaging content for our blog and social media.', requirements: 'Excellent writing skills, SEO knowledge', location: 'Remote', salary: '$30 - $40/hour', jobType: 'Part-time', createdAt: new Date() },
        { id: 'job4', title: 'Data Scientist Intern', description: 'Assist in data analysis and model building.', requirements: 'Python, SQL, basic ML knowledge', location: 'Bangalore', salary: '$2,000/month', jobType: 'Internship', createdAt: new Date() }
    ]);

    // In-memory storage for applications
    // Structure: { id: string, jobId: string, jobTitle: string, userId: string, userEmail: string, appliedAt: Date }
    const [applications, setApplications] = useState([]);

    const addJob = (newJob) => {
        setJobs(prevJobs => [...prevJobs, { ...newJob, id: `job${Date.now()}`, createdAt: new Date() }]);
    };

    const updateJob = (updatedJob) => {
        setJobs(prevJobs => prevJobs.map(job =>
            job.id === updatedJob.id ? { ...updatedJob, updatedAt: new Date() } : job
        ));
    };

    const deleteJob = (jobId) => {
        setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
        setApplications(prevApps => prevApps.filter(app => app.jobId !== jobId)); // Also remove associated applications
    };

    const applyForJob = (job, userEmail, userId) => {
        // Check if user already applied (for in-memory deduplication)
        const existingApplication = applications.find(app => app.jobId === job.id && app.userId === userId);
        if (existingApplication) {
            return { success: false, message: "You have already applied for this job." };
        }

        const newApplication = {
            id: `app${Date.now()}`,
            jobId: job.id,
            jobTitle: job.title,
            userId: userId,
            userEmail: userEmail,
            appliedAt: new Date()
        };
        setApplications(prevApps => [...prevApps, newApplication]);
        return { success: true, message: `Successfully applied for "${job.title}"!` };
    };

    return (
        <DataContext.Provider value={{ jobs, applications, addJob, updateJob, deleteJob, applyForJob }}>
            {children}
        </DataContext.Provider>
    );
};


// --- Custom Message Box Component ---
const MessageBox = ({ message, type = 'info', onClose }) => {
    if (!message) return null;

    const bgColor = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500';
    const borderColor = type === 'error' ? 'border-red-700' : type === 'success' ? 'border-green-700' : 'border-blue-700';

    return (
        <div className={`fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4`}>
            <div className={`relative ${bgColor} text-white p-6 rounded-lg shadow-xl border-t-4 ${borderColor} max-w-sm w-full`}>
                <p className="text-lg font-semibold text-center mb-4">{message}</p>
                <div className="flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white text-gray-800 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Loading Spinner Component ---
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
);

// --- Navbar Component ---
const Navbar = ({ navigate }) => {
    const { currentUser, isAdmin, logout, userId } = useContext(AuthContext);

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 shadow-lg rounded-b-xl mb-6">
            <div className="container mx-auto flex justify-between items-center flex-wrap">
                <div className="text-white text-2xl font-bold rounded-md px-3 py-1 bg-opacity-20 bg-white">
                    Job Portal
                </div>
                <div className="flex-grow flex justify-center mt-2 md:mt-0">
                    <div className="flex space-x-4">
                        <NavLink onClick={() => navigate('home')}>Home</NavLink>
                        {currentUser && isAdmin && <NavLink onClick={() => navigate('adminDashboard')}>Admin Dashboard</NavLink>}
                        {currentUser && !isAdmin && <NavLink onClick={() => navigate('userDashboard')}>User Dashboard</NavLink>}
                        {currentUser && !isAdmin && <NavLink onClick={() => navigate('browseJobs')}>Browse Jobs</NavLink>}
                        {currentUser && !isAdmin && <NavLink onClick={() => navigate('appliedJobs')}>Applied Jobs</NavLink>}
                    </div>
                </div>
                <div className="flex items-center space-x-4 mt-2 md:mt-0">
                    {currentUser ? (
                        <>
                            <span className="text-white text-sm opacity-80">
                                {isAdmin ? 'Admin' : 'User'} ({userId?.substring(0, 8)}...)
                            </span>
                            <button
                                onClick={logout}
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('login')}
                                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                Log in
                            </button>
                            <button
                                onClick={() => navigate('signup')}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                Sign up
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ onClick, children }) => (
    <button
        onClick={onClick}
        className="text-white text-lg font-medium px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition duration-300 ease-in-out"
    >
        {children}
    </button>
);


// --- Home Page ---
const HomePage = ({ navigate }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl p-8 shadow-inner">
            <h1 className="text-5xl font-extrabold text-gray-800 mb-6 text-center leading-tight">
                Welcome to Your <span className="text-blue-600">Dream Job Portal</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 text-center max-w-2xl">
                Discover exciting career opportunities and take the next step in your professional journey.
            </p>
            <div className="flex space-x-6">
                <button
                    onClick={() => navigate('login')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    Log In
                </button>
                <button
                    onClick={() => navigate('signup')}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300"
                >
                    Sign Up
                </button>
            </div>
            <div className="mt-12 text-gray-500 text-center">
                <p>&copy; 2024 ICT Academy of Kerala FSD Projects. All rights reserved.</p>
            </div>
        </div>
    );
};


// --- Login Page ---
const LoginPage = ({ navigate }) => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('info');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null); // Clear previous messages
        const result = login(email, password); // No await needed for in-memory auth
        if (result.success) {
            setMessage('Login successful!');
            setMessageType('success');
            setTimeout(() => navigate(email === 'admin@jobportal.com' ? 'adminDashboard' : 'userDashboard'), 1500);
        } else {
            setMessage(result.message);
            setMessageType('error');
        }
    };

    const closeMessage = () => setMessage(null);

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-lg"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-lg"
                            placeholder="********"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                        Log In
                    </button>
                </form>
                <p className="mt-8 text-center text-gray-600">
                    Don't have an account?{' '}
                    <button
                        onClick={() => navigate('signup')}
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition duration-200"
                    >
                        Sign Up
                    </button>
                </p>
            </div>
            <MessageBox message={message} type={messageType} onClose={closeMessage} />
        </div>
    );
};

// --- Signup Page ---
const SignupPage = ({ navigate }) => {
    const { signup } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('info');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null); // Clear previous messages
        const result = signup(email, password); // No await needed for in-memory auth
        if (result.success) {
            setMessage('Signup successful! Please log in.');
            setMessageType('success');
            setTimeout(() => navigate('login'), 1500);
        } else {
            setMessage(result.message);
            setMessageType('error');
        }
    };

    const closeMessage = () => setMessage(null);

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Sign Up</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-lg"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-lg"
                            placeholder="********"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="mt-8 text-center text-gray-600">
                    Already have an account?{' '}
                    <button
                        onClick={() => navigate('login')}
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition duration-200"
                    >
                        Log In
                    </button>
                </p>
            </div>
            <MessageBox message={message} type={messageType} onClose={closeMessage} />
        </div>
    );
};

// --- User Dashboard ---
const UserDashboard = ({ navigate }) => {
    const { currentUser, userId, isAdmin, loadingAuth } = useContext(AuthContext);

    if (loadingAuth) return <LoadingSpinner />;
    if (!currentUser || isAdmin) {
        return (
            <div className="text-center p-8 text-red-600 font-semibold">
                Access Denied. Please log in as a user.
                <button onClick={() => navigate('login')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Login</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-[calc(100vh-120px)] p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
                Welcome, <span className="text-blue-600">{currentUser.email}!</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl">
                Your user ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded text-sm break-all">{userId}</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                <DashboardCard title="Browse Jobs" description="Find new opportunities that match your skills." navigate={() => navigate('browseJobs')} icon="🔍" />
                <DashboardCard title="Applied Jobs" description="Review the status of your job applications." navigate={() => navigate('appliedJobs')} icon="📄" />
                {/* <DashboardCard title="Update Profile" description="Manage your personal and professional details." navigate={() => navigate('updateProfile')} icon="📝" /> */}
            </div>
            <p className="mt-12 text-gray-500 text-center">
                Explore the job market and advance your career today!
            </p>
        </div>
    );
};

const DashboardCard = ({ title, description, navigate, icon }) => (
    <div
        className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:translate-y-[-5px] transition-all duration-300 transform border border-gray-100"
        onClick={navigate}
    >
        <div className="text-5xl mb-4 p-3 bg-blue-100 rounded-full">{icon}</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

// --- Browse Jobs Page ---
const JobCard = ({ job, onApply, onEdit, onDelete, isAdmin, userAppliedJobIds }) => {
    const isApplied = userAppliedJobIds?.includes(job.id);
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] flex flex-col justify-between">
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{job.title}</h3>
                <p className="text-gray-700 mb-3 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                    {job.location} | <span className="ml-1 font-semibold text-blue-600">{job.jobType}</span>
                </p>
                <p className="text-gray-600 mb-4">{job.description}</p>
                <p className="text-gray-600 mb-4 font-semibold">Requirements: <span className="font-normal">{job.requirements}</span></p>
                <p className="text-green-700 font-bold mb-4">Salary: {job.salary}</p>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
                {isAdmin ? (
                    <>
                        <button
                            onClick={() => onEdit(job)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(job.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Delete
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => onApply(job)}
                        disabled={isApplied}
                        className={`py-2 px-6 rounded-lg font-semibold shadow-md transition duration-300 ease-in-out ${
                            isApplied ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
                        }`}
                    >
                        {isApplied ? 'Applied' : 'Apply Now'}
                    </button>
                )}
            </div>
        </div>
    );
};

const BrowseJobsPage = ({ navigate }) => {
    const { currentUser, userId, loadingAuth, isAdmin } = useContext(AuthContext);
    const { jobs, applyForJob } = useContext(DataContext);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [appliedJobIds, setAppliedJobIds] = useState([]); // Store IDs of jobs the user has applied for
    const [filterLocation, setFilterLocation] = useState('');
    const [filterType, setFilterType] = useState('');
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('info');

    // Simulate fetching all jobs and user's applied jobs
    useEffect(() => {
        setFilteredJobs(jobs); // Initialize filtered jobs with all jobs
        // In a real no-Firebase app, you'd load applied jobs from localStorage or similar
        // For this demo, let's assume appliedJobIds are tracked when applyForJob is called.
        // We'll update the appliedJobIds state based on calls to applyForJob.
    }, [jobs]); // Re-run when jobs data changes

    // Apply filters
    useEffect(() => {
        let currentJobs = jobs;

        if (filterLocation) {
            currentJobs = currentJobs.filter(job =>
                job.location.toLowerCase().includes(filterLocation.toLowerCase())
            );
        }
        if (filterType) {
            currentJobs = currentJobs.filter(job =>
                job.jobType.toLowerCase() === filterType.toLowerCase()
            );
        }
        setFilteredJobs(currentJobs);
    }, [filterLocation, filterType, jobs]);


    const handleApply = (job) => {
        if (!currentUser || !userId) {
            setMessage("Please log in to apply for jobs.");
            setMessageType("error");
            return;
        }

        if (isAdmin) {
            setMessage("Admins cannot apply for jobs.");
            setMessageType("error");
            return;
        }

        const result = applyForJob(job, currentUser.email, userId);
        if (result.success) {
            setMessage(result.message);
            setMessageType("success");
            // Update appliedJobIds locally
            setAppliedJobIds(prev => [...prev, job.id]);
        } else {
            setMessage(result.message);
            setMessageType("error");
        }
    };

    const closeMessage = () => setMessage(null);

    return (
        <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100 min-h-[calc(100vh-120px)]">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Browse Job Listings</h1>

            <div className="mb-8 flex flex-wrap gap-4 justify-center items-center p-4 bg-gray-50 rounded-lg shadow-inner">
                <input
                    type="text"
                    placeholder="Filter by Location"
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
                >
                    <option value="">All Job Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                </select>
                <button
                    onClick={() => { setFilterLocation(''); setFilterType(''); }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 shadow-sm"
                >
                    Clear Filters
                </button>
            </div>

            {filteredJobs.length === 0 ? (
                <p className="text-center text-gray-600 text-lg py-10">No jobs found matching your criteria.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.map(job => (
                        <JobCard
                            key={job.id}
                            job={job}
                            onApply={handleApply}
                            isAdmin={isAdmin}
                            userAppliedJobIds={appliedJobIds}
                            // onEdit and onDelete are not passed as admin won't be on this page typically
                        />
                    ))}
                </div>
            )}
            <MessageBox message={message} type={messageType} onClose={closeMessage} />
        </div>
    );
};

// --- Applied Jobs Page (User View) ---
const AppliedJobsPage = ({ navigate }) => {
    const { currentUser, userId, loadingAuth, isAdmin } = useContext(AuthContext);
    const { applications } = useContext(DataContext);
    const [userApplications, setUserApplications] = useState([]);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('info');

    useEffect(() => {
        if (!loadingAuth && currentUser && userId && !isAdmin) {
            // Filter applications relevant to the current user
            setUserApplications(applications.filter(app => app.userId === userId));
        } else if (!loadingAuth && (!currentUser || isAdmin)) {
             setMessage("Please log in as a user to view applied jobs.");
             setMessageType("error");
             setTimeout(() => navigate('login'), 1500);
        }
    }, [loadingAuth, currentUser, userId, isAdmin, navigate, applications]);

    const closeMessage = () => setMessage(null);

    if (loadingAuth) return <LoadingSpinner />;
    if (!currentUser || isAdmin) return null; // Message box will handle redirect

    return (
        <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100 min-h-[calc(100vh-120px)]">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">My Applied Jobs</h1>

            {userApplications.length === 0 ? (
                <p className="text-center text-gray-600 text-lg py-10">You haven't applied for any jobs yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userApplications.map(app => (
                        <div key={app.id} className="bg-gray-50 rounded-xl shadow-md p-6 border border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{app.jobTitle}</h3>
                            <p className="text-gray-600 text-sm">
                                Applied On: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}
                            </p>
                            <p className="text-gray-700 mt-3">Job ID: <span className="font-mono text-xs bg-gray-200 px-1 py-0.5 rounded">{app.jobId}</span></p>
                            <p className="text-blue-600 font-semibold mt-4">Status: Pending Review</p> {/* Simplified status */}
                        </div>
                    ))}
                </div>
            )}
            <MessageBox message={message} type={messageType} onClose={closeMessage} />
        </div>
    );
};


// --- Admin Dashboard ---
const AdminDashboard = ({ navigate }) => {
    const { currentUser, userId, isAdmin, loadingAuth } = useContext(AuthContext);

    if (loadingAuth) return <LoadingSpinner />;
    if (!currentUser || !isAdmin) {
        return (
            <div className="text-center p-8 text-red-600 font-semibold">
                Access Denied. Please log in as an admin.
                <button onClick={() => navigate('login')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Login</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-[calc(100vh-120px)] p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-lg">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
                Admin Dashboard - <span className="text-red-600">{currentUser.email}</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl">
                Your admin ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded text-sm break-all">{userId}</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                <DashboardCard title="Manage Jobs" description="Add, edit, or delete job listings." navigate={() => navigate('manageJobs')} icon="💼" />
                <DashboardCard title="View User Applications" description="Review all applications submitted by users." navigate={() => navigate('viewApplications')} icon="📋" />
            </div>
            <p className="mt-12 text-gray-500 text-center">
                Efficiently manage the job portal content and user applications.
            </p>
        </div>
    );
};

// --- Manage Jobs Page (Admin View) ---
const ManageJobsPage = ({ navigate }) => {
    const { currentUser, userId, isAdmin, loadingAuth } = useContext(AuthContext);
    const { jobs, addJob, updateJob, deleteJob } = useContext(DataContext);
    const [editingJob, setEditingJob] = useState(null); // null for add, object for edit
    const [jobForm, setJobForm] = useState({ title: '', description: '', requirements: '', location: '', salary: '', jobType: 'Full-time' });
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('info');

    useEffect(() => {
        // No async data fetching here, jobs are from DataContext
        if (!loadingAuth && (!currentUser || !isAdmin)) {
            setMessage("Access Denied. Please log in as an admin to manage jobs.");
            setMessageType("error");
            setTimeout(() => navigate('login'), 1500);
        }
    }, [loadingAuth, currentUser, userId, isAdmin, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage(null);
        try {
            if (editingJob) {
                updateJob(jobForm);
                setMessage("Job updated successfully!");
                setMessageType("success");
            } else {
                addJob(jobForm);
                setMessage("Job added successfully!");
                setMessageType("success");
            }
            setJobForm({ title: '', description: '', requirements: '', location: '', salary: '', jobType: 'Full-time' }); // Clear form
            setEditingJob(null); // Exit editing mode
        } catch (error) {
            console.error("Error saving job:", error);
            setMessage(`Failed to save job: ${error.message}`);
            setMessageType("error");
        }
    };

    const handleEdit = (job) => {
        setEditingJob(job);
        setJobForm(job); // Populate form with job data
    };

    const handleDelete = (jobId) => {
        setMessage(null);
        try {
            deleteJob(jobId);
            setMessage("Job deleted successfully!");
            setMessageType("success");
        } catch (error) {
            console.error("Error deleting job:", error);
            setMessage(`Failed to delete job: ${error.message}`);
            setMessageType("error");
        }
    };

    const closeMessage = () => setMessage(null);

    if (loadingAuth) return <LoadingSpinner />;
    if (!currentUser || !isAdmin) return null; // Message box will handle redirect

    return (
        <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100 min-h-[calc(100vh-120px)]">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Manage Job Listings</h1>

            {/* Job Add/Edit Form */}
            <div className="bg-gray-50 p-8 rounded-xl shadow-inner mb-10 border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    {editingJob ? 'Edit Job' : 'Add New Job'}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={jobForm.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={jobForm.location}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={jobForm.description}
                            onChange={handleChange}
                            rows="4"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                        <textarea
                            id="requirements"
                            name="requirements"
                            value={jobForm.requirements}
                            onChange={handleChange}
                            rows="3"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                        <input
                            type="text"
                            id="salary"
                            name="salary"
                            value={jobForm.salary}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                        <select
                            id="jobType"
                            name="jobType"
                            value={jobForm.jobType}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>
                    <div className="md:col-span-2 flex justify-center space-x-4 mt-4">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            {editingJob ? 'Update Job' : 'Add Job'}
                        </button>
                        {editingJob && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingJob(null);
                                    setJobForm({ title: '', description: '', requirements: '', location: '', salary: '', jobType: 'Full-time' });
                                }}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Existing Job Listings */}
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Existing Job Listings</h2>
            {jobs.length === 0 ? (
                <p className="text-center text-gray-600 text-lg py-10">No job listings available.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map(job => (
                        <JobCard
                            key={job.id}
                            job={job}
                            isAdmin={true}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
            <MessageBox message={message} type={messageType} onClose={closeMessage} />
        </div>
    );
};

// --- View User Applications Page (Admin View) ---
const ViewApplicationsPage = ({ navigate }) => {
    const { currentUser, userId, isAdmin, loadingAuth } = useContext(AuthContext);
    const { applications } = useContext(DataContext);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('info');

    useEffect(() => {
        if (!loadingAuth && (!currentUser || !isAdmin)) {
            setMessage("Access Denied. Please log in as an admin to view applications.");
            setMessageType("error");
            setTimeout(() => navigate('login'), 1500);
        }
    }, [loadingAuth, currentUser, userId, isAdmin, navigate]);

    const closeMessage = () => setMessage(null);

    if (loadingAuth) return <LoadingSpinner />;
    if (!currentUser || !isAdmin) return null; // Message box will handle redirect

    return (
        <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100 min-h-[calc(100vh-120px)]">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">All User Applications</h1>

            {applications.length === 0 ? (
                <p className="text-center text-gray-600 text-lg py-10">No applications have been submitted yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {applications.map(app => (
                        <div key={app.id} className="bg-blue-50 rounded-xl shadow-md p-6 border border-blue-200">
                            <h3 className="text-xl font-bold text-blue-800 mb-2">{app.jobTitle}</h3>
                            <p className="text-gray-700 text-sm">
                                Applicant: <span className="font-semibold">{app.userEmail}</span>
                            </p>
                            <p className="text-gray-600 text-sm mb-3">
                                User ID: <span className="font-mono text-xs bg-gray-200 px-1 py-0.5 rounded break-all">{app.userId}</span>
                            </p>
                            <p className="text-gray-600 text-sm">
                                Applied On: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'short', day: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                }) : 'N/A'}
                            </p>
                            <p className="text-green-700 font-semibold mt-4">Status: New Application</p> {/* Simplified status */}
                        </div>
                    ))}
                </div>
            )}
            <MessageBox message={message} type={messageType} onClose={closeMessage} />
        </div>
    );
};

// --- AppContent Component to be wrapped by AuthProvider and DataProvider ---
const AppContent = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const { loadingAuth } = useContext(AuthContext);

    const navigate = (page) => {
        setCurrentPage(page);
    };

    if (loadingAuth) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <LoadingSpinner />
            </div>
        );
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage navigate={navigate} />;
            case 'login':
                return <LoginPage navigate={navigate} />;
            case 'signup':
                return <SignupPage navigate={navigate} />;
            case 'userDashboard':
                return <UserDashboard navigate={navigate} />;
            case 'browseJobs':
                return <BrowseJobsPage navigate={navigate} />;
            case 'appliedJobs':
                return <AppliedJobsPage navigate={navigate} />;
            case 'adminDashboard':
                return <AdminDashboard navigate={navigate} />;
            case 'manageJobs':
                return <ManageJobsPage navigate={navigate} />;
            case 'viewApplications':
                return <ViewApplicationsPage navigate={navigate} />;
            default:
                return <HomePage navigate={navigate} />;
        }
    };

    return (
        <>
            <Navbar navigate={navigate} />
            <main className="p-4 md:p-8">
                {renderPage()}
            </main>
        </>
    );
};

// --- Main App Component ---
const App = () => {
    // Dynamically load Tailwind CSS and Google Fonts
    useEffect(() => {
        // Load Tailwind CSS
        const tailwindScript = document.createElement('script');
        tailwindScript.src = 'https://cdn.tailwindcss.com';
        tailwindScript.async = true;
        document.head.appendChild(tailwindScript);

        // Load Inter font from Google Fonts
        const interFontLink = document.createElement('link');
        interFontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
        interFontLink.rel = 'stylesheet';
        document.head.appendChild(interFontLink);

        // Clean up on component unmount (optional but good practice)
        return () => {
            document.head.removeChild(tailwindScript);
            document.head.removeChild(interFontLink);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
            {React.Children.toArray([
                <style key="global-styles">
                    {`
                    body {
                        font-family: 'Inter', sans-serif;
                    }
                    /* Custom scrollbar for better aesthetics */
                    ::-webkit-scrollbar {
                        width: 8px;
                        height: 8px;
                    }
                    ::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 10px;
                    }
                    ::-webkit-scrollbar-thumb {
                        background: #888;
                        border-radius: 10px;
                    }
                    ::-webkit-scrollbar-thumb:hover {
                        background: #555;
                    }
                    /* Basic responsive adjustments if needed beyond Tailwind */
                    @media (max-width: 768px) {
                        .container {
                            padding-left: 1rem;
                            padding-right: 1rem;
                        }
                    }
                    `}
                </style>
            ])}
            {/* AuthProvider and DataProvider now wrap AppContent */}
            <AuthProvider>
                <DataProvider>
                    <AppContent />
                </DataProvider>
            </AuthProvider>
        </div>
    );
};

export default App;
