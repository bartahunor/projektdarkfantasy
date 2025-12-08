let allCards = [];
let currentCard = null;
let inventory = []; // Példa inventory tárgyak
let fortunepoints = 13; // Példa szerencse pontok
let healthpoints = 20; // Példa életerő pontok
let attackpoints = 10; // Példa támadó pontok
let skillpoints = 10; // Példa ügyesség pontok

// Adatok betöltése



async function start() {
  // Betöltés
  const response = await fetch('converter/infok_generated.json');
  allCards = await response.json();
  console.log('✓ Betöltve!');
}
function closePopup() {
    const popupEl = document.getElementById("popuppage");
    if (popupEl) {
        popupEl.classList.remove("popuppage-active"); 
        popupEl.innerHTML = '';
    }
}

function statAnditemsUpdate() {
    if (currentCard.items && currentCard.items.length > 0) {    //item hozzáadás az inventory-hoz
        currentCard.items.forEach(item => {
            inventory.push(item);
            console.log(`✓ Tárgy hozzáadva: ${item}`);
        });
    }

    if (currentCard.action != null) {   //statok frissítése
        for (let i; i < currentCard.action.length; i++) {   //stat módosítás
            const action = currentCard.action[i];
            if (action.type === 'healthChange') {
                healthpoints += action.amount;
            }
            else if (action.type === 'fortuneChange') {
                fortunepoints += action.amount;
            }
            else if (action.type === 'attackChange') {
                attackpoints += action.amount;
            }
        }
    }
}




// Feltétel ellenőrzése - van e az inventory-ban a szükséges tárgy
function condHaving(condition, inventory) {
    let cond = condition.replace('tombNev', 'inventory');
    const hasItem = eval(cond);
    return hasItem;
}

// Szerencse próbálás feltétel ellenőrzése
let lastDiceRoll = 0;
async function tryFortune() {
    try {
        const response = await fetch("pieces/tryfortune.html");

        if (!response.ok) {
            console.error("Nem sikerült betölteni: tryfortune.html");
            alert("Hiba: nem sikerült betölteni a fájlt!");
            return;
        }

        const html = await response.text();
        const popupEl = document.getElementById("popuppage");
        
        if (!popupEl) {
            alert("HIBA: popuppage nem található!");
            return;
        }
        
        // HTML betöltése
        popupEl.innerHTML = html;
        popupEl.classList.add("popuppage-active");
        
        console.log("✓ Szerencseproba oldal betöltve.");
        
        // Kocka inicializálása
        initDice();

        const rollButton = document.getElementById('roll');
        rollButton.addEventListener('click', function() {
            setTimeout(() => {
                console.log(lastDiceRoll)
                rollButton.disabled = true; // Gomb letiltása a dobás után


                let fortuneresult = false;
                if (lastDiceRoll <= fortunepoints) {
                    fortuneresult = true;
                    fortunepoints -= 1;

                }
                else{
                    fortunepoints -= 1;
                }

                const tryfortuneresult = document.createElement('div');
                tryfortuneresult.classList.add('tryfortune-result');
                tryfortuneresult.innerHTML = `
                    <div class="tryfortune-result-title">
                        ${fortuneresult ? 'SZERENCSÉS VAGY' : 'NINCS SZERENCSÉD'}
                    </div>
                    <button 
                        type="button" 
                        class="tryfortune-result-btn"
                        onclick="showCard(${fortuneresult ? currentCard.choices[0].target : currentCard.choices[1].target}), closePopup()"
                    >
                        ${fortuneresult ? currentCard.choices[0].target : currentCard.choices[1].target}. oldal
                    </button>
                `;
                const tryfortunePopup = document.querySelector('.tryfortune-popup');
                if (tryfortunePopup) {
                    tryfortunePopup.appendChild(tryfortuneresult);
                    console.log("✓ Eredmény hozzáadva!");
                } else {
                    console.error("HIBA: tryfortune-popup nem található!");
                }
                turnPage();


            }, 10);
        });


    } catch (err) {
        console.error("Hiba történt betöltés közben:", err);
        alert("Hiba: " + err.message);
    }
}


function initDice() {
    var elDiceOne       = document.getElementById('dice1');
    var elDiceTwo       = document.getElementById('dice2');
    var elComeOut       = document.getElementById('roll');

    elComeOut.onclick = function () {
        lastDiceRoll = rollDice();
    };

    function rollDice() {

        var diceOne   = Math.floor((Math.random() * 6) + 1);
        var diceTwo   = Math.floor((Math.random() * 6) + 1);
        
        console.log(diceOne + ' ' + diceTwo);

        for (var i = 1; i <= 6; i++) {
            elDiceOne.classList.remove('show-' + i);
            if (diceOne === i) {
            elDiceOne.classList.add('show-' + i);
            }
        }

        for (var k = 1; k <= 6; k++) {
            elDiceTwo.classList.remove('show-' + k);
            if (diceTwo === k) {
            elDiceTwo.classList.add('show-' + k);
            }
        } 
        return diceOne+diceTwo;

    }

}


async function combat() {
    try {
        const response = await fetch("pieces/combat.html");

        if (!response.ok) {
            console.error("Nem sikerült betölteni: combat.html");
            alert("Hiba: nem sikerült betölteni a fájlt!");
            return;
        }

        const html = await response.text();
        const popupEl = document.getElementById("popuppage");
        
        if (!popupEl) {
            alert("HIBA: popuppage nem található!");
            return;
        }
        
        // HTML betöltése
        popupEl.innerHTML = html;
        popupEl.classList.add("popuppage-active");
        
        console.log("✓ Harc oldal betöltve.");

        
        const combatFortune = document.querySelector('.combat-fortune');
        if (combatFortune && currentCard.enemy) {
            // Példa: különböző hátterek különböző ellenségekhez
            const background = currentCard.enemy[0].place; // Példa: az első választás célja alapján
            
            combatFortune.style.backgroundImage = 'url("pictures/' + background + '.png")';
            combatFortune.style.backgroundSize = 'cover';
            combatFortune.style.backgroundPosition = 'center';
            console.log("✓ Harc háttér beállítva " + background +".png");
        }

        const combatPlayerImg = document.querySelector('.combat-player-img');
        const combatPlayerName = document.querySelector('.combat-player-name')
        if (combatPlayerName && combatPlayerImg && selectedCharacter) {
            // Példa: különböző hátterek különböző ellenségekhez
            const background2 = selectedCharacter.image; // Példa: az első választás célja alapján
            combatPlayerImg.style.backgroundImage = 'url(' + background2 + ')';
            combatPlayerImg.style.backgroundSize = 'cover';
            combatPlayerImg.style.backgroundPosition = 'center';
            console.log("✓ Játékos kép beállítva " + background2);

            combatPlayerName.innerText = selectedCharacter.name;
        }

        const combatEnemyImg = document.querySelector('.combat-enemy-img');
        const combatEnemyName = document.querySelector('.combat-enemy-name')
        if (combatEnemyImg && currentCard.enemy) {
            // Példa: különböző hátterek különböző ellenségekhez
            const background3 = currentCard.enemy[0].name; // Példa: az első választás célja alapján           
            combatEnemyImg.style.backgroundImage = 'url("pieces/monsters/' + background3 + '.png")';
            combatEnemyImg.style.backgroundSize = 'cover';
            combatEnemyImg.style.backgroundPosition = 'center';
            console.log("✓ Ellenfél kép beállítva " + background3 +".png");

            combatEnemyName.innerText = currentCard.enemy[0].name;
        }
        
       

        
        console.log(currentCard.enemy.length);

        
            

        let currentEnemyIndex = 0;
        let enemyHealth = currentCard.enemy[currentEnemyIndex].stamina;
        let rollCount = 0;
        let firstRoll = 0;
        let secondRoll = 0;

        const rollButton = document.getElementById('roll');
        
        function handleCombatRound() {
            rollCount++;
            
            // Kockadobás
            var elDiceOne = document.getElementById('dice1');
            var elDiceTwo = document.getElementById('dice2');
            var diceOne = Math.floor((Math.random() * 6) + 1);
            var diceTwo = Math.floor((Math.random() * 6) + 1);
            
            console.log('Dobás ' + rollCount + ': ' + diceOne + ' + ' + diceTwo);

            // Kocka animáció
            for (var i = 1; i <= 6; i++) {
                elDiceOne.classList.remove('show-' + i);
                if (diceOne === i) {
                    elDiceOne.classList.add('show-' + i);
                }
            }

            for (var k = 1; k <= 6; k++) {
                elDiceTwo.classList.remove('show-' + k);
                if (diceTwo === k) {
                    elDiceTwo.classList.add('show-' + k);
                }
            }

            const totalRoll = diceOne + diceTwo;
            let combatText = document.getElementById('combat-text');

            if (rollCount === 1) {
                // Első dobás - Ellenfél
                firstRoll = totalRoll;
                console.log('Ellenfél támadása: ' + (currentCard.enemy[currentEnemyIndex].skill + firstRoll));
            } else if (rollCount === 2) {
                // Második dobás - Játékos
                secondRoll = totalRoll;
                console.log('Játékos támadása: ' + (skillpoints + secondRoll));
                
                // Támadások kiértékelése
                const enemyAttack = currentCard.enemy[currentEnemyIndex].skill + firstRoll;
                const playerAttack = skillpoints + secondRoll;
                
                console.log('--- KÖR EREDMÉNYE ---');
                console.log('Ellenfél támadóereje: ' + enemyAttack);
                console.log('Játékos támadóereje: ' + playerAttack);
                
                if (playerAttack > enemyAttack) {
                    enemyHealth -= 2;
                    console.log('Játékos sebzett! Ellenfél életereje: ' + enemyHealth);
                    combatText.innerText = 'Megsebezted az ellenfeled!'
                } else if (enemyAttack > playerAttack) {
                    healthpoints -= 2;
                    console.log('Ellenfél sebzett! Játékos életereje: ' + healthpoints);
                    combatText.innerText = 'Az ellenfél megsebzett'
                } else {
                    console.log('Döntetlen kör, senki nem sérült!');
                    combatText.innerText = 'Kivédtétek egymás támadását!'
                }
                
                // Következő kör előkészítése
                rollCount = 0;
                firstRoll = 0;
                secondRoll = 0;
                
                // Ellenőrzés: vége a harcnak?
                if (healthpoints <= 0) {
                    console.log('JÁTÉKOS MEGHALT!');
                    combatText.innerText = 'Elbuktad a csatát!'
                    rollButton.disabled = true;
                    rollButton.removeEventListener('click', handleCombatRound);
                    // Itt kezeld a játékos halálát
                    
                } else if (enemyHealth <= 0) {
                    console.log('ELLENFÉL LEGYŐZVE!');
                    combatText.innerText = 'Ellenfél legyőzve!'
                    currentEnemyIndex++;
                    
                    if (currentEnemyIndex < currentCard.enemy.length) {
                        enemyHealth = currentCard.enemy[currentEnemyIndex].stamina;
                        console.log('Következő ellenfél! Életerő: ' + enemyHealth);
                        combatText.innerText = 'Következő ellenfél!'
                        
                        // ✅ Ellenfél kép frissítése
                        const combatEnemyImg = document.querySelector('.combat-enemy-img');
                        const combatEnemyName = document.querySelector('.combat-enemy-name')
                        if (combatEnemyImg && combatEnemyName) {
                            const newEnemyImage = currentCard.enemy[currentEnemyIndex].name;
                            combatEnemyImg.style.backgroundImage = 'url("pieces/monsters/' + newEnemyImage + '.png")';
                            console.log('✓ Új ellenfél képe beállítva: ' + newEnemyImage);
                            combatEnemyName.innerText = currentCard.enemy[currentEnemyIndex].name
                        }
                        
                    } else {
                        console.log('MINDEN ELLENFÉL LEGYŐZVE!');
                        rollButton.disabled = true;
                        rollButton.removeEventListener('click', handleCombatRound);
                        // Itt kezeld a győzelmet
                    }
                }
            }
        }

        // ✅ Event listener EGYSZER hozzáadva
        rollButton.addEventListener('click', handleCombatRound);
        //closePopup();



    }
    catch (err) {
        console.error("Hiba történt betöltés közben:", err);
        alert("Hiba: " + err.message);
    }
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
    

    //action feldolgozás
    if (currentCard.action === 'sumCombination' && inventory.includes('Pergamenen lévő számok: 15, 10, 22')) {
        currentCard.choices[0].target = 47;
    }
    statAnditemsUpdate(); 


    if (currentCard.end === true) {  //Halál kártya kezelése
        rightPageContent = "Halott vagy. Játék vége.";
    }
    else if (currentCard.end === false && !currentCard.choices) {   //Nyerő kártya kezelése
        rightPageContent = "NYERTÉL.";
    }
    else if (currentCard.action === 'tryFortune') {
        rightPageContent = `<button 
                    type="button" 
                    class="luck-btn" 
                    onclick="tryFortune()">PRÓBÁLD MEG A SZERENCSÉD</button>`;
    }
    else if (currentCard.action[0] === 'combat' || currentCard.action === 'combat') {
        rightPageContent = `<button 
                    type="button" 
                    class="combat-btn" 
                    onclick="combat()">FELKÉSZÜLÉS A HARCRA</button>`;
    }
    else if (currentCard.choices && currentCard.choices.length > 0) {       //Választható opciók szűrése 
        const availableChoices = currentCard.choices.filter(choice => { //EZ EGY TÖMB LESZ!!!!!
            if (choice.condition && choice.condition.includes('tombNev')) {
                return condHaving(choice.condition, inventory); 
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

//sima tovább gomb






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


//csúszka
setStat("eletero", healthpoints);
setStat("ugyesseg", skillpoints);
setStat("szerencse", fortunepoints);
function setStat(name, percent) {
    const maxWidth = 32;
    const fill = document.querySelector("." + name + "_fill");
    const newWidth = (maxWidth * (percent / 100)) + "px";
    fill.style.width = newWidth;
}




start();  // Indítás






