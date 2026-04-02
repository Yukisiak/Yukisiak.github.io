const DB = {
    wepNames: ["OSTRZE_REKINY", "PIŁA_ZĘBATA", "LASER_V2", "KATANA_CIENIA", "PRZEBIJAK_X", "DEZINTEGRATOR", "PLAZMA_CORE", "SZPON_BESTII", "MŁOT_ENERGETYCZNY", "NANO_SZTYLET", "BŁYSKAWICA", "KOSZMAR"],
    armNames: ["PANCERZ_REAKTYWNY", "POWŁOKA_LUSTRZANA", "TARCZA_MK3", "MODUŁ_WZMOCNIONY", "NANO_SKÓRA", "KEVLAR_V5", "TITAN_HEX", "POLIMER_S", "SPORE_DRZEWO", "GHOST_SHELL"],

    rarity: [
        { n: "ZARDZEWIAŁY", m: 0.7, p: 0.6, c: "#888", weight: 50 },
        { n: "CYBER", m: 1.2, p: 1.5, c: "#00ff88", weight: 30 },
        { n: "PROTOTYP", m: 2.5, p: 4.0, c: "#bc00ff", weight: 15 },
        { n: "LEGENDARNY", m: 5.0, p: 10.0, c: "#ffae00", weight: 5 }
    ],

    passives: [
        { id: "vamp_low", n: "WAMPIRYZM_MINI", d: "5% DMG jako HP", p: 400, weight: 30, c: "#888" },
        { id: "regen_low", n: "STARA_BATERIA", d: "4 HP co turę", p: 500, weight: 30, c: "#888" },
        { id: "scavenger", n: "ZBIERACZ_ZŁOMU", d: "+10% złota", p: 800, weight: 20, c: "#00ff88" },
        { id: "tank", n: "MODUŁ_FORTYFIKACJI", d: "+50 MAX HP", p: 900, weight: 20, c: "#00ff88" },
        { id: "glass_cannon", n: "SZKLANE_DZIAŁO", d: "+40 ATK / -20 DEF", p: 1000, weight: 15, c: "#00ff88" },
        { id: "vamp", n: "WAMPIRYZM_PRO", d: "15% DMG jako HP", p: 1500, weight: 10, c: "#bc00ff" },
        { id: "thorns", n: "KOLCE_ENERGETYCZNE", d: "Odbija 40% DMG", p: 1800, weight: 10, c: "#bc00ff" },
        { id: "crit", n: "PROCESOR_CELOWNICZY", d: "+35% na CRIT", p: 2000, weight: 10, c: "#bc00ff" },
        { id: "overclock", n: "OVERCLOCKING", d: "+50% DMG, -5 HP/tura", p: 2200, weight: 8, c: "#bc00ff" },
        { id: "vamp_god", n: "WAMPIRYZM_BOGA", d: "50% DMG jako HP", p: 4500, weight: 3, c: "#ffae00" },
        { id: "berserk", n: "PROTOKÓŁ_ZAGŁADY", d: "+150% ATK gdy <35% HP", p: 5000, weight: 3, c: "#ffae00" },
        { id: "rich", n: "HAKER_KWANTOWY", d: "+80% złota", p: 4000, weight: 4, c: "#ffae00" },
        { id: "immortal", n: "NANO_RESTART", d: "60 HP co turę", p: 6000, weight: 2, c: "#ffae00" }
    ],

    enemies: [
        { n: "DRON_ZWIADOWCZY", c: "#4ec44e", skill: null },
        { n: "CYBER_MAG", c: "#00f2ff", skill: { n: "KULA_OGNIA", effect: "burn", dur: 3, pwr: 12, chance: 0.4 } },
        { n: "WIRUS_SYSTEMOWY", c: "#bc00ff", skill: { n: "PRZECIĄŻENIE", effect: "weak", dur: 2, pwr: 0.5, chance: 0.3 } },
        { n: "TOKSYCZNY_BOT", c: "#adff2f", skill: { n: "KWAS_NANO", effect: "acid", dur: 4, pwr: 8, chance: 0.5 } }
    ],

    statusEffects: {
        burn: { n: "PODPALENIE", c: "#ff4500" },
        weak: { n: "OSŁABIENIE", c: "#888" },
        acid: { n: "KOROZJA", c: "#adff2f" }
    }
};