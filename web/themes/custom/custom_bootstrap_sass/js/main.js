import { createPageTransition } from "./OWOW-motion/createPageTransition.js"
import { createZoomMotion } from "./OWOW-motion/createZoomMotion.js"
import { initHome } from "./home.js"
import {
    createMarquee,
    createPhysicsBasedMotion,
    getMousePosition,
    createMotion,
} from "https://cdn.skypack.dev/@owowagency/gsap-motion"

createMarquee(".footer-marquee", {
    speed: 2,
    scrollVelocity: 0.03,
})

//Menu motion
const menuEmoji = document.querySelector(".menu-emoji")
const speed = 1
const damping = 0.6
const response = 0
let dynamicsX = createPhysicsBasedMotion(speed, damping, response, 0)
let prevTime = 0
let prevRotation = 0
let menuHover = false
let menuWidth = document
    .querySelector(".menu-content")
    .getBoundingClientRect().width
const emojiWidth = menuEmoji.getBoundingClientRect().width
const menuEmojiContent = ["🤝", "📖", "🗂️"]
let isMenuActive = false

const updateMenu = (currentTime) => {
    const deltaTime = (currentTime - prevTime) / 1000
    const mouseX = getMousePosition().client.x
    if (deltaTime === 0) return
    const targetX =
        dynamicsX.update(deltaTime, mouseX) -
        window.innerWidth -
        emojiWidth / 2 +
        menuWidth
    const rotation = targetX
    const delataRotation = (prevRotation - rotation) * 0.5
    prevRotation = rotation
    menuEmoji.style.transform = `translate3d(${targetX}px, 0, 0) skewX(${delataRotation}deg) `
    prevTime = currentTime
    menuHover
        ? requestAnimationFrame(updateMenu)
        : cancelAnimationFrame(updateMenu)
}

const menuIcon = document.querySelector(".nav-menu-btn")
const menu = document.querySelector(".menu")
const menuLinks = document.querySelectorAll(".menu-links .nav-link")
menuIcon.addEventListener("click", function () {
    menu.classList.toggle("is-active")
    isMenuActive = !isMenuActive
})

menuLinks.forEach((link, index) => {
    link.addEventListener("click", function () {
        menu.classList.toggle("is-active")
        isMenuActive = !isMenuActive
        document.body.style.height = "auto"
    })
    link.addEventListener("mouseover", function () {
        menuHover = true
        menuEmoji.textContent = menuEmojiContent[index]
        menuEmoji.classList.add("is-active")
        requestAnimationFrame(updateMenu)
    })
    link.addEventListener("mouseout", function () {
        menuEmoji.classList.remove("is-active")
        menuHover = false
    })
})

const menuOverlay = document.querySelector(".menu-overlay")
menuOverlay.addEventListener("click", function () {
    menu.classList.remove("is-active")
    isMenuActive = false
})

const header = document.querySelector("header")

window.addEventListener("scroll", function () {
    if (this.oldScroll < this.scrollY && isMenuActive === false) {
        header.classList.add("is-hidden")
    } else {
        header.classList.remove("is-hidden")
    }
    this.oldScroll = this.scrollY
})

function resize() {
    menuWidth = document
        .querySelector(".menu-content")
        .getBoundingClientRect().width
}

window.addEventListener("resize", resize)

const init = () => {
    if (document.querySelector('[data-barba-namespace="project"]')) {
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        const text = urlParams.get("fr") ? "leeswijzer" : "projecten"
        let title = document.querySelector(".project-title").textContent.trim()
        const breadcrumb = document.getElementById("js-breadcrumb")
        breadcrumb.innerHTML = `< Terug naar ${text}`
        breadcrumb.href = `./${text}#Documentatie prototyping`
    }

    resize()

    document.querySelector(".content").style.clipPath = "none"
    menu.classList.remove("is-active")
    window.footerMotion = gsap.fromTo(
        "footer",
        { y: -160 },
        {
            scrollTrigger: {
                trigger: "footer",
                start: "top bottom",
                end: "bottom bottom",
                scrub: true,
            },
            y: 0,
        }
    )
    const targetContent = document.querySelector(".content")
    const targetHeight = targetContent.getBoundingClientRect().height

    //Parallax
    const parallaxTargets = document.querySelectorAll(".parallax")
    const homeProjectsParallax = document.querySelectorAll(".home-project-img")
    homeProjectsParallax.forEach((p, i) => {
        new simpleParallax(p, {
            scale: 1.2,
            delay: i * 1.5,
        })
    })
    new simpleParallax(parallaxTargets, {
        scale: 1.1,
    })

    createZoomMotion(".content", {
        direction: "in",
        trigger: "footer",
        ease: "linear",
        scale: 40, // Scale is now based on the ratio of window height to content height
        start: "top+=200 bottom",
        end: "0",
    })

    createPageTransition({
        leave: [
            {
                target: ".transition",
                keyframes: {
                    transform: [
                        "translate3D(0, 100vh, 0)",
                        "translate3D(0, 0, 0)",
                    ],
                    borderRadius: ["50%", "0"],
                    backdropFilter: [
                        "brightness(1) blur(0)",
                        "brightness(.2) blur(100px)",
                    ],
                },
                duration: 1000,
                ease: "cubic-bezier(0,1,1,1)",
            },
            {
                target: "main",
                keyframes: {
                    paddingTop: "80px",
                },
                duration: 1000,
                ease: "ease",
            },
            {
                target: ".transition-logo",
                keyframes: {
                    transform: "rotate3d(0, 1, 0, 180deg)",
                },
                duration: 1000,
                ease: "ease",
            },
        ],
        enter: [
            {
                target: ".transition",
                keyframes: {
                    transform: [
                        "translate3D(0, 0, 0)",
                        "translate3D(0, -100vh ,0)",
                    ],
                },
                duration: 1000,
                ease: "ease",
            },
            {
                target: "main",
                keyframes: {
                    paddingTop: ["80px", "0px"],
                },
                duration: 1000,
                ease: "ease",
            },
            {
                target: ".transition-logo",
                keyframes: {
                    transform: [
                        "rotate3d(0, 1, 0, 180deg)",
                        "rotate3d(0, 1, 0, 0)",
                    ],
                },
                duration: 1000,
                ease: "ease-out",
            },
        ],
    })

    //Logo

    if (document.querySelector('[data-barba-namespace="home"]')) {
        const splineScript = document.getElementById("spline-script")
        if (splineScript) {
            splineScript.remove()
        }
        var newScript = document.createElement("script")
        newScript.id = "spline-script"
        newScript.src =
            "https://unpkg.com/@splinetool/viewer@1.0.87/build/spline-viewer.js"
        newScript.type = "module"
        const scriptContainer = document.querySelector(".barba-main")
        scriptContainer.appendChild(newScript)
        //Landing intro
        gsap.to(".landing-title--1", {
            y: 0,
            duration: 1,
            ease: "expo",
            delay: 0.4,
        })
        gsap.to(".landing-title--2", {
            y: 0,
            duration: 1,
            ease: "expo",
            delay: 0.5,
        })
        gsap.from("#js-logo", {
            delay: 1.6,
            scale: 0,
        })
    }

    gsap.to(".project-title", {
        y: 0,
        duration: 1,
        ease: "expo",
        delay: 0.4,
    })

    //Text reveal
    var textReveal = document.querySelectorAll(".reveal")
    textReveal.forEach((text) => {
        var characters = text.innerHTML.split("")
        text.innerHTML = ""
        characters.forEach(function (el) {
            var span = document.createElement("span")
            span.classList.add("reveal-span")
            var content = document.createTextNode(el)
            span.appendChild(content)
            text.appendChild(span)
        })
        gsap.to(text.querySelectorAll(".reveal-span"), {
            scrollTrigger: {
                trigger: text,
                start: "-100px center",
                end: "bottom-=240px center",
                scrub: 2,
            },
            opacity: 1,
            stagger: 0.1,
        })
    })

    initHome()
}
init()
export { init }
