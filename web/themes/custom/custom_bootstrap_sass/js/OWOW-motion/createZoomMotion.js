async function createZoomMotion(target, options) {
    const targetElement = document.querySelector(target)
    if (!targetElement) return
    // not needed because gsap is already loaded
    // await (async () => {
    //     const { gsap } = await import("https://cdn.skypack.dev/gsap")
    //     const { ScrollTrigger } = (
    //         await import("https://cdn.skypack.dev/gsap/ScrollTrigger")
    //     ).default
    //     gsap.registerPlugin(ScrollTrigger)
    // })()

    const {
        direction: motionDirection = "in",
        trigger: motionTrigger = targetElement,
        ease: motionEase = "ease",
        scale: motionScale = 2,
        start: motionStart = "top",
        end: motionEnd = 1000,
        pin: motionPin = false,
    } = options

    const animationDirection = motionDirection === "in" ? gsap.to : gsap.from
    if (window.zoomMotion) {
        window.zoomMotion.kill()
        ScrollTrigger.refresh()
    }
    gsap.config({
        force3D: true,
    })

    window.zoomMotion = animationDirection(targetElement, {
        scrollTrigger: {
            trigger: motionTrigger,
            start: `${motionStart}`,
            end: `bottom+=${motionEnd} bottom`,
            scrub: true,
            markers: true,
        },
        ease: motionEase,
        clipPath: `inset(0 ${motionScale}px)`,
    })

    // to do: only trigger if pin is not a boolean, make sure pin: true works too
    if (motionPin) {
        const wrapper = document.createElement("div")
        wrapper.classList.add("zoom-motion-wrapper")
        const pinContainer =
            typeof motionPin !== "boolean"
                ? document.querySelector(motionPin)
                : targetElement
        pinContainer.before(wrapper)
        wrapper.appendChild(pinContainer)
        const totalHeight = parseInt(motionEnd) + pinContainer.offsetHeight
        wrapper.style.height = `${totalHeight}px`
        pinContainer.style.cssText =
            motionDirection === "out"
                ? `position: sticky; top: 0; transform: scale(${motionScale})`
                : "position: sticky; top: 0"
    }
}
export { createZoomMotion }
