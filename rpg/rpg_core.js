const Game = {
    p: { lvl: 1, floor: 1, hp: 100, maxHp: 100, gold: 100, atk: 15, def: 8, wep: 0, arm: 0, passives: [], effects: [] },

    init() {
        this.sync();
        Combat.spawn();
        this.log("SYSTEM READY... INICJACJA BOJOWA", "#00ff88");
    },

    sync() {
        let bHP = this.p.passives.includes('tank') ? 50 : 0;
        let mHP = this.p.maxHp + bHP;

        document.getElementById('h-lvl').innerText = this.p.lvl;
        document.getElementById('h-floor').innerText = this.p.floor;
        document.getElementById('h-gold').innerText = Math.floor(this.p.gold);
        document.getElementById('h-hp-text').innerText = `${Math.ceil(this.p.hp)}/${mHP}`;
        document.getElementById('p-hp-fill').style.width = Math.max(0, (this.p.hp / mHP * 100)) + "%";

        // Aktualizacja kasy w otwartym sklepie
        const shopGold = document.getElementById('shop-gold-display');
        if (shopGold) shopGold.innerText = Math.floor(this.p.gold);

        this.drawEffects();
    },

    drawEffects() {
        let eBox = document.getElementById('p-effects');
        if (!eBox) {
            eBox = document.createElement('div');
            eBox.id = 'p-effects';
            eBox.style.cssText = "display:flex; gap:5px; margin-top:5px; justify-content:center; flex-wrap:wrap; min-height:20px;";
            document.getElementById('player').appendChild(eBox);
        }
        eBox.innerHTML = this.p.effects.map(ef => {
            const data = DB.statusEffects[ef.id];
            return `<span style="border:1px solid ${data.c}; color:${data.c}; font-size:10px; padding:2px; background: rgba(0,0,0,0.5)">${data.n} [${ef.rem}]</span>`;
        }).join('');
    },

    log(m, c = "#00ff88") {
        const b = document.getElementById('log-box');
        b.innerHTML = `<div style="color:${c}; margin-bottom: 2px;">> ${m}</div>` + b.innerHTML;
    },

    gameOver() {
        const modal = document.createElement('div');
        modal.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); color:red; display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:9999; font-family:monospace; text-align:center; padding:20px;";
        const passiveNames = this.p.passives.map(id => (DB.passives.find(p => p.id === id) || { n: id }).n).join(', ') || "BRAK";
        modal.innerHTML = `<h1>GAME OVER</h1><p>PIĘTRO: ${this.p.floor}</p><p>MODUŁY: ${passiveNames}</p><button onclick="location.reload()" style="padding:10px; background:red; color:white; border:none; margin-top:20px;">RESTART</button>`;
        document.body.appendChild(modal);
    },

    cheat(cmd) {
        const c = cmd.toLowerCase().trim();
        if (c === "hesoyam" || c === "handsom" || c === "hand some") {
            this.p.gold += 10000;
            this.log("CHEAT: +10.000C", "gold");
        }
        if (c === "god") {
            this.p.maxHp = 99999; this.p.hp = 99999; this.p.atk = 5000;
            this.log("CHEAT: GOD_MODE", "red");
        }
        this.sync();
        if (document.getElementById('cheat-input')) document.getElementById('cheat-input').value = '';
    }
};

const Combat = {
    e: null,
    spawn() {
        const isB = Game.p.lvl % 10 === 0;
        const fM = 1 + (Game.p.floor * 0.25);
        const type = DB.enemies[Math.floor(Math.random() * DB.enemies.length)];
        this.e = { ...type, hp: (50 + Game.p.lvl * 30) * fM * (isB ? 2.5 : 1), atk: (8 + Game.p.lvl * 6) * fM * (isB ? 1.5 : 1), boss: isB };
        this.e.maxHp = this.e.hp;
        document.getElementById('e-name').innerText = isB ? "RAID_BOSS" : `${this.e.n}_${Game.p.lvl}`;
        Game.log(`WALKA Z: ${this.e.n}`, type.c);
        this.update();
    },

    update() {
        const fill = document.getElementById('e-hp-fill');
        if (fill) fill.style.width = Math.max(0, (this.e.hp / this.e.maxHp * 100)) + "%";
    },

    hit(type) {
        if (this.e.hp <= 0 || Game.p.hp <= 0) return;

        // Gracz atakuje
        let pA = Game.p.atk + Game.p.wep + (Game.p.passives.includes('glass_cannon') ? 40 : 0);
        if (Game.p.passives.includes('berserk') && (Game.p.hp / Game.p.maxHp < 0.35)) pA *= 2.5;
        let d = pA * (type === 'HEAVY' ? 1.8 : 1);
        this.e.hp -= d;
        this.pop(d, 'enemy');
        Game.log(`Atakujesz przeciwnika za ${Math.floor(d)} DMG`, "#fff");

        if (this.e.hp <= 0) return this.win();

        // Przeciwnik atakuje
        setTimeout(() => {
            let ed = Math.max(5, this.e.atk - (Game.p.def + Game.p.arm + (Game.p.passives.includes('glass_cannon') ? -20 : 0)));
            if (Game.p.effects.find(e => e.id === 'weak')) ed *= 1.5;

            // Log użycia skilla
            if (this.e.skill && Math.random() < this.e.skill.chance) {
                Game.log(`${this.e.n} używa ${this.e.skill.n}!`, "#ffae00");
                Game.p.effects.push({ id: this.e.skill.effect, rem: this.e.skill.dur, pwr: this.e.skill.pwr });
            } else {
                Game.log(`${this.e.n} wykonuje standardowy atak`, "#ccc");
            }

            Game.p.hp -= ed;
            this.pop(ed, 'player');
            Game.log(`Otrzymujesz ${Math.floor(ed)} DMG od ${this.e.n}`, "#ff3c3c");

            // Efekty czasowe (DoT)
            Game.p.effects.forEach(ef => {
                const info = DB.statusEffects[ef.id];
                if (ef.id === 'burn' || ef.id === 'acid') {
                    Game.p.hp -= ef.pwr;
                    this.pop(ef.pwr, 'player');
                    Game.log(`Status ${info.n} zadaje Ci ${ef.pwr} DMG`, info.c);
                }
                ef.rem--;
            });

            if (Game.p.passives.includes('overclock')) {
                Game.p.hp -= 5; this.pop(5, 'player');
                Game.log("OVERCLOCK pobiera 5 HP", "#bc00ff");
            }

            Game.p.effects = Game.p.effects.filter(ef => ef.rem > 0);
            if (Game.p.hp <= 0) Game.gameOver();
            Game.sync();
            this.update();
        }, 400);
    },

    win() {
        let rew = (80 + Game.p.lvl * 20) * (Game.p.passives.includes('rich') ? 1.8 : (Game.p.passives.includes('scavenger') ? 1.1 : 1));
        Game.p.gold += rew;
        Game.log(`ZWYCIĘSTWO: +${Math.floor(rew)}C`, "gold");
        Game.p.lvl++; Game.p.maxHp += 15; Game.p.atk += 3; Game.p.effects = [];
        if (this.e.boss) { Game.p.floor++; Game.log("NOWE PIĘTRO!", "#bc00ff"); }
        Shop.refreshOffer();
        this.spawn();
        Game.sync();
    },

    heal() {
        if (Game.p.gold >= 100) {
            Game.p.gold -= 100;
            Game.p.hp = Math.min(Game.p.maxHp + (Game.p.passives.includes('tank') ? 50 : 0), Game.p.hp + 150);
            Game.log("NAPRAWIONO USZKODZENIA", "#00ff88");
            Game.sync();
        }
    },

    pop(v, id) {
        const p = document.createElement('div');
        p.className = 'dmg'; p.innerText = '-' + Math.floor(v);
        document.getElementById(id).appendChild(p);
        setTimeout(() => p.remove(), 400);
    }
};

window.onload = () => Game.init();