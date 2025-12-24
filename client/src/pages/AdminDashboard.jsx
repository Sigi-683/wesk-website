import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { HomeIcon, ArrowRightOnRectangleIcon, UserGroupIcon, HomeModernIcon, CheckCircleIcon, XCircleIcon, ShieldCheckIcon, DocumentArrowUpIcon, TrashIcon } from '@heroicons/react/24/outline';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const [chalets, setChalets] = useState([]);
    const [users, setUsers] = useState([]);
    const [allowedUsers, setAllowedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('chalets');

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newChalet, setNewChalet] = useState({ name: '', description: '', capacity: 6 });
    const [chaletImage, setChaletImage] = useState(null);

    const [newAllowedEmail, setNewAllowedEmail] = useState('');
    const [importing, setImporting] = useState(false);

    const fetchData = async () => {
        try {
            const [chaletRes, userRes] = await Promise.all([
                api.get('/chalets'),
                api.get('/users')
            ]);
            setChalets(chaletRes.data);
            setUsers(userRes.data);

            // Fetch whitelist only if on that tab to save resources (optional, but good practice)
            // But for simplicity let's fetch it if we can or just when switching tabs.
            // Let's lazy load it or just load it here safely.
            try {
                const allowedRes = await api.get('/allowed-users');
                setAllowedUsers(allowedRes.data);
            } catch (err) {
                console.error("Could not fetch whitelist", err);
            }

            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateChalet = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newChalet.name);
            formData.append('description', newChalet.description);
            formData.append('capacity', newChalet.capacity);
            if (chaletImage) {
                formData.append('image', chaletImage);
            }

            await api.post('/chalets', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowCreateModal(false);
            setNewChalet({ name: '', description: '', capacity: 6 });
            setChaletImage(null);
            fetchData();
            alert('Chalet créé avec succès');
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la création du chalet');
        }
    };

    const handleDeleteChalet = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce chalet ?')) return;
        try {
            await api.delete(`/chalets/${id}`);
            fetchData();
        } catch (error) {
            alert('Suppression échouée');
        }
    };

    const handleToggleFlag = async (userId, flag, currentValue) => {
        try {
            await api.put(`/users/${userId}`, { [flag]: !currentValue });
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Mise à jour échouée');
        }
    };

    const handleChaletChange = async (userId, chaletId) => {
        try {
            // Convert string to integer or null
            const payload = chaletId ? parseInt(chaletId) : null;
            await api.put(`/users/${userId}`, { ChaletId: payload });
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Mise à jour du chalet échouée');
        }
    };

    // --- Allowed Users Logic ---

    const handleAddAllowedUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/allowed-users', { email: newAllowedEmail });
            setNewAllowedEmail('');
            fetchData();
            alert('Utilisateur ajouté à la whitelist');
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur lors de l\'ajout');
        }
    };

    const handleDeleteAllowedUser = async (id) => {
        if (!confirm("Supprimer cet email de la whitelist ?")) return;
        try {
            await api.delete(`/allowed-users/${id}`);
            fetchData();
        } catch (error) {
            alert('Erreur lors de la suppression');
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const csvContent = event.target.result;
            setImporting(true);
            try {
                const res = await api.post('/allowed-users/import', { csvContent });
                alert(`Import terminé : ${res.data.added} ajoutés, ${res.data.skipped} ignorés.`);
                fetchData();
            } catch (error) {
                alert('Erreur lors de l\'import');
                console.error(error);
            } finally {
                setImporting(false);
                e.target.value = null; // Reset file input
            }
        };
        reader.readAsText(file);
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-ice-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-ski-accent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ice-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
                <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                    <img src="/logo.png" className="h-8 w-8" alt="Logo" />
                    <span className="font-bold text-xl tracking-wider">WESK Admin</span>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('chalets')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'chalets' ? 'bg-ski-accent text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <HomeModernIcon className="h-5 w-5" />
                        Chalets
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-ski-accent text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <UserGroupIcon className="h-5 w-5" />
                        Utilisateurs
                    </button>
                    <button
                        onClick={() => setActiveTab('whitelist')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'whitelist' ? 'bg-ski-accent text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <ShieldCheckIcon className="h-5 w-5" />
                        Whitelist
                    </button>
                    <div className="my-4 border-t border-slate-800"></div>
                    <Link to="/dashboard" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                        <HomeIcon className="h-5 w-5" />
                        Vue Utilisateur
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors">
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 flex justify-between items-center md:hidden">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" className="h-8 w-8" alt="Logo" />
                            <span className="font-bold text-xl text-slate-900">Admin</span>
                        </div>
                        <button onClick={logout} className="text-slate-500"><ArrowRightOnRectangleIcon className="h-6 w-6" /></button>
                    </div>

                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                {activeTab === 'chalets' && 'Gestion des Chalets'}
                                {activeTab === 'users' && 'Gestion des Utilisateurs'}
                                {activeTab === 'whitelist' && 'Whitelist Inscriptions'}
                            </h1>
                            <p className="text-slate-500 mt-2">Aperçu et gestion de l'événement.</p>
                        </div>
                        {activeTab === 'chalets' && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="btn btn-primary flex items-center gap-2"
                            >
                                <span>+ Nouveau Chalet</span>
                            </button>
                        )}
                        {activeTab === 'whitelist' && (
                            <div className="flex gap-2">
                                <label className={`btn bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-2 ${importing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <DocumentArrowUpIcon className="h-5 w-5" />
                                    <span>{importing ? 'Import...' : 'Importer CSV'}</span>
                                    <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} disabled={importing} />
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Create Chalet Modal */}
                    {showCreateModal && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-fade-in-up">
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">Ajouter un Chalet</h2>
                                <form onSubmit={handleCreateChalet} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Nom du Chalet</label>
                                        <input
                                            type="text"
                                            required
                                            value={newChalet.name}
                                            onChange={e => setNewChalet({ ...newChalet, name: e.target.value })}
                                            className="w-full rounded-lg border-slate-300 focus:ring-ski-accent focus:border-ski-accent"
                                            placeholder="Ex: Le Montana"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                        <textarea
                                            value={newChalet.description}
                                            onChange={e => setNewChalet({ ...newChalet, description: e.target.value })}
                                            className="w-full rounded-lg border-slate-300 focus:ring-ski-accent focus:border-ski-accent"
                                            rows="3"
                                            placeholder="Description courte..."
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Image du Chalet</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => setChaletImage(e.target.files[0])}
                                            className="w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-ski-accent file:text-white hover:file:bg-ski-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Capacité</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={newChalet.capacity}
                                            onChange={e => setNewChalet({ ...newChalet, capacity: parseInt(e.target.value) })}
                                            className="w-full rounded-lg border-slate-300 focus:ring-ski-accent focus:border-ski-accent"
                                        />
                                    </div>
                                    <div className="flex gap-3 justify-end mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateModal(false)}
                                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary px-4 py-2"
                                        >
                                            Créer
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Content Area */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        {activeTab === 'chalets' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Nom</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Capacité</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Occupants</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {chalets.map(chalet => (
                                            <tr key={chalet.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900">{chalet.name}</td>
                                                <td className="px-6 py-4 text-slate-600">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(chalet.Users?.length || 0) >= chalet.capacity
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {chalet.Users?.length || 0} / {chalet.capacity}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                                                    {chalet.Users?.map(u => u.email).join(', ') || <span className="text-slate-400 italic">Vide</span>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleDeleteChalet(chalet.id)}
                                                        className="text-red-600 hover:text-red-800 font-medium hover:underline"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Email</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Caution</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Décharge</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Chalet</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {users.map(user => (
                                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900">
                                                    {user.email}
                                                    {user.isAdmin && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">Admin</span>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleToggleFlag(user.id, 'cautionGiven', user.cautionGiven)}
                                                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${user.cautionGiven
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                                            }`}
                                                    >
                                                        {user.cautionGiven ? <CheckCircleIcon className="h-4 w-4" /> : <XCircleIcon className="h-4 w-4" />}
                                                        {user.cautionGiven ? 'reçue' : 'en attente'}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleToggleFlag(user.id, 'waiverGiven', user.waiverGiven)}
                                                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${user.waiverGiven
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                                            }`}
                                                    >
                                                        {user.waiverGiven ? <CheckCircleIcon className="h-4 w-4" /> : <XCircleIcon className="h-4 w-4" />}
                                                        {user.waiverGiven ? 'signée' : 'en attente'}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={user.ChaletId || ''}
                                                        onChange={(e) => handleChaletChange(user.id, e.target.value)}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-ski-accent focus:ring-ski-accent sm:text-xs py-1"
                                                    >
                                                        <option value="">Aucun Chalet</option>
                                                        {chalets.map(chalet => (
                                                            <option key={chalet.id} value={chalet.id}>
                                                                {chalet.name} ({chalet.Users?.length || 0}/{chalet.capacity})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'whitelist' && (
                            <div className="p-6">
                                <div className="mb-6 flex gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Ajouter manuellement une adresse email</label>
                                        <input
                                            type="email"
                                            value={newAllowedEmail}
                                            onChange={(e) => setNewAllowedEmail(e.target.value)}
                                            placeholder="exemple@email.com"
                                            className="w-full rounded-lg border-slate-300 focus:ring-ski-accent focus:border-ski-accent"
                                        />
                                    </div>
                                    <button
                                        onClick={handleAddAllowedUser}
                                        disabled={!newAllowedEmail}
                                        className="btn btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Ajouter
                                    </button>
                                </div>

                                <div className="overflow-x-auto border rounded-xl border-slate-200">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-4 font-semibold text-slate-700">Email autorisé</th>
                                                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {allowedUsers.map(u => (
                                                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-slate-900">
                                                        {u.email}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => handleDeleteAllowedUser(u.id)}
                                                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {allowedUsers.length === 0 && (
                                                <tr>
                                                    <td colSpan="2" className="px-6 py-8 text-center text-slate-400">
                                                        Aucun email dans la whitelist
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
