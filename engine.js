
let allCards = [];
let currentCard = null;
let inventory = ['manna', 'manna', 'manna', 'manna', 'manna', 'aranytallér', 'aranytallér', 'aranytallér', 'aranytallér', 'aranytallér', 'aranytallér', 'aranytallér', 'aranytallér', 'aranytallér', 'aranytallér', 'aranytallér', 'aranytallér', 'aranytallér', 'aranytallér', 'aranytallér', 'aranytallér', 'aranytallér', 'aranytallér', 'aranytallér', 'aranytallér', 'kard', 'bőrvért' ]; // Kezdő inventory tárgyak
let fortunepoints = 0; // Példa szerencse pontok
let healthpoints = 0; // Példa életerő pontok
let skillpoints = 0; // Példa ügyesség pontok
let startFortunepoints = 0;
let startHealthpoints = 0;
let startSkillpoints = 0;

// Adatok betöltése



async function start() {
  // Betöltés
  const response = await fetch('converter/infok_generated.json');
  allCards = await response.json();
  console.log('✓ Betöltve!');
}
function closeCFPopup() {
    const popupEl = document.getElementById("fortunepopup");
    if (popupEl) {
        popupEl.classList.remove("combattryfortune-popup"); 
        popupEl.innerHTML = '';
    }
}
function closePopup() {
    const popupEl = document.getElementById("popuppage");
    if (popupEl) {
        popupEl.classList.remove("popuppage-active"); 
        popupEl.innerHTML = '';
    }
}

function selectDrink(type) {
    const title = document.getElementById('pt-title');
    const ptdesc = document.getElementById('pt-desc');
    switch (type) {
        case "Életerő itala":
            title.innerText = "AZ ÉLET ITALA"
            ptdesc.innerText = "Meleg erő árad szét benned, ahogy az ital életet lehel fáradt testedbe, kezdesz visszatérni önmagadhoz. Visszaállítja életerő pontjaidat, és új esélyt ad a túlélésre.";
            break;
        case "Ügyesség itala":
            title.innerText = "AZ ÜGYESSÉG ITALA"
            ptdesc.innerText = "Egy korty ebből az italból, és kezed újra biztos, mozdulataid villámgyorssá válnak. Visszaállítja elvesztett ügyesség pontjaidat, hogy ismét magabiztosan nézhess szembe a kihívásokkal";
            break;
        case "Szerencse itala":
            title.innerText = "A SZERENCSE ITALA"
            ptdesc.innerText = "Ez a ritka főzet megfordítja a sors kerekét, és a véletlen melléd áll. Visszaállítja szerencse pontjaidat, valamint 1-gyel megnöveli Kezdeti szerencsédet.";
            break;
    }
    const accept = document.getElementById('accept-ptn');
    accept.onclick = () => acceptPotion(type);
}
function acceptPotion(potionType){
    console.log("Elfogadott ital:", potionType);
    inventory.push(potionType);
    closePopup();
}

async function choosePotion() {
    try {
        const response = await fetch("pieces/health_potion/test.html");

        if (!response.ok) {
            console.error("Nem sikerült betölteni: test.html");
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
        console.log("✓ Varázsital oldal betöltve.");
    }
    catch (err) {
        console.error("Hiba történt betöltés közben:", err);
        alert("Hiba: " + err.message);
    }       
}
const potionChooseBtn = document.getElementById('potionBtn')
potionChooseBtn.addEventListener('click', function() {
    choosePotion();
    potionChooseBtn.disabled = true; // ✅ Letiltjuk használat után
});/**/

async function chooseFortune() {
    try {
        const response = await fetch("pieces/healthandskill.html");

        if (!response.ok) {
            console.error("Nem sikerült betölteni: healthandskill.html");
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
        
        const bg = document.querySelector('.healthandskill-popup')
        bg.style.backgroundImage = 'url("pictures/fortune.png")';
        
        console.log("✓ Élet- vagy ügyességpont oldal betöltve.");
        initDiceOne();
        const rollButton = document.getElementById('roll');
        rollButton.addEventListener('click', function() {
            setTimeout(() => {
                console.log(lastDiceRoll)
                rollButton.disabled = true; // Gomb letiltása a dobás után

                fortunepoints = lastDiceRoll + 6;
                startFortunepoints = lastDiceRoll + 6;


                const yourText = document.getElementById('your-outcome-text')
                yourText.innerText = "Szerencsepontjaid:"
                const yourPoint = document.getElementById('your-outcome');
                yourPoint.innerText = fortunepoints;
                const closeBtn = document.querySelector('.closepointchoose');
                closeBtn.style.display = 'block';

                setStat("szerencse", fortunepoints, startFortunepoints);

            }, 10);
        });


    }
    catch (err) {
        console.error("Hiba történt betöltés közben:", err);
        alert("Hiba: " + err.message);
    }    
}
const fortuneChooseBtn = document.getElementById('fortuneBtn')
fortuneChooseBtn.addEventListener('click', function() {
    chooseFortune();
    fortuneChooseBtn.disabled = true; // ✅ Letiltjuk használat után
});


//ÜGYESSÉDI PONTOK KIPÖRGETÉSE
async function chooseSkill() {
    try {
        const response = await fetch("pieces/healthandskill.html");

        if (!response.ok) {
            console.error("Nem sikerült betölteni: healthandskill.html");
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
        
        const bg = document.querySelector('.healthandskill-popup')
        bg.style.backgroundImage = 'url("pictures/skill.png")';
        
        console.log("✓ Élet- vagy ügyességpont oldal betöltve.");
        initDiceOne();
        const rollButton = document.getElementById('roll');
        rollButton.addEventListener('click', function() {
            setTimeout(() => {
                console.log(lastDiceRoll)
                rollButton.disabled = true; // Gomb letiltása a dobás után

                skillpoints = lastDiceRoll + 6;
                startSkillpoints = lastDiceRoll + 6;


                const yourText = document.getElementById('your-outcome-text')
                yourText.innerText = "Ügyességpontjaid:"
                const yourPoint = document.getElementById('your-outcome');
                yourPoint.innerText = skillpoints;
                const closeBtn = document.querySelector('.closepointchoose');
                closeBtn.style.display = 'block';

                setStat("ugyesseg", skillpoints, startSkillpoints);
            }, 10);
        });


    }
    catch (err) {
        console.error("Hiba történt betöltés közben:", err);
        alert("Hiba: " + err.message);
    }    
}
const skillChooseBtn = document.getElementById('skillBtn')
skillChooseBtn.addEventListener('click', function() {
    chooseSkill();
    skillChooseBtn.disabled = true; // ✅ Letiltjuk használat után
    

});

//ÉlET PONTOK KIPÖRGETÉSE
async function chooseHealth() {
    try {
        const response = await fetch("pieces/fortunechoose.html");

        if (!response.ok) {
            console.error("Nem sikerült betölteni: fortunechoose.html");
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
        
        console.log("✓ Szerencse oldal betöltve.");
        initDice('roll', 'dice1', 'dice2');
        const rollButton = document.getElementById('roll');
        rollButton.addEventListener('click', function() {
            setTimeout(() => {
                console.log(lastDiceRoll)
                rollButton.disabled = true; // Gomb letiltása a dobás után

                healthpoints = lastDiceRoll + 12;
                startHealthpoints = lastDiceRoll + 12;


                const yourText = document.getElementById('your-outcome-text')
                yourText.innerText = "Életpontjaid:"
                const yourPoint = document.getElementById('your-outcome');
                yourPoint.innerText = healthpoints
                const closeBtn = document.querySelector('.closepointchoose');
                closeBtn.style.display = 'block';

                setStat("eletero", healthpoints, startHealthpoints);
            }, 10);
        });


    }
    catch (err) {
        console.error("Hiba történt betöltés közben:", err);
        alert("Hiba: " + err.message);
    }    
}
const healthChooseBtn = document.getElementById('healthBtn')
healthChooseBtn.addEventListener('click', function() {
    chooseHealth();
    healthChooseBtn.disabled = true; // ✅ Letiltjuk használat után
});

function statAnditemsUpdate() {
    if (currentCard.items && currentCard.items.length > 0) {    //item hozzáadás az inventory-hoz
        currentCard.items.forEach(item => {
            inventory.push(item);
            console.log(`✓ Tárgy hozzáadva: ${item}`);
        });
    }

    if (currentCard.action != null) {   //statok frissítése
        for (let i = 0; i < currentCard.action.length; i++) {   //stat módosítás
            const action = currentCard.action[i];
            if (action.type === 'healthChange') {
                healthpoints += action.amount;
                setStat("eletero", healthpoints, startHealthpoints);
            }
            else if (action.type === 'fortuneChange') {
                fortunepoints += action.amount;
                setStat("szerencse", fortunepoints, startFortunepoints);

            }
            else if (action.type === 'attackChange') {
                skillpoints += action.amount;
            }
            else if (action.type === "startPointChange") {
                switch (action.subtype) {
                    case "fortune":
                        fortunepoints = startFortunepoints + action.amount;
                        setStat("szerencse", fortunepoints, startFortunepoints);
                        break;
                    case "health":
                        healthpoints = startHealthpoints + action.amount;
                        setStat("eletero", healthpoints, startHealthpoints);
                        break;
                    case "skill":
                        skillpoints = startSkillpoints + action.amount;
                        setStat("ugyesseg", skillpoints, startSkillpoints)
                        break;
                }
            }
        }
    }
}

async function deathPopup() {
    try {
        const response = await fetch("pieces/death.html");

        if (!response.ok) {
            console.error("Nem sikerült betölteni: death.html");
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
    }
    catch (err) {
        console.error("Hiba történt betöltés közben:", err);
        alert("Hiba: " + err.message);
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
        initDice('roll', 'dice1', 'dice2');

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
        setStat("szerencse", fortunepoints, startFortunepoints);


    } catch (err) {
        console.error("Hiba történt betöltés közben:", err);
        alert("Hiba: " + err.message);
    }
}


function initDice(buttonid, diceidone, diceidtwo) {
    var elDiceOne       = document.getElementById(diceidone);
    var elDiceTwo       = document.getElementById(diceidtwo);
    var elComeOut       = document.getElementById(buttonid);

    if (!elComeOut) {
        console.warn(`⚠️ FIGYELEM: '${buttonid}' ID-jú gomb nem található!`);
        return; // Kilép, nem dob hibát
    }

    if (!elDiceOne || !elDiceTwo) {
        console.warn('⚠️ FIGYELEM: Kockák nem találhatók!');
        return;
    }

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

function initDiceOne() {
    var elDiceOne       = document.getElementById('dice1');
    var elComeOut       = document.getElementById('roll');

    if (!elComeOut) {
        console.warn(`⚠️ FIGYELEM: 'roll' ID-jú gomb nem található!`);
        return; // Kilép, nem dob hibát
    }

    if (!elDiceOne) {
        console.warn('⚠️ FIGYELEM: Kocka nem találhatók!');
        return;
    }

    elComeOut.onclick = function () {
        lastDiceRoll = rollDice();
    };

    function rollDice() {

        var diceOne   = Math.floor((Math.random() * 6) + 1);
        
        console.log(diceOne);

        for (var i = 1; i <= 6; i++) {
            elDiceOne.classList.remove('show-' + i);
            if (diceOne === i) {
            elDiceOne.classList.add('show-' + i);
            }
        }
        return diceOne;

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
        
       console.log(currentCard.choices[0].target);
            

        let currentEnemyIndex = 0;
        let enemyHealth = currentCard.enemy[currentEnemyIndex].stamina;
        let enemyStartHealth = currentCard.enemy[currentEnemyIndex].stamina;
        let playerStartHealth = healthpoints;
        let rollCount = 0;
        let firstRoll = 0;
        let secondRoll = 0;
        let enemyHealthBar = document.getElementById('ebar');
        let playerHealthBar = document.getElementById('pbar');
        let totalRollCount = 0;
        let combatRoundOutcome = 0;
        let combatText = document.getElementById('combat-text');

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
            totalRollCount++;
            const combatFortuneBtn = document.getElementById('combatForuneBtn');
            if (combatFortuneBtn) {
                if (totalRollCount % 2 === 0 && totalRollCount != 0) {
                    combatFortuneBtn.disabled = false;
                } else {
                    combatFortuneBtn.disabled = true;
                }
            }

            if (rollCount === 1) {
                // Első dobás - Ellenfél
                firstRoll = totalRoll;
                console.log('Ellenfél támadása: ' + (currentCard.enemy[currentEnemyIndex].skill + firstRoll));
                rollButton.innerText = "ELLENFÉL DOBÁSA";
            } else if (rollCount === 2) {
                // Második dobás - Játékos
                secondRoll = totalRoll;
                console.log('Játékos támadása: ' + (skillpoints + secondRoll));
                rollButton.innerText = "JÁTÉKOS DOBÁSA";
                
                // Támadások kiértékelése
                const enemyAttack = currentCard.enemy[currentEnemyIndex].skill + firstRoll;
                const playerAttack = skillpoints + secondRoll;
                
                console.log('--- KÖR EREDMÉNYE ---');
                console.log('Ellenfél támadóereje: ' + enemyAttack);
                console.log('Játékos támadóereje: ' + playerAttack);

                let damagepoint = 2;
                if (currentCard.action.subtype === "damagethree") {
                    damagepoint = 3;
                }
                combatText.classList.add('combat-text-div-active')
                if (playerAttack > enemyAttack) {
                    enemyHealth -= damagepoint;
                    console.log('Játékos sebzett! Ellenfél életereje: ' + enemyHealth);
                    combatText.innerText = 'Megsebezted az ellenfeled!';
                    enemyHealthBar.style.width = enemyHealth / enemyStartHealth * 100 + "%";
                    combatRoundOutcome = 1;

                } else if (enemyAttack > playerAttack) {
                    healthpoints -= damagepoint;
                    console.log('Ellenfél sebzett! Játékos életereje: ' + healthpoints);
                    combatText.innerText = 'Az ellenfél megsebzett'
                    playerHealthBar.style.width = healthpoints / playerStartHealth * 100 + "%";
                    combatRoundOutcome = 2;                    
                } else {
                    console.log('Döntetlen kör, senki nem sérült!');
                    combatText.innerText = 'Kivédtétek egymás támadását!'
                    combatRoundOutcome = 0;
                }

                let combatFleeBtn = null
                if (totalRollCount == 2 && currentCard.choices.length == 2) {
                    combatFleeBtn = document.createElement('button');
                    combatFleeBtn.type = 'button';
                    combatFleeBtn.className = 'combat-flee-btn';
                    combatFleeBtn.innerText = 'MENEKVÉS';
                    combatFleeBtn.onclick = function() {
                        closePopup(), showCard(currentCard.choices[1].target);
                    };
                    const combatLog = document.querySelector('.combat-log');
                    combatLog.insertBefore(combatFleeBtn, combatLog.children[1]);
                    console.log("MENEKVÉS GOMB LEKREÁLVA")
                    healthpoints -= 2;
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


                    const existingFleeBtn = document.querySelector('.combat-flee-btn');
                    if(existingFleeBtn) {
                        existingFleeBtn.remove();
                    }

                    const combatEndBtn = document.createElement('button');
                    combatEndBtn.type = 'button';
                    combatEndBtn.className = 'combat-end-btn';
                    combatEndBtn.innerText = 'TOVÁBB';
                    combatEndBtn.onclick = function() {
                        closePopup(), deathPopup();
                    };
                    const combatLog = document.querySelector('.combat-log');
                    combatLog.insertBefore(combatEndBtn, combatLog.children[1]);
                    combatFortuneBtn.disabled = true;
                    
                    
                } else if (enemyHealth <= 0) {
                    console.log('ELLENFÉL LEGYŐZVE!');
                    combatText.innerText = 'Ellenfél legyőzve!'
                    currentEnemyIndex++;
                    
                    if (currentEnemyIndex < currentCard.enemy.length) {
                        enemyHealth = currentCard.enemy[currentEnemyIndex].stamina;
                        console.log('Következő ellenfél! Életerő: ' + enemyHealth);
                        combatText.innerText = 'Következő ellenfél!'
                        enemyHealthBar.style.width = '100%';
                        
                        // ✅ Ellenfél kép frissítése
                        const combatEnemyImg = document.querySelector('.combat-enemy-img');
                        const combatEnemyName = document.querySelector('.combat-enemy-name')
                        if (combatEnemyImg && combatEnemyName) {
                            const newEnemyImage = currentCard.enemy[currentEnemyIndex].name;
                            combatEnemyImg.style.backgroundImage = 'url("pieces/monsters/' + newEnemyImage + '.png")';
                            console.log('✓ Új ellenfél képe beállítva: ' + newEnemyImage);
                            combatEnemyName.innerText = currentCard.enemy[currentEnemyIndex].name
                        }

                        combatFortuneBtn.disabled = true;
                        
                    } else {
                        console.log('MINDEN ELLENFÉL LEGYŐZVE!');
                        rollButton.disabled = true;
                        rollButton.removeEventListener('click', handleCombatRound);


                        const existingFleeBtn = document.querySelector('.combat-flee-btn');
                        if(existingFleeBtn) {
                            existingFleeBtn.remove();
                        }

                        const combatEndBtn = document.createElement('button');
                        combatEndBtn.type = 'button';
                        combatEndBtn.className = 'combat-end-btn';
                        combatEndBtn.innerText = 'TOVÁBB';
                        combatEndBtn.onclick = function() {
                            closePopup(), showCard(currentCard.choices[0].target);
                        };
                        const combatLog = document.querySelector('.combat-log');
                        combatLog.insertBefore(combatEndBtn, combatLog.children[1]);
                        combatFortuneBtn.disabled = true;
                    }
                }
                
                setStat("szerencse", fortunepoints, startFortunepoints);
                setStat("eletero", healthpoints, startHealthpoints);
            }
        }


        rollButton.addEventListener('click', handleCombatRound);

        const combatFortuneBtn = document.getElementById('combatForuneBtn');
        combatFortuneBtn.disabled = true;

        async function combatFortuneDice(outcome) {
            try {
                const response = await fetch("pieces/combatTryfortune.html");

                if (!response.ok) {
                    console.error("Nem sikerült betölteni: combatTryfortune.html");
                    alert("Hiba: nem sikerült betölteni a fájlt!");
                    return;
                }

                const html = await response.text();
                const popupEl = document.getElementById("fortunepopup");
                
                if (!popupEl) {
                    alert("HIBA: popuppage nem található!");
                    return;
                }
                
                // HTML betöltése
                popupEl.innerHTML = html;
                //popupEl.classList.add("popuppage-active");
                
                console.log("✓ Szerencseproba oldal betöltve.");
                
                // Kocka inicializálása
                setTimeout(() => {
                    initDice('fortuneroll', 'dice3', 'dice4');

                    const rollButton = document.getElementById('fortuneroll');
                    if (rollButton) {
                        rollButton.addEventListener('click', function() {
                            setTimeout(() => {
                                console.log(lastDiceRoll)
                                rollButton.disabled = true;
                                
                                let fortuneresult = false;
                                if (lastDiceRoll <= fortunepoints) {
                                    fortuneresult = true;
                                    fortunepoints -= 1;

                                }
                                else{
                                    fortunepoints -= 1;
                                }

                                if (outcome == 1) {  //player sebzett
                                    if (fortuneresult == true) {
                                        enemyHealth -= 2;
                                        console.log('Szerencsés vagy! Ellenfél életereje: ' + enemyHealth);
                                        combatText.innerText = 'Szerencsés extra sebzés!';
                                    }
                                    else {
                                        enemyHealth++;
                                        console.log('Szerencsés vagy! Ellenfél életereje: ' + enemyHealth);
                                        combatText.innerText = 'Szerencsétlen extra sebzés!';                                        
                                    }
                                    enemyHealthBar.style.width = enemyHealth / enemyStartHealth * 100 + "%";
                                }
                                else if (outcome == 2) {  //enemy sebzett
                                    if (fortuneresult == true) {
                                        healthpoints++;
                                        console.log('Szerencsés vagy! Ellenfél életereje: ' + enemyHealth);
                                        combatText.innerText = 'Szerencsés extra védelem!';
                                    }
                                    else {
                                        enemyHealth--;
                                        console.log('Szerencsés vagy! Ellenfél életereje: ' + enemyHealth);
                                        combatText.innerText = 'Szerencsétlen extra védelem!';                                        
                                    }
                                    playerHealthBar.style.width = healthpoints / playerStartHealth * 100 + "%";
                                }

                            }, 10);
                        });
                    }
                }, 50);


            } catch (err) {
                console.error("Hiba történt betöltés közben:", err);
                alert("Hiba: " + err.message);
            }
        }


        combatFortuneBtn.addEventListener('click', function() {
            combatFortuneBtn.disabled = true; // ✅ Letiltjuk használat után
            combatFortuneDice(combatRoundOutcome);
        });



    }
    catch (err) {
        console.error("Hiba történt betöltés közben:", err);
        alert("Hiba: " + err.message);
    }
}




// Oldal lapozása
function turnPage() {
    const carousel = document.querySelector('.carousel');
    const items = carousel.querySelectorAll('.carousel-item');
    
    // Megkeressük az aktuálisan látható oldalt
    let currentIndex = -1;
    items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const carouselRect = carousel.getBoundingClientRect();
        
        // Ha az elem látható a carousel-ben
        if (rect.left >= carouselRect.left - 10 && rect.left <= carouselRect.left + 10) {
            currentIndex = index;
        }
    });
    
    // Következő oldalra lépés
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < items.length) {
        items[nextIndex].scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest', 
            inline: 'start' 
        });
        console.log("lapoztunk")
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
        deathPopup();
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
    else if (currentCard.action != null && 
         ((Array.isArray(currentCard.action) && currentCard.action[0]?.type === 'combat') || 
          currentCard.action.type === 'combat')) {
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
function setStat(name, percent, startpoint) {
    const maxWidth = 32;
    const fill = document.querySelector("." + name + "_fill");
    const newWidth = (maxWidth * (percent / startpoint)) + "px";
    fill.style.width = newWidth;
    console.log(name + " csúszka beállítva")
}


// Carousel oldal figyelése
function updateCarouselInteractivity() {
    const carousel = document.querySelector('.carousel');
    const items = carousel.querySelectorAll('.carousel-item');
    
    items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const carouselRect = carousel.getBoundingClientRect();
        
        // Ha az oldal látható a carousel-ben
        const isVisible = rect.left >= carouselRect.left - 10 && 
                         rect.left <= carouselRect.left + 10;
        
        if (isVisible) {
            item.style.pointerEvents = 'auto';
            item.style.zIndex = '10';
        } else {
            item.style.pointerEvents = 'none';
            item.style.zIndex = '1';
        }
    });
}

// Figyelés görgéskor
document.querySelector('.carousel').addEventListener('scroll', updateCarouselInteractivity);

// Indításkor is futtassuk
document.addEventListener('DOMContentLoaded', updateCarouselInteractivity);

start();  // Indítás






