// Cloud Provider Types
export type CloudProvider = 'AWS' | 'Azure' | 'GCP' | 'RunPod' | 'MongoDB';

// Service Category Types
export type ServiceCategory = 'compute' | 'storage' | 'database' | 'networking' | 'serverless' | 'ai' | 'cache' | 'messaging';

// Service Interface
export interface CloudService {
  id: string;
  name: string;
  provider: CloudProvider;
  category: ServiceCategory;
  baseCost: number;
  specs?: string;
  description?: string;
  inputSpec?: string;
  outputSpec?: string;
}

// Node Data Interface (for React Flow)
export interface NodeData {
  serviceName: string;
  customLabel?: string;
  category: ServiceCategory;
  cost: number;
  specs?: string;
  inputSpec?: string;
  outputSpec?: string;
  isExisting?: boolean;
}

// Architecture Node Interface
export interface ArchitectureNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
}

// Architecture Edge Interface
export interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  label?: string | React.ReactNode;
}

// Existing Infrastructure Interface
export interface ExistingInfrastructure {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

// Challenge Constraints Interface
export interface ChallengeConstraints {
  maxCost?: number;
  requiredServices?: string[];
  optionalServices?: string[];
  minServices?: number;
  maxServices?: number;
}

// Challenge Difficulty Type
export type ChallengeDifficulty = 'Easy' | 'Medium' | 'Hard';

// Challenge Solution Interface
export interface ChallengeSolution {
  id: string;
  author: string;
  title: string;
  architecture: {
    nodes: ArchitectureNode[];
    edges: ArchitectureEdge[];
  };
  explanation: string;
  totalCost: number;
  upvotes: number;
  provider: CloudProvider;
}

// Challenge Interface
export interface Challenge {
  id: string;
  title: string;
  difficulty: ChallengeDifficulty;
  description: string;
  requirements: string[];
  constraints: ChallengeConstraints;
  category: string;
  acceptanceRate?: number;
  submissions?: number;
  existingInfrastructure?: ExistingInfrastructure;
  optimalSolution?: {
    services: string[];
    estimatedCost: number;
  };
  editorial?: string;
  solutions?: ChallengeSolution[];
}

// User Solution Interface
export interface UserSolution {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  totalCost: number;
  timestamp: Date;
}

// Provider Logo Interface
export interface ProviderLogo {
  icon: string;
  color: string;
  name: string;
}

// API Response Types
export interface ApiError {
  message: string;
  status?: number;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  message?: string;
  error?: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  completedChallenges?: string[];
  score?: number;
}

// Architecture State Interface
export interface ArchitectureState {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

// Cloud Services Data Structure
export interface CloudServicesData {
  [provider: string]: {
    [category: string]: CloudService[];
  };
}

// Coding Problem Types
export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  hidden?: boolean;
}

export interface ProblemDifficulty {
  level: 'Easy' | 'Medium' | 'Hard';
  color: string;
}

export interface CodingProblem {
  id: string;
  number: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  companies: string[];
  description: string;
  examples: Example[];
  constraints: string[];
  hints?: string[];
  starterCode: {
    [language: string]: string;
  };
  testCases: TestCase[];
  acceptanceRate?: number;
  submissions?: number;
  editorial?: string;
  solutions?: ProblemSolution[];
}

export interface ProblemSolution {
  id: string;
  author: string;
  language: string;
  code: string;
  explanation: string;
  upvotes: number;
  timeComplexity: string;
  spaceComplexity: string;
}
