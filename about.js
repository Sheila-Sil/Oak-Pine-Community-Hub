function Counter(selector, settings) {
    this.settings = Object.assign({
        digits: 7,
        delay: 200,
        direction: 'rtl'
    }, settings || {});

    this.DOM = {};
    this.build(selector);

    this.DOM.scope.addEventListener('transitionend', e => {
        if (e.propertyName == 'margin-top') {
            e.target.classList.remove('blur');
        }
    });

    this.count();
}

Counter.prototype = {
    build(selector) {
        var scopeElm = typeof selector == 'string' ? document.querySelector(selector) : selector;
        scopeElm.innerHTML = Array(this.settings.digits + 1).join('<div><b data-value="0"></b></div>');
        this.DOM = {
            scope: scopeElm,
            digits: scopeElm.querySelectorAll('b')
        };
    },
    count(newVal) {
        var countTo, settings = this.settings, digitsElms = this.DOM.digits;
        this.value = newVal || this.DOM.scope.dataset.value | 0;
        if (!this.value) return;

        countTo = (this.value + '').padStart(settings.digits, '0').split('');

        if (settings.direction == 'rtl') {
            countTo = countTo.reverse();
            digitsElms = [].slice.call(digitsElms).reverse();
        }

        digitsElms.forEach(function(item, i) {
            if (+item.dataset.value != countTo[i] && countTo[i] >= 0)
                setTimeout(function() {
                    var diff = Math.abs(countTo[i] - +item.dataset.value);
                    item.dataset.value = countTo[i];
                    if (diff > 3) item.className = 'blur';
                }, i * settings.delay);
        });
    }
};

// Initialize
const impactCounter = new Counter('.numCounter', { digits: 7 });

// Demo: Update with a new number every 4 seconds
setInterval(() => {
    const randomImpact = Math.floor(1000000 + Math.random() * 9000000);
    impactCounter.count(randomImpact);
}, 4000);
