# Cloud Provider Logo Preview

## What You'll See

### 1. Learn Page - Provider Tabs
```
┌─────────────────────────────────────────────────────────────┐
│                    Learn Cloud Services                      │
│        Explore and understand cloud services from           │
│              major providers                                 │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ [AWS] AWS│ │ [≡] Azure│ │ [GCP] GCP│ │ [RP] Pod │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│  ┌──────────────┐                                           │
│  │ [🍃] MongoDB │                                           │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```
- When active: Logo is white, button has gradient background
- When inactive: Logo is colored, button has dark background

### 2. Challenge Page - Provider Selector
```
┌─────────────────────────────────────────────────────────────┐
│  Design Your Architecture                                    │
│                                                              │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌─────────┐ │
│  │[AWS]AWS│ │[≡]Azure│ │[GCP]GCP│ │[RP] Pod│ │[🍃]Mongo│ │
│  └────────┘ └────────┘ └────────┘ └────────┘ └─────────┘ │
│                                                              │
│  [ Architecture Builder Canvas ]                            │
└─────────────────────────────────────────────────────────────┘
```
- Smaller logos (20px) with provider name
- Same active/inactive styling

### 3. Service Nodes - Individual Services
```
┌───────────────────────────┐
│  [EC2 Logo]  EC2          │  <- AWS EC2 shows actual EC2 logo
│  "Web Server"             │  <- Custom label
│  ─────────────────────    │
│  $10.50/mo               │
│  t3.medium, 2vCPU        │
│  ─────────────────────    │
│  Input: HTTP requests     │
│  Output: Web responses    │
└───────────────────────────┘

┌───────────────────────────┐
│  [Lambda Logo]  LAMBDA    │  <- AWS Lambda shows actual Lambda logo
│  "API Handler"            │
│  ─────────────────────    │
│  $5.00/mo                │
│  128MB, Node.js          │
└───────────────────────────┘

┌───────────────────────────┐
│  [🗄️]  MONGODB M10        │  <- MongoDB uses emoji (no specific logo)
│  "User Vector DB"         │
│  ─────────────────────    │
│  $57.00/mo               │
│  2GB RAM, Dedicated      │
└───────────────────────────┘
```

## Logo Sources by Provider

### AWS (Orange #FF9900)
- Main logo: CDN link
- Service logos available:
  - EC2 (Compute)
  - Lambda (Serverless)
  - S3 (Storage)
  - RDS (Database)
  - DynamoDB (Database)
  - CloudFront (CDN)
  - API Gateway
  - SageMaker (AI)

### Azure (Blue #0078D4)
- Main logo: CDN link
- Service logos available:
  - Virtual Machines
  - Functions
  - Blob Storage
  - Cosmos DB
  - SQL Database
  - CDN
  - Cognitive Services

### GCP (Blue #4285F4)
- Main logo: CDN link
- Service logos available:
  - Compute Engine
  - Cloud Functions
  - Cloud Storage
  - Cloud SQL
  - Firestore
  - Cloud CDN
  - Vertex AI

### RunPod (Purple #8b5cf6)
- Main logo: GitHub avatar
- Services use emoji fallbacks:
  - RTX 4090: 🎮
  - A100: 🚀
  - H100: ⚡
  - Llama 2: 🦙
  - Mistral: 🌬️

### MongoDB (Green #47A248)
- Main logo: CDN link
- Services use emoji fallbacks:
  - All tiers (M0-M50): 🍃 or 🗄️

## Technical Details

### Logo Display Logic

1. **Check for service-specific logo**:
   - If service name (e.g., "EC2") has a logo, use it

2. **Fallback to category emoji**:
   - If no specific logo, use category emoji
   - compute: ⚡
   - storage: 💾
   - database: 🗄️
   - networking: 🌐
   - ai: 🤖
   - serverless: ☁️

### Styling

- **Provider tabs**: 24px logos with white filter when active
- **Service nodes**: 32px logos with white filter for visibility on colored backgrounds
- **All logos**: object-fit: contain to preserve aspect ratio

## Browser Compatibility

The logos use standard web technologies:
- SVG logos from CDN
- CSS filters for color effects
- Fallback to emoji (universally supported)

Should work in all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Logos are cached by CDN
- Small file sizes (most SVGs < 10KB)
- Lazy loaded with browser defaults
- No impact on initial page load
