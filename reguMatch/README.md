# ReguMatch: AI-Powered Regulatory & Compliance Intelligence for African Businesses


## Project Status

**This is an MVP (Minimum Viable Product) currently in testing phase.**

ReguMatch is being developed as part of MCP Hackathon Africa 2025. The core functionality is operational, but the system is still undergoing testing and refinement. We welcome feedback and contributions to improve the platform.

---

## The Problem

Starting a business in Africa is challenging. Entrepreneurs face a maze of:
- **Scattered regulatory information** across multiple government websites
- **Complex compliance requirements** from banks and financial institutions
- **Language barriers** and inaccessible documentation
- **Outdated or conflicting information** that leads to costly mistakes
- **No centralized source** for industry-specific requirements

**Result:** Promising businesses fail before they start, not from lack of innovation, but from regulatory confusion.

---

## The Solution: ReguMatch

ReguMatch is an **MCP (Model Context Protocol) server** that aims to transform how African entrepreneurs access regulatory and compliance information. It's an AI-powered research assistant that:

**Discovers** official regulations from government and institutional sources  
**Extracts** requirements from PDFs and websites automatically  
**Structures** information into a searchable knowledge graph  
**Provides** clear, actionable guidance to entrepreneurs  

### A Novel Idea

The concept is straightforward - make regulatory information accessible through AI.

**What it aims to do:**

- Automatically discover and extract regulatory requirements in real-time
- Build a living knowledge graph that grows with each query
- Work with any AI assistant through the MCP protocol
- Serve African contexts with local infrastructure

**The Potential Impact:**
- **Reduce business setup time** from months to days
- **Save thousands** in legal consultation fees
- **Increase business success rates** through proper compliance
- **Scale across 54 African countries** with the same infrastructure
- **Enable AI sovereignty** by keeping African regulatory data in African hands

This simple approach addresses one of the **biggest barriers to entrepreneurship in Africa**, affecting millions of potential business owners.

### Why MCP?

By building on the Model Context Protocol, ReguMatch enables **any AI assistant** (Claude, ChatGPT, local models) to access comprehensive, up-to-date regulatory information. This creates:

- **AI Sovereignty**: African regulatory data controlled and served by African infrastructure
- **Cultural Context**: Understanding of local business practices and requirements
- **Data Sovereignty**: Secure, local processing of sensitive business information
- **Scalability**: Easy expansion across countries, provinces, and industries

---

## Key Features (MVP)

### 1. Intelligent Web Research
- Searches official government and institutional websites
- Prioritizes authoritative sources
- Extracts content from government portals

### 2. PDF Analysis with OCR
- Extracts text from digital and scanned documents
- Handles multi-language forms and applications
- Processes regulatory documents

### 3. Knowledge Graph Database
- Organizes regulations by: Country → Province → Industry → Sub-Industry
- Separates government regulations from institutional compliance
- Maintains naming consistency

### 4. Structured Information Extraction
- Required fields and documentation
- Licenses and certificates needed
- Fees and costs
- Contact information
- Business criteria

### 5. URL Whitelist Management
- Tracks verified regulatory sources
- Prevents misinformation
- Builds trust through source transparency

## Installation

### Prerequisites
- Python 3.9+
- MongoDB

### Setup

```bash
# Clone repository
git clone https://github.com/Jason-Joannou/SisoNova.git
cd reguMatch

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string and API key

# Run the server
python -m api.app
```

### Environment Variables

```env
MONGODB_URI=mongodb+srv://your-connection-string
API_KEY=your-secure-api-key
FORM_BASE_URL=http://localhost:8000
```

---

## Usage

### With Claude Desktop

Add to your Claude Desktop config:

```json
{
  "mcpServers": {
    "regumatch": {
      "command": "python",
      "args": ["path/to/regumatch/main.py"],
      "env": {
        "MONGODB_URI": "your-mongodb-uri",
        "API_KEY": "your-api-key"
      }
    }
  }
}
```

### Example Queries

```
"What are the requirements for registering a company in South Africa?"

"Find ABSA's debtor financing criteria"

"What licenses do I need for a restaurant in Cape Town?"

"Compare business loan requirements across South African banks"

"What are the tax compliance requirements for small businesses?"
```

---

## Available Tools

### Web Research Service
- `duck_duck_go_search`: Search for regulations and official sources
- `open_website`: Extract content and links from webpages

### PDF Analysis Service
- `download_and_analyze_pdf`: Extract text from regulatory PDFs

### Database Service
- `add_regulation_node`: Store government regulations
- `add_compliance_node`: Store institutional requirements
- `get_regulation_node`: Retrieve stored regulations
- `get_compliance_node`: Retrieve compliance requirements
- `get_available_keys_*`: Check existing data for consistency
- `add_url_to_whitelist`: Track verified sources
- `query_white_list_collection`: Query tracked URLs

---

## Potential Impact on Africa

### Economic Empowerment
- **Reduce barrier to entry** for new businesses
- **Increase success rates** through proper compliance
- **Save time and money** on legal consultations
- **Democratize access** to regulatory information

### AI Sovereignty
- **African-controlled** regulatory data infrastructure
- **Local processing** of sensitive business information
- **Cultural context** embedded in AI responses
- **Reduce dependency** on external AI providers

### Scalability
- **Multi-country support** (currently South Africa, expandable)
- **Multi-language** capability through OCR
- **Industry-agnostic** framework
- **Low-cost infrastructure** enables rapid expansion

### Knowledge Preservation
- **Centralized repository** of regulatory information
- **Historical tracking** of regulatory changes
- **Accessible format** for AI systems
- **Community-driven** knowledge building
