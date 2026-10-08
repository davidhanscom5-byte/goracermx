# Go Racer™ MX & USA E MOTO Track Operations Suite

Official operations, telemetry, fleet management, and session intake platform for indoor electric motocross arenas and amateur racing networks.

### 🌐 Cloudflare Active 5-Domain Mesh
- **`goracermx.com`** — National Amateur Racing Portal & Master System Suite
- **`gogatemx.com`** — 20-Rider Precision Starting Gate & Traffic Signals System
- **`gowinmx.com`** — Battery-Powered RFID Finish Line & Scoring System
- **`gomotomx.com`** — Indoor Youth Motocross Arena & Reservation Portal
- **`usaemoto.com`** — Corporate Joint Venture & National Electric Motocross Sanction

---

### 🏍️ Machine Fleet Specifications (80 Total Units)
- **Cobra Moto CX3**: 40 units (Ages 7–9, Class C & Class B)
- **Cobra Moto CX5**: 40 units (Ages 10–12, Class C & Class B)
- **Separation Policy**: Inactive bikes quarantined in technical impound racks.
- **Pre-Staging Dispatch**: 10-minute parent/pit crew impound retrieval alerts.
- **Pre-Staging Gate Verification**: 6-point safety check (DOT helmet, chest protector, eye protection, kill tether, handlebar padding, rider state of mind).

### ⚙️ Standalone Hardware Modules
- **Go Gate™**: 20-rider gate, dual traffic signals (20ft ahead / 10ft above grade), 1" to 2" above axle drop height, drops flush with dirt surface, passive UHF staging RFID.
- **Go Win™**: Dedicated 24V DC battery pack (0V line voltage on dirt surface), continuous redundant electrical grounding monitor (<0.10Ω), transponder loop.

---

### 🚀 Cloudflare Pages Deployment
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** -> **Create Application** -> **Pages** -> **Connect to Git**
3. Select repository: `davidhanscom5-byte/goracermx`
4. Build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Connect your custom domains (`goracermx.com`, `gogatemx.com`, `gowinmx.com`, `gomotomx.com`, `usaemoto.com`).
