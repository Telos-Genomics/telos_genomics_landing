<script>
  import { onMount, onDestroy } from "svelte";

  // ─── FRAME 1: Secuencia ───────────────────────────────────────────────────

  const SPIKE =
    "MFVFLVLLPLVSSQCVNLTTRTQLPPAYTNSFTRGVYYPDKVFRSSVLHSTQDLFLPFFSNVTWFHAIHVSGTNGTKRFDNPVLPFNDGVYFASTEKSNIIRGWIFGTTLDSKTQSLLIVNNATNVVIKVCEFQFCNDPFLGVYYHKNNKSWMESEFRVYSSANNCTFEYVSQPFLMDLEGKQGNFKNLREFVFKNIDGYFKIYSKHTPINLVRDLPQGFSALEPLVDLPIGINITRFQTLLALHRSYLTPGDSSSGWTAGAAAYYVGYLQPRTFLLKYNENGTITDAVDCALDPLSETKCTLKSFTVEKGIYQTSNFRVQPTESIVRFPNITNLCPFGEVFNATRFASVYAWNRKRISNCVADYSVLYNSASFSTFKCYGVSPTKLNDLCFTNVYADSFVIRGDEVRQIAPGQTGKIADYNYKLPDDFTGCVIAWNSNNLDSKVGGNYNYLYRLFRKSNLKPFERDISTEIYQAGSTPCNGVEGFNCYFPLQSYGFQPTNGVGYQPYRVVVLSFELLHAPATVCGPKKSTNLVKNKCVNFNFNGLTGTGVLTESNKKFLPFQQFGRDIADTTDAVRDPQTLEILDITPCSFGGVSVITPGTNTSNQVAVLYQDVNCTEVPVAIHADQLTPTWRVYSTGSNVFQTRAGCLIGAEHVNNSYECDIPIGAGICASYQTQTNSPRRARSVASQSIIAYTMSLGAENSVAYSNNSIAIPTNFTISVTTEILPVSMTKTSVDCTMYICGDSTECSNLLLQYGSFCTQLNRALTGIAVEQDKNTQEVFAQVKQIYKTPPIKDFGGFNFSQILPDPSKPSKRSFIEDLLFNKVTLADAGFIKQYGDCLGDIAARDLICAQKFNGLTVLPPLLTDEMIAQYTSALLAGTITSGWTFGAGAALQIPFAMQMAYRFNGIGVTQNVLYENQKLIANQFNSAIGKIQDSLSSTASALGKLQDVVNQNAQALNTLVKQLSSNFGAISSVLNDILSRLDKVEAEVQIDRLITGRLQSLQTYVTQQLIRAAEIRASANLAATKMSECVLGQSKRVDFCGKGYHLMSFPQSAPHGVVFLHVTYVPAQEKNFTTAPAICHDGKAHFPREGVFVSNGTHWFVTQRNFYEPQIITTDNTFVSGNCDVVIGIVNNTVYDPLQPELDSFKEELDKYFKNHTSPDVDLGDISGINASVVNIQKEIDRLNEVAKNLNESLIDLQELGKYEQYIKWPWYIWLGFIAGLIAIVMVTIMLCCMTSCCSCLKGCCSCGSCCKFDEDDSEPVLKGVKLHYT";

  const CRITICAL = new Set([451, 483, 500, 680]);

  function getZoneColor(idx) {
    if (idx >= 318 && idx < 436) return "#60a5fa";
    if (idx > 507 && idx <= 540) return "#60a5fa";
    if (idx >= 436 && idx <= 507) return "#34d399";
    if (idx >= 680 && idx <= 684) return "#f59e0b";
    return null;
  }

  const chars = SPIKE.split("").map((aa, i) => ({
    aa,
    idx: i,
    pos: i + 1,
    critical: CRITICAL.has(i),
    zone: getZoneColor(i),
  }));

  const COLS = 10;
  const GROUPS_PER_ROW = 6;
  const rows = [];
  for (let i = 0; i < chars.length; i += COLS * GROUPS_PER_ROW) {
    const row = [];
    for (let g = 0; g < GROUPS_PER_ROW; g++)
      row.push(chars.slice(i + g * COLS, i + (g + 1) * COLS));
    rows.push(row);
  }

  let scanIndex = $state(-1);
  let scanTimer = null;

  function startScan() {
    if (scanTimer) return;
    scanIndex = 0;
    scanTimer = setInterval(() => {
      scanIndex++;
      if (scanIndex >= chars.length) {
        clearInterval(scanTimer);
        scanTimer = null;
      }
    }, 5);
  }

  function resetScan() {
    clearInterval(scanTimer);
    scanTimer = null;
    scanIndex = -1;
  }

  // ─── FRAME 2: Heatmap ────────────────────────────────────────────────────

  const MUTATIONS = [
    { pos: 339, aa: "G339D", llr: -1.2, zone: "rbd" },
    { pos: 371, aa: "S371L", llr: -0.8, zone: "rbd" },
    { pos: 373, aa: "S373P", llr: -0.9, zone: "rbd" },
    { pos: 375, aa: "S375F", llr: -0.7, zone: "rbd" },
    { pos: 405, aa: "D405N", llr: -1.1, zone: "rbd" },
    { pos: 408, aa: "R408S", llr: -0.6, zone: "rbd" },
    { pos: 440, aa: "N440K", llr: 1.4, zone: "rbm" },
    { pos: 446, aa: "G446S", llr: 0.9, zone: "rbm" },
    { pos: 452, aa: "L452R", llr: 3.8, zone: "rbm", critical: true },
    { pos: 477, aa: "S477N", llr: 1.2, zone: "rbm" },
    { pos: 484, aa: "E484A", llr: 4.1, zone: "rbm", critical: true },
    { pos: 486, aa: "F486V", llr: 2.2, zone: "rbm" },
    { pos: 490, aa: "F490S", llr: 1.7, zone: "rbm" },
    { pos: 493, aa: "Q493R", llr: 1.9, zone: "rbm" },
    { pos: 496, aa: "G496S", llr: 1.1, zone: "rbm" },
    { pos: 498, aa: "Q498R", llr: 1.3, zone: "rbm" },
    { pos: 501, aa: "N501Y", llr: 3.2, zone: "rbm", critical: true },
    { pos: 505, aa: "Y505H", llr: 1.6, zone: "rbm" },
    { pos: 614, aa: "D614G", llr: 2.1, zone: "body" },
    { pos: 655, aa: "H655Y", llr: 1.4, zone: "body" },
    { pos: 679, aa: "N679K", llr: 2.8, zone: "furin" },
    { pos: 681, aa: "P681H", llr: 5.2, zone: "furin", critical: true },
    { pos: 764, aa: "H764L", llr: -0.5, zone: "body" },
    { pos: 796, aa: "D796Y", llr: -0.8, zone: "body" },
    { pos: 856, aa: "N856K", llr: -0.4, zone: "body" },
    { pos: 954, aa: "Q954H", llr: -0.3, zone: "body" },
    { pos: 969, aa: "N969K", llr: -0.6, zone: "body" },
    { pos: 981, aa: "L981F", llr: -0.4, zone: "body" },
  ];

  const TOTAL = 1273;
  const MAX_HEIGHT = 110;
  const MAX_LLR = 6;

  const ZONE_COLORS = {
    rbd: "#3b82f6",
    rbm: "#10b981",
    furin: "#f59e0b",
    body: "#4b5563",
  };

  function peakHeight(llr) {
    return Math.round((Math.abs(llr) / MAX_LLR) * MAX_HEIGHT);
  }

  function peakColor(mut) {
    if (mut.critical) return "#ef5b5b";
    return ZONE_COLORS[mut.zone] ?? "#4b5563";
  }

  const SCORE = Math.round(
    MUTATIONS.filter((m) => m.llr > 0).reduce((acc, m) => {
      const w = m.critical
        ? 3
        : m.zone === "rbm"
          ? 2
          : m.zone === "furin"
            ? 1.5
            : 1;
      return acc + Math.abs(m.llr) * w * 20;
    }, 0),
  );

  let frame2Revealed = $state(false);
  let hoveredMut = $state(null);

  // ─── FRAME 3: Output ─────────────────────────────────────────────────────

  const terminalLines = [
    { type: "divider", text: "─────────────────────────────────" },
    { type: "label", text: "TELOS-S · ANALYSIS REPORT" },
    { type: "divider", text: "─────────────────────────────────" },
    { type: "label", text: "Variant       RE.2.2.3 (BA.3.2)" },
    { type: "label", text: "Source        NCBI/GenBank" },
    { type: "label", text: "Sequences     12 · deposited 4d ago" },
    { type: "divider", text: "─────────────────────────────────" },
    { type: "score", text: "Aggression    2281 ██████████" },
    { type: "alert", text: "Verdict       ⚠ ALERTA MÁXIMA" },
    { type: "divider", text: "─────────────────────────────────" },
    { type: "label", text: "Critical mutations:" },
    { type: "critical", text: "  L452R  pos 452  LLR +3.8  RBM" },
    { type: "critical", text: "  E484A  pos 484  LLR +4.1  RBM" },
    { type: "critical", text: "  N501Y  pos 501  LLR +3.2  RBM" },
    { type: "critical", text: "  H681R  pos 681  LLR +5.2  FCS" },
    { type: "divider", text: "─────────────────────────────────" },
    { type: "label", text: "Prophet predictions:" },
    { type: "prophet", text: "  pos 452 → G  8.7% structural" },
    { type: "prophet", text: "  pos 681 → K  6.2% structural" },
    { type: "divider", text: "─────────────────────────────────" },
    { type: "label", text: "Lead time     ~3–6 weeks" },
    { type: "alert", text: "Status        MONITOR ACTIVE" },
  ];

  let frame3Revealed = $state(false);
  let terminalIndex = $state(-1);
  let mapDay = $state(0);
  let termTimer = null;
  let mapTimer = null;
  const mapDelays = [2800, 3800]; // ms desde reveal para POIs

  function startFrame3() {
    if (termTimer) return;
    terminalIndex = 0;
    termTimer = setInterval(() => {
      terminalIndex++;
      if (terminalIndex >= terminalLines.length) {
        clearInterval(termTimer);
        termTimer = null;
      }
    }, 110);

    mapDay = 0;
    mapTimer = setInterval(() => {
      mapDay++;
      if (mapDay >= 30) {
        clearInterval(mapTimer);
        mapTimer = null;
      }
    }, 200);
  }

  // ─── Observers ───────────────────────────────────────────────────────────

  let frame1El;
  let frame2El;
  let frame3El;
  let obs1, obs2, obs3;

  onMount(() => {
    obs1 = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) startScan();
        else resetScan();
      },
      { threshold: 0.3 },
    );
    if (frame1El) obs1.observe(frame1El);

    obs2 = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) frame2Revealed = true;
      },
      { threshold: 0.2 },
    );
    if (frame2El) obs2.observe(frame2El);

    obs3 = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          frame3Revealed = true;
          startFrame3();
        }
      },
      { threshold: 0.2 },
    );
    if (frame3El) obs3.observe(frame3El);
  });

  onDestroy(() => {
    clearInterval(scanTimer);
    obs1?.disconnect();
    obs2?.disconnect();
    obs3?.disconnect();
    clearInterval(termTimer);
    clearInterval(mapTimer);
  });
</script>

<div
  id="how_does_it_work"
  class="relative bg-[#0a0a0a] px-6 md:px-24 py-28 overflow-hidden"
>
  <!-- Section header -->
  <div
    class="relative flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 mb-16 border-t-2 border-[#888] pt-8"
  >
    <span
      class="text-[0.65rem] font-bold tracking-[0.25em] text-[#888] uppercase whitespace-nowrap"
      style="font-family: 'Syne', sans-serif;"
    >
      HOW DOES IT WORK?
    </span>
    <h2
      class="text-[clamp(2.2rem,4vw,3.8rem)] font-extrabold leading-[1.05] tracking-tight text-[#f5f3ee]"
    >
      Analysis from samples<br /> to final report.
    </h2>
  </div>

  <div class="flex flex-col xl:flex-row w-full">
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- FRAME 1 — Reading the spike                                            -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <div
      bind:this={frame1El}
      class="relative bg-[#0a0a0a] px-6 md:px-16 overflow-hidden min-h-screen justify-center w-full xl:w-1/3"
    >
      <div
        class="mb-10 border-t border-[#2a2a2a] pt-6 flex flex-col md:flex-row md:items-baseline gap-3 xl:gap-10"
      >
        <span
          class="text-[0.65rem] font-bold tracking-[0.25em] text-[#444] uppercase"
          style="font-family:'Syne',sans-serif;">STEP 01</span
        >
        <h2
          class="text-[clamp(1.6rem,3vw,2.8rem)] font-extrabold leading-tight tracking-tight text-[#f5f3ee]"
        >
          Reading the spike.
        </h2>
        <p class="md:ml-auto text-sm text-[#555] max-w-xs leading-relaxed">
          1,273 amino acid positions. ESM-2 reads every residue in structural
          context — not as a string, as a protein.
        </p>
      </div>

      <div
        class="flex flex-wrap gap-4 mb-8 text-[0.65rem] font-mono tracking-widest uppercase"
      >
        {#each [["#60a5fa", "RBD (pos 319–541)"], ["#34d399", "RBM (pos 437–508)"], ["#f59e0b", "Furin (pos 681–685)"], ["#ef5b5b", "Critical positions"]] as [col, label]}
          <span class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full" style="background:{col}"></span>
            <span class="text-[#555]">{label}</span>
          </span>
        {/each}
      </div>

      <div
        class="font-mono text-[0.7rem] leading-[2] select-none overflow-x-auto"
      >
        {#each rows as row, rowIdx}
          <div class="flex gap-4 md:gap-6 mb-1">
            <span
              class="text-#555] w-10 shrink-0 text-right text-[0.6rem] pt-[2px]"
            >
              {rowIdx * COLS * GROUPS_PER_ROW + 1}
            </span>
            {#each row as group}
              <span class="flex gap-[1px]">
                {#each group as char}
                  <span
                    class="transition-all duration-75"
                    style="
                color:{char.idx > scanIndex
                      ? '#1a1a1a'
                      : char.critical
                        ? '#ef5b5b'
                        : (char.zone ?? '#6b6b6b')};
                text-shadow:{char.critical && char.idx <= scanIndex
                      ? '0 0 12px #ef5b5b'
                      : 'none'};
                font-weight:{char.critical && char.idx <= scanIndex
                      ? '700'
                      : '400'};
              ">{char.aa}</span
                  >
                {/each}
              </span>
            {/each}
          </div>
        {/each}
      </div>

      <div class="mt-8 flex items-center gap-4">
        <div class="flex-1 h-[1px] bg-[#1a1a1a] relative overflow-hidden">
          <div
            class="absolute left-0 top-0 h-full bg-[#ef5b5b] transition-all duration-75"
            style="width:{Math.min((scanIndex / chars.length) * 100, 100)}%"
          ></div>
        </div>
        <span class="text-[0.6rem] font-mono text-[#333] whitespace-nowrap">
          {Math.min(scanIndex + 1, chars.length)} / {chars.length} residues
        </span>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- FRAME 2 — Scoring the threat                                           -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <div
      bind:this={frame2El}
      class="relative bg-[#0a0a0a] px-6 md:px-16 overflow-hidden min-h-screen justify-center w-full xl:w-1/3"
    >
      <div
        class="mb-12 border-t border-[#2a2a2a] pt-6 flex flex-col md:flex-row md:items-baseline gap-3 xl:gap-10"
      >
        <span
          class="text-[0.65rem] font-bold tracking-[0.25em] text-[#444] uppercase"
          style="font-family:'Syne',sans-serif;">STEP 02</span
        >
        <h2
          class="text-[clamp(1.6rem,3vw,2.8rem)] font-extrabold leading-tight tracking-tight text-[#f5f3ee]"
        >
          Scoring the threat.
        </h2>
        <p class="md:ml-auto text-sm text-[#555] max-w-xs leading-relaxed">
          Each mutation is evaluated for structural impact. Critical zones carry
          higher weight. Everything resolves into a single number.
        </p>
      </div>

      <!-- Score + desglose -->
      <div class="flex flex-col xl:flex-row gap-4 xl:gap-16 items-start">
        <div class="flex flex-col gap-1">
          <span
            class="text-[0.6rem] font-mono tracking-[0.2em] uppercase text-[#555]"
            >Aggression Score</span
          >
          <div class="flex items-baseline gap-3">
            <span
              class="font-black leading-none"
              style="
          font-family:'Space Grotesk', sans-serif;
          font-size:clamp(3rem,6vw,4.5rem);
          color:{frame2Revealed ? '#ef5b5b' : '#1a1a1a'};
          text-shadow:{frame2Revealed
                ? '0 0 40px rgba(239,91,91,0.25)'
                : 'none'};
          transition:color 0.8s ease 0.6s,text-shadow 0.8s ease 0.6s;
        ">{SCORE}</span
            >
            <div class="flex flex-col gap-0.5">
              <span
                class="text-[0.55rem] font-mono tracking-widest uppercase"
                style="color:{frame2Revealed
                  ? '#ef5b5b'
                  : '#1a1a1a'};transition:color 0.8s ease 0.6s;"
              >
                ALERTA MÁXIMA
              </span>
              <span class="text-[0.55rem] font-mono text-[#555]"
                >threshold &gt; 1200</span
              >
            </div>
          </div>
        </div>

        <div class="flex gap-6">
          {#each [{ key: "rbm", label: "RBM", weight: "×2", color: "#10b981" }, { key: "furin", label: "Furin", weight: "×1.5", color: "#f59e0b" }, { key: "rbd", label: "RBD", weight: "×1", color: "#3b82f6" }, { key: "body", label: "Other", weight: "×1", color: "#4b5563" }] as zone}
            {@const count = MUTATIONS.filter((m) => m.zone === zone.key).length}
            <div class="flex flex-col gap-1">
              <span class="text-[0.6rem] font-mono" style="color:{zone.color}"
                >{zone.label}</span
              >
              <span
                class="text-[#f5f3ee] text-xl font-bold"
                style="font-family:'Syne',sans-serif;">{count}</span
              >
              <span class="text-[0.55rem] font-mono text-[#555]"
                >{zone.weight}</span
              >
            </div>
          {/each}
        </div>

        <div class="flex flex-col gap-2">
          <span
            class="text-[0.6rem] font-mono tracking-[0.2em] uppercase text-[#555]"
            >Critical hits</span
          >
          <div class="flex flex-col gap-1">
            {#each MUTATIONS.filter((m) => m.critical) as mut}
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-[#ef5b5b]"></span>
                <span class="text-[0.7rem] font-mono text-[#ef5b5b]"
                  >{mut.aa}</span
                >
                <span class="text-[0.6rem] font-mono text-[#555]"
                  >+{mut.llr.toFixed(1)}</span
                >
              </div>
            {/each}
          </div>
        </div>
      </div>

      <div
        class="flex flex-wrap gap-5 mt-16 text-[0.65rem] font-mono tracking-widest uppercase"
      >
        {#each [["rbd", "RBD"], ["rbm", "RBM"], ["furin", "Furin"], ["body", "Structural"]] as [key, label]}
          <span class="flex items-center gap-2">
            <span
              class="w-2 h-2 rounded-full"
              style="background:{ZONE_COLORS[key]}"
            ></span>
            <span class="text-[#555]">{label}</span>
          </span>
        {/each}
        <span class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[#ef5b5b]"></span>
          <span class="text-[#555]">Critical · weighted ×3</span>
        </span>
      </div>

      <!-- Picos -->
      <div class="relative w-full h-96">
        <div class="absolute bottom-8 left-0 right-0 h-px bg-[#2a2a2a]"></div>

        <div
          class="absolute bottom-8 h-[2px] opacity-30"
          style="background:#3b82f6;left:{(318 / TOTAL) * 100}%;width:{((540 -
            318) /
            TOTAL) *
            100}%"
        ></div>
        <div
          class="absolute bottom-8 h-[3px] opacity-60"
          style="background:#10b981;left:{(436 / TOTAL) * 100}%;width:{((507 -
            436) /
            TOTAL) *
            100}%"
        ></div>
        <div
          class="absolute bottom-8 h-[3px] opacity-60"
          style="background:#f59e0b;left:{(680 / TOTAL) * 100}%;width:{(5 /
            TOTAL) *
            100}%"
        ></div>

        <div
          class="absolute text-[0.5rem] font-mono text-[#3b82f6] opacity-50 select-none"
          style="bottom:12px;left:{(380 / TOTAL) * 100}%"
        >
          RBD
        </div>
        <div
          class="absolute text-[0.5rem] font-mono text-[#10b981] opacity-70 select-none"
          style="bottom:12px;left:{(462 / TOTAL) * 100}%"
        >
          RBM
        </div>
        <div
          class="absolute text-[0.5rem] font-mono text-[#f59e0b] opacity-70 select-none"
          style="bottom:12px;left:{(674 / TOTAL) * 100}%"
        >
          FCS
        </div>

        {#each MUTATIONS as mut, i}
          {@const h = peakHeight(mut.llr)}
          {@const col = peakColor(mut)}
          {@const x = (mut.pos / TOTAL) * 100}

          {#if hoveredMut === mut}
            <div
              class="absolute z-20 bg-[#111] border border-[#2a2a2a] rounded px-3 py-2
                    text-[0.65rem] font-mono whitespace-nowrap pointer-events-none"
              style="bottom:{h + 20}px;left:{Math.min(
                Math.max(x, 4),
                86,
              )}%;transform:translateX(-50%);"
            >
              <div class="font-bold" style="color:{col}">{mut.aa}</div>
              <div class="text-[#555] mt-0.5">pos {mut.pos}</div>
              <div class="text-[#555]">
                LLR {mut.llr > 0 ? "+" : ""}{mut.llr}
              </div>
              {#if mut.critical}
                <div
                  class="text-[#ef5b5b] mt-0.5 text-[0.6rem] tracking-wider uppercase"
                >
                  critical
                </div>
              {/if}
            </div>
          {/if}

          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="absolute bottom-8 cursor-crosshair"
            style="
          left:{x}%;transform:translateX(-50%);
          width:{mut.critical ? 3 : 2}px;
          height:calc({frame2Revealed ? h : 0}px * 3);
          background:{col};
          box-shadow:{mut.critical ? `0 0 10px ${col}88` : 'none'};
          transition:height 0.5s cubic-bezier(0.34,1.56,0.64,1) {frame2Revealed
              ? i * 35
              : 0}ms;
        "
            onmouseenter={() => (hoveredMut = mut)}
            onmouseleave={() => (hoveredMut = null)}
          ></div>

          {#if mut.critical}
            <div
              class="absolute rounded-full pointer-events-none"
              style="
            left:{x}%;transform:translateX(-50%);
            bottom:{frame2Revealed ? h + 8 - 3 : 8}px;
            width:6px;height:6px;
            background:{col};box-shadow:0 0 12px {col};
            transition:bottom 0.5s cubic-bezier(0.34,1.56,0.64,1) {frame2Revealed
                ? i * 35
                : 0}ms;
          "
            ></div>
          {/if}
        {/each}

        {#each [1, 250, 500, 750, 1000, 1273] as pos}
          <div
            class="absolute text-[0.5rem] font-mono text-[#2a2a2a] select-none"
            style="bottom:0;left:{(pos / TOTAL) *
              100}%;transform:translateX(-50%)"
          >
            {pos}
          </div>
        {/each}
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- FRAME 3 — The signal reaches you                                        -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <div
      bind:this={frame3El}
      class="relative bg-[#0a0a0a] px-6 md:px-10 overflow-hidden min-h-screen flex flex-col justify-center w-full xl:w-1/3 border-t xl:border-t-0 border-[#1a1a1a]"
    >
      <!-- Header -->

      <div
        class="mb-12 border-t border-[#2a2a2a] pt-6 flex flex-col md:flex-row md:items-baseline gap-3 xl:gap-10"
      >
        <span
          class="text-[0.65rem] font-bold tracking-[0.25em] text-[#444] uppercase"
          style="font-family:'Syne',sans-serif;">STEP 03</span
        >
        <h2
          class="text-[clamp(1.6rem,3vw,2.8rem)] font-extrabold leading-tight tracking-tight text-[#f5f3ee]"
        >
          The signal reaches you.
        </h2>
        <p class="md:ml-auto text-sm text-[#555] max-w-xs leading-relaxed">
          Structured report. Mutation map. Contagion simulation. Weeks before
          the clinical picture forms.
        </p>
      </div>

      <!-- Layout: terminal + mapa -->
      <div class="flex flex-col gap-8">
        <!-- Terminal de reporte -->
        <div
          class="bg-[#0f0f0f] border border-[#1e1e1e] rounded-sm overflow-hidden"
        >
          <!-- Barra de título terminal -->
          <div
            class="flex items-center gap-2 px-4 py-2 border-b border-[#1e1e1e] bg-[#111]"
          >
            <span class="w-2.5 h-2.5 rounded-full bg-[#ef5b5b] opacity-70"
            ></span>
            <span class="w-2.5 h-2.5 rounded-full bg-[#f59e0b] opacity-70"
            ></span>
            <span class="w-2.5 h-2.5 rounded-full bg-[#10b981] opacity-70"
            ></span>
            <span
              class="ml-3 text-[0.55rem] font-mono text-[#555] tracking-widest"
              >telos-s · output</span
            >
          </div>

          <!-- Líneas del reporte -->
          <div
            class="px-4 py-4 font-mono text-[0.65rem] leading-[1.9] space-y-0"
          >
            {#each terminalLines as line, i}
              <div
                class="transition-all duration-100"
                style="
              opacity:{frame3Revealed && i <= terminalIndex ? 1 : 0};
              transform:{frame3Revealed && i <= terminalIndex
                  ? 'translateY(0)'
                  : 'translateY(4px)'};
              transition-delay:{i * 120}ms;
            "
              >
                {#if line.type === "label"}
                  <span class="text-[#555]">{line.text}</span>
                {:else if line.type === "score"}
                  <span class="text-[#ef5b5b] font-bold">{line.text}</span>
                {:else if line.type === "alert"}
                  <span class="text-[#ef5b5b]">{line.text}</span>
                {:else if line.type === "critical"}
                  <span class="text-[#f59e0b]">{line.text}</span>
                {:else if line.type === "prophet"}
                  <span class="text-[#10b981]">{line.text}</span>
                {:else if line.type === "divider"}
                  <span class="text-[#222]">{line.text}</span>
                {:else}
                  <span class="text-[#555]">{line.text}</span>
                {/if}
              </div>
            {/each}

            <!-- Cursor parpadeante al final -->
            {#if frame3Revealed && terminalIndex >= terminalLines.length - 1}
              <div class="flex items-center gap-1 mt-1">
                <span class="text-[#ef5b5b]">▸</span>
                <span
                  class="terminal-cursor w-[6px] h-[11px] bg-[#ef5b5b] inline-block ml-0.5"
                ></span>
              </div>
            {/if}
          </div>
        </div>

        <!-- Mapa SVG minimalista -->
        <div class="relative">
          <div
            class="text-[0.55rem] font-mono text-[#555] tracking-widest uppercase mb-2"
          >
            contagion simulation · PTY / Ciudad de Panamá
          </div>
          <div
            class="bg-[#0f0f0f] border border-[#1e1e1e] rounded-sm overflow-hidden"
            style="height:180px;"
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 300 180"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!-- Grid sutil -->
              <defs>
                <pattern
                  id="grid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="#1a1a1a"
                    stroke-width="0.5"
                  />
                </pattern>
              </defs>
              <rect width="300" height="180" fill="url(#grid)" />

              <!-- Aeropuerto PTY — foco primario -->
              <!-- Círculos de propagación animados -->
              {#if frame3Revealed}
                <circle
                  cx="150"
                  cy="90"
                  r="0"
                  fill="none"
                  stroke="#ef5b5b"
                  stroke-width="0.5"
                  opacity="0.3"
                >
                  <animate
                    attributeName="r"
                    from="0"
                    to="80"
                    dur="3s"
                    begin="0.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.4"
                    to="0"
                    dur="3s"
                    begin="0.5s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx="150"
                  cy="90"
                  r="0"
                  fill="none"
                  stroke="#ef5b5b"
                  stroke-width="0.5"
                  opacity="0.3"
                >
                  <animate
                    attributeName="r"
                    from="0"
                    to="80"
                    dur="3s"
                    begin="1.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.4"
                    to="0"
                    dur="3s"
                    begin="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx="150"
                  cy="90"
                  r="0"
                  fill="none"
                  stroke="#ef5b5b"
                  stroke-width="0.5"
                  opacity="0.3"
                >
                  <animate
                    attributeName="r"
                    from="0"
                    to="80"
                    dur="3s"
                    begin="2.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.4"
                    to="0"
                    dur="3s"
                    begin="2.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              {/if}

              <!-- Punto central — aeropuerto -->
              <circle cx="150" cy="90" r="3" fill="#ef5b5b">
                {#if frame3Revealed}
                  <animate
                    attributeName="r"
                    values="3;4;3"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                {/if}
              </circle>
              <circle
                cx="150"
                cy="90"
                r="6"
                fill="none"
                stroke="#ef5b5b"
                stroke-width="0.5"
                opacity="0.5"
              />

              <!-- POI 1 — aparece con delay (Albrook) -->
              {#if frame3Revealed}
                <g
                  style="opacity:0; animation: fadeIn 0.4s ease {mapDelays[0]}ms forwards;"
                >
                  <circle cx="105" cy="100" r="2" fill="#f59e0b" />
                  <circle
                    cx="105"
                    cy="100"
                    r="5"
                    fill="none"
                    stroke="#f59e0b"
                    stroke-width="0.5"
                    opacity="0.4"
                  />
                  <line
                    x1="150"
                    y1="90"
                    x2="105"
                    y2="100"
                    stroke="#f59e0b"
                    stroke-width="0.3"
                    opacity="0.2"
                    stroke-dasharray="3,3"
                  />
                </g>
                <!-- POI 2 — Multiplaza -->
                <g
                  style="opacity:0; animation: fadeIn 0.4s ease {mapDelays[1]}ms forwards;"
                >
                  <circle cx="118" cy="82" r="2" fill="#f59e0b" />
                  <circle
                    cx="118"
                    cy="82"
                    r="5"
                    fill="none"
                    stroke="#f59e0b"
                    stroke-width="0.5"
                    opacity="0.4"
                  />
                  <line
                    x1="150"
                    y1="90"
                    x2="118"
                    y2="82"
                    stroke="#f59e0b"
                    stroke-width="0.3"
                    opacity="0.2"
                    stroke-dasharray="3,3"
                  />
                </g>
              {/if}

              <!-- Labels -->
              <text
                x="153"
                y="87"
                fill="#ef5b5b"
                font-size="6"
                font-family="monospace"
                opacity="0.8">PTY</text
              >
              <text
                x="108"
                y="111"
                fill="#f59e0b"
                font-size="5"
                font-family="monospace"
                opacity="0.6">Albrook</text
              >
              <text
                x="121"
                y="79"
                fill="#f59e0b"
                font-size="5"
                font-family="monospace"
                opacity="0.6">Multiplaza</text
              >

              <!-- Día contador -->
              {#if frame3Revealed}
                <text
                  x="10"
                  y="170"
                  fill="#555"
                  font-size="6"
                  font-family="monospace">day {mapDay} / 30</text
                >
                <rect
                  x="10"
                  y="173"
                  width={(mapDay / 30) * 140}
                  height="1.5"
                  fill="#ef5b5b"
                  opacity="0.6"
                />
                <rect x="10" y="173" width="140" height="1.5" fill="#222" />
                <rect
                  x="10"
                  y="173"
                  width={(mapDay / 30) * 140}
                  height="1.5"
                  fill="#ef5b5b"
                  opacity="0.6"
                />
              {/if}
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .terminal-cursor {
    animation: termBlink 1.1s step-end infinite;
  }

  @keyframes termBlink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
</style>
