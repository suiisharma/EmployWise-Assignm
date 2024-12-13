import { useState, useEffect } from 'react';
import { Alert } from '@mui/material';
import { Trash2, Edit, LogOut } from 'lucide-react';
import EditUser from '../components/Edituser';
import { useAuth } from '../context/Usercontext';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const { logout } = useAuth();

    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState(null);

    const handleClose = () => setOpen(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://reqres.in/api/users?page=${page}`);
            const data = await response.json();
            setUsers(data.data);
            setTotalPages(data.total_pages);
        } catch (err) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleOnSave = (updatedUser) => {
        setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
        handleClose();
    };

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://reqres.in/api/users/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setUsers(users.filter(user => user.id !== id));
            } else {
                throw new Error('Failed to delete user');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const filteredUsers = users.filter(user =>
        `${user.first_name} ${user.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <>{open ? (
            <EditUser User={users.find(user => user.id === userId)} userId={userId} onClose={handleClose} onSave={handleOnSave} />

        ) : (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Users</h1>
                    <button
                        onClick={logout}
                        className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-4 py-2 border rounded-lg mb-6"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {error && (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : (


                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredUsers.map(user => (
                            <div key={user.id} className="bg-white rounded-lg shadow p-6">
                                <img
                                    src={user.avatar}
                                    alt={`${user.first_name} ${user.last_name}`}
                                    className="w-24 h-24 rounded-full mx-auto mb-4"
                                />
                                <h2 className="text-xl font-semibold text-center mb-2">
                                    {user.first_name} {user.last_name}
                                </h2>
                                <p className="text-gray-600 text-center mb-4">{user.email}</p>
                                <div className="flex justify-center space-x-2">
                                    <button
                                        className="p-2 text-blue-600 hover:text-blue-800"
                                        onClick={() => {
                                            setUserId(user.id);
                                            setOpen(true);
                                        }}
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="p-2 text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-6 flex justify-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                        <button
                            key={num}
                            onClick={() => setPage(num)}
                            className={`px-4 py-2 rounded ${page === num
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>)}
        </>
    );
};

export default UserList;
