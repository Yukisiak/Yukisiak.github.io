const DB = {
    wepNames: ["OSTRZE", "PIŁA", "LASER", "KATANA", "PRZEBIJAK", "DEZINTEGRATOR", "PLAZMA", "SZPON"],
    armNames: ["PANCERZ", "POŁOKA", "TARCZA", "MODUŁ_WZMOCNIONY", "NANO_SKÓRA", "KEVLAR", "TITAN", "POLIMER"],

    rarity: [
        { n: "ZARDZEWIAŁY", m: 0.8, p: 0.5, c: "#888", weight: 50 },
        { n: "CYBER", m: 1.2, p: 1.0, c: "#00ff88", weight: 30 },
        { n: "PROTOTYP", m: 2.2, p: 2.5, c: "#bc00ff", weight: 15 },
        { n: "LEGENDARNY", m: 4.5, p: 6.0, c: "#ffae00", weight: 5 }
    ],

    passives: [
        { id: "vamp_low", n: "WAMPIRYZM_MINI", d: "5% DMG jako HP", p: 200, weight: 40, c: "#888" },
        { id: "regen_low", n: "STARA_BATERIA", d: "3 HP co turę", p: 250, weight: 35, c: "#888" },
        { id: "scavenger", n: "ZBIERACZ_ZŁOMU", d: "+15% złota", p: 300, weight: 30, c: "#00ff88" },
        { id: "vamp", n: "WAMPIRYZM_PRO", d: "15% DMG jako HP", p: 500, weight: 15, c: "#bc00ff" },
        { id: "thorns", n: "KOLCE_ENERGETYCZNE", d: "Odbija 30% DMG", p: 600, weight: 15, c: "#bc00ff" },
        { id: "crit", n: "PROCESOR_CELOWNICZY", d: "+30% na CRIT", p: 700, weight: 12, c: "#bc00ff" },
        { id: "vamp_god", n: "WAMPIRYZM_BOGA", d: "45% DMG jako HP", p: 1500, weight: 4, c: "#ffae00" },
        { id: "berserk", n: "PROTOKÓŁ_ZAGŁADY", d: "+100% ATK gdy <35% HP", p: 2000, weight: 3, c: "#ffae00" },
        { id: "rich", n: "HAKER_KWANTOWY", d: "+100% złota", p: 1800, weight: 4, c: "#ffae00" },
        { id: "immortal", n: "NANO_RESTART", d: "50 HP co turę", p: 2500, weight: 2, c: "#ffae00" }
    ]
};