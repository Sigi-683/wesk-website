import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-xl font-bold text-indigo-600">Ski Weekend</Link>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700 text-sm md:text-base">Hello, {user.email}</span>
                                {user.isAdmin && (
                                    <Link to="/admin" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={logout}
                                    className="text-gray-600 hover:text-gray-900 font-medium px-3 py-2 rounded-md text-sm"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium px-3 py-2 rounded-md text-sm">Log in</Link>
                                <Link to="/register" className="btn btn-primary px-4 py-2 text-sm">Sign up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="sm:hidden bg-white border-t border-gray-200">
                    <div className="pt-2 pb-3 space-y-1 px-2">
                        {user ? (
                            <>
                                <div className="px-3 py-2 text-base font-medium text-gray-500">
                                    Hello, {user.email}
                                </div>
                                {user.isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsOpen(false);
                                    }}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
