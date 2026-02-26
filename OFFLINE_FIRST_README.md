# Offline-First Mobile App - README

## 🎯 Overview

This project has been enhanced with offline-first capabilities, allowing teachers to use the app reliably even with unstable internet connectivity. The app now works as an Android APK with local data storage and automatic synchronization.

## ✨ Key Features

### Offline Capabilities
- ✅ Mark attendance without internet
- ✅ Add exam marks offline
- ✅ Record student behavior offline
- ✅ Add intervention notes offline
- ✅ View cached dashboards and analytics
- ✅ Automatic sync when internet returns

### User Experience
- 📱 Native Android app (APK)
- 🔄 Real-time sync status indicator
- 📊 Pending changes counter
- ⏰ Last sync timestamp
- 🔔 Sync notifications
- 📵 Clear offline mode indicator

### Technical Features
- 💾 SQLite local database
- 🔄 Automatic background sync
- 📡 Network connectivity detection
- 🔁 Retry mechanism for failed syncs
- 🗂️ Sync queue management
- 📈 Conflict resolution

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│           React UI Layer                │
│  (Components, Pages, Contexts)          │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Service Layer                   │
│  (Business Logic, API Calls)            │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│       Repository Layer                  │
│  (Data Access, CRUD Operations)         │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼─────┐   ┌─────▼──────┐
│   SQLite   │   │ Sync Queue │
│  Database  │   │  Manager   │
└────────────┘   └─────┬──────┘
                       │
                ┌──────▼──────┐
                │   Backend   │
                │     API     │
                └─────────────┘
```

## 📁 Project Structure

```
proactive-education-assistant/
├── src/
│   ├── database/
│   │   ├── schema.js              # SQLite schema definitions
│   │   └── db.js                  # Database service
│   │
│   ├── repositories/
│   │   ├── BaseRepository.js      # Base CRUD operations
│   │   ├── StudentRepository.js   # Student data access
│   │   ├── AttendanceRepository.js
│   │   ├── MarksRepository.js
│   │   ├── BehaviorRepository.js
│   │   ├── InterventionRepository.js
│   │   └── SyncQueueRepository.js
│   │
│   ├── sync/
│   │   ├── NetworkListener.js     # Network status detection
│   │   └── SyncManager.js         # Sync orchestration
│   │
│   ├── services/
│   │   ├── apiService.js          # API communication
│   │   └── DataDownloadService.js # Initial data download
│   │
│   ├── hooks/
│   │   ├── useNetworkStatus.js    # Network status hook
│   │   └── useSyncStatus.js       # Sync status hook
│   │
│   └── components/
│       └── common/
│           ├── OfflineIndicator.jsx
│           └── SyncStatusBar.jsx
│
├── capacitor.config.ts            # Capacitor configuration
├── android/                       # Native Android project
└── package.json                   # Dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Java JDK 17+
- Android Studio (for APK building)

### Installation

**Option 1: Automated Setup (Recommended)**

Windows:
```cmd
setup-offline-first.bat
```

Mac/Linux:
```bash
chmod +x setup-offline-first.sh
./setup-offline-first.sh
```

**Option 2: Manual Setup**

```bash
# 1. Install dependencies
cd proactive-education-assistant
npm install

# 2. Add Android platform
npx cap add android

# 3. Build React app
npm run build

# 4. Sync with Capacitor
npx cap sync

# 5. Open in Android Studio
npx cap open android
```

### Building APK

**Debug APK (for testing):**
```bash
cd android
./gradlew assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`

**Release APK (for production):**
```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

## 📖 Usage Guide

### For Teachers

1. **First Time Setup**
   - Install APK on Android device
   - Login with credentials (requires internet)
   - Wait for initial data download
   - App is now ready for offline use

2. **Offline Usage**
   - Mark attendance as usual
   - Add marks for exams
   - Record student behavior
   - Add intervention notes
   - All changes saved locally

3. **Synchronization**
   - Automatic when internet available
   - Manual sync via "Sync Now" button
   - View pending changes count
   - Check last sync time

4. **Offline Indicators**
   - Yellow banner: "Offline Mode"
   - Orange badge: Pending changes count
   - Green checkmark: Last sync time

### For Developers

1. **Making Changes**
   ```bash
   # Edit code
   npm run dev
   
   # Build for mobile
   npm run build
   npx cap sync
   
   # Test in Android Studio
   npx cap open android
   ```

2. **Database Operations**
   ```javascript
   import StudentRepository from './repositories/StudentRepository';
   
   // Get all students
   const students = await StudentRepository.findAll();
   
   // Get students by class
   const classStudents = await StudentRepository.findByClass(classId);
   
   // Create student
   const student = await StudentRepository.create({
     name: 'John Doe',
     class_id: 'class-123',
     // ...
   });
   ```

3. **Sync Queue**
   ```javascript
   import SyncQueueRepository from './repositories/SyncQueueRepository';
   
   // Add to sync queue
   await SyncQueueRepository.addToQueue('attendance', 'CREATE', {
     student_id: 'student-123',
     date: '2026-02-26',
     status: 'present',
   });
   
   // Get pending count
   const count = await SyncQueueRepository.getUnsyncedCount();
   ```

4. **Network Status**
   ```javascript
   import useNetworkStatus from './hooks/useNetworkStatus';
   
   function MyComponent() {
     const { isOnline } = useNetworkStatus();
     
     return (
       <div>
         {isOnline ? 'Online' : 'Offline'}
       </div>
     );
   }
   ```

5. **Sync Status**
   ```javascript
   import useSyncStatus from './hooks/useSyncStatus';
   
   function MyComponent() {
     const { isSyncing, pendingCount, triggerSync } = useSyncStatus();
     
     return (
       <div>
         <p>Pending: {pendingCount}</p>
         <button onClick={triggerSync}>Sync Now</button>
       </div>
     );
   }
   ```

## 🔧 Configuration

### API URL

Edit `.env` file:

```env
# Development
VITE_API_URL=http://localhost:5000/api

# Production
VITE_API_URL=https://your-production-api.com/api
```

### App Configuration

Edit `capacitor.config.ts`:

```typescript
const config: CapacitorConfig = {
  appId: 'com.proactiveedu.assistant',
  appName: 'Proactive Education Assistant',
  webDir: 'dist',
  // ...
};
```

### Database Schema

Edit `src/database/schema.js` to modify tables.

After changes, users need to:
1. Uninstall old app
2. Install new version
3. Login again (downloads fresh data)

## 🧪 Testing

### Test Offline Functionality

1. Install APK on device
2. Login (requires internet)
3. Enable Airplane Mode
4. Test all features:
   - Mark attendance ✓
   - Add marks ✓
   - Record behavior ✓
   - Add interventions ✓
5. Disable Airplane Mode
6. Verify automatic sync ✓

### Test Sync Mechanism

1. Make changes offline
2. Check pending count increases
3. Go online
4. Verify automatic sync
5. Check pending count becomes 0
6. Verify data in backend

## 📊 Monitoring

### Sync Statistics

```javascript
import syncManager from './sync/SyncManager';

const stats = await syncManager.getStatistics();
console.log(stats);
// {
//   total_items: 150,
//   unsynced_count: 5,
//   synced_count: 145,
//   failed_count: 0
// }
```

### Database Statistics

```javascript
import dbService from './database/db';

const stats = await dbService.getStats();
console.log(stats);
// {
//   students: 487,
//   attendance: 12450,
//   marks: 3200,
//   behavior: 850,
//   interventions: 120
// }
```

## 🐛 Troubleshooting

### Common Issues

**Issue: App crashes on startup**
- Solution: Check Android logs in Logcat
- Verify database initialization
- Check permissions in AndroidManifest.xml

**Issue: Sync not working**
- Solution: Check network status
- Verify API URL is correct
- Check backend is running
- Review sync queue for errors

**Issue: Data not persisting**
- Solution: Check SQLite permissions
- Verify database initialization
- Check repository operations

**Issue: APK build fails**
- Solution: Clean and rebuild
  ```bash
  cd android
  ./gradlew clean
  ./gradlew build
  ```

## 📚 Documentation

- [Implementation Plan](./OFFLINE_FIRST_IMPLEMENTATION_PLAN.md) - Detailed technical plan
- [Setup Guide](./OFFLINE_FIRST_SETUP_GUIDE.md) - Complete setup instructions
- [Capacitor Docs](https://capacitorjs.com) - Capacitor framework
- [SQLite Plugin](https://github.com/capacitor-community/sqlite) - SQLite plugin docs

## 🔐 Security

- JWT tokens stored securely
- SQLite database on device storage
- HTTPS for API communication
- No sensitive data in logs
- Keystore for APK signing

## 📈 Performance

- Database indexed for fast queries
- Batch sync operations
- Lazy loading of data
- Optimized React rendering
- Minimal APK size (~15MB)

## 🎯 Roadmap

- [ ] Biometric authentication
- [ ] Database encryption
- [ ] Offline ML predictions
- [ ] Photo attachments
- [ ] Voice notes
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Tablet optimization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

[Your License Here]

## 📞 Support

For issues or questions:
- Email: support@proactiveedu.com
- GitHub Issues: [Your Repo URL]
- Documentation: [Your Docs URL]

---

**Version**: 1.0.0  
**Last Updated**: February 26, 2026  
**Status**: Production Ready ✅
