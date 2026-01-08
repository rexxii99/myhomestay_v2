
import { Listing } from '../types';
import { MOCK_LISTINGS } from '../constants';

// Simulated state management (In a real app, this would be a Redux store or DB)
let listings: Listing[] = [...MOCK_LISTINGS];

export const listingService = {
  getAllListings: () => listings,
  
  getListingById: (id: string) => listings.find(l => l.id === id),
  
  searchListings: (query: string, city?: string) => {
    return listings.filter(l => {
      const matchesQuery = l.title.toLowerCase().includes(query.toLowerCase()) || 
                          l.description.toLowerCase().includes(query.toLowerCase());
      const matchesCity = city ? l.location.city.toLowerCase() === city.toLowerCase() : true;
      return matchesQuery && matchesCity;
    });
  },

  createListing: (listingData: Partial<Listing>) => {
    const newListing = {
      ...listingData,
      id: `l${listings.length + 1}`,
      reviews: [],
      rating: 0,
      reviewCount: 0,
    } as Listing;
    listings = [...listings, newListing];
    return newListing;
  },

  deleteListing: (id: string) => {
    listings = listings.filter(l => l.id !== id);
  }
};
