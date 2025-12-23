let isSignup = false;

document.getElementById("toggle-mode").onclick = () => {
    isSignup = !isSignup;

    document.getElementById("form-title").textContent =
        isSignup ? "REGISZTRÁCIÓ" : "LÉPJ BE A LABIRINTUSBA";

    document.getElementById("action-btn").textContent =
        isSignup ? "Regisztráció" : "Belépés";

    document.getElementById("toggle-mode").textContent =
        isSignup ? "Már van fiókod? Belépés" : "Fiók létrehozása";

    document.getElementById("email").style.display =
        isSignup ? "block" : "none";
};

document.getElementById("action-btn").onclick = () => {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!user || !pass || (isSignup && !email)) {
        alert("Minden mezőt ki kell töltened!");
        return;
    }

    function showBookSelector() {
    document.querySelector(".container").innerHTML = `
        <h2>VÁLASSZ KRÓNIKÁT</h2>

        <select id="bookSelect" style="
            width:90%;
            padding:12px;
            font-size:22px;
            background:#000;
            color:#c6626d;
            border:3px solid #462226;
            font-family:'VT323', monospace;
            box-shadow:2px 2px #000;
        ">
            <option value="">-- Válassz könyvet --</option>
            <option value="itelet">Az Ítélet Labirintusa</option>
            <option value="arnyak">Az Árnyak Ösvénye</option>
            <option value="vegzet">A Végzet Lapjai</option>
        </select>

        <div class="button-group">
            <label for="fileInput" class="file-label">
                📁 TXT Fájl Betöltése
            </label>
            <input type="file" id="fileInput" class="file-input" accept=".txt">
            <button id="convertBtn" onclick="convertFile()" disabled>🔄 Konvertálás</button>    
            <button id="downloadBtn" onclick="downloadJSON()" disabled>💾 JSON Letöltése</button>
        </div>

        <div id="status"></div>

        <button id="startGameBtn" style="margin-top:25px;">
            Játék kezdete
        </button>
    `; //adeventlistenerel lentebb function megadás

    document.getElementById("startGameBtn").onclick = () => {
        const selected = document.getElementById("bookSelect").value;

        if (!selected) {
            alert("Válassz egy krónikát!");
            return;
        }

        // később ebből tudod, melyik könyv töltődjön
        localStorage.setItem("selectedBook", selected);

        window.location.href = "loading.html";
    };
}

    if (isSignup) {
        if (localStorage.getItem("user_" + user)) {
            alert("Ez a felhasználónév már létezik!");
            return;
        }

        localStorage.setItem("user_" + user, pass);
        localStorage.setItem("email_" + user, email);

        alert("Fiókod elkészült.");
    } else {
        const savedPass = localStorage.getItem("user_" + user);

        if (savedPass === pass) {
            showBookSelector();
        } else {
            alert("Hibás felhasználónév vagy jelszó!");
        }
    }
};






/* ------------------ KONVERTER ------------------ */
/**
 * Kalandjáték TXT -> JSON Konverter
 * 
 * Használat:
 * const txtContent = // ... betöltött txt fájl tartalma
 * const jsonResult = convertGamebookToJSON(txtContent);
 * console.log(JSON.stringify(jsonResult, null, 2));
 */
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            txtContent = event.target.result;
            document.getElementById('convertBtn').disabled = false;
            showStatus('Fájl betöltve: ' + file.name, 'info');
        };
        reader.readAsText(file, 'UTF-8');}
});

function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = 'status ' + type;
    statusDiv.style.display = 'block';
}

function convertFile() {
    if (!txtContent) {
        showStatus('Nincs betöltött fájl!', 'error');
        return;
    }

    try {
        jsonData = convertGamebookToJSON(txtContent);

        // Kimenet megjelenítése (első 5)
        const preview = jsonData.slice(0, 5);
        document.getElementById('output').textContent = JSON.stringify(preview, null, 2);
                
        document.getElementById('downloadBtn').disabled = false;
        showStatus(`✅ Sikeres konverzió! ${jsonData.length} bejegyzés létrehozva.`, 'success');
    } catch (error) {
        showStatus('❌ Hiba: ' + error.message, 'error');
        console.error(error);
    }
}

function downloadJSON() {
    if (!jsonData) return;
            
    const dataStr = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kalandjatek_generated.json';
    a.click();
    URL.revokeObjectURL(url);
            
    showStatus('📥 JSON fájl letöltve!', 'success');
}













function convertGamebookToJSON(textContent) {
  const entries = [];
  
  // Felosztjuk a szöveget #-ekkel kezdődő részekre
  const sections = textContent.split(/(?=\n#\d+\n)/);
  
  sections.forEach(section => {
    const trimmed = section.trim();
    if (!trimmed || !trimmed.match(/^#\d+/)) return;
    
    // ID kinyerése
    const idMatch = trimmed.match(/^#(\d+)/);
    if (!idMatch) return;
    
    const id = parseInt(idMatch[1]);
    
    // Szöveg kinyerése
    const lines = trimmed.split('\n');
    let textLines = [];
    let inMainText = false;
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      
      // Ha ellenség info kezdődik, megállunk
      if (line.match(/^[A-ZÀ-Űa-zà-ű\sÃ©]+$/) && lines[i+1]?.includes('ÜGYESSÉG')) {
        break;
      }
      
      // Ha választási opció kezdődik
      if (line.match(/^Ha .+ lapozz a[z]? \d+/i)) {
        break;
      }
      
      textLines.push(line);
    }
    
    const mainText = textLines.join('\n').trim();
    
    // Ellenség információk keresése
    const enemies = parseEnemies(trimmed, mainText);
    
    // Choices kinyerése
    const choices = parseChoices(trimmed);
    
    // Vége ellenőrzése
    const isEnd = trimmed.includes('Kalandod itt véget ér') || 
                  trimmed.includes('kalandod itt véget ér');
    
    // Action meghatározása
    const action = determineAction(trimmed, enemies);
    
    // Effektek
    const effects = determineEffects(trimmed);
    
    // Tárgyak kinyerése
    const items = extractItems(trimmed);
    
    const entry = {
      id: id,
      text: mainText,
      choices: choices.length > 0 ? choices : null,
      enemy: enemies.length > 0 ? enemies : null,
      action: action,
      items: items,
      ...(effects && { effects }),
      end: isEnd
    };
    
    entries.push(entry);
  });
  
  return entries;
}

function parseEnemies(text, mainText) {
  const enemies = [];
  
  // Egyszerű ellenség minta
  const simpleEnemyRegex = /([A-ZÀ-Űa-zà-ű\sÃ©]+)\nÃœGYESSÃ‰G\s+(\d+)\nÃ‰LETERÅ\s+(\d+)/g;
  let match;
  
  while ((match = simpleEnemyRegex.exec(text)) !== null) {
    enemies.push({
      name: match[1].trim(),
      skill: parseInt(match[2]),
      stamina: parseInt(match[3]),
      place: determinePlace(mainText)
    });
  }
  
  // Speciális eset: Tükörképnél
  if (text.includes('tükörképed') && text.includes('ugyanolyan ÜGYESSÉGGEL')) {
    enemies.push({
      name: "Tükörkép",
      skill: "player.skill",
      stamina: "player.stamina - 2",
      place: "mirror"
    });
  }
  
  return enemies;
}

function parseChoices(text) {
  const choices = [];
  
  // Választási opciók regex-ek
  const patterns = [
    /Ha\s+([^,]+?),?\s+lapozz\s+a[z]?\s+(\d+)-r[ea]/gi,
    /Hogyha\s+([^,]+?),?\s+lapozz\s+a[z]?\s+(\d+)-r[ea]/gi,
    /Amennyiben\s+([^,]+?),?\s+lapozz\s+a[z]?\s+(\d+)-r[ea]/gi
  ];
  
  patterns.forEach(pattern => {
    let match;
    const regex = new RegExp(pattern);
    
    while ((match = regex.exec(text)) !== null) {
      const choiceText = match[0];
      const target = parseInt(match[2]);
      
      // Feltétel meghatározása
      const condition = determineCondition(choiceText);
      
      const choice = {
        text: choiceText,
        target: target
      };
      
      if (condition) {
        choice.condition = condition;
      }
      
      choices.push(choice);
    }
  });
  
  return choices;
}

function determineCondition(choiceText) {
  const lowerText = choiceText.toLowerCase();
  
  // Tárgy birtoklás
  if (lowerText.includes('nálad van') || lowerText.includes('van nálad')) {
    if (lowerText.includes('aranykulcs') || lowerText.includes('arany kulcs')) {
      return "tombNev.includes('aranykulcs')";
    }
    if (lowerText.includes('bronz kulcs') || lowerText.includes('bronzkulcs')) {
      return "tombNev.includes('bronzkulcs')";
    }
    if (lowerText.includes('lebegés köpenye')) {
      return "tombNev.includes('lebegeskopenye')";
    }
    if (lowerText.includes('szobor')) {
      return "tombNev.includes('szobor')";
    }
    if (lowerText.includes('ügyesség gyűrűje')) {
      return "tombNev.includes('ugyesseggyuruje')";
    }
  }
  
  // Tárgy hiánya
  if (lowerText.includes('nincs')) {
    if (lowerText.includes('aranykulcs')) {
      return "!tombNev.includes('aranykulcs')";
    }
    if (lowerText.includes('bronz kulcs') || lowerText.includes('bronzkulcs')) {
      return "!tombNev.includes('bronzkulcs')";
    }
    if (lowerText.includes('szobor')) {
      return "!tombNev.includes('szobor')";
    }
    if (lowerText.includes('lebegés köpenye')) {
      return "!tombNev.includes('lebegeskopenye')";
    }
  }
  
  // Szerencse
  if (lowerText.includes('szerencsés vagy') || lowerText.includes('szerencséd van')) {
    return "fortunresult == true";
  }
  if (lowerText.includes('nincs szerencsé') || lowerText.includes('balszerencsés')) {
    return "fortunresult == false";
  }
  
  return null;
}

function determineAction(text, enemies) {
  // Harc típusú akciók
  if (enemies.length > 0) {
    if (text.includes('egyesével kell megküzdened') || 
        text.includes('el kell döntened, melyikükkel')) {
      return 'chooseEnemy';
    }
    
    if (text.includes('3 ÉLETERŐ pontot kell levonnod')) {
      return { type: 'combat', subtype: 'damagethree' };
    }
    
    return { type: 'combat', subtype: '' };
  }
  
  // Szerencse próba
  if (text.includes('Tedd próbára SZERENCSED')) {
    return 'tryFortune';
  }
  
  // Kockadobás
  if (text.includes('Dobj két kockával')) {
    return 'rollTwoDice';
  }
  
  // Ajtó betörés
  if (text.includes('betörni') && text.includes('Dobj egy kockával')) {
    return 'doorBreak';
  }
  
  // Zár nyitás
  if (text.includes('tárcsákat') && text.includes('kombinációt')) {
    const lockMatch = text.match(/add össze a számokat.*?(\d+)/);
    if (lockMatch) {
      return { type: 'lock', subtype: parseInt(lockMatch[1]) };
    }
  }
  
  // Tárgy elvesztés
  if (text.includes('kiesett a hátizsákodból')) {
    const items = text.match(/(\d+)\s+tárgy/);
    if (items) {
      return [
        { type: 'looseItems', amount: parseInt(items[1]) },
        ...parseStatChanges(text)
      ];
    }
  }
  
  // Stat változások
  const statChanges = parseStatChanges(text);
  if (statChanges.length > 0) {
    return statChanges;
  }
  
  return null;
}

function parseStatChanges(text) {
  const changes = [];
  
  // Életerő változás (vesztés)
  const healthLossMatch = text.match(/[Vv]esztesz\.?\s*(\d+)\s*Ã‰LETERÅ/);
  if (healthLossMatch) {
    changes.push({
      type: 'healthChange',
      amount: -parseInt(healthLossMatch[1])
    });
  }
  
  // Életerő változás (nyereség)
  const healthGainMatch = text.match(/[Nn]yersz\.?\s*(\d+)\s*Ã‰LETERÅ/);
  if (healthGainMatch) {
    changes.push({
      type: 'healthChange',
      amount: parseInt(healthGainMatch[1])
    });
  }
  
  // Szerencse változás (vesztés)
  const fortuneLossMatch = text.match(/[Vv]esztesz\s*(\d+)\s*SZERENCSE/);
  if (fortuneLossMatch) {
    changes.push({
      type: 'fortuneChange',
      amount: -parseInt(fortuneLossMatch[1])
    });
  }
  
  // Szerencse változás (nyereség)
  const fortuneGainMatch = text.match(/[Nn]yersz\.?\s*(\d+)\s*SZERENCSE/);
  if (fortuneGainMatch) {
    changes.push({
      type: 'fortuneChange',
      amount: parseInt(fortuneGainMatch[1])
    });
  }
  
  // Kezdeti érték változás
  if (text.includes('Kezdeti SZERENCSÉDET')) {
    changes.push({
      type: 'startPointChange',
      amount: 1,
      subtype: 'fortune'
    });
  }
  
  return changes;
}

function determineEffects(text) {
  if (text.includes('SZERENCSE pontjaid') && text.includes('nem fognak 6 alá menni')) {
    return 'fortuneSixPoints';
  }
  if (text.includes('1-el megnövelheted majd Támadóerődet')) {
    return 'attackChangePlusOne';
  }
  if (text.includes('2-vel csökkentened kell majd Támadóerődet')) {
    return 'attackChangeMinusTwo';
  }
  if (text.includes('1-el csökkentened kell majd Támadóerődet')) {
    return 'attackChangeMinusOne';
  }
  if (text.includes('dobás értékét megnövelheted 1-el')) {
    return 'fortuneChangePlusOne';
  }
  return null;
}

function extractItems(text) {
  const items = [];
  
  const itemMap = {
    'kötél': 'kötél',
    'aranykulcs': 'aranykulcs',
    'arany kulcs': 'aranykulcs',
    'bronz kulcs': 'bronzkulcs',
    'bronzkulcs': 'bronzkulcs',
    'rubin': 'rubin',
    'gyémánt': 'gyémánt',
    'pergamen': 'Pergamen',
    'lebegés köpenye': 'lebegeskopenye',
    'ügyesség gyűrűje': 'ugyesseggyuruje',
    'szobor': 'szobor',
    'aranykarmok': 'aranykarmok',
    'xentos': 'Xentos',
    'kék könyv': 'kék könyv'
  };
  
  // Aranytallér speciális kezelés
  const goldMatch = text.match(/(\d+)\s+AranytallÃ©r/i);
  if (goldMatch) {
    const amount = parseInt(goldMatch[1]);
    for (let i = 0; i < amount; i++) {
      items.push('aranytallér');
    }
  }
  
  // Többi tárgy
  for (const [key, value] of Object.entries(itemMap)) {
    const regex = new RegExp(key, 'i');
    if (regex.test(text)) {
      // Ellenőrizzük, hogy nem már az aranytallér részénél találtuk-e
      if (value !== 'aranytallér' || !goldMatch) {
        items.push(value);
      }
    }
  }
  
  return items;
}

function determinePlace(text) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('pók')) return 'spider_room';
  if (lowerText.includes('sárkány')) return 'dragon';
  if (lowerText.includes('ork')) return 'orc';
  if (lowerText.includes('denevér')) return 'batcave';
  if (lowerText.includes('tükör')) return 'mirror';
  if (lowerText.includes('xlaia')) return 'xlaia_room';
  if (lowerText.includes('galon') || lowerText.includes('madárember')) return 'galon_room';
  if (lowerText.includes('fényimádó') || lowerText.includes('kristály')) return 'light';
  if (lowerText.includes('lépcső')) return 'stairs';
  if (lowerText.includes('sündisznó')) return 'hedgehog';
  if (lowerText.includes('hobgoblin')) return 'hobgoblin';
  if (lowerText.includes('tolvaj')) return 'tunnel';
  if (lowerText.includes('törpe')) return 'stairs';
  
  return 'unknown';
}

// Export a függvény használatához
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { convertGamebookToJSON };
}