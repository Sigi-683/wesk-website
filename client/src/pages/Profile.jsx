import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, KeyIcon, UserIcon } from '@heroicons/react/24/outline';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(user);
    const [loading, setLoading] = useState(true);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/me');
                setProfile(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, []);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await api.post('/auth/change-password', { oldPassword, newPassword });
            setMessage('Mot de passe mis à jour avec succès');
            setOldPassword('');
            setNewPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-ice-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-ski-accent"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-ice-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <Link to="/dashboard" className="inline-flex items-center text-slate-500 hover:text-ski-600 transition-colors mb-4">
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Retour au Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">Mon Profil</h1>
                    <p className="text-slate-500 mt-2">Gérez vos informations personnelles et votre sécurité.</p>
                </div>

                <div className="grid gap-8">
                    {/* Info Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 bg-ice-100 rounded-full flex items-center justify-center text-ski-600">
                                <UserIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Informations</h2>
                                <p className="text-sm text-slate-500">Statut de votre dossier</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Adresse Email</label>
                            <div className="text-lg text-slate-900 font-medium">{profile.email}</div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className={`p-4 rounded-xl border ${profile.cautionGiven ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'} flex items-center gap-3`}>
                                {profile.cautionGiven ? (
                                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                                ) : (
                                    <XCircleIcon className="h-8 w-8 text-orange-500" />
                                )}
                                <div>
                                    <div className={`font-semibold ${profile.cautionGiven ? 'text-green-800' : 'text-orange-800'}`}>Caution</div>
                                    <div className={`text-sm ${profile.cautionGiven ? 'text-green-600' : 'text-orange-600'}`}>
                                        {profile.cautionGiven ? 'Reçue' : 'En attente'}
                                    </div>
                                </div>
                            </div>
                            <div className={`p-4 rounded-xl border ${profile.waiverGiven ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'} flex items-center gap-3`}>
                                {profile.waiverGiven ? (
                                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                                ) : (
                                    <XCircleIcon className="h-8 w-8 text-orange-500" />
                                )}
                                <div>
                                    <div className={`font-semibold ${profile.waiverGiven ? 'text-green-800' : 'text-orange-800'}`}>Décharge</div>
                                    <div className={`text-sm ${profile.waiverGiven ? 'text-green-600' : 'text-orange-600'}`}>
                                        {profile.waiverGiven ? 'Signée' : 'En attente'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Password Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 bg-ice-100 rounded-full flex items-center justify-center text-ski-600">
                                <KeyIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Sécurité</h2>
                                <p className="text-sm text-slate-500">Mettre à jour votre mot de passe</p>
                            </div>
                        </div>

                        {message && (
                            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded">
                                {message}
                            </div>
                        )}
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe actuel</label>
                                <input
                                    type="password"
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-ski-accent focus:ring-ski-accent sm:text-sm px-4 py-2 border"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-ski-accent focus:ring-ski-accent sm:text-sm px-4 py-2 border"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="pt-2">
                                <button type="submit" className="btn btn-primary w-full sm:w-auto">
                                    Mettre à jour
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
