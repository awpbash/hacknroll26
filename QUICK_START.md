# Quick Start Guide

## Testing the New Features

### 1. Logo Integration

**Navigate to Learn Page:**
```
http://localhost:3000/learn
```

You'll see:
- Provider tabs with logos (AWS, Azure, GCP, RunPod, MongoDB)
- Click each tab to see services for that provider
- Logos will be white when active, colored when inactive

**Try a Challenge:**
```
http://localhost:3000/challenge/1
```

You'll see:
- Provider selector buttons with logos
- Drag services to canvas and see their icons/logos
- AWS EC2 will show EC2 logo, Lambda shows Lambda logo, etc.

---

### 2. Existing Infrastructure Challenges

**Challenge #8 - Add Caching (Easiest):**
```
http://localhost:3000/challenge/8
```

What you'll see:
1. **Left Panel:**
   - "Existing Infrastructure" section showing Lambda and RDS
   - Each with costs and specs

2. **Canvas:**
   - Lambda (API Handler) already placed
   - RDS (PostgreSQL DB) already placed
   - Connected with an edge
   - Both have green "🏢 Existing" badges

3. **Your Task:**
   - Drag ElastiCache (Redis) from sidebar
   - Place it between Lambda and RDS
   - Connect Lambda → ElastiCache → RDS
   - Fill in input/output specs
   - Submit!

**Sample Solution:**
```
Services to Add:
- ElastiCache (Redis) - $25/mo

Connections:
Lambda → ElastiCache (cache lookup)
ElastiCache → RDS (cache miss)
RDS → Lambda (data return)

Input/Output:
- ElastiCache Input: "Cache keys, GET/SET operations"
- ElastiCache Output: "Cached data or cache miss signal"

Total Cost: $53 (existing) + $25 (new) = $78/mo ✅ (under $93 budget)
```

---

**Challenge #7 - Add Search:**
```
http://localhost:3000/challenge/7
```

Existing:
- S3 (Product Images)
- DynamoDB (Product Catalog)

Your task: Add full-text search

**Sample Solution:**
```
Services to Add:
- OpenSearch - $35/mo
- Lambda (Sync Function) - $5/mo
- Lambda (Search API) - $5/mo

Connections:
DynamoDB → Lambda (Sync) → OpenSearch
API Gateway → Lambda (Search) → OpenSearch

Total: $65 (existing) + $45 (new) = $110/mo ❌ (over budget!)
Better: Use just OpenSearch + 1 Lambda = $75 total ✅
```

---

**Challenge #10 - Add AI Image Recognition:**
```
http://localhost:3000/challenge/10
```

Existing:
- S3 (Photo Storage)
- DynamoDB (Photo Metadata)

Your task: Automatic tagging with AI

**Sample Solution:**
```
Services to Add:
- Lambda (Image Processor) - $8/mo
- Rekognition - $30/mo (pay per use)

Connections:
S3 → Lambda (trigger on upload)
Lambda → Rekognition (analyze image)
Rekognition → Lambda (return labels)
Lambda → DynamoDB (store tags)

Trigger: S3 Event Notification on PUT
Process: Async processing within 10 seconds
Update: DynamoDB with detected tags

Total: $65 (existing) + $38 (new) = $103/mo ✅
```

---

## Tips for Success

### Working with Existing Infrastructure:

1. **Don't try to edit existing services**
   - They're locked (disabled inputs)
   - You can't resize or delete them
   - Focus on adding NEW services

2. **Connect new to existing**
   - Drag from existing service handles
   - Create edges to your new services
   - Document data flow in I/O specs

3. **Budget awareness**
   - Existing costs count toward total
   - Challenge #8: $53 existing + $40 budget = $93 max
   - Add services that fit remaining budget

4. **Integration patterns**
   - Cache: Add between compute and database
   - Search: Sync data from database to search engine
   - Analytics: Stream events to processing pipeline
   - AI: Trigger on events, process, update database

### Evaluation Tips:

✅ **What passes:**
- Total cost under budget (including existing)
- Required service categories present
- Services properly connected
- Input/output specs documented
- Integration with existing services

❌ **What fails:**
- Budget exceeded
- Missing required services
- Services not connected
- Isolated nodes with no edges
- Deleting existing infrastructure

---

## Visual Guide

### Existing Service Node:
```
┌───────────────────────────┐
│ 🏢 Existing               │  <- Green badge (can't remove)
│  [Logo]  SERVICE NAME     │  <- Fixed service name
│  "Custom Label" (locked)  │  <- Can't edit
│  ─────────────────────    │
│  $50/mo                   │  <- Fixed cost
│  Specs here               │
│  ─────────────────────    │
│  Input: (locked)          │  <- Can't edit
│  Output: (locked)         │  <- Can't edit
└───────────────────────────┘
```

### New Service Node:
```
┌───────────────────────────┐
│  [Logo]  SERVICE NAME     │  <- You added this
│  "Your Label" (editable)  │  <- Can edit
│  ─────────────────────    │
│  $25/mo                   │  <- You choose service
│  Specs here               │
│  ─────────────────────    │
│  Input: (editable)        │  <- Fill this in
│  Output: (editable)       │  <- Fill this in
└───────────────────────────┘
```

---

## Common Patterns

### 1. Caching Pattern
```
API → Cache → Database
      ↓ (miss)
    Database
```

### 2. Search Pattern
```
Database → Stream/Trigger → Lambda → Search Engine
API → Search Engine (read)
```

### 3. Event Processing
```
Source → Message Queue → Lambda → Database
                           ↓
                      Analytics DB
```

### 4. AI Integration
```
Storage → Event Trigger → Lambda → AI Service
                                      ↓
                                   Lambda
                                      ↓
                                  Database
```

---

## Ready to Start!

1. Start the app: `cd client && npm start`
2. Try Challenge #8 first (easiest extension challenge)
3. Add ElastiCache between Lambda and RDS
4. Connect them properly
5. Document the data flow
6. Submit and see your score!

Good luck! 🚀
