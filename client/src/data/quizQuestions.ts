export interface QuizQuestion {
  id: number;
  moduleId: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  // Module 1: What is Cloud Computing?
  {
    id: 1,
    moduleId: 1,
    question: "What is 'the cloud' in cloud computing?",
    options: [
      "Actual clouds storing data using water vapor",
      "Someone else's computers in data centers",
      "A special type of wireless internet",
      "Storage devices floating in the sky"
    ],
    correctAnswer: 1,
    explanation: "The cloud is simply computers owned by companies like Amazon, Microsoft, or Google. There's nothing magical about it - you're renting their hardware!"
  },
  {
    id: 2,
    moduleId: 1,
    question: "What is the main benefit of using cloud computing instead of buying your own servers?",
    options: [
      "Cloud computing is always free",
      "You only pay for what you use and don't manage hardware",
      "Cloud is faster than physical servers",
      "You own the servers after paying enough"
    ],
    correctAnswer: 1,
    explanation: "The biggest benefit is pay-as-you-go pricing and not having to maintain hardware. No upfront costs, no IT staff needed for maintenance."
  },
  {
    id: 3,
    moduleId: 1,
    question: "Which analogy best describes cloud computing?",
    options: [
      "Buying a car and maintaining it yourself",
      "Renting a car when you need it",
      "Building a car from scratch",
      "Borrowing a friend's car forever"
    ],
    correctAnswer: 1,
    explanation: "Cloud computing is like renting - you pay for what you use, someone else handles maintenance, and you can scale up or down as needed."
  },

  // Module 2: Core Cloud Service Types
  {
    id: 4,
    moduleId: 2,
    question: "What is 'Compute' in cloud computing?",
    options: [
      "Storage space for files",
      "Processing power to run code and applications",
      "Database for organizing data",
      "Internet connection speed"
    ],
    correctAnswer: 1,
    explanation: "Compute is the processing power - the 'brain' that runs your code, websites, and applications."
  },
  {
    id: 5,
    moduleId: 2,
    question: "If you're building a photo-sharing app, what would you use Storage for?",
    options: [
      "Running the app code",
      "Tracking who likes which photo",
      "Saving the actual photo files",
      "Processing image uploads"
    ],
    correctAnswer: 2,
    explanation: "Storage is for saving files like photos, videos, and documents. Think of it as a digital filing cabinet."
  },
  {
    id: 6,
    moduleId: 2,
    question: "What's the difference between Storage and Database?",
    options: [
      "Storage is for files, Database is for structured searchable data",
      "They're exactly the same thing",
      "Storage is slower than Database",
      "Database can only store text"
    ],
    correctAnswer: 0,
    explanation: "Storage keeps files (photos, videos), while Databases organize structured information (user accounts, product lists) that you need to search and update quickly."
  },

  // Module 3: Essential Cloud Jargon
  {
    id: 7,
    moduleId: 3,
    question: "What is a 'Virtual Machine' or 'Instance'?",
    options: [
      "A physical computer shipped to your office",
      "A virtual computer you rent in the cloud",
      "A type of database",
      "A storage container"
    ],
    correctAnswer: 1,
    explanation: "An instance/VM is a virtual computer that runs in the cloud. You control it remotely, just like your own PC, but it's running on someone else's hardware."
  },
  {
    id: 8,
    moduleId: 3,
    question: "What does 'Serverless' mean?",
    options: [
      "There are literally no servers involved",
      "Code that runs only when needed, you don't manage servers",
      "A type of database without servers",
      "Free cloud computing"
    ],
    correctAnswer: 1,
    explanation: "Serverless doesn't mean no servers - it means you don't manage them. Your code runs automatically when triggered, and you only pay for actual execution time."
  },
  {
    id: 9,
    moduleId: 3,
    question: "What is a CDN (Content Delivery Network)?",
    options: [
      "A type of database",
      "Copies of your files stored worldwide for faster access",
      "A cloud provider",
      "A programming language"
    ],
    correctAnswer: 1,
    explanation: "CDN stores copies of your content around the world, so users get files from the nearest location. Like having McDonald's everywhere instead of just one location!"
  },

  // Module 4: Understanding Pricing
  {
    id: 10,
    moduleId: 4,
    question: "How does cloud computing pricing typically work?",
    options: [
      "Fixed monthly fee regardless of usage",
      "Pay-as-you-go: only pay for what you use",
      "Free for the first year, then expensive",
      "One-time purchase like buying software"
    ],
    correctAnswer: 1,
    explanation: "Cloud uses pay-as-you-go pricing, like your electricity bill. Use more, pay more. Use less, pay less. No large upfront costs."
  },
  {
    id: 11,
    moduleId: 4,
    question: "What is a 'Free Tier' in cloud computing?",
    options: [
      "Cloud computing that's completely free forever",
      "Limited free usage to help beginners experiment",
      "The slowest and worst quality servers",
      "A scam to get your credit card"
    ],
    correctAnswer: 1,
    explanation: "Free tiers give you limited resources at no cost (like 750 hours/month of a small instance). Perfect for learning and small projects. After limits, you pay normally."
  },
  {
    id: 12,
    moduleId: 4,
    question: "What's a typical monthly cost for a small web app with moderate traffic?",
    options: [
      "$1-5",
      "$30-100",
      "$500-1000",
      "$5000+"
    ],
    correctAnswer: 1,
    explanation: "A simple web app typically costs $30-100/month including compute, database, storage, and bandwidth. Can be lower using free tiers!"
  },

  // Module 5: Choosing a Cloud Provider
  {
    id: 13,
    moduleId: 5,
    question: "Which cloud provider is the largest and most mature?",
    options: [
      "Microsoft Azure",
      "Google Cloud (GCP)",
      "AWS (Amazon Web Services)",
      "IBM Cloud"
    ],
    correctAnswer: 2,
    explanation: "AWS is the largest and oldest major cloud provider, with the most services and biggest market share. It launched in 2006."
  },
  {
    id: 14,
    moduleId: 5,
    question: "What's the most important thing to know about choosing a cloud provider?",
    options: [
      "You can never switch once you choose",
      "Only AWS is good for production apps",
      "They all do similar things, and concepts transfer between them",
      "You must use all three providers"
    ],
    correctAnswer: 2,
    explanation: "All major providers offer similar core services at similar prices. The skills you learn transfer between providers, so just pick one and start learning!"
  },
  {
    id: 15,
    moduleId: 5,
    question: "Which provider might be best if you're focused on data science and AI?",
    options: [
      "AWS",
      "Azure",
      "Google Cloud (GCP)",
      "They're all exactly the same"
    ],
    correctAnswer: 2,
    explanation: "While all offer AI services, GCP has strong data analytics and machine learning tools (Google's expertise). But AWS and Azure also have excellent AI services!"
  },

  // Module 6: Your First Cloud Projects
  {
    id: 16,
    moduleId: 6,
    question: "What's a good first cloud project for absolute beginners?",
    options: [
      "Build a real-time multiplayer game",
      "Deploy a static website (HTML/CSS/JS)",
      "Create a machine learning model",
      "Set up a multi-region database cluster"
    ],
    correctAnswer: 1,
    explanation: "A static website is perfect for beginners - just upload HTML/CSS/JS to object storage and enable website hosting. Costs ~$1-5/month and teaches storage + CDN basics."
  },
  {
    id: 17,
    moduleId: 6,
    question: "What services would you need for a simple photo gallery app?",
    options: [
      "Only storage",
      "Storage + Database + Compute",
      "Only a database",
      "Only serverless functions"
    ],
    correctAnswer: 1,
    explanation: "You'd need: Storage (save photos), Database (track photo info/captions), and Compute (run the app logic). This is a great intermediate project!"
  },
  {
    id: 18,
    moduleId: 6,
    question: "What's the best way to learn cloud computing?",
    options: [
      "Just read documentation, never build anything",
      "Memorize all services from all providers",
      "Build real projects, break things, and learn from mistakes",
      "Watch videos but never try anything yourself"
    ],
    correctAnswer: 2,
    explanation: "The best way to learn is by doing! Start with small projects, experiment with services, break things (in a safe environment), and learn from the experience. Theory + Practice = Mastery."
  },

  // Module 7: Choosing Components for Your Architecture
  {
    id: 19,
    moduleId: 7,
    question: "Your app needs to run background tasks that process user-uploaded videos. Which service type should you choose?",
    options: [
      "Storage (S3) - it stores videos",
      "Database (RDS) - it tracks video metadata",
      "Compute (Lambda/EC2) - it runs the processing code",
      "CDN (CloudFront) - it delivers videos fast"
    ],
    correctAnswer: 2,
    explanation: "Compute services (Lambda or EC2) execute code. To process videos, you need processing power to run encoding/compression algorithms. Storage holds the videos, but compute processes them."
  },
  {
    id: 20,
    moduleId: 7,
    question: "You're building a blog with 1000 posts. Users search for posts by keyword. What should you use?",
    options: [
      "Just storage (S3) - store posts as files",
      "A database (RDS/DynamoDB) - structured, searchable data",
      "A CDN (CloudFront) - fast delivery",
      "Compute only (Lambda) - no storage needed"
    ],
    correctAnswer: 1,
    explanation: "Databases are perfect for structured, searchable data. You need to query posts by keyword, author, date, etc. Storage is for files, not searchable structured content."
  },
  {
    id: 21,
    moduleId: 7,
    question: "What's a common beginner mistake when choosing components?",
    options: [
      "Using too many services for simple projects",
      "Using a CDN for global users",
      "Starting with managed services",
      "Reading documentation before building"
    ],
    correctAnswer: 0,
    explanation: "Over-engineering is a classic mistake! Beginners often add unnecessary complexity. Start simple: one server, one database. Add services only when you feel the pain of not having them."
  },

  // Module 8: Connecting Components: Data Flow
  {
    id: 22,
    moduleId: 8,
    question: "What is a 'Direct Connection (Request-Response)' pattern?",
    options: [
      "Service A triggers Service B but doesn't wait for response",
      "Service A asks Service B for data and waits for answer",
      "Service A puts tasks in a queue for Service B",
      "Service A and Service B are never connected"
    ],
    correctAnswer: 1,
    explanation: "Request-Response means Service A sends a request and waits for Service B's response before continuing. Like asking someone a question and waiting for their answer."
  },
  {
    id: 23,
    moduleId: 8,
    question: "Why should you add a cache between your app and database?",
    options: [
      "Caches make databases more secure",
      "Caches speed up frequent queries by storing results in memory",
      "Caches replace databases entirely",
      "Caches are required by cloud providers"
    ],
    correctAnswer: 1,
    explanation: "Caches store frequently accessed data in fast memory (RAM). When your app needs that data again, it gets it from cache (5ms) instead of database (500ms). Much faster!"
  },
  {
    id: 24,
    moduleId: 8,
    question: "What's wrong with creating circular dependencies (A calls B, B calls A)?",
    options: [
      "It's the recommended best practice",
      "It costs more money",
      "It creates infinite loops and makes debugging impossible",
      "Cloud providers don't allow it"
    ],
    correctAnswer: 2,
    explanation: "Circular dependencies create loops: A triggers B, B triggers A, A triggers B... infinite! This causes crashes, wasted resources, and makes it impossible to understand data flow."
  },

  // Module 9: Designing for Scale and Reliability
  {
    id: 25,
    moduleId: 9,
    question: "What's the difference between vertical and horizontal scaling?",
    options: [
      "Vertical = add more servers, Horizontal = bigger server",
      "Vertical = bigger server, Horizontal = add more servers",
      "They're the same thing",
      "Vertical is for databases, Horizontal is for apps"
    ],
    correctAnswer: 1,
    explanation: "Vertical scaling (scaling up) = upgrade to a bigger server (more CPU/RAM). Horizontal scaling (scaling out) = add more servers working together. Horizontal scales infinitely!"
  },
  {
    id: 26,
    moduleId: 9,
    question: "Why should you design for failure in cloud architecture?",
    options: [
      "Because your code will always have bugs",
      "Because hardware fails, networks glitch, and services go down - it's inevitable",
      "Because cloud providers are unreliable",
      "You shouldn't - just build it right the first time"
    ],
    correctAnswer: 1,
    explanation: "In distributed systems, failures are inevitable: hard drives die, networks have hiccups, data centers lose power. Great architecture assumes failure and handles it gracefully with backups and redundancy."
  },
  {
    id: 27,
    moduleId: 9,
    question: "What is 'stateless design' and why is it important for scaling?",
    options: [
      "Servers have no state - they can't store any data at all",
      "Servers don't remember previous requests - any server can handle any user",
      "Stateless means no database is used",
      "Stateless means the app doesn't save user data"
    ],
    correctAnswer: 1,
    explanation: "Stateless means servers don't store user session data locally. Instead, session data lives in a shared cache (Redis). This way, any server can handle any request - easy to add/remove servers!"
  },

  // Module 10: Hands-On Challenge Walkthrough
  {
    id: 28,
    moduleId: 10,
    question: "In the caching challenge, what was the main bottleneck causing slow response times?",
    options: [
      "The Lambda function was too small",
      "The network connection was slow",
      "Every request was hitting the database (expensive queries)",
      "Users had slow internet"
    ],
    correctAnswer: 2,
    explanation: "The problem was every request querying the database (600-800ms). Many queries were repetitive (same data requested multiple times). Databases are slow compared to in-memory caches."
  },
  {
    id: 29,
    moduleId: 10,
    question: "After adding a cache, what happens on a 'cache hit'?",
    options: [
      "The request goes to the database",
      "The request fails with an error",
      "Data is returned immediately from cache memory (fast!)",
      "The cache needs to be invalidated"
    ],
    correctAnswer: 2,
    explanation: "Cache hit = data is already in cache. Lambda gets it from cache memory (~5-10ms) instead of querying database (~600ms). Much faster! Cache misses still go to database, then cache the result."
  },
  {
    id: 30,
    moduleId: 10,
    question: "What's the most important step BEFORE choosing a solution to a challenge?",
    options: [
      "Pick the cheapest service available",
      "Identify the bottleneck and understand the problem deeply",
      "Add as many services as possible",
      "Ask the internet for the answer"
    ],
    correctAnswer: 1,
    explanation: "Always identify the bottleneck first! In the caching challenge, the bottleneck was repetitive database queries. Understanding the problem lets you choose the right solution (cache), not just any solution."
  }
];

export const getQuestionsByModule = (moduleId: number): QuizQuestion[] => {
  return quizQuestions.filter(q => q.moduleId === moduleId);
};
