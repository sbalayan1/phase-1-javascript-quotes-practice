fetchQuotes().then(data => {data.forEach(quote => {renderQuote(quote)})})
createFormEvent(document.getElementById('new-quote-form'), "create")

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
    const button3 = document.createElement('button')

    let editFormState = false

    li.id = quote.id
    li.classList.add("quote-card")
    blockQuote.classList.add("blockquote")
    p.classList.add("mb-0")
    footer.classList.add("blockquote-footer")
    button1.classList.add("btn-success")
    button2.classList.add("btn-danger")
    button3.classList.add("btn")

    p.name = "quote"
    footer.name = "author"

    p.textContent = quote.quote
    footer.textContent = quote.author
    span.textContent  = quote.likes.length
    button1.textContent = "Likes: "
    button2.textContent = "Delete"
    button3.textContent = "Edit"

    button1.addEventListener('click', () => {
        likeQuote(quote, span)
    })

    button2.addEventListener('click', () => {
        deleteQuote(quote, li)
    })

    button3.addEventListener('click', () => {
        editFormState = !editFormState //changes initial state from false to true
        editFormState ? viewEditForm(quote, li) : hideEditForm(li)
       
    })

    button1.append(span)
    blockQuote.append(p, footer, br, button1, button2, button3)
    li.append(blockQuote)
    container.append(li)
}

function createFormEvent(form, type, li=null) {
    // const form = document.getElementById('new-quote-form')
    form.addEventListener('submit', (e) => {
        e.preventDefault()

        console.log('firing')
        
        const quote = {}
        const children = form.children 
        let i = 0

        while (i<children.length-1) {
            const child = children[i].querySelector('.form-control')
            quote[child.name] = child.value
            i++
        }

        if (type === "create") postQuote(quote)
        if (type === "edit") {
            quote["id"] = li.id
            editQuote(quote, li)
        }
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

function editQuote(quote, li) {
    console.log(quote)
    fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'Application/json',
            'Accept': 'Application/json'
        },
        body: JSON.stringify(quote)
    })
    .then(res => res.json())
    .then(data => {
        let i = 0
        while(i< 2) {
            const child = li.children[0].children[i]
            child.textContent = data[child.name]
            i++
        }
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

function viewEditForm(quote, li) {
    const form = document.createElement('form')
    const div1 = document.createElement('div')
    const div2 = document.createElement('div')
    const quoteInput = document.createElement('input')
    const author = document.createElement('input')
    const button = document.createElement('button')

    quoteInput.name = "quote"
    quoteInput.type = "text"
    quoteInput.value = quote.quote
    quoteInput.classList.add('form-control')
    author.name = "author"
    author.type = "text"
    author.value = quote.author
    author.classList.add('form-control')
    button.textContent = "submit"
    button.type = "submit"

    createFormEvent(form, "edit", li)

    div1.append(quoteInput)
    div2.append(author)
    form.append(div1, div2, button)
    li.append(form)
}

function hideEditForm(li) {
    li.removeChild(li.lastChild)
}