const cocktails = {
  'black-manhattan': {
    name: 'Black Manhattan',
    image: 'assets/black-manhattan.png',
    desc: 'A brooding interpretation of the classic Manhattan — deeper, darker, more complex. Built for those who prefer their evenings bold.',
    ingredients: ['Rye Whiskey — 50ml','Averna Amaro — 25ml','Angostura Bitters — 2 dashes','Orange Bitters — 1 dash','Luxardo Cherry — to garnish'],
    tasting: 'Rich and layered. Dark cherry upfront, followed by bitter chocolate, dried herb, and a long warming finish. The single ice cube slows the melt and keeps the drink cold without diluting the story.',
    pairing: 'Dark chocolate with sea salt. Aged hard cheese. A quiet room and a good book.',
  },
  'golden-mirage': {
    name: 'Golden Mirage',
    image: 'assets/golden-mirage.png',
    desc: 'The colour of a savannah at dusk. Warm and luminous — a cocktail that appears simple and reveals itself slowly.',
    ingredients: ['Aged Cognac — 40ml','Saffron-infused Honey Syrup — 20ml','Dry Vermouth — 15ml','Orange Peel — expressed and garnished','Dried Wildflowers — to garnish'],
    tasting: 'Delicate and golden. Floral saffron gives way to warm cognac oak, with a citrus brightness that cuts through the sweetness. Lingers like a mirage — present one moment, gone the next.',
    pairing: 'Foie gras on brioche. Stone fruit tart. Soft candlelight.',
  },
  'emerald-canopy': {
    name: 'Emerald Canopy',
    image: 'assets/emerald-canopy.png',
    desc: 'Vivid, alive, and breathing. The colour of deep jungle canopy after rain — botanical and bracingly fresh.',
    ingredients: ['Hendricks Gin — 45ml','Fresh Cucumber Juice — 30ml','Basil Leaves — muddled','Lime Juice — 20ml','Elderflower Liqueur — 15ml','Cucumber Ribbon & Basil — to garnish'],
    tasting: 'Cool and herbaceous with a bright citrus spine. The gin botanicals weave through basil and cucumber in perfect balance. A cocktail that feels like it was grown, not mixed.',
    pairing: "Smoked salmon blinis. Light goat's cheese. An early evening on a terrace.",
  },
  'midnight-ember': {
    name: 'Midnight Ember',
    image: 'assets/midnight-ember.png',
    desc: 'The last fire before the bush goes dark. Smoky, spiced, built for the hours after midnight.',
    ingredients: ['Mezcal — 40ml','Spiced Rum — 15ml','Cold Brew Coffee — 25ml','Cinnamon Syrup — 15ml','Cinnamon Stick — smoked, to garnish','Charred Orange Wheel — to garnish'],
    tasting: "Opens with smoke and fire. Cinnamon and coffee deepen the mezcal's char. A sweet, slow-burning finish that warms from the inside. This is a drink you sit with — not a drink you rush.",
    pairing: 'Spiced dark chocolate. Slow-cooked short rib. A fire and open sky.',
  },
  'safari-noir': {
    name: 'Safari Noir',
    image: 'assets/safari-noir.png',
    desc: 'Espresso Martini, re-imagined in the wild. Velvety, intense, and crowned with a chocolate palm frond.',
    ingredients: ['Vodka — 40ml','Kahlúa — 20ml','Fresh Espresso — 30ml','Dark Chocolate Bitters — 2 dashes','Three Coffee Beans — to garnish','Chocolate Palm Frond — to garnish'],
    tasting: 'Intense and silky. The espresso crema holds the foam beautifully. Bitter coffee and sweet Kahlúa in perfect tension. Best served ice cold, drunk slowly.',
    pairing: 'Chocolate fondant. Salted caramel. The moment the music changes.',
  },
  'velvet-panther': {
    name: 'Velvet Panther',
    image: 'assets/velvet-panther.png',
    desc: 'Dark, wild, and impossible to ignore. Blackberry and black pepper on a base of smooth bourbon — this is the panther before it moves.',
    ingredients: ['Bourbon — 45ml','Crème de Mûre — 20ml','Fresh Blackberries — muddled','Lemon Juice — 15ml','Black Pepper Tincture — 3 drops','Fresh Blackberries & Lemon Peel — to garnish'],
    tasting: 'Deep purple with a wild edge. Blackberry and bourbon entwine with a slow pepper heat that builds. The lemon keeps it from being heavy. A cocktail that demands your attention.',
    pairing: 'Venison tartare. Sharp blue cheese. The last dance of the evening.',
  },
};

function openModal(id) {
  const c = cocktails[id];
  if (!c) return;
  document.getElementById('modal-img').src = c.image;
  document.getElementById('modal-img').alt = c.name;
  document.getElementById('modal-name').textContent = c.name;
  document.getElementById('modal-desc').textContent = c.desc;
  document.getElementById('modal-tasting').textContent = c.tasting;
  document.getElementById('modal-pairing').textContent = c.pairing;
  document.getElementById('modal-ingredients').innerHTML = c.ingredients.map(i => `<li>${i}</li>`).join('');
  document.getElementById('modal-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
