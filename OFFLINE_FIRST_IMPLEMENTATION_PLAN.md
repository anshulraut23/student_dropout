# Offline-First Mobile App Implementation Plan

## 🎯 Mission
Convert the React web app into an offline-first Android APK that works reliably with unstable internet.

## 📋 Current Architecture
- **Frontend**: React + Vite
- **Backend**: Node.js/Express
- **Database**: Supabase (PostgreSQL)
- **ML Service**: Flask
- **Dependency**: Fully internet-dependent

## 🏗 Target Architecture
- **Frontend**: React + Capacitor (Android APK)
- **Local Storage**: SQLite (on-device)
- **Data Layer**: Service → Repository → Local DB + Sync Queue
- **Sync**: Background sync when internet available
- **Backend**: Unchanged (remains as sync server)

## 📦 Implementation Phases

### Phase 1: Capacitor Integration ✅
**Goal**: Convert React app to Android APK

**Tasks**:
1. Install Capacitor dependencies
2. Initialize Capacitor project
3. Configure Android platform
4. Add native plugins (Network, SQLite, Storage)
5. Update build configuration
6. Test APK generation

**Files to Create/Modify**:
- `capacitor.config.ts`
- `package.json` (add Capacitor deps)
- `vite.config.js` (update for Capacitor)

---

### Phase 2: Local Database Layer ✅
**Goal**: Add SQLite for offline data storage

**Tasks**:
1. Install SQLite plugin
2. Create database schema (mirrors Supabase)
3. Create database initialization service
4. Create migration system
5. Add database helper utilities

**Files to Create**:
- `src/database/schema.js` - SQLite schema definitions
- `src/database/db.js` - Database initialization & connection
- `src/database/migrations.js` - Schema migrations
- `src/database/queries.js` - Common SQL queries

**Schema Tables**:
- `users` - User authentication data
- `students` - Student records
- `classes` - Class information
- `subjects` - Subject data
- `attendance` - Attendance records
- `marks` - Exam marks
- `behavior` - Behavior records
- `interventions` - Intervention notes
- `risk_predictions` - Cached ML predictions
- `leaderboard` - Cached leaderboard data
- `sync_queue` - Pending changes to sync
- `sync_metadata` - Last sync timestamps

---

### Phase 3: Data Abstraction Layer ✅
**Goal**: Decouple UI from direct API calls

**Current Pattern** (❌):
```javascript
Component → axios.post('/api/attendance')
```

**New Pattern** (✅):
```javascript
Component → Service → Repository → Local DB + Sync Queue → Backend (when online)
```

**Tasks**:
1. Create Repository layer (data access)
2. Create Service layer (business logic)
3. Refactor existing services to use repositories
4. Add offline detection logic
5. Implement data caching strategy

**Files to Create**:
- `src/repositories/BaseRepository.js` - Base repository class
- `src/repositories/StudentRepository.js`
- `src/repositories/AttendanceRepository.js`
- `src/repositories/MarksRepository.js`
- `src/repositories/BehaviorRepository.js`
- `src/repositories/InterventionRepository.js`
- `src/services/OfflineService.js` - Offline detection & handling
- `src/services/CacheService.js` - Data caching logic

**Files to Modify**:
- `src/services/apiService.js` - Add repository integration
- All components using direct API calls

---

### Phase 4: Sync Queue System ✅
**Goal**: Track and sync offline changes

**Tasks**:
1. Create sync queue manager
2. Implement queue storage (SQLite)
3. Add conflict resolution logic
4. Create retry mechanism
5. Add sync status tracking

**Files to Create**:
- `src/sync/SyncQueue.js` - Queue management
- `src/sync/SyncManager.js` - Sync orchestration
- `src/sync/ConflictResolver.js` - Handle conflicts
- `src/sync/SyncStatus.js` - Track sync state

**Queue Record Structure**:
```javascript
{
  id: uuid,
  entity: 'attendance|marks|behavior|intervention',
  action: 'CREATE|UPDATE|DELETE',
  payload: {...},
  synced: false,
  retry_count: 0,
  created_at: timestamp,
  error: null
}
```

---

### Phase 5: Sync Engine ✅
**Goal**: Automatic background synchronization

**Tasks**:
1. Create network listener
2. Implement sync trigger logic
3. Add background sync worker
4. Create sync progress UI
5. Handle sync errors gracefully
6. Trigger ML recalculation after sync
7. Update leaderboard after sync

**Files to Create**:
- `src/sync/NetworkListener.js` - Detect connectivity
- `src/sync/SyncWorker.js` - Background sync process
- `src/components/SyncStatus.jsx` - Sync UI indicator
- `src/hooks/useNetworkStatus.js` - Network status hook
- `src/hooks/useSyncStatus.js` - Sync status hook

**Sync Flow**:
1. Network listener detects connection
2. Read unsynced records from queue
3. Send to backend (batch if possible)
4. Backend updates Supabase
5. ML service recalculates risk
6. Fetch updated predictions
7. Update local cache
8. Clear synced records
9. Update last_sync_time
10. Show success notification

---

### Phase 6: UI Updates ✅
**Goal**: Show offline status and sync info

**Tasks**:
1. Add offline mode indicator
2. Show pending changes count
3. Display last sync time
4. Add manual sync button
5. Show sync progress
6. Handle offline errors gracefully

**Components to Create**:
- `src/components/OfflineIndicator.jsx`
- `src/components/SyncStatusBar.jsx`
- `src/components/PendingChangesCount.jsx`

**Components to Modify**:
- All data entry forms (attendance, marks, behavior)
- Dashboard components
- Navigation bar

---

### Phase 7: Data Download on Login ✅
**Goal**: Pre-fetch all necessary data after authentication

**Tasks**:
1. Create data download service
2. Fetch all required entities
3. Store in local database
4. Show download progress
5. Handle download errors

**Files to Create**:
- `src/services/DataDownloadService.js`
- `src/components/DataDownloadProgress.jsx`

**Data to Download**:
- User profile
- Assigned classes
- Students in classes
- Subjects
- Recent attendance (last 30 days)
- Recent marks (current term)
- Behavior records (last 90 days)
- Interventions (active)
- Risk predictions (current)
- Leaderboard (current)

---

### Phase 8: Offline-First Features ✅
**Goal**: Enable core features to work offline

**Features**:
1. ✅ Mark Attendance (offline)
2. ✅ Add Marks (offline)
3. ✅ Record Behavior (offline)
4. ✅ Add Interventions (offline)
5. 📊 View Dashboard (cached data)
6. 📊 View Risk Predictions (cached)
7. 📊 View Leaderboard (cached)

**Offline Behavior**:
- Data entry: Save to local DB + queue
- Data viewing: Show cached data with timestamp
- Analytics: Show last synced data
- ML predictions: Show cached predictions
- Leaderboard: Show cached rankings

---

### Phase 9: Testing & Optimization ✅
**Goal**: Ensure reliability and performance

**Tasks**:
1. Test offline data entry
2. Test sync after reconnection
3. Test conflict resolution
4. Test data integrity
5. Optimize database queries
6. Optimize sync batch size
7. Test APK on real devices
8. Performance profiling

---

### Phase 10: Production Deployment ✅
**Goal**: Deploy to Play Store

**Tasks**:
1. Generate signed APK
2. Create app icons & splash screen
3. Write Play Store description
4. Add screenshots
5. Submit for review
6. Monitor crash reports
7. Plan updates

---

## 🔄 Data Flow Diagrams

### Online Mode
```
User Action
    ↓
Component
    ↓
Service Layer
    ↓
Repository Layer
    ↓
├─→ Local DB (cache)
└─→ Backend API
    ↓
Supabase
```

### Offline Mode
```
User Action
    ↓
Component
    ↓
Service Layer
    ↓
Repository Layer
    ↓
├─→ Local DB (save)
└─→ Sync Queue (add)
```

### Sync Process
```
Network Connected
    ↓
Sync Manager
    ↓
Read Sync Queue
    ↓
Send to Backend (batch)
    ↓
Backend → Supabase
    ↓
ML Recalculation
    ↓
Fetch Updated Data
    ↓
Update Local Cache
    ↓
Clear Queue
    ↓
Update UI
```

---

## 📊 Feature Matrix

| Feature | Online | Offline | Sync Required |
|---------|--------|---------|---------------|
| Login | ✅ Required | ❌ | N/A |
| Mark Attendance | ✅ | ✅ | ✅ |
| Add Marks | ✅ | ✅ | ✅ |
| Record Behavior | ✅ | ✅ | ✅ |
| Add Intervention | ✅ | ✅ | ✅ |
| View Dashboard | ✅ | 📊 Cached | ✅ |
| Risk Predictions | ✅ | 📊 Cached | ✅ |
| Leaderboard | ✅ | 📊 Cached | ✅ |
| ML Training | ✅ Required | ❌ | N/A |

---

## 🎯 Success Criteria

1. ✅ APK installs and runs on Android devices
2. ✅ Teachers can mark attendance offline
3. ✅ All offline changes sync when internet returns
4. ✅ No data loss during offline operation
5. ✅ Sync status clearly visible to users
6. ✅ App works smoothly with intermittent connectivity
7. ✅ Dashboard shows cached data with timestamps
8. ✅ ML predictions update after sync
9. ✅ Leaderboard updates after sync
10. ✅ Professional UI/UX for mobile

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Android Studio (for APK building)
- Java JDK 17+
- Existing React app running

### Installation Steps
```bash
# Phase 1: Install Capacitor
cd proactive-education-assistant
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
npx cap init

# Phase 2: Add SQLite
npm install @capacitor-community/sqlite
npm install sql.js

# Phase 3: Add Network Plugin
npm install @capacitor/network

# Phase 4: Initialize Android
npx cap add android

# Phase 5: Build and Sync
npm run build
npx cap sync
npx cap open android
```

---

## 📝 Notes

- Backend remains unchanged
- ML service remains unchanged
- Supabase schema remains unchanged
- Only frontend architecture changes
- Internet required only for: Login, Initial data download, Sync
- All data entry works offline
- Analytics show cached data when offline

---

## 🔥 Next Steps

1. Start with Phase 1 (Capacitor Integration)
2. Test APK generation
3. Move to Phase 2 (SQLite setup)
4. Implement incrementally
5. Test after each phase
6. Deploy when all phases complete

---

**Last Updated**: February 26, 2026
**Status**: Ready to implement
