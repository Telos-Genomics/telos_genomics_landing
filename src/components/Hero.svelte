<script>
  import { onMount, onDestroy } from "svelte";
  import { Button } from "flowbite-svelte";
  import { ArrowRightOutline } from "flowbite-svelte-icons";
  import * as THREE from "three";
  import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
  import spikeModel from "../resources/spike.glb?url";

  let containerElement;
  let renderer;
  let scene;
  let camera;
  let animationId;

  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      containerElement.clientWidth / containerElement.clientHeight,
      0.1,
      1000,
    );

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerElement.clientWidth,
      containerElement.clientHeight,
    );
    renderer.setClearColor(0x191919);
    containerElement.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load(
      spikeModel,
      (gltf) => {
        scene.add(gltf.scene);
        camera.position.z = 25;
      },
      undefined,
      (error) => console.error("Error:", error),
    );
  }

  function animate() {
    animationId = requestAnimationFrame(animate);
    const model = scene.children.find((child) => child.type === "Group");
    if (model) model.rotation.y += 0.0002;
    renderer.render(scene, camera);
  }

  onMount(() => {
    init();
    animate();
  });

  onDestroy(() => {
    if (typeof window !== "undefined") {
      if (animationId) cancelAnimationFrame(animationId);
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
      }
    }
  });
</script>

<section id="hero" class="relative">
  <!-- Three.js canvas — absolute, behind everything -->
  <div
    bind:this={containerElement}
    class="absolute inset-0 z-[-1] w-full h-screen border border-[#333] bg-black"
  ></div>

  <!-- Overlay -->
  <div
    class="flex items-center min-h-screen w-full bg-gray-700/25 shadow-inner backdrop-blur-sm"
  >
    <div
      class="px-5 py-8 mx-auto bg-radial-[at_50%_50%] from-transparent via-slate-900/40 to-slate-900/80 rounded-md w-5/6"
    >
      <section class="hero flex flex-col h-full my-8">
        <h1
          class="mb-8 text-4xl font-extrabold text-gray-300 text-center tracking-tight md:text-5xl md:leading-(--5xl-line-height) xl:text-6xl xl:leading-(--6xl-line-height)"
        >
          Predictive Genomic
        </h1>
        <h1
          class="mb-8 text-4xl font-extrabold text-gray-300 text-center tracking-tight md:text-5xl md:leading-(--5xl-line-height) xl:text-6xl xl:leading-(--6xl-line-height)"
        >
          Surveillance Engine
        </h1>
        <p
          class="mb-4 mt-10 font-light text-gray-300 text-center lg:mb-4 md:text-lg lg:text-2xl sm:px-0 lg:px-0 xl:px-0"
        >
          Telos Genomics transforms genomic sequences into actionable risk
          signals weeks before the next pandemic disrupts the economic chains.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            href="#contact_us"
            color="primary"
            size="xl"
            class="transition-colors"
          >
            Contact Us <ArrowRightOutline class="me-2 h-6 w-6" />
          </Button>
        </div>
      </section>
    </div>
  </div>
</section>
