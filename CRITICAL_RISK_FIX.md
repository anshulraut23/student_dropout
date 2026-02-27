# Critical Risk Level Fix

## Issue

Dashboard showed 3 critical risk students, but StudentListPage showed none (or displayed them as low risk).

## Root Cause

The StudentListPage component didn't have "critical" risk level in its `getRiskBadge` function. It only handled:
- high
- medium  
- low
- gathering

When a student had "critical" risk level, the badge would fall back to "low" styling, making critical students invisible.

## Solution

Updated `StudentListPage.jsx` to include "critical" risk level:

### 1. Added Critical to Badge Styles

```javascript
const styles = {
  critical: 'bg-red-100 text-red-800 border-red-200',  // NEW
  high: 'bg-orange-100 text-orange-800 border-orange-200',  // Changed from red
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200',
  gathering: 'bg-gray-100 text-gray-600 border-gray-200'
};
```

### 2. Added Critical to Labels

```javascript
const labels = {
  critical: t("teacher_dashboard.critical_risk", "Critical Risk"),  // NEW
  high: t("dashboard.high_risk", "High Risk"),
  medium: t("dashboard.medium_risk", "Medium Risk"),
  low: t("dashboard.low_risk", "Low Risk"),
  gathering: t("teacher_students.gathering_data", "⏳ Gathering Data")
};
```

### 3. Added Critical to Filter Dropdown

```javascript
<option value="critical">{t("teacher_dashboard.critical_risk", "Critical Risk")}</option>
```

## Risk Level Hierarchy

Now properly displays 4 risk levels:

1. **Critical** (Red) - Risk score ≥80%
2. **High** (Orange) - Risk score 60-79%
3. **Medium** (Yellow) - Risk score 30-59%
4. **Low** (Green) - Risk score <30%

## Color Coding

- **Critical**: Red background (most urgent)
- **High**: Orange background (changed from red to differentiate)
- **Medium**: Yellow background
- **Low**: Green background

## Testing

1. Restart frontend (Vite should auto-reload)
2. Navigate to Students page
3. Check that critical risk students now show with red badge
4. Use filter dropdown to filter by "Critical Risk"
5. Verify count matches Dashboard

## Files Modified

- `proactive-education-assistant/src/pages/teacher/StudentListPage.jsx`

## Related Components

These components already handle "critical" correctly:
- ✅ `DashboardPage.jsx` - Shows critical count
- ✅ `RiskBadge.jsx` - Has critical styling
- ✅ `PlainLanguageSummary.jsx` - Handles critical risk level
- ✅ `StudentRiskCard.jsx` - Displays critical properly

---

**Status**: ✅ Fixed
**Issue**: Critical risk students not showing in StudentListPage
**Solution**: Added critical risk level support to badge and filter
