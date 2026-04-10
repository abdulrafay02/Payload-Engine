# Payload Engine | Omni-Input Pricing Engine

Payload Engine is a high-speed, industrial-grade pricing engine designed for Sprinter van operators and freight dispatchers. It leverages AI to extract load data from raw text or screenshots and provides deterministic pricing quotes based on customizable vehicle limits and pricing constants.

## 🚀 Features

- **Live Demo**: [https://payload-engine.vercel.app/](https://payload-engine.vercel.app/)
- **Omni-Input Data Extraction**: 
  - **Data Ingest**: Paste raw text from load boards, emails, or messages.
  - **Vision Uplink**: Upload screenshots of load boards for automatic parameter extraction.
- **Deterministic Pricing Engine**: Calculates recommended bids, CPM (Cost Per Mile), fuel surcharges, and profit margins.
- **Audit Trail**: Maintains a local history of all quotes and their outcomes (Won/Lost).
- **Industrial UI**: A high-contrast, brutalist-inspired interface optimized for high-speed data entry and readability.
- **Custom Vehicle Configuration**: Change vehicle limits (weight and dimensions) dynamically through the UI to instantly recalculate quoting capacities and tailor AI intelligence.
- **AI Market Intelligence**: Get real-time route assessments and bid recommendations powered by Gemini AI.

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (formerly Framer Motion)
- **AI**: Google Gemini API (@google/genai)
- **Icons**: Lucide React

## 🔧 Configuration

The application uses several constants to calculate quotes. These can be adjusted in `lib/types.ts`:

- `DEFAULT_VEHICLE`: Define the starting vehicle profile, including its name, maximum weight, length, width, and height.
- `PRICING_CONSTANTS`: Define base CPM, deadhead CPM, minimum profit margin, and fuel surcharges.

## 🔑 Environment Variables

Create a `.env.local` file with the following:

```env
LLM_API_KEY=your_gemini_api_key_here
```

## 📦 Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## 🛡️ Security & Privacy

- **Local Storage**: All audit logs and session data are stored locally in the user's browser. No data is sent to a remote database.
- **AI Privacy**: Load data is sent to the Gemini API for extraction and insights but is not persisted by the application server.

## 📄 License

MIT
