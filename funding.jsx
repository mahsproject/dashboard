// Funding funnel + capital concentration + theme cloud

function FundingSection({ data, funnelStyle = "stepped" }) {
  return (
    <section className="section" id="capital">
      <span className="section-num">05 / Capital</span>
      <div className="shell">
        <div className="section-head">
          <div>
            <span className="eyebrow">05 — Capital concentration</span>
          </div>
          <p className="lede">
            Of {data.kpis.total_companies.toLocaleString()} companies, {data.kpis.funded_companies.toLocaleString()} raised — but only {data.kpis.disclosed_funded.toLocaleString()} disclosed amounts.
            Capital is brutally concentrated at the top of the list.
          </p>
        </div>

        <CapitalConcentration data={data} />
      </div>
    </section>
  );
}

function CapitalConcentration({ data }) {
  const buckets = data.concentration || [];
  const denom = data.concentration_denominator || 499;

  return (
    <div className="card card-pad">
      <div className="card-head">
        <div>
          <div className="card-title">Capital concentration</div>
          <div className="card-sub">
            Top-N companies by disclosed funding · across {denom} companies with disclosed round amounts
          </div>
        </div>
      </div>

      {buckets.map((b, i) => (
        <div key={i} style={{padding: "16px 0", borderBottom: i < buckets.length - 1 ? "1px solid var(--border)" : "0"}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8}}>
            <span style={{fontSize: 14, color: "var(--fg)"}}>
              <strong style={{fontWeight: 600}}>{b.label}</strong>
              <span style={{color: "var(--fg-muted)", marginLeft: 8, fontSize: 12}}>({b.count} companies)</span>
            </span>
            <span className="mono tabular" style={{fontSize: 16, color: "var(--accent)"}}>
              {b.share_pct}% <span style={{color: "var(--fg-faint)", fontSize: 11}}>of capital</span>
            </span>
          </div>
          <div style={{height: 8, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden"}}>
            <div style={{height: "100%", width: b.share_pct + "%", background: "var(--accent)", borderRadius: 999, opacity: 0.85, transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)"}}></div>
          </div>
        </div>
      ))}

      <div style={{marginTop: 18, padding: 14, background: "var(--surface-2)", borderRadius: 8, fontSize: 12, color: "var(--fg-2)", lineHeight: 1.55}}>
        <strong style={{color: "var(--fg)"}}>{data.kpis.unicorns_soonicorns} unicorns, soonicorns &amp; minicorns</strong> account for most of the ${(data.kpis.total_funding_usd / 1e9).toFixed(2)}B raised.
        The remaining {(data.kpis.funded_companies - denom).toLocaleString()} funded companies have $0 disclosed — they raised but
        the round size isn't public. Capital is highly concentrated either way.
      </div>
      <div style={{marginTop: 10, fontSize: 10, color: "var(--fg-faint)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em"}}>
        Unicorn / soonicorn / minicorn are now generic industry terms for $1B+, $500M–$1B, and $100M+ private-market valuations.
      </div>
    </div>
  );
}

function ThemeSection({ data, filters, setFilters }) {
  const themes = Object.entries(data.by_themes).sort((a, b) => b[1] - a[1]);
  const max = themes[0][1];
  const min = themes[themes.length - 1][1];

  const setTheme = (name) => setFilters({ ...filters, theme: filters.theme === name ? null : name });

  return (
    <section className="section" id="themes">
      <span className="section-num">11 / Themes</span>
      <div className="shell">
        <div className="section-head">
          <div>
            <span className="eyebrow">11 — Trending themes</span>
            <h2 style={{marginTop: 14}}>What founders are actually building.</h2>
          </div>
          <p className="lede">
            Hand-tagged trending themes from the latest classification pass. Click any theme
            to scope the dataset.
          </p>
        </div>

        <div className="card card-pad">
          <div className="theme-cloud">
            {themes.map(([name, count]) => {
              const scale = 0.5 + ((count - min) / (max - min)) * 1.5;
              const fontSize = Math.round(13 * scale);
              return (
                <button
                  key={name}
                  className={"theme-bubble" + (filters.theme === name ? " active" : "")}
                  onClick={() => setTheme(name)}
                  style={{fontSize}}
                >
                  {name}
                  <span className="count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { FundingSection, ThemeSection, CapitalConcentration });
