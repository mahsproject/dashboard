// Topbar + Hero + KPI strip + Year scrubber + Search

function Topbar({ themeMode, setThemeMode, search, setSearch, data, applyFilter }) {
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
        <a href="#investors">Investors</a>
        <a href="#themes">Themes</a>
      </nav>
      <div className="top-actions">
        <SearchBox search={search} setSearch={setSearch} data={data} applyFilter={applyFilter} />
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
      </div>
    </header>
  );
}

function SearchBox({ search, setSearch, data, applyFilter }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef(null);

  // Build searchable corpus once
  const corpus = useMemo(() => {
    const items = [];
    Object.entries(data.by_industry).forEach(([name, v]) =>
      items.push({ kind: "industry", name, count: v.total, key: "industry" })
    );
    Object.entries(data.by_themes).forEach(([name, count]) =>
      items.push({ kind: "theme", name, count, key: "theme" })
    );
    Object.entries(data.by_industry_subsectors).forEach(([ind, subs]) => {
      Object.entries(subs).forEach(([name, count]) =>
        items.push({ kind: "sub-sector", name, count, key: null, industry: ind })
      );
    });
    return items;
  }, [data]);

  const q = (search || "").trim().toLowerCase();
  const results = useMemo(() => {
    if (!q) return [];
    return corpus
      .filter(it => it.name.toLowerCase().includes(q))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [q, corpus]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const onPick = (it) => {
    if (it.kind === "industry") applyFilter({ industry: it.name });
    else if (it.kind === "theme") applyFilter({ theme: it.name });
    else if (it.kind === "sub-sector") applyFilter({ industry: it.industry });
    setSearch("");
    setOpen(false);
  };

  return (
    <div className="search-box" ref={ref}>
      <span className="search-icon" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
        </svg>
      </span>
      <input
        type="text"
        className="search-input"
        placeholder="Search industries, themes…"
        value={search}
        onFocus={() => setOpen(true)}
        onChange={e => { setSearch(e.target.value); setOpen(true); setActive(0); }}
        onKeyDown={e => {
          if (!open) return;
          if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
          else if (e.key === "Enter" && results[active]) onPick(results[active]);
          else if (e.key === "Escape") setOpen(false);
        }}
      />
      {open && q && (
        <div className="search-results">
          {results.length === 0 ? (
            <div className="search-result-empty">No matches for "{q}"</div>
          ) : (
            results.map((it, i) => (
              <div key={it.kind + ":" + it.name}
                className={"search-result-item" + (i === active ? " active" : "")}
                onMouseEnter={() => setActive(i)}
                onMouseDown={() => onPick(it)}>
                <span>{it.name}</span>
                <span style={{display: "flex", gap: 10, alignItems: "center"}}>
                  <span className="cnt">{it.count.toLocaleString()}</span>
                  <span className="kind">{it.kind}</span>
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function Hero({ kpis, heroMode, industryFilter, sizeFilter, stageFilter, themeFilter,
  totalFiltered, yearRange, setYearRange, fullYearRange, data }) {
  const totalDisplay = useCountUp(totalFiltered, 1600, [totalFiltered]);
  const isYearScoped = yearRange && (yearRange.start !== fullYearRange.start || yearRange.end !== fullYearRange.end);
  return (
    <section className="hero">
      <div className="hero-glow" aria-hidden="true"></div>
      <div className="hero-bg">
        <HeroCanvas mode={heroMode} />
      </div>
      <div className="shell hero-inner">
        <div className="hero-meta">
          <div className="hero-meta-row">
            <span><span className="live-dot"></span>Live · {data.metadata.export_date}</span>
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
          {isYearScoped ? (
            <>Companies founded between <strong style={{color: "var(--fg)"}}>{yearRange.start}–{yearRange.end}</strong>. A classification-grade view by sector, stage, status, and capital.</>
          ) : (
            <>A classification-grade view of Hyderabad's startup ecosystem by sector, stage, status, and funding. Every company mapped, every theme tagged. Built for investors, operators, and policy.</>
          )}
        </p>
        <div className="hero-actions rise" style={{animationDelay: "0.2s"}}>
          <a href="#industries" className="cta cta-accent">Explore the data →</a>
        </div>

        <YearScrubber
          range={yearRange}
          setRange={setYearRange}
          full={fullYearRange}
          byYear={data.by_year}
        />

        <KPIStrip kpis={kpis} byYear={data.by_year} />
      </div>
    </section>
  );
}

function YearScrubber({ range, setRange, full, byYear }) {
  const railRef = useRef(null);
  const [drag, setDrag] = useState(null); // 'start' | 'end' | null
  const span = full.end - full.start;
  const startPct = ((range.start - full.start) / span) * 100;
  const endPct   = ((range.end   - full.start) / span) * 100;

  const setFromClientX = (clientX, which) => {
    const rail = railRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rail.left) / rail.width));
    const yr = Math.round(full.start + pct * span);
    setRange(prev => {
      if (which === "start") return { start: Math.min(yr, prev.end), end: prev.end };
      return { start: prev.start, end: Math.max(yr, prev.start) };
    });
  };

  useEffect(() => {
    if (!drag) return;
    const move = (e) => setFromClientX(e.touches ? e.touches[0].clientX : e.clientX, drag);
    const up = () => setDrag(null);
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  }, [drag]);

  const years = [];
  for (let y = full.start; y <= full.end; y++) years.push(y);

  const isFull = range.start === full.start && range.end === full.end;
  const reset = () => setRange({ start: full.start, end: full.end });

  return (
    <div className="scrubber rise" style={{animationDelay: "0.25s"}}>
      <div className="scrubber-meta">
        <span>Founding-year filter · <strong>{range.start} — {range.end}</strong></span>
        <span className={"scrubber-reset" + (isFull ? " disabled" : "")} onClick={reset}>
          {isFull ? "All years 2012–2025" : "Reset"}
        </span>
      </div>
      <div className="scrubber-track" ref={railRef}>
        <div className="scrubber-rail"></div>
        <div className="scrubber-range" style={{left: startPct + "%", width: (endPct - startPct) + "%"}}></div>
        <div className="scrubber-ticks">
          {years.map((y, i) => (
            <div key={y} className={"scrubber-tick" + (y % 5 === 0 ? " major" : "")}>
              {y % 5 === 0 && <span className="lbl">'{String(y).slice(2)}</span>}
            </div>
          ))}
        </div>
        <div className="scrubber-handle"
          style={{left: startPct + "%"}}
          onMouseDown={(e) => { e.preventDefault(); setDrag("start"); }}
          onTouchStart={(e) => { e.preventDefault(); setDrag("start"); }}
        ></div>
        <div className="scrubber-handle"
          style={{left: endPct + "%"}}
          onMouseDown={(e) => { e.preventDefault(); setDrag("end"); }}
          onTouchStart={(e) => { e.preventDefault(); setDrag("end"); }}
        ></div>
      </div>
    </div>
  );
}

function KPIStrip({ kpis, byYear }) {
  const total = useCountUp(kpis.total_companies);
  const active = useCountUp(kpis.active_companies);
  const funded = useCountUp(kpis.funded_companies);
  const fundingB = useCountUp(kpis.total_funding_usd / 1e9, 1400);
  const unicorns = useCountUp(kpis.unicorns_soonicorns);
  const industries = useCountUp(kpis.industries_covered);

  // Build last-5-years sparkline arrays from by_year
  const yearKeys = Object.keys(byYear).sort();
  const last5 = yearKeys.slice(-5);
  const sparkTotal  = last5.map(y => byYear[y].total);
  const sparkActive = last5.map(y => byYear[y].active);
  const sparkFunded = last5.map(y => byYear[y].funded);
  const sparkCum    = last5.map(y => byYear[y].cumulative_funded);

  const items = [
    { label: "Total companies",      val: Math.round(total).toLocaleString(),
      foot: <><span className="up">↑ {kpis.yoy_growth_pct}%</span> YoY</>,
      spark: sparkTotal },
    { label: "Active",               val: Math.round(active).toLocaleString(),
      foot: <>{((kpis.active_companies/kpis.total_companies)*100).toFixed(1)}% of total</>,
      spark: sparkActive },
    { label: "Funded",               val: Math.round(funded).toLocaleString(),
      foot: <>{((kpis.funded_companies/kpis.total_companies)*100).toFixed(1)}% of total</>,
      spark: sparkFunded, accentSpark: true },
    { label: "Total capital raised", val: "$" + fundingB.toFixed(2), suffix: "B", accent: true,
      foot: <>across {kpis.funded_companies.toLocaleString()} companies · {kpis.disclosed_funded || 499} disclosed</>,
      spark: sparkCum, accentSpark: true },
    { label: "Unicorns + soonicorns", val: Math.round(unicorns), accent: true,
      foot: <>1 unicorn · 5 soonicorns · 70 minicorns</> },
    { label: "Industries covered",    val: Math.round(industries),
      foot: <>+ 1 unclassified bucket</> },
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
          {it.spark && (
            <div className={"kpi-spark" + (it.accentSpark ? " accent" : "")}>
              <Sparkline data={it.spark} width={80} height={12} stroke="currentColor" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { Topbar, Hero, KPIStrip, YearScrubber, SearchBox });
