---
title: "AI is not free — the architecture regulated industries cannot skip"
description: "Six pillars that decide whether regulated AI deploys or sits on the shelf. Indemnity covers the model's provenance. Insurance covers the model's performance. Regulated AI needs both."
pubDate: 2026-05-06T00:00:00-04:00
tags: ["ai", "vibecoding", "llm", "open-source", "philosophy", "cybersecurity"]
draft: true
---

## A brief disclosure before the post begins

I work at Red Hat as a Telco Delivery Executive based in the Greater Toronto Area. This post is written for a specific reader: the Telco leader whose business is under pressure to deploy AI for the productivity and cost-reduction gains it promises, and who has not yet decided on the architecture that will carry that deployment. Public companies measure bottom-line impact in quarters. Regulated deployments measure consequences in years. The architecture below is one practitioner's synthesis of the pillars that make the gap survivable.

Red Hat appears later in this post as one option for one of the six pillars I am going to walk through. Every other vendor I name, commercial and open-source alike, is an example I encountered during research for this series. Some I have worked with directly. Others I have not. None of what follows is an endorsement, a recommendation, or a commercial comparison. The architecture is the point. The vendor names are there so the architecture does not float.

Now the post.

## A Friday evening that costs thirty-three million dollars

A customer service call lands at a national Telco on a Friday evening. A voice on the other end says the phone was lost, and asks for the number to be transferred to a new SIM. Routine. The queue is full. The agent is tired.

The AI-assisted fraud detection layer checks the call against the account patterns. Something fires: a flag, a soft hold, a second-factor prompt. But the model's confidence score falls below the threshold the Telco set last quarter. The call proceeds. The number moves.

Sixteen minutes later, the fraud team's own monitoring catches the swap. The number is already on a SIM in another city. Two-factor authentication codes have been flowing to the attacker's phone since the moment the transfer completed. A cryptocurrency wallet is empty. A bank account is being drained. A Coinbase authenticator is compromised beyond recovery.

The real case was a human failure. The T-Mobile arbitration that landed in March 2025 paid thirty-three million dollars to a single customer who lost thirty-seven million dollars in cryptocurrency. A T-Mobile employee was tricked into transferring the number. An AI model was not in the seat.

The next wave of these cases will not be about employees. It will be about models. Models that flagged correctly and were overridden. Models that did not flag and should have. Models that hallucinated a second-factor bypass because the training data had a pattern the adversary learned to mimic. When opposing counsel asks why the model let the call through, the Telco's lawyer will either have an answer or will not.

This is where AI in regulated industries lives now. Every decision is an artifact that will be subpoenaed, audited, or insured against. The architecture either holds, or someone else writes the check.

## Why regulated AI is a different problem class

The scenario above is not exotic. It is the shape of AI in every regulated industry where a wrong answer carries real consequence.

**The cost of a wrong answer is asymmetric.** In a consumer chatbot, a hallucination is an embarrassment. In fraud detection, it is a thirty-three-million-dollar arbitration. In emergency call routing, it is a coroner's inquest. In credit decisioning, it is a regulatory investigation and a discrimination claim. The upside of AI in these domains is real but bounded. The downside is not bounded. It is open-ended and occasionally catastrophic.

**The decision is not yours alone.** Regulators, courts, and customers will re-examine every AI-assisted decision after the fact. The question is not "did the model make the right call." The question is "can you prove, months or years later, why it made the call it made." A model that cannot produce a defensible decision trace is, for regulated purposes, a model that cannot be deployed.

The question is what carries the risk the model cannot carry alone. That is an architecture question. The rest of this post walks through six pillars that answer it, one distinction between indemnification and insurance that procurement teams often miss, and a framework for choosing between commercial and open-source paths.

## The architecture, in six pillars

The architecture has six load-bearing pillars. Each pillar is one answer to one question a regulator, an auditor, or opposing counsel will eventually ask. Each pillar has a technical name and a one-line function. Miss a pillar and the architecture either fails compliance or transfers catastrophic risk onto the balance sheet.

- **The Vault** — sovereign infrastructure. Where the model runs.
- **The Inspector** — model governance. Whether the model is still behaving.
- **The Underwriter** — third-party performance insurance. Who pays when the model is wrong.
- **The Redactor** — privacy layer. What the model sees.
- **The Courier** — federated learning orchestration. Where the data moves, and does not.
- **The Ledger** — immutable decision trace. What the decision was, reconstructed years later.

When I went looking for a complete reference architecture for regulated AI, I did not find one. That may be the limit of what I have personally encountered in the vendor landscape. It may also be that the landscape itself is fragmented — no single vendor owns the complete AI stack, and no single source assembles the full picture. The AI stack has become deep and layered: model providers, inference platforms, governance, privacy, federation, decision trace, insurance. A Telco executive under pressure to deploy has to make a coherent decision across all of that on a timeline measured in quarters. Either way, I did not find what I needed. So I worked through the architecture one scenario at a time, asking what could fail and what the business could not afford to let fail.

The six pillars split into two groups: three obvious from the start, three that surface when you push further.

## The three originals

### The Vault — sovereign infrastructure

The first question a regulator, an auditor, or opposing counsel will ask is where the model runs.

Not "where is the model hosted" in a vague cloud-geography sense. Where, specifically, does the inference happen. Where, specifically, does the training data sit at rest. Where does the model weights file live when it is not in active use. Whose subpoena reaches those locations, and whose does not.

The Vault is the answer. Air-gapped or jurisdiction-bound compute. Data that does not leave the regulatory boundary. For a Canadian Telco with federal and provincial customers, that means compute in Canadian data centers, under Canadian legal jurisdiction, operated by personnel whose background checks meet Canadian clearance standards where applicable. For a US carrier, the requirements look different in detail and similar in principle.

On the commercial side, Red Hat OpenShift is one option. On the open-source side, OKD paired with Rook and Ceph for storage is the closest equivalent. The difference is not the technology; the difference is who stands behind the deployment when a regulator asks for the runbook. Commercial gives you a vendor with indemnification and a support contract. Open-source gives you a platform engineering team that owns every layer from the kernel up.

The Telco use case that makes the Vault non-negotiable is Next Generation 911. Call audio, transcripts, caller location, dispatch decisions: all of it is evidentiary and all of it is life-safety data. Public cloud inference is not an option, not because the cloud is insecure but because the chain of custody on that data has to be provable down to the machine it ran on. The Vault is where that chain of custody begins.

Without the Vault, the architecture has no ground to stand on.

### The Inspector — model governance

A model drifts. Not eventually. Continuously.

The training data was a snapshot. The production traffic is a stream. The gap between them widens every day. Attacker tactics evolve. Customer demographics shift. The feature distribution the model was validated against is not the feature distribution the model sees in production by week twelve. If nobody is watching the drift, the model is quietly becoming a different model than the one governance approved.

The Inspector watches. Drift detection across features and outputs. Bias monitoring across protected classes. Fairness audits against the regulatory standard that applies to the jurisdiction. Model cards or AI Factsheets that document the model's intended use, its known limitations, its training data provenance, and its performance on the last validation run. The Inspector tells you the model in production is still the model you approved, and tells you first, before a customer complaint, before a regulator's letter, before opposing counsel's discovery request.

IBM watsonx.governance is the commercial reference. The open-source realization is MLflow Model Registry for lifecycle tracking, plus AIF360 for fairness metrics, plus a drift monitor such as Evidently or Radicalbit. Three tools instead of one, which matters, because each integration seam is a place the governance story can break under audit.

The Telco use case is fraud detection. The model that caught last quarter's SIM swap patterns will not catch next quarter's, because the adversary reads the same security blogs the defenders do. Drift in the fraud model is not a bug; it is a given. The Inspector catches the drift before it becomes a settlement.

The Inspector is how you answer "is it still behaving" without waiting for someone outside the building to answer it for you.

### The Underwriter — third-party performance insurance

The third pillar is the one most technical teams forget until the lawyers find it for them.

Several major foundation model vendors now offer some form of intellectual property indemnification as part of their enterprise contracts. The specific terms, scope, and limits vary by vendor and by product tier. The indemnity language looks reassuring on a procurement slide. It covers the lawsuit that says your training data was stolen. It covers the lawsuit that says a copyrighted work was reproduced in the model's output.

It does not cover the lawsuit that says the model was wrong.

None of the following is in the indemnity: performance failures, hallucinations, bodily injury from a misrouted emergency call, financial loss from fraud the model failed to catch, or consequential damages downstream of model output.

The Underwriter is the pillar that fills this gap. It is the one pillar with no open-source equivalent, because insurance is not an open-source category. Armilla AI is the category-defining example: Toronto-based, the first Lloyd's of London coverholder dedicated exclusively to AI liability (since 2024), underwritten by Chaucer and Axis Capital, Lloyd's-backed coverage raised to twenty-five million dollars aggregate in January 2026. The policy affirmatively covers AI model error, AI output liability, AI agent failures, non-breach privacy leakage, AI-driven property damage, and AI regulatory violations. Those are the exact categories the foundation model vendor indemnity explicitly excludes.

The Telco use case is the SIM swap scenario this post opened with. When the fraud model misses the swap, the Ledger proves what the model did, and the Underwriter pays for what it cost. Neither pillar alone resolves the liability. Both together do.

## The three gap-fillers

### The Redactor — privacy layer

The first scenario was what happens when the training data contains personally identifiable information.

Not "is your training data licensed." That is the provenance question the Vault and the indemnity story already answer. The sharper question is "did your training data contain personally identifiable information about real customers, and if it did, did you de-identify before the model saw it." Regulators ask this question with teeth, and courts have started asking it as a discovery matter when an AI decision is challenged downstream. The answer "we deleted the raw data after training" is not an answer. The training happened. The PII was present when it happened. The model's weights are downstream artifacts of data it was not supposed to memorize.

The Redactor is the pillar that moves de-identification upstream of the training pipeline. PII detection at the ingestion boundary. Redaction, pseudonymization, or synthetic substitution before any data reaches the model. The output of the Redactor is anonymous intelligence. Data that preserves the statistical signal the model needs while stripping the identity the law protects.

On the commercial side, Private AI (Toronto-based) is a strong reference. Fifty-plus entity types across text, audio, image, and video. On-premises deployment. Support for non-English and region-specific PII that general-purpose services often miss, including Canadian Social Insurance Numbers, provincial health card numbers, and the variants of address formatting that foreign models routinely mis-tag.

On the open-source side, Microsoft Presidio is the obvious starting point. Apache 2.0, actively maintained, integrates cleanly with spaCy for named entity recognition. Microsoft itself recommends running Presidio in parallel with a commercial service such as Azure AI Language when accuracy matters.

The Telco use case is customer call transcripts used to train a churn model — the system that predicts which customers are likely to leave. The raw transcripts contain names, addresses, account numbers, and payment disputes. The Redactor strips those at the boundary before the transcript reaches the training pipeline. The churn model learns the patterns. The customer's identity does not.

The Redactor is the reason the rest of the pipeline is allowed to see anything at all.

### The Courier — federated learning orchestration

The second scenario was what happens when the data the Redactor did not redact was also not allowed to move across jurisdictions.

A Canadian Telco with customers in every province faces a data residency problem that de-identification does not solve. Quebec Law 25 restricts cross-border transfer of personal information. British Columbia and Alberta have their own provincial privacy regimes. Federal Crown assets have their own sovereignty requirements. Even inside Canada, a model that trains on the pooled data of all provincial customer bases is a model that just moved provincial data across jurisdictions the Telco is specifically prohibited from pooling.

The Courier is the pillar that trains the model without pooling the data. Federated learning orchestration means the model's training logic runs inside each regional silo, on data that never leaves. The gradients, which are the directional updates the model computes from the local data, travel to a central aggregator. The aggregator combines the gradients. A new model version is distributed back to each silo for the next training round. Raw data never moves. The learning does.

On the commercial side, Integrate.ai is a Toronto-based option. Devron and Flower Labs Enterprise are two others. On the open-source side, Flower is the most widely adopted framework, NVIDIA FLARE is the enterprise-scale reference, and PySyft continues to develop as the research-forward option. Each has different trade-offs on orchestration overhead, communication efficiency, and integration with existing ML infrastructure.

The Telco use case is the churn model again, this time across provincial customer bases. The model learns churn signals in Ontario, Quebec, Alberta, and British Columbia simultaneously, without a single provincial customer record crossing a provincial boundary. The resulting model knows what Canadian churn looks like at a national level. The provincial data commissioners have nothing to investigate, because the data never moved.

The Courier moves the learning. The data stays where the law says it has to stay.

### The Ledger — immutable decision trace

The third scenario was what happens when a decision has to be reconstructed years after it was made — by a regulator, an auditor, or opposing counsel.

Every AI-assisted decision produces a record. Inputs. Model version. Output. Timestamp. Confidence score. Reviewer, if a human was in the loop. Override, if a human overruled the model. The Ledger is the pillar that captures that record at the moment the decision happens, writes it to tamper-proof storage, and makes it queryable by regulators, auditors, and opposing counsel.

Consider an AI layer transcribing a 911 caller's description and routing the dispatch, whether to paramedics, fire, or police, based on the transcript. Life-safety stakes are measured in minutes. When the inquest asks why the call was routed where it was routed, the Ledger is the only defensible answer. A decision that cannot be reconstructed is, in an inquest, a decision that should not have been made.

On the commercial side, the market has several serious offerings: Credo AI, Arthur AI, Axonis.ai, Quantexa, Palantir, Integrate.ai. The point of naming them together is that this is a category, not a single pick. Different offerings emphasize different axes: some are stronger on the governance workflow, some on the immutability guarantees, some on the integration with existing SIEM and logging infrastructure.

On the open-source side, the realization is typically a composition: OpenSearch for the searchable store, LlamaIndex or a similar layer for decision retrieval, and custom middleware to wire inputs and outputs into a consistent schema. This is a pillar where the open-source path requires real engineering. The immutability guarantee, the tamper-proof part, is where the engineering gets most exacting. It is not enough for the logs to exist. They have to be provably unmodified, with a cryptographic chain of custody a regulator will accept.

The Telco use case is the SIM swap decision trail. When the arbitration demand arrives years later, the Ledger is what the Telco's lawyer argues from. The model's inputs at the moment of the decision. The confidence score. The threshold that was in effect. The agent's override or non-override. The regulatory environment the Telco was operating under when the threshold was set. Without the Ledger, the Telco has a story. With the Ledger, the Telco has evidence.

Which brings us to a question almost nobody asks out loud.

## The indemnification gap

The question runs something like this.

*"We already have indemnity from IBM or Red Hat on our AI stack. Why do we also need insurance from someone like Armilla?"*

Most procurement teams ask it eventually. Most of them ask it too late.

The short answer: indemnity covers the lawsuit that says your training data was stolen. Insurance covers the lawsuit that says your model was wrong. Those are different lawsuits. One is about provenance. The other is about performance. Indemnity is about where the model came from. Insurance is about what the model did.

The specifics matter, because the distinction is often obscured in procurement conversations where people use the word "AI risk" to mean different things.

Foundation model vendor indemnity covers copyright and intellectual property infringement claims against the model. If a third party sues claiming the training data was stolen, or that a copyrighted work was reproduced verbatim in the model's output, the vendor pays the legal defense and, subject to the terms of the specific indemnity, the settlement.

That indemnity does not cover hallucinations. It does not cover performance failures. It does not cover bodily injury from a misrouted emergency call. It does not cover financial loss from fraud the model failed to catch. It does not cover consequential damages downstream of the model's output. Caps on the indemnity vary. Some vendors cap at contract value. Some cap at a multiple of contract value. Some do not cap at all. The cap is a second-order question. The scope is the first-order question, and the scope stops at IP.

The T-Mobile arbitration in March 2025 paid thirty-three million dollars to a single customer. The underlying attack was a human failure: an employee tricked into transferring a number. The next generation of fraud-related cases will not be about employees. It will be about models that flagged correctly and were overridden, models that did not flag and should have, models that failed in ways the vendor indemnity does not reach. When those cases arrive, vendor indemnity will stop at the door. Third-party AI liability insurance, the category Armilla built first, underwritten by Lloyd's and Axis Capital, is the category built for those cases.

Indemnity protects the model's provenance. Insurance protects the model's performance. Regulated AI needs both.

## Commercial versus open-source

The commercial-versus-open-source question does not have one answer. It has three.

**Team maturity.** Open-source pillars demand ML platform engineers, MLOps capability, and security review capacity that can stand up to an external audit. Commercial pillars demand procurement capacity and an annual invoice. Neither path is free. The cost just lives in different columns on the balance sheet, and the column matters. Capital expenditure, operating expenditure, and engineering payroll are three different conversations with three different executives.

**Timeline.** If the deployment is eighteen months away, open-source is a real option. The engineering time to build and validate is available, and the team can develop real capability in each pillar before it is load-bearing. If the deployment is closer than that, commercial shortens the path to an auditable baseline, because the commercial vendor has already done the validation work and has a support contract that covers audit response when the architecture does have to perform in front of a regulator, an auditor, or opposing counsel. Speed to defensibility is a variable most technical teams underweight.

**Indemnification posture.** Commercial vendors give you something to point at when a regulator or counterparty asks who stands behind this. Open-source requires the organization itself to stand behind it. Some organizations can. Many cannot. The question is not whether the open-source option is technically adequate; the question is whether the organization has the internal legal and engineering posture to defend it when challenged.

Most real deployments end up hybrid. Commercial where the clock is tightest, typically the Vault and the Underwriter. Open-source where the team has genuine capability, typically the Inspector and the Ledger. Mixed in the middle for the Redactor and the Courier. The architecture does not care how each pillar is realized. It cares that each pillar is realized.

Pick the path that lets the pillar stand. The pillar is the point.

## The series closes here

Three posts in, the frame holds.

Part 1 was about the costs you can invoice, from tokens and APIs to infrastructure and the compliance spend that shows up in the budget line. Part 2 was about the costs of human judgment: the technical debt, the false confidence, the dependency you do not see until you try to remove it. Part 3 is about the costs regulated industries cannot absorb without the architecture to carry them: the fines, the settlements, the inquests, the headlines.

The bill arrives at every layer. Tokens at the developer layer. Judgment at the team layer. Architecture at the regulatory layer. The architecture is the only thing that travels with a decision when the decision ends up in an arbitration transcript, or a regulator's file, or a coroner's report.

The work is specific, not theoretical. The vendors are real, not abstract. The six pillars are one practitioner's synthesis, which means they are incomplete by definition. What they are not is optional.

AI is not free. In regulated industries, the architecture is what buys you the right to deploy it.

---

## Sources and further reading

This section catalogs every source, product, regulation, and factual claim referenced in this post. It is organized to match the structure of the architecture.

### Regulations and regulators

- **Quebec Law 25** (Act respecting the protection of personal information in the private sector): [Commission d'accès à l'information du Québec](https://www.cai.gouv.qc.ca/) — the provincial regulator responsible for enforcement. Sections 12.1 and 3.3 bear directly on AI-assisted decisions.
- **Canadian Artificial Intelligence and Data Act (AIDA), Bill C-27**: [Parliament of Canada LEGISinfo page](https://www.parl.ca/legisinfo/en/bill/44-1/c-27). Bill died when Parliament was prorogued on January 5, 2025, and has not been re-tabled.
- **Colorado AI Act (SB 24-205)**: [Colorado General Assembly bill page](https://leg.colorado.gov/bills/sb24-205). Effective June 30, 2026.
- **NIST AI Risk Management Framework**: [NIST AI RMF homepage](https://www.nist.gov/itl/ai-risk-management-framework). De facto federal reference in the United States.
- **Canadian Radio-television and Telecommunications Commission (CRTC)**: [CRTC homepage](https://crtc.gc.ca/). Regulates telecommunications in Canada.
- **HIPAA** (Health Insurance Portability and Accountability Act): [HHS HIPAA overview](https://www.hhs.gov/hipaa/).
- **GLBA** (Gramm-Leach-Bliley Act): [FTC GLBA overview](https://www.ftc.gov/business-guidance/privacy-security/gramm-leach-bliley-act).
- **EU AI Act**: [European Commission AI Act overview](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai).

### Specific factual claims and cases

- **T-Mobile $33M SIM swap arbitration (March 2025)**: [Greenberg Glusker press release](https://www.greenbergglusker.com/publications/greenberg-glusker-secures-landmark-33m-arbitration-award-against-t-mobile-for-sim-swap-security-failures/). The largest known SIM swap-related award on record. Attack occurred February 2020.
- **Armilla AI Lloyd's coverholder status**: [Lloyd's Lab Accelerator alumni page for Armilla](https://www.lloyds.com/insights/lloyds-lab/programmes-and-initiatives/lloyds-lab-accelerator/alumni/armilla-ai). First Lloyd's of London coverholder dedicated exclusively to AI liability.
- **Armilla AI insurance product details**: [Armilla AI Insurance page](https://www.armilla.ai/ai-insurance). Details on affirmative coverage, Chaucer and Axis Capital backing.
- **Red Hat Chatterbox Labs acquisition (December 16, 2025)**: [Red Hat press release](https://www.redhat.com/en/about/press-releases/red-hat-accelerates-ai-trust-and-security-chatterbox-labs-acquisition). Context for Red Hat's AI safety posture.
- **Red Hat Open Source Assurance**: [Red Hat Open Source Assurance program page](https://www.redhat.com/en/about/open-source-assurance). Covers IP claims against Red Hat software and AI models.
- **IBM Granite model IP indemnification**: [IBM watsonx.ai foundation models page](https://www.ibm.com/products/watsonx-ai/foundation-models). Details on IBM's standard IP indemnification for Granite and Slate.

### The Vault — sovereign infrastructure

- **Commercial**: [Red Hat OpenShift](https://www.redhat.com/en/technologies/cloud-computing/openshift)
- **Open-source**: [OKD](https://www.okd.io/) (community distribution of Kubernetes powering OpenShift), [Rook](https://rook.io/) (cloud-native storage orchestrator), [Ceph](https://ceph.io/) (distributed storage).

### The Inspector — model governance

- **Commercial**: [IBM watsonx.governance](https://www.ibm.com/products/watsonx-governance)
- **Open-source**: [MLflow Model Registry](https://mlflow.org/docs/latest/model-registry.html), [AIF360](https://aif360.res.ibm.com/) (AI Fairness 360, IBM Research), [Evidently](https://www.evidentlyai.com/) (ML monitoring and drift detection), [Radicalbit](https://radicalbit.io/) (AI observability).

### The Underwriter — third-party performance insurance

- **Commercial**: [Armilla AI](https://www.armilla.ai/) (coverage details verified on the Armilla and Lloyd's pages linked above).
- **Open-source**: Not applicable. Insurance is not an open-source category.

### The Redactor — privacy layer

- **Commercial**: [Private AI](https://www.private-ai.com/)
- **Open-source**: [Microsoft Presidio](https://microsoft.github.io/presidio/). Microsoft's own documentation recommends running Presidio in parallel with a commercial service when accuracy is critical: [Presidio FAQ](https://microsoft.github.io/presidio/faq/).

### The Courier — federated learning orchestration

- **Commercial**: [Integrate.ai](https://www.integrate.ai/) (Toronto), [Devron](https://www.devron.ai/), [Flower Labs Enterprise](https://flower.ai/enterprise/) (the commercial offering from the team that maintains the open-source Flower framework).
- **Open-source**: [Flower](https://flower.ai/) (the open-source federated learning framework, maintained by Flower Labs), [NVIDIA FLARE](https://nvidia.github.io/NVFlare/), [PySyft](https://github.com/OpenMined/PySyft).

### The Ledger — immutable decision trace

- **Commercial** (category; the post names these as examples rather than a pick): [Credo AI](https://www.credo.ai/), [Arthur AI](https://www.arthur.ai/), [Axonis.ai](https://www.axonis.ai/), [Quantexa](https://www.quantexa.com/), [Palantir](https://www.palantir.com/), [Integrate.ai](https://www.integrate.ai/).
- **Open-source** (composition pattern, not a single project): [OpenSearch](https://opensearch.org/) for the searchable store, [LlamaIndex](https://www.llamaindex.ai/) for decision retrieval, plus custom middleware for the tamper-proof chain of custody.

### Previous posts in this series

- [Part 1 — The real cost of tokens, APIs, and cloud AI](https://sudomakevibe.com/blog/ai-is-not-free-part-1)
- [Part 2 — The costs that never appear on your invoice](https://sudomakevibe.com/blog/ai-is-not-free-part-2)
