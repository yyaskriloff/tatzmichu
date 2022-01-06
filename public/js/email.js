form.addEventListener("submit", e => {
    e.preventDefault();
    const donation = new Request('/');
    let body = {}
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
            console.log(res)
            if (res.ok) {
                form.style.display = "none";
                fail.style.display = "none"
                success.style.display = "block";
            } else {
                fail.style.display = "block"
                return res.json()
            }
        })
        .then(data => {
            console.log(data)
        })
        .catch(e => {
            console.log(e)
            fail.style.display = "block"
        })
})