// Request access form + footer

function RequestSection({ filters, setFilters }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", org: "", role: "investor", purpose: "" });

  const removeFilter = (key) => setFilters({ ...filters, [key]: null });
  const activeFilters = Object.entries(filters).filter(([, v]) => v);

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="section" id="request">
      <span className="section-num">07 / Access</span>
      <div className="shell">
        <div className="request-card">
          <div className="request-grid">
            <div>
              <span className="eyebrow">07 — Get the dataset</span>
              <h3 style={{marginTop: 16}}>Request the underlying<br/>company-level data.</h3>
              <p className="lede">
                Aggregate stats are public. Company-level records — names, revenue, funding rounds,
                contacts — are licensed. Tell us what you're solving and we'll route the right
                tier within 48 hours.
              </p>

              {activeFilters.length > 0 && (
                <div className="active-chips">
                  <span className="active-chips-label">Your view:</span>
                  {activeFilters.map(([key, val]) => (
                    <span key={key} className="chip-active">
                      <span style={{color: "var(--fg-muted)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em"}}>{key}</span>
                      <strong>{String(val)}</strong>
                      <span className="x" onClick={() => removeFilter(key)} title="Remove">×</span>
                    </span>
                  ))}
                </div>
              )}

              <div style={{marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24}}>
                <div>
                  <div className="mono" style={{fontSize: 10, letterSpacing: "0.14em", color: "var(--fg-muted)", textTransform: "uppercase", marginBottom: 6}}>Response time</div>
                  <div className="serif" style={{fontSize: 24}}>&lt; 48h</div>
                </div>
                <div>
                  <div className="mono" style={{fontSize: 10, letterSpacing: "0.14em", color: "var(--fg-muted)", textTransform: "uppercase", marginBottom: 6}}>Tiers</div>
                  <div className="serif" style={{fontSize: 24}}>Free / Pro / API</div>
                </div>
              </div>
            </div>

            <div>
              {!submitted ? (
                <form onSubmit={submit}>
                  <div className="field-row">
                    <div className="field">
                      <label>Name</label>
                      <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Anjali Reddy" />
                    </div>
                    <div className="field">
                      <label>Work email</label>
                      <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="anjali@firm.com" />
                    </div>
                  </div>
                  <div className="field">
                    <label>Organisation</label>
                    <input type="text" value={form.org} onChange={e => setForm({...form, org: e.target.value})} placeholder="Lightspeed India" />
                  </div>
                  <div className="field">
                    <label>I am a…</label>
                    <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                      <option value="investor">Investor / VC</option>
                      <option value="operator">Founder / Operator</option>
                      <option value="researcher">Analyst / Researcher</option>
                      <option value="press">Press</option>
                      <option value="govt">Government / Policy</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>What are you trying to do?</label>
                    <textarea value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})} placeholder="Sourcing seed deals in Healthcare AI · Building a market map for IndiaQuant · etc." />
                  </div>
                  <button type="submit" className="cta cta-accent" style={{width: "100%", justifyContent: "center", padding: "13px"}}>
                    Request access →
                  </button>
                  <div style={{textAlign: "center", marginTop: 12, fontSize: 11, color: "var(--fg-muted)"}}>
                    By submitting you agree to ScaleMe's data use policy.
                  </div>
                </form>
              ) : (
                <div style={{padding: 32, textAlign: "center"}}>
                  <div style={{display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent)", marginBottom: 18}}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <h4 className="serif" style={{fontSize: 28, fontWeight: 400, marginBottom: 12}}>Got it. We're on it.</h4>
                  <p style={{color: "var(--fg-2)", maxWidth: 320, margin: "0 auto"}}>
                    A team member will route you the right tier within 48 hours at <strong style={{color: "var(--fg)"}}>{form.email || "your email"}</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const data = window.SCALEME_DATA;
  return (
    <footer className="foot">
      <div className="shell">
        <div className="foot-grid">
          <div>
            <div className="brand" style={{marginBottom: 16}}>
              <span className="brand-mark"></span>
              <strong>ScaleMe</strong>
              <span className="brand-loc">Hyderabad / startup ecosystem</span>
            </div>
            <p style={{maxWidth: 380, fontSize: 13, lineHeight: 1.55}}>
              Hand-classified, source-linked startup data for Hyderabad's business ecosystem.
              Every company mapped, every theme tagged.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><a href="#overview">Overview</a></li>
              <li><a href="#industries">Industries</a></li>
              <li><a href="#size">Company Scale</a></li>
              <li><a href="#themes">Themes</a></li>
            </ul>
          </div>
          <div>
            <h4>Ecosystem snapshot</h4>
            <ul style={{listStyle: "none", padding: 0}}>
              <li style={{marginBottom: 6, fontSize: 13, color: "var(--fg-2)"}}>
                <span style={{color: "var(--fg-muted)", marginRight: 6}}>Companies</span>
                <strong style={{color: "var(--fg)"}}>{data.kpis.total_companies.toLocaleString()}</strong>
              </li>
              <li style={{marginBottom: 6, fontSize: 13, color: "var(--fg-2)"}}>
                <span style={{color: "var(--fg-muted)", marginRight: 6}}>Active</span>
                <strong style={{color: "var(--fg)"}}>{data.kpis.active_companies.toLocaleString()}</strong>
              </li>
              <li style={{marginBottom: 6, fontSize: 13, color: "var(--fg-2)"}}>
                <span style={{color: "var(--fg-muted)", marginRight: 6}}>Capital raised</span>
                <strong style={{color: "var(--fg)"}}>${(data.kpis.total_funding_usd / 1e9).toFixed(1)}B</strong>
              </li>
              <li style={{fontSize: 13, color: "var(--fg-2)"}}>
                <span style={{color: "var(--fg-muted)", marginRight: 6}}>Industries</span>
                <strong style={{color: "var(--fg)"}}>{data.kpis.industries_covered}</strong>
              </li>
            </ul>
          </div>
          <div>
            <h4>About</h4>
            <ul>
              <li><a href="#">Methodology</a></li>
              <li><a href="#">Classification taxonomy</a></li>
              <li><a href="#">Changelog</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 ScaleMe Research · Hyderabad Startup Ecosystem</span>
          <span>Aggregate statistics shown publicly · individual records under license</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { RequestSection, Footer });
