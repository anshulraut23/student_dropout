// PasswordUtils.js
// Simple password hashing utility for localStorage implementation
// Note: In production, use bcrypt or similar cryptographic hash

class PasswordUtils {
  // Simple hash function for demo purposes
  hash(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  }

  verify(password, hashedPassword) {
    return this.hash(password) === hashedPassword;
  }
}

export default new PasswordUtils();
