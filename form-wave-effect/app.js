const labels = document.querySelectorAll('.form-control label')

// console.log(labels)

labels.forEach(label => {

    const spanify = label.innerText
    .split('')
    .map((letter, idx) => `<span>${letter}</span>`)
    .join('')

    label.innerHTML = spanify;

    // console.log(spanify)
})
