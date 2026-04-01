const Shop = {
    currentTab: 'GEAR',
    slots: { GEAR: [], SKILL: [] },

    getRandomByWeight(items) {
        let total = items.reduce((s, i) => s + i.weight, 0);
        let r = Math.random() * total;
        for (let i of items) {
            if (r < i.weight) return i;
            r -= i.weight;
        }
        return items[0];
    },

    open() {
        this.refreshOffer();
        document.getElementById('shop-modal').style.display = "block";
        this.draw(this.currentTab);
    },

    refreshOffer() {
        this.slots.GEAR = [];
        for (let i = 0; i < 4; i++) {
            const rare = this.getRandomByWeight(DB.rarity);
            const isWep = Math.random() > 0.5;
            const name = isWep ? DB.wepNames[Math.floor(Math.random() * DB.wepNames.length)] : DB.armNames[Math.floor(Math.random() * DB.armNames.length)];
            this.slots.GEAR.push({
                n: `${rare.n} ${name}`,
                v: Math.floor((15 + Game.p.lvl * 12) * rare.m),
                p: Math.floor((100 + Game.p.lvl * 30) * rare.p),
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

    draw(tab) {
        this.currentTab = tab;
        const grid = document.getElementById('shop-items');
        grid.innerHTML = "";
        this.slots[tab].forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = "item-card";
            div.style.borderLeft = `5px solid ${item.c}`;
            if (tab === 'GEAR') {
                div.innerHTML = `<span><b style="color:${item.c}">${item.n}</b><br>+${item.v} ${item.t === 'W' ? 'ATK' : 'DEF'}</span>
                                 <button class="p-btn" onclick="Shop.buyGear(${idx})">${item.p}C</button>`;
            } else {
                const owned = Game.p.passives.includes(item.id);
                div.innerHTML = `<span><b style="color:${item.c}">${item.n}</b><br><small>${item.d}</small></span>
                                 <button class="p-btn" ${owned ? 'disabled' : ''} onclick="Shop.buySkill(${idx})">${owned ? 'MAKS' : item.p + 'C'}</button>`;
            }
            grid.appendChild(div);
        });
    },

    buyGear(idx) {
        const item = this.slots.GEAR[idx];
        if (Game.p.gold < item.p) return;
        Game.p.gold -= item.p;
        if (item.t === 'W') Game.p.wep = item.v; else Game.p.arm = item.v;
        this.slots.GEAR.splice(idx, 1);
        Game.sync(); this.draw('GEAR');
    },

    buySkill(idx) {
        const s = this.slots.SKILL[idx];
        if (Game.p.gold < s.p) return;
        Game.p.gold -= s.p;
        Game.p.passives.push(s.id);
        this.slots.SKILL.splice(idx, 1);
        Game.sync(); this.draw('SKILL');
    },

    close() { document.getElementById('shop-modal').style.display = "none"; }
};