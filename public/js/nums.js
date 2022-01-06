const numsOnly = (event) => {
    event.preventDefault()
    const value = event.target.value || event.target.innerHTML
    const { length } = value
    const limit = event.target.dataset["limit"]
    if (parseInt(event.key) || parseInt(event.key) === 0) {
        if (length < limit) {
            event.target.value += event.key
        }
    } else if (event.key === "Backspace") {
        event.target.value = value.slice(0, value.length - 1)
    }
}

for (let num of numsIn) {
    num.addEventListener('keydown', numsOnly)
}

displayAmount.addEventListener('keydown', (e) => {
    let value = e.target.innerHTML
    e.preventDefault()
    if (parseInt(e.key) || parseInt(e.key) === 0) {
        e.target.innerHTML += e.key
    } else if (e.key === "Backspace") {
        e.target.innerHTML = value.slice(0, value.length - 1)
    }
    for (let card of cards) {
        if (e.target.innerHTML == card.dataset["amount"]) {
            card.style.borderColor = "#4356b7"
        } else {
            card.style.borderColor = "#e8eaff"
        }
    }
    inputAmount.value = e.target.innerHTML
})