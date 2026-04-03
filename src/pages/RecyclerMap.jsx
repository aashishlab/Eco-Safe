import React, { useState, useMemo } from 'react';
import { MapPin, Phone, Clock, DollarSign, Gift, Filter, Navigation, Search, ExternalLink, ArrowRight } from 'lucide-react';
import recyclingCenters from '../data/recyclingCenters.json';

const RecyclerMap = () => {
  const [filter, setFilter] = useState('all'); // 'all', 'paid', 'free'
  const [districtFilter, setDistrictFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCenter, setSelectedCenter] = useState(null);

  // Get unique districts
  const districts = useMemo(() => {
    const uniqueDistricts = [...new Set(recyclingCenters.map(c => c.district))];
    return ['all', ...uniqueDistricts.sort()];
  }, []);

  const filteredCenters = useMemo(() => {
    let result = recyclingCenters;
    
    // Apply type filter
    if (filter !== 'all') {
      result = result.filter(center => center.type === filter);
    }
    
    // Apply district filter
    if (districtFilter !== 'all') {
      result = result.filter(center => center.district === districtFilter);
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(center => 
        center.name.toLowerCase().includes(term) ||
        center.address.toLowerCase().includes(term) ||
        center.services.some(s => s.toLowerCase().includes(term))
      );
    }
    
    return result;
  }, [filter, districtFilter, searchTerm]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Simple distance calculation (in real app, use user's location)
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  // Using a central point (Delhi) as reference for distance calculation
  const referenceLat = 24.5975;
  const referenceLon = 78.7156;

  return (
    <>
      <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-full lg:w-96 bg-white border-r border-slate-200 overflow-y-auto z-10">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 p-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Certified Recycling Centers
            </h1>
            <p className="text-slate-600 text-sm mb-4">
              Find safe disposal locations near you
            </p>

            {/* Filter Toggle */}
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Centers
              </button>
              <button
                onClick={() => setFilter('paid')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filter === 'paid'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Paid
              </button>
              <button
                onClick={() => setFilter('free')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filter === 'free'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Free
              </button>
            </div>

            {/* District Filter */}
            <div className="mt-4">
              <label htmlFor="district" className="block text-sm font-medium text-slate-700 mb-1">
                District
              </label>
              <select
                id="district"
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Bar */}
            <div className="mt-4">
              <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-1">
                Search
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, address, or service"
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Centers List */}
          <div className="divide-y divide-slate-100">
            {filteredCenters.map((center) => (
              <div
                key={center.id}
                onClick={() => setSelectedCenter(center)}
                className={`p-6 cursor-pointer transition-all hover:bg-slate-50 ${
                  selectedCenter?.id === center.id ? 'bg-emerald-50 border-l-4 border-emerald-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900">{center.name}</h3>
                  {center.type === 'paid' ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                      <DollarSign className="h-3 w-3 inline mr-0.5" />
                      Buy-back
                    </span>
                  ) : (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                      <Gift className="h-3 w-3 inline mr-0.5" />
                      Free Drop-off
                    </span>
                  )}
                </div>

                <p className="text-slate-600 text-sm mb-3">{center.address}</p>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-slate-500">
                    <Phone className="h-4 w-4 mr-2" />
                    {center.phone}
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                    <Clock className="h-4 w-4 mr-2" />
                    {center.hours}
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                    <Navigation className="h-4 w-4 mr-2" />
                    {calculateDistance(referenceLat, referenceLon, center.latitude, center.longitude)} km away
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {center.services.slice(0, 2).map((service, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs"
                    >
                      {service}
                    </span>
                  ))}
                  {center.services.length > 2 && (
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                      +{center.services.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 bg-slate-100 relative">
          {/* Map Placeholder - In production, integrate Mapbox here */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin className="h-24 w-24 text-slate-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-400 mb-2">
                Interactive Map View
              </h2>
              <p className="text-slate-500 max-w-md">
                Map integration requires a Mapbox access token. 
                Sign up at{' '}
                <a
                  href="https://mapbox.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline font-medium"
                >
                  mapbox.com
                </a>{' '}
                to get your free token.
              </p>
              <div className="mt-6 bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
                <h3 className="font-bold text-slate-900 mb-4">Current Centers</h3>
                <div className="space-y-3">
                  {filteredCenters.map((center) => (
                    <div
                      key={center.id}
                      onClick={() => setSelectedCenter(center)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedCenter?.id === center.id
                          ? 'bg-emerald-100 border-2 border-emerald-500'
                          : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900 text-sm">
                          {center.name}
                        </span>
                        <MapPin className={`h-4 w-4 ${
                          center.type === 'paid' ? 'text-green-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {center.city || 'Location'} • {center.type === 'paid' ? 'Paid' : 'Free'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Selected Center Popup */}
          {selectedCenter && (
            <div className="absolute bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-96 bg-white rounded-xl shadow-2xl p-6 border-2 border-emerald-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-slate-900">{selectedCenter.name}</h3>
                <button
                  onClick={() => setSelectedCenter(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-emerald-600 mr-2 mt-0.5" />
                  <p className="text-sm text-slate-600">{selectedCenter.address}</p>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-emerald-600 mr-2" />
                  <p className="text-sm text-slate-600">{selectedCenter.phone}</p>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-emerald-600 mr-2" />
                  <p className="text-sm text-slate-600">{selectedCenter.hours}</p>
                </div>
                
                <div className="pt-3 border-t border-slate-200">
                  <div className="flex gap-2 mb-3">
                    {selectedCenter.buyback && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <DollarSign className="h-3 w-3 inline mr-1" />
                        Offers Buy-back
                      </span>
                    )}
                    {selectedCenter.freeDropOff && (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <Gift className="h-3 w-3 inline mr-1" />
                        Free Drop-off Available
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCenter.latitude},${selectedCenter.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <ArrowRight className="h-5 w-5 mr-2" />
                      Get Directions
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${selectedCenter.latitude},${selectedCenter.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      View on Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RecyclerMap;
