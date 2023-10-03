const loadText = document.querySelector('.loading-text')
const bg = document.querySelector('.bg')

let load = 0;

let int = setInterval(() => {
    blurring()
}, 30)


function blurring() {

    load++;
    // console.log(load)

    if (load > 99) {
        clearInterval(int)
    }

    loadText.innerText = `${load}%`;
    loadText.style.opacity = scale(load, 0, 100, 1, 0);

    let x = scale(load, 0, 100, 5, 0)
    bg.style.filter = `blur(${x}px)`;
    // console.log(x)

}

function scale (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
