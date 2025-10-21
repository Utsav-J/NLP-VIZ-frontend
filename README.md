# LexiView - NLP Visualization System

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB.svg?logo=react)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**LexiView** is an advanced Natural Language Processing (NLP) visualization system built with React. It provides interactive tools for linguistic analysis, entity recognition, and semantic understanding through a beautiful, modern user interface.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Core Files & Directory Structure](#core-files--directory-structure)
- [Components Breakdown](#components-breakdown)
- [Services & API Integration](#services--api-integration)
- [Theming System](#theming-system)
- [Sample Data Configuration](#sample-data-configuration)
- [How It Works](#how-it-works)
- [Backend Integration](#backend-integration)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

LexiView is a comprehensive frontend application for visualizing and analyzing natural language processing tasks. It connects to a Python-based backend API that performs sophisticated NLP operations using spaCy, Gemini AI, and other NLP libraries. The application provides an intuitive interface for researchers, developers, and linguists to explore and understand language structure.

### Key Capabilities

- **Interactive Visualizations**: Real-time visual representations of linguistic structures
- **Multi-feature Analysis**: Six different NLP analysis tools in one unified interface
- **AI-Powered Insights**: Integrated AI help system for explaining complex linguistic concepts
- **Modern UX**: Beautiful, responsive design with dark/light theme support
- **Sample-Based Learning**: Pre-configured sample texts for quick exploration
- **Live Backend Status**: Real-time monitoring of backend API health

---

## ✨ Features

### 1. **Part-of-Speech (POS) Tagging Analysis**
   - **Purpose**: Identifies and categorizes each word in a sentence by its grammatical role
   - **Features**:
     - Color-coded word highlighting based on POS tags
     - Interactive word selection with detailed linguistic information
     - Statistical breakdown showing distribution of parts of speech
     - Support for 16+ POS categories (NOUN, VERB, ADJ, ADV, PRON, DET, ADP, etc.)
     - AI-powered explanations of POS patterns
   - **Use Cases**: Grammar learning, linguistic research, text analysis

### 2. **Named Entity Recognition (NER)**
   - **Purpose**: Detects and classifies named entities in text
   - **Features**:
     - Automatic identification of entities (PERSON, ORG, GPE, MONEY, DATE, TIME, PERCENT, etc.)
     - Color-coded entity highlighting
     - Entity statistics and distribution charts
     - Click-to-view detailed entity information
     - AI explanations for why entities are classified
   - **Use Cases**: Information extraction, document analysis, content categorization

### 3. **Dependency Parsing**
   - **Purpose**: Visualizes grammatical relationships between words
   - **Features**:
     - Interactive tree diagram showing syntactic dependencies
     - SVG-based visualization that can be expanded/zoomed
     - Dependency type labels (nsubj, dobj, amod, etc.)
     - Modal view for detailed inspection
     - AI-powered dependency structure explanations
   - **Use Cases**: Syntax analysis, grammar teaching, sentence structure understanding

### 4. **Context-Free Grammar (CFG) Parsing**
   - **Purpose**: Generates parse trees using context-free grammar rules via Gemini AI
   - **Features**:
     - AI-generated CFG parse trees
     - Hierarchical tree visualization
     - Modal expansion for detailed viewing
     - Grammar rule explanations
     - Support for complex sentence structures
   - **Use Cases**: Computational linguistics, parsing algorithm study, grammar analysis

### 5. **Semantic Role Labeling (SRL)**
   - **Purpose**: Identifies "who did what to whom" in sentences
   - **Features**:
     - Predicate-argument structure identification
     - Role labeling (Agent, Patient, Instrument, Location, Time, etc.)
     - Visual representation of semantic frames
     - AI explanations of semantic relationships
     - Support for multiple predicates per sentence
   - **Use Cases**: Question answering systems, information extraction, semantic analysis

### 6. **Translation**
   - **Purpose**: Translates text between multiple languages
   - **Features**:
     - Support for 100+ languages
     - Real-time translation powered by backend API
     - Language detection
     - Clean, side-by-side input/output display
     - Pre-configured samples for common translation scenarios
   - **Use Cases**: Language learning, content localization, multilingual communication

### 7. **Languages List**
   - **Purpose**: Displays all supported languages for translation
   - **Features**:
     - Comprehensive list of language codes and names
     - Searchable/filterable interface
     - Real-time fetching from backend
   - **Use Cases**: Reference, language code lookup

---

## 🛠️ Tech Stack

### Frontend Technologies
- **React 19.2.0**: Core UI framework
- **React Router DOM 7.9.4**: Client-side routing and navigation
- **Styled Components 6.1.19**: CSS-in-JS styling solution
- **Axios 1.12.2**: HTTP client for API communication

### Development & Testing
- **React Scripts 5.0.1**: Build tooling and dev server
- **Testing Library**: React testing utilities
- **Jest**: Testing framework

### Design & UX
- **Custom Theme System**: Light/dark mode support with centralized theme management
- **Responsive Design**: Mobile-first approach with breakpoints
- **Animations**: Keyframe animations using styled-components
- **Modern UI Elements**: Cards, dropdowns, modals, interactive visualizations

---

## 🏗️ Project Architecture

### Application Flow

```
┌─────────────────────────────────────────────────────────┐
│                      App.js                              │
│  (Router Setup + Theme Provider)                         │
└───────────────────┬─────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
   LandingPage            MainApp (Layout)
        │                       │
        │               ┌───────┴───────┐
        │               │               │
        │         Tab Navigation   StatusIndicator
        │               │
        │    ┌──────────┴────────────┐
        │    │                       │
        │  Active Component    ThemeToggle
        │    │
        │    ├── POSAnalyzer
        │    ├── NERAnalyzer
        │    ├── DependencyParser
        │    ├── CFGGeminiParser
        │    ├── SemanticRoleAnalyzer
        │    ├── Translator
        │    └── LanguagesList
        │
   (Landing/Marketing)
```

### Data Flow

1. **User Input**: User enters text or selects a sample
2. **API Request**: Component calls `apiService` method
3. **Backend Processing**: Python backend performs NLP analysis
4. **Response Handling**: Results are processed and stored in component state
5. **Visualization**: Data is rendered using styled components
6. **AI Help (Optional)**: User can request AI explanation of results

---

## 📦 Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Backend API** running on `http://localhost:9000` (see backend repository)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Utsav-J/NLP-VIZ-frontend.git
   cd NLP-VIZ-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint** (if different from default)
   Edit `src/services/api.js`:
   ```javascript
   const API_BASE_URL = 'http://localhost:9000'; // Change if needed
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🚀 Usage

### Quick Start

1. **Launch the app** and you'll see the landing page
2. **Click "Get Started"** to access the main application
3. **Select a tab** (POS Analysis, NER Analysis, etc.)
4. **Choose a sample text** or enter your own
5. **Click "Analyze"** to see results
6. **Request AI Help** for explanations (if available)

### Available Scripts

- **`npm start`**: Runs the app in development mode
- **`npm test`**: Launches the test runner
- **`npm run build`**: Builds the app for production
- **`npm run eject`**: Ejects from Create React App (irreversible)

---

## 📂 Core Files & Directory Structure

```
nlp-project-frontend/
│
├── public/                        # Static assets
│   ├── favicon.ico               # Browser tab icon
│   ├── index.html                # HTML template
│   ├── logo.png                  # App logo (32x32, 40x40)
│   ├── logo192.png               # PWA icon (192x192)
│   ├── logo512.png               # PWA icon (512x512)
│   ├── manifest.json             # PWA manifest
│   └── robots.txt                # Search engine directives
│
├── src/                          # Source code
│   ├── components/               # React components
│   │   ├── AIHelpPanel.js       # AI explanation display component
│   │   ├── CFGGeminiParser.js   # CFG parsing interface
│   │   ├── DependencyParser.js  # Dependency parsing visualization
│   │   ├── ImageModal.js        # Modal for image/SVG viewing
│   │   ├── LandingPage.js       # Marketing/landing page
│   │   ├── LanguagesList.js     # Supported languages display
│   │   ├── Layout.js            # Main app layout wrapper
│   │   ├── NERAnalyzer.js       # Named entity recognition UI
│   │   ├── POSAnalyzer.js       # Part-of-speech tagging UI
│   │   ├── SampleSelector.js    # Sample text selection component
│   │   ├── SemanticRoleAnalyzer.js  # Semantic role labeling UI
│   │   ├── StatusIndicator.js   # Backend health status indicator
│   │   ├── ThemeToggle.js       # Dark/light mode toggle
│   │   └── Translator.js        # Translation interface
│   │
│   ├── config/                   # Configuration files
│   │   └── samples.js           # Pre-configured sample texts
│   │
│   ├── context/                  # React Context providers
│   │   └── ThemeContext.js      # Theme state management
│   │
│   ├── services/                 # API and external services
│   │   └── api.js               # Axios API service layer
│   │
│   ├── App.css                   # Global app styles
│   ├── App.js                    # Main app component (routing)
│   ├── App.test.js              # App tests
│   ├── index.css                 # Global CSS reset/base
│   ├── index.js                  # React app entry point
│   ├── logo.svg                  # React logo (default)
│   ├── reportWebVitals.js       # Performance monitoring
│   ├── setupTests.js            # Test configuration
│   └── theme.js                 # Theme definitions (colors, shadows, etc.)
│
├── package.json                  # Dependencies and scripts
├── package-lock.json            # Locked dependency versions
└── README.md                    # This file
```

---

## 🧩 Components Breakdown

### Layout & Structure Components

#### **App.js**
- **Role**: Application root and router configuration
- **Responsibilities**:
  - Wraps entire app with `ThemeProvider`
  - Configures React Router with routes
  - Defines route structure (Landing, MainApp, 404 redirect)
  - Manages tab navigation state in `MainApp`
- **Key Features**:
  - Route definitions: `/` (landing), `/app` (main), `*` (redirect)
  - Tab configuration for all NLP features
  - Conditional component rendering based on active tab

#### **Layout.js**
- **Role**: Main application layout wrapper
- **Responsibilities**:
  - Provides consistent header, navigation, and content structure
  - Displays app branding and logo
  - Renders tab navigation
  - Integrates status indicator and theme toggle
- **Key Features**:
  - Sticky header with shadow
  - Responsive design (mobile-friendly)
  - Active tab highlighting
  - Content area with card styling

#### **LandingPage.js**
- **Role**: Marketing/landing page for the application
- **Responsibilities**:
  - Introduces the app with hero section
  - Showcases features with animated cards
  - Provides navigation to main app
  - Links to GitHub repositories
- **Key Features**:
  - Gradient animations and floating effects
  - Feature grid with 6 feature cards
  - CTA buttons (Get Started, Visit Repo dropdown)
  - Responsive design with breakpoints
  - Footer with copyright info

### Analysis Components

#### **POSAnalyzer.js**
- **Role**: Part-of-speech tagging interface
- **Responsibilities**:
  - Accepts text input from user or samples
  - Calls POS analysis API
  - Displays color-coded POS tags
  - Shows detailed word information on click
  - Provides statistics breakdown
- **Key Features**:
  - Real-time word highlighting with 16 POS colors
  - Interactive word selection with details panel
  - Statistics table showing POS distribution
  - AI help integration
  - Sample text selection
- **Data Flow**:
  1. User enters text
  2. `apiService.analyzePOS()` called
  3. Backend returns tokens with POS tags
  4. Tokens rendered with color coding
  5. Click event shows detailed info

#### **NERAnalyzer.js**
- **Role**: Named entity recognition interface
- **Responsibilities**:
  - Accepts text input
  - Calls NER analysis API
  - Highlights entities with colors
  - Shows entity statistics
  - Displays detailed entity information
- **Key Features**:
  - 7+ entity types supported (PERSON, ORG, GPE, MONEY, DATE, TIME, PERCENT, etc.)
  - Color-coded entity highlighting
  - Entity statistics with counts
  - Click-to-view entity details
  - AI-powered explanations
- **Data Flow**:
  1. User enters text
  2. `apiService.analyzeNER()` called
  3. Backend returns entities with types and positions
  4. Entities highlighted in text
  5. Statistics calculated and displayed

#### **DependencyParser.js**
- **Role**: Dependency parsing visualization
- **Responsibilities**:
  - Accepts text input
  - Calls dependency parsing API
  - Renders SVG tree diagram
  - Provides modal for zoomed view
  - Enables AI explanations
- **Key Features**:
  - Interactive SVG visualization
  - Dependency arrows with labels
  - Modal expansion for better viewing
  - AI help for dependency explanations
  - Sample text support
- **Data Flow**:
  1. User enters sentence
  2. `apiService.analyzeDependency()` called
  3. Backend returns SVG string
  4. SVG rendered in component
  5. Modal allows full-screen view

#### **CFGGeminiParser.js**
- **Role**: Context-free grammar parsing with AI
- **Responsibilities**:
  - Accepts text input
  - Calls Gemini-powered CFG API
  - Displays parse tree visualization
  - Shows grammar rules used
  - Provides AI explanations
- **Key Features**:
  - AI-generated CFG parse trees
  - Tree visualization rendering
  - Modal view for detailed inspection
  - AI help integration
  - CFG-specific sample texts
- **Data Flow**:
  1. User enters sentence
  2. `apiService.analyzeCFGGemini()` called
  3. Gemini AI generates CFG parse
  4. Tree rendered as SVG or structured data
  5. Modal shows expanded view

#### **SemanticRoleAnalyzer.js**
- **Role**: Semantic role labeling interface
- **Responsibilities**:
  - Accepts text input
  - Calls semantic role API
  - Displays predicate-argument structures
  - Shows role assignments
  - Provides AI explanations
- **Key Features**:
  - Identifies predicates in sentences
  - Labels semantic roles (Agent, Patient, Instrument, etc.)
  - Visual representation of frames
  - AI-powered explanations
  - SRL-specific samples
- **Data Flow**:
  1. User enters sentence
  2. `apiService.analyzeSemantic()` called
  3. Backend returns predicates and arguments
  4. Roles displayed with labels
  5. AI help explains semantic structure

#### **Translator.js**
- **Role**: Text translation interface
- **Responsibilities**:
  - Accepts text and target language
  - Calls translation API
  - Displays translated text
  - Supports 100+ languages
- **Key Features**:
  - Language dropdown selection
  - Side-by-side input/output
  - Sample text support
  - Clean, simple UI
- **Data Flow**:
  1. User enters text and selects language
  2. `apiService.translateText()` called
  3. Backend performs translation
  4. Translated text displayed
  5. Error handling for unsupported languages

#### **LanguagesList.js**
- **Role**: Displays supported translation languages
- **Responsibilities**:
  - Fetches language list from API
  - Displays in organized grid/table
  - Shows language codes and names
- **Key Features**:
  - Auto-fetches on mount
  - Loading state
  - Error handling
  - Formatted display

### Utility Components

#### **ThemeToggle.js**
- **Role**: Dark/light mode switcher
- **Responsibilities**:
  - Toggles between light and dark themes
  - Persists preference to localStorage
  - Provides visual indicator
- **Key Features**:
  - Animated toggle button
  - Icon changes (☀️/🌙)
  - Smooth theme transitions
  - Accessible button

#### **StatusIndicator.js**
- **Role**: Backend API health monitor
- **Responsibilities**:
  - Checks backend connectivity every 30 seconds
  - Displays connection status
  - Shows visual indicator (green/yellow/red)
- **Key Features**:
  - Real-time health checks via `/` endpoint
  - Three states: connected, connecting, disconnected
  - Color-coded status dot with pulse animation
  - Auto-retry on failure

#### **SampleSelector.js**
- **Role**: Sample text selection UI
- **Responsibilities**:
  - Displays pre-configured sample texts
  - Allows one-click text insertion
  - Shows previews of samples
- **Key Features**:
  - Grid layout with responsive design
  - Card-based UI with hover effects
  - Icons for each sample
  - Preview truncation (3 lines max)

#### **AIHelpPanel.js**
- **Role**: AI-generated explanation display
- **Responsibilities**:
  - Renders AI help responses
  - Formats text with markdown-like styling
  - Displays explanations in collapsible panel
- **Key Features**:
  - JSON parsing for structured responses
  - Bold text formatting (`**text**`)
  - Bullet list support
  - Paragraph formatting

#### **ImageModal.js**
- **Role**: Full-screen image/SVG viewer
- **Responsibilities**:
  - Displays SVG visualizations in modal
  - Provides close functionality
  - Supports keyboard shortcuts (Esc)
- **Key Features**:
  - Dark overlay with blur
  - Click-outside to close
  - Escape key support
  - Prevents body scroll when open
  - Responsive sizing

---

## 🔌 Services & API Integration

### API Service (`src/services/api.js`)

The `apiService` module provides a centralized interface for all backend communication.

#### API Base Configuration
```javascript
const API_BASE_URL = 'http://localhost:9000';
```

#### Request/Response Interceptors
- **Request Interceptor**: Logs all outgoing API calls
- **Response Interceptor**: Logs responses and handles errors globally

#### Available API Methods

| Method | Endpoint | Purpose | Parameters |
|--------|----------|---------|------------|
| `healthCheck()` | `GET /` | Check backend status | None |
| `analyzePOS(text)` | `POST /pos` | POS tagging | `text: string` |
| `analyzeNER(text)` | `POST /ner` | Named entity recognition | `text: string` |
| `analyzeDependency(text)` | `POST /dependency` | Dependency parsing | `text: string` |
| `analyzeCFGGemini(text)` | `POST /cfg-gemini` | CFG parsing | `text: string` |
| `analyzeSemantic(text)` | `POST /semantic` | Semantic role labeling | `text: string` |
| `translateText(text, lang)` | `POST /translate` | Translation | `text: string, target_language: string` |
| `getLanguages()` | `GET /languages` | Get supported languages | None |
| `getAIHelp(resultText)` | `POST /ai-help` | AI explanation | `text: string` |

#### Error Handling
- All methods validate input (non-empty text)
- Axios automatically rejects on HTTP errors
- Console logging for debugging
- Components handle errors with try-catch blocks

---

## 🎨 Theming System

### Theme Configuration (`src/theme.js`)

The application uses a comprehensive theming system with two modes: **light** and **dark**.

#### Light Theme
```javascript
export const lightTheme = {
  colors: {
    primary: '#6366f1',        // Indigo
    secondary: '#8b5cf6',      // Purple
    background: '#f8fafc',     // Light gray
    surface: '#ffffff',        // White
    surfaceSecondary: '#f1f5f9', // Very light gray
    text: '#1e293b',          // Dark slate
    textSecondary: '#64748b',  // Slate
    textMuted: '#94a3b8',      // Light slate
    border: '#e2e8f0',        // Border gray
    borderLight: '#f1f5f9',   // Lighter border
    success: '#10b981',       // Green
    warning: '#f59e0b',       // Amber
    error: '#ef4444',         // Red
    info: '#3b82f6',          // Blue
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
};
```

#### Dark Theme
```javascript
export const darkTheme = {
  colors: {
    primary: '#818cf8',       // Lighter indigo
    secondary: '#a78bfa',     // Lighter purple
    background: '#0f172a',    // Dark navy
    surface: '#1e293b',       // Dark slate
    surfaceSecondary: '#334155', // Medium slate
    text: '#f1f5f9',         // Light gray
    textSecondary: '#cbd5e1', // Medium light gray
    textMuted: '#64748b',     // Slate
    border: '#334155',       // Border slate
    borderLight: '#475569',   // Lighter border slate
    success: '#34d399',      // Light green
    warning: '#fbbf24',      // Light amber
    error: '#f87171',        // Light red
    info: '#60a5fa',         // Light blue
  },
  // Same shadows and borderRadius as light theme
};
```

#### POS Tag Colors
```javascript
export const posColors = {
  NOUN: '#fbbf24',      // Amber
  VERB: '#34d399',      // Green
  ADJ: '#f87171',       // Red
  ADV: '#60a5fa',       // Blue
  PRON: '#a78bfa',      // Purple
  DET: '#fb923c',       // Orange
  ADP: '#fde047',       // Yellow
  CONJ: '#86efac',      // Light green
  CCONJ: '#86efac',     // Light green
  NUM: '#fbbf24',       // Amber
  PUNCT: '#94a3b8',     // Gray
  PART: '#fbbf24',      // Amber
  AUX: '#34d399',       // Green
  SCONJ: '#86efac',     // Light green
  INTJ: '#a78bfa',      // Purple
  SYM: '#94a3b8',       // Gray
  X: '#64748b',         // Dark gray
  default: '#64748b',   // Dark gray
};
```

#### Entity Colors
```javascript
export const entityColors = {
  PERSON: '#ef4444',    // Red
  ORG: '#3b82f6',       // Blue
  GPE: '#10b981',       // Green
  MONEY: '#f59e0b',     // Amber
  DATE: '#8b5cf6',      // Purple
  TIME: '#06b6d4',      // Cyan
  PERCENT: '#84cc16',   // Lime
  default: '#64748b',   // Gray
};
```

### Theme Context (`src/context/ThemeContext.js`)

- **Provider**: Wraps entire app to provide theme state
- **Hook**: `useTheme()` for accessing theme and toggle function
- **Persistence**: Saves preference to `localStorage`
- **State**: Manages `isDark` boolean
- **Methods**: `toggleTheme()` to switch modes

---

## 📋 Sample Data Configuration

### Sample Collections (`src/config/samples.js`)

The app includes pre-configured sample texts for each analysis type:

#### POS_SAMPLES (5 samples)
- Simple Sentence
- Complex Sentence
- Business Text
- Academic Text
- News Article

#### NER_SAMPLES (5 samples)
- Simple Entities
- Complex Entities
- News Entities
- Financial Text
- Historical Text

#### TRANSLATION_SAMPLES (5 samples)
- Greeting
- Business Meeting
- Travel
- Food
- Technology

#### DEPENDENCY_SAMPLES (5 samples)
- Simple Sentence
- Complex Sentence
- Question
- Relative Clause
- Compound Sentence

#### CFG_GEMINI_SAMPLES (5 samples)
- Simple Declarative
- Question
- Relative Clause
- Compound Sentence
- Complex Sentence

#### SRL_SAMPLES (5 samples)
- Simple Predicate-Argument
- Transfer Event
- Instrument and Patient
- Motion with Goal
- Passive Voice

### Sample Structure
```javascript
{
  id: 'unique_id',
  title: 'Display Title',
  text: 'Sample text content...'
}
```

---

## ⚙️ How It Works

### Application Lifecycle

1. **Initialization**
   - `index.js` renders `<App />` into DOM
   - `App.js` wraps content with `ThemeProvider`
   - Theme preference loaded from localStorage
   - Router initializes with routes

2. **Landing Page**
   - User arrives at `/` route
   - `LandingPage` component renders
   - User clicks "Get Started" → navigates to `/app`

3. **Main Application**
   - `MainApp` component renders with `Layout`
   - Default tab set to 'pos' (POS Analysis)
   - `StatusIndicator` checks backend health
   - Theme toggle available in header

4. **Tab Navigation**
   - User clicks a tab (e.g., "NER Analysis")
   - `onTabChange` updates `activeTab` state
   - `renderTabContent()` conditionally renders component
   - Component mounts and displays its UI

5. **Analysis Workflow** (example: POS Analysis)
   - User selects a sample or enters text
   - Clicks "Analyze" button
   - Component calls `apiService.analyzePOS(text)`
   - Loading state displayed
   - Backend processes text with spaCy
   - Response returns array of tokens with POS tags
   - Component updates state with results
   - UI renders color-coded words
   - User can click words for details
   - User can request AI help

6. **AI Help** (optional)
   - User clicks "Get AI Help" button
   - Component calls `apiService.getAIHelp(resultsJSON)`
   - Backend sends results to Gemini AI
   - AI generates natural language explanation
   - `AIHelpPanel` displays formatted explanation

7. **Theme Switching**
   - User clicks theme toggle
   - `toggleTheme()` from context called
   - `isDark` state flipped
   - Theme object updated (light ↔ dark)
   - All styled-components re-render with new colors
   - Preference saved to localStorage

### Data Flow Diagram

```
User Input
    ↓
Component State Update
    ↓
API Service Call (Axios)
    ↓
HTTP Request to Backend (localhost:9000)
    ↓
Backend Processing (Python/spaCy/Gemini)
    ↓
JSON Response
    ↓
API Service Returns Data
    ↓
Component Updates State
    ↓
UI Re-renders with Results
    ↓
User Interactions (Click, Modal, AI Help)
```

### State Management

- **Local Component State**: Each component manages its own state using `useState`
- **Global Theme State**: Managed by `ThemeContext` using Context API
- **Router State**: Managed by React Router DOM
- **No Redux**: App uses React's built-in state management

### Styling Approach

- **Styled Components**: All styles defined as JavaScript
- **Theme Props**: Components receive `theme` prop from context
- **Responsive Design**: Media queries in styled-components
- **Animations**: Keyframe animations defined in styled-components
- **No CSS Modules**: All styles are component-scoped

---

## 🔗 Backend Integration

### Backend Repository
- **Frontend**: [https://github.com/Utsav-J/NLP-VIZ-frontend](https://github.com/Utsav-J/NLP-VIZ-frontend)
- **Backend**: [https://github.com/Utsav-J/NLP-VIZ](https://github.com/Utsav-J/NLP-VIZ)

### Backend Requirements

The frontend expects a Python backend running on `http://localhost:9000` with the following endpoints:

| Endpoint | Method | Request Body | Response |
|----------|--------|--------------|----------|
| `/` | GET | None | Health status message |
| `/pos` | POST | `{ text: string }` | `{ tokens: [{text, pos, ...}] }` |
| `/ner` | POST | `{ text: string }` | `{ entities: [{text, type, start, end}] }` |
| `/dependency` | POST | `{ text: string }` | `{ svg: string }` |
| `/cfg-gemini` | POST | `{ text: string }` | `{ tree_svg: string, rules: [...] }` |
| `/semantic` | POST | `{ text: string }` | `{ frames: [{predicate, arguments}] }` |
| `/translate` | POST | `{ text: string, target_language: string }` | `{ translation: string }` |
| `/languages` | GET | None | `{ languages: [{code, name}] }` |
| `/ai-help` | POST | `{ text: string }` | `{ explanation: string }` |

### Backend Technologies (Expected)
- **FastAPI**: Python web framework
- **spaCy**: NLP processing library
- **Google Gemini AI**: LLM for CFG parsing and semantic role labeling
- **Translation API**: For multi-language translation
- **CORS**: Enabled for localhost:3000

### Environment Variables (Backend)
The backend should have:
- `GEMINI_API_KEY`: Google Gemini API key
- Translation API credentials (if applicable)

---

## 🎓 Learning Resources

### Understanding NLP Concepts

- **POS Tagging**: [spaCy POS Documentation](https://spacy.io/api/annotation#pos-tagging)
- **Named Entity Recognition**: [spaCy NER Guide](https://spacy.io/usage/linguistic-features#named-entities)
- **Dependency Parsing**: [Universal Dependencies](https://universaldependencies.org/)
- **CFG Parsing**: [Context-Free Grammars](https://en.wikipedia.org/wiki/Context-free_grammar)
- **Semantic Role Labeling**: [SRL Explained](https://demo.allennlp.org/semantic-role-labeling)

### React & Frontend

- **React Documentation**: [https://react.dev](https://react.dev)
- **Styled Components**: [https://styled-components.com](https://styled-components.com)
- **React Router**: [https://reactrouter.com](https://reactrouter.com)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Use **functional components** with hooks
- Follow **styled-components** conventions
- Add **PropTypes** for component props (if applicable)
- Write **tests** for new features
- Maintain **responsive design** principles

---

## 📄 License

This project is licensed under the MIT License. See `LICENSE` file for details.

---

## 👤 Author

**Utsav J**
- GitHub: [@Utsav-J](https://github.com/Utsav-J)

---

## 🙏 Acknowledgments

- **spaCy**: For powerful NLP capabilities
- **Google Gemini AI**: For advanced language understanding
- **React Team**: For the amazing framework
- **Styled Components**: For elegant CSS-in-JS solution
- **NLP Research Community**: For foundational concepts and algorithms

---

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check backend logs for API errors
- Ensure backend is running on port 9000
- Verify CORS is enabled on backend

---

## 🗺️ Roadmap

### Planned Features
- [ ] Export analysis results as JSON/CSV
- [ ] Save/load analysis sessions
- [ ] User authentication and saved preferences
- [ ] More language support for UI localization
- [ ] Advanced filtering and search in results
- [ ] Comparison mode (analyze multiple texts side-by-side)
- [ ] Custom POS tag color configuration
- [ ] Offline mode with cached results
- [ ] Mobile app version (React Native)

### Future Enhancements
- [ ] Integration with more NLP libraries (Hugging Face Transformers)
- [ ] Support for document upload (PDF, DOCX)
- [ ] Batch processing of multiple texts
- [ ] API rate limiting and caching
- [ ] Enhanced visualizations (D3.js integration)
- [ ] Educational mode with tutorials

---

## 📊 Performance

### Optimization Techniques
- **Code Splitting**: React.lazy for route-based splitting (future)
- **Memoization**: React.memo for expensive components (future)
- **Debouncing**: API calls debounced on rapid input (future)
- **Image Optimization**: SVGs for scalable graphics
- **Caching**: LocalStorage for theme preferences

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

---

## 🔐 Security

### Best Practices
- **Input Validation**: All user input validated before API calls
- **CORS**: Backend configured for specific origins
- **No Sensitive Data**: No API keys or secrets in frontend code
- **XSS Prevention**: React's built-in XSS protection
- **HTTPS**: Use HTTPS in production

### Recommendations
- Deploy backend with authentication
- Use environment variables for API endpoints
- Implement rate limiting on backend
- Regular security audits

---

**Built with ❤️ using React • Powered by Advanced NLP & AI**

© 2025 LexiView. All rights reserved.
