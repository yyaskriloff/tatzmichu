
exp.addEventListener('keydown', (e) => {
    e.preventDefault()
    const { value } = e.target
    const { length } = value
    if (parseInt(e.key) || parseInt(e.key) === 0) {
        if (length < 5 && length != 2) {
            e.target.value += e.key
        } else if (length == 2) {
            e.target.value += `/${e.key}`
        }
    } else if (e.key === "Backspace") {
        if (length == 4) {
            e.target.value = value.slice(0, value.length - 2)
        } else {
            e.target.value = value.slice(0, value.length - 1)
        }
    }
})

