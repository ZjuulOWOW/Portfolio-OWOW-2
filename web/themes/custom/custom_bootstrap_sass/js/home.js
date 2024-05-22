const initHome = () => {
    //Service
    gsap.from(".hoop--service", {
        scrollTrigger: {
            trigger: ".section--service",
            start: "-500px center",
            end: "1000px center",
            scrub: true,
        },
        y: 600,
    })

    gsap.to(".service-img--star", {
        scrollTrigger: {
            trigger: ".section--service",
            start: "-100px center",
            end: "bottom center",
            scrub: 1,
        },
        rotate: 90,
    })
    //About
    gsap.to(".about-el", {
        scrollTrigger: {
            trigger: ".about",
            start: "-500px 200px",
            end: "bottom 200px",
            scrub: 1,
        },
        y: gsap.utils.wrap(["+=160", "+=320", "+=80"]),
        rotate: gsap.utils.wrap(["180deg", "90deg", "0"]),
    })
}

initHome()

export { initHome }