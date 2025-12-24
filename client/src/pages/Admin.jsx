import { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';

export default function Admin() {
    const [chalets, setChalets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingChalet, setEditingChalet] = useState(null);
    const [newChalet, setNewChalet] = useState({ name: '', description: '', capacity: 6 });

    const fetchChalets = async () => {
        try {
            const response = await api.get('/chalets');
            setChalets(response.data);
        } catch (error) {
            console.error('Error fetching chalets:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChalets();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this chalet?')) return;
        try {
            await api.delete(`/chalets/${id}`);
            fetchChalets();
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/chalets', newChalet);
            setNewChalet({ name: '', description: '', capacity: 6 });
            fetchChalets();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUnselect = async (id) => {
        if (!window.confirm('Force unselect this chalet?')) return;
        try {
            await api.post(`/chalets/${id}/unselect`);
            fetchChalets();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="py-10">
                <header>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold leading-tight text-gray-900">
                            Admin Dashboard
                        </h1>
                    </div>
                </header>
                <main>
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="px-4 py-8 sm:px-0 space-y-8">

                            {/* Create New Chalet Form */}
                            <div className="bg-white shadow sm:rounded-lg p-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add New Chalet</h3>
                                <form onSubmit={handleCreate} className="grid grid-cols-1 gap-y-6 sm:grid-cols-4 sm:gap-x-4 items-end">
                                    <div className="sm:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={newChalet.name}
                                            onChange={(e) => setNewChalet({ ...newChalet, name: e.target.value })}
                                            className="mt-1 input"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <input
                                            type="text"
                                            value={newChalet.description}
                                            onChange={(e) => setNewChalet({ ...newChalet, description: e.target.value })}
                                            className="mt-1 input"
                                        />
                                    </div>
                                    <div>
                                        <button type="submit" className="btn btn-primary w-full">Add</button>
                                    </div>
                                </form>
                            </div>

                            {/* Chalets List */}
                            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                                <ul className="divide-y divide-gray-200">
                                    {chalets.map((chalet) => (
                                        <li key={chalet.id}>
                                            <div className="px-4 py-4 sm:px-6">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-indigo-600 truncate">{chalet.name}</p>
                                                    <div className="ml-2 flex-shrink-0 flex">
                                                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${chalet.selectedBy ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                            {chalet.selectedBy ? `Taken by ${chalet.SelectedByUser?.email || 'Unknown'}` : 'Available'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-2 sm:flex sm:justify-between">
                                                    <div className="sm:flex">
                                                        <p className="flex items-center text-sm text-gray-500">
                                                            Capacity: {chalet.capacity}
                                                        </p>
                                                    </div>
                                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6 space-x-2">
                                                        {chalet.selectedBy && (
                                                            <button
                                                                onClick={() => handleUnselect(chalet.id)}
                                                                className="text-yellow-600 hover:text-yellow-900"
                                                            >
                                                                Force Free
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(chalet.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
