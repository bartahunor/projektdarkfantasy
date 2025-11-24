let allCards = [];
let currentCard = null;

async function start() {
  // Betöltés
  const response = await fetch('converter/infok_generated.json');
  allCards = await response.json();
  console.log('✓ Betöltve!');
}


let inventory = []; // Példa inventory tárgyak

// Feltétel ellenőrzése - van e az inventory-ban a szükséges tárgy
function condHaving(condition, inventory) {
    let cond = condition.replace('tombNev', 'inventory');
    const hasItem = eval(cond);
    return hasItem;
}

// Szerencse próbálás feltétel ellenőrzése
function tryFortune(condition) {

}

// Oldal lapozása
function turnPage() {
    const carousel = document.querySelector('.carousel');
    const lastItem = carousel.lastElementChild;
    
    if (lastItem) {
        const totalSlides = carousel.querySelectorAll('.carousel-item').length;
        carousel.style.setProperty('--slides', totalSlides);
        lastItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
}


// ---------------------- Kártya megjelenítése ---------------------- //
function showCard(cardId) {
    currentCard = allCards.find(card => card.id === cardId);
    if (!currentCard) {
        console.log('Nincs ilyen kártya!');
        return;
    }
    console.log('Kártya:', currentCard.id);

    let rightPageContent = '';
    

    //Kombinációs kártya kezelése
    if (currentCard.action === 'sumCombination' && inventory.includes('Pergamenen lévő számok: 15, 10, 22')) {
        currentCard.choices[0].target = 47;
    }

    //Szerencse próbálásos kártya kezelése
    if (currentCard.action === 'tryFortune') {
        const response = fetch("tryfortune.html");
        if (response.ok) {
            document.getElementById("popuppage").innerHTML = response.text();
        } else {
            console.error(`Nem sikerült betölteni: tryfortune.html`);
        }
    }


    if (currentCard.end === true) {  //Halál kártya kezelése
        rightPageContent = "Halott vagy. Játék vége.";
    }
    else if (currentCard.end === false && !currentCard.choices) {   //Nyerő kártya kezelése
        rightPageContent = "NYERTÉL.";
    }
    else if (currentCard.choices && currentCard.choices.length > 0) {       //Választható opciók szűrése 
        const availableChoices = currentCard.choices.filter(choice => { //EZ EGY TÖMB LESZ!!!!!
            if (choice.condition && choice.condition.includes('tombNev')) {
                return condHaving(choice.condition, inventory); 
            }
            if (choice.condition && currentCard.action === 'tryFortune') {
                return tryFortune(choice.condition); 
            }
            return true; // Ha nincs feltétel, mindig elérhető
        });


        rightPageContent = `
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
        `;
        
    }
    

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
                    ${rightPageContent}                   
                </div>
            </div>
        </div>
    `;

    const carousel = document.querySelector('.carousel');
    carousel.appendChild(carouselItem);
    turnPage();
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

document.addEventListener("DOMContentLoaded", function() {

  const wrapper = document.getElementById("inventoryWrapper");
  const tab = document.getElementById("inventoryTab");

  tab.addEventListener("click", () => {
    wrapper.classList.toggle("open");
  });

});





start();  // Indítás






