import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";

const GalleriesIndex = ({ galleries = [], tournaments = [], authUser }) => {
  return (
    <AdminLayout user={authUser}>
      <h1 className="text-2xl font-bold mb-6">Galleries Management</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border border-gray-700">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-2 border border-gray-700">ID</th>
              <th className="px-4 py-2 border border-gray-700">Tournament</th>
              <th className="px-4 py-2 border border-gray-700">Title</th>
              <th className="px-4 py-2 border border-gray-700">Description</th>
              <th className="px-4 py-2 border border-gray-700">Image Path</th>
              <th className="px-4 py-2 border border-gray-700">Created At</th>
              <th className="px-4 py-2 border border-gray-700">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {galleries?.map((gallery) => (
              <tr key={gallery.id}>
                <td className="px-4 py-2 border border-gray-700">{gallery.id}</td>
                <td className="px-4 py-2 border border-gray-700">{gallery.tournament?.name ?? "-"}</td>
                <td className="px-4 py-2 border border-gray-700">{gallery.title ?? "-"}</td>
                <td className="px-4 py-2 border border-gray-700">{gallery.description ?? "-"}</td>
                <td className="px-4 py-2 border border-gray-700">{gallery.image_path}</td>
                <td className="px-4 py-2 border border-gray-700">{gallery.created_at}</td>
                <td className="px-4 py-2 border border-gray-700">{gallery.updated_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default GalleriesIndex;
