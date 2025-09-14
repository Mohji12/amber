import React, { useState } from 'react';

const ProfileQuotation: React.FC = () => {
  const [quotation, setQuotation] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuotation(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Quotation submitted!');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-emerald-700 mb-4">Quotation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name="quotation"
          placeholder="Enter your quotation details..."
          value={quotation}
          onChange={handleChange}
          className="border border-emerald-200 rounded-lg p-3 w-full focus:ring-2 focus:ring-emerald-400"
          rows={6}
        />
        <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition">Submit Quotation</button>
      </form>
    </div>
  );
};

export default ProfileQuotation; 