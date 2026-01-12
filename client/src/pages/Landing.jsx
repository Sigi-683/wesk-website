import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDaysIcon, UserGroupIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const Landing = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-ice-800 via-ice-400 to-ice-100 font-sans">
            {/* Navigation Bar */}
            <nav className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    {/* Logo - assuming it's in public folder */}
                    <img src="/logo.png" alt="WESK Logo" className="h-12 w-auto drop-shadow-lg" />
                    <span className="text-white font-bold text-xl tracking-wider drop-shadow-md hidden sm:block">WESK 2026</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-white hover:text-ice-100 font-medium transition-colors drop-shadow-md">Connexion</Link>
                    <Link to="/register" className="btn btn-primary py-2 px-4 shadow-none">S'inscrire</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">
                {/* Background Pattern/Overlay */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>

                {/* Compass/Geometry Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/10 rounded-full pointer-events-none animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full pointer-events-none"></div>

                {/* Main Content */}
                <div className="relative z-10 max-w-4xl mx-auto space-y-6 animate-fade-in-up">
                    <div className="inline-block bg-yellow-500/20 backdrop-blur-md border border-yellow-500/50 rounded-full px-4 py-1.5 mb-4">
                        <span className="text-yellow-200 font-semibold tracking-wide flex items-center gap-2">
                            ⚠️ IL RESTE DES PLACES !
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white tracking-tight drop-shadow-xl p-2 uppercase">
                        WESK PYCOLO
                    </h1>

                    <p className="text-xl md:text-3xl text-ice-50 font-light tracking-wide drop-shadow-md">
                        Du 30 janvier au 1er février 2026
                    </p>

                    <p className="text-lg text-ice-200/80 font-medium tracking-wider">
                        Départ Lyon → Alpe d’Huez → Retour Lyon
                    </p>

                    {/* Info Pills */}
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 py-6">
                        <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-2xl border border-white/20">
                            <CalendarDaysIcon className="h-6 w-6" />
                            <div className="text-left leading-tight">
                                <span className="block text-xs uppercase opacity-70">Dates</span>
                                <span className="font-bold text-sm md:text-base">30 Jan - 01 Fév</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-2xl border border-white/20">
                            <MapPinIcon className="h-6 w-6" />
                            <div className="text-left leading-tight">
                                <span className="block text-xs uppercase opacity-70">Lieu</span>
                                <span className="font-bold text-sm md:text-base">Alpe d'Huez</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-2xl border border-white/20">
                            <UserGroupIcon className="h-6 w-6" />
                            <div className="text-left leading-tight">
                                <span className="block text-xs uppercase opacity-70">Places</span>
                                <span className="font-bold text-yellow-300 text-sm md:text-base">Dernières Dispos</span>
                            </div>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                        <a
                            href="https://www.helloasso.com/associations/bde-epita-lyon/evenements/wesk-bde-pycolo-epita-lyon"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary text-lg px-8 py-4 min-w-[200px] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                        >
                            Prendre ma place (HelloAsso)
                        </a>
                        <Link to="/register" className="btn bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 text-lg px-8 py-4 min-w-[200px]">
                            Espace WESK
                        </Link>
                    </div>
                    <p className="text-sm text-ice-200/60 mt-4">
                        Fin de la billetterie : 31/12/2025 à 23h42
                    </p>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce">
                    <ChevronDownIcon className="h-8 w-8 opacity-70" />
                </div>
            </div>

            {/* Details / Pricing Section */}
            <div id="details" className="bg-white py-24 px-4">
                <div className="max-w-7xl mx-auto">

                    {/* Intro */}
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tight">Au Programme</h2>
                        <div className="h-1.5 w-24 bg-ski-accent mx-auto rounded-full mb-8"></div>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            🎿 Du ski (ou pas, et c’est ok) • 😂 Des barres sur les télésièges • 🎉 Des soirées mémorables • 🧠 Des souvenirs qui feront oublier les partiels
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-start">

                        {/* Pack de Base */}
                        <div className="bg-slate-50 rounded-3xl p-8 md:p-12 shadow-lg border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 bg-ski-accent text-white px-6 py-2 rounded-bl-3xl font-bold text-lg">
                                179€
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-6">Pack de Base</h3>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-slate-700">
                                    <span className="bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></span>
                                    Transport A/R (Départ Lyon)
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <span className="bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></span>
                                    Logement en chalet 6 pers. tout équipé
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <span className="bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></span>
                                    Ambiance Pycolo garantie
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <span className="bg-blue-100 text-blue-600 p-1 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></span>
                                    Tarif réduit pour les boursiers
                                </li>
                            </ul>
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-sm text-orange-800">
                                ✍️ Décharge + chèque de caution à prévoir
                            </div>
                        </div>

                        {/* Extensions */}
                        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-bl-3xl font-bold text-sm tracking-wider uppercase">
                                En Option
                            </div>
                            <h3 className="text-3xl font-bold mb-2">Extensions</h3>
                            <p className="text-slate-400 mb-8">Facilitez-vous la vie avec Compass</p>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                                    <div>
                                        <div className="font-bold text-lg">Carte Compass</div>
                                        <div className="text-slate-400 text-sm">Code: <span className="text-yellow-400 font-mono">PYCOLO25</span></div>
                                    </div>
                                    <div className="text-xl font-bold">2,20€</div>
                                </div>
                                <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                                    <div>
                                        <div className="font-bold text-lg">Forfait Ski</div>
                                        <div className="text-green-400 text-sm">35€/jour (au lieu de 66€)</div>
                                    </div>
                                    <div className="text-slate-500 line-through text-sm mr-2">66€</div>
                                </div>
                                <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                                    <div>
                                        <div className="font-bold text-lg">Location Matériel</div>
                                        <div className="text-green-400 text-sm">-40% avec Compass</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 text-center">
                                <p className="text-slate-300 italic">
                                    "Même si tu ne skies pas, le week-end est pensé pour que tu profites à fond avec tes potes 🫶"
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400 py-16 text-center border-t border-slate-900">
                <div className="max-w-3xl mx-auto px-4">
                    <img src="/logo.png" alt="WESK Logo" className="h-16 w-auto mx-auto mb-6 opacity-80 mix-blend-luminosity" />
                    <p className="text-lg mb-8">
                        ✨ Toute l’équipe du BDE vous souhaite de très bonnes fêtes de fin d’année et a hâte de vous retrouver pour un week-end de ski inoubliable ! 🎄❄️
                    </p>
                    <p className="text-sm text-slate-600">&copy; 2026 WESK Pycolo - BDE EPITA Lyon. Tous droits réservés.</p>
                </div>
            </footer>
        </div >
    );
};

export default Landing;
