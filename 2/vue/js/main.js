const STORAGE_KEY = "notesAppVue";

const app = new Vue({
  el: '#app',
  data: {
    columns: [
      { id: 1, name: "Столбец 1", limit: 3, cards: [] },
      { id: 2, name: "Столбец 2", limit: 5, cards: [] },
      { id: 3, name: "Столбец 3", limit: Infinity, cards: [] },
    ],
    newTitle: "",
    newItems: "",
    blockColumn1: false,
  },
  mounted() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) Object.assign(this.$data, JSON.parse(saved));
  },
  methods: {
    save() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          columns: this.columns,
          newTitle: this.newTitle,
          newItems: this.newItems,
          blockColumn1: this.blockColumn1,
        })
      );
    },
    addCard() {

      if (this.blockColumn1) {
        console.error("Столбец 1 заблокирован");
        return;
      }
      const col = this.columns[0];
      if (col.cards.length >= col.limit) {
        console.error("Столбец 1 переполнен");
        return;
      }
      if (!this.newTitle.trim()) {
        console.error("Введите заголовок");
        return;
      }
      const parts = this.newItems.split(",").map((p) => p.trim()).filter(Boolean);
      if (parts.length < 3 || parts.length > 5) {
        console.error("Список должен содержать 3–5 пунктов");
        return;
      }
      const card = {
        id: Date.now() + "-" + Math.random(),
        title: this.newTitle,
        items: parts.map((t, i) => ({ id: i, text: t, done: false })),
        columnId: 1,
        completedAt: null,
      };
      col.cards.push(card);
      this.newTitle = this.newItems = "";
      this.save();
    },
    toggleItem(card, item) {
      if (card.columnId === 1 && this.blockColumn1) return;
      item.done = !item.done;
      this.checkCard(card);
      this.save();
    },
    checkCard(card) {
      const total = card.items.length;
      const done = card.items.filter((i) => i.done).length;
      const rate = done / total;
      
      if (rate === 1 && card.columnId !== 3) {
        this.moveCard(card, 3);
        card.completedAt = new Date().toLocaleString();

        this.blockColumn1 = false; 
      } else if (rate > 0.5 && card.columnId === 1) {
        const col2 = this.columns[1];
        if (col2.cards.length >= col2.limit) {
          this.blockColumn1 = true;
        } else {
          this.moveCard(card, 2);
        }
      }
    },
    moveCard(card, targetId) {
      const src = this.columns.find((c) => c.id === card.columnId);
      const dst = this.columns.find((c) => c.id === targetId);
      if (!dst) return;

      const cardIndex = src.cards.findIndex(c => c.id === card.id);
      if (cardIndex > -1) {
        src.cards.splice(cardIndex, 1);
      }
      
      card.columnId = targetId;
      dst.cards.push(card);
    },
    reset() {
      if (window.confirm("Очистить всё?")) {
        this.columns.forEach((c) => (c.cards = []));
        this.blockColumn1 = false;
        this.save();
      }
    },
  },
  computed: {
    allCards() {
      return this.columns.flatMap((c) => c.cards);
    },
  },
});
