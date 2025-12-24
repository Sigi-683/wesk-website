import { HomeIcon, UserGroupIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

export default function ChaletCard({ chalet, user, onSelect }) {
    const users = chalet.Users || [];
    const isSelected = users.length >= chalet.capacity; // "Unavailable" if full
    const isSelectedByMe = user && users.some(u => u.id === user.id);
    const spotsLeft = chalet.capacity - users.length;
    const progress = Math.min((users.length / chalet.capacity) * 100, 100);

    return (
        <div className={`
            relative flex flex-col bg-white rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-xl
            ${isSelectedByMe ? 'border-ski-accent ring-2 ring-ski-accent/50' : 'border-slate-200'}
        `}>
            {isSelectedByMe && (
                <div className="absolute top-4 right-4 bg-ski-accent text-white p-1 rounded-full shadow-lg z-10">
                    <CheckBadgeIcon className="h-6 w-6" />
                </div>
            )}

            {/* Image Display */}
            <div className="h-48 bg-gradient-to-br from-ice-200 to-ice-400 rounded-t-2xl flex items-center justify-center relative overflow-hidden group">
                {chalet.imageUrl ? (
                    <img
                        src={chalet.imageUrl.startsWith('http') ? chalet.imageUrl : `${chalet.imageUrl}`}
                        alt={chalet.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <HomeIcon className="h-16 w-16 text-white/50" />
                )}
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{chalet.name}</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{chalet.description || "Un chalet confortable et convivial pour votre week-end."}</p>

                {/* Capacity Progress */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs font-medium text-slate-600 mb-2">
                        <span className="flex items-center gap-1"><UserGroupIcon className="h-3 w-3" /> Places occupées</span>
                        <span>{users.length} / {chalet.capacity}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${spotsLeft === 0 ? 'bg-red-500' :
                                spotsLeft < 3 ? 'bg-orange-500' : 'bg-green-500'
                                }`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Users List */}
                <div className="mb-6 flex-1">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Occupants</h4>
                    {users.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {users.map(u => (
                                <span key={u.id} className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200" title={u.email}>
                                    {u.email.split('@')[0]}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 italic">Aucun occupant pour le moment</p>
                    )}
                </div>

                <div className="mt-auto">
                    {isSelectedByMe ? (
                        <button
                            disabled
                            className="w-full py-3 px-4 rounded-xl bg-green-50 text-green-700 font-semibold border border-green-200 cursor-default"
                        >
                            Réservé par vous
                        </button>
                    ) : isSelected ? (
                        <button
                            disabled
                            className="w-full py-3 px-4 rounded-xl bg-slate-100 text-slate-400 font-semibold border border-slate-200 cursor-not-allowed"
                        >
                            Complet
                        </button>
                    ) : (
                        <button
                            onClick={() => onSelect(chalet.id)}
                            className="w-full py-3 px-4 rounded-xl btn-primary transition-transform active:scale-95 shadow-md shadow-ski-accent/20"
                        >
                            Choisir ce Chalet
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
