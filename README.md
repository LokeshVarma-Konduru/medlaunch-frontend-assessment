# DNV Healthcare Multi-Step Form

A multi-step form application for DNV Healthcare quote requests, built with React.

## Live Demo

**Deployed on Vercel:** [https://medlaunch-frontend-assessment.vercel.app/](https://medlaunch-frontend-assessment.vercel.app/)

## Installation & Setup

```bash
npm install
npm run dev
```

The application will run on `http://localhost:5173`

### Testing CSV Upload

A sample CSV file (`practice_locations.csv`) is included in the project root for testing the file upload feature in Stage 4 (Site Information).

## Tech Stack

- React 18 with JavaScript
- React Context API for state management
- Pure CSS (no UI libraries)
- Vite as build tool
- PapaParse for CSV parsing
- ESLint for code quality

## Features

### Core Functionality
- 6-step form workflow (Quote Request → Facility Details → Leadership Contacts → Site Information → Services & Certifications → Review & Submit)
- Form data persists across all steps
- Navigation between steps (Next/Previous)
- Form submission logs data to console

### Form Validation
- Required field validation
- Email format validation
- Phone number validation (10 digits)
- ZIP code validation (5 digits)
- Inline error messages with auto-scroll to errors

### Additional Features
- Responsive design (mobile-friendly at 768px breakpoint)
- CSV file upload for multiple locations
- "Same as Primary Contact" auto-fill functionality
- Collapsible sections in review step
- File size display and parsing

## Project Structure

```
medlaunch-frontend-assessment/
├── public/
│   ├── calendar.svg
│   ├── Document.svg
│   ├── manage-accounts.png
│   ├── Refresh.svg
│   ├── Upload.svg
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── ActionBar.jsx/css
│   │   ├── FormStepOne.jsx/css
│   │   ├── FormStepTwo.jsx/css
│   │   ├── FormStepThree.jsx/css
│   │   ├── FormStepFour.jsx/css
│   │   ├── FormStepFive.jsx/css
│   │   ├── FormStepSix.jsx/css
│   │   ├── Header.jsx/css
│   │   ├── ProgressBar.jsx/css
│   │   └── SupportChat.jsx/css
│   ├── context/
│   │   └── FormContext.jsx
│   ├── App.jsx/css
│   ├── index.css
│   └── main.jsx
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Development Approach

**State Management:** Used React Context API to share form data across all steps. Each step maintains local state for UI interactions and syncs to the global context for persistence.

**Component Design:** Created modular components with single responsibility. Reusable components include Header, ProgressBar, ActionBar, and SupportChat.

**Validation:** Implemented step-specific validation that triggers only when the user attempts to proceed. Errors display inline below fields with visual indicators.

**Responsive Design:** Used CSS Flexbox and Grid with media queries at 768px for mobile layouts.

## Assumptions

- Email verification badge is for UI purposes only (no backend verification)
- CSV upload processes files client-side
- Stage 4 and Stage 5 fields are optional (no asterisks in Figma design)
- Phone numbers accept 10-digit US format
- Form submission logs to console instead of API call

## Known Limitations

- No backend integration or API calls
- Form data clears on page refresh (no persistence)
- CSV parsing expects specific column format
- Tested primarily on Chrome browser
- Basic accessibility implemented but not fully WCAG compliant

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.
