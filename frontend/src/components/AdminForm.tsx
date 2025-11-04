import React, { useState } from 'react';
import { X, Save, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'file' | 'url';
  required?: boolean;
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
}

interface AdminFormProps {
  title: string;
  fields: FormField[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  mode?: 'create' | 'edit' | 'view';
  showActions?: boolean;
}

const AdminForm: React.FC<AdminFormProps> = ({
  title,
  fields,
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  loading = false,
  mode = 'create',
  showActions = true
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.required && (!formData[field.name] || formData[field.name] === '')) {
        newErrors[field.name] = `${field.label} is required`;
      }
      
      if (field.type === 'email' && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          newErrors[field.name] = 'Please enter a valid email address';
        }
      }
      
      if (field.type === 'number' && formData[field.name]) {
        const num = Number(formData[field.name]);
        if (isNaN(num)) {
          newErrors[field.name] = 'Please enter a valid number';
        }
        if (field.min !== undefined && num < field.min) {
          newErrors[field.name] = `Value must be at least ${field.min}`;
        }
        if (field.max !== undefined && num > field.max) {
          newErrors[field.name] = `Value must be at most ${field.max}`;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPassword(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];
    const isReadOnly = mode === 'view';

    const baseInputClasses = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
      error ? 'border-red-300' : 'border-gray-300'
    } ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`;

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            readOnly={isReadOnly}
            className={baseInputClasses}
          />
        );

      case 'select':
        return (
          <select
            name={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            disabled={isReadOnly}
            className={baseInputClasses}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              name={field.name}
              checked={value}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              disabled={isReadOnly}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
              {field.label}
            </label>
          </div>
        );

      case 'password':
        return (
          <div className="relative">
            <input
              type={showPassword[field.name] ? 'text' : 'password'}
              name={field.name}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              readOnly={isReadOnly}
              className={baseInputClasses}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility(field.name)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword[field.name] ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            name={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            readOnly={isReadOnly}
            className={baseInputClasses}
          />
        );

      default:
        return (
          <input
            type={field.type}
            name={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            readOnly={isReadOnly}
            className={baseInputClasses}
          />
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {cancelLabel}
              </button>
            )}
            {mode !== 'view' && (
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {submitLabel}
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminForm;

