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
        if (email === 'admin@jobsy.com' && password === 'password123') { // Updated admin email
            setCurrentUser({ email: 'admin@jobsy.com' });
            setUserId('admin-id-123');
            setIsAdmin(true);
            localStorage.setItem('currentUser', JSON.stringify({ email: 'admin@jobsy.com' }));
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
        if (email === 'admin@jobsy.com') { // Updated admin email check
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
    // Initial dummy data for jobs - Increased job offers
    const [jobs, setJobs] = useState([
        { id: 'job1', title: 'Senior React Developer', description: 'Experienced React dev for challenging projects. Build scalable web applications.', requirements: '5+ years React, Redux, Node.js, GraphQL', location: 'Remote', salary: '$120,000 - $150,000', jobType: 'Full-time', createdAt: new Date('2024-01-15T10:00:00Z') },
        { id: 'job2', title: 'UI/UX Designer', description: 'Creative designer with a passion for user-centered design. Develop intuitive interfaces.', requirements: 'Portfolio, Figma, Adobe XD, Prototyping', location: 'New York', salary: '$80,000 - $100,000', jobType: 'Full-time', createdAt: new Date('2024-01-20T11:30:00Z') },
        { id: 'job3', title: 'Part-time Content Writer', description: 'Write engaging content for our blog and social media. Research industry trends.', requirements: 'Excellent writing skills, SEO knowledge, HubSpot', location: 'Remote', salary: '$30 - $40/hour', jobType: 'Part-time', createdAt: new Date('2024-02-01T09:00:00Z') },
        { id: 'job4', title: 'Data Scientist Intern', description: 'Assist in data analysis and model building. Work with large datasets.', requirements: 'Python, SQL, basic ML knowledge, Statistics', location: 'Bangalore', salary: '$2,000/month', jobType: 'Internship', createdAt: new Date('2024-02-10T14:15:00Z') },
        { id: 'job5', title: 'Senior Backend Engineer (Node.js)', description: 'Design and implement robust backend services and APIs.', requirements: '7+ years Node.js, Express, MongoDB, AWS', location: 'London', salary: '$130,000 - $160,000', jobType: 'Full-time', createdAt: new Date('2024-02-20T16:00:00Z') },
        { id: 'job6', title: 'Mobile App Developer (Flutter)', description: 'Develop cross-platform mobile applications for iOS and Android.', requirements: '3+ years Flutter, Dart, Firebase, REST APIs', location: 'Berlin', salary: '$90,000 - $110,000', jobType: 'Full-time', createdAt: new Date('2024-03-01T10:45:00Z') },
        { id: 'job7', title: 'Product Manager', description: 'Define product vision, strategy, and roadmap. Work closely with engineering and design.', requirements: '5+ years Product Management, Agile, SaaS experience', location: 'San Francisco', salary: '$140,000 - $170,000', jobType: 'Full-time', createdAt: new Date('2024-03-10T13:00:00Z') },
        { id: 'job8', title: 'DevOps Engineer', description: 'Automate deployment, scaling, and management of applications.', requirements: 'Kubernetes, Docker, CI/CD, Azure/GCP', location: 'Remote', salary: '$110,000 - $140,000', jobType: 'Full-time', createdAt: new Date('2024-03-15T09:30:00Z') },
        { id: 'job9', title: 'Digital Marketing Specialist', description: 'Plan and execute all digital marketing, including SEO/SEM, email, social media.', requirements: '3+ years Digital Marketing, Google Analytics, Content Strategy', location: 'Sydney', salary: '$75,000 - $95,000', jobType: 'Full-time', createdAt: new Date('2024-04-01T11:00:00Z') },
        { id: 'job10', title: 'Customer Support Representative', description: 'Provide excellent customer service and technical support to users.', requirements: 'Strong communication skills, problem-solving, empathy', location: 'Dublin', salary: '$40,000 - $50,000', jobType: 'Full-time', createdAt: new Date('2024-04-05T14:00:00Z') },
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-100"></div>
    </div>
);

// --- Navbar Component ---
const Navbar = ({ navigate }) => {
    const { currentUser, isAdmin, logout, userId } = useContext(AuthContext);

    return (
        <nav className="bg-[#212121] p-4 shadow-lg rounded-b-xl mb-6 text-gray-100"> {/* Primary Dark Color */}
            <div className="container mx-auto flex justify-between items-center flex-wrap">
                <div className="text-[#004D40] text-2xl font-bold rounded-md px-3 py-1 bg-opacity-20 bg-white"> {/* Secondary Dark Accent */}
                    Jobsy.com
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
                            <span className="text-gray-300 text-sm opacity-80">
                                {isAdmin ? 'Admin' : 'User'} ({userId?.substring(0, 8)}...)
                            </span>
                            <button
                                onClick={logout}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('login')}
                                className="bg-[#34495E] hover:bg-[#2C3E50] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                Log in
                            </button>
                            <button
                                onClick={() => navigate('signup')}
                                className="bg-[#AA00FF] hover:bg-[#8800CC] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
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
        className="text-gray-100 text-lg font-medium px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition duration-300 ease-in-out"
    >
        {children}
    </button>
);


// --- Home Page ---
const HomePage = ({ navigate }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] bg-[#212121] text-gray-100 rounded-xl p-8 shadow-inner"> {/* Primary Dark Color */}
            <h1 className="text-5xl font-extrabold text-gray-100 mb-6 text-center leading-tight">
                Welcome to <span className="text-[#004D40]">Jobsy.com</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 text-center max-w-2xl">
                Discover exciting career opportunities and take the next step in your professional journey.
            </p>
            <div className="flex space-x-6 mb-12">
                <button
                    onClick={() => navigate('login')}
                    className="bg-[#34495E] hover:bg-[#2C3E50] text-white font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#5D6D7E]"
                >
                    Log In
                </button>
                <button
                    onClick={() => navigate('signup')}
                    className="bg-[#AA00FF] hover:bg-[#8800CC] text-white font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#E0B1FF]"
                >
                    Sign Up
                </button>
            </div>

            {/* Section for company features */}
            <div className="w-full max-w-4xl text-center">
                <h2 className="text-3xl font-bold text-gray-100 mb-6">Why Choose Jobsy.com?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="bg-[#333333] p-6 rounded-xl shadow-md border border-gray-700 flex flex-col items-center text-center"> {/* Slightly lighter dark background for cards */}
                        <span className="text-5xl mb-4 text-[#004D40]">🚀</span> {/* Secondary Dark Accent */}
                        <h3 className="text-xl font-semibold text-gray-100 mb-2">Fast & Easy Applications</h3>
                        <p className="text-gray-300">Apply to your dream jobs in just a few clicks. Our streamlined process saves you time.</p>
                    </div>
                    <div className="bg-[#333333] p-6 rounded-xl shadow-md border border-gray-700 flex flex-col items-center text-center">
                        <span className="text-5xl mb-4 text-[#004D40]">🎯</span> {/* Secondary Dark Accent */}
                        <h3 className="text-xl font-semibold text-gray-100 mb-2">Personalized Job Matches</h3>
                        <p className="text-gray-300">Get recommendations tailored to your skills, experience, and preferences.</p>
                    </div>
                    <div className="bg-[#333333] p-6 rounded-xl shadow-md border border-gray-700 flex flex-col items-center text-center">
                        <span className="text-5xl mb-4 text-[#004D40]">💼</span> {/* Secondary Dark Accent */}
                        <h3 className="text-xl font-semibold text-gray-100 mb-2">Diverse Opportunities</h3>
                        <p className="text-gray-300">Explore a wide range of jobs from top companies across various industries.</p>
                    </div>
                </div>
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
            setTimeout(() => navigate(email === 'admin@jobsy.com' ? 'adminDashboard' : 'userDashboard'), 1500); // Updated admin email check
        } else {
            setMessage(result.message);
            setMessageType('error');
        }
    };

    const closeMessage = () => setMessage(null);

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-[#1A1A1A] p-4"> {/* Overall body background */}
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:border-[#004D40] transition duration-200 text-lg"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:border-[#004D40] transition duration-200 text-lg"
                            placeholder="********"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#34495E] hover:bg-[#2C3E50] text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#5D6D7E]"
                    >
                        Log In
                    </button>
                </form>
                <p className="mt-8 text-center text-gray-600">
                    Don't have an account?{' '}
                    <button
                        onClick={() => navigate('signup')}
                        className="text-[#AA00FF] hover:text-[#8800CC] font-medium hover:underline transition duration-200"
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
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-[#1A1A1A] p-4"> {/* Overall body background */}
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:border-[#004D40] transition duration-200 text-lg"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:border-[#004D40] transition duration-200 text-lg"
                            placeholder="********"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#AA00FF] hover:bg-[#8800CC] text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#E0B1FF]"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="mt-8 text-center text-gray-600">
                    Already have an account?{' '}
                    <button
                        onClick={() => navigate('login')}
                        className="text-[#FFB300] hover:text-[#FF8F00] font-medium hover:underline transition duration-200"
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
    const { currentUser, userId, isAdmin, loadingAuth } = useContext(AuthContext); // Corrected context usage

    if (loadingAuth) return <LoadingSpinner />;
    if (!currentUser || isAdmin) {
        return (
            <div className="text-center p-8 text-red-600 font-semibold bg-[#1A1A1A] text-gray-100 min-h-[calc(100vh-120px)] rounded-xl">
                Access Denied. Please log in as a user.
                <button onClick={() => navigate('login')} className="mt-4 px-4 py-2 bg-[#34495E] text-white rounded-md">Login</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-[calc(100vh-120px)] p-6 bg-[#212121] text-gray-100 rounded-xl shadow-lg"> {/* Primary Dark Color */}
            <h1 className="text-4xl font-extrabold text-gray-100 mb-6 text-center">
                Welcome, <span className="text-[#004D40]">{currentUser.email}!</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 text-center max-w-2xl">
                Your user ID: <span className="font-mono bg-gray-700 px-2 py-1 rounded text-sm break-all">{userId}</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                <DashboardCard title="Browse Jobs" description="Find new opportunities that match your skills." navigate={() => navigate('browseJobs')} icon="🔍" />
                <DashboardCard title="Applied Jobs" description="Review the status of your job applications." navigate={() => navigate('appliedJobs')} icon="📄" />
                {/* <DashboardCard title="Update Profile" description="Manage your personal and professional details." navigate={() => navigate('updateProfile')} icon="📝" /> */}
            </div>
            <p className="mt-12 text-gray-400 text-center">
                Explore the job market and advance your career today!
            </p>
        </div>
    );
};

const DashboardCard = ({ title, description, navigate, icon }) => (
    <div
        className="bg-[#333333] text-gray-100 rounded-xl shadow-lg p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:translate-y-[-5px] transition-all duration-300 transform border border-gray-700"
        onClick={navigate}
    >
        <div className="text-5xl mb-4 p-3 bg-[#004D40] rounded-full text-white">{icon}</div> {/* Secondary Dark Accent */}
        <h3 className="text-2xl font-bold text-gray-100 mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
    </div>
);

// --- Browse Jobs Page ---
const JobCard = ({ job, onApply, onEdit, onDelete, isAdmin, userAppliedJobIds }) => {
    const isApplied = userAppliedJobIds?.includes(job.id);
    return (
        <div className="bg-[#333333] text-gray-100 rounded-xl shadow-lg p-6 mb-6 border border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] flex flex-col justify-between">
            <div>
                <h3 className="text-2xl font-bold text-gray-100 mb-2">{job.title}</h3>
                <p className="text-gray-300 mb-3 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1 text-[#004D40]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                    {job.location} | <span className="ml-1 font-semibold text-[#004D40]">{job.jobType}</span> {/* Secondary Dark Accent */}
                </p>
                <p className="text-gray-300 mb-4">{job.description}</p>
                <p className="text-gray-300 mb-4 font-semibold">Requirements: <span className="font-normal">{job.requirements}</span></p>
                <p className="text-green-500 font-bold mb-4">Salary: {job.salary}</p>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
                {isAdmin ? (
                    <>
                        <button
                            onClick={() => onEdit(job)}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(job.id)}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Delete
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => onApply(job)}
                        disabled={isApplied}
                        className={`py-2 px-6 rounded-lg font-semibold shadow-md transition duration-300 ease-in-out ${
                            isApplied ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-[#004D40] hover:bg-[#00695C] text-white transform hover:scale-105'
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
        <div className="container mx-auto p-6 bg-[#212121] text-gray-100 rounded-xl shadow-lg border border-gray-700 min-h-[calc(100vh-120px)]"> {/* Primary Dark Color */}
            <h1 className="text-4xl font-extrabold text-gray-100 mb-8 text-center">Browse Job Listings</h1>

            <div className="mb-8 flex flex-wrap gap-4 justify-center items-center p-4 bg-[#333333] rounded-lg shadow-inner border border-gray-700"> {/* Slightly lighter dark background */}
                <input
                    type="text"
                    placeholder="Filter by Location"
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="flex-1 min-w-[200px] px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D40] bg-gray-800 text-gray-100 placeholder-gray-400"
                />
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="flex-1 min-w-[200px] px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D40] bg-gray-800 text-gray-100"
                >
                    <option value="">All Job Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                </select>
                <button
                    onClick={() => { setFilterLocation(''); setFilterType(''); }}
                    className="px-6 py-2 bg-gray-700 text-gray-100 rounded-lg hover:bg-gray-600 transition duration-200 shadow-sm"
                >
                    Clear Filters
                </button>
            </div>

            {filteredJobs.length === 0 ? (
                <p className="text-center text-gray-400 text-lg py-10">No jobs found matching your criteria.</p>
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
        <div className="container mx-auto p-6 bg-[#212121] text-gray-100 rounded-xl shadow-lg border border-gray-700 min-h-[calc(100vh-120px)]"> {/* Primary Dark Color */}
            <h1 className="text-4xl font-extrabold text-gray-100 mb-8 text-center">My Applied Jobs</h1>

            {userApplications.length === 0 ? (
                <p className="text-center text-gray-400 text-lg py-10">You haven't applied for any jobs yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userApplications.map(app => (
                        <div key={app.id} className="bg-[#333333] rounded-xl shadow-md p-6 border border-gray-700 text-gray-100"> {/* Slightly lighter dark background */}
                            <h3 className="text-xl font-bold text-gray-100 mb-2">{app.jobTitle}</h3>
                            <p className="text-gray-300 text-sm">
                                Applicant: <span className="font-semibold">{app.userEmail}</span>
                            </p>
                            <p className="text-gray-300 text-sm mb-3">
                                User ID: <span className="font-mono text-xs bg-gray-700 px-1 py-0.5 rounded break-all">{app.userId}</span>
                            </p>
                            <p className="text-gray-300 text-sm">
                                Applied On: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'short', day: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                }) : 'N/A'}
                            </p>
                            <p className="text-[#004D40] font-semibold mt-4">Status: Pending Review</p> {/* Secondary Dark Accent */}
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
            <div className="text-center p-8 text-red-600 font-semibold bg-[#1A1A1A] text-gray-100 min-h-[calc(100vh-120px)] rounded-xl">
                Access Denied. Please log in as an admin.
                <button onClick={() => navigate('login')} className="mt-4 px-4 py-2 bg-[#34495E] text-white rounded-md">Login</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-[calc(100vh-120px)] p-6 bg-[#212121] text-gray-100 rounded-xl shadow-lg"> {/* Primary Dark Color */}
            <h1 className="text-4xl font-extrabold text-gray-100 mb-6 text-center">
                Admin Dashboard - <span className="text-[#004D40]">{currentUser.email}</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 text-center max-w-2xl">
                Your admin ID: <span className="font-mono bg-gray-700 px-2 py-1 rounded text-sm break-all">{userId}</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                <DashboardCard title="Manage Jobs" description="Add, edit, or delete job listings." navigate={() => navigate('manageJobs')} icon="💼" />
                <DashboardCard title="View User Applications" description="Review all applications submitted by users." navigate={() => navigate('viewApplications')} icon="📋" />
            </div>
            <p className="mt-12 text-gray-400 text-center">
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
        <div className="container mx-auto p-6 bg-[#212121] text-gray-100 rounded-xl shadow-lg border border-gray-700 min-h-[calc(100vh-120px)]"> {/* Primary Dark Color */}
            <h1 className="text-4xl font-extrabold text-gray-100 mb-8 text-center">Manage Job Listings</h1>

            {/* Job Add/Edit Form */}
            <div className="bg-[#333333] p-8 rounded-xl shadow-inner mb-10 border border-gray-700"> {/* Slightly lighter dark background */}
                <h2 className="text-3xl font-bold text-gray-100 mb-6 text-center">
                    {editingJob ? 'Edit Job' : 'Add New Job'}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Job Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={jobForm.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D40] bg-gray-800 text-gray-100"
                        />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={jobForm.location}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D40] bg-gray-800 text-gray-100"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={jobForm.description}
                            onChange={handleChange}
                            rows="4"
                            required
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D40] bg-gray-800 text-gray-100"
                        ></textarea>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="requirements" className="block text-sm font-medium text-gray-300 mb-1">Requirements</label>
                        <textarea
                            id="requirements"
                            name="requirements"
                            value={jobForm.requirements}
                            onChange={handleChange}
                            rows="3"
                            required
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D40] bg-gray-800 text-gray-100"
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="salary" className="block text-sm font-medium text-gray-300 mb-1">Salary</label>
                        <input
                            type="text"
                            id="salary"
                            name="salary"
                            value={jobForm.salary}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D40] bg-gray-800 text-gray-100"
                        />
                    </div>
                    <div>
                        <label htmlFor="jobType" className="block text-sm font-medium text-gray-300 mb-1">Job Type</label>
                        <select
                            id="jobType"
                            name="jobType"
                            value={jobForm.jobType}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D40] bg-gray-800 text-gray-100"
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
                            className="bg-[#004D40] hover:bg-[#00695C] text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-700"
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
                                className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Existing Job Listings */}
            <h2 className="text-3xl font-bold text-gray-100 mb-6 text-center">Existing Job Listings</h2>
            {jobs.length === 0 ? (
                <p className="text-center text-gray-400 text-lg py-10">No job listings available.</p>
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
        <div className="container mx-auto p-6 bg-[#212121] text-gray-100 rounded-xl shadow-lg border border-gray-700 min-h-[calc(100vh-120px)]"> {/* Primary Dark Color */}
            <h1 className="text-4xl font-extrabold text-gray-100 mb-8 text-center">All User Applications</h1>

            {applications.length === 0 ? (
                <p className="text-center text-gray-400 text-lg py-10">No applications have been submitted yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {applications.map(app => (
                        <div key={app.id} className="bg-[#333333] rounded-xl shadow-md p-6 border border-gray-700 text-gray-100"> {/* Slightly lighter dark background */}
                            <h3 className="text-xl font-bold text-gray-100 mb-2">{app.jobTitle}</h3>
                            <p className="text-gray-300 text-sm">
                                Applicant: <span className="font-semibold">{app.userEmail}</span>
                            </p>
                            <p className="text-gray-300 text-sm mb-3">
                                User ID: <span className="font-mono text-xs bg-gray-700 px-1 py-0.5 rounded break-all">{app.userId}</span>
                            </p>
                            <p className="text-gray-300 text-sm">
                                Applied On: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'short', day: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                }) : 'N/A'}
                            </p>
                            <p className="text-[#004D40] font-semibold mt-4">Status: Pending Review</p> {/* Secondary Dark Accent */}
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
            <div className="flex items-center justify-center min-h-screen bg-[#1A1A1A]"> {/* Overall body background */}
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
        <div className="min-h-screen bg-[#1A1A1A] font-sans text-gray-100"> {/* Overall body background */}
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
                        background: #333333; /* Darker track */
                        border-radius: 10px;
                    }
                    ::-webkit-scrollbar-thumb {
                        background: #004D40; /* Teal thumb */
                        border-radius: 10px;
                    }
                    ::-webkit-scrollbar-thumb:hover {
                        background: #00695C; /* Darker teal on hover */
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
