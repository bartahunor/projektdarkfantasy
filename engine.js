let allCards = [];
let currentCard = null;

async function start() {
  // Betöltés
  const response = await fetch('converter/infok_generated.json');
  allCards = await response.json();
  console.log('✓ Betöltve!');
}


const inventory = ["lebegeskopenye"]; // Példa inventory tárgyak

// Feltétel ellenőrzése - van e az inventory-ban a szükséges tárgy
function condHaving(condition, inventory) {
    let cond = condition.replace('tombNev', 'inventory');
    const hasItem = eval(cond);
    return hasItem;
}


// Kártya megjelenítése
function showCard(cardId) {
    currentCard = allCards.find(card => card.id === cardId);
    if (!currentCard) {
        console.log('Nincs ilyen kártya!');
        return;
    }
    console.log('Kártya:', currentCard.id);
    

    //Befejező kártya kezelése
    if (currentCard.end === true) {
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        carouselItem.innerHTML = `
            <div class="page-container">
                <div class="page left-page">
                    <div class="page-title">
                        ${String(currentCard.id)}. oldal
                    </div>
                    <div class="page-content">
                        ${currentCard.text || ''}
                    </div>
                </div>
                <div class="page right-page">
                    <div>
                        Halott vagy. Játék vége.
                    </div>
                </div>
            </div>
        `;

        const carousel = document.querySelector('.carousel');
        carousel.appendChild(carouselItem);

        const totalSlides = carousel.querySelectorAll('.carousel-item').length;
        carousel.style.setProperty('--slides', totalSlides);
        
        carouselItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        return;
    }


    //Választható opciók szűrése 
    const availableChoices = currentCard.choices.filter(choice => { //EZ EGY TÖMB LESZ!!!!!
        if (choice.condition && choice.condition.includes('tombNev')) {
            return condHaving(choice.condition, inventory); 
        }
        return true; // Ha nincs feltétel, mindig elérhető
    });



    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');
    carouselItem.innerHTML = `
        <div class="page-container">
            <div class="page left-page">
                <div class="page-title">
                    ${String(currentCard.id)}. oldal
                </div>
                <div class="page-content">
                    ${currentCard.text || ''}
                </div>
            </div>
            <div class="page right-page">
                <div>
                    ${currentCard.choices ? currentCard.choices.map((choice, index) => 
                        `<p>${index + 1}. ${choice.text}</p>`
                    ).join('') : ''}
                    
                   ${currentCard.choices.map((choice) => {
                        const isAvailable = availableChoices.includes(choice);
                        return `<button 
                            type="button" 
                            class="next-btn${isAvailable ? '' : '.disabled'}" 
                            onclick="showCard(${choice.target})"
                            ${isAvailable ? '' : 'disabled'}
                        >${String(choice.target)}.</button>`;
                    }).join('')}
                    
                </div>
            </div>
        </div>
    `;

    const carousel = document.querySelector('.carousel');
    carousel.appendChild(carouselItem);

    // ⭐ IDE KELL EZ A SOR! ⭐
    const totalSlides = carousel.querySelectorAll('.carousel-item').length;
    carousel.style.setProperty('--slides', totalSlides);
    
    // Opcionális: automatikus görgetés az új oldalra
    carouselItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
}




// karakter SLIDER
const miniViewport = document.querySelector(".mini-slider__viewport");
const miniSlides = document.querySelectorAll(".mini-slide");
const prevBtn = document.querySelector(".mini-prev");
const nextBtn = document.querySelector(".mini-next");

let currentSlide = 0;

function updateMiniSlider() {
    miniViewport.style.transform = `translateX(-${currentSlide * 100}%)`;
}

prevBtn.addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + miniSlides.length) % miniSlides.length;
    updateMiniSlider();
});

nextBtn.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % miniSlides.length;
    updateMiniSlider();
});


function getSelectedCharacterIndex() {
    return currentSlide; // a mini slider aktuális pozíciója
}

let selectedCharacter = null;

function acceptCharacter() {
    const index = getSelectedCharacterIndex();
    const slide = miniSlides[index];
    
    selectedCharacter = {
        name: slide.querySelector("h2").innerText,
        description: slide.querySelector("p").innerText,
        image: slide.querySelector("img").src
    };

    console.log("Kiválasztott karakter:", selectedCharacter);

    const nextBtn = document.getElementById("nextBtn");
    nextBtn.style.display = "inline-block";

}

//karakter megjelenítés
/*<div id="chosen-character"></div>     
function displayChosenCharacter() {
    if (!selectedCharacter) return;

    const box = document.getElementById("chosen-character");
    box.innerHTML = `
        <img src="${selectedCharacter.image}" style="width:120px; border-radius:50%; border:3px solid #000;">
        <h3>${selectedCharacter.name}</h3>
        <p>${selectedCharacter.description}</p>
    `;
}
    displayChosenCharacter(); */

//inventori


const tab = document.getElementById("inventoryTab");
const panel = document.getElementById("inventoryPanel");

tab.addEventListener("click", () => {
    panel.classList.toggle("open");
});





start();  // Indítás






