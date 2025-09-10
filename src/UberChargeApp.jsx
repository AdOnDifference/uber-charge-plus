import React, { useState, useEffect } from 'react';
import { MapPin, Zap, Clock, Euro, Star, Battery, Navigation, X, ChevronUp } from 'lucide-react';

const UberChargeApp = () => {
  const [selectedCharger, setSelectedCharger] = useState(null);
  const [batteryLevel] = useState(45);
  const [currentTime] = useState('9:41');
  const [showRecommendation, setShowRecommendation] = useState(true);

  // Mock charging station data
  const chargingStations = [
    {
      id: 1,
      name: "Tesco Almada",
      address: "Av. Dom Nuno Álvares Pereira, Almada",
      distance: "0.8 km",
      price: "€0.32/kWh",
      estimatedCost: "€8.50",
      availability: "3/4",
      waitTime: "0 min",
      chargingTime: "25 min",
      speed: "50kW",
      bonus: "+€2.50",
      bonusReason: "Off-peak bonus",
      rating: 4.6,
      coords: { x: 60, y: 45 },
      recommended: true,
      color: "bg-green-500"
    },
    {
      id: 2,
      name: "MOBI.E Porto",
      address: "R. de Cedofeita, Porto",
      distance: "2.1 km",
      price: "€0.28/kWh",
      estimatedCost: "€7.20",
      availability: "6/8",
      waitTime: "0 min",
      chargingTime: "15 min",
      speed: "150kW",
      bonus: "+€4.00",
      bonusReason: "Grid balancing bonus",
      rating: 4.8,
      coords: { x: 45, y: 30 },
      fastCharging: true,
      color: "bg-blue-500"
    },
    {
      id: 3,
      name: "Continente Gaia",
      address: "Rua Sara Afonso, V.N. Gaia",
      distance: "1.5 km",
      price: "€0.45/kWh",
      estimatedCost: "€12.40",
      availability: "2/6",
      waitTime: "8 min",
      chargingTime: "30 min",
      speed: "75kW",
      rating: 4.2,
      coords: { x: 75, y: 65 },
      color: "bg-orange-500"
    }
  ];

  const MapView = () => (
    <div className="relative h-full bg-gray-100">
      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 z-50 pt-2 pb-1 px-4">
        <div className="flex justify-between items-center text-black text-sm font-medium">
          <span>{currentTime}</span>
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div className="w-1 h-3 bg-black rounded-sm"></div>
              <div className="w-1 h-3 bg-black rounded-sm"></div>
              <div className="w-1 h-3 bg-black rounded-sm"></div>
              <div className="w-1 h-3 bg-gray-400 rounded-sm"></div>
            </div>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M17 4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM5 2h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" clipRule="evenodd" />
            </svg>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Map background with grid pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-gray-50">
        {/* Grid lines to simulate map */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          {Array.from({length: 20}).map((_, i) => (
            <g key={i}>
              <line x1={`${i * 5}%`} y1="0%" x2={`${i * 5}%`} y2="100%" stroke="#ccc" strokeWidth="1"/>
              <line x1="0%" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`} stroke="#ccc" strokeWidth="1"/>
            </g>
          ))}
        </svg>
        
        {/* Roads */}
        <div className="absolute top-1/3 left-0 right-0 h-1 bg-white shadow-sm"></div>
        <div className="absolute top-2/3 left-0 right-0 h-1 bg-white shadow-sm"></div>
        <div className="absolute top-0 bottom-0 left-1/4 w-1 bg-white shadow-sm"></div>
        <div className="absolute top-0 bottom-0 right-1/3 w-1 bg-white shadow-sm"></div>

        {/* Charging stations on map */}
        {chargingStations.map(station => (
          <button
            key={station.id}
            className={`absolute w-8 h-8 ${station.color} rounded-full shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 z-10`}
            style={{
              left: `${station.coords.x}%`,
              top: `${station.coords.y}%`
            }}
            onClick={() => setSelectedCharger(station)}
          >
            <Zap className="w-4 h-4 text-white" />
            {station.recommended && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white"></div>
            )}
          </button>
        ))}

        {/* Current location */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
          <div className="absolute inset-0 w-4 h-4 bg-blue-600 rounded-full animate-ping opacity-25"></div>
        </div>

        {/* Route line (for recommended charger) */}
        {showRecommendation && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d="M 50% 50% Q 55% 40% 60% 45%"
              stroke="#000"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8,4"
            />
          </svg>
        )}
      </div>

      {/* Top controls */}
      <div className="absolute top-16 left-4 z-20">
        <div className="bg-white rounded-full p-2 shadow-lg flex items-center space-x-2">
          <Battery className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium pr-1">{batteryLevel}%</span>
        </div>
      </div>

      <div className="absolute top-16 right-4 z-20">
        <button className="bg-white rounded-full p-2 shadow-lg">
          <Navigation className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Bottom recommendation card */}
      {showRecommendation && !selectedCharger && (
        <div className="absolute bottom-8 left-4 right-4 z-20">
          <div className="bg-white rounded-2xl shadow-xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium mr-2">
                      Charge+
                    </span>
                    <span className="text-xs text-gray-500">Recommended</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowRecommendation(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="mb-4">
              <div className="text-2xl font-bold text-black mb-1">€8.50</div>
              <div className="flex items-center text-sm">
                <Star className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-gray-600">4.6</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-green-600 font-medium">+€2.50 bonus</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-600">
                  0.8 km (1.1 mi) away
                </span>
              </div>
              <div className="text-gray-600 text-sm pl-6">
                Av. Dom Nuno Álvares Pereira, Almada
              </div>
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-600">
                  25 min charging time • No wait
                </span>
              </div>
            </div>

            <button 
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium text-lg"
              onClick={() => setSelectedCharger(chargingStations[0])}
            >
              Accept
            </button>
          </div>
        </div>
      )}

      {/* Selected charger detail card */}
      {selectedCharger && (
        <div className="absolute bottom-8 left-4 right-4 z-30">
          <div className="bg-white rounded-2xl shadow-xl">
            {/* Handle bar */}
            <div className="flex justify-center py-2">
              <div className="w-10 h-1 bg-gray-300 rounded"></div>
            </div>

            <div className="px-4 pb-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedCharger.name}</h3>
                  <p className="text-sm text-gray-600">{selectedCharger.address}</p>
                </div>
                <button onClick={() => setSelectedCharger(null)}>
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="mb-4">
                <div className="text-2xl font-bold text-black mb-1">{selectedCharger.estimatedCost}</div>
                <div className="flex items-center text-sm">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-gray-600 mr-3">{selectedCharger.rating}</span>
                  <span className="text-gray-600">{selectedCharger.price} • {selectedCharger.speed}</span>
                  {selectedCharger.bonus && (
                    <>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-green-600 font-medium">{selectedCharger.bonus}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                <div>
                  <div className="text-gray-500">Distance</div>
                  <div className="font-medium">{selectedCharger.distance}</div>
                </div>
                <div>
                  <div className="text-gray-500">Available</div>
                  <div className="font-medium">{selectedCharger.availability}</div>
                </div>
                <div>
                  <div className="text-gray-500">Wait time</div>
                  <div className="font-medium">{selectedCharger.waitTime}</div>
                </div>
              </div>

              {selectedCharger.bonus && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-green-800 font-medium">Earn {selectedCharger.bonus}</div>
                      <div className="text-green-600 text-sm">{selectedCharger.bonusReason}</div>
                    </div>
                    <Euro className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button className="w-full bg-black text-white py-3 rounded-xl font-medium">
                  Start Navigation
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium">
                  Reserve Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-sm mx-auto bg-gray-100 h-screen relative overflow-hidden">
      <MapView />
    </div>
  );
};

export default UberChargeApp;
