import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-indigo-600">Ski Weekend</span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700">Hello, {user.email}</span>
                                {user.isAdmin && (
                                    <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={logout}
                                    className="text-gray-600 hover:text-gray-900 font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Log in</Link>
                                <Link to="/register" className="btn btn-primary">Sign up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
