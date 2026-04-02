const Game = {
    p: {
        lvl: 1, floor: 1, hp: 100, maxHp: 100, gold: 500,
        atk: 10, ap: 20, def: 8, wep: 0, arm: 0,
        exp: 0, nextLvlExp: 100,
        passives: [], effects: [],
        currentSpell: { n: "START_BOLT", scale: 1.0, c: "#fff", rarity: "ZWYKŁY" },
        killsOnFloor: 0
    },

    init() {
        this.sync();
        Combat.spawn();
        this.log("SYSTEM BOJOWY AKTYWNY", "#bc00ff");
        if (typeof Cheats !== 'undefined') Cheats.init();
    },

    sync() {
        // Obliczamy aktualne max HP (baza + bonusy z gearu + pasywka tank)
        let totalMaxHp = this.p.maxHp + (this.p.passives.includes('tank') ? 50 : 0);

        if (this.p.hp > totalMaxHp) this.p.hp = totalMaxHp;

        document.getElementById('h-floor').innerText = this.p.floor;
        document.getElementById('h-gold').innerText = Math.floor(this.p.gold);
        document.getElementById('h-hp-text').innerText = `${Math.ceil(this.p.hp)}/${totalMaxHp}`;
        document.getElementById('p-hp-val').innerText = `${Math.ceil(this.p.hp)}/${totalMaxHp}`;

        let pFill = (this.p.hp / totalMaxHp) * 100;
        document.getElementById('p-hp-fill').style.width = pFill + "%";

        document.getElementById('s-lvl').innerText = this.p.lvl;
        document.getElementById('s-atk').innerText = this.p.atk;
        document.getElementById('s-ap').innerText = Math.floor(this.p.ap);
        document.getElementById('s-def').innerText = this.p.def;
        document.getElementById('s-exp-fill').style.width = (this.p.exp / this.p.nextLvlExp * 100) + "%";

        const sList = document.getElementById('status-list');
        if (this.p.effects.length > 0) {
            sList.innerHTML = this.p.effects.map(e => `<div class="status-item" style="color:orange">${e.type.toUpperCase()} (${e.dur}T)</div>`).join('');
        } else {
            sList.innerHTML = '<div class="no-status">CLEAR</div>';
        }
    },

    processEffects() {
        for (let i = this.p.effects.length - 1; i >= 0; i--) {
            let eff = this.p.effects[i];
            if (eff.type === 'burn') {
                this.p.hp -= eff.pwr;
                this.log(`BURN: -${eff.pwr} HP`, "#ff3c3c");
                Combat.pop(eff.pwr, 'player');
            }
            eff.dur--;
            if (eff.dur <= 0) this.p.effects.splice(i, 1);
        }
        this.sync();
    },

    heal() {
        let cost = 50;
        let totalMaxHp = this.p.maxHp + (this.p.passives.includes('tank') ? 50 : 0);
        if (this.p.gold >= cost && this.p.hp < totalMaxHp) {
            this.p.gold -= cost;
            this.p.hp = Math.min(totalMaxHp, this.p.hp + 30);
            this.log("REPERACJA: +30 HP", "#00ff88");
            this.sync();
        }
    },

    log(msg, color) {
        const logBox = document.getElementById('log-box');
        if (!logBox) return;
        const div = document.createElement('div');
        div.style.color = color || "#aaa";
        div.innerHTML = `> ${msg}`;
        logBox.prepend(div);
    },

    levelUp() {
        this.p.lvl++;
        this.p.exp = 0;
        this.p.nextLvlExp = Math.floor(this.p.nextLvlExp * 1.5);
        this.p.maxHp += 20;
        this.p.hp += 50;
        this.p.atk += 5;
        this.p.ap += 10;
        this.p.def += 3;
        this.log(`LEVEL UP: ${this.p.lvl}`, "#00ff88");
        this.sync();
    },

    gameOver() {
        document.getElementById('death-screen').style.display = "block";
        document.getElementById('death-lvl').innerText = this.p.lvl;
        document.getElementById('death-floor').innerText = this.p.floor;
    }
};

const Combat = {
    e: null,
    spawn() {
        let isBoss = Game.p.killsOnFloor >= 5;
        let raw = DB.enemies[Math.floor(Math.random() * DB.enemies.length)];
        this.e = JSON.parse(JSON.stringify(raw));
        this.e.maxHp = Math.floor((50 + (Game.p.floor * 30)) * (isBoss ? 3 : 1));
        this.e.hp = this.e.maxHp;
        this.e.atk = Math.floor((8 + (Game.p.floor * 4)) * (isBoss ? 1.5 : 1));
        this.e.turnCounter = 0;
        if (isBoss) this.e.n = "BOSS_" + this.e.n;

        document.getElementById('e-name').innerText = this.e.n;
        document.getElementById('e-name').style.color = isBoss ? "#f00" : this.e.c;
        this.update();
    },

    update() {
        let eFill = (this.e.hp / this.e.maxHp) * 100;
        document.getElementById('e-hp-fill').style.width = eFill + "%";
        document.getElementById('e-hp-val').innerText = `${Math.ceil(this.e.hp)}/${this.e.maxHp}`;
    },

    hit(type) {
        let dmg = 0;
        if (type === 'SPELL') {
            dmg = (Game.p.ap + (Game.p.lvl * 2)) * Game.p.currentSpell.scale;
            if (Game.p.passives.includes('spell_amp')) dmg *= 1.3;
            if (Game.p.passives.includes('mana_leech')) Game.p.hp = Math.min(Game.p.maxHp + 50, Game.p.hp + 2);
            Game.log(`CZAR: ${Game.p.currentSpell.n} (-${Math.floor(dmg)})`, "#00f2ff");
        } else {
            dmg = Game.p.atk;
            Game.log(`ATAK: ${Math.floor(dmg)}`, "#fff");
        }

        this.e.hp -= dmg;
        this.pop(Math.floor(dmg), 'enemy');

        if (this.e.hp <= 0) {
            setTimeout(() => this.win(), 300);
        } else {
            this.enemyTurn();
        }
        this.update();
        Game.sync();
    },

    enemyTurn() {
        setTimeout(() => {
            if (this.e.hp <= 0) return;

            // Sprawdź czy gracz jest zamrożony
            let isFrozen = Game.p.effects.find(f => f.type === 'freeze');
            if (isFrozen) {
                Game.log("JESTEŚ ZAMROŻONY - TRACISZ TURĘ!", "#00f2ff");
                this.e.turnCounter++;
                Game.processEffects();
                return;
            }

            this.e.turnCounter++;
            let dmg = Math.max(1, this.e.atk - Game.p.def);

            // LOGIKA UMIEJĘTNOŚCI PRZECIWNIKA
            if (this.e.skill && this.e.turnCounter % this.e.skill.cooldown === 0) {
                let s = this.e.skill;
                if (Math.random() * 100 <= s.hit) {
                    Game.p.effects.push({ type: s.effect, pwr: s.pwr, dur: s.dur });
                    Game.log(`${this.e.n} UŻYWA ${s.n}!`, "orange");
                    Game.log(`NAŁOŻONO ${s.effect.toUpperCase()}!`, "orange");
                }
                dmg += 5;
            } else {
                Game.log(`${this.e.n} ATAKUJE: ${Math.floor(dmg)}`, "#ff3c3c");
            }

            Game.p.hp -= dmg;
            this.pop(Math.floor(dmg), 'player');

            Game.processEffects();
            if (Game.p.hp <= 0) Game.gameOver();
            Game.sync();
        }, 500);
    },

    win() {
        let isBoss = this.e.n.includes("BOSS");
        let goldWin = (150 + (Game.p.floor * 30)) * (isBoss ? 3 : 1);
        if (Game.p.passives.includes('rich')) goldWin *= 1.8;

        Game.p.gold += goldWin;
        Game.p.exp += 50 + (Game.p.lvl * 10);
        Game.log(`ZWYCIĘSTWO! +${Math.floor(goldWin)}C`, "gold");

        if (isBoss) { Game.p.floor++; Game.p.killsOnFloor = 0; }
        else { Game.p.killsOnFloor++; }

        if (Game.p.exp >= Game.p.nextLvlExp) Game.levelUp();
        this.spawn();
        Game.sync();
    },

    pop(val, target) {
        const view = document.getElementById('battle-view');
        if (!view) return;
        const p = document.createElement('div');
        p.className = 'dmg';
        p.innerText = val;
        p.style.left = target === 'player' ? '20%' : '70%';
        p.style.top = '40%';
        view.appendChild(p);
        setTimeout(() => p.remove(), 800);
    }
};

window.onload = () => Game.init();