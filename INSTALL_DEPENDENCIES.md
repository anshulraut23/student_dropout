# Installation Instructions

## Required Package Installation

To enable the bulk upload functionality, you need to install the `papaparse` library for CSV parsing.

### Installation Command:

```bash
cd proactive-education-assistant
npm install papaparse
```

### What is papaparse?

PapaParse is a powerful CSV parser for JavaScript. It's used in the Add Student page to:
- Parse uploaded CSV files
- Convert CSV data to JSON format
- Handle large files efficiently
- Provide error handling for malformed CSV data

### After Installation:

1. Restart your development server if it's running
2. The bulk upload feature will work automatically
3. No additional configuration needed

### Verification:

After installation, check that papaparse appears in your `package.json`:

```json
{
  "dependencies": {
    "papaparse": "^5.x.x",
    ...
  }
}
```

### Alternative: Install All Dependencies

If you want to ensure all dependencies are up to date:

```bash
cd proactive-education-assistant
npm install
```

This will install all packages listed in package.json, including papaparse if you've added it.

---

## Running the Application

### Backend:
```bash
cd backend
npm install  # First time only
npm start
```

### Frontend:
```bash
cd proactive-education-assistant
npm install  # First time only (includes papaparse)
npm run dev
```

---

## Troubleshooting

### If bulk upload doesn't work:

1. Check if papaparse is installed:
   ```bash
   npm list papaparse
   ```

2. If not installed, run:
   ```bash
   npm install papaparse
   ```

3. Clear cache and restart:
   ```bash
   npm cache clean --force
   npm install
   npm run dev
   ```

### If you see "Cannot find module 'papaparse'":

This means the package wasn't installed. Run:
```bash
cd proactive-education-assistant
npm install papaparse
```

Then restart your dev server.
