# TOM MARSH

US Permanent Resident (Green Card holder) - no sponsorship required
{: .tagline }

Boston, MA | [LinkedIn](https://www.linkedin.com/in/tom-marsh-3aa764154/) | [GitHub](https://github.com/Graphight) | [Personal Website](https://graphight.github.io/) | tom.ian.marsh@gmail.com | (+1) 781-363-5484
{: .contact }

## SUMMARY

Senior Machine Learning Engineer with 8 years building production ML systems at TB/PB scale. At Sprout Social, co-designed the shared LLM evaluation platform adopted by 4 teams, contributed to agent runtime architecture at the invitation of two distinguished engineers, and support a 12-service GPU inference fleet. Track record delivering measurable business impact: foundational ML infrastructure generating €15M+ annually, platform migrations saving $200K+ yearly, and 0-1 startup ML system contributing to $10M+ valuation. Physics background (MSc) with end-to-end ownership from architecture to deployment.

## EXPERIENCE

### Sprout Social - Senior ML Ops Engineer

Boston, MA | Apr 2026 - Present
{: .meta }

- Invited by two distinguished engineers to their internal advanced engineering group, contributing architecture, design docs, review, and implementation for agentic context management under parallel turns (eviction policy and rejecting tool requests that would exceed context budgets) and a product's agent runtime migration from a stock langchain4j AI Service to a custom runtime supporting parallelism and low-level looping
- Co-designed the company's shared LLM evaluation platform as one of three engineers, now adopted by 4 other teams; co-authored its design docs and demos, and built the batch evaluation pipeline at its core: parallel executor with deterministic result ordering and an adaptive AIMD tokens-per-second throttle that backs off on provider rate limits
- Co-designed and built a self-improving evals harness (guided tooling that uses Claude to iterate on and critique existing evals); led its UX redesign with custom Claude mod panels, the first use of Claude mods at the company, ahead of a company-wide adoption push
- Root-caused unbounded GPU memory growth across a 12-service, ~42-replica model-serving fleet to an undocumented ONNX Runtime defect shipped across three minor versions, found on only a second support rotation, isolating growth to inference threads and ruling out request concurrency; findings drove the remediation and a seven-item SRE/ML action plan
- Wrote onboarding and support docs explaining the fleet's existing GPU time-slicing setup (12 services, ~42 replicas, ~$500K/year savings), and fixed bugs in it
- Maintain production BERT models: uncovered and fixed several model bugs, and led the CUDA 13 and Python 3.12 migration across 12 GPU inference services to close torch/onnxruntime CVEs, re-resolving dependency constraints across 27 files
- Audited evaluation datasets against live agent behaviour after tool-schema drift, surfacing three production agent defects (result ordering, chart-type nondeterminism, relative-date resolution), each reported to the owning squad with trace spans
- Redesigned production ML alerting: traced a flapping latency monitor to pod-roll noise, rebuilt it as p95 with hysteresis gated on downstream queue backlog, and replaced 12 monitors generating ~90 pages/day with two notify-only ones

### Ströer Labs NZ - Senior Machine Learning Engineer

Christchurch, New Zealand | Feb 2018 - Nov 2025
{: .meta }

- Reduced ad impression render time by 50% through ML inference optimisation, generating €15M+ additional annual revenue across 3B+ daily ad requests (1T+ annually)
- Led complete migration of ML data pipelines from Spark to DBT, eliminating Spark cluster costs ($10K+/month), reducing pipeline runtime 85% (20 min to 3 min), and simplifying maintenance for the successor team
- Architected migration from AWS SageMaker to custom Kubernetes infrastructure, enabling GPU training for LightGBM models (previously impossible), unifying ML platform with company infrastructure
- Designed and deployed real-time bid optimization system selecting demand-side partners or dropping traffic entirely, operating under p99 sub-20ms latency at 100K+ requests/second
- Cut cloud egress costs by 35% ($200K+ annually) for product vertical through ML optimisation; maintenance team expanded savings to $30K/month post-transition
- Led 0-1 development of multiple ML products (classification, time-series forecasting, optimisation) from concept to production on PB-scale datasets, establishing technical architecture before transitioning to dedicated teams
- Built and owned ML experimentation platform through multiple iterations (custom webapp, Grafana dashboards, MLFlow), enabling stratified A/B performance analysis across 3B+ daily ad impressions, with SHAP-based feature importance reporting for explainable, auditable ML decisions
- Designed the technical interview process for ML Engineering roles (programming assessments, architecture and systems design questions) used across MLE/SWE/DevOps hiring; conducted 80+ interviews over 6 years, contributing to 15 hires; hosted interns each summer and mentored juniors through intermediate

### Pyper Vision - Founding Machine Learning Engineer (Contracts, part-time)

Contract 1 | Christchurch, New Zealand | Jul 2024 - Feb 2025
{: .meta }

- Established complete ML infrastructure as sole technical hire, enabling aerospace startup pivot from hardware to ML-based fog forecasting (company expanded 5 to 20+ airports, valued $10M+ post-funding)
- Architected end-to-end system on GCP from scratch: automated data collection, preprocessing pipelines, model training infrastructure, and production inference API with <100ms p99 latency
- Evaluated and deployed model architectures (LightGBM GBDT, TensorFlow CNNs), achieving commercially competitive forecast accuracy, delivering a production system in 8 months
- System scaled to UK market expansion (advised on integration strategy post-contract)

Contract 2 | Christchurch, New Zealand | Oct 2025 - Nov 2025
{: .meta }

- Designed a physics-validated fog classification system using a pseudo-labelling pipeline derived from meteorological research papers
- Implemented clustering analysis by airport fog patterns and model error modes, creating a systematic debugging framework for the operations team to diagnose regional forecast failures

## EDUCATION

**MSc, Physics** - University of Canterbury | Jul 2022 - Jul 2024
{: .edu }

- Thesis: Extreme precipitation events under climate change using 4000+ years of simulation data at multiple resolutions
- Collaboration with NZ's National Institute of Water and Atmospheric Research (NIWA)
- Co-author: [Robust changes to the wettest and driest days of the year are hidden within annual rainfall projections](https://iopscience.iop.org/article/10.1088/1748-9326/ad585a), Environmental Research Letters (2024)
- Presented research at the Meteorological Society of New Zealand Annual Conference (2023)

**BSc, Physics & Computer Science** - University of Canterbury | Feb 2015 - Nov 2017
{: .edu }

- Capstone: Y2SiO5 thin film growth for quantum information devices using Pulsed Laser Deposition

## TECHNICAL SKILLS

**LLM & Agents:** LLM Evaluation (LLM-as-judge, offline/online evals), Agent Runtimes (context management, parallel tool execution), Agent Systems (MCP), OpenTelemetry GenAI conventions, langchain4j, Claude
{: .skills }

**ML:** A/B Testing, Experimentation Platforms, SHAP/Explainability, Statistics, Data Mining, Deep Learning (PyTorch, TensorFlow), Gradient Boosting (LightGBM, XGBoost), Classical ML stack (Scikit-learn, Pandas, NumPy), MLFlow
{: .skills }

**Infrastructure:** GPU inference serving (CUDA, ONNX Runtime, GPU time-slicing), AWS (SageMaker, EMR, S3, Glue, Athena, Bedrock), GCP (Cloud Functions, GCS), Docker, Kubernetes, Monitoring & Alerting (Datadog), Source Control (Git), Linux, MacOS
{: .skills }

**Data Engineering:** Apache Airflow, Kafka, SQL (Postgres, Presto, Trino), time-series databases, Spark, DBT
{: .skills }

**Languages:** Python, SQL, Java, Scala, Kotlin, Go
{: .skills }
