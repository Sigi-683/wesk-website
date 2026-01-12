import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Connexion échouée. Vérifiez vos identifiants.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-ice-800 to-ice-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/10 rounded-full pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-ice-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="max-w-md w-full glass-card p-6 md:p-8 z-10">
                <div className="text-center mb-10">
                    <img className="mx-auto h-16 w-auto drop-shadow-md mb-4" src="/logo.png" alt="WESK Logo" />
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        Connexion
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Accédez à votre espace WESK
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-slate-700 mb-1">
                                Adresse Email
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="glass-input w-full px-4 py-3 placeholder-slate-400 focus:ring-2 focus:ring-ski-accent outline-none font-medium"
                                placeholder="vous@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="glass-input w-full px-4 py-3 placeholder-slate-400 focus:ring-2 focus:ring-ski-accent outline-none font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-ski-accent focus:ring-ski-accent border-slate-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                                Se souvenir de moi
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full text-lg shadow-xl hover:translate-y-[-2px] transition-transform"
                    >
                        Se connecter
                    </button>

                    <div className="text-center mt-4">
                        <Link to="/register" className="font-medium text-ski-600 hover:text-ski-800 transition-colors">
                            Pas encore de compte ? S'inscrire
                        </Link>
                    </div>
                    <div className="text-center mt-2">
                        <Link to="/" className="text-sm text-slate-500 hover:text-slate-700">
                            ← Retour à l'accueil
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
