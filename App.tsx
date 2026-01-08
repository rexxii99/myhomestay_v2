
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ListingCard } from './components/ListingCard';
import { Listing, User, Booking } from './types';
import { listingService } from './services/listingService';
import { MOCK_USERS, AMENITIES } from './constants';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [listings, setListings] = useState<Listing[]>(listingService.getAllListings());
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [mode, setMode] = useState<'guest' | 'host'>('guest');
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[0]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  // Host state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrice, setAiPrice] = useState<{ suggestedPrice: number; reason: string } | null>(null);

  const categories = [
    { id: 'all', name: 'All', icon: '🌍' },
    { id: 'beach', name: 'Beachfront', icon: '🏖️' },
    { id: 'cabins', name: 'Cabins', icon: '🪵' },
    { id: 'trending', name: 'Trending', icon: '🔥' },
    { id: 'luxury', name: 'Amazing pools', icon: '🏊' },
    { id: 'islands', name: 'Islands', icon: '🏝️' },
    { id: 'skiing', name: 'Ski-in/out', icon: '⛷️' },
    { id: 'design', name: 'Design', icon: '✨' },
  ];

  const handleListingClick = (id: string) => {
    const listing = listingService.getListingById(id);
    if (listing) {
      setSelectedListing(listing);
    }
  };

  const handleBooking = () => {
    setBookingStatus('processing');
    setTimeout(() => {
      setBookingStatus('success');
      setTimeout(() => {
        setIsBookingModalOpen(false);
        setSelectedListing(null);
        setBookingStatus('idle');
      }, 2000);
    }, 1500);
  };

  const runSmartPrice = async () => {
    if (!selectedListing) return;
    setIsAiLoading(true);
    const result = await geminiService.suggestSmartPrice({
      city: selectedListing.location.city,
      type: selectedListing.type,
      amenities: selectedListing.amenities,
      bedrooms: selectedListing.bedrooms
    });
    setAiPrice(result);
    setIsAiLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        onSearch={() => { }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
        mode={mode}
        setMode={setMode}
      />

      {/* Category Filter */}
      <div className="sticky top-[81px] z-40 bg-white shadow-sm border-b border-gray-100 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-8 px-6 py-4 custom-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex flex-col items-center gap-1 min-w-max pb-2 border-b-2 transition-all ${activeTab === cat.id ? 'border-gray-800 text-gray-800' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200'
                }`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs font-semibold">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {mode === 'guest' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-10">
            {listings.map(listing => (
              <ListingCard key={listing.id} listing={listing} onClick={handleListingClick} />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Your Listings</h1>
              <button className="bg-rose-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors">
                Create new listing
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.slice(0, 3).map(listing => (
                <div key={listing.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <img src={listing.images[0]} alt="" className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{listing.title}</h3>
                    <p className="text-gray-500">{listing.location.city}, {listing.location.country}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-semibold">RM{listing.pricePerNight}/night</span>
                      <button
                        onClick={() => handleListingClick(listing.id)}
                        className="text-rose-500 font-semibold hover:underline"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Listing Detail Overlay/Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-[60] bg-white overflow-y-auto pt-16">
          <button
            onClick={() => { setSelectedListing(null); setAiPrice(null); }}
            className="fixed top-4 left-4 p-2 bg-white rounded-full shadow-lg border border-gray-200 z-[70] hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="max-w-6xl mx-auto px-6 pb-20">
            <h1 className="text-3xl font-bold mb-4">{selectedListing.title}</h1>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span>★ {selectedListing.rating}</span>
                <span>·</span>
                <span className="underline">{selectedListing.reviewCount} reviews</span>
                <span>·</span>
                <span className="underline">{selectedListing.location.city}, {selectedListing.location.country}</span>
              </div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
              <div className="md:col-span-2 md:row-span-2">
                <img src={selectedListing.images[0]} className="w-full h-full object-cover hover:opacity-90 cursor-pointer" alt="" />
              </div>
              <div className="hidden md:block">
                <img src={selectedListing.images[1] || selectedListing.images[0]} className="w-full h-full object-cover hover:opacity-90 cursor-pointer" alt="" />
              </div>
              <div className="hidden md:block">
                <img src={selectedListing.images[2] || selectedListing.images[0]} className="w-full h-full object-cover hover:opacity-90 cursor-pointer" alt="" />
              </div>
              <div className="hidden md:block">
                <img src={selectedListing.images[0]} className="w-full h-full object-cover hover:opacity-90 cursor-pointer" alt="" />
              </div>
              <div className="hidden md:block">
                <img src={selectedListing.images[1] || selectedListing.images[0]} className="w-full h-full object-cover hover:opacity-90 cursor-pointer" alt="" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-2xl font-semibold">Entire home hosted by Alex</h2>
                    <p className="text-gray-600">{selectedListing.maxGuests} guests · {selectedListing.bedrooms} bedrooms · {selectedListing.beds} beds · {selectedListing.bathrooms} baths</p>
                  </div>
                  <div className="w-14 h-14 bg-gray-200 rounded-full overflow-hidden">
                    <img src="https://picsum.photos/seed/u1/100" className="w-full h-full object-cover" alt="" />
                  </div>
                </div>

                <div className="py-8 space-y-6 border-b border-gray-200">
                  <div className="flex gap-4">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <h4 className="font-semibold">Professional Host</h4>
                      <p className="text-gray-500 text-sm">This host has 2,345 reviews for other places to stay.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-2xl">✨</span>
                    <div>
                      <h4 className="font-semibold">Self check-in</h4>
                      <p className="text-gray-500 text-sm">Check yourself in with the keypad.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-2xl">🗓️</span>
                    <div>
                      <h4 className="font-semibold">Free cancellation before Dec 20</h4>
                      <p className="text-gray-500 text-sm">Cancel up to 48 hours before your stay for a full refund.</p>
                    </div>
                  </div>
                </div>

                <div className="py-8 border-b border-gray-200">
                  <h3 className="text-xl font-semibold mb-4">About this place</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selectedListing.description}</p>
                </div>

                <div className="py-8">
                  <h3 className="text-xl font-semibold mb-6">What this place offers</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedListing.amenities.map(id => {
                      const amenity = AMENITIES.find(a => a.id === id);
                      return amenity ? (
                        <div key={id} className="flex items-center gap-4 text-gray-700">
                          <span className="text-2xl">{amenity.icon}</span>
                          <span>{amenity.name}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>

              {/* Booking Sidebar */}
              <div className="relative">
                <div className="sticky top-24 border border-gray-200 rounded-2xl shadow-xl p-6 bg-white">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-2xl font-bold">RM{selectedListing.pricePerNight}</span>
                      <span className="text-gray-600"> night</span>
                    </div>
                    <div className="text-sm font-semibold">
                      ★ {selectedListing.rating} · <span className="underline font-normal text-gray-500">{selectedListing.reviewCount} reviews</span>
                    </div>
                  </div>

                  {/* AI Smart Feature Button */}
                  <div className="mb-6 bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🤖</span>
                      <h4 className="text-purple-800 font-bold text-sm">AI Smart Advice</h4>
                    </div>
                    {aiPrice ? (
                      <div className="text-xs text-purple-700">
                        <p className="font-bold mb-1">Recommended: RM{aiPrice.suggestedPrice}/night</p>
                        <p>{aiPrice.reason}</p>
                      </div>
                    ) : (
                      <button
                        onClick={runSmartPrice}
                        disabled={isAiLoading}
                        className="w-full text-xs font-bold text-purple-600 hover:text-purple-800 disabled:opacity-50"
                      >
                        {isAiLoading ? 'Analyzing market...' : 'Get AI Pricing Analysis'}
                      </button>
                    )}
                  </div>

                  <div className="border border-gray-300 rounded-xl overflow-hidden mb-4">
                    <div className="flex border-b border-gray-300">
                      <div className="flex-1 p-3 border-r border-gray-300">
                        <label className="block text-[10px] font-bold uppercase">Check-in</label>
                        <input type="date" className="w-full text-sm outline-none" defaultValue="2023-12-25" />
                      </div>
                      <div className="flex-1 p-3">
                        <label className="block text-[10px] font-bold uppercase">Checkout</label>
                        <input type="date" className="w-full text-sm outline-none" defaultValue="2023-12-30" />
                      </div>
                    </div>
                    <div className="p-3">
                      <label className="block text-[10px] font-bold uppercase">Guests</label>
                      <select className="w-full text-sm outline-none">
                        <option>1 guest</option>
                        <option>2 guests</option>
                        <option>3 guests</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleBooking}
                    className="w-full bg-rose-500 text-white font-bold py-3 rounded-lg hover:bg-rose-600 transition-colors"
                  >
                    {bookingStatus === 'processing' ? 'Processing...' : bookingStatus === 'success' ? 'Confirmed! 🎉' : 'Reserve'}
                  </button>

                  <p className="text-center text-sm text-gray-500 mt-4">You won't be charged yet</p>

                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span className="underline">RM{selectedListing.pricePerNight} x 5 nights</span>
                      <span>RM{selectedListing.pricePerNight * 5}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span className="underline">Cleaning fee</span>
                      <span>RM85</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span className="underline">Service fee</span>
                      <span>RM120</span>
                    </div>
                    <div className="pt-4 border-t border-gray-200 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>RM{selectedListing.pricePerNight * 5 + 85 + 120}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal Simulation */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full"
            >
              ✕
            </button>
            <div className="px-6 py-4 border-b border-gray-200 text-center font-bold">
              Log in or sign up
            </div>
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Welcome to MyHomestay</h2>
              <div className="space-y-3">
                <input type="text" placeholder="Phone number" className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black" />
                <p className="text-xs text-gray-500">We'll call or text you to confirm your number. Standard message and data rates apply.</p>
                <button
                  onClick={() => setIsAuthModalOpen(false)}
                  className="w-full bg-rose-500 text-white font-bold py-3 rounded-lg"
                >
                  Continue
                </button>
              </div>
              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-sm text-gray-500">or</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
              <div className="space-y-3">
                <button className="w-full border border-gray-800 text-gray-800 font-semibold py-3 rounded-lg flex items-center justify-center gap-4 hover:bg-gray-50">
                  <span className="text-lg">f</span> Continue with Facebook
                </button>
                <button className="w-full border border-gray-800 text-gray-800 font-semibold py-3 rounded-lg flex items-center justify-center gap-4 hover:bg-gray-50">
                  <span className="text-lg">G</span> Continue with Google
                </button>
                <button className="w-full border border-gray-800 text-gray-800 font-semibold py-3 rounded-lg flex items-center justify-center gap-4 hover:bg-gray-50">
                  <span className="text-lg"></span> Continue with Apple
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-12 px-6 md:px-12 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:underline cursor-pointer">Help Center</li>
              <li className="hover:underline cursor-pointer">AirCover</li>
              <li className="hover:underline cursor-pointer">Anti-discrimination</li>
              <li className="hover:underline cursor-pointer">Disability support</li>
              <li className="hover:underline cursor-pointer">Cancellation options</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Hosting</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:underline cursor-pointer">MyHomestay your home</li>
              <li className="hover:underline cursor-pointer">AirCover for Hosts</li>
              <li className="hover:underline cursor-pointer">Hosting resources</li>
              <li className="hover:underline cursor-pointer">Community forum</li>
              <li className="hover:underline cursor-pointer">Hosting responsibly</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">MyHomestay</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:underline cursor-pointer">Newsroom</li>
              <li className="hover:underline cursor-pointer">New features</li>
              <li className="hover:underline cursor-pointer">Careers</li>
              <li className="hover:underline cursor-pointer">Investors</li>
              <li className="hover:underline cursor-pointer">Gift cards</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Social</h4>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">𝕏</div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">IG</div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">FB</div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-300 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div className="flex flex-wrap justify-center gap-4">
            <span>© 2024 MyHomestay, Inc.</span>
            <span className="hover:underline cursor-pointer">Privacy</span>
            <span className="hover:underline cursor-pointer">Terms</span>
            <span className="hover:underline cursor-pointer">Sitemap</span>
          </div>
          <div className="flex items-center gap-4 font-semibold">
            <span>🌐 English (MY)</span>
            <span>RM MYR</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
