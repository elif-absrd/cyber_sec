# Frontend Pages Update Guide

## Overview
This document explains how to update all frontend pages to work with real API data instead of hardcoded values.

## Current Status

### ✅ Working Pages (Using Real API Data)
1. **Dashboard.tsx** - Already updated in FirewallDashboard component
   - Fetches real firewall status from `/api/firewall/status`
   - Controls services via `/api/firewall/{service}/{action}`
   - Controls ports via `/api/firewall/port/{port}/{action}`
   - Blocks domains via `/api/domain/block`

### ❌ Pages Needing Updates (Currently Hardcoded)
1. **Logs.tsx** - Hardcoded log entries
2. **Rules.tsx** - Hardcoded firewall rules
3. **Ports.tsx** - Hardcoded port/service list
4. **Settings.tsx** - No backend integration

---

## Required Updates

### 1. Logs.tsx - Show Real Firewall Activity

**What it needs:**
- Fetch firewall rules from `/api/firewall/status`
- Parse UFW output into readable log format
- Show ALLOW/DENY rules with timestamps
- Filter and search functionality

**API Integration:**
```typescript
const fetchLogs = async () => {
  const response = await fetch('http://localhost:8000/api/firewall/status');
  const data = await response.json();
  
  // Parse UFW status into log entries
  const logs = parseUFWStatus(data.rules);
  setLogs(logs);
};
```

**Changes Needed:**
- Remove hardcoded `logs` state initialization
- Add `useEffect` to fetch on component mount
- Parse UFW status text into structured log entries
- Keep existing filter/search UI (it's already good)

---

### 2. Rules.tsx - Manage Firewall Rules

**What it needs:**
- Fetch current rules from `/api/firewall/status`
- Add new rules via `/api/firewall/port/{port}/{action}`
- Delete rules via UFW
- Toggle rule status (enable/disable)

**API Integration:**
```typescript
const fetchRules = async () => {
  const response = await fetch('http://localhost:8000/api/firewall/status');
  const data = await response.json();
  const parsed = parseRules(data.rules);
  setRules(parsed);
};

const addRule = async (port, protocol, action) => {
  await fetch(`http://localhost:8000/api/firewall/port/${port}/${action}`, {
    method: 'POST'
  });
  fetchRules(); // Refresh
};
```

**Changes Needed:**
- Remove hardcoded `rules` array
- Parse UFW status into rule objects
- Connect "Add Rule" dialog to API
- Implement delete/toggle via API calls

---

### 3. Ports.tsx - Service & Port Management

**What it needs:**
- Show real status of common services (HTTP, HTTPS, SSH, DNS)
- Toggle services via `/api/firewall/{service}/{action}`
- Manage custom ports via `/api/firewall/port/{port}/{action}`
- Real-time status updates

**API Integration:**
```typescript
const fetchServiceStatus = async () => {
  const response = await fetch('http://localhost:8000/api/firewall/status');
  const data = await response.json();
  
  // Determine which services are blocked/allowed
  const status = parseServiceStatus(data.rules);
  updateServices(status);
};

const toggleService = async (service, enabled) => {
  const action = enabled ? 'on' : 'off';
  await fetch(`http://localhost:8000/api/firewall/${service}/${action}`, {
    method: 'POST'
  });
  fetchServiceStatus();
};
```

**Changes Needed:**
- Remove hardcoded `services` state
- Fetch real service status from UFW
- Connect toggle switches to API
- Add custom port management (already in Dashboard, can reuse)

---

### 4. Settings.tsx - Configuration Management

**What it needs:**
- Backend API to save/load settings
- UFW configuration options
- User preferences
- API key management

**New Backend Endpoints Needed:**
```python
@app.get("/api/settings")
def get_settings():
    return load_settings()

@app.post("/api/settings")
def save_settings(settings: dict):
    save_to_file(settings)
    return {"status": "saved"}
```

**Changes Needed:**
- Create settings backend API
- Load settings on mount
- Save settings to backend
- Store in JSON file or database

---

## Implementation Plan

### Option 1: Quick Fix (Recommended for Demo)
**Just use the Dashboard page for everything**
- Dashboard already has all functionality working
- Shows firewall status, services, ports, domains
- No need to fix other pages immediately
- Focus on AI integration instead

### Option 2: Full Update (Better Long-term)
**Update all pages properly**
1. Create `frontend/src/services/firewallAPI.ts` helpers (partially done)
2. Update Logs.tsx to parse UFW status
3. Update Rules.tsx to manage rules via API
4. Update Ports.tsx to show real service status
5. Create Settings backend + frontend integration

---

## Quick Implementation

Since Dashboard is already working, here's what to do **right now**:

### Step 1: Hide Incomplete Pages
Update sidebar to only show working pages:

```typescript
// In AppSidebar.tsx or wherever navigation is defined
const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  // Comment out or remove these until they're ready:
  // { icon: FileText, label: "Logs", path: "/logs" },
  // { icon: Shield, label: "Rules", path: "/rules" },
  // { icon: Network, label: "Ports", path: "/ports" },
  // { icon: Settings, label: "Settings", path: "/settings" },
];
```

### Step 2: Use Dashboard for Demo
The Dashboard page (`FirewallDashboard.tsx`) already has:
- ✅ Real-time firewall status
- ✅ Service control (HTTP, HTTPS, SSH, DNS)
- ✅ Port management with validation
- ✅ Domain blocking
- ✅ Blocked domains list
- ✅ Error handling
- ✅ Loading states

This is **sufficient for a complete demo** of your firewall system!

---

## For Your Professor Demo

**What to Show (All Already Working):**

1. **Domain Blocking**
   - Block facebook.com
   - Show it's added to `/etc/hosts`
   - Show UFW rules created
   - Verify site is unreachable

2. **Service Control**
   - Toggle HTTP off → websites fail
   - Toggle HTTPS off → encrypted sites fail
   - Show bidirectional blocking (IN + OUT)

3. **Port Management**
   - Block port 3306 (MySQL)
   - Show validation (try port 0, 99999 → rejected)
   - Show protected ports (22, 8000, 8080 → can't block)

4. **Real-time Status**
   - Click Refresh → see current UFW rules
   - Show rule numbers, directions (IN/OUT)

**This demonstrates:**
- ✅ Full-stack development (React + FastAPI)
- ✅ System integration (UFW/iptables)
- ✅ Input validation & security
- ✅ Real-time updates
- ✅ Professional UI/UX
- ✅ Error handling

---

## Next Steps for AI Integration

Instead of fixing other pages, focus on:
1. ✅ Create AI agent (Q-Learning)
2. ✅ Add AI routes to backend
3. ✅ Create AI Dashboard component
4. ✅ Train model on simulated traffic
5. ✅ Demo auto-blocking threats

This is **more impressive** for a cybersecurity project than having all CRUD pages working.

---

## Conclusion

**Recommendation:** 
- Keep using Dashboard page (it works perfectly)
- Add AI integration (more impressive)
- Update other pages later if needed

**Quick Win:**
The Dashboard already provides complete firewall management with real API integration. That's enough for a strong demo!
