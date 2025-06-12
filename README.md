# Tech Stack

### Frontend

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Package Manager**: Bun
- **Styling**: Tailwind CSS

### Backend

- **Framework**: Flask (Python)
- **AI Integration**: LangChain
- **AWS Integration**: Boto3
- **Presentation Generation**: python-pptx
- **Environment Management**: python-dotenv

# Project Structure

```
AI-PPT-Maker/
├── frontend/                 # React frontend application
│   ├── src/                 # Source code
│   ├── styles/             # Global styles and Tailwind configuration
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.ts      # Vite configuration
│   └── tailwind.config.ts  # Tailwind CSS configuration
│
├── backend/                 # Flask backend application
│   ├── services/           # Business logic and service implementations
│   ├── generated/          # Generated files and outputs
│   ├── app.py             # Main Flask application
│   ├── config.py          # Configuration settings
│   └── requirements.txt    # Python dependencies
│
└── README.md               # Project documentation
```

# Getting Started

## Environment Variables

### Frontend

Create a `.env` file in the frontend directory with:

```
BUN_API_URL=http://localhost:5173
```

### Backend

Create a `.flaskenv` file in the backend directory with:

```
FLASK_APP=app.py
FLASK_ENV=development
```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   bun install
   ```
3. Start the development server:
   ```bash
   bun run dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   uv venv .venv -p python3.11
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   uv pip install -r requirements.txt
   ```
4. Start the Flask server:
   ```bash
   flask run
   ```
