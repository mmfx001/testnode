import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', surname: '', age: '' });
    const [editingUser, setEditingUser] = useState(null);

    // Fetch users
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/getUsers');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Add a new user
    const handleAddUser = async () => {
        try {
            await axios.post('http://localhost:8000/addUser', newUser);
            fetchUsers();
            setNewUser({ name: '', surname: '', age: '' }); // Clear inputs after adding
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    // Update an existing user
    const handleUpdateUser = async (id) => {
        try {
            await axios.put(`http://localhost:8000/updateUser/${id}`, editingUser);
            fetchUsers();
            setEditingUser(null); // Clear edit form after updating
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    // Delete a user
    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/deleteUser/${id}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-6">
            <h1 className="text-4xl font-bold text-center text-orange-400 mb-8">Foydalanuvchilar</h1>

            {/* Add User Form */}
            <div className="w-full max-w-xl bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                <h2 className="text-2xl font-semibold mb-4">Yangi Foydalanuvchi Qo'shish</h2>
                <div className="flex flex-col space-y-4">
                    <input
                        type="text"
                        placeholder="Ism"
                        className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Familiya"
                        className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={newUser.surname}
                        onChange={(e) => setNewUser({ ...newUser, surname: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Yosh"
                        className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={newUser.age}
                        onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
                    />
                    <button
                        onClick={handleAddUser}
                        className="mt-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition duration-200"
                    >
                        Qo'shish
                    </button>
                </div>
            </div>

            {/* Users List */}
            <div className="w-full max-w-2xl">
                <h2 className="text-2xl font-semibold text-orange-400 mb-4">Foydalanuvchilar Ro'yxati</h2>
                <ul className="space-y-4">
                    {users.map((user) => (
                        <li key={user._id} className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg shadow">
                            <div className="text-lg">
                                <span className="font-medium">{user.name} {user.surname}</span> <span className="text-gray-400">({user.age} yosh)</span>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-4" >
                                <button
                                    onClick={() => setEditingUser(user)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white w-28 py-2 rounded-lg transition duration-200"
                                >
                                    Tahrirlash
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(user._id)}
                                    className="bg-red-600 hover:bg-red-700 text-white w-28 py-2 rounded-lg transition duration-200"
                                >
                                    O'chirish
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg">
                        <h2 className="text-2xl font-semibold text-orange-400 mb-4">Foydalanuvchini Tahrirlash</h2>
                        <div className="flex space-y-4 flex-col">
                            <input
                                type="text"
                                placeholder="Ism"
                                className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                value={editingUser.name}
                                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Familiya"
                                className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                value={editingUser.surname}
                                onChange={(e) => setEditingUser({ ...editingUser, surname: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Yosh"
                                className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                value={editingUser.age}
                                onChange={(e) => setEditingUser({ ...editingUser, age: e.target.value })}
                            />
                            <div className="flex justify-end space-x-2 ">
                                <button
                                    onClick={() => handleUpdateUser(editingUser._id)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                >
                                    Yangilash
                                </button>
                                <button
                                    onClick={() => setEditingUser(null)}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                >
                                    Bekor Qilish
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
