import type { User } from "../types/index";
interface UserCardProps {
    user: User;
    onSelect: (user: User) => void;
}
function UserCard({ user, onSelect }: UserCardProps) {
    const handleClick = (): void => {
        onSelect(user);
    };
    return (
        <div className="user-card card">
            <h3>{user.name}</h3>
            <p>Role: {user.role}</p>
            <button onClick={handleClick}>Select</button>
        </div>
    );
}
export default UserCard;