const DB = {
    wepNames: ["Laska_Maga", "Kostur_Pustki", "Różdżka_Blasku", "Księga_Cieni", "Orb_Energii", "Wskaźnik_Laserowy", "Klucz_Szyfrujący", "Plazmowy_Przecinak"],
    armNames: ["Szata_Maga", "Płaszcz_Nocy", "Pancerz_Wzmocniony", "Nano_Tunika", "Osłona_Eteryczna", "Splot_Kevlarowy", "Powłoka_Refleksyjna"],

    rarity: [
        { n: "ZARDZEWIAŁY", m: 0.7, p: 0.6, c: "#888", weight: 50 },
        { n: "CYBER", m: 1.2, p: 1.5, c: "#00ff88", weight: 30 },
        { n: "PROTOTYP", m: 2.5, p: 4.0, c: "#bc00ff", weight: 15 },
        { n: "LEGENDARNY", m: 5.0, p: 10.0, c: "#ffae00", weight: 5 }
    ],

    spellRarity: [
        { n: "PODSTAWOWY", m: 1.0, c: "#fff", weight: 60 },
        { n: "WZMOCNIONY", m: 1.5, c: "#00f2ff", weight: 25 },
        { n: "MODULARNY", m: 2.2, c: "#bc00ff", weight: 10 },
        { n: "HAKERSKI", m: 4.0, c: "#ffae00", weight: 5 }
    ],

    statTypes: [
        { id: "atk", n: "ATK", d: "Atak fizyczny" },
        { id: "ap", n: "MOC", d: "Moc czarów" },
        { id: "def", n: "OBRONA", d: "Redukcja obrażeń" },
        { id: "maxHp", n: "PANCERZ", d: "Dodatkowe HP" }
    ],

    spellTemplates: [
        { id: "bolt", n: "POCISK", d: "Energia kinetyczna", baseScale: 1.2 },
        { id: "fire", n: "OGIEŃ", d: "DMG obszarowy", baseScale: 2.0 },
        { id: "nova", n: "NOWA", d: "Wybuch jądra", baseScale: 3.5 },
        { id: "glitch", n: "GLITCH", d: "Błąd systemu", baseScale: 1.8 }
    ],

    passives: [
        { id: "spell_amp", n: "WZMOCNIENIE", d: "+30% DMG czarów", p: 1200, weight: 15, c: "#bc00ff" },
        { id: "mana_leech", n: "ECHO", d: "Lecz 2 HP przy czarze", p: 1000, weight: 20, c: "#00ff88" },
        { id: "tank", n: "FORTYFIKACJA", d: "+50 MAX HP", p: 900, weight: 20, c: "#00ff88" },
        { id: "rich", n: "HAKER", d: "+80% złota", p: 4000, weight: 4, c: "#ffae00" }
    ],

    enemies: [
        { n: "DRON", c: "#4ec44e", skill: null },
        {
            n: "CYBER_MAG",
            c: "#00f2ff",
            skill: { n: "KULA_OGNIA", effect: "burn", dur: 3, pwr: 8, hit: 65, cooldown: 2 }
        },
        {
            n: "KRIOBOT",
            c: "#00f2ff",
            skill: { n: "ZAMRAŻANIE", effect: "freeze", dur: 1, pwr: 0, hit: 45, cooldown: 3 }
        },
        {
            n: "WIRUS",
            c: "#bc00ff",
            skill: { n: "OVERLOAD", effect: "burn", dur: 2, pwr: 12, hit: 75, cooldown: 2 }
        }
    ]
};