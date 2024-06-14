let pageTransitionCreated = false

async function createPageTransition(options) {
    if (pageTransitionCreated) return
    pageTransitionCreated = true

    let barba, init

    await (async () => {
        barba = (await import("https://unpkg.com/@barba/core@2?module")).default
        init = (await import("../main.js")).init
    })()

    let allTargets = []

    let transitionObjects = []

    let redirecting = false
    let scrollTo

    const processTransitionOptions = (transitionOptions) => {
        transitionObjects.push({
            from: {
                namespace: transitionOptions.fromNamespace,
            },
            to: {
                namespace: transitionOptions.toNamespace,
            },
            sync: transitionOptions.sync,
            leave({ current, next }) {
                const leaveVars = transitionOptions.leaveVars
                leaveVars && leaveVars({ current, next })
                document.body.classList.add("is-transitioning")
                return new Promise((resolve) => {
                    animateElement(
                        transitionOptions.leave,
                        resolve,
                        current.container
                    )
                })
            },
            afterLeave({ current }) {
                scrollTo =
                    current.namespace === "project" &&
                    current.container
                        .querySelector(".project-title")
                        .textContent.trim()
                current.container.remove()
            },
            beforeEnter({ next }) {
                init()
                window.scrollTo(0, 0)
                console.log(next.namespace)
                if (next.namespace === "leeswijzer" && scrollTo) {
                    location.hash = `#${scrollTo}`
                }
            },
            enter({ current, next }) {
                const enterVars = transitionOptions.enterVars
                enterVars && enterVars({ current, next })
                return new Promise((resolve) => {
                    animateElement(
                        transitionOptions.enter,
                        resolve,
                        next.container
                    )
                })
            },
            afterEnter({ next }) {
                document.body.classList.remove("is-transitioning")
                next.container.classList.remove("is-transitioning")
                redirecting = false
            },
        })
    }

    if (Array.isArray(options)) {
        options.forEach(processTransitionOptions)
    } else {
        processTransitionOptions(options)
    }

    barba.init({
        preventRunning: true,
        transitions: transitionObjects,
    })

    function animateElement(vars, resolve, thisContainer) {
        let animationCount = 0
        thisContainer.classList.add("is-transitioning")
        const processAnimation = (options) => {
            const targetElements =
                options.target === "main"
                    ? [thisContainer]
                    : document.querySelectorAll(options.target)
            targetElements.forEach((targetElement) => {
                targetElement.classList.add("is-transitioning")
                allTargets.push(targetElement)
                if (options.delay) {
                    //if element has delay, set initial keyframe value
                    Object.values(options.keyframes).forEach((value, index) => {
                        if (Array.isArray(value)) {
                            const property = Object.keys(options.keyframes)[
                                index
                            ]
                            targetElement.style[property] = value[0]
                        }
                    })
                }
                targetElement.animate(options.keyframes, {
                    duration: options.duration,
                    fill: "forwards",
                    easing: options.ease,
                    delay: options.delay,
                }).onfinish = () => {
                    animationCount++
                    if (
                        animationCount ===
                        (Array.isArray(vars)
                            ? allTargets.length
                            : targetElements.length)
                    ) {
                        allTargets.forEach((target) =>
                            target.classList.remove("is-transitioning")
                        )
                        allTargets = []
                        return resolve()
                    }
                }
            })
        }
        Array.isArray(vars)
            ? vars.forEach(processAnimation)
            : processAnimation(vars)
    }
}

export { createPageTransition }
