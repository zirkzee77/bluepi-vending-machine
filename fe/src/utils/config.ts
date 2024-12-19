const CASH_CONFIG = {
  COINS: [
    { denomination: 1, color: '#B87333' },
    { denomination: 5, color: '#C0C0C0' },
    { denomination: 10, color: '#FFD700' }
  ],
  NOTES: [
    { denomination: 20, color: '#27AE60' },
    { denomination: 50, color: '#2980B9' },
    { denomination: 100, color: '#C0392B' },
    { denomination: 500, color: '#8E44AD' },
    { denomination: 1000, color: '#BDC3C7' }
  ]
}

const Config = {
  MediaUrl: import.meta.env.VITE_MEDIA_URL,
  ApiUrl: import.meta.env.VITE_API_URL,
  CashConfig: CASH_CONFIG
}

export default Config
