
/* =========================================
   PEG DIGITAL — SCRIPT.JS
   Menu, filtros, animações e navegação
========================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // =====================================
    // ELEMENTOS PRINCIPAIS
    // =====================================

    const menuToggle = document.querySelector("#menuToggle");
    const mainNav = document.querySelector("#mainNav");
    const navLinks = document.querySelectorAll(".nav-link");

    const filterButtons = document.querySelectorAll(".filter-button");
    const projectCards = document.querySelectorAll(".project-card");

    const filterEmpty = document.querySelector("#filterEmpty");
    const currentYear = document.querySelector("#currentYear");

    // =====================================
    // ANO AUTOMÁTICO NO RODAPÉ
    // =====================================

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // =====================================
    // MENU RESPONSIVO
    // =====================================

    function closeMenu() {
        if (!menuToggle || !mainNav) return;

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");

        mainNav.classList.remove("is-open");
    }

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            const isExpanded =
                menuToggle.getAttribute("aria-expanded") === "true";

            menuToggle.setAttribute(
                "aria-expanded",
                String(!isExpanded)
            );

            menuToggle.setAttribute(
                "aria-label",
                isExpanded ? "Abrir menu" : "Fechar menu"
            );

            mainNav.classList.toggle("is-open", !isExpanded);
        });

        // Fecha o menu após clicar em um link.
        navLinks.forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        // Fecha o menu ao clicar fora dele.
        document.addEventListener("click", (event) => {
            const clickedInsideMenu = mainNav.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideMenu && !clickedToggle) {
                closeMenu();
            }
        });

        // Fecha o menu ao pressionar Escape.
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
                menuToggle.focus();
            }
        });

        // Evita manter o menu mobile aberto no desktop.
        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) {
                closeMenu();
            }
        });
    }

    // =====================================
    // FILTROS DE PROJETOS
    // =====================================

    function filterProjects(filter) {
        let visibleCount = 0;

        projectCards.forEach((card) => {
            const status = card.dataset.status;

            let shouldShow = false;

            if (filter === "todos") {
                shouldShow = true;
            } else if (filter === "online") {
                shouldShow = status === "online";
            } else if (filter === "desenvolvimento") {
                shouldShow = status === "desenvolvimento";
            }

            card.hidden = !shouldShow;

            if (shouldShow) {
                visibleCount++;
            }
        });

        // Mostra uma mensagem caso não existam projetos.
        if (filterEmpty) {
            filterEmpty.hidden = visibleCount !== 0;
        }

        // Atualiza o estado visual e acessível dos filtros.
        filterButtons.forEach((button) => {
            const isActive = button.dataset.filter === filter;

            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;

            if (!filter) return;

            filterProjects(filter);
        });
    });

    // Inicializa o filtro padrão.
    filterProjects("todos");

    // =====================================
    // ANIMAÇÕES AO ROLAR A PÁGINA
    // =====================================

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback para navegadores antigos.
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });
    }

    // =====================================
    // DESTAQUE DA SEÇÃO ATUAL NO MENU
    // =====================================

    const sections = document.querySelectorAll(
        "main section[id], section[id]"
    );

    if ("IntersectionObserver" in window && sections.length > 0) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const currentId = entry.target.id;

                    navLinks.forEach((link) => {
                        const href = link.getAttribute("href");

                        const isCurrent = href === `#${currentId}`;

                        link.classList.toggle("active", isCurrent);

                        if (isCurrent) {
                            link.setAttribute("aria-current", "location");
                        } else {
                            link.removeAttribute("aria-current");
                        }
                    });
                });
            },
            {
                rootMargin: "-25% 0px -60% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }

    // =====================================
    // ANO E LINKS EXTERNOS
    // =====================================

    // Links externos abrem em uma nova aba quando
    // o HTML já define target="_blank".
    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
        const currentRel = link.getAttribute("rel") || "";

        const relValues = new Set(currentRel.split(/\s+/).filter(Boolean));

        relValues.add("noopener");
        relValues.add("noreferrer");

        link.setAttribute("rel", [...relValues].join(" "));
    });

    // =====================================
    // CONSOLE
    // =====================================

    console.info("PEG Digital iniciado com sucesso.");
});
