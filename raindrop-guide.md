Raindrop Developer Documentation: Platform Technical Reference1.0 Raindrop: The AI-Driven Application Platform1.1 Core Concept: From AI Code Assistant to Application OrchestratorThe Raindrop Developer Documentation provides the technical foundation for the Raindrop platform, a system designed to build and deploy scalable AI infrastructure.1 The platform's primary value proposition is its deep integration with AI coding tools, such as Claude Code, to move beyond simple code suggestion and into full-stack application development and deployment.1The fundamental paradigm of the Raindrop platform is the transformation of the AI-assisted coding model. Traditionally, AI assistants act as "copilots," suggesting code snippets that a developer must manually integrate, test, and deploy. Raindrop, through its core architectural component, the MCP server, elevates the AI tool from a suggester to an orchestrator.1When connected to Raindrop, an AI tool like Claude Code ceases to merely generate code; it begins to implement complete, production-ready applications. This includes the capability to "Provision real cloud infrastructure automatically" and "Deploy working applications to live URLs".1 The developer's role shifts from writing and wiring code to defining requirements and guiding a high-level, automated development process.1.2 The 30-Second Quick Start WorkflowThe platform presents a high-level, three-step workflow for developers to get from concept to a deployed application.1Step 1: Add MCP EndpointThis is a one-time setup action where the developer connects the Raindrop MCP (Multi-Agentic Coordination Platform) server to their AI tool (e.g., Claude Code) within their configuration. This connection grants the AI tool access to all of Raindrop's "AI building blocks," which are the full-stack components the platform can provision.1Step 2: Start BuildingThe developer interacts with their AI tool using natural language, telling it what to build (e.g., "build a task management CRUD API"). The AI, now powered by the MCP, automatically selects and utilizes the necessary Raindrop components (such as databases, services, and authentication) to construct the application based on the stated requirements.1Step 3: Deploy InstantlyThe application is deployed globally. This deployment is comprehensive, including built-in AI capabilities, persistent storage (like SQL databases and object storage), and automatic scaling. This process requires "No infrastructure setup" or manual DevOps configuration from the developer.12.0 Core Architecture: The Raindrop MCP Server2.1 Defining the MCP (Multi-Agentic Coordination Platform)The Raindrop MCP (Model Context Protocol) server is the central nervous system and "brain" of the Raindrop platform.1 It is a specialized integration layer, not a standalone application, that extends the capabilities of AI coding tools like Claude Code and the Gemini CLI.3Its primary function is to transform these AI tools from text-based code generators into "powerful infrastructure development platforms".1 It achieves this by providing the AI with a set of structured, guided workflows and the authority to provision and manage the full suite of Raindrop components.12.2 Primary Role: Guided Automation and Infrastructure OrchestrationThe MCP server's role is twofold:Guided AutomationThe MCP provides "structured workflows that ensure nothing gets missed".2 This replaces ad-hoc, conversational prompting with "proven development phases".2 The AI, guided by the MCP, systematically walks the developer through a formal development lifecycle, ensuring all requirements are captured and implemented correctly.Infrastructure OrchestrationWhen an AI tool is connected to the MCP, it gains the ability to provision and orchestrate the entire Raindrop platform.1 This includes provisioning databases (SQL, Vector), compute (Services, Actors), storage (Buckets, KV stores), and even specialized AI-native components (SmartSQL, SmartMemory).1State ManagementThe MCP is a stateful system. It "maintains context across conversations and team members".2 This capability allows developers to pause development, switch projects, or have multiple team members collaborate on the same application, with the MCP preserving all progress, decisions, and context.22.3 The MCP Development Lifecycle (The AI-Agentic Loop)When a developer initiates a new application, the MCP orchestrates a complete, multi-step workflow that functions as an agentic, closed-loop system. This system goes beyond code generation to include project management, DevOps, and automated quality assurance.1The workflow steps are as follows:Session & Timeline Management: Creates a new session ID and timeline ID to track the state and history of the new application.1Requirements Gathering: Guides the user through the process of defining the application's features, resulting in a formal Product Requirements Document (PRD).1Architecture & Manifest Generation: Based on the approved PRD, the MCP generates the application architecture and the raindrop.manifest file, which serves as the application's "Infrastructure as Code" blueprint.1Infrastructure Setup: The MCP provisions all necessary cloud infrastructure, including databases, services, and other components defined in the manifest.1Code Implementation: The MCP implements the "complete application code" for all services and business logic.1Deployment: The MCP handles the deployment of the application to live, globally accessible infrastructure.1Validation & Auto-Fix: The MCP "validates deployment with endpoint testing".1 This is a critical step where the MCP acts as a QA agent, calling its own deployed endpoints to check for errors. If issues are found, the workflow includes the capability to "Auto-fix any issues found during testing".42.4 Supported AI ToolsThe Raindrop MCP server is designed as an integration point for multiple AI coding environments. The primary tools referenced are:Claude Code: npm install -g @anthropic-ai/claude-code.6Gemini CLI: Installed via its GitHub repository.33.0 Getting Started: Platform Setup3.1 OverviewThis section provides the detailed, step-by-step instructions for installing the necessary tools and connecting them to the Raindrop MCP server.3A critical prerequisite for Windows users is the use of WSL (Windows Subsystem for Linux). Other Windows terminals, such as standard Command Prompt or PowerShell, are not supported for this workflow.63.2 Step 1: Install AI ToolThe developer must first install their preferred AI coding tool.For Claude Code:Shellnpm install -g @anthropic-ai/claude-code
63.3 Step 2: Install Raindrop CLIThe Raindrop CLI is the command-line interface used to manage the local environment, authenticate, and interact with platform resources.3Command:Shellnpm install -g @liquidmetal-ai/raindrop
33.4 Step 3: Sign Up for RaindropA Raindrop platform account is required to authenticate and use the MCP.Sign up for an account at liquidmetal.run.3Complete the account setup process.3.5 Step 4: Authenticate Raindrop CLIThe local Raindrop CLI must be authenticated with the Raindrop account created in the previous step.3Command:Shellraindrop auth login
3This command will typically open a browser window for login and authorization.3.6 Step 5: Set Up MCP IntegrationThis step uses the Raindrop CLI to configure the locally installed AI tool, informing it of the Raindrop MCP server's location and installing custom commands.3For Claude Code:Shellraindrop mcp install-claude
6For Gemini CLI:Shellraindrop mcp install-gemini
3This installation command is the critical bridge between the Raindrop platform and the AI tool. It configures the MCP server URL and injects the Raindrop-specific slash commands (e.g., /new-raindrop-app, /update-raindrop-app) into the AI tool's environment.33.7 Step 6: Start and Connect Your AI ToolThe final step is to start the AI tool and establish the connection to the MCP server from within it.6Start your AI tool (e.g., run claude-code in your terminal).Run the MCP command: /mcp.1A list of available MCP servers will appear. Select raindrop-mcp.1Select Authenticate.A browser window will open. Log in to your Raindrop account or click Allow Access if already logged in.1The AI tool is now fully connected to the Raindrop MCP and is ready to receive Raindrop workflow commands.4.0 Tutorial: Building a CRUD API (End-to-End Workflow)4.1 OverviewThis tutorial details the primary end-to-end user story: building a complete, production-ready Task Management CRUD API using a single, guided conversation with an MCP-enabled AI tool.4 This workflow demonstrates how a developer uses natural language prompts to steer the MCP's automated development lifecycle.The resulting architecture of this tutorial is a live, deployed API with 4:Core Entities: Users (with registration, authentication, and profiles), Projects, Tasks (with assignments, status, etc.), Comments, and File Attachments.Security: JWT-based authentication and authorization logic to ensure users can only access their own data.Features: A complete set of RESTful endpoints, database relationships, file upload support, and input validation.4.2 Step 1: Initiating the MCP Workflow (The "Start" Prompt)The developer begins by starting a new session in their AI tool and using a specific prompt to log in to the Raindrop MCP and initiate the new application workflow.4Prompt for Claude Code:Claude, call the LiquidMetal Raindrop:login MCP tool to start a new application development session.
6Alternatively, the /new-raindrop-app slash command can be used.6A more descriptive prompt from the tutorial, which combines the login call with the initial request, is:I want to build a Task Management CRUD API using the Raindrop MCP. Please call the liquidmetal-staging:login MCP tool to start a new application development session, then continue with the workflow.
44.3 Step 2: PRD Creation and Approval (The "Requirements" Prompt)The MCP will respond by asking the developer to describe the application. This description is used to generate the Product Requirement Document (PRD).4 The detail and clarity of this prompt are critical, as the MCP parses these requirements to design the database schema, API endpoints, and authentication logic.Example Detailed Prompt:I want to build a comprehensive task management API that includes:

Core Entities:
- Users (registration,...[source](https://docs.liquidmetal.ai/tutorials/crud-api-with-raindrop-mcp)
44.4 Step 3: Automated Backend Development (The "Continue" Prompt)After the developer and the AI agree on the PRD (which may involve clarifying questions), the developer gives the command to proceed with the build.4Prompt:Perfect! Please continue with the Raindrop MCP workflow to implement the complete API infrastructure. Make sure to include proper API documentation and example requests/responses for each endpoint.
4At this point, the Raindrop MCP takes over and executes the full automated development and deployment lifecycle 4:Designs database schemas for Users, Projects, Tasks, etc., with proper relationships (implying the use of SQL Databases).Generates API endpoints for all CRUD operations (implying the use of Services).Implements JWT authentication and password hashing.Sets up authorization logic (e.g., users can only access their own data).Configures file upload handling with secure storage (implying the use of Bucket Storage or SmartBuckets).Deploys the entire application to live infrastructure with public API URLs.Runs automated testing and validation by calling each endpoint.Auto-fixes any issues found during the testing phase.4.5 Step 4: API Testing and Documentation (The "Retrieve" Prompt)Once the MCP completes the deployment and validation, the developer asks for the final results and documentation.4Prompt:Great! Now please provide me with:

1. The base URL for my deployed API
2. A complete list of all available endpoints
3. Example curl commands for each major operation (register, login, create project, create task, etc.)
4. The database schema that was created
5. Any API keys or authentication details I need
44.6 Step 5: Test Your APIThe developer receives the deployed URL, endpoint documentation, and example curl commands from the AI. They can now test the live, production-ready API using curl, Postman, Insomnia, or by beginning to build a frontend application against it.45.0 Raindrop Platform Components: A Comprehensive Reference5.1 OverviewThe Raindrop platform is a comprehensive, full-stack "Platform-as-a-Service" (PaaS). The "AI building blocks" mentioned in the quick start guide 1 refer to a suite of provisionable components that the MCP can orchestrate. These components cover compute, messaging, storage, and specialized AI-native services.15.2 Component Reference TableThe following table summarizes the core components that the Raindrop MCP can provision and manage.1ComponentCategoryDescriptionServicesComputeAPI endpoints with routing and business logic.ActorsComputeStateful components with persistent data.ObserversComputeEvent-driven automation and processing.TasksComputeScheduled operations and cron jobs.QueuesMessagingMessage queues for async processing.SQL DatabasesStorageRelational data with schemas and relationships.Vector DatabasesStorageHigh-dimensional search for AI applications.KV StoresStorageKey-value storage for configuration and caching.Bucket StorageStorageObject storage for files and data.SmartBucketsAI-Enhanced StorageAI-enhanced document processing and search.SmartMemoryAI-Enhanced StorageState management for AI agents.SmartSQLAI-Enhanced StorageAI-powered relational database interaction.AI ModelsAI / IntegrationLanguage models, embeddings, and specialized AI services.Domain names...NetworkingLive web access to your applications.5.3 Compute ComponentsServicesPurpose: Services are the primary component for stateless compute. They are intended for building API endpoints (e.g., REST, GraphQL) and handling webhook logic.1 They manage routing, business logic, and response formatting.Implementation: Services are implemented as TypeScript classes that extend the base Service class provided by the Raindrop framework.9Example Code Snippet:TypeScript// A service class is automatically generated
// and gains access to platform resources via the 'env' object.
export default class extends Service<Env> {

  //... implementation of API endpoints

}
9ActorsPurpose: Actors are stateful compute components designed for use cases that require persistent state to be held in memory, such as real-time collaborative documents, game sessions, or complex state machines.1Architecture: The Actor model ensures that each actor instance handles requests serially, which maintains data consistency without requiring manual locking.12 Actors have a unique, deterministic ID (via idFromName) and can schedule future work for themselves using alarms.12Integration: Services often act as a stateless frontend or gateway that authenticates requests and then routes them to the appropriate stateful Actor instance.11ObserversPurpose: Observers are components for event-driven automation and processing.1 They react to events that occur elsewhere in the system, most commonly file uploads to Bucket Storage or new messages arriving in Queues.13Architecture: Observers enable a decoupled, asynchronous architecture. For example, a user can upload an image (a fast operation), and an Observer can asynchronously trigger a separate, long-running process for image processing or analysis.13 The platform provides automatic scaling based on event volume, as well as resilient features like exponential backoff for retries and dead-letter queues (DLQs) for persistently failing events.13Integration: Observers can coordinate with Actors to perform stateful event processing 13 and can also call external APIs or trigger webhooks to integrate with third-party systems.13TasksPurpose: Tasks are components for running scheduled operations, such as cron jobs.1 They are used for recurring maintenance, batch processing, or any time-based execution.5.4 Messaging ComponentsQueuesPurpose: Queues provide asynchronous message passing to decouple system components.1 They allow different parts of an application to communicate without being directly connected or available at the same time.Integration: Queues are a key part of multi-stage processing pipelines. A Service can receive a request, send a message to a Queue, and immediately return a response to the user. An Observer can then process that message from the Queue in the background.135.5 Standard Storage ComponentsSQL DatabasesPurpose: Provides standard relational data storage with schemas, tables, and relationships.1Usage: In the MCP workflow, the AI automatically designs the database schema based on the entities defined in the PRD.4Vector DatabasesPurpose: A specialized database for high-dimensional search.1 This is a foundational component for modern AI applications, particularly for Retrieval-Augmented Generation (RAG), enabling semantic search over large datasets.2KV StoresPurpose: High-speed key-value storage optimized for fast access to simple data.1 It is ideal for caching, storing configuration data, managing user session data, and implementing rate-limiting counters.16Key Features: 16String-Based Addressing: Uses simple string keys for all data.Automatic Lifecycle Management (TTL): Built-in Time-To-Live (TTL) functionality automatically removes expired data, preventing stale data and leaks.Atomic Operations: Operations on individual keys are atomic, ensuring reliability for tasks like incrementing counters.Global Distribution: Data is automatically replicated for high availability and low-latency performance.Bucket StoragePurpose: Standard S3-compatible object storage for files, images, documents, and other unstructured data.1Usage: This is the component used for the "File attachments" feature in the CRUD API tutorial.4 It can be managed via the raindrop object CLI 18 or the SDK.5.6 AI-Enhanced Components (The "Smart" Stack)This suite of components represents the platform's unique AI-native capabilities.SmartBucketsPurpose: SmartBuckets extend the functionality of standard Bucket Storage by adding powerful, built-in AI capabilities, most notably semantic search.1 This allows developers to search for documents based on their meaning, not just their file names or keywords.Usage (SDK):JavaScript// Example for Uploading a file
import Raindrop from '@liquidmetal-ai/lm-raindrop';

const client = new Raindrop({ 
  apiKey: process.env, 
});

async function uploadFile() {
  const response = await client.object.upload('my-file-key', { 
    bucket: 'my-smartbucket-name', 
    body: fs.createReadStream('path/to/local/file'), 
  }); 
  console.log(response.bucket);
}

// Example for Performing Semantic Search
async function searchFiles() {
  const searchResponse = await client.search.perform({ 
    input: 'a natural language query about my documents', 
    request_id: 'some-request-id' 
  });
  console.log(searchResponse.pagination);
}
22SmartMemoryPurpose: SmartMemory is a highly specialized component designed to provide persistent, structured state management for AI agents.1 It is the key to building the "Multi-Agentic" systems the MCP is named for, allowing agents to learn, remember, and build knowledge over time.Cognitive Architecture: SmartMemory provides a formal "memory" model divided into four types 23:Working Memory: For active session conversations and context.Episodic Memory: For historical, completed sessions that can be searched and restored.Semantic Memory: For persistent facts, documents, and general knowledge.Procedural Memory: For reusable templates, skills, and procedures.Usage (SDK):TypeScript// In a Service or Actor, access SmartMemory via the 'env' object
const smartMemory = env.MEMORY;

// Start a new working memory session for an agent
const { sessionId, workingMemory } = await smartMemory.startWorkingMemorySession();

// Store a memory (fact) in the current session
const memoryId = await workingMemory.putMemory({
  content: "User prefers morning meetings",
  timeline: "preferences"
});

// Search memories using semantic vector search
const results = await workingMemory.searchMemory({
  terms: "meeting schedule" // Finds semantically similar content
});
23SmartSQLPurpose: SmartSQL is an AI-infused relational database (using SQLite syntax) that integrates AI capabilities directly into data operations.24 It allows for natural language queries and built-in sensitive data detection.Usage (SDK):TypeScript// In a Service or Actor, access SmartSQL via the 'env' object
const db = env.SSQL_DEMO;

// 1. Execute standard SQL queries
const sqlResult = await db.executeQuery({
  sqlQuery: "SELECT * FROM users WHERE age > 21"
});

// 2. Execute Natural Language Queries
const nlResult = await db.executeQuery({
  textQuery: "Show me all active users from the last month",
  format: "json"
});
// The AI translates this to SQL and executes it
console.log(nlResult.queryExecuted); // e.g., "SELECT * FROM users WHERE status = 'active' AND created_at >..."
console.log(nlResult.results); // JSON string with user data

// 3. Detect PII (Personally Identifiable Information)
const piiData = await db.getPiiData("customers");
piiData.piiDetections.forEach(detection => {
  detection.entities.forEach(entity => {
    console.log(`Found ${entity.entityType}: ${entity.detectedText}`);
    // e.g., "Found EMAIL: john@example.com"
  });
});
255.7 Platform IntegrationsAI ModelsPurpose: The platform provides a unified interface to a comprehensive suite of AI models, including text generation (LLMs), embeddings, image processing, and specialized models for code or math.1 This abstracts the complexity of working with different AI providers.Key Features: A single env.AI.run() method provides type safety, tool-calling support for advanced models, automatic routing, and support for real-time streaming.9Usage (SDK):TypeScript// Example: Generating text embeddings
const embedding = await env.AI.run('embeddings', {
  text: "This is the text to embed."
});
const vector = embedding.data.embedding;

// Example: Running PII detection model
const piiResult = await env.AI.run('pii-detection', {
  prompt: "My name is John Doe and my email is john@example.com."
});
piiResult.pii_detection.forEach(entity => {
  console.log(`${entity.entity_type}: ${entity.text}`);
});
9AnnotationsPurpose: A system for managing application metadata, allowing developers to list and filter annotations associated with their services or resources.1Usage (SDK):TypeScript// List all annotations with a specific prefix
const results = await env.ANNOTATION.list({ prefix: "user-service:" });
276.0 Configuration: The raindrop.manifest File6.1 Core Concepts: AI-Driven Infrastructure as Code (IaC)The raindrop.manifest file is the central configuration file that defines a Raindrop application and all its components.26 This file uses HCL (HashiCorp Configuration Language) syntax, similar to tools like Terraform.26This file serves as the "Infrastructure as Code" (IaC) blueprint, defining all application components (services, actors, databases, buckets) and their relationships.29 A key aspect of the Raindrop platform is that this file is primarily generated and updated by the AI as part of the MCP's guided workflow.26For example, the /new-raindrop-app workflow "Generates application architecture and manifest".1 Similarly, when a developer uses the /update-raindrop-app command to add authentication, the AI "Update[s] raindrop.manifest with [an] auth service".26 This represents a conversational, AI-driven approach to managing the IaC state.6.2 Project Directory StructureThe MCP workflow generates and manages a standard project directory structure, which is stored locally within the user's home directory under ~/.raindrop/<session_id>/.26An example session directory contains the following key files:~/.raindrop/sess_abc123/:raindrop.manifest: The HCL infrastructure configuration file defining services and resources.26src/: A directory containing all the generated TypeScript application code.26artifacts.json: A metadata file that stores deployment URLs, resource IDs, and other deployment artifacts.26session.json: A file that tracks the current state of the MCP workflow and its timeline.266.3 Manifest Schema and Configuration ExamplesThe following HCL code blocks demonstrate how to define and bind resources within the raindrop.manifest file.Defining an Application and Service:Terraformapplication "ai-app" {
  
  # Defines a compute service
  service "api" {
    domain = "api.example.com"
    # The 'env.AI' binding is automatically available
  }
}
9Defining SmartSQL:Terraformapplication "demo-app" {
  
  # Defines a SmartSQL database instance
  smartsql "ssql-demo" {}
  
  service "api" {
    # This service can now access the database
    # via the 'env.SSQL_DEMO' object in its TypeScript code
  }
}
25Defining SmartMemory:Terraformapplication "demo-smartmemory" {
  
  # Defines a SmartMemory instance for AI agents
  smartmemory "memory" {}
  
  service "agent-service" {
    # This service can now access the memory
    # via the 'env.MEMORY' object in its TypeScript code
  }
}
23Defining SmartBucket:Terraformapplication "my-app" {
  
  # Defines a SmartBucket for AI-enhanced object storage
  smartbucket "my-smart-bucket" {}
}
31Defining a Standard SQL Database:Terraformapplication "my-app" {
  
  # Defines a standard relational SQL database
  sql "main-db" {}
  
  actor "data-processor" {
    # Bindings can be applied to Actors as well
  }
}
327.0 Developer Tooling: SDK and CLI Reference7.1 The Dual Tooling SystemA developer interacts with the Raindrop platform through two distinct and complementary sets of tools:Raindrop Code (Slash Commands): These are commands (e.g., /new-raindrop-app) used inside a connected AI tool (like Claude Code) to initiate and control the MCP's high-level, automated development workflows.26Raindrop CLI: This is a standard terminal-based command-line interface (e.g., raindrop auth) used for platform-level management, authentication, manual resource interaction, and build processes.27.2 Raindrop Code (Slash Commands) ReferenceThese commands are injected into the AI tool's environment after running raindrop mcp install-....3 They are the primary interface for orchestrating AI-guided application development sessions.26CommandPurposeArgumentsUsage Example/new-raindrop-appCreate a new application from scratch.None> /new-raindrop-app/reattach-raindrop-sessionResume an existing application development session.[session_id] (Optional)> /reattach-raindrop-session sess_abc123/update-raindrop-appAdd new features to an existing, deployed application.[session_id] (Optional)> /update-raindrop-app/debug-raindrop-appDebug a deployed application by examining logs and testing endpoints.[session_id] (Optional)> /debug-raindrop-app267.3 Raindrop CLI ReferenceThis is the terminal-based CLI (raindrop) for managing the platform, credentials, and resources directly.2A key distinction exists between raindrop bucket and raindrop object. The raindrop bucket command is used to manage S3-compatible credentials for accessing buckets.18 The raindrop object command is used to manage the files (objects) themselves—uploading, downloading, and listing them.18CommandDescriptionraindrop authManages authentication for the CLI. Subcommand: login.3raindrop mcpManages MCP integration with AI tools. Subcommands: install-claude, install-gemini, status.3raindrop buildManages application builds, parsing the raindrop.manifest and deploying new versions.28raindrop bucketManages S3-compatible credentials for buckets. Subcommands: get-credential, list-credentials.18raindrop objectPerforms object storage operations (upload, download, list). Subcommands: put, get, list.2raindrop logsAccesses logs from deployed applications. Subcommands: query, tail.18raindrop queryRuns RAG search or chats with documents in a SmartBucket.34raindrop annotationManages application metadata.18raindrop dnsManages DNS zones and records.187.4 Detailed CLI Command ExamplesAuthentication:Shell# Authenticate the CLI with your Raindrop account
raindrop auth login
3MCP Setup:Shell# Configure Claude Code to use the Raindrop MCP
raindrop mcp install-claude
6Object (File) Management:Shell# Upload a file to a bucket
# Usage: raindrop object put <local-file> <remote-key> --bucket <bucket-name>
raindrop object put./myfile.txt my-key --bucket my-bucket
18Shell# Download an object from a bucket
# Usage: raindrop object get <remote-key> <local-file> --bucket <bucket-name>
raindrop object get my-key./local-copy.txt --bucket my-bucket
18Log Tailing:Shell# Tail logs from your deployed application, filtering for errors
raindrop logs tail --filter "error"
18SmartBucket Query (RAG):Shell# Run a RAG search query against a Smart Bucket
raindrop query chunk-search "What is LiquidMetal?"
357.5 SDK (TypeScript/JavaScript) ReferenceThese code examples demonstrate how to use the Raindrop SDK within the TypeScript code of a Service or Actor. Resources defined in the raindrop.manifest are typically accessed via the env object.SDK Client Initialization & Authentication:For external scripts or services, the SDK can be initialized with an API key from the Raindrop Dashboard.37JavaScriptimport Raindrop from '@liquidmetal-ai/lm-raindrop';

// Initialize client with an API key
const client = new Raindrop({ 
  apiKey: process.env, 
});
22SmartBucket / Object Operations (SDK):JavaScript// Upload a file
async function uploadFile() {
  const response = await client.object.upload('my-file-key', { 
    bucket: 'my-bucket-name', 
    body: fs.createReadStream('path/to/local/file'), 
  }); 
  console.log(response.bucket); 
}

// Perform semantic search
async function searchBucket() {
  const searchResponse = await client.search.perform({ 
    input: 'natural language query here', 
    request_id: 'unique-request-id' 
  });
  console.log(searchResponse.pagination);
}
22SmartMemory Operations (via env object):TypeScript// Access the SmartMemory instance bound in the manifest
const smartMemory = env.MEMORY;

// Start a new working memory session
const { sessionId, workingMemory } = await smartMemory.startWorkingMemorySession();
console.log(`Started session: ${sessionId}`);

// Store a memory in the working session
await workingMemory.putMemory({
  content: "User is working on a React project with authentication needs",
  timeline: "project-context",
  key: "requirements"
});

// Search working memory (uses semantic vector search)
const results = await workingMemory.searchMemory({
  terms: "user authentication" // Will match "login security", etc.
});
23SmartSQL Operations (via env object):TypeScript// Access the SmartSQL instance bound in the manifest
const db = env.SSQL_DEMO; 

// Execute a standard SQL query (SQLite syntax)
await db.executeQuery({
  sqlQuery: "INSERT OR REPLACE INTO products (id, name, price) VALUES (1, 'Laptop', 999.99)"
});

// Execute a natural language query
const nlResult = await db.executeQuery({
  textQuery: "Show me all laptops under 1000",
  format: "json"
});

// Detect PII in a table
const piiData = await db.getPiiData("customers");
piiData.piiDetections.forEach(detection => {
  console.log(`Found ${detection.entities.entityType}`);
});
258.0 SummaryThe Raindrop platform is an AI-driven application development and hosting environment. Its core component, the Raindrop MCP (Multi-Agentic Coordination Platform) server, transforms AI coding tools from code assistants into full-stack application orchestrators.The platform operates on a "guided workflow" model, where the MCP directs the AI and the developer through a stateful process:Requirements: The developer provides a natural language PRD.Architecture: The MCP designs the application and generates a raindrop.manifest (HCL) file.Provisioning: The MCP provisions a full stack of components, including compute (Services, Actors), messaging (Queues), storage (SQL, Vector, Bucket), and a unique "Smart" stack (SmartSQL, SmartMemory, SmartBuckets) with built-in AI capabilities.Deployment & Validation: The MCP implements the application code, deploys it to live URLs, and performs automated testing, including an "auto-fix" loop.Developers interact with this system using two distinct toolsets:Raindrop Code (Slash Commands): For AI-workflow orchestration inside an AI tool (e.g., /new-raindrop-app).Raindrop CLI: For terminal-based platform management, authentication, and manual resource interaction (e.g., raindrop object put).The SDK, exposed via an env object in services or an initialized client, provides code-level access to the platform's powerful components, enabling the development of sophisticated, AI-native, and multi-agentic applications.