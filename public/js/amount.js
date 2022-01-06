for (let card of cards) {
    card.addEventListener("click", (e) => {
        const amount = card.dataset["amount"]
        for (let c of cards) {
            c.style.borderColor = "#e8eaff"
        }
        card.style.borderColor = "#4356b7"
        displayAmount.innerText = amount
        inputAmount.value = amount
    })
}