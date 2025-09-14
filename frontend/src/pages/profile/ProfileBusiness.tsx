import React, { useState, useEffect } from 'react';

const ProfileBusiness: React.FC = () => {
  const [businessDetails, setBusinessDetails] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // Load from localStorage (replace with backend fetch if available)
    const saved = localStorage.getItem('businessDetails');
    if (saved) setBusinessDetails(JSON.parse(saved));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessDetails({
      ...businessDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to localStorage (replace with backend call if available)
    localStorage.setItem('businessDetails', JSON.stringify(businessDetails));
    setEditMode(false);
    alert('Business details updated!');
  };

  const handleCancel = () => {
    // Reset to last saved
    const saved = localStorage.getItem('businessDetails');
    if (saved) setBusinessDetails(JSON.parse(saved));
    setEditMode(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-emerald-700 mb-4">Business Details</h2>
      {!editMode ? (
        <div className="space-y-4">
          <div><strong>Business Name:</strong> {businessDetails.name || <span className="text-gray-400">(not set)</span>}</div>
          <div><strong>Address:</strong> {businessDetails.address || <span className="text-gray-400">(not set)</span>}</div>
          <div><strong>Email:</strong> {businessDetails.email || <span className="text-gray-400">(not set)</span>}</div>
          <div><strong>Phone:</strong> {businessDetails.phone || <span className="text-gray-400">(not set)</span>}</div>
          <button onClick={() => setEditMode(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition">Edit</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Business Name"
            value={businessDetails.name}
            onChange={handleChange}
            className="border border-emerald-200 rounded-lg p-3 w-full focus:ring-2 focus:ring-emerald-400"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={businessDetails.address}
            onChange={handleChange}
            className="border border-emerald-200 rounded-lg p-3 w-full focus:ring-2 focus:ring-emerald-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={businessDetails.email}
            onChange={handleChange}
            className="border border-emerald-200 rounded-lg p-3 w-full focus:ring-2 focus:ring-emerald-400"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={businessDetails.phone}
            onChange={handleChange}
            className="border border-emerald-200 rounded-lg p-3 w-full focus:ring-2 focus:ring-emerald-400"
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition">Update</button>
            <button type="button" onClick={handleCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold shadow transition">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileBusiness; 