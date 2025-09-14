import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const requirements = [
    { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { label: "One number", test: (p: string) => /\d/.test(p) },
    { label: "One special character", test: (p: string) => /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(p) },
  ];

  const getStrengthLevel = () => {
    const passedRequirements = requirements.filter(req => req.test(password)).length;
    const percentage = (passedRequirements / requirements.length) * 100;
    
    if (percentage === 100) return { level: 'Strong', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (percentage >= 60) return { level: 'Good', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (percentage >= 40) return { level: 'Fair', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { level: 'Weak', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const strength = getStrengthLevel();
  const passedRequirements = requirements.filter(req => req.test(password)).length;

  return (
    <div className="mt-2">
      {/* Strength Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Password Strength:</span>
          <span className={`text-sm font-semibold ${strength.color}`}>{strength.level}</span>
        </div>
                 <div className="w-full bg-gray-200 rounded-full h-2">
           <div 
             className={`h-2 rounded-full transition-all duration-300 ${strength.bgColor}`}
             style={{ 
               width: `${Math.min(100, (passedRequirements / requirements.length) * 100)}%` 
             }}
           />
         </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-1">
        {requirements.map((requirement, index) => {
          const isMet = requirement.test(password);
          return (
            <div key={index} className="flex items-center space-x-2">
              {isMet ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-xs ${isMet ? 'text-green-600' : 'text-gray-500'}`}>
                {requirement.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator; 