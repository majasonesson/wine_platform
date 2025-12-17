'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProducerDashboard() {
  const [wines, setWines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWines();
  }, []);

  const fetchWines = async () => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      
      const response = await fetch('/api/wines', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWines(data);
      }
    } catch (error) {
      console.error('Error fetching wines:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Producer Dashboard</h1>
          <div className="flex gap-4">
            <Link 
              href="/producer/addproduct" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Wine
            </Link>
            <Link 
              href="/producer/connections" 
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
            >
              Connections
            </Link>
            <Link 
              href="/producer/profile" 
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Profile
            </Link>
          </div>
        </div>

        {loading ? (
          <div>Loading wines...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wines.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                <p>No wines yet. Add your first wine to get started!</p>
              </div>
            ) : (
              wines.map((wine: any) => (
                <div key={wine.WineID} className="border rounded-lg p-6 hover:shadow-lg transition">
                  <h3 className="text-xl font-bold mb-2">{wine.Name}</h3>
                  <p className="text-gray-600 mb-4">{wine.BrandName}</p>
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded text-sm ${wine.IsPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {wine.IsPublished ? 'Published' : 'Draft'}
                    </span>
                    <Link 
                      href={`/producer/product/${wine.WineID}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}

