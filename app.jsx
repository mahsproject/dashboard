// Main App — wires sections, state, tweaks panel

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "teal",
  "industryChartStyle": "donut",
  "heroMode": "particles",
  "typeScale": "standard",
  "density": "comfortable",
  "compareMode": false
}/*EDITMODE-END*/;

const FULL_YEAR_RANGE = { start: 2012, end: 2025 };

function App() {
  const data = window.SCALEME_DATA;

  // URL-synced state
  const [urlState, setUrlState] = useUrlState({
    industry: null,
    size: null,
    stage: null,
    theme: null,
    year_start: null,
    year_end: null,
    compare: null,
  });

  // Convenience accessors
  const filters = {
    industry: urlState.industry,
    size:     urlState.size,
    stage:    urlState.stage,
    theme:    urlState.theme,
  };
  const setFilters = (next) => {
    setUrlState((s) => ({
      ...s,
      industry: next.industry ?? null,
      size:     next.size     ?? null,
      stage:    next.stage    ?? null,
      theme:    next.theme    ?? null,
    }));
  };

  const yearRange = {
    start: urlState.year_start ? +urlState.year_start : FULL_YEAR_RANGE.start,
    end:   urlState.year_end   ? +urlState.year_end   : FULL_YEAR_RANGE.end,
  };
  const setYearRange = (updater) => {
    setUrlState((s) => {
      const cur = {
        start: s.year_start ? +s.year_start : FULL_YEAR_RANGE.start,
        end:   s.year_end   ? +s.year_end   : FULL_YEAR_RANGE.end,
      };
      const next = typeof updater === "function" ? updater(cur) : updater;
      return {
        ...s,
        year_start: next.start === FULL_YEAR_RANGE.start ? null : String(next.start),
        year_end:   next.end   === FULL_YEAR_RANGE.end   ? null : String(next.end),
      };
    });
  };

  const compareIndustry = urlState.compare;
  const setCompareIndustry = (v) => setUrlState((s) => ({ ...s, compare: v }));

  const [themeMode, setThemeMode] = useThemeMode();
  const [search, setSearch] = useState("");

  // Tweaks
  const [tweaks, setTweak] = window.useTweaks
    ? window.useTweaks(TWEAK_DEFAULTS)
    : [TWEAK_DEFAULTS, () => {}];

  // Apply accent / density / typescale to root
  useEffect(() => { applyAccent(tweaks.accent); }, [tweaks.accent]);
  useEffect(() => { document.documentElement.dataset.density = tweaks.density; }, [tweaks.density]);
  useEffect(() => { document.documentElement.dataset.typescale = tweaks.typeScale; }, [tweaks.typeScale]);

  // Year-scrubbed total — sums by_year totals across the range, then falls back to
  // KPI total when no year filter is applied so the hero counter still ticks 12,210.
  const isYearScoped = yearRange.start !== FULL_YEAR_RANGE.start || yearRange.end !== FULL_YEAR_RANGE.end;
  const yearScopedTotal = useMemo(() => {
    if (!isYearScoped) return null;
    return sumYearRange(data.by_year, yearRange)?.total ?? null;
  }, [yearRange, data, isYearScoped]);

  // totalFiltered: priority is industry filter → year range → KPI total
  const totalFiltered = useMemo(() => {
    if (filters.industry) return data.by_industry[filters.industry]?.total || data.kpis.total_companies;
    if (filters.size)     return data.by_size[filters.size]?.total || data.kpis.total_companies;
    if (filters.stage)    return data.by_stage[filters.stage] || data.kpis.total_companies;
    if (filters.theme)    return data.by_themes[filters.theme] || data.kpis.total_companies;
    if (yearScopedTotal != null) return yearScopedTotal;
    return data.kpis.total_companies;
  }, [filters, yearScopedTotal, data]);

  // KPIs scoped to industry filter (other filters don't rescale the strip)
  const scopedKpis = useMemo(() => {
    if (!filters.industry) return data.kpis;
    const ind = data.by_industry[filters.industry];
    if (!ind) return data.kpis;
    return {
      ...data.kpis,
      total_companies:  ind.total,
      active_companies: ind.active,
      funded_companies: ind.funded,
    };
  }, [filters.industry, data]);

  const applyFilter = (patch) => setFilters({ ...filters, ...patch });

  return (
    <>
      <Topbar
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        search={search}
        setSearch={setSearch}
        data={data}
        applyFilter={applyFilter}
      />
      <Hero
        kpis={scopedKpis}
        heroMode={tweaks.heroMode}
        industryFilter={filters.industry}
        sizeFilter={filters.size}
        stageFilter={filters.stage}
        themeFilter={filters.theme}
        totalFiltered={totalFiltered}
        yearRange={yearRange}
        setYearRange={setYearRange}
        fullYearRange={FULL_YEAR_RANGE}
        data={data}
      />

      <main>
        <IndustrySection
          data={data}
          filters={filters}
          setFilters={setFilters}
          chartStyle={tweaks.industryChartStyle}
          compareMode={tweaks.compareMode}
          compareIndustry={compareIndustry}
          setCompareIndustry={setCompareIndustry}
        />
        <GrowthSection data={data} yearRange={yearRange} fullYearRange={FULL_YEAR_RANGE} />
        <SizeRevenueSection data={data} />
        <FundingSection data={data} />
        <CapitalFlowSection data={data} />
        <InvestorsSection data={data} />
        <SectorStageHeatmap data={data} filters={filters} setFilters={setFilters} />
        <DefenceSection data={data} />
        <ThemeSection data={data} filters={filters} setFilters={setFilters} />
        <RequestSection filters={filters} setFilters={setFilters} />
      </main>

      <Footer />

      {/* Tweaks panel */}
      {window.TweaksPanel && (
        <window.TweaksPanel>
          <window.TweakSection label="Visual" />
          <window.TweakColor
            label="Accent"
            value={tweaks.accent}
            options={["teal", "coral", "indigo", "amber"]}
            onChange={(v) => setTweak("accent", v)}
          />
          <window.TweakRadio
            label="Industry chart"
            value={tweaks.industryChartStyle}
            options={["donut", "radial", "treemap"]}
            onChange={(v) => setTweak("industryChartStyle", v)}
          />
          <window.TweakRadio
            label="Hero motion"
            value={tweaks.heroMode}
            options={["particles", "scan", "off"]}
            onChange={(v) => setTweak("heroMode", v)}
          />
          <window.TweakSection label="Density" />
          <window.TweakRadio
            label="Density"
            value={tweaks.density}
            options={["compact", "comfortable"]}
            onChange={(v) => setTweak("density", v)}
          />
          <window.TweakSection label="Modes" />
          <window.TweakToggle
            label="Industry compare mode"
            value={!!tweaks.compareMode}
            onChange={(v) => setTweak("compareMode", v)}
          />
        </window.TweaksPanel>
      )}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
