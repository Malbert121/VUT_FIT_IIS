import React from 'react';

const AdminPanelPage: React.FC = () => {
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Welcome to the Admin Panel. Here you can manage conferences, lectures, and users.</p>
      
      <section>
        <h2>Manage Conferences</h2>
        <button>Add New Conference</button>
        <button>Edit Existing Conferences</button>
        <button>Delete Conferences</button>
      </section>
      
      <section>
        <h2>Manage Lectures</h2>
        <button>Add New Lecture</button>
        <button>Edit Existing Lectures</button>
        <button>Delete Lectures</button>
      </section>
      
      <section>
        <h2>Manage Users</h2>
        <button>View Users</button>
        <button>Edit User Roles</button>
        <button>Delete Users</button>
      </section>
    </div>
  );
};

export default AdminPanelPage;
