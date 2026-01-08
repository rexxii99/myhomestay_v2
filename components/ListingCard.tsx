
import React from 'react';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  onClick: (id: string) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  return (
    <div 
      className="group cursor-pointer transition-transform duration-200 hover:-translate-y-1"
      onClick={() => onClick(listing.id)}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-200">
        <img 
          src={listing.images[0]} 
          alt={listing.title} 
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <button className="absolute right-3 top-3 rounded-full p-2 text-white hover:bg-black/20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 fill-black/20 stroke-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </button>
      </div>
      
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 truncate">{listing.location.city}, {listing.location.country}</h3>
          <div className="flex items-center gap-1 text-sm">
            <span>★</span>
            <span>{listing.rating > 0 ? listing.rating.toFixed(2) : 'New'}</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm line-clamp-1">{listing.title}</p>
        <p className="text-gray-500 text-sm mb-1">Available soon</p>
        <div className="mt-1">
          <span className="font-semibold text-gray-900">${listing.pricePerNight}</span>
          <span className="text-gray-600 text-sm"> night</span>
        </div>
      </div>
    </div>
  );
};
