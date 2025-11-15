let allCards = [];
let currentCard = null;

async function start() {
  // Betöltés
  const response = await fetch('infok.json');
  allCards = await response.json();
  console.log('✓ Betöltve!');
}

function showCard(cardId) {
    currentCard = allCards.find(card => card.id === cardId);
    if (!currentCard) {
        console.log('Nincs ilyen kártya!');
        return;
    }
    console.log('Kártya:', currentCard.id);
    

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
                    ${currentCard.choices ? currentCard.choices.map((choice, index) => 
                        `<button type="button" class="next-btn" onclick="showCard(${currentCard.choices[index].target})">${String(currentCard.choices[index].target)}.</button>`
                    ).join('') : ''}
                </div>
            </div>
        </div>
    `;

    const carousel = document.querySelector('.carousel');
    carousel.appendChild(carouselItem);
}

start();  // Indítás