#!/usr/bin/env python3
"""
Cloud Price Comparison Tool
Compare prices across AWS, Azure, and GCP for similar services
"""

import json
from typing import Dict, List
from datetime import datetime


class PriceComparator:
    def __init__(self, pricing_file: str = 'cloud_pricing_api.json'):
        """
        Load pricing data
        """
        try:
            with open(pricing_file, 'r') as f:
                self.data = json.load(f)
            print(f"✓ Loaded pricing data from {pricing_file}")
        except FileNotFoundError:
            print(f"✗ File not found: {pricing_file}")
            print("  Run scrape_pricing_api.py first!")
            self.data = {}
        except Exception as e:
            print(f"✗ Error loading data: {e}")
            self.data = {}

    def compare_compute_instances(self):
        """
        Compare similar compute instances across providers
        """
        print("\n" + "="*80)
        print("💻 Compute Instance Comparison")
        print("="*80)

        # Define comparable instances (similar specs)
        comparisons = [
            {
                'specs': '2 vCPU, 1GB RAM',
                'aws': 't3.micro',
                'azure': None,  # Will search
                'gcp': 'e2-micro'
            },
            {
                'specs': '2 vCPU, 2GB RAM',
                'aws': 't3.small',
                'azure': None,
                'gcp': 'e2-small'
            },
            {
                'specs': '2 vCPU, 4GB RAM',
                'aws': 't3.medium',
                'azure': None,
                'gcp': 'e2-medium'
            }
        ]

        for comp in comparisons:
            print(f"\n📊 {comp['specs']}")
            print("-" * 80)

            prices = {}

            # AWS
            if 'AWS' in self.data and 'compute' in self.data['AWS']:
                for service in self.data['AWS']['compute']:
                    if service['name'] == comp['aws']:
                        prices['AWS'] = service['baseCost']
                        print(f"  AWS     {service['name']:20} ${service['baseCost']:7.2f}/mo")

            # Azure
            if 'Azure' in self.data and 'compute' in self.data['Azure']:
                # Find closest match by specs
                for service in self.data['Azure']['compute']:
                    if comp['specs'] in service.get('specs', ''):
                        prices['Azure'] = service['baseCost']
                        print(f"  Azure   {service['name']:20} ${service['baseCost']:7.2f}/mo")
                        break

            # GCP
            if 'GCP' in self.data and 'compute' in self.data['GCP']:
                for service in self.data['GCP']['compute']:
                    if service['name'] == comp['gcp']:
                        prices['GCP'] = service['baseCost']
                        print(f"  GCP     {service['name']:20} ${service['baseCost']:7.2f}/mo")

            # Find cheapest
            if prices:
                cheapest = min(prices, key=prices.get)
                savings = max(prices.values()) - prices[cheapest]
                print(f"\n  💰 Cheapest: {cheapest} (saves ${savings:.2f}/mo vs most expensive)")

    def compare_serverless(self):
        """
        Compare serverless pricing
        """
        print("\n" + "="*80)
        print("⚡ Serverless Function Comparison")
        print("="*80)
        print("\n📊 ~1M requests, 128-256MB memory")
        print("-" * 80)

        prices = {}

        # AWS Lambda
        if 'AWS' in self.data and 'serverless' in self.data['AWS']:
            for service in self.data['AWS']['serverless']:
                if 'Lambda' in service['name']:
                    prices['AWS Lambda'] = service['baseCost']
                    print(f"  AWS Lambda        ${service['baseCost']:7.2f}/mo")

        # Azure Functions
        if 'Azure' in self.data and 'serverless' in self.data['Azure']:
            for service in self.data['Azure']['serverless']:
                if 'Functions' in service['name']:
                    prices['Azure Functions'] = service['baseCost']
                    print(f"  Azure Functions   ${service['baseCost']:7.2f}/mo")

        # GCP Cloud Functions
        if 'GCP' in self.data and 'serverless' in self.data['GCP']:
            for service in self.data['GCP']['serverless']:
                if 'Functions' in service['name']:
                    prices['GCP Functions'] = service['baseCost']
                    print(f"  GCP Cloud Funcs   ${service['baseCost']:7.2f}/mo")

        if prices:
            cheapest = min(prices, key=prices.get)
            print(f"\n  💰 Cheapest: {cheapest} at ${prices[cheapest]:.2f}/mo")

    def compare_storage(self):
        """
        Compare object storage pricing
        """
        print("\n" + "="*80)
        print("💾 Object Storage Comparison (1TB)")
        print("="*80)
        print("-" * 80)

        prices = {}

        # AWS S3
        if 'AWS' in self.data and 'storage' in self.data['AWS']:
            for service in self.data['AWS']['storage']:
                if 'S3' in service['name']:
                    prices['AWS S3'] = service['baseCost']
                    print(f"  AWS S3            ${service['baseCost']:7.2f}/mo")

        # Azure Blob Storage
        if 'Azure' in self.data and 'storage' in self.data['Azure']:
            for service in self.data['Azure']['storage']:
                if 'Blob' in service['name']:
                    prices['Azure Blob'] = service['baseCost']
                    print(f"  Azure Blob        ${service['baseCost']:7.2f}/mo")

        # GCP Cloud Storage
        if 'GCP' in self.data and 'storage' in self.data['GCP']:
            for service in self.data['GCP']['storage']:
                if 'Storage' in service['name']:
                    prices['GCP Storage'] = service['baseCost']
                    print(f"  GCP Storage       ${service['baseCost']:7.2f}/mo")

        if prices:
            cheapest = min(prices, key=prices.get)
            savings = max(prices.values()) - prices[cheapest]
            print(f"\n  💰 Cheapest: {cheapest} (saves ${savings:.2f}/mo)")

    def compare_databases(self):
        """
        Compare database pricing
        """
        print("\n" + "="*80)
        print("🗄️  NoSQL Database Comparison")
        print("="*80)
        print("-" * 80)

        prices = {}

        # AWS DynamoDB
        if 'AWS' in self.data and 'database' in self.data['AWS']:
            for service in self.data['AWS']['database']:
                if 'DynamoDB' in service['name']:
                    prices['AWS DynamoDB'] = service['baseCost']
                    print(f"  AWS DynamoDB      ${service['baseCost']:7.2f}/mo")

        # Azure Cosmos DB
        if 'Azure' in self.data and 'database' in self.data['Azure']:
            for service in self.data['Azure']['database']:
                if 'Cosmos' in service['name']:
                    prices['Azure Cosmos DB'] = service['baseCost']
                    print(f"  Azure Cosmos DB   ${service['baseCost']:7.2f}/mo")

        # GCP Firestore
        if 'GCP' in self.data and 'database' in self.data['GCP']:
            for service in self.data['GCP']['database']:
                if 'Firestore' in service['name']:
                    prices['GCP Firestore'] = service['baseCost']
                    print(f"  GCP Firestore     ${service['baseCost']:7.2f}/mo")

        if prices:
            cheapest = min(prices, key=prices.get)
            print(f"\n  💰 Cheapest: {cheapest} at ${prices[cheapest]:.2f}/mo")

    def cost_breakdown_sample_app(self):
        """
        Show cost breakdown for a sample application
        """
        print("\n" + "="*80)
        print("🏗️  Sample App: Simple Web Application")
        print("="*80)
        print("\nArchitecture:")
        print("  - 1x Compute instance (2 vCPU, 4GB RAM)")
        print("  - 1x Managed database")
        print("  - 100GB object storage")
        print("  - 500GB bandwidth (CDN/transfer)")
        print("-" * 80)

        # Calculate for each provider
        for provider in ['AWS', 'Azure', 'GCP']:
            if provider not in self.data:
                continue

            print(f"\n{provider}:")
            total = 0

            # Compute
            if 'compute' in self.data[provider]:
                for service in self.data[provider]['compute']:
                    if '4GB RAM' in service['specs']:
                        print(f"  Compute:   ${service['baseCost']:7.2f}/mo  ({service['name']})")
                        total += service['baseCost']
                        break

            # Database
            if 'database' in self.data[provider]:
                if self.data[provider]['database']:
                    service = self.data[provider]['database'][0]
                    print(f"  Database:  ${service['baseCost']:7.2f}/mo  ({service['name']})")
                    total += service['baseCost']

            # Storage (prorated)
            if 'storage' in self.data[provider]:
                if self.data[provider]['storage']:
                    service = self.data[provider]['storage'][0]
                    storage_cost = service['baseCost'] * 0.1  # 100GB is 10% of 1TB
                    print(f"  Storage:   ${storage_cost:7.2f}/mo  (100GB)")
                    total += storage_cost

            # Bandwidth estimate
            bandwidth_cost = 5.00  # Rough estimate
            print(f"  Bandwidth: ${bandwidth_cost:7.2f}/mo  (500GB)")
            total += bandwidth_cost

            print(f"  {'─'*30}")
            print(f"  TOTAL:     ${total:7.2f}/mo")

    def generate_report(self):
        """
        Generate full comparison report
        """
        print("\n" + "="*80)
        print("☁️  CLOUD PRICING COMPARISON REPORT")
        print("="*80)
        print(f"\nGenerated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"Data from: {self.data.get('metadata', {}).get('timestamp', 'Unknown')}")

        self.compare_compute_instances()
        self.compare_serverless()
        self.compare_storage()
        self.compare_databases()
        self.cost_breakdown_sample_app()

        print("\n" + "="*80)
        print("💡 Key Takeaways")
        print("="*80)
        print("""
1. Compute: GCP generally offers the most competitive pricing for small instances
2. Serverless: All three providers are very competitive, within $1-2/mo
3. Storage: Prices are similar, differences usually < $5/mo for 1TB
4. Database: NoSQL pricing varies significantly - compare based on your workload

⚠️  Important Notes:
- Prices are for standard US regions (us-east-1, eastus, us-central1)
- Actual costs vary based on usage patterns, discounts, and commitments
- Always use official pricing calculators for production planning
- Consider data transfer, egress, and other hidden costs
""")

        print("="*80 + "\n")


def main():
    """
    Main execution
    """
    comparator = PriceComparator()

    if not comparator.data:
        return

    comparator.generate_report()


if __name__ == "__main__":
    main()
