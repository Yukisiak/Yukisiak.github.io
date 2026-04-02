const Shop = {
    currentTab: 'GEAR',
    slots: { GEAR: [], SKILL: [], SPELLS: [] },

    open() {
        if (this.slots.GEAR.length === 0) this.refreshOffer();
        document.getElementById('shop-modal').style.display = "block";
        Game.sync();
        this.draw(this.currentTab);
    },

    close() { document.getElementById('shop-modal').style.display = "none"; },

    getRandomByWeight(arr) {
        let totalWeight = arr.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;
        for (let item of arr) {
            if (random < item.weight) return item;
            random -= item.weight;
        }
        return arr[0];
    },

    refreshOffer() {
        this.slots.GEAR = [];
        for (let i = 0; i < 5; i++) {
            const rare = this.getRandomByWeight(DB.rarity);
            const stat = DB.statTypes[Math.floor(Math.random() * DB.statTypes.length)];
            const isWep = Math.random() > 0.5;
            const nameBase = isWep ? DB.wepNames : DB.armNames;

            this.slots.GEAR.push({
                n: `${rare.n} ${nameBase[Math.floor(Math.random() * nameBase.length)]}`,
                statType: stat.id,
                statName: stat.n,
                v: Math.floor((10 + Game.p.lvl * 5) * rare.m),
                p: Math.floor((150 + Game.p.lvl * 60) * rare.p),
                c: rare.c
            });
        }

        this.slots.SPELLS = [];
        for (let i = 0; i < 3; i++) {
            const template = DB.spellTemplates[Math.floor(Math.random() * DB.spellTemplates.length)];
            const rare = this.getRandomByWeight(DB.spellRarity);

            this.slots.SPELLS.push({
                n: `${rare.n} ${template.n}`,
                scale: (template.baseScale + (Game.p.lvl * 0.1)) * rare.m,
                p: Math.floor((400 + Game.p.lvl * 120) * rare.m),
                c: rare.c,
                rarityName: rare.n
            });
        }

        this.slots.SKILL = [...DB.passives].sort(() => 0.5 - Math.random()).slice(0, 3);
    },

    draw(tab) {
        this.currentTab = tab;
        const grid = document.getElementById('shop-items');
        grid.innerHTML = '';

        this.slots[tab].forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = 'item-card';
            div.style.borderLeft = `4px solid ${item.c || '#bc00ff'}`;

            let desc = "";
            let btnText = `${item.p}C`;
            let action = `Shop.buy('${tab}', ${idx})`;

            if (tab === 'SPELLS') {
                desc = `MOC: x${item.scale.toFixed(1)}`;
                if (Game.p.currentSpell.n === item.n) { btnText = "AKTYWNY"; action = ""; }
            } else if (tab === 'SKILL') {
                desc = item.d;
                if (Game.p.passives.includes(item.id)) { btnText = "POSIADASZ"; action = ""; }
            } else {
                desc = `+${item.v} ${item.statName}`;
            }

            div.innerHTML = `
                <div style="flex: 1; text-align: left;">
                    <b style="color:${item.c || '#fff'}">${item.n}</b><br>
                    <small style="color: #888;">${desc}</small>
                </div>
                <button class="p-btn" onclick="${action}">${btnText}</button>
            `;
            grid.appendChild(div);
        });
    },

    buy(tab, idx) {
        const item = this.slots[tab][idx];
        if (Game.p.gold < item.p) return Game.log("BRAK KREDYTÓW!", "red");

        Game.p.gold -= item.p;

        if (tab === 'GEAR') {
            Game.p[item.statType] += item.v;
            Game.log(`ZAINSTALOWANO: ${item.n}`, "gold");
        } else if (tab === 'SKILL') {
            Game.p.passives.push(item.id);
            if (item.id === 'tank') Game.p.maxHp += 50;
            Game.log(`MODYFIKACJA: ${item.n}`, "#bc00ff");
        } else if (tab === 'SPELLS') {
            Game.p.currentSpell = item;
            Game.log(`NOWY SOFT: ${item.n}`, "#00f2ff");
        }

        Game.sync();
        this.draw(tab);
    }
};

const Cheats = {
    init() {
        const input = document.getElementById('cheat-input');
        if (!input) return;
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.run(input.value.toLowerCase().trim());
                input.value = '';
            }
        });
    },
    run(cmd) {
        if (cmd === 'gold') { Game.p.gold += 5000; Game.log("KOD: +5000C", "gold"); }
        if (cmd === 'lvl') { Game.levelUp(); }
        if (cmd === 'shop') { Shop.refreshOffer(); Game.log("SKLEP ODŚWIEŻONY", "#bc00ff"); }
        Game.sync();
    }
};