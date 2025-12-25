import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(email, password);
            navigate('/dashboard');
        } catch (err) {
            const resData = err.response?.data;
            if (resData?.errors && Array.isArray(resData.errors)) {
                setError(resData.errors.map(e => e.msg).join(', '));
            } else {
                setError(resData?.message || 'Erreur lors de l\'inscription. Cet email est peut-être déjà utilisé.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-ice-800 to-ice-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/10 rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-ice-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="max-w-md w-full glass-card p-8 z-10">
                <div className="text-center mb-8">
                    <img className="mx-auto h-16 w-auto drop-shadow-md mb-4" src="/logo.png" alt="WESK Logo" />
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        Créer un compte
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Rejoignez l'aventure WESK 2026
                    </p>
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                        <p className="font-semibold mb-2">Important :</p>
                        <p>Vous devez utiliser l'adresse email renseignée lors de votre inscription sur la <a href="https://www.helloasso.com/associations/bde-epita-lyon/evenements/wesk-bde-pycolo-epita-lyon" target="_blank" rel="noopener noreferrer" className="underline text-yellow-900 font-bold hover:text-yellow-700">billetterie HelloAsso</a>.</p>
                    </div>
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
                                autoComplete="new-password"
                                required
                                className="glass-input w-full px-4 py-3 placeholder-slate-400 focus:ring-2 focus:ring-ski-accent outline-none font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full text-lg shadow-xl hover:translate-y-[-2px] transition-transform"
                    >
                        S'inscrire
                    </button>

                    <div className="text-center mt-4">
                        <Link to="/login" className="font-medium text-ski-600 hover:text-ski-800 transition-colors">
                            Déjà un compte ? Se connecter
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
