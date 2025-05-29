import React from 'react';
import { DevCat } from '../types/devCat';
import { Code, Coffee, Star, User } from 'lucide-react';

interface DevCatCardProps {
  cat: DevCat;
}

const DevCatCard: React.FC<DevCatCardProps> = ({ cat }) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'main': return '⭐';
      case 'developer': return '👨‍💻';
      case 'bug': return '🐛';
      case 'mentor': return '🧙‍♂️';
      default: return '🐱';
    }
  };

  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case 'junior': return 'bg-green-100 text-green-800';
      case 'senior': return 'bg-blue-100 text-blue-800';
      case 'lead': return 'bg-purple-100 text-purple-800';
      case 'architect': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExperienceLabel = (experience: string) => {
    switch (experience) {
      case 'junior': return 'ジュニア';
      case 'senior': return 'シニア';
      case 'lead': return 'リード';
      case 'architect': return 'アーキテクト';
      default: return experience;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{getRoleIcon(cat.role)}</div>
          <div>
            <h3 className="text-xl font-bold">{cat.name}</h3>
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getExperienceColor(cat.experience)}`}>
              {getExperienceLabel(cat.experience)}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 text-sm mb-2">{cat.personality}</p>
        <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
          <Star className="w-4 h-4" />
          <span className="font-medium">特技:</span>
          <span>{cat.specialAbility}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
          <Code className="w-4 h-4" />
          <span className="font-medium">スキル:</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {cat.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
          <Coffee className="w-4 h-4" />
          <span className="font-medium">好きな食べ物:</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {cat.favoriteFood.map((food, index) => (
            <span
              key={index}
              className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded"
            >
              {food}
            </span>
          ))}
        </div>
      </div>

      {cat.avatarUrl && (
        <div className="mt-4 text-center">
          <img
            src={cat.avatarUrl}
            alt={cat.name}
            className="w-16 h-16 rounded-full mx-auto border-2 border-gray-200"
          />
        </div>
      )}
    </div>
  );
};

export default DevCatCard;