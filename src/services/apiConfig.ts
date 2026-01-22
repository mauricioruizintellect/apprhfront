const isProduction = window.location.href.includes('intellectsystem')

export const API_URL = isProduction
  ? 'https://apprhbackend-v0rz.onrender.com'
  : 'https://apprhbackend-v0rz.onrender.com'
