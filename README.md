# 🔍 DNS Fast Flux Detector

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Flask](https://img.shields.io/badge/Flask-REST_API-black)
![ML](https://img.shields.io/badge/ML-scikit--learn-orange)
![License](https://img.shields.io/badge/License-MIT-green)

A network security tool for detecting **fast-flux DNS** techniques used by botnets, phishing campaigns, and malware infrastructure. Combines a rule-based scoring engine with machine learning classification to analyze domains and flag suspicious behavior in real time.

---

## What is Fast Flux?

Fast-flux is a technique where threat actors rapidly rotate the IP addresses mapped to a domain (often dozens of IPs across multiple countries/ASNs) with very low TTLs. This makes it hard to block or take down malicious infrastructure. This tool detects those patterns by querying live DNS data and scoring the result.

---

## Features

- **Rule-Based Scoring Engine (Rx)** — evaluates 6 DNS features against configurable thresholds and weights, producing a 0–100 risk score
- **ML Classification (CoreML)** — trained Gradient Boosting / ensemble model for secondary classification; includes ROC curves, confusion matrix, F1 score analysis
- **Flask REST API** — wraps the detection engine with HTTP endpoints for frontend integration
- **React Dashboard** — live domain analysis UI with score panels, visualizations, rule breakdowns, and history table
- **TUI Mode** — terminal interface for quick CLI-based analysis
- **CSV Export** — download analysis history for offline review

---

## Project Structure

```
DNS-Fast-Flux-Detector/
├── src/
│   ├── runner.py                  # Entry point (TUI / CLI mode)
│   ├── tui.py                     # Terminal UI
│   ├── tinylogging.py             # Colored console logger
│   │
│   ├── Rx/                        # Rule-based scoring engine
│   │   ├── core.py                # Orchestrates rules + scoring
│   │   └── rule.py                # Rule evaluation logic
│   │
│   ├── dnsquery/                  # DNS feature extraction
│   │   ├── nsquery.py             # DNS A/AAAA record queries
│   │   ├── geolocation.py         # GeoIP / ASN lookups (MaxMind)
│   │   ├── domain_age.py          # WHOIS-based domain age
│   │   └── domain_features.py     # Feature aggregator
│   │
│   ├── CoreML/                    # Machine learning pipeline
│   │   ├── DNSFastFlux.ipynb      # Training notebook
│   │   ├── train.py               # Model training script
│   │   ├── predict.py             # Inference script
│   │   └── Figure[1-3]_*.png      # Evaluation plots
│   │
│   ├── backend/                   # Flask API server
│   │   ├── app.py                 # API routes
│   │   ├── requirements.txt       # Python dependencies
│   │   └── README.md              # API reference docs
│   │
│   ├── frontend/                  # React dashboard
│   │   ├── src/
│   │   │   ├── App.jsx
│   │   │   └── components/        # Header, ScorePanel, RuleCards, etc.
│   │   └── package.json
│   │
│   └── config/
│       ├── rules.json             # Rule thresholds + weights
│       ├── classification.json    # Score → label thresholds
│       └── dns_config.json        # DNS server + timeout config
```

---

## Detection Rules

The Rx engine scores each domain on 6 features:

| Rule | Description | Invert? |
|------|-------------|---------|
| `IP_Count` | Number of A/AAAA records (more = suspicious) | No |
| `Median_TTL` | Median TTL across records (lower = suspicious) | Yes |
| `ASN_Diversity` | Number of distinct ASNs (more = suspicious) | No |
| `Geo_Diversity` | Number of distinct countries (more = suspicious) | No |
| `Domain_Age` | Age of domain in days (newer = suspicious) | Yes |
| `Mannheim_Rule` | IP churn rate — number of IPs seen over time | No |

Scores map to:
- **≥ 70** → Fast-Flux (High Confidence)
- **30–69** → Suspicious (Medium Confidence)
- **< 30** → Benign (Low Confidence)

---

## Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- MaxMind GeoLite2 databases (`GeoLite2-ASN.mmdb`, `GeoLite2-City.mmdb`) — place in `src/config/`

### Backend

```bash
cd src/backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Server starts at `http://localhost:5000`

### Frontend

```bash
cd src/frontend
npm install
npm start
```

Dashboard opens at `http://localhost:3000`

### TUI / CLI Mode

```bash
cd src
python runner.py
```

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Analyze a domain |
| GET | `/api/history` | Last 50 analyses |
| GET | `/api/stats` | Aggregate statistics |
| GET | `/api/export/csv` | Download history as CSV |
| GET | `/api/health` | Server health check |

See [`src/backend/README.md`](src/backend/README.md) for full request/response schema.

---

## ML Component

The `CoreML/` directory contains the machine learning pipeline trained on a labeled DNS dataset. Models evaluated include Random Forest, Gradient Boosting, and XGBoost. Evaluation artifacts (ROC curves, confusion matrix, F1 scores) are included as figures.

To retrain:
```bash
cd src/CoreML
python train.py
```

To run inference standalone:
```bash
python predict.py
```

> **Note:** Trained model `.pkl` files are excluded from the repo (see `.gitignore`). Run `train.py` to regenerate them.

---

## Configuration

All config lives in `src/config/`:

- **`rules.json`** — adjust thresholds and weights per rule without touching code
- **`classification.json`** — change score cutoffs for Fast-Flux / Suspicious / Benign labels
- **`dns_config.json`** — set DNS resolver and query timeout

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Backend | Python, Flask, dnspython, geoip2, pandas |
| Frontend | React 18, Recharts, Tailwind CSS, Axios |
| ML | scikit-learn, XGBoost, pandas, Jupyter |
| DNS | dnspython, MaxMind GeoLite2 |

---
