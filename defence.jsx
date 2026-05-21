// Section 09 — Spotlight: Defence & Deeptech
// Hyderabad's understated story — frame as a facet, not a separate industry.

function DefenceSection({ data }) {
  const d = data.defence_spotlight || { company_count: 0, ipo_count: 0, total_raised: 0, top10_funded: [], ipo_years: [] };
  const max = Math.max(...(d.top10_funded || [1]));

  // IPO timeline range
  const years = d.ipo_years || [];
  const minY = years.length ? Math.min(...years) : 2005;
  const maxY = years.length ? Math.max(...years) : 2025;
  const span = Math.max(maxY - minY, 1);
  const tickYears = [];
  for (let y = Math.floor(minY / 5) * 5; y <= maxY; y += 5) tickYears.push(y);

  return (
    <section className="section" id="defence">
      <span className="section-num">09 / Defence</span>
      <div className="shell">
        <div className="section-head">
          <div>
            <span className="eyebrow">09 — Spotlight</span>
          </div>
          <p className="lede">
            Better known for software, Hyderabad quietly hosts one of India's densest
            concentrations of defence, aerospace, and dual-use deep-tech companies.
            Defence is a <em style={{fontStyle: "normal", color: "var(--fg)"}}>facet</em> of DeepTech &amp; Emerging in the main view — surfaced here in full.
          </p>
        </div>

        <div className="card card-pad">
          <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, marginBottom: 32, borderBottom: "1px solid var(--border)", paddingBottom: 24}}>
            <DefStat label="Defence / aerospace companies" value={d.company_count.toLocaleString()} sub="Aerospace, defence, drones, semis" accent />
            <DefStat label="Capital raised" value={"$" + (d.total_raised / 1e6).toFixed(0) + "M"} sub="Across disclosed rounds" accent />
            <DefStat label="Publicly listed" value={d.ipo_count} sub={`Of ${data.kpis.public_companies} total IPO companies in dataset`} accent last />
          </div>

          <div style={{display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 32}}>
            <div>
              <div className="mono" style={{fontSize: 10, letterSpacing: "0.14em", color: "var(--fg-muted)", textTransform: "uppercase", marginBottom: 12}}>
                Top 10 defence/aerospace · disclosed funding (anonymised)
              </div>
              <div className="def-bars">
                {(d.top10_funded || []).map((amt, i) => (
                  <div key={i} className="def-bar" style={{ height: ((amt / max) * 100) + "%" }} title={"$" + (amt / 1e6).toFixed(1) + "M"}>
                    <span className="rank">#{i + 1}</span>
                  </div>
                ))}
              </div>
              <div style={{marginTop: 26, fontSize: 12, color: "var(--fg-muted)"}}>
                The top company alone raised <strong style={{color: "var(--fg)"}}>${(d.top10_funded[0] / 1e6).toFixed(0)}M</strong> —
                more than the next four combined. Company names are licensed; ranks shown.
              </div>
            </div>

            <div>
              <div className="mono" style={{fontSize: 10, letterSpacing: "0.14em", color: "var(--fg-muted)", textTransform: "uppercase", marginBottom: 12}}>
                IPO timeline · {minY}–{maxY}
              </div>
              <div className="ipo-strip">
                <div className="ipo-axis"></div>
                {years.map((y, i) => {
                  const left = ((y - minY) / span) * 100;
                  return (
                    <div key={i} className="ipo-event" style={{ left: left + "%" }} data-year={y}></div>
                  );
                })}
                {tickYears.map(y => (
                  <span key={y} className="ipo-tick-year" style={{ left: ((y - minY) / span) * 100 + "%" }}>{y}</span>
                ))}
              </div>
              <div style={{marginTop: 36, fontSize: 13, color: "var(--fg-2)", lineHeight: 1.55}}>
                Seven of the dataset's {data.kpis.public_companies} publicly listed companies operate in defence,
                aerospace, or strategic electronics. That's a {Math.round(d.ipo_count / data.kpis.public_companies * 100)}% share of
                public-market exits from {Math.round(d.company_count / data.kpis.total_companies * 1000) / 10}% of the company base —
                a disproportionate translation of R&amp;D into capital-markets outcomes.
              </div>
              <div style={{marginTop: 18, padding: "12px 14px", background: "var(--surface-2)", borderRadius: 8, fontSize: 12, color: "var(--fg-2)", borderLeft: "2px solid var(--accent-line)"}}>
                Read alongside Section 08: DeepTech &amp; Emerging is the only industry in the dataset where the
                "Public/Acquired" cell is the second-largest, after Unfunded.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DefStat({ label, value, sub, accent, last }) {
  return (
    <div style={{padding: "0 24px", borderRight: last ? "0" : "1px solid var(--border)"}}>
      <div className="mono" style={{fontSize: 10, letterSpacing: "0.14em", color: "var(--fg-muted)", textTransform: "uppercase", marginBottom: 12}}>{label}</div>
      <div className="serif tabular" style={{fontSize: 42, lineHeight: 1, color: accent ? "var(--accent)" : "var(--fg)"}}>{value}</div>
      {sub && <div className="mono" style={{fontSize: 11, color: "var(--fg-faint)", marginTop: 10, letterSpacing: "0.02em"}}>{sub}</div>}
    </div>
  );
}

Object.assign(window, { DefenceSection });
