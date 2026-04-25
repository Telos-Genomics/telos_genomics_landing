<script>
  import { onMount, onDestroy } from "svelte";

  let currentSlide = $state(0);
  let isTransitioning = $state(false);
  let direction = $state(1); // 1 = forward, -1 = backward
  let sectionEl;
  let observer;
  let revealed = $state(false);

  import imgSlide1 from "../images/slide1.png";
  import imgSlide1_1 from "../images/slide1_1.png";
  import imgSlide2 from "../images/slide2.png";
  import imgSlide3 from "../images/slide3.png";

  const SLIDES = [
    {
      tag: "THE COST OF REACTING LATE",
      stat: "$72B",
      statSub: "in insured life and health losses.",
      context: "COVID-19. 2020–2021. Priced after the fact.",
      body: "Every significant variant caused measurable economic damage before the market could respond. Reinsurers adjusted premiums after the wave. Supply chains broke before rerouting. Airlines grounded fleets after spread was confirmed.",
      bg: "#f5f3ee",
      textDark: true,
    },
    {
      tag: "THE REACTION CYCLE",
      stat: "18 weeks.",
      statSub: "from genomic deposit to peak clinical impact.",
      context: "JN.1 · November 2023 → March 2024",
      body: "The signal existed in public genomic data weeks before any advisory was issued. The tools to read it didn't exist in operational form. By the time the clinical picture was clear, the financial exposure was already locked in.",
      bg: "#f5f3ee",
      textDark: true,
      timeline: true,
    },
    {
      tag: "YOUR WINDOW",
      stat: "3–6 weeks.",
      statSub: "of advance signal before clinical impact.",
      context: "Telos-S operates in the gap.",
      body: "That window is enough time to adjust underwriting conditions, reassess reserves, trigger treaty clauses, reroute logistics, or reposition a portfolio. The genomic signal is already public. The question is whether you're reading it.",
      bg: "#0a0a0a",
      textDark: false,
      window: true,
    },
  ];

  const TOTAL = SLIDES.length;

  // Timeline data for slide 2 — JN.1 real timestamps
  const timelineEvents = [
    { label: "NCBI deposit", date: "Nov 3", week: 0, color: "#10b981" },
    {
      label: "Lineage designated",
      date: "Nov 21",
      week: 2.5,
      color: "#60a5fa",
    },
    { label: "WHO alert", date: "Dec 18", week: 6.5, color: "#f59e0b" },
    { label: "Clinical peak", date: "Jan 15", week: 10, color: "#ef5b5b" },
    { label: "Losses priced", date: "Mar 2024", week: 18, color: "#6b7280" },
  ];

  function goTo(idx, dir = 1) {
    if (isTransitioning || idx === currentSlide) return;
    isTransitioning = true;
    direction = dir;
    setTimeout(() => {
      currentSlide = idx;
      setTimeout(() => {
        isTransitioning = false;
      }, 50);
    }, 420);
  }

  function next() {
    if (currentSlide < TOTAL - 1) goTo(currentSlide + 1, 1);
  }
  function prev() {
    if (currentSlide > 0) goTo(currentSlide - 1, -1);
  }

  // Keyboard navigation
  function handleKey(e) {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  }

  onMount(() => {
    observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) revealed = true;
      },
      { threshold: 0.1 },
    );
    if (sectionEl) observer.observe(sectionEl);
    window.addEventListener("keydown", handleKey);
  });

  onDestroy(() => {
    observer?.disconnect();
    window.removeEventListener("keydown", handleKey);
  });
</script>

<section
  bind:this={sectionEl}
  id="why_now"
  class="relative overflow-hidden"
  style="height: 100svh; min-height: 600px;"
>
  {#each SLIDES as slide, i}
    {@const isActive = i === currentSlide}
    {@const isPrev = i === currentSlide - 1}
    {@const isNext = i === currentSlide + 1}

    <div
      class="absolute inset-0 flex flex-col justify-between px-8 md:px-20 py-16 transition-none"
      style="
        background: {slide.bg};
        transform: translateX({isActive
        ? '0%'
        : direction > 0
          ? i < currentSlide
            ? '-100%'
            : '100%'
          : i > currentSlide
            ? '100%'
            : '-100%'});
        transition: transform {isTransitioning
        ? '0s'
        : '0.55s'} cubic-bezier(0.77,0,0.175,1);
        will-change: transform;
        z-index: {isActive ? 2 : 1};
      "
    >
      <!-- Placeholder images — reemplazar con Flux/royalty-free -->
      {#if i === 0}
        <!-- Imagen flotante top-right -->
        <div
          class="absolute top-0 right-0 w-48 md:w-80 h-40 md:h-72 overflow-hidden opacity-20 pointer-events-none"
        >
          <img
            class="h-auto max-w-full"
            src={imgSlide1.src}
            alt="image description"
          />
        </div>
        <!-- Imagen flotante bottom-left -->
        <div
          class="absolute bottom-16 left-0 w-32 md:w-72 h-32 md:h-64 overflow-hidden opacity-15 pointer-events-none"
        >
          <img
            class="h-auto max-w-full"
            src={imgSlide1_1.src}
            alt="image description"
          />
        </div>
      {/if}

      {#if i === 1}
        <div
          class="absolute top-8 right-8 w-40 md:w-96 h-28 md:h-72 overflow-hidden opacity-10 pointer-events-none"
        >
          <img
            class="h-auto max-w-full"
            src={imgSlide2.src}
            alt="image description"
          />
        </div>
      {/if}

      {#if i === 2}
        <div
          class="absolute top-0 right-0 w-56 md:w-96 h-48 md:h-72 overflow-hidden opacity-10 pointer-events-none"
        >
          <img
            class="h-auto max-w-full"
            src={imgSlide3.src}
            alt="image description"
          />
        </div>
      {/if}

      <!-- Contenido principal -->
      <div class="relative z-10 flex flex-col h-full justify-between">
        <!-- Tag + nav dots -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="w-2 h-2 rounded-full bg-[#ef5b5b]"></span>
            <span
              class="text-[0.6rem] font-bold tracking-[0.2em] uppercase"
              style="
                color:{slide.textDark ? '#888' : '#555'};
              ">{slide.tag}</span
            >
          </div>
        </div>

        <!-- Centro — stat + body -->
        <div class="flex flex-col gap-6 max-w-3xl">
          <!-- Stat grande -->
          <div class="flex flex-col gap-1">
            <h2
              class="leading-none tracking-tight"
              style="
                font-size:clamp(3.5rem,9vw,8rem);
                font-weight:800;
                color:{slide.textDark ? '#0a0a0a' : '#f5f3ee'};
                opacity:{revealed ? 1 : 0};
                transform:{revealed ? 'none' : 'translateY(20px)'};
                transition:opacity 0.7s ease, transform 0.7s ease;
              "
            >
              {slide.stat}
            </h2>
            <p
              class="text-lg md:text-2xl font-light"
              style="
                color:{slide.textDark ? '#333' : '#aaa'};
              "
            >
              {slide.statSub}
            </p>
            <p
              class="text-xs font-mono tracking-widest uppercase mt-1"
              style="color: #ef5b5b;"
            >
              {slide.context}
            </p>
          </div>

          <!-- Timeline — solo slide 1 (JN.1) -->
          {#if slide.timeline}
            <div class="relative mt-2 mb-2" style="height: 60px;">
              <!-- Línea base -->
              <div
                class="absolute top-4 left-0 right-0 h-px"
                style="background:{slide.textDark ? '#ccc' : '#333'}"
              ></div>

              <!-- Zona Telos-S (semanas 0–6) -->
              <div
                class="absolute top-2 h-5 bg-[#ef5b5b] opacity-20 rounded-sm"
                style="left:0%; width:{(6.5 / 18) * 100}%"
              ></div>
              <div
                class="absolute text-[0.5rem] font-mono text-[#ef5b5b] opacity-70"
                style="top:0px; left:1%"
              >
                Telos-S signal
              </div>

              {#each timelineEvents as ev}
                {@const left = (ev.week / 18) * 100}
                <div
                  class="absolute flex flex-col items-center"
                  style="left:{left}%; transform:translateX(-50%)"
                >
                  <div
                    class="w-2 h-2 rounded-full"
                    style="background:{ev.color}; margin-top: 12px;"
                  ></div>
                  <span
                    class="text-[0.5rem] font-mono mt-1 whitespace-nowrap"
                    style="color:{ev.color}">{ev.date}</span
                  >
                  <span
                    class="text-[0.45rem] font-mono whitespace-nowrap"
                    style="color:{slide.textDark ? '#888' : '#555'}"
                    >{ev.label}</span
                  >
                </div>
              {/each}
            </div>
          {/if}

          <!-- Ventana visual — solo slide 2 -->
          {#if slide.window}
            <div class="relative mt-2" style="height:48px;">
              <div
                class="absolute top-5 left-0 right-0 h-px bg-[#2a2a2a]"
              ></div>
              <!-- Gap resaltado -->
              <div
                class="absolute top-3 h-5 border border-[#ef5b5b] border-dashed rounded-sm flex items-center justify-center"
                style="left:5%; width:50%"
              >
                <span
                  class="text-[0.55rem] font-mono text-[#ef5b5b] tracking-wider"
                  >← Telos-S operates here →</span
                >
              </div>
              <!-- Punto izquierdo -->
              <div
                class="absolute top-4 w-2.5 h-2.5 rounded-full bg-[#10b981]"
                style="left:4%; transform:translateX(-50%)"
              ></div>
              <span
                class="absolute text-[0.5rem] font-mono text-[#10b981]"
                style="top:26px; left:1%">NCBI deposit</span
              >
              <!-- Punto derecho -->
              <div
                class="absolute top-4 w-2.5 h-2.5 rounded-full bg-[#ef5b5b]"
                style="left:56%; transform:translateX(-50%)"
              ></div>
              <span
                class="absolute text-[0.5rem] font-mono text-[#ef5b5b]"
                style="top:26px; left:53%">Clinical impact</span
              >
              <!-- Punto final -->
              <div
                class="absolute top-4 w-2 h-2 rounded-full bg-[#4b5563]"
                style="right:0%"
              ></div>
              <span
                class="absolute text-[0.5rem] font-mono text-[#4b5563]"
                style="top:26px; right:0%">Losses priced</span
              >
            </div>
          {/if}

          <!-- Body text -->
          <p
            class="text-sm md:text-base leading-relaxed max-w-xl"
            style="color:{slide.textDark ? '#555' : '#666'};"
          >
            {slide.body}
          </p>
        </div>

        <!-- Footer — progress bar + nav -->
        <div class="flex items-center gap-6">
          <!-- Barras de progreso -->
          <div class="flex gap-2 flex-1">
            {#each SLIDES as _, si}
              <button
                class="h-[2px] flex-1 transition-all duration-500 cursor-pointer"
                style="background: {si === currentSlide
                  ? '#ef5b5b'
                  : slide.textDark
                    ? '#ccc'
                    : '#2a2a2a'};"
                onclick={() => goTo(si, si > currentSlide ? 1 : -1)}
              ></button>
            {/each}
          </div>

          <!-- Flechas -->
          <div class="flex gap-2">
            <button
              onclick={prev}
              disabled={currentSlide === 0}
              class="w-10 h-10 flex items-center justify-center border transition-all duration-200 disabled:opacity-20"
              style="
                border-color:{slide.textDark ? '#ccc' : '#333'};
                color:{slide.textDark ? '#333' : '#f5f3ee'};
              "
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 3L5 8L10 13"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button
              onclick={next}
              disabled={currentSlide === TOTAL - 1}
              class="w-10 h-10 flex items-center justify-center border transition-all duration-200 disabled:opacity-20"
              style="
                border-color:{slide.textDark ? '#ccc' : '#333'};
                color:{slide.textDark ? '#333' : '#f5f3ee'};
                background:{currentSlide < TOTAL - 1
                ? '#ef5b5b'
                : 'transparent'};
                border-color:{currentSlide < TOTAL - 1 ? '#ef5b5b' : ''};
                color:{currentSlide < TOTAL - 1 ? 'white' : ''};
              "
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 3L11 8L6 13"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  {/each}
</section>
