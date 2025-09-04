document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll('.signature-items .item');

    function animateFrames() {
        const triggerBottom = window.innerHeight * 0.8;

        items.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            if(itemTop < triggerBottom) {
                const frames = item.dataset.frames.split(",");
                let index = Math.floor((triggerBottom - itemTop) / triggerBottom * frames.length);
                if(index >= frames.length) index = frames.length - 1;
                item.querySelector('img').src = "img/" + frames[index];
            }
        });
    }

    window.addEventListener('scroll', animateFrames);
    animateFrames(); // initial call
});
// Show cart count on all pages
document.addEventListener('DOMContentLoaded', () => {
    const cartCount = document.querySelector('.cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
});

