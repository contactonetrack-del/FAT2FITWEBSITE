# 🚀 QUICK DEPLOYMENT COMMANDS

## Immediate Security Fix (Run These NOW!)

```bash
# 1. Navigate to project
cd "d:\Software Design\Cool Website\CascadeProjects\7\pulse-fitness-matias-inspired-enhancements"

# 2. Install Firebase Tools (if needed)
npm install -g firebase-tools

# 3. Login to Firebase
firebase login

# 4. Deploy Security Rules (CRITICAL!)
firebase deploy --only firestore:rules

# 5. Verify deployment
# Go to: https://console.firebase.google.com
# Navigate to: Firestore Database > Rules
# Check timestamp is updated
```

---

## Setup .env File

```bash
# 1. Copy template
copy .env.example .env

# 2. Edit .env file with your actual API keys
# Use text editor to fill in values

# 3. Verify .env is ignored
git status
# Should NOT show .env in changes
```

---

## Add Admin Role to Your Account

### Option 1: Firebase Console (Easiest)

1. Go to https://console.firebase.google.com
2. Select **newfat2fitauth**
3. Firestore Database
4. Create document: `users/{your-uid}`
5. Add field: `role` = `admin`
6. Add field: `email` = `your@email.com`

### Option 2: Browser Console

```javascript
// Login to admin dashboard first, then run in console:
import {
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { db, auth } from "./firebase-config.js";

const user = auth.currentUser;
await setDoc(doc(db, "users", user.uid), {
  uid: user.uid,
  email: user.email,
  displayName: user.displayName || "Admin",
  role: "admin",
  subscription: "vip",
  createdAt: serverTimestamp(),
});

console.log("✅ Admin role added!");
```

---

## Test Security (Run in Browser Console)

```javascript
// Test 1: Public read (should work)
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

const posts = await getDocs(collection(db, "posts"));
console.log(posts.size > 0 ? "✅ Public read working" : "⚠️ No posts found");

// Test 2: Unauthorized write (should FAIL)
import { addDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

try {
  await addDoc(collection(db, "posts"), { title: "Test" });
  console.log("❌ SECURITY BREACH: Unauthorized write succeeded!");
} catch (error) {
  console.log("✅ Security working: Write blocked -", error.code);
}
```

---

## Firebase Commands Reference

```bash
# Deploy everything
firebase deploy

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy only hosting
firebase deploy --only hosting

# Deploy only functions
firebase deploy --only functions

# View deployment status
firebase deploy:status

# Rollback to previous deployment
firebase rollbacks:create

# Test rules locally
firebase emulators:start

# Check which project you're deploying to
firebase use
```

---

## Git Commands (After Security Fix)

```bash
# Check status
git status

# Add new files
git add firestore.rules
git add js/utils/sanitize.js
git add .env.example
git add SECURITY-DEPLOYMENT-GUIDE.md

# Commit changes
git commit -m "🔐 Add critical security fixes

- Implement Firestore security rules with RBAC
- Add input sanitization utilities
- Set up environment variables
- Update Firebase config to use .env
- Add deployment guide

CRITICAL: Database now protected from unauthorized access"

# Push to remote (AFTER verifying .env is not included!)
git push origin main
```

---

## Verification Checklist

Run these checks:

```bash
# 1. Check .gitignore includes .env
cat .gitignore | findstr ".env"
# Should show: .env

# 2. Verify .env exists locally
dir .env
# Should show file exists

# 3. Check Firebase project
firebase use
# Should show: newfat2fitauth

# 4. View current rules
firebase firestore:rules
# Should show your rules file

# 5. Check for sensitive data in git
git ls-files | findstr ".env"
# Should be EMPTY (no results)
```

---

## Emergency Rollback

If something breaks:

```bash
# 1. View previous deployments
firebase hosting:clone newfat2fitauth:PREVIOUS_RELEASE_ID newfat2fitauth

# 2. Or deploy previous rules
# Copy old firestore.rules content and run:
firebase deploy --only firestore:rules

# 3. Check Firebase Console for rollback options
# Go to: Firestore > Rules > View history
```

---

## Monitoring Commands

```bash
# View Firestore usage
firebase firestore:usage

# View logs
firebase functions:log

# Monitor hosting
firebase hosting:channel:list
```

---

## ⏱️ Total Time: ~30 minutes

1. Deploy rules: 5 min
2. Setup .env: 5 min
3. Add admin role: 5 min
4. Test security: 5 min
5. Git commit: 5 min
6. Verify: 5 min

---

## 📞 Support

If you encounter errors:

- Check Firebase Console > Firestore > Rules for syntax errors
- View browser console for detailed error messages
- Verify you're logged in with correct account
- Ensure Firebase project is selected correctly

---

## Next Immediate Steps

After security is fixed:

1. ✅ Review `SECURITY-DEPLOYMENT-GUIDE.md` for details
2. ⏭️ Read implementation plans (Parts 1-6)
3. ⏭️ Start with responsive design fixes
4. ⏭️ Add SEO meta tags
5. ⏭️ Build user dashboard

**Priority: Deploy security rules TODAY!** 🚨
