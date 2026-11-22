# Gift Genius — AI-Powered Gifting Assistant (0-to-1 MVP)

> **TL;DR:** An LLM-powered gifting recommender built to eliminate the **social anxiety of choosing the wrong gift**, rather than acting as another e-commerce search filter. Validated with **100+ real users** using **Streamlit**, **Groq**, and **Python**.

![Status](https://shields.io)
![Stack](https://shields.io)


## 1. Problem Framing & User Insights
Most gifting platforms treat gifting as a **product discovery** problem (filtering by price, gender, or category). User research revealed that the real bottleneck is **social risk**—the fear of giving something generic, impersonal, or culturally tone-deaf.

* **Primary Personas:**
  * *The Time-Crunched Professional:* Needs a thoughtful, personalized idea in under 3 minutes without endless scrolling.
  * *The Thoughtful Overthinker:* Wants reassurance on *why* a gift fits the recipient's personality before committing.
* **Competitive Gap (6 Competitors Analyzed):** Existing tools either dump generic affiliate links or require lengthy forms that cause high drop-off.


## 2. MVP Scope & Deliberate Trade-Offs
To validate core value quickly, the MVP was scoped to **3 core features** with strict acceptance criteria:

| Feature / Guardrail | Specification | Product Rationale |
| :--- | :--- | :--- |
| **Low-Friction Intake** | **≤ 5 questions** (< 3 min total flow) | Prevents cognitive overload and form abandonment. |
| **Low-Latency Inference** | **< 5 seconds** response via Groq | Maintains conversational momentum and high completion rate. |
| **Explainable Recommendations** | Citations referencing **≥ 2 recipient traits** | Builds user confidence ("Why this fits") rather than black-box suggestions. |

### ❌ What Was Cut (and Why)
* **Saved Recipient Profiles:** Excluded in v1 to protect user privacy and avoid onboarding friction.
* **Affiliate Shopping Links:** Excluded to preserve user trust and avoid perceived commercial bias during validation.
* **Automated Reminders:** Deferred to v2 after validating core recommendation quality.


## 3. System Architecture & Prompt Orchestration

[User Inputs: Relationship, Occasion, Budget, 2-3 Traits]
                         │
                         ▼
         [Input Validation & Context Builder]
                         │
                         ▼
    [Groq Inference Engine (Structured Prompting)]
       ├── Constraint: Must map to ≥2 user traits
       ├── Constraint: Return curated categories + rationale
       └── Latency Target: < 5.0 seconds
                         │
                         ▼
     [Streamlit UI: Ranked Ideas + "Why It Fits" Cards]

<img width="1157" height="537" alt="image" src="https://github.com/user-attachments/assets/d2882ec1-ff9f-4699-8c3b-a385a6b6213b" />



## 4. Validation & Metrics
* **North Star Metric:** **% of sessions where users report feeling confident** in their chosen gift idea.
* **Guardrail Metrics:** End-to-end completion time (< 3 min) and LLM response latency (< 5 sec).
* **Validation Results:** Tested across **100+ users**; iterative prompt tuning significantly improved perceived personalization and reduced generic gift outputs.

---

## 5. Run Locally

# 1. Clone the repository
git clone https://github.com
cd GradProj_Gift

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment variables
export GROQ_API_KEY="your_groq_api_key_here"

# 4. Launch the Streamlit app
streamlit run app.py


## 6. Future Roadmap (v2)
* **Iterative Refinement Loop:** Allow users to thumbs-down/tweak a suggestion ("More practical" or "More sentimental") in one click.
* **Local Context & Occasion Nuance:** Fine-tune recommendations for regional festivals and cultural gifting norms.
