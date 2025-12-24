import { useState, useEffect } from 'react';
import api from '../api';
import ChaletCard from '../components/ChaletCard';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
    const [chalets, setChalets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    const [userHasSelection, setUserHasSelection] = useState(false);

    const fetchChalets = async () => {
        try {
            const response = await api.get('/chalets');
            setChalets(response.data);
            const hasSelection = response.data.some(c => c.Users && c.Users.some(u => u.id === user.id));
            setUserHasSelection(hasSelection);
        } catch (error) {
            console.error('Error fetching chalets:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChalets();
    }, [user.id]);

    const handleSelect = async (chaletId) => {
        if (userHasSelection) {
            alert("Vous avez déjà réservé un chalet. Contactez un admin pour changer.");
            return;
        }
        if (!window.confirm("Êtes-vous sûr de vouloir rejoindre ce chalet ? Attention, ce choix est définitif et ne pourra pas être modifié par la suite.")) {
            return;
        }
        try {
            await api.post(`/chalets/${chaletId}/select`);
            fetchChalets();
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur lors de la réservation');
        }
    };

    return (
        <div className="min-h-screen bg-ice-50 font-sans">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="WESK Logo" className="h-8 w-auto" />
                        <span className="font-bold text-xl text-slate-800 tracking-tight hidden sm:block">WESK 2026</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {user?.isAdmin && (
                            <Link to="/admin" className="text-slate-600 hover:text-ski-600 font-medium transition-colors hidden sm:block">
                                Admin Dashboard
                            </Link>
                        )}
                        <Link to="/profile" className="flex items-center gap-2 text-slate-600 hover:text-ski-600 transition-colors">
                            <UserCircleIcon className="h-6 w-6" />
                            <span className="font-medium hidden sm:block">{user.email}</span>
                        </Link>
                        <div className="h-6 w-px bg-slate-300 mx-2 hidden sm:block"></div>
                        <button onClick={logout} className="text-slate-500 hover:text-red-500 transition-colors" title="Se déconnecter">
                            <ArrowRightOnRectangleIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-slate-900">Chalets Disponibles</h1>
                    <p className="mt-2 text-slate-600 max-w-2xl">
                        Choisissez votre hébergement pour le week-end. Les premiers arrivés sont les premiers servis !
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-ski-accent"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {chalets.map(chalet => (
                            <ChaletCard
                                key={chalet.id}
                                chalet={chalet}
                                user={user}
                                onSelect={handleSelect}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
