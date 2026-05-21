// Section 08 — Sector × Stage Heatmap
// 11 industries × 8 stages. Cell color intensity is row-relative (each industry on its own scale).

function SectorStageHeatmap({ data, filters, setFilters }) {
  const stages = data.heatmap_stages || ["Unfunded", "Seed", "Funding Raised", "Series A", "Series B", "Series C", "Series D+", "Public/Acquired"];
  const matrix = data.sector_stage_matrix || {};
  const colors = window.SCALEME_THEME.industries;

  const industries = Object.keys(matrix).filter(ind => {
    return Object.values(matrix[ind] || {}).some(v => v > 0);
  });

  // Insights — derive from the matrix
  const insight = useMemo(() => {
    const seedHeavy = industries
      .map(ind => ({ ind, seed: matrix[ind].Seed || 0, total: Object.values(matrix[ind]).reduce((s, v) => s + v, 0) }))
      .sort((a, b) => b.seed - a.seed)[0];
    const seriesAHeavy = industries
      .map(ind => ({ ind, a: matrix[ind]["Series A"] || 0 }))
      .sort((a, b) => b.a - a.a)[0];
    const publicHeavy = industries
      .map(ind => ({ ind, p: matrix[ind]["Public/Acquired"] || 0 }))
      .sort((a, b) => b.p - a.p)[0];
    return { seedHeavy, seriesAHeavy, publicHeavy };
  }, [matrix, industries]);

  const cellClick = (ind, stage) => {
    setFilters({
      ...filters,
      industry: filters.industry === ind ? null : ind,
      stage:    filters.stage === stage ? null : stage,
    });
  };

  const isActiveCell = (ind, stage) => filters.industry === ind && filters.stage === stage;

  return (
    <section className="section" id="heatmap">
      <span className="section-num">08 / Sector × Stage</span>
      <div className="shell">
        <div className="section-head">
          <div>
            <span className="eyebrow">08 — Where industries cluster</span>
          </div>
          <p className="lede">
            Each industry's distribution across the funding stack. Cell shade is row-relative —
            the darkest cell in any row tells you that industry's centre of gravity.
            Click a cell to filter the dashboard.
          </p>
        </div>

        <div className="card card-pad">
          <div className="card-head">
            <div>
              <div className="card-title">Companies by industry × stage</div>
              <div className="card-sub">11 industries × 8 stages · {data.kpis.total_companies.toLocaleString()} total · deadpooled excluded</div>
            </div>
          </div>

          <div style={{overflowX: "auto"}}>
            <div className="heatmap" style={{minWidth: 880}}>
              <div className="heatmap-head row">Industry</div>
              {stages.map(s => (
                <div key={s} className="heatmap-head">{s}</div>
              ))}

              {industries.map(ind => {
                const row = matrix[ind];
                const rowMax = Math.max(...stages.map(s => row[s] || 0), 1);
                const color = colors[ind] || "#888";
                return (
                  <React.Fragment key={ind}>
                    <div className="heatmap-row-label">
                      <span className="dot" style={{background: color}}></span>
                      <span style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{ind}</span>
                    </div>
                    {stages.map(s => {
                      const v = row[s] || 0;
                      const intensity = v / rowMax;
                      const empty = v === 0;
                      return (
                        <div
                          key={ind + ":" + s}
                          className={"heatmap-cell" + (empty ? " empty" : "") + (isActiveCell(ind, s) ? " active" : "")}
                          style={{
                            background: empty ? "transparent" : `color-mix(in srgb, ${color} ${Math.round(20 + intensity * 80)}%, var(--surface))`,
                            color: empty ? undefined : (intensity > 0.5 ? "#fff" : "var(--fg)"),
                          }}
                          onClick={() => !empty && cellClick(ind, s)}
                          title={`${ind} · ${s}: ${v}`}
                        >
                          {empty ? "·" : v.toLocaleString()}
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="heatmap-legend">
            <span>Low</span>
            <span className="heatmap-legend-scale">
              <span style={{background: "color-mix(in srgb, var(--accent) 20%, var(--surface))"}}></span>
              <span style={{background: "color-mix(in srgb, var(--accent) 40%, var(--surface))"}}></span>
              <span style={{background: "color-mix(in srgb, var(--accent) 60%, var(--surface))"}}></span>
              <span style={{background: "color-mix(in srgb, var(--accent) 80%, var(--surface))"}}></span>
              <span style={{background: "var(--accent)"}}></span>
            </span>
            <span>High</span>
            <span style={{marginLeft: 14, color: "var(--fg-faint)"}}>· Shading is row-relative</span>
          </div>

          {insight.seedHeavy && (
            <div className="heatmap-note">
              <div style={{minWidth: 80, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", paddingTop: 2}}>Insight</div>
              <div style={{flex: 1}}>
                <strong>Seed-heavy:</strong> {insight.seedHeavy.ind} ({insight.seedHeavy.seed} of {insight.seedHeavy.total} non-deadpooled at Seed).&nbsp;&nbsp;
                <strong>Series-A-heavy:</strong> {insight.seriesAHeavy.ind} ({insight.seriesAHeavy.a} Series-A rounds).&nbsp;&nbsp;
                <strong>Public-heavy:</strong> {insight.publicHeavy.ind} ({insight.publicHeavy.p} listings — defence and aerospace).
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { SectorStageHeatmap });
