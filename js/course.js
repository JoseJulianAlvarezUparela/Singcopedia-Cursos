document.addEventListener("DOMContentLoaded", () => {

  gsap.registerPlugin();

  const stations = gsap.utils.toArray(".station");
  const progressFill = document.querySelector(".progress-fill");
  const progressNodes = gsap.utils.toArray(".progress-nodes span");
  const routeLine = document.querySelector(".route-line");

  /*
  =========================
  ENTRADA DE TARJETAS
  =========================
  */

  gsap.set(stations, {
    opacity: 0,
    y: 80,
    filter: "blur(12px)"
  });

  gsap.to(stations, {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    duration: 1.2,
    stagger: 0.18,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".map-section",
      start: "top 70%"
    }
  });

  /*
  =========================
  LINEA CENTRAL
  =========================
  */

  gsap.fromTo(
    routeLine,
    {
      scaleY: 0,
      transformOrigin: "top center"
    },
    {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".map-section",
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    }
  );

  /*
  =========================
  ACTIVAR TARJETAS
  =========================
  */

  stations.forEach((station, index) => {

    ScrollTrigger.create({
      trigger: station,
      start: "top center",

      onEnter: () => {

        stations.forEach(s => {
          s.classList.remove("is-active");
        });

        station.classList.add("is-active");

        progressNodes.forEach((node, i) => {
          node.classList.toggle("is-active", i <= index);
        });

        if(progressFill){

          gsap.to(progressFill, {
            scaleY: (index + 1) / stations.length,
            transformOrigin: "top center",
            duration: 0.4
          });

        }

      },

      onEnterBack: () => {

        stations.forEach(s => {
          s.classList.remove("is-active");
        });

        station.classList.add("is-active");

        progressNodes.forEach((node, i) => {
          node.classList.toggle("is-active", i <= index);
        });

        if(progressFill){

          gsap.to(progressFill, {
            scaleY: (index + 1) / stations.length,
            transformOrigin: "top center",
            duration: 0.4
          });

        }

      }

    });

  });

  /*
  =========================
  HOVER FLOTANTE
  =========================
  */

  stations.forEach((station) => {

    const card = station.querySelector(".station-card");

    if(!card) return;

    station.addEventListener("mousemove", (e) => {

      const rect = station.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateY = gsap.utils.mapRange(
        0,
        rect.width,
        -8,
        8,
        x
      );

      const rotateX = gsap.utils.mapRange(
        0,
        rect.height,
        8,
        -8,
        y
      );

      gsap.to(card, {
        rotateX,
        rotateY,
        transformPerspective: 1200,
        transformOrigin: "center",
        duration: 0.4,
        ease: "power2.out"
      });

    });

    station.addEventListener("mouseleave", () => {

      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.7,
        ease: "elastic.out(1,0.4)"
      });

    });

  });

  /*
  =========================
  BOTONES
  =========================
  */

  const stationActions = gsap.utils.toArray(".station-action");

  stationActions.forEach((action) => {

    action.addEventListener("click", (event) => {

      if (action.getAttribute("aria-disabled") === "true") {
        event.preventDefault();
        return;
      }

      event.preventDefault();

      const destination =
        action.getAttribute("href") || "#footer";

      gsap.to(action, {
        scale: 0.92,
        duration: 0.08,
        yoyo: true,
        repeat: 1
      });

      const label = action.querySelector("span");

      const original =
        label?.textContent || "Iniciar curso";

      if(label){
        label.textContent = "Cargando...";
      }

      action.classList.add("is-loading");

      setTimeout(() => {

        if(label){
          label.textContent = original;
        }

        action.classList.remove("is-loading");

        if(destination.startsWith("#")){

          gsap.to(window, {
            duration: 1.2,
            scrollTo: destination,
            ease: "power2.inOut"
          });

          return;
        }

        window.location.href = destination;

      }, 700);

    });

  });

});
