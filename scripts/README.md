# Cloud Pricing Scraper Scripts

Scripts to scrape real-time pricing from AWS, Azure, GCP, and other cloud providers.

## 📁 Files

1. **`scrape_pricing_api.py`** ⭐ **RECOMMENDED**
   - Uses official cloud provider APIs
   - Most reliable and accurate
   - No browser automation needed
   - Fast execution

2. **`scrape_cloud_pricing.py`**
   - Hybrid approach: APIs + web scraping
   - Falls back to web scraping if APIs unavailable
   - Good for comprehensive data

3. **`scrape_pricing_selenium.py`**
   - Uses Selenium WebDriver
   - For JavaScript-heavy pricing calculators
   - Requires ChromeDriver installation

## 🚀 Quick Start

### Install Dependencies

```bash
cd scripts
pip install -r requirements.txt
```

### Run the API Scraper (Recommended)

```bash
python3 scrape_pricing_api.py
```

**Output:**
- `cloud_pricing_api.json` - Raw pricing data
- `cloudServices_updated.js` - Ready to use in your app

### Run the Hybrid Scraper

```bash
python3 scrape_cloud_pricing.py
```

**Output:**
- `scraped_pricing.json` - Raw data
- `cloudServices_generated.js` - App format

## 📊 Data Sources

### AWS Pricing

**Official APIs:**
- Price List Service API: `https://pricing.us-east-1.amazonaws.com/`
- No authentication required for bulk pricing
- Full pricing data in JSON format

**Pricing Pages:**
- EC2: https://aws.amazon.com/ec2/pricing/on-demand/
- Lambda: https://aws.amazon.com/lambda/pricing/
- S3: https://aws.amazon.com/s3/pricing/
- RDS: https://aws.amazon.com/rds/pricing/
- DynamoDB: https://aws.amazon.com/dynamodb/pricing/

### Azure Pricing

**Official API:**
- Retail Prices API: `https://prices.azure.com/api/retail/prices`
- REST API with no authentication
- Comprehensive pricing data

**Documentation:**
https://learn.microsoft.com/en-us/rest/api/cost-management/retail-prices/azure-retail-prices

**Example Query:**
```python
params = {
    '$filter': "serviceName eq 'Virtual Machines' and armRegionName eq 'eastus'",
    'api-version': '2023-01-01-preview'
}
```

### GCP Pricing

**Resources:**
- Cloud Billing API (requires auth)
- Pricing Calculator JSON: `https://cloudpricingcalculator.appspot.com/static/data/pricelist.json`
- SKU Lists: https://cloud.google.com/skus/

**Pricing Pages:**
- Compute Engine: https://cloud.google.com/compute/vm-instance-pricing
- Cloud Functions: https://cloud.google.com/functions/pricing
- Cloud Storage: https://cloud.google.com/storage/pricing

### RunPod Pricing

**Website:**
- Pricing Page: https://www.runpod.io/pricing
- Community Pricing: https://www.runpod.io/console/gpu-cloud
- GPU rental marketplace with dynamic pricing

### MongoDB Atlas

**Pricing:**
- Official Pricing: https://www.mongodb.com/pricing
- Tier-based pricing (M0, M10, M20, etc.)

## 💡 Usage Examples

### Example 1: Fetch and Update App Pricing

```bash
# Run the scraper
python3 scrape_pricing_api.py

# Copy generated file to app
cp cloudServices_updated.js ../client/src/data/cloudServices.js

# Restart your app
cd ../client
npm start
```

### Example 2: Schedule Regular Updates

Create a cron job to update pricing daily:

```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 2 AM)
0 2 * * * cd /home/junwei/hacknroll/scripts && python3 scrape_pricing_api.py
```

### Example 3: Compare Prices Across Providers

```python
import json

with open('cloud_pricing_api.json', 'r') as f:
    data = json.load(f)

# Find cheapest 2 vCPU, 4GB RAM instance
aws_price = 30.368  # t3.medium
azure_price = 24.45  # e2-medium
gcp_price = 24.45   # e2-medium

print(f"Cheapest: GCP at ${gcp_price}/mo")
```

## 🔍 Advanced Usage

### Filter by Region

```python
# Azure API with region filter
params = {
    '$filter': "armRegionName eq 'westus2'",
}
```

### Filter by Service Type

```python
# AWS - fetch only Lambda pricing
url = "https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AWSLambda/current/index.json"
```

### Parse Specific SKUs

```python
# GCP - parse specific machine types
machine_types = ['n1-standard-1', 'n1-standard-2', 'e2-medium']
for machine in machine_types:
    # Scrape pricing for each
    pass
```

## 🛠️ Customization

### Add New Cloud Providers

Edit `scrape_pricing_api.py` and add a new method:

```python
def fetch_digitalocean_pricing(self) -> Dict:
    """
    Fetch DigitalOcean pricing
    """
    services = {
        'compute': [
            {
                'id': 'do-basic-1gb',
                'name': 'Basic Droplet',
                'baseCost': 6.00,
                'category': 'compute',
                'specs': '1 vCPU, 1GB RAM',
                'description': 'Basic droplet'
            }
        ]
    }
    return services
```

### Add New Service Categories

```python
services = {
    'compute': [],
    'storage': [],
    'database': [],
    'serverless': [],
    'networking': [],
    'ml': [],           # Add ML services
    'analytics': [],    # Add analytics
    'container': []     # Add container services
}
```

### Change Output Format

Modify the `generate_js_file()` method to change the output format:

```python
def generate_js_file(self, data: Dict):
    # Custom format
    output = {
        'version': '2.0',
        'providers': {}
    }
    # ... customize structure
```

## 📝 Data Format

### JSON Output

```json
{
  "metadata": {
    "timestamp": "2024-01-16T23:00:00",
    "version": "1.0.0",
    "source": "Official Cloud Provider APIs"
  },
  "AWS": {
    "compute": [
      {
        "id": "ec2-t3-micro",
        "name": "t3.micro",
        "baseCost": 7.592,
        "category": "compute",
        "specs": "2 vCPU, 1GB RAM",
        "description": "Burstable performance",
        "pricing_url": "https://aws.amazon.com/ec2/pricing/"
      }
    ]
  }
}
```

### JavaScript Output

```javascript
export const cloudServices = {
  AWS: {
    compute: [
      {
        id: 'ec2-t3-micro',
        name: 't3.micro',
        baseCost: 7.592,
        category: 'compute',
        specs: '2 vCPU, 1GB RAM',
        description: 'Burstable performance'
      }
    ]
  }
};
```

## 🚨 Important Notes

### Rate Limiting

APIs may have rate limits. The scripts include delays between requests:

```python
time.sleep(1)  # Wait 1 second between providers
```

### Authentication

Some APIs require authentication:
- **AWS Bulk Price List**: No auth required
- **Azure Retail Prices**: No auth required
- **GCP Cloud Billing API**: Requires API key (not used in these scripts)

### Pricing Accuracy

- Prices shown are estimates for typical usage
- Actual costs depend on usage patterns, region, and discounts
- Always verify with official pricing calculators
- Prices are typically for us-east-1/eastus/us-central1 regions

### Legal Compliance

- Respect robots.txt and Terms of Service
- Use official APIs when available
- Don't overload servers with requests
- Add appropriate delays between requests

## 🔧 Troubleshooting

### Import Error: No module named 'requests'

```bash
pip install requests
```

### ChromeDriver Not Found (Selenium)

```bash
# macOS
brew install chromedriver

# Linux
sudo apt-get install chromium-chromedriver

# Or download from:
# https://chromedriver.chromium.org/downloads
```

### Connection Timeout

Increase timeout values:

```python
response = self.session.get(url, timeout=60)  # 60 seconds
```

### API Returns 429 (Rate Limited)

Add longer delays:

```python
time.sleep(5)  # Wait 5 seconds between requests
```

## 📚 Resources

**AWS:**
- Price List API Guide: https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/price-changes.html
- Bulk API: https://pricing.us-east-1.amazonaws.com/

**Azure:**
- Retail Prices API: https://learn.microsoft.com/en-us/rest/api/cost-management/retail-prices
- Example Queries: https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/cost-management-billing/

**GCP:**
- Cloud Billing API: https://cloud.google.com/billing/docs/how-to/export-data-bigquery
- Pricing: https://cloud.google.com/pricing

**General:**
- Cloud Cost Comparison: https://cloudpricingcomparison.com/
- Cloud Provider Comparisons: https://www.cloudcompare.io/

## 🎯 Next Steps

1. **Automate Updates**: Set up cron jobs for daily updates
2. **Add Monitoring**: Track price changes over time
3. **Create Alerts**: Get notified when prices change
4. **Expand Coverage**: Add more cloud providers (DigitalOcean, Linode, etc.)
5. **Add Regions**: Fetch pricing for multiple regions
6. **Historical Data**: Store pricing history in database

## 🤝 Contributing

To add a new cloud provider:

1. Create a new method in `CloudPricingAPI` class
2. Follow the naming pattern: `fetch_PROVIDER_pricing()`
3. Return data in the standard format
4. Update the `fetch_all_pricing()` method
5. Add documentation in this README

Happy scraping! 🚀
