---
title: "sudo make homelab"
description: "What is actually running in my homelab — the hardware, the network, the platform, and the honest gap between what is here and what is planned."
pubDate: 2026-05-08
tags: ["homelab", "kubernetes", "k3s", "raspberry-pi", "lenovo", "thinkpad", "linux"]
---

This site names the lab as a core asset. K3s, Kali, observability stacks, and security hardening. That positioning is accurate — eventually. Right now the lab is five Lenovo laptops of varying vintage, two Raspberry Pi 5s, and a mesh router. Most of the nodes are running their current operating systems with no lab-specific configuration applied. K3s is planned, not running. The security stack is a separate project, not yet started.

This post documents the lab as it stands today — not the target state, not the roadmap. The hardware that is here, what each node is currently running, and what role it is assigned to fill. The gap between those two things is the most useful information this post can offer.

---

## The inventory

```
homelab/
├── pi-cluster/
│   ├── pi5-01    8GB RAM · M.2 HAT · 13 TOPS     currently: Ubuntu
│   │             role: AI inference
│   │
│   └── pi5-02    16GB RAM · SD                     currently: not deployed (boxed)
│                 role: K3s control plane
│
├── thinkbook/
│   └── tb-01     40GB RAM · NVMe · i5 11th Gen     currently: Ubuntu 24.04 + KVM
│                 role: dev node · local models · K8s workshop
│
├── thinkpads/
│   ├── tp-01     T430 · 16GB RAM · SSD             currently: Kali
│   │             role: K3s worker
│   │
│   ├── tp-02     X1 Carbon 4th Gen · 8GB RAM · SSD currently: Fedora
│   │             role: DevOps pipeline node (registry + CI runner)
│   │
│   ├── tp-03     T430 · 16GB RAM · SSD             currently: Ubuntu server
│   │             role: K3s worker
│   │
│   └── tp-04     X1 Carbon 9th Gen · 8GB RAM · SSD currently: Win11 + WSL
│                 role: Win11 + WSL · no platform role
│
├── network/
│   ├── router-p  Velo primary · basement · wired star hub
│   ├── router-s1 Velo satellite · top floor
│   └── eth-switch  5-port · basement
│
└── remote-access/
    └── tailscale on every node
```

### Node by node

**tb-01 — ThinkBook 14 G2, 40GB RAM, i5 11th Gen**

The anchor machine and only modern-class node in the lab — the primary development surface, local model host, and home for the KVM workshop environment.

**pi5-01 — Raspberry Pi 5, 8GB RAM, M.2 HAT**

The dedicated AI inference node, assigned to run Ollama and InstructLab on the M.2 HAT's 13 TOPS accelerator — currently running Ubuntu with no inference workloads deployed yet.

**pi5-02 — Raspberry Pi 5, 16GB RAM**

Still in the box, assigned as the K3s control plane once the cluster is stood up.

**tp-01 — ThinkPad T430, 16GB RAM**

Currently running Kali server, assigned as a K3s worker once the cluster is stood up.

**tp-02 — ThinkPad X1 Carbon 4th Gen, 8GB RAM**

The DevOps pipeline node — assigned to run a local container registry and self-hosted CI runner, currently running Fedora with nothing installed toward that role yet.

**tp-03 — ThinkPad T430, 16GB RAM**

Currently running Ubuntu server, assigned as the second K3s worker alongside tp-01.

**tp-04 — ThinkPad X1 Carbon 9th Gen, 8GB RAM**

Win11 with WSL, kept as a Windows node for workflows that require it.

---

## The network

<svg width="100%" viewBox="0 0 680 662" role="img" style="display:block;margin:2rem 0;">
  <title>Homelab physical connectivity diagram</title>
  <desc>Physical network topology — sage green network infrastructure, blue compute nodes, gray external Internet cloud.</desc>
  <defs>
    <marker id="arrow-phys" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <rect x="0" y="0" width="680" height="662" fill="var(--bg-primary)"/>

  <rect x="14" y="80" width="652" height="280" rx="8" fill="var(--bg-secondary)" stroke="var(--diagram-infra)" stroke-width="0.5" stroke-dasharray="4 3" stroke-opacity="0.5"/>
  <text x="26" y="96" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-infra)" opacity="0.8">Basement</text>

  <rect x="14" y="380" width="652" height="196" rx="8" fill="var(--bg-secondary)" stroke="var(--diagram-infra)" stroke-width="0.5" stroke-dasharray="4 3" stroke-opacity="0.5"/>
  <text x="26" y="396" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-infra)" opacity="0.8">Top floor</text>

  <line x1="340" y1="64" x2="340" y2="100" stroke="var(--diagram-infra)" stroke-width="1.5"/>
  <line x1="340" y1="136" x2="340" y2="158" stroke="var(--diagram-infra)" stroke-width="1.5"/>
  <line x1="340" y1="202" x2="340" y2="224" stroke="var(--diagram-infra)" stroke-width="1.5"/>
  <path d="M442 168 L620 168 L620 462" fill="none" stroke="var(--diagram-infra)" stroke-width="1.5"/>
  <path d="M258 268 L258 290 L76 290 L76 312" fill="none" stroke="var(--diagram-infra)" stroke-width="1.2"/>
  <path d="M290 268 L290 300 L206 300 L206 312" fill="none" stroke="var(--diagram-infra)" stroke-width="1.2"/>
  <path d="M388 268 L388 300 L406 300 L406 312" fill="none" stroke="var(--diagram-infra)" stroke-width="1.2"/>
  <path d="M420 268 L420 290 L536 290 L536 312" fill="none" stroke="var(--diagram-infra)" stroke-width="1.2"/>
  <path d="M600 462 L600 422 L350 422" fill="none" stroke="var(--diagram-infra)" stroke-width="1.5"/>
  <line x1="580" y1="484" x2="350" y2="484" stroke="var(--diagram-infra)" stroke-width="1.2" stroke-dasharray="4 3"/>
  <path d="M575 506 L575 540 L93 540 L93 506" fill="none" stroke="var(--diagram-infra)" stroke-width="1.5"/>

  <ellipse cx="300" cy="38" rx="34" ry="18" fill="var(--diagram-external-fill)" stroke="var(--diagram-external)" stroke-width="0.8"/>
  <ellipse cx="330" cy="32" rx="28" ry="16" fill="var(--diagram-external-fill)" stroke="var(--diagram-external)" stroke-width="0.8"/>
  <ellipse cx="358" cy="38" rx="26" ry="16" fill="var(--diagram-external-fill)" stroke="var(--diagram-external)" stroke-width="0.8"/>
  <ellipse cx="340" cy="48" rx="38" ry="16" fill="var(--diagram-external-fill)" stroke="var(--diagram-external)" stroke-width="0.8"/>
  <ellipse cx="300" cy="40" rx="32" ry="14" fill="var(--diagram-external-fill)" stroke="none"/>
  <ellipse cx="330" cy="34" rx="26" ry="13" fill="var(--diagram-external-fill)" stroke="none"/>
  <ellipse cx="358" cy="40" rx="24" ry="13" fill="var(--diagram-external-fill)" stroke="none"/>
  <text x="329" y="44" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="12" fill="var(--diagram-external-text)">Internet</text>

  <rect x="268" y="100" width="144" height="36" rx="6" fill="var(--diagram-infra-fill)" stroke="var(--diagram-infra)" stroke-width="0.8"/>
  <text x="340" y="118" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="13" font-weight="500" fill="var(--diagram-infra-text)">Modem</text>

  <rect x="238" y="158" width="204" height="44" rx="6" fill="var(--diagram-infra-fill)" stroke="var(--diagram-infra)" stroke-width="0.8"/>
  <text x="340" y="175" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="13" font-weight="500" fill="var(--diagram-infra-text)">Router-P</text>
  <text x="340" y="193" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-infra)">Primary · wired star hub</text>

  <rect x="238" y="224" width="204" height="44" rx="6" fill="var(--diagram-infra-fill)" stroke="var(--diagram-infra)" stroke-width="0.8"/>
  <text x="340" y="241" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="13" font-weight="500" fill="var(--diagram-infra-text)">Ethernet Switch</text>
  <text x="340" y="259" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-infra)">5-port · basement</text>

  <rect x="28" y="312" width="96" height="44" rx="6" fill="var(--diagram-compute-fill)" stroke="var(--diagram-compute)" stroke-width="1"/>
  <text x="76" y="329" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="13" font-weight="500" fill="var(--diagram-compute-text)">tp-01</text>
  <text x="76" y="347" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-compute-sub)">wired</text>

  <rect x="158" y="312" width="96" height="44" rx="6" fill="var(--diagram-compute-fill)" stroke="var(--diagram-compute)" stroke-width="1"/>
  <text x="206" y="329" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="13" font-weight="500" fill="var(--diagram-compute-text)">tp-02</text>
  <text x="206" y="347" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-compute-sub)">wired</text>

  <rect x="358" y="312" width="96" height="44" rx="6" fill="var(--diagram-compute-fill)" stroke="var(--diagram-compute)" stroke-width="1"/>
  <text x="406" y="329" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="13" font-weight="500" fill="var(--diagram-compute-text)">tp-03</text>
  <text x="406" y="347" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-compute-sub)">wired</text>

  <rect x="488" y="312" width="96" height="44" rx="6" fill="var(--diagram-compute-fill)" stroke="var(--diagram-compute)" stroke-width="1"/>
  <text x="536" y="329" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="13" font-weight="500" fill="var(--diagram-compute-text)">pi5-02</text>
  <text x="536" y="347" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-compute-sub)">wired</text>

  <rect x="556" y="462" width="110" height="44" rx="6" fill="var(--diagram-infra-fill)" stroke="var(--diagram-infra)" stroke-width="0.8"/>
  <text x="611" y="479" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="13" font-weight="500" fill="var(--diagram-infra-text)">Router-S1</text>
  <text x="611" y="497" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-infra)">Satellite</text>

  <rect x="220" y="400" width="130" height="44" rx="6" fill="var(--diagram-compute-fill)" stroke="var(--diagram-compute)" stroke-width="1"/>
  <text x="285" y="417" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="13" font-weight="500" fill="var(--diagram-compute-text)">pi5-01</text>
  <text x="285" y="435" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-compute-sub)">wired</text>

  <rect x="28" y="462" width="130" height="44" rx="6" fill="var(--diagram-compute-fill)" stroke="var(--diagram-compute)" stroke-width="1"/>
  <text x="93" y="479" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="13" font-weight="500" fill="var(--diagram-compute-text)">tb-01</text>
  <text x="93" y="497" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-compute-sub)">wired</text>

  <rect x="220" y="462" width="130" height="44" rx="6" fill="var(--diagram-compute-fill)" stroke="var(--diagram-compute)" stroke-width="1" stroke-dasharray="4 3"/>
  <text x="285" y="479" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="13" font-weight="500" fill="var(--diagram-compute-text)">tp-04</text>
  <text x="285" y="497" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-compute-sub)">WiFi</text>

  <rect x="14" y="582" width="652" height="72" rx="6" fill="var(--bg-secondary)" stroke="var(--border)" stroke-width="0.5" stroke-opacity="0.5"/>
  <text x="28" y="602" font-family="JetBrains Mono, monospace" font-size="13" font-weight="500" fill="var(--text-primary)">Legend</text>

  <line x1="28" y1="620" x2="68" y2="620" stroke="var(--diagram-infra)" stroke-width="1.5"/>
  <text x="76" y="624" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--text-secondary)">Wired ethernet</text>
  <line x1="230" y1="620" x2="270" y2="620" stroke="var(--diagram-infra)" stroke-width="1.2" stroke-dasharray="4 3"/>
  <text x="278" y="624" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--text-secondary)">WiFi</text>

  <rect x="28" y="634" width="12" height="12" rx="2" fill="var(--diagram-external-fill)" stroke="var(--diagram-external)" stroke-width="0.8"/>
  <text x="46" y="645" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--text-secondary)">External</text>
  <rect x="128" y="634" width="12" height="12" rx="2" fill="var(--diagram-infra-fill)" stroke="var(--diagram-infra)" stroke-width="0.8"/>
  <text x="146" y="645" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--text-secondary)">Network infra</text>
  <rect x="278" y="634" width="12" height="12" rx="2" fill="var(--diagram-compute-fill)" stroke="var(--diagram-compute)" stroke-width="0.8"/>
  <text x="296" y="645" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--text-secondary)">Compute node</text>
</svg>

| Node | Hardware | OS today |
|---|---|---|
| tb-01 | ThinkBook G2 · 40GB RAM · i5 11th | Ubuntu 24.04 |
| pi5-01 | Pi 5 · 8GB RAM · M.2 HAT | Ubuntu |
| pi5-02 | Pi 5 · 16GB RAM · SD | None · boxed |
| tp-01 | T430 · 16GB RAM · SSD · ext. WiFi | Kali |
| tp-02 | X1 Carbon 4th Gen · 8GB RAM · SSD | Fedora |
| tp-03 | T430 · 16GB RAM · SSD | Ubuntu |
| tp-04 | X1 Carbon 9th Gen · 8GB RAM · SSD | Win11 + WSL |

The network is a wired star centered on Router-P in the basement. Router-P connects directly to a 5-port Ethernet Switch, which carries tp-01, tp-02, tp-03, and pi5-02 by ethernet. Router-S1 on the top floor runs a separate wired drop to pi5-01 and tb-01. tp-04 is the one exception, connecting to Router-S1 over WiFi. Three satellite routers extend coverage across the floors; Router-S1 is the only one with lab nodes connected to it. All backhaul between routers is physical ethernet. Tailscale runs on every node and provides the remote access layer, reachable from anywhere.

---

## The platform

<svg width="100%" viewBox="0 0 680 720" role="img" style="display:block;margin:2rem 0;">
  <title>Homelab platform diagram — Kubernetes and VMs</title>
  <desc>Logical platform diagram — ice blue AI inference, sage green Tailscale overlay, blue cluster, teal DevOps, purple dev/VMs.</desc>
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <rect x="0" y="0" width="680" height="720" fill="var(--bg-primary)"/>

  <rect x="14" y="20" width="652" height="240" rx="8" fill="var(--bg-secondary)" stroke="var(--diagram-compute)" stroke-width="0.8" stroke-dasharray="5 3"/>
  <text x="26" y="38" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-compute)">K3s cluster</text>

  <rect x="254" y="46" width="172" height="54" rx="6" fill="var(--diagram-compute)" stroke="var(--bg-primary)" stroke-width="0.5"/>
  <text x="340" y="66" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="13" font-weight="500" fill="var(--bg-primary)">pi5-02</text>
  <text x="340" y="86" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--bg-secondary)">K3s control plane</text>

  <path d="M290 100 L290 148 L176 148 L176 160" fill="none" stroke="var(--diagram-compute)" stroke-width="1.2" marker-end="url(#arrow)"/>
  <path d="M390 100 L390 148 L504 148 L504 160" fill="none" stroke="var(--diagram-compute)" stroke-width="1.2" marker-end="url(#arrow)"/>

  <rect x="90" y="160" width="172" height="54" rx="6" fill="var(--diagram-compute-fill)" stroke="var(--diagram-compute)" stroke-width="1"/>
  <text x="176" y="180" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="13" font-weight="500" fill="var(--diagram-compute-text)">tp-01</text>
  <text x="176" y="200" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-compute-sub)">K3s worker</text>

  <rect x="418" y="160" width="172" height="54" rx="6" fill="var(--diagram-compute-fill)" stroke="var(--diagram-compute)" stroke-width="1"/>
  <text x="504" y="180" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="13" font-weight="500" fill="var(--diagram-compute-text)">tp-03</text>
  <text x="504" y="200" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-compute-sub)">K3s worker</text>

  <rect x="14" y="280" width="652" height="110" rx="8" fill="var(--bg-secondary)" stroke="var(--diagram-devops)" stroke-width="0.8" stroke-dasharray="5 3"/>
  <text x="26" y="298" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-devops)">DevOps pipeline</text>

  <rect x="30" y="306" width="172" height="68" rx="6" fill="var(--diagram-dev-fill)" stroke="var(--diagram-dev)" stroke-width="1"/>
  <text x="116" y="326" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="13" font-weight="500" fill="var(--diagram-dev-text)">tb-01</text>
  <text x="116" y="344" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-dev-sub)">Dev node</text>
  <text x="116" y="362" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-dev-sub)">build + push image</text>

  <line x1="202" y1="340" x2="268" y2="340" stroke="var(--diagram-devops)" stroke-width="1.2" marker-end="url(#arrow)"/>

  <rect x="268" y="306" width="172" height="68" rx="6" fill="var(--diagram-devops-fill)" stroke="var(--diagram-devops)" stroke-width="1"/>
  <text x="354" y="326" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="13" font-weight="500" fill="var(--diagram-devops-text)">tp-02</text>
  <text x="354" y="344" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-devops)">Registry · CI runner</text>
  <text x="354" y="362" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-devops)">store + serve image</text>

  <line x1="440" y1="340" x2="506" y2="340" stroke="var(--diagram-devops)" stroke-width="1.2" marker-end="url(#arrow)"/>

  <rect x="506" y="306" width="148" height="68" rx="6" fill="var(--bg-secondary)" stroke="var(--diagram-compute)" stroke-width="0.8" stroke-dasharray="4 3"/>
  <text x="580" y="326" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="13" font-weight="500" fill="var(--diagram-compute-text)">K3s cluster</text>
  <text x="580" y="344" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-compute-sub)">pull from registry</text>
  <text x="580" y="362" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-compute-sub)">deploy workload</text>

  <rect x="14" y="410" width="330" height="150" rx="8" fill="var(--bg-secondary)" stroke="var(--diagram-dev)" stroke-width="0.8" stroke-dasharray="5 3"/>
  <text x="26" y="428" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-dev)">tb-01 · KVM</text>

  <rect x="26" y="436" width="140" height="54" rx="6" fill="var(--diagram-dev-fill)" stroke="var(--diagram-dev)" stroke-width="1"/>
  <text x="96" y="456" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="12" font-weight="500" fill="var(--diagram-dev-text)">K8s workshop</text>
  <text x="96" y="474" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-dev-sub)">3× KVM VMs</text>

  <rect x="184" y="436" width="140" height="54" rx="6" fill="var(--diagram-dev-fill)" stroke="var(--diagram-dev)" stroke-width="1"/>
  <text x="254" y="456" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="12" font-weight="500" fill="var(--diagram-dev-text)">Arch Linux VM</text>
  <text x="254" y="474" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-dev-sub)">Course lab</text>

  <rect x="26" y="502" width="298" height="44" rx="6" fill="var(--diagram-ai-fill)" stroke="var(--diagram-ai)" stroke-width="1"/>
  <text x="175" y="520" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="12" font-weight="500" fill="var(--diagram-ai-text)">Ollama</text>
  <text x="175" y="538" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-ai)">Local model host · large models</text>

  <rect x="362" y="410" width="304" height="150" rx="8" fill="var(--bg-secondary)" stroke="var(--diagram-compute)" stroke-width="0.8" stroke-dasharray="5 3"/>
  <text x="374" y="428" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-compute)">Standalone</text>

  <rect x="374" y="436" width="130" height="54" rx="6" fill="var(--diagram-ai-fill)" stroke="var(--diagram-ai)" stroke-width="1"/>
  <text x="439" y="456" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="13" font-weight="500" fill="var(--diagram-ai-text)">pi5-01</text>
  <text x="439" y="474" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-ai)">AI inference</text>

  <rect x="522" y="436" width="130" height="54" rx="6" fill="var(--diagram-windows-fill)" stroke="var(--diagram-windows)" stroke-width="1"/>
  <text x="587" y="456" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="13" font-weight="500" fill="var(--diagram-windows-text)">tp-04</text>
  <text x="587" y="474" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-windows)">Win11 + WSL</text>

  <rect x="374" y="502" width="278" height="44" rx="6" fill="var(--diagram-ai-fill)" stroke="var(--diagram-ai)" stroke-width="1"/>
  <text x="513" y="520" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="12" font-weight="500" fill="var(--diagram-ai-text)">Ollama · InstructLab</text>
  <text x="513" y="538" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-ai)">Edge inference · M.2 HAT</text>

  <rect x="14" y="580" width="652" height="40" rx="6" fill="var(--diagram-infra-fill)" stroke="var(--diagram-tailscale)" stroke-width="0.8" stroke-dasharray="3 3"/>
  <text x="340" y="600" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--diagram-infra-text)">Tailscale overlay — all nodes · remote access from anywhere</text>

  <rect x="14" y="638" width="652" height="68" rx="6" fill="var(--bg-secondary)" stroke="var(--border)" stroke-width="0.5" stroke-opacity="0.5"/>
  <text x="28" y="658" font-family="JetBrains Mono, monospace" font-size="13" font-weight="500" fill="var(--text-primary)">Legend</text>

  <line x1="28" y1="676" x2="68" y2="676" stroke="var(--diagram-compute)" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text x="76" y="680" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--text-secondary)">Logical flow</text>
  <line x1="200" y1="676" x2="240" y2="676" stroke="var(--diagram-compute)" stroke-width="0.8" stroke-dasharray="5 3"/>
  <text x="248" y="680" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--text-secondary)">Cluster boundary</text>
  <line x1="390" y1="676" x2="430" y2="676" stroke="var(--diagram-tailscale)" stroke-width="0.8" stroke-dasharray="3 3"/>
  <text x="438" y="680" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--text-secondary)">Tailscale overlay</text>

  <rect x="28" y="690" width="12" height="12" rx="2" fill="var(--diagram-compute)"/>
  <text x="46" y="700" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--text-secondary)">Control plane</text>
  <rect x="158" y="690" width="12" height="12" rx="2" fill="var(--diagram-compute-fill)" stroke="var(--diagram-compute)" stroke-width="0.8"/>
  <text x="176" y="700" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--text-secondary)">Worker</text>
  <rect x="248" y="690" width="12" height="12" rx="2" fill="var(--diagram-devops-fill)" stroke="var(--diagram-devops)" stroke-width="0.8"/>
  <text x="266" y="700" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--text-secondary)">DevOps</text>
  <rect x="348" y="690" width="12" height="12" rx="2" fill="var(--diagram-dev-fill)" stroke="var(--diagram-dev)" stroke-width="0.8"/>
  <text x="366" y="700" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--text-secondary)">Dev / VM</text>
  <rect x="458" y="690" width="12" height="12" rx="2" fill="var(--diagram-ai-fill)" stroke="var(--diagram-ai)" stroke-width="0.8"/>
  <text x="476" y="700" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--text-secondary)">AI inference</text>
  <rect x="578" y="690" width="12" height="12" rx="2" fill="var(--diagram-windows-fill)" stroke="var(--diagram-windows)" stroke-width="0.8"/>
  <text x="596" y="700" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--text-secondary)">Windows</text>
</svg>

| Node | Platform role |
|---|---|
| pi5-02 | K3s control plane · 16GB RAM |
| tp-01 | K3s worker · 16GB RAM |
| tp-03 | K3s worker · 16GB RAM |
| tp-02 | Registry · CI runner · 8GB RAM |
| tb-01 | Dev node · KVM · Ollama · 40GB RAM |
| pi5-01 | AI inference · M.2 HAT · 8GB RAM |
| tp-04 | Win11 + WSL · 8GB RAM |

The lab's platform architecture has three layers. The compute layer is a K3s cluster: pi5-02 as control plane, tp-01 and tp-03 as workers. The DevOps layer is tp-02 running a local container registry and CI runner. The inference layer is pi5-01, assigned as the dedicated AI inference node once Ollama and InstructLab are deployed, with Ollama already running on tb-01 for larger models that need more headroom.

I chose K3s as the cluster distribution rather than a full kubeadm-based deployment for a concrete reason: the hardware does not support a parallel full Kubernetes installation, and K3s is Kubernetes — same API, same workloads, same `kubectl`. The distinction matters on a CV and in a vendor conversation, but it does not produce a different skill set. A separate K8s workshop runs in three KVM virtual machines on tb-01 alongside an Arch Linux VM for a current Kubernetes and DevOps training course. Those are temporary environments, not permanent lab infrastructure.

The decision to put the control plane on pi5-02 rather than a ThinkPad comes down to uptime and power. A Pi draws a fraction of what a laptop draws and does not have a battery that needs managing or a lid that can be accidentally closed. The T430s are workers, they handle the load, the Pi handles the coordination.

tp-02 as a dedicated DevOps node follows a pattern that appears in real enterprise environments. Separating the registry and CI runner from the cluster means the cluster does not pull images from Docker Hub during a deployment. The entire pipeline runs inside the lab: write code on tb-01, commit, trigger the CI runner on tp-02, build and push to the local registry on tp-02, K3s pulls from tp-02. No external dependencies, no rate limits, no internet required for a deploy cycle.

---

## Today vs planned

| Node | Today | Planned role |
|---|---|---|
| tb-01 | Ubuntu 24.04 · KVM · Ollama | Dev node · K8s workshop · local models |
| pi5-01 | Ubuntu · inference not yet deployed | AI inference · Ollama · InstructLab · RAG |
| pi5-02 | Boxed | K3s control plane |
| tp-01 | Kali server | K3s worker |
| tp-02 | Fedora | Registry · CI runner |
| tp-03 | Ubuntu server | K3s worker |
| tp-04 | Win11 + WSL | Win11 + WSL · no role change |

Nothing in the planned column has a date attached to it. The next post in this series documents the K3s install — that is the next concrete step.

---

## Why this lab exists

The three throughlines on this site are open-source first, Gen AI as a first-class tenant, and vibe coding as the working method. The lab is where those three things collide with actual hardware. Local AI inference on consumer silicon. Kubernetes on twelve-year-old ThinkPads. A DevOps pipeline that does not touch a cloud provider. None of it is production-grade. All of it is real.

---

## What comes next

The follow-up posts have names. `sudo make homelab secure` covers the security stack: WireGuard, SSH hardening, NetBird, Ansible, and OpenTofu. `sudo make homelab ai` goes deep on the inference layer: Ollama model selection, InstructLab fine-tuning, and RAG on local data. `sudo make homelab observe` covers the observability stack: Prometheus, Grafana, and AIOps experiments. Each of those posts links back to this one. This is the foundation.
