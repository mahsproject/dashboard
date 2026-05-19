// Growth (timeline area) + Size distribution + Revenue distribution
const { AreaChart, Area, BarChart: RBarChart, Bar: RBar, XAxis: RXAxis, YAxis: RYAxis, CartesianGrid: RGrid, Tooltip: RT, ResponsiveContainer: RC } = window.Recharts;

function GrowthSection({ data, filters }) {
  const years = Object.entries(data.by_year)
    .map(([y, v]) => ({ year: +y, total: v.total, funded: v.funded, active: v.active, cum: v.cumulative_funded }))
    .sort((a,b) => a.year - b.year);

  const peakYear = years.reduce((a, b) => b.total > a.total ? b : a);
  const totalAcrossYears = years.reduce((s, y) => s + y.total, 0);

  return (
    <section className="section" id="growth">
      <span className="section-num">03 / Growth</span>
      <div className="shell">
        <div className="section-head">
          <div>
            <span className="eyebrow">03 — Founding cohort</span>
            <h2 style={{marginTop: 14}}>Hyderabad companies founded since 2020.</h2>
          </div>
          <p className="lede">
            Three years of post-pandemic founding data. 2020 saw the highest formation rate; 2022 reflects the market correction.
          </p>
        </div>

        <div className="card card-pad">
          <div className="card-head">
            <div>
              <div className="card-title">Companies founded by year</div>
              <div className="card-sub">Stack: total founded vs. funded · Peak year: <strong style={{color: "var(--fg)"}}>{peakYear.year}</strong> ({peakYear.total.toLocaleString()})</div>
            </div>
            <div className="chip-row">
              <span className="chip" style={{background: "var(--accent-soft)", color: "var(--accent)", borderColor: "var(--accent-line)"}}>● Total</span>
              <span className="chip">● Funded</span>
            </div>
          </div>

          <div style={{height: 320}}>
            <RC width="100%" height="100%">
              <AreaChart data={years} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="gFunded" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--fg)" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="var(--fg)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <RGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <RXAxis dataKey="year" tick={{fontSize: 10, fill: "var(--fg-muted)"}} axisLine={false} tickLine={false} />
                <RYAxis tick={{fontSize: 10, fill: "var(--fg-muted)"}} axisLine={false} tickLine={false} />
                <RT content={<YearTip />} />
                <Area type="monotone" dataKey="total" stroke="var(--accent)" strokeWidth={2} fill="url(#gTotal)" />
                <Area type="monotone" dataKey="funded" stroke="var(--fg-2)" strokeWidth={1.5} fill="url(#gFunded)" />
              </AreaChart>
            </RC>
          </div>

          <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, marginTop: 28, borderTop: "1px solid var(--border)", paddingTop: 24}}>
            {[
              {l: "Founded (2020–22)", v: totalAcrossYears.toLocaleString()},
              {l: "Funded in period", v: years[years.length - 1].cum.toLocaleString()},
              {l: "Median age", v: "3–5 yr" },
              {l: "Peak year", v: String(peakYear.year) },
            ].map((s, i) => (
              <div key={i} style={{padding: "0 16px", borderRight: i < 3 ? "1px solid var(--border)" : "0"}}>
                <div className="mono" style={{fontSize: 10, letterSpacing: "0.14em", color: "var(--fg-muted)", textTransform: "uppercase", marginBottom: 8}}>{s.l}</div>
                <div className="serif tabular" style={{fontSize: 26, lineHeight: 1}}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function YearTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const total = payload.find(p => p.dataKey === "total")?.value || 0;
  const funded = payload.find(p => p.dataKey === "funded")?.value || 0;
  return (
    <div className="tooltip">
      <div className="tooltip-name">{label}</div>
      <div className="tooltip-row"><span>Founded</span><span className="v">{total.toLocaleString()}</span></div>
      <div className="tooltip-row"><span>Funded</span><span className="v">{funded.toLocaleString()}</span></div>
      <div className="tooltip-row"><span>Funded rate</span><span className="v">{((funded/total)*100).toFixed(0)}%</span></div>
    </div>
  );
}

function SizeRevenueSection({ data }) {
  const sizes = [
    { key: "small",  label: "Small",  range: "11–50 employees" },
    { key: "medium", label: "Medium", range: "51–500" },
    { key: "large",  label: "Large",  range: "500+" },
  ];
  const sizeTotal = sizes.reduce((s, x) => s + data.by_size[x.key].total, 0);

  return (
    <section className="section" id="size">
      <span className="section-num">03 / Scale</span>
      <div className="shell">
        <div className="section-head">
          <div>
            <span className="eyebrow">03 — Company scale</span>
            <h2 style={{marginTop: 14}}>Small but growing — scale drives funding.</h2>
          </div>
          <p className="lede">
            Among companies with reported headcount (2,341 of 12,210), medium and large companies
            fund at significantly higher rates than small ones.
          </p>
        </div>

        <div className="card card-pad">
          <div className="card-head">
            <div>
              <div className="card-title">By company size</div>
              <div className="card-sub">Headcount tiers · funded share within each</div>
            </div>
          </div>
          {sizes.map(s => {
            const v = data.by_size[s.key];
            const fundedPct = (v.funded / v.total) * 100;
            return (
              <div key={s.key} style={{padding: "16px 0", borderBottom: "1px solid var(--border)"}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10}}>
                  <div>
                    <div style={{fontSize: 14, fontWeight: 500}}>{s.label}</div>
                    <div className="mono" style={{fontSize: 11, color: "var(--fg-muted)", marginTop: 2}}>{s.range}</div>
                  </div>
                  <div style={{textAlign: "right"}}>
                    <div className="serif tabular" style={{fontSize: 22, lineHeight: 1}}>{v.total.toLocaleString()}</div>
                    <div className="mono" style={{fontSize: 11, color: "var(--fg-muted)", marginTop: 4}}>
                      {((v.total/sizeTotal)*100).toFixed(1)}% · {fundedPct.toFixed(0)}% funded
                    </div>
                  </div>
                </div>
                <div style={{height: 6, background: "var(--surface-2)", borderRadius: 999, position: "relative", overflow: "hidden"}}>
                  <div style={{height: "100%", width: ((v.total/sizeTotal)*100) + "%", background: "var(--fg-2)", borderRadius: 999}}></div>
                  <div style={{position: "absolute", top: 0, left: 0, height: "100%", width: ((v.funded/sizeTotal)*100) + "%", background: "var(--accent)", borderRadius: 999}}></div>
                </div>
              </div>
            );
          })}
          <div style={{marginTop: 14, display: "flex", gap: 16, fontSize: 11, color: "var(--fg-muted)"}}>
            <span><span style={{display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "var(--accent)", marginRight: 6}}></span>Funded</span>
            <span><span style={{display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "var(--fg-2)", marginRight: 6}}></span>Total</span>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { GrowthSection, SizeRevenueSection });
