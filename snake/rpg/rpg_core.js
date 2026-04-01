const Game = {
    p: { lvl: 1, floor: 1, hp: 100, maxHp: 100, gold: 250, atk: 15, def: 8, wep: 0, arm: 0, passives: [] },

    init() {
        this.sync();
        Combat.spawn();
        this.log("SYSTEM READY... INICJACJA BOJOWA", "#00ff88");
    },

    sync() {
        document.getElementById('h-lvl').innerText = this.p.lvl;
        document.getElementById('h-floor').innerText = this.p.floor;
        document.getElementById('h-gold').innerText = Math.floor(this.p.gold);
        document.getElementById('h-hp-text').innerText = `${Math.ceil(this.p.hp)}/${this.p.maxHp}`;
        document.getElementById('p-hp-fill').style.width = Math.max(0, (this.p.hp / this.p.maxHp * 100)) + "%";
    },

    log(m, c = "#00ff88") {
        const b = document.getElementById('log-box');
        // Dodajemy nowy wpis na początku (dzięki flex-direction: column-reverse w CSS będzie na górze)
        b.innerHTML = `<div style="color:${c}; margin-bottom: 2px;">> ${m}</div>` + b.innerHTML;
    },

    cheat(cmd) {
        if (cmd === "hesoyam") {
            this.p.gold += 50000;
            this.log("MODYFIKACJA WALUTY: +50000C", "gold");
        }
        if (cmd === "god") {
            this.p.maxHp = 9999;
            this.p.hp = 9999;
            this.p.atk = 1000;
            this.log("GOD_MODE: ACTIVATED", "red");
        }
        this.sync();
    }
};

const Combat = {
    e: null,

    spawn() {
        const isB = Game.p.lvl % 10 === 0;
        const fM = 1 + (Game.p.floor * 0.15);
        this.e = {
            hp: (40 + Game.p.lvl * 25) * fM * (isB ? 2.5 : 1),
            atk: (6 + Game.p.lvl * 4) * fM * (isB ? 1.4 : 1),
            boss: isB
        };
        this.e.maxHp = this.e.hp;
        const eName = isB ? "RAID_BOSS" : "BOT_UNIT_" + Game.p.lvl;
        document.getElementById('e-name').innerText = eName;

        Game.log(`WYKRYTO PRZECIWNIKA: ${eName}`, "#ff3c3c");
        this.update();
    },

    update() {
        document.getElementById('e-hp-fill').style.width = Math.max(0, (this.e.hp / this.e.maxHp * 100)) + "%";
    },

    hit(type) {
        if (this.e.hp <= 0 || Game.p.hp <= 0) return;

        // --- TURZA GRACZA ---
        let pA = Game.p.atk + Game.p.wep;

        // Pasywka: Berserk
        if (Game.p.passives.includes('berserk') && (Game.p.hp / Game.p.maxHp < 0.35)) {
            pA *= 2;
            Game.log("PROTOKÓŁ ZAGŁADY AKTYWNY! (x2 ATK)", "#ffae00");
        }

        let d = pA * (type === 'HEAVY' ? 1.8 : 1);

        // Krytyk
        if (Game.p.passives.includes('crit') && Math.random() < 0.3) {
            d *= 2;
            Game.log("TRAFIENIE KRYTYCZNE!", "yellow");
        }

        this.e.hp -= d;
        this.pop(d, 'enemy');
        Game.log(`Zadajesz ${Math.floor(d)} DMG (${type})`, "#fff");

        // Wampiryzm
        let v = 0;
        if (Game.p.passives.includes('vamp_low')) v = 0.05;
        if (Game.p.passives.includes('vamp')) v = 0.15;
        if (Game.p.passives.includes('vamp_god')) v = 0.45;

        if (v > 0) {
            let vHeal = d * v;
            Game.p.hp = Math.min(Game.p.maxHp, Game.p.hp + vHeal);
            // Logujemy tylko większe uleczenia, by nie spamować
            if (vHeal > 1) Game.log(`Wampiryzm: +${Math.floor(vHeal)} HP`, "#ff00ff");
        }

        if (this.e.hp <= 0) return this.win();

        // --- TURA PRZECIWNIKA ---
        setTimeout(() => {
            let ed = Math.max(2, this.e.atk - (Game.p.def + Game.p.arm));
            Game.p.hp -= ed;
            this.pop(ed, 'player');
            Game.log(`Przeciwnik zadaje ${Math.floor(ed)} DMG`, "#ff3c3c");

            // Kolce
            if (Game.p.passives.includes('thorns')) {
                let tDmg = ed * 0.3;
                this.e.hp -= tDmg;
                Game.log(`Kolce odbijają ${Math.floor(tDmg)} DMG`, "#00f2ff");
            }

            // Regeneracja
            let r = 0;
            if (Game.p.passives.includes('regen_low')) r = 3;
            if (Game.p.passives.includes('immortal')) r = 50;
            if (r > 0) {
                Game.p.hp = Math.min(Game.p.maxHp, Game.p.hp + r);
                Game.log(`Regeneracja: +${r} HP`, "#00ff88");
            }

            if (Game.p.hp <= 0) {
                Game.log("KRYTYCZNE USZKODZENIA... SHUTDOWN.", "red");
                alert("GAME OVER");
                location.reload();
            }
            Game.sync();
            this.update();
        }, 400);

        Game.sync();
        this.update();
    },

    win() {
        let rew = 200 + (Game.p.lvl * 50);

        // Bonusy do złota
        if (Game.p.passives.includes('scavenger')) rew *= 1.15;
        if (Game.p.passives.includes('rich')) rew *= 2.0;

        Game.p.gold += rew;
        Game.log(`ZWYCIĘSTWO! Zysk: ${Math.floor(rew)}C`, "gold");

        Game.p.lvl++;
        Game.p.maxHp += 20;
        Game.p.atk += 5;
        Game.p.def += 3;

        Shop.refreshOffer();

        if (this.e.boss) {
            Game.p.floor++;
            Game.log(`OSIĄGNIĘTO PIĘTRO ${Game.p.floor}`, "#bc00ff");
        }

        this.spawn();
        Game.sync();
    },

    heal() {
        if (Game.p.gold >= 50) {
            Game.p.gold -= 50;
            Game.p.hp = Math.min(Game.p.maxHp, Game.p.hp + 120);
            Game.log("NAPRAWA ZAKOŃCZONA: +120 HP", "#00ff88");
            Game.sync();
        } else {
            Game.log("BRAK ŚRODKÓW NA NAPRAWĘ!", "red");
        }
    },

    pop(v, id) {
        const p = document.createElement('div');
        p.className = 'dmg';
        p.innerText = '-' + Math.floor(v);
        document.getElementById(id).appendChild(p);
        setTimeout(() => p.remove(), 400);
    }
};

window.onload = () => Game.init();