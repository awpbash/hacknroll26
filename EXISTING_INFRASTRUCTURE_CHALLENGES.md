# Existing Infrastructure Challenges

## Overview

Added 4 new challenges that simulate real-world scenarios where you need to extend existing cloud architectures. These challenges start with pre-deployed infrastructure and require you to add new services that integrate seamlessly with the existing setup.

## New Challenges

### 1. Add Search to Existing E-commerce (Challenge #7)
**Difficulty:** Medium
**Category:** Database

**Scenario:**
Your e-commerce platform already has:
- S3 bucket storing product images
- DynamoDB storing product catalog

**Your Task:**
Add full-text search capabilities without disrupting existing services.

**Requirements:**
- Integrate search without changing existing setup
- Index product data for fast queries
- Support autocomplete and fuzzy matching
- Keep search synced with database changes
- Handle 500+ searches/minute
- Search response time < 200ms

**Budget:** $100/month (in addition to existing $65/month)

---

### 2. Add Caching to Slow API (Challenge #8)
**Difficulty:** Easy
**Category:** Serverless

**Scenario:**
Your API setup consists of:
- Lambda function handling API requests
- RDS PostgreSQL database

**Problem:** Response times are slow (800ms average), users are complaining.

**Your Task:**
Add caching to improve performance.

**Requirements:**
- Keep existing Lambda and RDS unchanged
- Cache frequently accessed data
- Reduce DB query load by 70%
- Improve response time to < 200ms
- Handle cache invalidation properly

**Budget:** $40/month (in addition to existing $53/month)

---

### 3. Extend Video Platform with Analytics (Challenge #9)
**Difficulty:** Hard
**Category:** Full-Stack

**Scenario:**
Your video streaming platform has:
- S3 storing video files
- CloudFront CDN for video delivery

**Your Task:**
Build a real-time analytics pipeline for marketing insights.

**Requirements:**
- Don't modify existing S3 and CloudFront
- Track video views, watch time, user engagement in real-time
- Store analytics data for reporting
- Process 10,000+ events/minute
- Enable SQL queries on analytics data
- Provide near real-time insights (< 5 min delay)

**Budget:** $250/month (in addition to existing $205/month)

---

### 4. Add AI Image Recognition to Photo App (Challenge #10)
**Difficulty:** Medium
**Category:** Compute

**Scenario:**
Your photo app currently uses:
- S3 for photo storage
- DynamoDB for photo metadata

**Your Task:**
Add automatic image tagging and object detection.

**Requirements:**
- Integrate with existing S3 and DynamoDB
- Automatically detect objects, faces, scenes
- Tag photos with detected labels
- Update DynamoDB automatically
- Process images within 10 seconds of upload
- Handle 100+ uploads/minute

**Budget:** $120/month (in addition to existing $65/month)

---

## Features

### Visual Indicators

**"Existing" Badge:**
- Green badge with 🏢 icon appears on pre-deployed services
- Shows which services are already in production
- Cannot be deleted or resized

**Locked Fields:**
- Custom labels are disabled for existing services
- Input/Output specifications are read-only
- Cost and specs are fixed

**Canvas Pre-population:**
- Existing services appear automatically when challenge loads
- Services are already connected (edges pre-defined)
- You can only add new services and create new connections

### Challenge Details Panel

**New Section: "Existing Infrastructure"**
- Lists all pre-deployed services
- Shows service names, custom labels, costs, and specs
- Helps you understand what's already running

## Technical Implementation

### Data Structure

Each challenge can now include an `existingInfrastructure` object:

```javascript
{
  id: '7',
  title: "Add Search to Existing E-commerce",
  // ... other challenge properties ...
  existingInfrastructure: {
    nodes: [
      {
        id: 'existing-s3',
        type: 'serviceNode',
        position: { x: 100, y: 100 },
        data: {
          serviceName: 'S3',
          customLabel: 'Product Images',
          category: 'storage',
          cost: 15,
          specs: '500GB storage',
          description: 'Stores product images',
          inputSpec: 'Image uploads',
          outputSpec: 'Image URLs',
          isExisting: true  // <-- Key flag
        }
      },
      // ... more nodes
    ],
    edges: [
      {
        id: 'e-s3-dynamodb',
        source: 'existing-s3',
        target: 'existing-dynamodb',
        animated: true,
        style: { stroke: 'rgba(255, 255, 255, 0.5)', strokeWidth: 2 }
      }
    ]
  }
}
```

### Component Updates

**CustomServiceNode.js:**
- Added `ExistingBadge` styled component
- Disabled resizer for existing nodes
- Disabled input fields (custom label, I/O specs) for existing nodes
- Visual opacity changes to indicate read-only state

**ArchitectureBuilder.js:**
- Added `initialNodes` and `initialEdges` props
- Loads existing infrastructure on mount
- Preserves existing nodes when users add new services

**ChallengePage.js:**
- Loads existing infrastructure from challenge data
- Passes initial nodes/edges to ArchitectureBuilder
- Displays existing infrastructure in left panel
- Includes existing infrastructure costs in evaluation

## Evaluation

The evaluation function now:
- Includes costs from existing infrastructure
- Checks that new services integrate properly
- Validates connections between new and existing services
- Ensures budget includes both existing and new costs

## User Experience

1. **Load Challenge:** Existing services appear on canvas automatically
2. **Read Context:** Left panel shows what's already deployed
3. **Design Solution:** Drag new services from sidebar
4. **Connect Services:** Connect new services to existing ones
5. **Submit:** Evaluation considers entire architecture

## Real-World Learning

These challenges teach important skills:
- **Working with constraints:** Must integrate without breaking existing systems
- **Cost-aware design:** Budget already partially consumed by existing services
- **Integration patterns:** Learning how to connect new services to existing infrastructure
- **Production thinking:** Understanding that you can't always start from scratch

## Example Solutions

### Challenge #7 (Add Search):
**Good Solution:**
- Add OpenSearch for full-text search
- Use Lambda to sync DynamoDB changes to OpenSearch
- Use DynamoDB Streams to trigger Lambda on data changes
- Connect API Gateway to OpenSearch for search queries

### Challenge #8 (Add Caching):
**Good Solution:**
- Add ElastiCache (Redis) between Lambda and RDS
- Lambda checks cache first, falls back to RDS
- Use Redis TTL for automatic cache expiration
- Total cost stays well under $40 additional budget

### Challenge #9 (Video Analytics):
**Good Solution:**
- Use Kinesis Data Streams to ingest CloudFront logs
- Lambda processes events in real-time
- Store aggregated data in DynamoDB or Redshift
- Use Kinesis Analytics for SQL queries

### Challenge #10 (Image Recognition):
**Good Solution:**
- Use S3 event triggers when photos uploaded
- Lambda calls Rekognition API for analysis
- Lambda updates DynamoDB with detected tags
- SageMaker for custom model (optional)

## Benefits for Users

✅ **Real-world scenarios:** Most companies have existing infrastructure
✅ **Budget constraints:** Learn to work within fixed budgets
✅ **Integration patterns:** Practice connecting services
✅ **Production mindset:** Think about existing systems, not greenfield
✅ **Progressive complexity:** Start with simple caching, progress to analytics pipelines

These challenges make the learning experience more realistic and prepare users for actual cloud architecture work where they'll need to extend and integrate with existing systems.
