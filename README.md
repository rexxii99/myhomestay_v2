
# MyHomestay 🏠

A high-performance, AI-powered travel and hospitality platform inspired by Airbnb. Built with React, TypeScript, and Tailwind CSS, featuring an MVC architecture and Gemini AI integration for smart pricing and automated descriptions.

## ✨ Features

- **Guest Side**: Search by destination, real-time availability checking, and instant booking workflows.
- **Host Side**: Listing management dashboard with AI-powered "Smart Pricing" using Google Gemini.
- **AI Integration**: Leverages `gemini-3-flash-preview` for market analysis and listing optimization.
- **MVC Architecture**: Clean separation of concerns with dedicated Services (Controllers), Types (Models), and Components (Views).
- **Responsive Design**: Fully mobile-optimized UI using Tailwind CSS.

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI**: @google/genai (Gemini API)
- **Icons**: Emoji-based & Heroicons

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/myhomestay.git
   cd myhomestay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   API_KEY=your_google_gemini_api_key
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `/components`: Reusable UI views (Navbar, ListingCard, etc.)
- `/services`: Business logic and API controllers (ListingService, GeminiService)
- `/types.ts`: TypeScript interfaces and domain models
- `/constants.tsx`: Mock data and configuration constants

## 📄 License
MIT
