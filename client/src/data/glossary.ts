export interface GlossaryTerm {
  term: string;
  category: 'compute' | 'storage' | 'database' | 'networking' | 'general' | 'ai';
  definition: string;
  analogy: string;
  example: string;
  relatedTerms?: string[];
}

export const glossaryTerms: GlossaryTerm[] = [
  // Compute Terms
  {
    term: "Instance",
    category: "compute",
    definition: "A virtual computer that you rent from a cloud provider",
    analogy: "Like having a Windows or Mac computer in the cloud that you control remotely",
    example: "An EC2 instance running your website 24/7",
    relatedTerms: ["Virtual Machine", "Compute", "Server"]
  },
  {
    term: "Virtual Machine (VM)",
    category: "compute",
    definition: "Software that pretends to be a physical computer with its own OS",
    analogy: "Like running Windows inside your Mac using virtualization software",
    example: "Creating a Linux VM to run your Python application",
    relatedTerms: ["Instance", "Compute"]
  },
  {
    term: "Serverless",
    category: "compute",
    definition: "Code that runs automatically only when needed - you don't manage servers",
    analogy: "Like a vending machine - it only works when someone uses it, no maintenance needed",
    example: "A function that resizes images only when users upload photos",
    relatedTerms: ["Lambda", "Cloud Functions", "Functions"]
  },
  {
    term: "Container",
    category: "compute",
    definition: "A lightweight package containing your code and everything it needs to run",
    analogy: "Like a shipping container - same size, fits anywhere, contains everything inside",
    example: "Docker container running your Node.js app",
    relatedTerms: ["Docker", "Kubernetes"]
  },

  // Storage Terms
  {
    term: "Object Storage",
    category: "storage",
    definition: "Cloud storage for any type of file (images, videos, documents, etc.)",
    analogy: "Like an unlimited Dropbox or Google Drive for developers",
    example: "Storing user-uploaded photos in AWS S3",
    relatedTerms: ["S3", "Blob Storage", "Cloud Storage"]
  },
  {
    term: "Block Storage",
    category: "storage",
    definition: "Storage that acts like a hard drive attached to your virtual machine",
    analogy: "Like plugging an external hard drive into your computer",
    example: "Adding extra storage space to your EC2 instance",
    relatedTerms: ["EBS", "Disk", "Volume"]
  },
  {
    term: "Bucket",
    category: "storage",
    definition: "A container/folder in object storage where you keep your files",
    analogy: "Like a folder on your computer, but in the cloud",
    example: "Creating a bucket named 'user-photos' to store all profile pictures",
    relatedTerms: ["Object Storage", "S3"]
  },

  // Database Terms
  {
    term: "Database",
    category: "database",
    definition: "An organized system for storing and retrieving structured information",
    analogy: "Like a digital filing cabinet where everything has a specific place",
    example: "Storing user accounts, product listings, or order history",
    relatedTerms: ["SQL", "NoSQL", "RDS"]
  },
  {
    term: "SQL Database",
    category: "database",
    definition: "Traditional database using tables, rows, and columns (structured data)",
    analogy: "Like an Excel spreadsheet with strict rules about what goes in each column",
    example: "Storing user information (ID, name, email, signup date)",
    relatedTerms: ["Relational Database", "MySQL", "PostgreSQL"]
  },
  {
    term: "NoSQL Database",
    category: "database",
    definition: "Flexible database that doesn't require a fixed structure",
    analogy: "Like a filing cabinet where documents can have different fields",
    example: "Storing social media posts where some have images, others have videos",
    relatedTerms: ["DynamoDB", "MongoDB", "Document Database"]
  },

  // Networking Terms
  {
    term: "API",
    category: "networking",
    definition: "Application Programming Interface - how different programs talk to each other",
    analogy: "Like a waiter in a restaurant - takes your order (request) and brings back food (response)",
    example: "Weather app calling an API to get current temperature",
    relatedTerms: ["REST API", "Endpoint", "HTTP"]
  },
  {
    term: "Load Balancer",
    category: "networking",
    definition: "Distributes incoming traffic across multiple servers to prevent overload",
    analogy: "Like a traffic cop directing cars to different lanes so none get too busy",
    example: "Spreading 10,000 users across 5 servers instead of overwhelming one",
    relatedTerms: ["Traffic", "Distribution", "ELB"]
  },
  {
    term: "CDN",
    category: "networking",
    definition: "Content Delivery Network - copies of your files stored worldwide for faster access",
    analogy: "Like having McDonald's restaurants everywhere instead of just one location",
    example: "Netflix storing movies on servers near you so they load instantly",
    relatedTerms: ["CloudFront", "Edge", "Caching"]
  },
  {
    term: "Region",
    category: "networking",
    definition: "Physical location of cloud data centers (e.g., 'US West', 'Europe', 'Asia')",
    analogy: "Like choosing which post office to send mail from - closer = faster delivery",
    example: "Choosing 'Singapore' region to make your app faster for Asian users",
    relatedTerms: ["Availability Zone", "Location", "Data Center"]
  },
  {
    term: "Latency",
    category: "networking",
    definition: "The delay or waiting time for data to travel from point A to point B",
    analogy: "Like ping in online games - lower is better",
    example: "100ms latency means 0.1 second delay between clicking and seeing results",
    relatedTerms: ["Lag", "Response Time", "Delay"]
  },
  {
    term: "Bandwidth",
    category: "networking",
    definition: "The amount of data that can be transferred in a given time period",
    analogy: "Like a highway - more lanes means more cars can travel at once",
    example: "1 Gbps bandwidth can transfer about 125 MB per second",
    relatedTerms: ["Throughput", "Data Transfer", "Network Speed"]
  },
  {
    term: "VPC",
    category: "networking",
    definition: "Virtual Private Cloud - your own isolated network section in the cloud",
    analogy: "Like having a private neighborhood within a city",
    example: "Creating a VPC where only your services can talk to each other securely",
    relatedTerms: ["Network", "Subnet", "Security Group"]
  },

  // General Cloud Terms
  {
    term: "Scaling",
    category: "general",
    definition: "Automatically adding or removing resources based on demand",
    analogy: "Like a restaurant adding more tables during rush hour",
    example: "Your app handling 10 users or 10,000 users by adding more servers",
    relatedTerms: ["Auto Scaling", "Horizontal Scaling", "Elasticity"]
  },
  {
    term: "Elasticity",
    category: "general",
    definition: "The ability to automatically grow or shrink resources as needed",
    analogy: "Like a rubber band - stretches when needed, returns to normal when not",
    example: "Black Friday sale: automatically add servers during traffic spike",
    relatedTerms: ["Scaling", "Auto Scaling"]
  },
  {
    term: "High Availability",
    category: "general",
    definition: "System designed to work continuously without failure",
    analogy: "Like having backup generators - if one fails, another takes over instantly",
    example: "Running your app in multiple data centers so it never goes down",
    relatedTerms: ["Uptime", "Redundancy", "Failover"]
  },
  {
    term: "Fault Tolerance",
    category: "general",
    definition: "System's ability to continue operating even if some components fail",
    analogy: "Like a car that can still drive if one tire goes flat",
    example: "App continues working even if one server crashes",
    relatedTerms: ["High Availability", "Resilience"]
  },
  {
    term: "SLA",
    category: "general",
    definition: "Service Level Agreement - guaranteed uptime percentage (e.g., 99.9%)",
    analogy: "Like a warranty - provider promises specific reliability levels",
    example: "99.9% SLA = maximum 8.76 hours downtime per year",
    relatedTerms: ["Uptime", "Guarantee"]
  },
  {
    term: "IaaS",
    category: "general",
    definition: "Infrastructure as a Service - rent virtual machines and networks",
    analogy: "Like renting an empty office space - you bring everything else",
    example: "EC2 instances where you install your own software",
    relatedTerms: ["PaaS", "SaaS", "Cloud Model"]
  },
  {
    term: "PaaS",
    category: "general",
    definition: "Platform as a Service - rent infrastructure + operating system + runtime",
    analogy: "Like renting a furnished office - furniture included, just bring your stuff",
    example: "Google App Engine where you just upload code",
    relatedTerms: ["IaaS", "SaaS", "Cloud Model"]
  },
  {
    term: "SaaS",
    category: "general",
    definition: "Software as a Service - fully managed applications you just use",
    analogy: "Like renting a fully operational McDonald's franchise",
    example: "Gmail, Salesforce, Office 365 - just login and use",
    relatedTerms: ["IaaS", "PaaS", "Cloud Model"]
  },

  // AI Terms
  {
    term: "Machine Learning",
    category: "ai",
    definition: "Teaching computers to learn patterns from data without explicit programming",
    analogy: "Like teaching a child to recognize cats by showing many cat pictures",
    example: "Spam filter learning to identify spam emails",
    relatedTerms: ["AI", "Deep Learning", "Model"]
  },
  {
    term: "Model",
    category: "ai",
    definition: "A trained AI system that can make predictions or decisions",
    analogy: "Like a recipe - once perfected, you can use it over and over",
    example: "Image recognition model that identifies objects in photos",
    relatedTerms: ["Machine Learning", "Training", "Inference"]
  },
  {
    term: "Inference",
    category: "ai",
    definition: "Using a trained AI model to make predictions on new data",
    analogy: "Like using your trained spam filter to check new emails",
    example: "Running an image through a model to identify what's in it",
    relatedTerms: ["Model", "Prediction", "AI"]
  },

  // Additional Important Terms
  {
    term: "Cache",
    category: "storage",
    definition: "Temporary fast storage for frequently accessed data",
    analogy: "Like keeping your most-used tools within arm's reach instead of in the garage",
    example: "Storing recent search results in Redis for instant retrieval",
    relatedTerms: ["Redis", "Memcached", "Caching"]
  },
  {
    term: "Queue",
    category: "networking",
    definition: "A waiting line for tasks to be processed in order",
    analogy: "Like standing in line at a coffee shop - first come, first served",
    example: "Queuing email sending jobs to be processed one by one",
    relatedTerms: ["SQS", "Message Queue", "Job Queue"]
  },
  {
    term: "Microservices",
    category: "general",
    definition: "Breaking an application into small, independent services",
    analogy: "Like an assembly line - each station does one specific task",
    example: "Separate services for login, payments, and notifications",
    relatedTerms: ["Architecture", "Services", "API"]
  },
  {
    term: "Endpoint",
    category: "networking",
    definition: "A specific URL where an API can be accessed",
    analogy: "Like a specific phone number to call for pizza delivery",
    example: "https://api.example.com/users - endpoint to get user data",
    relatedTerms: ["API", "URL", "Route"]
  },
  {
    term: "Deployment",
    category: "general",
    definition: "The process of releasing your code to production (making it live)",
    analogy: "Like opening day for a new restaurant",
    example: "Deploying your website update so users can see new features",
    relatedTerms: ["Release", "Production", "CI/CD"]
  },
  {
    term: "Environment",
    category: "general",
    definition: "A separate setup for different stages (development, testing, production)",
    analogy: "Like having a practice stage before performing on the main stage",
    example: "Testing in 'staging' environment before deploying to 'production'",
    relatedTerms: ["Dev", "Staging", "Production"]
  }
];

export const getTermsByCategory = (category: GlossaryTerm['category']) => {
  return glossaryTerms.filter(term => term.category === category);
};

export const searchTerms = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return glossaryTerms.filter(
    term =>
      term.term.toLowerCase().includes(lowerQuery) ||
      term.definition.toLowerCase().includes(lowerQuery)
  );
};
