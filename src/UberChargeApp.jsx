import React, { useMemo, useState } from 'react';
import {
  MapPin,
  Zap,
  Clock,
  Star,
  Battery,
  Navigation,
  Wallet,
  ArrowLeft,
  X,
  ReceiptText,
  User,
  LifeBuoy,
  Inbox,
  Leaf,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const UberChargeApp = () => {
  const [selectedCharger, setSelectedCharger] = useState(null);
  const [batteryLevel] = useState(30);
  const [currentTime] = useState('9:41');
  const [showRecommendation, setShowRecommendation] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [view, setView] = useState('map'); // 'map' | 'wallet' | 'settings' | 'chargeplus'

  // ---- Reward points (1 € = 10 points)
  const POINTS_PER_EURO = 10;
  const parseEuro = (s) => {
    if (!s) return 0;
    const cleaned = String(s).replace(/[^\d.,-]/g, '').replace(',', '.');
    const val = parseFloat(cleaned);
    return isNaN(val) ? 0 : val;
  };
  const costToPoints = (costStr) => Math.round(parseEuro(costStr) * POINTS_PER_EURO);

  // Mock charging station data
  const chargingStations = [
    {
      id: 1,
      name: 'Supercharger Almada',
      address: 'Av. Dom Nuno Álvares Pereira, Almada',
      distance: '0.8 km',
      price: '€0.32/kWh',
      estimatedCost: '€8.50',
      availability: '3/8',
      waitTime: '0 min',
      chargingTime: '25 min',
      rating: 4.6,
      coords: { x: 60, y: 45 },
      recommended: true,
      sponsored: true,
      color: 'bg-green-500',
    },
    {
      id: 2,
      name: 'MOBI.E Porto',
      address: 'R. de Cedofeita, Porto',
      distance: '2.1 km',
      price: '€0.28/kWh',
      estimatedCost: '€7.20',
      availability: '6/8',
      waitTime: '0 min',
      chargingTime: '15 min',
      rating: 4.8,
      coords: { x: 45, y: 30 },
      color: 'bg-blue-500',
    },
    {
      id: 3,
      name: 'Continente Gaia',
      address: 'Rua Sara Afonso, V.N. Gaia',
      distance: '1.5 km',
      price: '€0.45/kWh',
      estimatedCost: '€12.40',
      availability: '2/6',
      waitTime: '8 min',
      chargingTime: '30 min',
      rating: 4.2,
      coords: { x: 75, y: 65 },
      color: 'bg-orange-500',
    },
  ];

  const recommendedStation = useMemo(
      () => chargingStations.find((s) => s.recommended) || chargingStations[0],
      []
  );
  const recommendedPoints = costToPoints(recommendedStation?.estimatedCost);

  // -------- Receipt modal (opens only on Start Navigation)
  const ReceiptModal = ({ station, onClose }) => {
    if (!station) return null;
    const amount = parseEuro(station.estimatedCost);
    const points = costToPoints(station.estimatedCost);

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40">
          <div className="w-full sm:w-[420px] rounded-t-2xl sm:rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <ReceiptText className="w-5 h-5 text-neutral-700" />
                <span className="font-semibold text-neutral-800">Uber Charge+ • Receipt</span>
              </div>
              <button onClick={onClose}>
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <div className="px-4 py-4">
              <div className="mb-2 text-sm text-neutral-600">{station.name}</div>
              <div className="rounded-xl border border-neutral-200 p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-600">Amount</span>
                  <span className="font-medium text-neutral-900">€{amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Rewards</span>
                  <span className="font-medium text-emerald-600">+{points} pts</span>
                </div>
                <div className="my-3 h-px bg-neutral-200" />
                <div className="flex justify-between text-base font-bold">
                  <span className="text-neutral-900">Total</span>
                  <span className="text-neutral-900">€{amount.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-3 text-xs text-neutral-500">
                One receipt in Uber wallet. Rewards auto-apply to future payouts.
              </div>

              <button
                  onClick={onClose}
                  className="mt-4 w-full rounded-xl bg-black text-white py-3 font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
    );
  };

  // ---------------- Wallet View ----------------
  const walletBalanceEuro = 10.53;

  // Reward entries from stations
  const rewardTx = chargingStations.map((s, i) => ({
    id: `rw-${i}`,
    type: 'points',
    title: 'Charge+ rewards',
    subtitle: s.name,
    points: costToPoints(s.estimatedCost),
  }));
  const walletTx = [
    rewardTx[0],
    { id: 'tx-2', type: 'cash', title: 'Purchase', subtitle: 'Today at 08:02', amount: -1.21 },
    rewardTx[1],
    rewardTx[2],
  ];
  const totalPoints = rewardTx.reduce((sum, t) => sum + t.points, 0);

  const WalletView = () => (
      <div className="relative h-full bg-white">
        {/* Top bar */}
        <div className="sticky top-0 left-0 right-0 z-50 pt-2 pb-3 px-4 bg-white">
          <div className="flex items-center justify-between text-black text-sm font-medium">
            <button className="flex items-center gap-2 -ml-1 p-1" onClick={() => setView('settings')} aria-label="Back">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold">Wallet</span>
            <span className="w-5" />
          </div>
        </div>

        {/* Content */}
        <div className="pb-6">
          {/* Balance card */}
          <div className="mx-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 shadow-sm">
            <div className="text-sm text-neutral-600 mb-1">Uber Cash</div>
            <div className="text-4xl font-black text-neutral-900">€{walletBalanceEuro.toFixed(2)}</div>
            <div className="mt-1 text-neutral-600">
              Tap Balance details to learn more about the types of your Uber Cash funds.
            </div>
            <button className="mt-4 inline-flex items-center rounded-full bg-black px-4 py-2 text-white font-semibold">
              Balance details
            </button>

            {/* Rewards balance pill */}
            <div className="mt-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-green-100 text-green-800 px-3 py-1.5 font-semibold">
              <Star className="w-4 h-4 text-green-600" />
              Rewards: {totalPoints} pts
            </span>
            </div>
          </div>

          {/* Transactions */}
          <div className="mt-8 px-4">
            <div className="text-lg font-bold text-neutral-900 mb-3">This month</div>
            <div className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 overflow-hidden">
              {walletTx.map((t) => (
                  <div key={t.id} className="flex items-center justify-between px-4 py-4 bg-white">
                    <div>
                      <div className="text-[15px] font-semibold text-neutral-900">
                        {t.type === 'points' ? 'Charge+ rewards' : t.title}
                      </div>
                      <div className="text-sm text-neutral-500">{t.subtitle}</div>
                    </div>
                    <div
                        className={
                          t.type === 'points'
                              ? 'text-[15px] font-semibold text-emerald-600'
                              : 'text-[15px] font-semibold text-neutral-900'
                        }
                    >
                      {t.type === 'points'
                          ? `+${t.points} pts`
                          : `${t.amount < 0 ? '-' : ''}€${Math.abs(t.amount).toFixed(2)}`}
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );

  // ---------------- Charge+ Info View (from ad) ----------------
  const ChargePlusView = () => (
      <div className="relative h-full bg-white">
        <div className="sticky top-0 left-0 right-0 z-50 pt-2 pb-3 px-4 bg-white">
          <div className="flex items-center justify-between text-black text-sm font-medium">
            <button className="flex items-center gap-2 -ml-1 p-1" onClick={() => setView('settings')} aria-label="Back">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold">Uber Charge+</span>
            <span className="w-5" />
          </div>
        </div>

        <div className="px-5 pt-4 pb-8 space-y-4">
          <div className="rounded-2xl border border-neutral-200 p-5 bg-neutral-50">
            <div className="flex items-center gap-2 text-xl font-bold">
              <Zap className="w-5 h-5 text-black" />
              Charge+ for Drivers
            </div>
            <ul className="mt-3 list-disc pl-5 text-[15px] text-neutral-800 space-y-1.5">
              <li>Cheaper sessions via in-app pricing and rewards.</li>
              <li>Faster routing to available chargers—no guessing.</li>
              <li>Certainty with reservations and transparent receipts.</li>
              <li>Points auto-credited to your wallet after each session.</li>
            </ul>
          </div>

          <button
              className="w-full rounded-xl bg-black text-white py-3 font-semibold"
              onClick={() => setView('map')}
          >
            Try it on the map
          </button>
        </div>
      </div>
  );

  // ---------------- Settings View ----------------
  const SettingsTile = ({ icon: Icon, label, onClick }) => (
      <button
          onClick={onClick}
          className="flex flex-col items-center justify-center w-[30%] min-w-[100px] aspect-[1.2/1] rounded-2xl bg-neutral-100 text-neutral-900 shadow-sm active:scale-[0.99]"
      >
        <Icon className="w-6 h-6 mb-2" />
        <span className="text-[15px] font-semibold text-center">{label}</span>
      </button>
  );

  const Row = ({ left, right, onClick, icon }) => (
      <button
          onClick={onClick}
          className="w-full flex items-center justify-between px-4 py-4 bg-white active:bg-neutral-50"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-[17px] text-neutral-900 font-semibold">{left}</span>
        </div>
        <div className="flex items-center gap-2">
          {right}
          <ChevronRight className="w-5 h-5 text-neutral-400" />
        </div>
      </button>
  );

  const SettingsView = () => (
      <div className="relative h-full bg-white">
        {/* Status bar style header */}
        <div className="sticky top-0 left-0 right-0 z-40 bg-white pt-2 px-4 pb-1">
          <div className="flex justify-between items-center text-sm text-black">
            <span>{currentTime}</span>
            <div className="flex items-center gap-2">
            <span className="flex gap-1">
              <span className="w-1 h-3 bg-black rounded-sm" />
              <span className="w-1 h-3 bg-black rounded-sm" />
              <span className="w-1 h-3 bg-black rounded-sm" />
              <span className="w-1 h-3 bg-gray-400 rounded-sm" />
            </span>
              <span>100%</span>
            </div>
          </div>
        </div>

        <div className="px-4 pt-2 pb-6">
          {/* Name Header with back arrow */}
          <div className="flex items-center justify-between mt-2 mb-4">
            <div className="flex items-center gap-3">
              <button
                  onClick={() => setView('map')}
                  className="p-1 -ml-2 rounded-full hover:bg-neutral-100"
                  aria-label="Back to map"
              >
                <ArrowLeft className="w-6 h-6 text-neutral-600" />
              </button>
              <h1 className="text-3xl font-extrabold text-neutral-900">Daniel Hamzeh</h1>
            </div>
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center shadow-inner">
              <User className="w-6 h-6 text-neutral-500" />
            </div>
          </div>


          {/* Tiles row */}
          <div className="flex items-center gap-3 mb-5">
            <SettingsTile icon={LifeBuoy} label="Help" onClick={() => {}} />
            <SettingsTile icon={Wallet} label="Wallet" onClick={() => setView('wallet')} />
            <SettingsTile icon={Inbox} label="Inbox" onClick={() => {}} />
          </div>

          {/* Charge+ Ad Card (clickable) */}
          <button
              onClick={() => setView('chargeplus')}
              className="w-full text-left rounded-2xl bg-neutral-100 p-4 mb-5 flex items-center justify-between active:scale-[0.99]"
          >
            <div>
              <div className="text-[17px] font-semibold text-neutral-900">Uber Charge+</div>
              <div className="text-neutral-600 mt-1">
                Earn rewards and charge faster with in-app reservations.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-black" />
              <ChevronRight className="w-5 h-5 text-neutral-400" />
            </div>
          </button>

          {/* List section */}
          <div className="rounded-2xl overflow-hidden border border-neutral-200">
            <Row
                left="Uber Cash"
                right={<span className="text-[17px] font-extrabold">€{walletBalanceEuro.toFixed(2)}</span>}
                onClick={() => setView('wallet')}
                icon={<Wallet className="w-5 h-5 text-neutral-700" />}
            />
            <div className="h-px bg-neutral-200" />
            <Row
                left="Estimated CO₂ savings"
                right={<span className="text-[17px] font-semibold">1.2 kg</span>}
                onClick={() => {}}
                icon={<Leaf className="w-5 h-5 text-neutral-700" />}
            />
          </div>

          {/* (Intentionally leaving out "Uber for Teens") */}
          <div className="mt-6 text-sm text-neutral-600 px-1">
            Family — manage accounts for riders you travel with.
          </div>
        </div>
      </div>
  );

  // ---------------- Map View ----------------
  const MapView = () => (
      <div className="relative h-full bg-gray-100">
        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 z-50 pt-2 pb-1 px-4">
          <div className="flex justify-between items-center text-black text-sm font-medium">
            <span>{currentTime}</span>
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <div className="w-1 h-3 bg-black rounded-sm" />
                <div className="w-1 h-3 bg-black rounded-sm" />
                <div className="w-1 h-3 bg-black rounded-sm" />
                <div className="w-1 h-3 bg-gray-400 rounded-sm" />
              </div>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fillRule="evenodd"
                    d="M17 4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM5 2h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
                    clipRule="evenodd"
                />
              </svg>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Map background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-gray-50">
          <svg className="absolute inset-0 w-full h-full opacity-20">
            {Array.from({ length: 20 }).map((_, i) => (
                <g key={i}>
                  <line x1={`${i * 5}%`} y1="0%" x2={`${i * 5}%`} y2="100%" stroke="#ccc" strokeWidth="1" />
                  <line x1="0%" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`} stroke="#ccc" strokeWidth="1" />
                </g>
            ))}
          </svg>
        </div>

        {/* Charging stations */}
        {chargingStations.map((station) => (
            <button
                key={station.id}
                className={`absolute w-8 h-8 ${station.color} rounded-full shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 z-10`}
                style={{ left: `${station.coords.x}%`, top: `${station.coords.y}%` }}
                onClick={() => setSelectedCharger(station)}
                title={station.name}
            >
              {station.sponsored && <span className="absolute -inset-2 rounded-full bg-emerald-300/40 blur-sm" />}
              <Zap className="w-4 h-4 text-white relative" />
              {station.recommended && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white" />
              )}
            </button>
        ))}

        {/* Battery pill */}
        <div className="absolute top-16 left-4 z-20">
          <div className="bg-white rounded-full px-3 py-1.5 shadow-lg flex items-center space-x-2">
            <Battery className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-black">{batteryLevel}%</span>
          </div>
        </div>

        {/* Top-right: Navigation + Wallet + Settings */}
        <div className="absolute top-16 right-4 z-20 flex gap-2">
          <button className="bg-white rounded-full p-2 shadow-lg">
            <Navigation className="w-5 h-5 text-gray-700" />
          </button>
          <button className="bg-white rounded-full p-2 shadow-lg" onClick={() => setView('wallet')} title="Wallet">
            <Wallet className="w-5 h-5 text-gray-700" />
          </button>
          <button className="bg-white rounded-full p-2 shadow-lg" onClick={() => setView('settings')} title="Settings">
            <User className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Recommendation card */}
        {showRecommendation && !selectedCharger && (
            <div className="absolute bottom-8 left-4 right-4 z-20">
              <div className="bg-white rounded-2xl shadow-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                      {recommendedStation.sponsored ? 'Sponsored' : 'Charge+'}
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
                  <div className="text-2xl font-bold text-black mb-1">{recommendedStation.estimatedCost}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-green-500" />
                    <span>{recommendedStation.rating}</span>
                    <span className="text-gray-400">•</span>
                    <span>{recommendedStation.price}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-green-600 font-medium whitespace-nowrap">
                  +{recommendedPoints} reward points
                </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">0.8 km (1.1 mi) away</span>
                  </div>
                  <div className="text-gray-600 text-sm pl-6">Av. Dom Nuno Álvares Pereira, Almada</div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">25 min charging time • No wait</span>
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
                <div className="flex justify-center py-2">
                  <div className="w-10 h-1 bg-gray-300 rounded" />
                </div>

                <div className="px-4 pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      {selectedCharger.sponsored && (
                          <span className="text-[11px] bg-emerald-50 border border-emerald-200 text-neutral-900 px-2 py-0.5 rounded-md font-semibold">
                      Sponsored
                    </span>
                      )}
                      {selectedCharger.recommended && (
                          <span className="ml-2 text-[11px] text-gray-500">Recommended</span>
                      )}
                      <h3 className="mt-1 text-lg font-bold text-gray-900">{selectedCharger.name}</h3>
                      <p className="text-sm text-gray-600">{selectedCharger.address}</p>
                    </div>
                    <button onClick={() => setSelectedCharger(null)}>
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="text-2xl font-bold text-black mb-1">{selectedCharger.estimatedCost}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 flex-nowrap overflow-hidden">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="shrink-0">{selectedCharger.rating}</span>
                      <span className="text-gray-400">•</span>
                      <span className="shrink-0">{selectedCharger.price}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-green-600 font-medium shrink-0 whitespace-nowrap">
                    +{costToPoints(selectedCharger.estimatedCost)} reward points
                  </span>
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

                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-green-800 font-medium">
                          Earn +{costToPoints(selectedCharger.estimatedCost)} reward points
                        </div>
                        <div className="text-green-600 text-sm">Calculated from estimated cost (1€ = 10 pts)</div>
                      </div>
                      <Star className="w-5 h-5 text-green-600" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                        className="w-full bg-black text-white py-3 rounded-xl font-medium"
                        onClick={() => setShowReceipt(true)}
                    >
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

        {/* Receipt overlay */}
        {showReceipt && (
            <ReceiptModal
                station={selectedCharger || recommendedStation}
                onClose={() => setShowReceipt(false)}
            />
        )}
      </div>
  );

  return (
      <div className="max-w-sm mx-auto bg-gray-100 h-screen relative overflow-hidden">
        {view === 'map' && <MapView />}
        {view === 'wallet' && <WalletView />}
        {view === 'settings' && <SettingsView />}
        {view === 'chargeplus' && <ChargePlusView />}
      </div>
  );
};

export default UberChargeApp;
