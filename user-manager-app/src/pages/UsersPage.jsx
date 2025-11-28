import React, { useState, useEffect } from "react";
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";
import Alert from "../components/Alert";
import { fetchUsers, addUser } from "../api/userApi";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState({ message: "", type: "" });

  const showAlert = (message, type = "success") => setAlert({ message, type });

  const handleAddUser = async (user) => {
  const result = await addUser(user);

  if (result.errors) {
    return result;  
  }

  setUsers(prev => [...prev, result.data]);
  showAlert("User added successfully!", "success");

  return result;
};


  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch(() => showAlert("Failed to fetch users", "error"));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      {/* Alert tetap di atas viewport */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50">
        <Alert message={alert.message} type={alert.type} onClose={() => setAlert({})} />
      </div>

      {/* Container tengah */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Form di kiri */}
        <div className="col-span-12 md:col-span-4">
          <UserForm onAddUser={handleAddUser} showAlert={showAlert} />
        </div>

        {/* List di kanan */}
        <div className="col-span-12 md:col-span-8">
          <UserList users={users} />
        </div>
      </div>
    </div>
  );
}
