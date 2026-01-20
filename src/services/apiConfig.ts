const isProduction = window.location.href.includes('intellectsystem')

export const API_URL = isProduction
  ? 'https://work.intellectsystem.net/api'
  : 'https://work.intellectsystem.net/api'
