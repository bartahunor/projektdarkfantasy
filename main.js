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

// Globális változók a fájlkezeléshez
let txtContent = null;
let jsonData = null;

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
                <option value="Az Ítélet Labirintusa">Az Ítélet Labirintusa</option>
                <option value="Anakendis Sötét Krónikái">Anakendis Sötét Krónikái</option>
                <option value="A Dervis Köve">A Dervis Köve</option>
            </select>

            <button id="startGameBtn" style="margin-top:25px;">
                Játék kezdete
            </button>
        `;




        // Játék indítása
        document.getElementById("startGameBtn").onclick = () => {
            const selected = document.getElementById("bookSelect").value;

            if (!selected) {
                alert("Válassz egy krónikát!");
                return;
            }

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

/* ------------------ STÁTUSZ MEGJELENÍTÉS ------------------ */
function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    if (statusDiv) {
        statusDiv.textContent = message;
        statusDiv.className = 'status ' + type;
        statusDiv.style.display = 'block';
        
        if (type === 'error') {
            statusDiv.style.color = '#ff4444';
        } else if (type === 'success') {
            statusDiv.style.color = '#44ff44';
        } else {
            statusDiv.style.color = '#c6626d';
        }
    }
}

