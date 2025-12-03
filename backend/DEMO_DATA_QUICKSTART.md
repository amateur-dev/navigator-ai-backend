# Quick Reference: Using Demo Data in Your Project

## 🚀 Quick Start

### Option 1: Use the Pre-Generated JSON
The 15 referrals are already generated and ready to use:
```bash
# Load demo data in your API
cat backend/temp/demo-referrals-15.json
```

### Option 2: Generate Fresh Demo Data
```bash
cd backend
node scripts/seed-demo-referrals.cjs
# Output → backend/temp/demo-referrals-15.json
```

### Option 3: Use the TypeScript Generator in Code
```typescript
import { generateMockReferral, generateMockReferrals } from './utils/mock-referral-generator';

// Generate single referral
const referral = generateMockReferral('Completed', { specialty: 'Cardiology' });

// Generate batch
const batch = generateMockReferrals(10);
```

---

## 📁 Files Generated

| File | Purpose | Size |
|------|---------|------|
| `src/utils/mock-referral-generator.ts` | Reusable TypeScript factory | 19 KB |
| `scripts/seed-demo-referrals.cjs` | Node.js script to generate 15 referrals | 19 KB |
| `temp/demo-referrals-15.json` | Pre-generated 15 referrals (ready to use) | 54 KB |
| `temp/DEMO_DATA_SUMMARY.md` | Complete documentation | 3.5 KB |

---

## 📊 Data Organization

### 15 Referrals split into 5 stages (3 each):

**Pending Referrals (9 total):**
- `ref-demo-01, ref-demo-02, ref-demo-03` - Just now referred (Intake only)
- `ref-demo-04, ref-demo-05, ref-demo-06` - Intake stage (Eligibility in progress)
- `ref-demo-07, ref-demo-08, ref-demo-09` - Eligibility check stage

**Active Referrals (6 total):**
- `ref-demo-10, ref-demo-11, ref-demo-12` - Scheduled (Ready for appointment)
- `ref-demo-13, ref-demo-14, ref-demo-15` - Completed (Full journey done)

---

## 🎨 Messaging Channels (3 referrals each)

- **SMS** - Text confirmations
- **Email** - Formal details  
- **WhatsApp** - Friendly chats
- **Phone** - Automated calls
- **In-App** - Notifications

---

## 📈 Each Referral Contains

### Profile Info
- Patient name, age, email
- Specialty, provider, facility
- Insurance plan, copay, coinsurance
- Urgency (routine/urgent/stat)
- No-show risk percentage

### Workflow Steps (5 stages)
```
Intake → Eligibility → Prior Auth → Scheduled → Completed
```
Each marked as: completed | current | upcoming

### Action Log
- System events (referral created)
- User actions (intake completed)
- Eligibility checks
- Prior authorization requests
- Scheduling updates
- Message events

### Messages
- Multi-channel (SMS, Email, WhatsApp, Phone, In-App)
- Directions (outbound/inbound)
- Status (delivered/read/failed)
- Timeline-aligned timestamps

---

## 🎬 For Demo Video

**Show progression through stages:**
1. Dashboard view all 15
2. Filter by status → show Pending (9) vs Scheduled (3) vs Completed (3)
3. Click on Pending referral → show steps, logs, minimal messages
4. Click on Scheduled → show full history, confirmation + reminder messages
5. Click on Completed → show full journey with feedback message

**Demonstrate message channels:**
- Filter or search for SMS referrals → show text communications
- Show WhatsApp referrals → display friendly emoji messages
- Email referrals → formal appointment details
- In-App → notification system

**Showcase real data:**
- Each referral has 20-30 years of realistic medical history
- Timestamps flow chronologically
- Message sequences follow real workflow

---

## 💻 Integration Examples

### Load into API Response
```typescript
app.get('/referrals', (c) => {
  const demoData = require('../temp/demo-referrals-15.json');
  return c.json(demoData);
});

app.get('/referral/:id', (c) => {
  const id = c.req.param('id');
  const demoData = require('../temp/demo-referrals-15.json');
  const referral = demoData.find(r => r.id === id);
  return c.json(referral);
});
```

### Load into Database
```typescript
const demoData = require('../temp/demo-referrals-15.json');
for (const referral of demoData) {
  await db.referral.create({ data: referral });
}
```

### Use in Tests
```typescript
import { generateMockReferral } from '../src/utils/mock-referral-generator';

test('should handle completed referrals', () => {
  const referral = generateMockReferral('Completed');
  expect(referral.status).toBe('Completed');
  expect(referral.steps.every(s => s.status === 'completed')).toBe(true);
});
```

---

## ✅ Verification

All 15 referrals are:
- ✓ Unique IDs (ref-demo-01 through ref-demo-15)
- ✓ Realistic patient data (names, ages, emails)
- ✓ Diverse specialties (10 different types)
- ✓ Varied urgency levels
- ✓ Different statuses and workflow stages
- ✓ Multiple messaging channels
- ✓ Chronologically consistent timestamps
- ✓ Complete action audit trails
- ✓ Realistic message histories

---

## 📞 Questions?

See `temp/DEMO_DATA_SUMMARY.md` for detailed documentation.
