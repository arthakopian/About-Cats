const RANDOM_IMAGE_URL = 'https://api.thecatapi.com/v1/images/search';
const CAT_BREEDS = 'https://api.thecatapi.com/v1/breeds'
const randomImg = document.querySelectorAll('.random-image')
const randomImageBtn = document.querySelector('.random-image--button')
const loading = document.querySelectorAll('.load')

async function getImageAndDraw() {
    try {
        randomImg.forEach(el => {
            el.innerHTML = ''
            let load = document.createElement('img')
            load.src = '../img/load.jpg'
            load.classList.add('load')
            el.append(load)
        })

        const fetchArr = []
        for (let i = 0; i < 3; i++) {
            fetchArr.push(fetch(RANDOM_IMAGE_URL))           
        }

        let response = await Promise.all(fetchArr)
        let data = await Promise.all(response.map(r => r.json()))
        const allImages = []
        data.forEach(d => {
            let img = document.createElement('img')
            img.src = d[0].url
            allImages.push(img)
        })

        let imagesLoadPromises = allImages.map(image => {
            return new Promise(res => {
                image.onload = () => res(image)
            })
        })

        await Promise.all(imagesLoadPromises)
        randomImg.forEach((img, i) => {
            img.innerHTML = ''
            img.append(allImages[i])
            loading.forEach(el => el.classList.remove('open'))
        })

    } catch (error) {
        console.error('Error fetching the image:', error)
    }

}

getImageAndDraw()
randomImageBtn.addEventListener('click', getImageAndDraw)

let datas
async function getCatBreeds(){
    try {
        let responses = await fetch(CAT_BREEDS)
        datas = await responses.json()
    
        datas.forEach(data => {
            let breedLi = document.createElement('li')
            breedLi.innerText = data.name
            document.querySelector('.breed-list').append(breedLi)
        })
    } catch (error) {
        console.error('Error fetching the breeds:', error)

    }
}
getCatBreeds()


async function getCurrentCatBreed(current){
    clearListing()
    const currentObj = datas.find(data => data.name === current.innerText)
    let response = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${currentObj.id}`)
    let data = await response.json()
    let source = data[0].url
    let img = document.createElement('img')
    img.src = source
    document.querySelector('.listing-img h1').innerText = currentObj.name
    document.querySelector('.listing-img a').innerText = currentObj.wikipedia_url
    document.querySelector('.listing-img a').href = currentObj.wikipedia_url
    document.querySelector('.listing-img h2').innerText = currentObj.origin
    document.querySelector('.listing-description').innerText = currentObj.description
    document.querySelector('.listing-img').prepend(img)
}

function clearListing(){
    const listingImgH1 = document.querySelector('.listing-img h1');
    const listingImgA = document.querySelector('.listing-img a');
    const listingImgH2 = document.querySelector('.listing-img h2');
    const listingDescription = document.querySelector('.listing-description');
    const listingImg = document.querySelector('.listing-img img');
    
    if (listingImgH1) listingImgH1.innerText = '';
    if (listingImgA) {
        listingImgA.innerText = '';
        listingImgA.href = '';
    }
    if (listingImgH2) listingImgH2.innerText = '';
    if (listingDescription) listingDescription.innerText = '';
    if (listingImg) listingImg.remove();
}

function setActiveListing(current){
    const allBreeds = document.querySelectorAll('.breed-list li')
    allBreeds.forEach(breed => breed.classList.remove('active'))
    current.classList.add('active')
}

document.querySelector('.breed-list').addEventListener('click',function(event){
    const current = event.target.closest('li')
    if (current) {
        getCurrentCatBreed(current)
        setActiveListing(current)
    }
})

window.addEventListener('scroll', function(){
    document.querySelector('.up').classList.toggle('active', window.scrollY > 500)
})

document.querySelector('.up').addEventListener('click',function(){
    scrollTo({
        top: 0
    })
})