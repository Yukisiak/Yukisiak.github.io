const Shop = {
    currentTab: 'GEAR',
    slots: { GEAR: [], SKILL: [] },

    open() {
        if (this.slots.GEAR.length === 0 && this.slots.SKILL.length === 0) this.refreshOffer();
        document.getElementById('shop-modal').style.display = "block";
        Game.sync(); // To teraz zaktualizuje też złoto w markecie
        this.draw(this.currentTab);
    },

    close() { document.getElementById('shop-modal').style.display = "none"; },

    refreshOffer() {
        this.slots.GEAR = [];
        for (let i = 0; i < 4; i++) {
            const rare = this.getRandomByWeight(DB.rarity);
            const isWep = Math.random() > 0.5;
            const names = isWep ? DB.wepNames : DB.armNames;
            const name = names[Math.floor(Math.random() * names.length)];
            this.slots.GEAR.push({
                n: `${rare.n} ${name}`,
                v: Math.floor((isWep ? 10 + Game.p.lvl * 5 : 5 + Game.p.lvl * 3) * rare.m),
                p: Math.floor((350 + Game.p.lvl * 120) * rare.p),
                t: isWep ? 'W' : 'A',
                c: rare.c
            });
        }
        this.slots.SKILL = [];
        let avail = [...DB.passives];
        for (let i = 0; i < 4; i++) {
            const s = this.getRandomByWeight(avail);
            this.slots.SKILL.push(s);
            avail = avail.filter(x => x.id !== s.id);
        }
    },

    getRandomByWeight(items) {
        let total = items.reduce((s, i) => s + i.weight, 0);
        let r = Math.random() * total;
        for (let i of items) { if (r < i.weight) return i; r -= i.weight; }
        return items[0];
    },

    draw(tab) {
        this.currentTab = tab;
        const grid = document.getElementById('shop-items');
        grid.innerHTML = '';
        this.slots[tab].forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = 'item-card';
            div.style.borderLeft = `5px solid ${item.c || '#fff'}`;
            if (tab === 'GEAR') {
                div.innerHTML = `<div class="item-info"><b style="color:${item.c}">${item.n}</b><br><small>+${item.v} ${item.t === 'W' ? 'ATK' : 'DEF'}</small></div><button class="p-btn" onclick="Shop.buyGear(${idx})">${item.p}C</button>`;
            } else {
                const owned = Game.p.passives.includes(item.id);
                div.innerHTML = `<div class="item-info"><b style="color:${item.c}">${item.n}</b><br><small>${item.d}</small></div><button class="p-btn" ${owned ? 'disabled' : ''} onclick="Shop.buySkill(${idx})">${owned ? 'OWNED' : item.p + 'C'}</button>`;
            }
            grid.appendChild(div);
        });
    },

    buyGear(idx) {
        const item = this.slots.GEAR[idx];
        if (Game.p.gold >= item.p) {
            Game.p.gold -= item.p;
            if (item.t === 'W') Game.p.wep = item.v; else Game.p.arm = item.v;
            this.slots.GEAR.splice(idx, 1);
            Game.sync(); this.draw('GEAR');
        }
    },

    buySkill(idx) {
        const item = this.slots.SKILL[idx];
        if (Game.p.gold >= item.p && !Game.p.passives.includes(item.id)) {
            Game.p.gold -= item.p;
            Game.p.passives.push(item.id);
            Game.sync(); this.draw('SKILL');
        }
    }
};