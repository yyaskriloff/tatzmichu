form.addEventListener("submit", e => {
    e.preventDefault();
    submitter.style.display = "none"
    const donation = new Request('/donate');
    let body = {}
    let response = {}
    for (let i of inputs) {
        body[i.attributes.name.value] = i.value
    }
    const myInit = {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(body),
    };
    fetch(donation, myInit)
        .then(res => {
            if (res.ok) {
                form.style.display = "none";
                fail.style.display = "none"
                success.style.display = "block";
            } else {
                return res.json()
            }
        })
        .then(data => {
            if (data) {
                const { message } = data
                console.log(message)
                const text = document.querySelector("#fail")
                //empty_sum, missing_cc_number, bad_cc_number, bad_token, bad_cc_validity, cc_expired
                switch (message.toLowerCase()) {
                    case "empty_sum":
                        text.innerText = "No amount was given"
                        break;
                    case "missing_cc_number":
                    case "bad_cc_number":
                        text.innerText = "The credit card number entered is invalid."
                        break;
                    // case "bad_token":
                    //     console.log("something went wrong")
                    //     break;
                    case "bad_cc_validity":
                        text.innerText = "The experation date entered is invalid."
                        break;
                    case "cc_expired":
                        text.innerText = "The credit card experation date has already past"
                        break;
                    default:
                        console.log("something unexpected happened");
                }
                fail.style.display = "block"
                submitter.style.display = "block"
            }
        })
        .catch(e => {
            console.log(e)
            fail.style.display = "block"
        })
})
