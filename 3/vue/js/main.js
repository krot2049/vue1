const STORAGE_KEY = 'notesAppVue2';

new Vue({
  el: '#app',
  data: {
    columns: [
      { id: 1, name: 'Столбец 1', limit: 3, cards: [] },
      { id: 2, name: 'Столбец 2', limit: 5, cards: [] },
      { id: 3, name: 'Столбец 3', limit: Infinity, cards: [] }
    ],
    newTitle: '',
    newItems: '',
    blockColumn1: false
  },
  created() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const s = JSON.parse(raw);
        if (s.columns) this.columns = s.columns;
        this.blockColumn1 = !!s.blockColumn1;
      } catch (e) {}
    }
  },
  methods: {
    save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        columns: this.columns,
        blockColumn1: this.blockColumn1
      }));
    },
    genId(prefix = 'id') {
      return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2,5)}`;
    },
    addCard() {
      if (this.blockColumn1) {
        alert('Столбец 1 заблокирован');
        return;
      }
      const col1 = this.columns[0];
      if (col1.cards.length >= col1.limit) {
        alert('Столбец 1 переполнен');
        return;
      }
      const title = this.newTitle.trim();
      if (!title) {
        alert('Введите заголовок');
        return;
      }
      const parts = this.newItems.split(/,|\n/).map(s => s.trim()).filter(Boolean);
      if (parts.length < 3 || parts.length > 5) {
        alert('Нужно 3–5 пунктов');
        return;
      }
      const card = {
        id: this.genId('card'),
        title,
        items: parts.map(t => ({ id: this.genId('item'), text: t, done: false })),
        columnId: 1,
        completedAt: null
      };
      col1.cards.push(card);
      this.newTitle = '';
      this.newItems = '';
      this.save();
    },
    toggleItem(card, item) {
      if (card.columnId === 1 && this.blockColumn1) {
        item.done = !item.done;
        return;
      }
      this.$nextTick(() => {
        const total = card.items.length;
        const done = card.items.filter(i => i.done).length;

        if (done === total) {
          this.moveCard(card, 3);
          card.completedAt = new Date().toLocaleString();
          this.blockColumn1 = false;
        } else if (done * 2 > total) {
          if (card.columnId === 1) {
            const col2 = this.columns.find(c => c.id === 2);
            if (col2.cards.length >= col2.limit) {
              this.blockColumn1 = true;
            } else {
              this.moveCard(card, 2);
            }
          }
        }
        this.save();
      });
    },
    moveCard(card, targetId) {
      const src = this.columns.find(c => c.id === card.columnId);
      const dst = this.columns.find(c => c.id === targetId);
      if (!dst) return;
      if (dst.cards.length >= dst.limit) return;
      const idx = src.cards.findIndex(c => c.id === card.id);
      if (idx !== -1) src.cards.splice(idx, 1);
      card.columnId = targetId;
      dst.cards.push(card);
    },
    reset() {
      if (!confirm('Очистить всё?')) return;
      this.columns.forEach(c => c.cards = []);
      this.blockColumn1 = false;
      this.save();
    }
  }
});