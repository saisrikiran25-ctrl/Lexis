# LEXIS — AI-Powered Policy Analyzer

Stop clicking **Accept** blindly. LEXIS is a plain-language explanation tool for Terms & Conditions, Privacy Policies, and similar legal agreements. 

This React-based application simplifies dense legalese in under 60 seconds.

## Features
- **Interactive Risk Analysis**: Classifies clauses into low, caution, or high risk levels.
- **Plain-English Summaries**: Translates confusing terms and details "What this means for you".
- **Dynamic Risk Score**: Visualizes the aggregate risk rating of the document.
- **Modes**:
  - 🧑 **Consumer Mode**: Highlights data rights, privacy tracking, and account termination clauses.
  - 🏢 **Founder / Business Mode**: Identifies liability caps, IP licensing, and AI model training provisions.
- **Privacy First**: Analysis is performed in real-time and text is never stored.

## Architecture
- Built with React.
- Styles implemented via global CSS and modern typography components.
- Integrates with OpenRouter API utilizing the `google/gemini-2.5-flash` model for fast, capable, and cost-effective legal analysis.

*Disclaimer: LEXIS provides educational summaries for informational purposes only. This is not a substitute for legal counsel.*
