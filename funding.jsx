// Theme cloud

function ThemeSection({ data, filters, setFilters }) {
  const themes = Object.entries(data.by_themes).sort((a, b) => b[1] - a[1]);
  const max = themes[0][1];
  const min = themes[themes.length - 1][1];

  const setTheme = (name) => setFilters({ ...filters, theme: filters.theme === name ? null : name });

  return (
    <section className="section" id="themes">
      <span className="section-num">06 / Themes</span>
      <div className="shell">
        <div className="section-head">
          <div>
            <span className="eyebrow">06 — Trending themes</span>
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

Object.assign(window, { ThemeSection });
