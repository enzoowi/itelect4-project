import type { User } from "../types/index";

interface UserCardProps {
    user: User;
    onSelect: (user: User) => void;
    compact?: boolean;
}

function UserCard({ user, onSelect, compact = false }: UserCardProps) {
    const handleClick = (): void => {
        onSelect(user);
    };

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all hover:shadow-md ${compact ? 'flex items-center justify-between' : 'flex flex-col gap-2'}`}>
            <div className={compact ? 'flex flex-col' : ''}>
                <h3 className={`font-semibold text-gray-900 dark:text-white ${compact ? 'text-md' : 'text-xl'}`}>{user.name}</h3>
                <p className={`text-sm text-gray-500 dark:text-gray-400 ${compact ? 'm-0' : 'mt-1'}`}>
                    Role: <span className="font-medium text-blue-600 dark:text-blue-400">{user.role}</span>
                </p>
            </div>
            <button 
                onClick={handleClick}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none ${compact ? 'px-3 py-1.5 text-sm' : 'w-full py-2 mt-2'}`}
            >
                Select
            </button>
        </div>
    );
}

export default UserCard;