
import { useMemo, useState } from "react";
import "./App.css";

const inventoryData = [
  { id: 1, hospital: "Apollo Medical Center", medicine: "Paracetamol", category: "Analgesic", stock: 1250, demand: 100, safety: 300, expiry: 180, status: "Surplus" },
  { id: 2, hospital: "City General Hospital", medicine: "Amoxicillin", category: "Antibiotic", stock: 90, demand: 60, safety: 120, expiry: 120, status: "Shortage" },
  { id: 3, hospital: "Green Valley Hospital", medicine: "Metformin", category: "Antidiabetic", stock: 520, demand: 70, safety: 210, expiry: 210, status: "Adequate" },
  { id: 4, hospital: "Sunrise Healthcare", medicine: "Insulin", category: "Antidiabetic", stock: 180, demand: 50, safety: 150, expiry: 18, status: "Expiring Soon" },
  { id: 5, hospital: "Apollo Medical Center", medicine: "Azithromycin", category: "Antibiotic", stock: 760, demand: 40, safety: 160, expiry: 150, status: "Surplus" },
  { id: 6, hospital: "City General Hospital", medicine: "Paracetamol", category: "Analgesic", stock: 85, demand: 75, safety: 225, expiry: 200, status: "Shortage" },
  { id: 7, hospital: "Lakeside Hospital", medicine: "Cetirizine", category: "Antihistamine", stock: 440, demand: 45, safety: 135, expiry: 12, status: "Expiring Soon" },
  { id: 8, hospital: "Green Valley Hospital", medicine: "Amoxicillin", category: "Antibiotic", stock: 360, demand: 45, safety: 135, expiry: 100, status: "Adequate" },
];

const transfersData = [
  { id: "TR-001", from: "Apollo Medical Center", to: "City General Hospital", medicine: "Paracetamol", quantity: 100, distance: 12.4, time: "28 min", cost: 420, status: "Pending Review" },
  { id: "TR-002", from: "Apollo Medical Center", to: "Sunrise Healthcare", medicine: "Azithromycin", quantity: 80, distance: 18.6, time: "42 min", cost: 610, status: "Pending Review" },
  { id: "TR-003", from: "Green Valley Hospital", to: "City General Hospital", medicine: "Amoxicillin", quantity: 50, distance: 8.2, time: "19 min", cost: 280, status: "Pending Review" },
];

const hospitals = [
  { name: "Apollo Medical Center", short: "AM", type: "Surplus", x: 23, y: 30 },
  { name: "City General Hospital", short: "CG", type: "Shortage", x: 70, y: 61 },
  { name: "Green Valley Hospital", short: "GV", type: "Surplus", x: 49, y: 19 },
  { name: "Sunrise Healthcare", short: "SH", type: "Shortage", x: 80, y: 28 },
  { name: "Lakeside Hospital", short: "LH", type: "Adequate", x: 34, y: 73 },
];

const navItems = [
  { name: "Dashboard", icon: "▦" },
  { name: "Inventory", icon: "▤" },
  { name: "Shortage Alerts", icon: "⚑", count: "2" },
  { name: "Redistribution", icon: "⇄" },
  { name: "Route Map", icon: "⌖" },
  { name: "Reports", icon: "▥" },
];

function Icon({ children, className = "" }) {
  return <span aria-hidden="true" className={`icon ${className}`}>{children}</span>;
}

function Status({ value }) {
  const classes = {
    Surplus: "success",
    Adequate: "neutral",
    Shortage: "danger",
    "Expiring Soon": "warning",
    "Pending Review": "info",
  };
  return <span className={`status ${classes[value] || "neutral"}`}>{value}</span>;
}

function StatCard({ icon, label, value, note, color }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${color}`}>{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-note">{note}</div>
    </article>
  );
}

function MapPanel({ full = false }) {
  return (
    <div className={`map-canvas ${full ? "map-large" : ""}`}>
      <div className="map-road road-one" />
      <div className="map-road road-two" />
      <div className="map-road road-three" />
      <div className="map-road road-four" />
      <div className="map-water" />
      <div className="map-park park-one" />
      <div className="map-park park-two" />
      <div className="map-park park-three" />

      {hospitals.map((hospital) => (
        <div
          key={hospital.short}
          className={`map-marker marker-${hospital.type.toLowerCase().replace(" ", "-")}`}
          style={{ left: `${hospital.x}%`, top: `${hospital.y}%` }}
          title={`${hospital.name} — ${hospital.type}`}
        >
          <span>{hospital.short}</span>
          {full && <small>{hospital.name}</small>}
        </div>
      ))}

      <div className="map-legend">
        <span><i className="legend-dot green-dot" /> Surplus</span>
        <span><i className="legend-dot red-dot" /> Shortage</span>
        <span><i className="legend-dot gray-dot" /> Adequate</span>
      </div>
      <div className="map-disclaimer">Illustrative map · Sample hospital locations</div>
    </div>
  );
}

function InventoryTable({ items, compact = false }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Hospital / Medicine</th>
            <th>Available</th>
            <th>Daily demand</th>
            {!compact && <th>Safety stock</th>}
            {!compact && <th>Expiry</th>}
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="medicine-name">{item.medicine}</div>
                <div className="table-sub">{item.hospital}</div>
                <span className="category-label">{item.category}</span>
              </td>
              <td><strong>{item.stock.toLocaleString("en-IN")}</strong><div className="table-sub">units</div></td>
              <td>{item.demand} <span className="table-sub">units/day</span></td>
              {!compact && <td>{item.safety}</td>}
              {!compact && (
                <td>
                  <span className={item.expiry <= 30 ? "expiry-urgent" : ""}>{item.expiry} days</span>
                </td>
              )}
              <td><Status value={item.status} /></td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={6} className="empty-state">No medicines match your search.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function TransferCards({ items, onReview }) {
  if (!items.length) return <div className="empty-state">No transfer recommendations match your search.</div>;

  return (
    <div className="transfer-list">
      {items.map((transfer) => (
        <article className="transfer-card" key={transfer.id}>
          <div className="transfer-heading">
            <span className="transfer-id">{transfer.id}</span>
            <Status value={transfer.status} />
          </div>
          <div className="transfer-route">
            <div className="route-place">
              <span className="route-node source-node" />
              <div><small>FROM</small><strong>{transfer.from}</strong></div>
            </div>
            <div className="route-connector"><span>↓</span></div>
            <div className="route-place">
              <span className="route-node destination-node" />
              <div><small>TO</small><strong>{transfer.to}</strong></div>
            </div>
          </div>
          <div className="transfer-medicine">
            <div><span className="mini-label">MEDICINE</span><strong>{transfer.medicine}</strong></div>
            <div><span className="mini-label">QUANTITY</span><strong>{transfer.quantity} units</strong></div>
          </div>
          <div className="transfer-metrics">
            <div><Icon>⌖</Icon><span>{transfer.distance} km</span></div>
            <div><Icon>◷</Icon><span>{transfer.time}</span></div>
            <div><Icon>₹</Icon><span>₹{transfer.cost}</span></div>
          </div>
          <button className="button button-outline review-button" onClick={() => onReview(transfer)}>
            Review transfer <span>→</span>
          </button>
        </article>
      ))}
    </div>
  );
}

function Dashboard({ onNavigate, inventory, transfers, onReview }) {
  const shortageCount = inventory.filter((item) => item.status === "Shortage").length;
  const surplusUnits = inventory
    .filter((item) => item.status === "Surplus")
    .reduce((sum, item) => sum + Math.max(0, item.stock - item.safety), 0);
  const expiring = inventory.filter((item) => item.expiry <= 30);
  const pendingCount = transfers.filter((item) => item.status === "Pending Review").length;

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">OVERVIEW</div>
          <h1>Dashboard overview</h1>
          <p>Monitor medicine availability and coordinate smarter redistribution.</p>
        </div>
        <span className="demo-pill"><span /> DEMO DATA</span>
      </div>

      <div className="stat-grid">
        <StatCard icon="⌂" label="Hospitals monitored" value="05" note="Sample hospital network" color="blue" />
        <StatCard icon="⚑" label="Medicines at risk" value={String(shortageCount).padStart(2, "0")} note="Inventory shortage records" color="red" />
        <StatCard icon="⇧" label="Surplus stock" value={surplusUnits.toLocaleString("en-IN")} note="Estimated available units" color="green" />
        <StatCard icon="⇄" label="Transfers recommended" value={String(pendingCount).padStart(2, "0")} note="Awaiting human review" color="purple" />
      </div>

      <div className="dashboard-grid">
        <section className="panel map-panel">
          <div className="panel-header">
            <div><h2>Hospital network</h2><p>Illustrative distribution overview</p></div>
            <button className="text-button" onClick={() => onNavigate("Route Map")}>Explore map →</button>
          </div>
          <MapPanel />
        </section>

        <section className="panel alert-panel">
          <div className="panel-header">
            <div><h2>Priority alerts</h2><p>Items needing attention</p></div>
            <span className="alert-count">{shortageCount + expiring.length}</span>
          </div>
          <div className="alert-list">
            {inventory.filter((item) => item.status === "Shortage" || item.expiry <= 30).slice(0, 4).map((item) => (
              <div className="alert-item" key={item.id}>
                <span className={`alert-symbol ${item.status === "Shortage" ? "alert-red" : "alert-amber"}`}>
                  {item.status === "Shortage" ? "!" : "◷"}
                </span>
                <div className="alert-copy">
                  <strong>{item.medicine}</strong>
                  <span>{item.hospital}</span>
                  <small>{item.status === "Shortage" ? "Below safety stock" : `Expires in ${item.expiry} days`}</small>
                </div>
                <span className={`priority-dot ${item.status === "Shortage" ? "red-dot" : "amber-dot"}`} />
              </div>
            ))}
          </div>
          <button className="button button-outline full-button" onClick={() => onNavigate("Shortage Alerts")}>View all alerts <span>→</span></button>
        </section>

        <section className="panel inventory-panel">
          <div className="panel-header">
            <div><h2>Inventory snapshot</h2><p>Recent medicine stock records</p></div>
            <button className="text-button" onClick={() => onNavigate("Inventory")}>View inventory →</button>
          </div>
          <InventoryTable items={inventory.slice(0, 4)} compact />
        </section>

        <section className="panel recommendations-panel">
          <div className="panel-header">
            <div><h2>AI recommendations</h2><p>Suggested transfers · Sample results</p></div>
            <button className="text-button" onClick={() => onNavigate("Redistribution")}>View all →</button>
          </div>
          <div className="mini-recommendations">
            {transfers.slice(0, 2).map((transfer) => (
              <div className="mini-transfer" key={transfer.id}>
                <div className="mini-transfer-icon">⇄</div>
                <div className="mini-transfer-copy">
                  <strong>{transfer.medicine} <span>· {transfer.quantity} units</span></strong>
                  <p>{transfer.from.split(" ")[0]} → {transfer.to.split(" ")[0]}</p>
                  <small>{transfer.distance} km · Estimated ₹{transfer.cost}</small>
                </div>
                <button className="icon-button" aria-label={`Review ${transfer.id}`} onClick={() => onReview(transfer)}>↗</button>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="footer-note"><Icon>ⓘ</Icon> All metrics and recommendations are illustrative sample data. Validate stock, expiry, storage requirements and transport conditions before any real transfer.</div>
    </>
  );
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [inventory, setInventory] = useState(inventoryData);
  const [transfers, setTransfers] = useState(transfersData);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const filteredInventory = useMemo(() => inventory.filter((item) => {
    const term = search.toLowerCase();
    const matchesSearch = [item.hospital, item.medicine, item.category].some((value) => value.toLowerCase().includes(term));
    return matchesSearch && (statusFilter === "All" || item.status === statusFilter);
  }), [inventory, search, statusFilter]);

  const filteredTransfers = useMemo(() => transfers.filter((item) =>
    [item.from, item.to, item.medicine, item.id].some((value) => value.toLowerCase().includes(search.toLowerCase()))
  ), [transfers, search]);

  function navigate(page) {
    setActivePage(page);
    setSearch("");
    setStatusFilter("All");
    setMobileNavOpen(false);
  }

  function handleReview(transfer) {
    setSelectedTransfer(transfer);
    setNotice("");
  }

  function updateTransfer(status) {
    setTransfers((current) => current.map((item) =>
      item.id === selectedTransfer.id ? { ...item, status } : item
    ));
    setNotice(`${selectedTransfer.id} marked "${status}". This is a local demo action only.`);
    setSelectedTransfer(null);
  }

  function exportReport() {
    const rows = [
      ["Hospital", "Medicine", "Category", "Available", "Daily Demand", "Safety Stock", "Expiry Days", "Status"],
      ...inventory.map((item) => [item.hospital, item.medicine, item.category, item.stock, item.demand, item.safety, item.expiry, item.status]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "medishare-demo-inventory.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  const pageDescriptions = {
    Inventory: "Search medicine stock, safety thresholds and expiry information.",
    "Shortage Alerts": "Review stock records that may need urgent attention.",
    Redistribution: "Review suggested transfers between hospitals.",
    "Route Map": "Explore illustrative hospital locations and a sample transport route.",
    Reports: "Export the current sample inventory for analysis.",
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><span>✚</span></div>
          <div><strong>MediShare<span> AI</span></strong><small>SMART HEALTHCARE LOGISTICS</small></div>
          <button className="mobile-close" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation">×</button>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="navigation" aria-label="Main navigation">
          {navItems.map((item) => (
            <button key={item.name} className={`nav-item ${activePage === item.name ? "nav-active" : ""}`} onClick={() => navigate(item.name)}>
              <Icon>{item.icon}</Icon>
              <span>{item.name}</span>
              {item.count && <span className="nav-count">{item.count}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="network-card">
            <div className="network-icon">✚</div>
            <strong>Connected for good.</strong>
            <p>Smarter redistribution. Less medicine waste.</p>
            <div className="network-status"><span /> Demo environment</div>
          </div>
          <div className="profile">
            <div className="profile-avatar">MS</div>
            <div><strong>Network Admin</strong><small>Demo workspace</small></div>
            <span className="profile-dots">···</span>
          </div>
        </div>
      </aside>

      {mobileNavOpen && <button className="mobile-backdrop" onClick={() => setMobileNavOpen(false)} aria-label="Close menu" />}

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation">☰</button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>{activePage}</strong></div>
          <div className="topbar-right">
            <label className="global-search">
              <span>⌕</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search medicines, hospitals..." aria-label="Search dashboard" />
              <kbd>⌘ K</kbd>
            </label>
            <span className="topbar-divider" />
            <button className="notification-button" onClick={() => navigate("Shortage Alerts")} aria-label="View shortage alerts">♧<i /></button>
            <div className="top-avatar">MS</div>
          </div>
        </header>

        <div className="content-area">
          {notice && <div className="notice-banner">{notice}<button onClick={() => setNotice("")}>×</button></div>}

          {activePage === "Dashboard" && <Dashboard onNavigate={navigate} inventory={inventory} transfers={transfers} onReview={handleReview} />}

          {activePage === "Inventory" && (
            <>
              <div className="page-heading">
                <div><div className="eyebrow">STOCK MANAGEMENT</div><h1>Medicine inventory</h1><p>{pageDescriptions.Inventory}</p></div>
                <button className="button button-primary" onClick={exportReport}>↓ Export CSV</button>
              </div>
              <div className="filter-bar">
                <div className="filter-search"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search medicine or hospital..." /></div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by stock status">
                  {["All", "Surplus", "Adequate", "Shortage", "Expiring Soon"].map((status) => <option key={status}>{status}</option>)}
                </select>
                <span className="results-count">{filteredInventory.length} records</span>
              </div>
              <section className="panel full-table-panel"><InventoryTable items={filteredInventory} /></section>
              <div className="footer-note">Stock status is illustrative. Confirm local inventory and actual expiry dates before acting.</div>
            </>
          )}

          {activePage === "Shortage Alerts" && (
            <>
              <div className="page-heading"><div><div className="eyebrow">RISK MONITORING</div><h1>Shortage alerts</h1><p>{pageDescriptions["Shortage Alerts"]}</p></div><span className="demo-pill"><span /> DEMO DATA</span></div>
              <div className="stat-grid two-stats">
                <StatCard icon="!" label="Shortage records" value={inventory.filter((i) => i.status === "Shortage").length} note="Below safety stock in sample data" color="red" />
                <StatCard icon="◷" label="Expiry warnings" value={inventory.filter((i) => i.expiry <= 30).length} note="30 days or less in sample data" color="purple" />
              </div>
              <section className="panel full-table-panel"><div className="panel-header"><div><h2>Attention required</h2><p>Shortages and approaching expiries</p></div></div><InventoryTable items={inventory.filter((i) => i.status === "Shortage" || i.expiry <= 30)} /></section>
            </>
          )}

          {activePage === "Redistribution" && (
            <>
              <div className="page-heading"><div><div className="eyebrow">DECISION SUPPORT</div><h1>Redistribution center</h1><p>{pageDescriptions.Redistribution}</p></div><span className="demo-pill"><span /> SAMPLE RECOMMENDATIONS</span></div>
              <div className="callout"><span>✦</span><div><strong>AI-assisted decision support</strong><p>These example transfers are not results from your backend MILP solver. Review the actual optimization output and validate medicine suitability before approving any real transfer.</p></div></div>
              <div className="transfer-summary">
                <div><small>PROPOSED TRANSFERS</small><strong>{transfers.length}</strong></div>
                <div><small>ILLUSTRATIVE UNITS</small><strong>{transfers.reduce((sum, t) => sum + t.quantity, 0).toLocaleString("en-IN")}</strong></div>
                <div><small>ESTIMATED COST</small><strong>₹{transfers.reduce((sum, t) => sum + t.cost, 0).toLocaleString("en-IN")}</strong></div>
              </div>
              <TransferCards items={filteredTransfers} onReview={handleReview} />
            </>
          )}

          {activePage === "Route Map" && (
            <>
              <div className="page-heading"><div><div className="eyebrow">TRANSPORT PLANNING</div><h1>Route explorer</h1><p>{pageDescriptions["Route Map"]}</p></div><span className="demo-pill"><span /> ILLUSTRATIVE</span></div>
              <section className="panel route-map-panel"><div className="panel-header"><div><h2>Hospital distribution network</h2><p>Illustrative positions only — not a live geographic map</p></div></div><MapPanel full /></section>
              <div className="section-heading"><h2>Example route options</h2><p>Sample figures for interface demonstration, not live routing estimates.</p></div>
              <div className="route-options">
                {transfers.map((transfer) => <article className="route-option" key={transfer.id}><div className="route-option-top"><span className="route-option-icon">⌖</span><Status value={transfer.status} /></div><strong>{transfer.from}</strong><div className="route-arrow">↓ {transfer.distance} km · {transfer.time}</div><strong>{transfer.to}</strong><div className="route-cost"><span>Estimated demo cost</span><strong>₹{transfer.cost}</strong></div></article>)}
              </div>
            </>
          )}

          {activePage === "Reports" && (
            <>
              <div className="page-heading"><div><div className="eyebrow">ANALYTICS & EXPORTS</div><h1>Reports</h1><p>{pageDescriptions.Reports}</p></div><button className="button button-primary" onClick={exportReport}>↓ Download inventory CSV</button></div>
              <div className="report-grid">
                <section className="panel report-card"><div className="report-icon blue">▤</div><h2>Inventory report</h2><p>Export hospital, medicine, stock, demand, safety stock, expiry and status fields as a CSV file.</p><button className="button button-outline" onClick={exportReport}>Export inventory →</button></section>
                <section className="panel report-card"><div className="report-icon green">⇄</div><h2>Transfer overview</h2><p>{transfers.length} sample recommendations with a combined illustrative transport cost of ₹{transfers.reduce((sum, t) => sum + t.cost, 0).toLocaleString("en-IN")}.</p><button className="button button-outline" onClick={() => navigate("Redistribution")}>Review transfers →</button></section>
              </div>
              <section className="panel full-table-panel"><div className="panel-header"><div><h2>Expiry watchlist</h2><p>Sample stock records expiring within 30 days</p></div></div><InventoryTable items={inventory.filter((item) => item.expiry <= 30)} /></section>
            </>
          )}

          <footer className="app-footer"><span>© 2026 MediShare AI</span><span><i /> Frontend demo · Backend integration pending</span></footer>
        </div>
      </main>

      {selectedTransfer && (
        <div className="modal-backdrop" onClick={() => setSelectedTransfer(null)}>
          <section className="review-modal" role="dialog" aria-modal="true" aria-labelledby="review-title" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top"><div className="modal-icon">⇄</div><button className="icon-button" onClick={() => setSelectedTransfer(null)} aria-label="Close dialog">×</button></div>
            <div className="eyebrow">TRANSFER REVIEW · {selectedTransfer.id}</div>
            <h2 id="review-title">Review recommendation</h2>
            <p className="modal-description">Check the sample transfer details before changing its demo status.</p>
            <div className="review-details">
              <div><span>Source hospital</span><strong>{selectedTransfer.from}</strong></div>
              <div><span>Destination hospital</span><strong>{selectedTransfer.to}</strong></div>
              <div><span>Medicine</span><strong>{selectedTransfer.medicine}</strong></div>
              <div><span>Proposed quantity</span><strong>{selectedTransfer.quantity} units</strong></div>
              <div><span>Illustrative route</span><strong>{selectedTransfer.distance} km · {selectedTransfer.time}</strong></div>
              <div><span>Illustrative transport cost</span><strong>₹{selectedTransfer.cost}</strong></div>
            </div>
            <div className="modal-warning">Demo only: these actions do not dispatch medicines, reserve stock or contact hospitals. Validate clinical, expiry, cold-chain and regulatory requirements before any real transfer.</div>
            <div className="modal-actions"><button className="button button-outline" onClick={() => updateTransfer("Rejected in demo")}>Reject</button><button className="button button-primary" onClick={() => updateTransfer("Approved in demo")}>Approve in demo</button></div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
