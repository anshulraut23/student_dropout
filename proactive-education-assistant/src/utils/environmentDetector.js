/**
 * Environment Detector
 * Detects which deployment mode the app is running in:
 * - APK: Native Android app (Capacitor)
 * - PWA: Progressive Web App (Installed)
 * - WEB: Regular website (Browser)
 */

/**
 * Detect the current environment
 * @returns {'APK' | 'PWA' | 'WEB'}
 */
export const detectEnvironment = () => {
  // Check if running in Capacitor (Native APK)
  if (typeof window !== 'undefined' && window.Capacitor) {
    return 'APK';
  }
  
  // Check if installed as PWA (Standalone mode)
  if (typeof window !== 'undefined') {
    // Standard PWA detection
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return 'PWA';
    }
    
    // iOS PWA detection
    if (window.navigator.standalone === true) {
      return 'PWA';
    }
  }
  
  // Default: Regular website
  return 'WEB';
};

/**
 * Check if app is running in offline-capable mode
 * @returns {boolean}
 */
export const isOfflineCapable = () => {
  const env = detectEnvironment();
  return env === 'APK' || env === 'PWA';
};

/**
 * Check if app is running in native mode
 * @returns {boolean}
 */
export const isNative = () => {
  return detectEnvironment() === 'APK';
};

/**
 * Get environment display name
 * @returns {string}
 */
export const getEnvironmentName = () => {
  const env = detectEnvironment();
  const names = {
    'APK': 'Native Android App',
    'PWA': 'Progressive Web App',
    'WEB': 'Website'
  };
  return names[env] || 'Unknown';
};

export default {
  detectEnvironment,
  isOfflineCapable,
  isNative,
  getEnvironmentName
};
