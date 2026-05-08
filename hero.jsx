// Topbar + Hero + KPI strip

function Topbar({ themeMode, setThemeMode }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true"></span>
        <span><strong style={{fontWeight: 600}}>ScaleMe</strong></span>
        <span className="brand-loc">2026.Q1</span>
      </div>
      <nav className="topnav">
        <a href="#overview" className="active">Overview</a>
        <a href="#industries">Industries</a>
        <a href="#growth">Growth</a>
        <a href="#funding">Funding</a>
        <a href="#themes">Themes</a>
      </nav>
      <div className="top-actions">
        <button
          className="icon-btn"
          aria-label="Toggle theme"
          onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
          title={themeMode === "dark" ? "Switch to light" : "Switch to dark"}
        >
          {themeMode === "dark" ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
        <a href="#request" className="cta">Request data access →</a>
      </div>
    </header>
  );
}

function Hero({ kpis, heroMode, industryFilter, sizeFilter, stageFilter, themeFilter, totalFiltered }) {
  const totalDisplay = useCountUp(totalFiltered, 1600, [totalFiltered]);
  return (
    <section className="hero">
      <div className="hero-glow" aria-hidden="true"></div>
      <div className="hero-bg">
        <HeroCanvas mode={heroMode} />
      </div>
      <div className="shell hero-inner">
        <div className="hero-meta">
          <div className="hero-meta-row">
            <span><span className="live-dot"></span>Live · {window.SCALEME_DATA.metadata.export_date}</span>
            <span>HYD / Startup Ecosystem</span>
          </div>
          <div className="hero-meta-row">
            <span>HYD-001 / RPT v4.2</span>
          </div>
        </div>

        <h1 className="rise">
          <em>Hyderabad's</em><br/>
          Business Ecosystem —<br/>
          <span className="num">{Math.round(totalDisplay).toLocaleString()}</span> companies.
        </h1>
        <p className="hero-sub rise" style={{animationDelay: "0.1s"}}>
          A classification-grade view of Hyderabad's startup ecosystem by sector, stage, status, and funding. Every company mapped, every theme tagged. Built for investors, operators, and policy.
        </p>
        <div className="hero-actions rise" style={{animationDelay: "0.2s"}}>
          <a href="#industries" className="cta cta-accent">Explore the data →</a>
          <a href="#request" className="cta cta-ghost">Request full dataset</a>
        </div>

        <KPIStrip kpis={kpis} />
      </div>
    </section>
  );
}

function KPIStrip({ kpis }) {
  const total = useCountUp(kpis.total_companies);
  const active = useCountUp(kpis.active_companies);
  const funded = useCountUp(kpis.funded_companies);
  const fundingB = useCountUp(kpis.total_funding_usd / 1e9, 1400);
  const unicorns = useCountUp(kpis.unicorns_soonicorns);
  const industries = useCountUp(kpis.industries_covered);

  const items = [
    { label: "Total companies", val: Math.round(total).toLocaleString(), foot: <><span className="up">↑ {kpis.yoy_growth_pct}%</span> YoY</> },
    { label: "Active", val: Math.round(active).toLocaleString(), foot: <>{((kpis.active_companies/kpis.total_companies)*100).toFixed(1)}% of total</> },
    { label: "Funded", val: Math.round(funded).toLocaleString(), foot: <>{((kpis.funded_companies/kpis.total_companies)*100).toFixed(1)}% of total</> },
    { label: "Total capital raised", val: "$" + fundingB.toFixed(1), suffix: "B", accent: true, foot: <>across {kpis.funded_companies.toLocaleString()} rounds</> },
    { label: "Unicorns + soonicorns", val: Math.round(unicorns), accent: true, foot: <>1 unicorn · 5 soonicorns</> },
    { label: "Industries covered", val: Math.round(industries), foot: <>+ 1 unclassified bucket</> },
  ];

  return (
    <div className="kpi-strip rise" style={{animationDelay: "0.3s"}}>
      {items.map((it, i) => (
        <div className="kpi" key={i}>
          <div className="kpi-label">{it.label}</div>
          <div className={"kpi-value tabular" + (it.accent ? " accent" : "")}>
            {it.val}
            {it.suffix ? <span className="kpi-suffix">{it.suffix}</span> : null}
          </div>
          <div className="kpi-foot">{it.foot}</div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { Topbar, Hero, KPIStrip });
