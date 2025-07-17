# AI-SOW-Generator: Project Documentation

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [File Structure Diagram](#file-structure-diagram)
3. [Backend Overview](#backend-overview)
    - [Backend Libraries](#backend-libraries)
    - [Backend File Explanations](#backend-file-explanations)
4. [Frontend Overview](#frontend-overview)
    - [Frontend Libraries](#frontend-libraries)
    - [Frontend File Explanations](#frontend-file-explanations)
5. [System Architecture & Flow](#system-architecture--flow)
6. [Notable Features](#notable-features)
7. [Further Development](#further-development)

---

## Project Overview

**AI-SOW-Generator** is a full-stack application for generating, viewing, and managing Statements of Work (SOW) documents using AI. It features:
- AI-powered SOW generation via AWS Bedrock (LangChain)
- Dynamic, user-friendly React frontend
- JWT-based authentication (email only)
- MongoDB for persistent storage
- PDF export and modern UI/UX

---

## File Structure Diagram

```
AI-SOW-Generator/
├── backend/
│   ├── ai.py
│   ├── app.py
│   ├── config.py
│   ├── db.py
│   ├── jwt_utils.py
│   ├── models.py
│   ├── requirements.txt
│   └── pyproject.toml
├── frontend/
│   ├── build.ts
│   ├── components.json
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.ts
│   ├── vite.config.ts
│   ├── bunfig.toml
│   ├── bun-env.d.ts
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── contexts/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── utils/
│   │   └── components/
│   ├── public/
│   └── styles/
├── Documentation.md
├── ToDo.md
├── package.json
└── tsconfig.json
```

---

## Backend Overview

### Backend Libraries

- **Flask**: Web framework for API endpoints.
- **Flask-Cors**: CORS support for cross-origin requests.
- **PyJWT**: JWT token creation and validation.
- **pymongo**: MongoDB client for data storage.
- **langchain, langchain-aws**: LLM orchestration and AWS Bedrock integration.
- **boto3**: AWS SDK for Python.
- **python-dotenv**: Loads environment variables from `.env`.
- **pydantic**: Data validation and serialization for models.

### Backend File Explanations

#### `ai.py`
- **Purpose**: Implements the `AIService` class, which connects to AWS Bedrock using `boto3` and `langchain_aws` to generate SOW documents via LLMs.
- **Features**:
  - Handles prompt construction and dynamic system prompts.
  - Parses and validates LLM responses.
  - Ensures output is a valid JSON structure for downstream use.
- **Key Libraries**: `boto3`, `langchain_aws`, `requests`, `logging`

#### `app.py`
- **Purpose**: Main Flask application. Defines all backend API endpoints.
- **Features**:
  - `/api/generate-document`: Generates a SOW using the AI service.
  - `/api/login`: Authenticates user (email only, creates user if not found).
  - `/api/refresh`: Refreshes JWT token.
  - `/api/sows` (POST/GET): Create or list SOWs for the authenticated user.
  - `/api/sows/<sow_id>` (GET/PUT/DELETE): Retrieve, update, or delete a specific SOW.
  - Integrates with MongoDB, JWT, and the AI service.
- **Key Libraries**: `flask`, `flask_cors`, `bson`, `pydantic`, `re`

#### `config.py`
- **Purpose**: Loads and exposes environment variables for AWS and Flask configuration via the `ConfigAI` class.
- **Features**:
  - Centralizes all configuration (AWS keys, region, model ID, debug flags, CORS origins, timeouts).
- **Key Libraries**: `dotenv`, `os`

#### `db.py`
- **Purpose**: Sets up the MongoDB connection using `pymongo` and exposes a `MongoDB` class for collection access.
- **Features**:
  - Loads credentials from environment variables.
  - Provides a `get_collection` method for easy access to collections.
- **Key Libraries**: `pymongo`, `dotenv`

#### `jwt_utils.py`
- **Purpose**: Utility functions for creating and decoding JWT tokens using `PyJWT`.
- **Features**:
  - Handles token creation, expiration, and validation.
  - Used for stateless authentication in the backend.
- **Key Libraries**: `jwt`, `datetime`, `dotenv`

#### `models.py`
- **Purpose**: Defines Pydantic models for data validation and serialization.
- **Features**:
  - `Slide`: Represents a slide in a SOW.
  - `Sow`: Represents a SOW document.
  - `User`: Represents a user.
- **Key Libraries**: `pydantic`

#### `requirements.txt` / `pyproject.toml`
- **Purpose**: Lists all Python dependencies (see above for main libraries).

---

## Frontend Overview

### Frontend Libraries

- **React**: UI framework.
- **react-router-dom**: Routing.
- **@radix-ui/react-\***: UI primitives (dialogs, dropdowns, etc.).
- **react-hook-form**: Form state management.
- **zod**: Schema validation.
- **clsx, tailwind-merge**: Utility for class name merging.
- **tailwindcss**: Utility-first CSS framework.
- **lucide-react**: Icon library.
- **jspdf, html2canvas**: PDF export and HTML-to-image conversion.
- **@dnd-kit/\***: Drag-and-drop utilities.
- **vite**: Build tool.
- **bun**: JS runtime and package manager.

### Frontend File Explanations

#### Entry Points & Routing

- **index.html**
  - HTML entry point, loads `src/main.tsx`.

- **src/main.tsx**
  - Mounts the React app to the DOM and applies global styles.

- **src/App.tsx**
  - Main app component. Sets up routing:
    - `/login`: Login page.
    - `/`: SOW generator (protected).
    - `/presentation`: SOW viewer (protected).
    - `/sow-list`: List of generated SOWs (protected).
  - Uses `ThemeProvider` and an error boundary.

#### Contexts

- **src/contexts/ThemeContext.tsx**
  - Provides dark/light theme context and toggle functionality.

#### API & Utilities

- **src/lib/api.ts**
  - Centralizes all API calls to the backend (login, SOW CRUD, etc.).

- **src/lib/useAuth.ts**
  - React hook for managing authentication token state.

- **src/lib/utils.ts**
  - Utility for merging class names using `clsx` and `tailwind-merge`.

#### Pages

- **src/pages/GenerateSOWPage.tsx**
  - Main SOW generator form. Handles required and optional fields, form state, and submission to the backend. Integrates with authentication and navigation.

- **src/pages/SOWViewer.tsx**
  - Displays a generated SOW as a series of slides. Handles slide navigation, rendering, and uses `TemplateApplier` for slide layouts.

- **src/pages/SOWList.tsx**
  - Lists all SOWs for the authenticated user. Allows viewing, regenerating, and deleting SOWs.

- **src/pages/LoginPage.tsx**
  - Login form (email-based). Handles authentication and token storage.

#### Components

- **src/components/Logo.tsx**
  - Displays the Workmates logo and wraps the main content.

- **src/components/BackToGeneratorButton.tsx**
  - Navigates back to the SOW generator page.

- **src/components/SOWListButton.tsx**
  - Navigates to the SOW list page.

- **src/components/LogoutButton.tsx**
  - Logs out the user and clears the token.

- **src/components/ThemeToggle.tsx**
  - Toggles between dark and light themes.

- **src/components/Generator/RequiredFieldsForm.tsx**
  - Form for required SOW fields (client name, project description, etc.).

- **src/components/Generator/OptionalFieldsSelector.tsx**
  - Allows users to add/remove optional SOW fields dynamically.

- **src/components/Generator/ErrorBoundary.tsx**
  - Catches and displays errors in the generator UI.

- **src/components/Viewer/DownloadPDFButton.tsx**
  - Exports the current SOW as a PDF using `jspdf` and `html2canvas`.

- **src/components/Viewer/SOWDateSection.tsx**
  - Displays the SOW date on slides.

- **src/components/Viewer/SOWNumberSection.tsx**
  - Displays the SOW number on slides.

- **src/components/Viewer/TemplateApplier.tsx**
  - Applies the correct template and layout to each slide, rendering markdown content.

- **src/components/Viewer/Thumbnails.tsx**
  - Shows slide thumbnails for navigation in the viewer.

- **src/components/ui/**
  - Reusable UI primitives (button, card, alert, input, textarea, etc.) built on top of Radix UI and Tailwind.

#### Types

- **src/types/page.ts**
  - TypeScript interfaces for SOW data and slides.

- **src/types/template.ts**
  - Template definitions for different slide layouts.

#### Utilities

- **src/utils/contentSplitter.ts**
  - Splits slide content into multiple slides if it overflows, based on content type and layout.

- **src/utils/sowMeta.ts**
  - Generates SOW numbers and dates.

---

## System Architecture & Flow

### Backend Flow

1. **User logs in** (email only) → `/api/login` issues a JWT.
2. **User submits SOW form** → `/api/generate-document` calls the AI service to generate a SOW using AWS Bedrock LLM.
3. **SOW is saved** to MongoDB, associated with the user.
4. **User can list, view, update, or delete SOWs** via `/api/sows` endpoints.

### Frontend Flow

1. **User visits app** → If not authenticated, redirected to `/login`.
2. **User fills SOW form** → Required and optional fields, dynamic UI.
3. **On submit** → Calls backend to generate SOW, then navigates to viewer.
4. **Viewer** → Shows slides, allows PDF export, navigation, and thumbnail preview.
5. **SOW List** → User can view, regenerate, or delete previous SOWs.

---

## Notable Features

- **AI-powered SOW generation** using AWS Bedrock via LangChain.
- **Dynamic form** with required/optional fields.
- **JWT-based authentication** (email only, no password).
- **MongoDB** for persistent storage.
- **PDF export** of generated SOWs.
- **Dark/light theme** with context and toggle.
- **Modern, accessible UI** using Radix UI and Tailwind CSS.

---

## Further Development

- See `ToDo.md` for planned features and improvements.

---

## Onboarding Tips for Developers

- **Start with the file structure diagram** to get a sense of the project layout.
- **Backend**: Review `app.py` for API endpoints, `ai.py` for AI logic, and `models.py` for data models.
- **Frontend**: Start with `App.tsx` and `pages/` for routing and main flows. Explore `components/` for reusable UI and logic.
- **API contracts**: See `src/lib/api.ts` and backend endpoints for request/response shapes.
- **Styling**: Tailwind CSS is used throughout, with custom themes and Radix UI for accessibility.
- **Environment variables**: Required for AWS, MongoDB, and JWT secrets (see `.env.example` if available).

If you need more details on any file or feature, consult this documentation or ask the project maintainers!
