const Game = {
    p: { lvl: 1, floor: 1, hp: 100, maxHp: 100, gold: 250, atk: 15, def: 8, wep: 0, arm: 0, passives: [] },
    init() { this.sync(); Combat.spawn(); },
    sync() {
        document.getElementById('h-lvl').innerText = this.p.lvl;
        document.getElementById('h-floor').innerText = this.p.floor;
        document.getElementById('h-gold').innerText = Math.floor(this.p.gold);
        document.getElementById('h-hp-text').innerText = `${Math.ceil(this.p.hp)}/${this.p.maxHp}`;
        document.getElementById('p-hp-fill').style.width = Math.max(0, (this.p.hp / this.p.maxHp * 100)) + "%";
    },
    log(m, c = "#00ff88") {
        const b = document.getElementById('log-box');
        b.innerHTML = `<div style="color:${c}">> ${m}</div>` + b.innerHTML;
    },
    cheat(cmd) {
        if (cmd === "hesoyam") this.p.gold += 50000;
        if (cmd === "god") { this.p.maxHp = 9999; this.p.hp = 9999; this.p.atk = 1000; }
        this.sync();
    }
};

const Combat = {
    e: null,
    spawn() {
        const isB = Game.p.lvl % 10 === 0;
        const fM = 1 + (Game.p.floor * 0.15);
        this.e = { hp: (40 + Game.p.lvl * 25) * fM * (isB ? 2.5 : 1), atk: (6 + Game.p.lvl * 4) * fM * (isB ? 1.4 : 1), boss: isB };
        this.e.maxHp = this.e.hp;
        document.getElementById('e-name').innerText = isB ? "RAID_BOSS" : "BOT_UNIT_" + Game.p.lvl;
        this.update();
    },
    update() { document.getElementById('e-hp-fill').style.width = Math.max(0, (this.e.hp / this.e.maxHp * 100)) + "%"; },
    hit(type) {
        if (this.e.hp <= 0 || Game.p.hp <= 0) return;
        let pA = Game.p.atk + Game.p.wep;
        if (Game.p.passives.includes('berserk') && (Game.p.hp / Game.p.maxHp < 0.35)) pA *= 2;

        let d = pA * (type === 'HEAVY' ? 1.8 : 1);
        if (Game.p.passives.includes('crit') && Math.random() < 0.3) { d *= 2; Game.log("CRIT!", "yellow"); }

        this.e.hp -= d;
        this.pop(d, 'enemy');

        // VAMP LOGIC
        let v = 0;
        if (Game.p.passives.includes('vamp_low')) v = 0.05;
        if (Game.p.passives.includes('vamp')) v = 0.15;
        if (Game.p.passives.includes('vamp_god')) v = 0.45;
        Game.p.hp = Math.min(Game.p.maxHp, Game.p.hp + d * v);

        if (this.e.hp <= 0) return this.win();

        setTimeout(() => {
            let ed = Math.max(2, this.e.atk - (Game.p.def + Game.p.arm));
            Game.p.hp -= ed;
            this.pop(ed, 'player');
            if (Game.p.passives.includes('thorns')) this.e.hp -= ed * 0.3;

            let r = 0;
            if (Game.p.passives.includes('regen_low')) r = 3;
            if (Game.p.passives.includes('immortal')) r = 50;
            Game.p.hp = Math.min(Game.p.maxHp, Game.p.hp + r);

            if (Game.p.hp <= 0) { alert("DEAD."); location.reload(); }
            Game.sync(); this.update();
        }, 300);
        Game.sync(); this.update();
    },
    win() {
        let rew = 200 + (Game.p.lvl * 50);
        if (Game.p.passives.includes('scavenger')) rew *= 1.15;
        if (Game.p.passives.includes('rich')) rew *= 2.0;
        Game.p.gold += rew;
        Game.p.lvl++;
        Game.p.maxHp += 20; Game.p.atk += 5; Game.p.def += 3;
        if (this.e.boss) Game.p.floor++;
        this.spawn(); Game.sync();
    },
    heal() {
        if (Game.p.gold >= 50) { Game.p.gold -= 50; Game.p.hp = Math.min(Game.p.maxHp, Game.p.hp + 120); Game.sync(); }
    },
    pop(v, id) {
        const p = document.createElement('div'); p.className = 'dmg'; p.innerText = '-' + Math.floor(v);
        document.getElementById(id).appendChild(p);
        setTimeout(() => p.remove(), 400);
    }
};
window.onload = () => Game.init();