// Sidebar with filters + filter summary

function Sidebar({ data, filters, setFilters, totalFiltered }) {
  const industries = Object.entries(data.by_industry)
    .filter(([, v]) => v.total > 0)
    .sort((a, b) => b[1].total - a[1].total);
  const sizes = [
    ["micro", "Micro · 1–10"],
    ["small", "Small · 11–50"],
    ["medium", "Medium · 51–500"],
    ["large", "Large · 500+"],
  ];
  const stages = ["Unfunded", "Seed", "Series A", "Series B", "Series C", "Series D", "Public"];

  const setOne = (key, val) => setFilters({ ...filters, [key]: filters[key] === val ? null : val });
  const clear = () => setFilters({ industry: null, size: null, stage: null, theme: null });
  const colors = window.SCALEME_THEME.industries;

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <aside className="sidebar">
      <div className="filter-summary">
        <div className="filter-summary-num tabular">{totalFiltered.toLocaleString()}</div>
        <div className="filter-summary-label">Companies in view</div>
      </div>

      <div className="side-group">
        <div className="side-title">
          <span>Filter</span>
          {activeCount > 0 && (
            <button className="side-clear" onClick={clear}>Clear all</button>
          )}
        </div>
      </div>

      <div className="side-group">
        <div className="side-title">Industry</div>
        <div className="side-list">
          {industries.map(([name, v]) => (
            <button
              key={name}
              className={"side-item" + (filters.industry === name ? " active" : "")}
              onClick={() => setOne("industry", name)}
            >
              <span className="side-item-dot" style={{ background: colors[name] || "#888" }}></span>
              <span className="side-item-label">{name}</span>
              <span className="side-item-count">{v.total.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="side-group">
        <div className="side-title">Company size</div>
        <div className="side-list">
          {sizes.map(([k, label]) => (
            <button
              key={k}
              className={"side-item" + (filters.size === k ? " active" : "")}
              onClick={() => setOne("size", k)}
            >
              <span className="side-item-label">{label}</span>
              <span className="side-item-count">{data.by_size[k].total.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="side-group">
        <div className="side-title">Funding stage</div>
        <div className="side-list">
          {stages.map((s) => (
            <button
              key={s}
              className={"side-item" + (filters.stage === s ? " active" : "")}
              onClick={() => setOne("stage", s)}
            >
              <span className="side-item-label">{s}</span>
              <span className="side-item-count">{(data.by_stage[s] || 0).toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

Object.assign(window, { Sidebar });
