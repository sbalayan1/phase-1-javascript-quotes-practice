fetchQuotes().then(data => {data.forEach(quote => {renderQuote(quote)})})
createFormEvent()

function fetchQuotes() {
    return fetch('http://localhost:3000/quotes?_embed=likes')
    .then(res => res.json())
}

function renderQuote(quote) {
    const container = document.getElementById("quote-list")
    const li = document.createElement('li')
    const blockQuote = document.createElement('blockquote')
    const p = document.createElement('p')
    const footer = document.createElement('footer')
    const br = document.createElement('br')
    const span = document.createElement('span')
    const button1 = document.createElement('button')
    const button2 = document.createElement('button')

    li.classList.add("quote-card")
    blockQuote.classList.add("blockquote")
    p.classList.add("mb-0")
    footer.classList.add("blockquote-footer")
    button1.classList.add("btn-success")
    button2.classList.add("btn-danger")

    p.textContent = quote.quote
    footer.textContent = quote.author
    span.textContent  = quote.likes.length
    button1.textContent = "Likes: "
    button2.textContent = "Delete"

    button1.addEventListener('click', () => {
        likeQuote(quote, span)
    })

    button2.addEventListener('click', () => {
        deleteQuote(quote, li)
    })

    button1.append(span)
    blockQuote.append(p, footer, br, button1, button2)
    li.append(blockQuote)
    container.append(li)
}

function createFormEvent() {
    const form = document.getElementById('new-quote-form')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const quote = {}
        const children = form.children 
        let i = 0


        while (i<children.length-1) {
            const child = children[i].querySelector('.form-control')
            quote[child.name] = child.value
            i++
        }
        postQuote(quote)
    })
}

function postQuote(quote) {
    fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/json',
            'Accept': 'Application/json'
        },
        body: JSON.stringify(quote)
    })
    .then(res => res.json())
    .then(data => {
        data["likes"] = 0
        renderQuote(data)
    })
}

function likeQuote(quote, span) {

    const likesObj = {
        quoteId: quote.id,
        createdAt: Date.now()
    }

    fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/json',
            'Accept': 'Application/json'
        },
        body: JSON.stringify(likesObj)
    })
    .then(res => res.json())
    .then(data => {
        span.textContent = parseInt(span.textContent, 10) + 1
    })
}

function deleteQuote(quote, li) {
    fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'Application/json'}
    })
    const container = document.getElementById("quote-list")
    container.removeChild(li)
}