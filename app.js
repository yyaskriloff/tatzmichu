// the command npm install to download dependencies
if (process.env.NODE_ENV != 'production') { require('dotenv').config(); }
const express = require('express');
const app = express();
const port = process.env.PORT || 1099;
const https = require('https')
const nodemailer = require('nodemailer')
const helmet = require('helmet')
const fs = require('fs')


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://tatzmichu.org')
    next()
})

app.use(express.static('public'))
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
// app.use(helmet())

app.get('/', (req, res, next) => {
    res.sendFile('index.html')
})

app.post('/', async (req, res, next) => {
    const { name, email, Message } = req.body
    if (name == undefined || email == undefined) {
        return next(new Error(500))
    }
    try {
        let transporter = nodemailer.createTransport({
            // host: "smtp.gmail.com",
            // port: 587,
            // secure: false, // true for 465, false for other ports
            service: "gmail",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'yyaskriloff@gmail.com',
                pass: process.env.PASS,
            },
        });
        let info = await transporter.sendMail({
            from: '"Tatzmichu.org" <tatzmichu@gmail.com> ',
            to: 'office@tatzmichu.org',
            replyTo: email,
            subject: "New Contact Form",
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${Message}\n\n sent from tatzmichu.org contect form \n Developed by Aaron Skriloff`,

        })
            .then(info => {
                res.status(200).send()
            })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: e })
    }

})


app.get('/donate', (req, res, next) => {
    res.sendFile('public/donate.html', { root: __dirname })
})


app.post('/donate', (req, res, next) => {
    const body = req.body
    let data = {
        cid: process.env.ICOUNT_CID,
        user: process.env.ICOUNT_USER,
        pass: process.env.ICOUNT_PASS,
        client_name: body.client_name,
        sum: body.sum,
        num_of_payments: body.num_of_payments || 1,
        cc_number: body.cc_number,
        cc_cvv: body.cc_cvv,
        cc_validity: body.cc_validity,
        email: body.email,
        currency: "USD",
    }
    data = JSON.stringify(data)
    let options = {
        hostname: 'api.icount.co.il',
        // port: 443,
        path: '/api/v3.php/cc/bill',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }
    contactIcount(options, data).then(async r => {
        if (r.status) {
            let data = {
                cid: process.env.ICOUNT_CID,
                user: process.env.ICOUNT_USER,
                pass: process.env.ICOUNT_PASS,
                doctype: "trec",
                client_name: body.client_name,
                email: body.email,
                lang: "en",
                currency: "USD",
                tax_exempt: true,
                items: [
                    {
                        description: "Donation",
                        unitprice: r.sum,
                        quantity: 1
                    }
                ],
                cc: {
                    sum: r.sum,
                    card_number: "0000",
                    exp_year: r.exp_year,
                    exp_month: r.exp_month,
                    holder_name: body.client_name,
                    confirmation_code: r.confirmation_code
                },
                send_email: true,
                email_to_client: true,
                doc_title: "Donation receipt from Tazmichu.org ",
                email_comment: `We truely appreciate your donation of $${r.sum}.`,
                email_subject: "Donation receipt from Tazmichu.org ",
            }
            data = JSON.stringify(data)
            const options = {
                hostname: 'api.icount.co.il',
                port: 443,
                path: '/api/v3.php/doc/create',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            }
            res.status(200).json({ message: "charge accepted" })
            const result = await contactIcount(options, data);
            return result
        } else {
            res.status(422).json({ message: r.reason })
        }
    }).then(r => { console.log(r) }).catch(err => { res.status(500); console.log(err); })


})

app.use((req, res) => {
    res.sendFile('public/404.html', { root: __dirname })
})

app.use((err, req, res, next) => {
    res.status(500).send()
})



function contactIcount(options, data) {
    return new Promise((resolve, reject) => {
        const request = https.request(options, (response) => {
            response.setEncoding('utf8');
            let responseBody = '';

            response.on('data', (chunk) => {
                responseBody += chunk;
            });

            response.on('end', () => {
                resolve(JSON.parse(responseBody));
            });
        });

        request.on('error', (err) => {
            reject(err);
        });

        request.write(data)
        request.end();
    });
}



app.listen(port, () => { console.log(`listening on port ${port}`) })
