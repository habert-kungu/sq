# Legal AI Platform

A next-generation, AI-powered semantic search and analysis system for legal documents.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PNPM (recommended) or NPM
- MongoDB, Qdrant, Redis, RabbitMQ (via Docker)

### Installation

```bash
# Clone the repositories
git clone <legal-api-repo-url>
git clone <legal-admin-repo-url>

# Backend setup
cd legal-api
pnpm install

# Start infrastructure (MongoDB, Qdrant, Redis, RabbitMQ, Kong)
docker-compose up -d

# Start all microservices
pnpm run dev:all

# Frontend setup (in separate terminal)
cd legal-admin
npm install
npm run dev
```

## 📁 Project Structure

This project consists of **two separate repositories**:

### Backend Repository: `legal-api` (Microservices)
```
legal-api/
├── services/
│   ├── gateway/              # API Gateway - Kong (Port 3000)
│   ├── user-service/         # User & Auth (Port 3001)
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── README.md
│   ├── document-service/     # Document Management (Port 3002)
│   ├── search-service/       # Vector Search (Port 3003)
│   ├── analysis-service/     # Contract Analysis (Port 3004)
│   ├── feedback-service/     # Annealing System (Port 3005)
│   └── dashboard-service/    # Monitoring (Port 3006)
├── packages/
│   ├── shared-types/         # Shared Zod schemas
│   ├── shared-utils/         # Common utilities
│   └── shared-config/        # Config management
├── docker-compose.yml        # All services + infrastructure
├── package.json              # Root workspace (PNPM)
└── README.md
```

### Frontend Repository: `legal-admin`
```
legal-admin/
├── src/
│   ├── views/            # ✅ Page components
│   ├── components/       # ✅ Reusable components
│   ├── stores/           # ✅ Pinia stores
│   ├── router/           # ✅ Vue Router
│   ├── services/         # NEW - API clients
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── document.service.ts
│   │   ├── search.service.ts
│   │   ├── analysis.service.ts
│   │   └── dashboard.service.ts
│   ├── types/            # NEW - TypeScript types
│   └── utils/            # NEW - Helper functions
└── package.json
```

## 🏗️ Architecture

**Microservices Architecture**  
Each service is independently deployable and scalable, running in its own container with dedicated resources.

### Services:
1. **API Gateway** (Port 3000) - Kong
   - Request routing to microservices
   - Authentication & rate limiting
   - Load balancing

2. **User Service** (Port 3001)
   - Authentication & JWT tokens
   - User management
   - Organizations & API keys
   - RBAC permissions

3. **Document Service** (Port 3002)
   - File upload/download
   - S3 storage integration
   - Text extraction (PDF, DOCX)
   - Metadata management

4. **Search Service** (Port 3003)
   - Vector search with Qdrant
   - Semantic queries
   - Embedding generation
   - Search filtering

5. **Analysis Service** (Port 3004)
   - Contract risk scoring
   - Clause extraction
   - Document comparison
   - LLM integration

6. **Feedback Service** (Port 3005)
   - User feedback collection
   - Annealing algorithm
   - Learning metrics

7. **Dashboard Service** (Port 3006)
   - Real-time analytics
   - Token consumption tracking
   - System monitoring

### Infrastructure:
- **MongoDB** (Port 27017) - Primary database
- **Qdrant** (Port 6333) - Vector database
- **Redis** (Port 6379) - Caching layer
- **RabbitMQ** (Port 5672) - Message queue

### Benefits:
- ✅ Independent scaling per service
- ✅ Fault isolation
- ✅ Technology flexibility
- ✅ Team autonomy
- ✅ Better resource utilization

## 📚 Documentation

- **[Implementation Plan](./.agent/implementation-plan.md)** - Detailed 16-week development roadmap
- **[API Documentation](http://localhost:3000/api-docs)** - Swagger/OpenAPI docs (when running)

## 🧰 Tech Stack

**Frontend (legal-admin):**
- Vue 3 (Composition API)
- Vite
- Shadcn-Vue + Tailwind CSS
- Pinia (state management)
- Axios (HTTP client)
- Zod (validation)

**Backend (legal-api):**
- Express.js (TypeScript) - Microservices
- Kong API Gateway
- MongoDB (Mongoose)
- Qdrant (vector database)
- Redis (caching)
- RabbitMQ (message queue)
- Zod (validation)
- JWT + Passport.js (auth)
- Winston (logging)

**AI/ML:**
- OpenAI (embeddings & GPT-4)
- PDF.js (document rendering)
- pdf-parse, mammoth (text extraction)


## 🎯 Development Phases

### Phase 1: Foundation (Weeks 1-4) ⏳
- [ ] Microservices structure with PNPM workspaces
- [ ] User Service (migrate existing auth/user modules)
- [ ] Document Service
- [ ] Search Service with Qdrant
- [ ] API Gateway (Kong)
- [ ] RabbitMQ message queue

### Phase 2: Core Features (Weeks 5-10)
- [ ] Analysis Service
- [ ] Feedback & Annealing Service
- [ ] Dashboard & Monitoring Service
- [ ] Playground Interface
- [ ] Documentation Portal
- [ ] User Management & Permissions

### Phase 3: Advanced Features (Weeks 11-14)
- [ ] Advanced Search & Filtering
- [ ] Document Collaboration
- [ ] Performance Optimization
- [ ] Security & Compliance

### Phase 4: Polish & Launch (Weeks 15-16)
- [ ] Testing & Bug Fixes
- [ ] Production Deployment (Kubernetes)
- [ ] Beta Launch
- [ ] General Availability

## 🧪 Testing

```bash
# Run all tests
pnpm run test:all

# Run tests for specific service
cd services/user-service
pnpm test

# Run integration tests
pnpm run test:integration

# Run E2E tests
pnpm run test:e2e

# Run load tests
pnpm run test:load
```

## 🚢 Deployment

```bash
# Build all services
pnpm run build:all

# Build Docker images
docker-compose build

# Deploy to staging
pnpm run deploy:staging

# Deploy to production (Kubernetes)
kubectl apply -f k8s/
```

## 📊 Monitoring

- **API Gateway**: http://localhost:3000
- **Kong Admin**: http://localhost:8001
- **RabbitMQ Management**: http://localhost:15672
- **Dashboard Service**: http://localhost:3006
- **Prometheus**: http://localhost:9090 (if configured)
- **Grafana**: http://localhost:3001 (if configured)

## 🔑 Environment Variables

Each service has its own `.env` file. Copy `.env.example` to `.env` in each service directory:

```env
# User Service (Port 3001)
MONGODB_URI=mongodb://localhost:27017/legal-ai
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d

# Document Service (Port 3002)
S3_BUCKET=legal-ai-documents
S3_REGION=us-east-1
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key

# Search Service (Port 3003)
QDRANT_URL=http://localhost:6333
OPENAI_API_KEY=your-openai-key

# Analysis Service (Port 3004)
OPENAI_API_KEY=your-openai-key
REDIS_URL=redis://localhost:6379

# More in each service's .env.example...
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Make your changes in the appropriate service
3. Write tests
4. Run linter: `pnpm run lint`
5. Commit: `git commit -m "feat(service-name): add feature"`
6. Push: `git push origin feature/feature-name`
7. Create a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

- Documentation: http://localhost:3000/docs
- Issues: GitHub Issues
- Email: support@legal-ai.com

---

**Current Status:** Phase 1 - Foundation (Planning)

See [Implementation Plan](./.agent/implementation-plan.md) for detailed roadmap.
