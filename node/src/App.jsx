import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', surname: '', age: '' });
    const [editingUser, setEditingUser] = useState(null);

    // Foydalanuvchilarni olish
    const fetchUsers = async () => {
        const response = await axios.get('http://localhost:8000/getUsers');
        setUsers(response.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Foydalanuvchini qo'shish
    const handleAddUser = async () => {
        await axios.post('http://localhost:8000/addUser', newUser);
        fetchUsers();
        setNewUser({ name: '', surname: '', age: '' }); // Qo'shgandan keyin inputlarni tozalash
    };

    // Foydalanuvchini yangilash
    const handleUpdateUser = async (id) => {
        await axios.put(`http://localhost:8000/updateUser/${id}`, editingUser);
        fetchUsers();
        setEditingUser(null); // Yangilagandan keyin tahrirlash formani tozalash
    };

    // Foydalanuvchini o'chirish
    const handleDeleteUser = async (id) => {
        await axios.delete(`http://localhost:8000/deleteUser/${id}`);
        fetchUsers();
    };

    return (
        <div className="p-6 bg-gray-50 h-screen w-full flex flex-col items-center justify-center">
            <h1 className="text-3xl w-full font-bold text-center text-orange-600 mb-6">Foydalanuvchilar</h1>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Ism"
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Familiya"
                    className="p-2 border border-gray-300 rounded-lg mx-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={newUser.surname}
                    onChange={(e) => setNewUser({ ...newUser, surname: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Yosh"
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={newUser.age}
                    onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
                />
                <button
                    onClick={handleAddUser}
                    className="bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700 transition duration-200"
                >
                    Qo'shish
                </button>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Foydalanuvchilar ro'yxati</h2>
            <ul className="space-y-4">
                {users.map((user) => (
                    <li key={user._id} className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg">
                        <div className="text-gray-700">
                            {user.name} {user.surname} ({user.age} yosh)
                        </div>
                        <div>
                            <button
                                onClick={() => setEditingUser(user)}
                                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition duration-200 mx-1"
                            >
                                Tahrirlash
                            </button>
                            <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-200"
                            >
                                O'chirish
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {editingUser && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Tahrirlash</h2>
                    <input
                        type="text"
                        placeholder="Ism"
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 mb-2 w-full"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Familiya"
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 mb-2 w-full"
                        value={editingUser.surname}
                        onChange={(e) => setEditingUser({ ...editingUser, surname: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Yosh"
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 mb-2 w-full"
                        value={editingUser.age}
                        onChange={(e) => setEditingUser({ ...editingUser, age: e.target.value })}
                    />
                    <div className="flex justify-end">
                        <button
                            onClick={() => handleUpdateUser(editingUser._id)}
                            className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition duration-200 mr-2"
                        >
                            Yangilash
                        </button>
                        <button
                            onClick={() => setEditingUser(null)}
                            className="bg-gray-300 text-gray-700 px-4 py-1 rounded-lg hover:bg-gray-400 transition duration-200"
                        >
                            Bekor qilish
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
