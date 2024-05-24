import { createPageTransition } from "./OWOW-motion/createPageTransition.js"
import { createZoomMotion } from "./OWOW-motion/createZoomMotion.js"
import { initHome } from "./home.js"
import {
    createMarquee,
    createMotion,
} from "https://cdn.skypack.dev/@owowagency/gsap-motion"

createMarquee(".footer-marquee", {
    speed: 2,
    scrollVelocity: 0.03,
})

const menuIcon = document.querySelector(".nav-menu-btn")
const menu = document.querySelector(".menu")
menuIcon.addEventListener("click", function () {
    menu.classList.toggle("is-active")
    window.scrollTo({ top: 0, behavior: "smooth" })
    document.body.style.height = "100vh"
})

const init = () => {
    menu.classList.remove("is-active")
    window.footerMotion && window.footerMotion.kill()
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
                    backdropFilter: ["brightness(1) blur(0)", "brightness(.2) blur(100px)", ]

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

    //Parallax
    const parallax = document.querySelectorAll(".parallax")
    new simpleParallax(parallax, {})
    //Logo
    var vh = window.innerHeight
    var tl = gsap.timeline()
    var logo = document.getElementById("js-logo")

    //Landing intro
    gsap.from(".project-title, .landing-title--1", {
        y: 160,
        duration: 1,
        ease: "expo",
        delay: 0.4,
    })
    gsap.from(".landing-title--2", {
        y: 160,
        duration: 1,
        ease: "expo",
        delay: 0.5,
    })
    gsap.from(logo, {
        delay: 1.6,
        scale: 0,
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
