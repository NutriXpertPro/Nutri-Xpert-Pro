
'use client';

import { useState, useEffect } from 'react';
import { Input } from "@/frontend/src/components/ui/input";
import { useDebounce } from '@/frontend/app/hooks/useDebounce';

interface Food {
  id: string;
  name: string;
  // Add other nutritional info if needed
}

interface FoodSearchProps {
  onFoodSelect: (food: Food) => void;
}

export default function FoodSearch({ onFoodSelect }: FoodSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setLoading(true);
      const fetchFoods = async () => {
        try {
          const response = await fetch(`/api/foods?name=${debouncedSearchTerm}`);
          if (!response.ok) {
            throw new Error('Falha ao buscar alimentos.');
          }
          const data = await response.json();
          setResults(data);
        } catch (error) {
          console.error(error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      };
      fetchFoods();
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Buscar alimento..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading && <p className="p-2">Buscando...</p>}
      {results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-y-auto">
          {results.map((food) => (
            <li
              key={food.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onFoodSelect(food);
                setSearchTerm('');
                setResults([]);
              }}
            >
              {food.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
