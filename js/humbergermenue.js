
document.addEventListener('DOMContentLoaded', function() {
    createMobileMenu();
    
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu__close');
    const overlay = document.querySelector('.mobile-nav-overlay');
    const body = document.body;
    
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
            body.style.overflow = 'hidden';
        });
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMenu);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }
    
    function closeMenu() {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
    }
    
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu__nav a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    setupThemeToggle();
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.theme').forEach(icon => {
        icon.onclick = function() {
            document.body.classList.toggle('dark');
            
            document.querySelectorAll('.theme').forEach(i => {
                if (document.body.classList.contains('dark')) {
                    i.classList.remove('fa-moon');
                    i.classList.add('fa-sun');
                } else {
                    i.classList.remove('fa-sun');
                    i.classList.add('fa-moon');
                }
            });
        };
    });
});

function createMobileMenu() {
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    document.body.appendChild(overlay);
    
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    const navList = document.querySelector('.nav__list');
    const links = navList ? navList.cloneNode(true) : null;
    
    mobileMenu.innerHTML = `
        <div class="mobile-menu__header">
            <div class="mobile-menu__title">
                MENU <span style="font-size: 24px;">☰</span>
            </div>
            <button class="mobile-menu__close">×</button>
        </div>
        <ul class="mobile-menu__nav">
        </ul>
    `;
    
    if (links) {
        const mobileNav = mobileMenu.querySelector('.mobile-menu__nav');
        const originalLinks = links.querySelectorAll('li');
        
        originalLinks.forEach(li => {
            const link = li.querySelector('a');
            if (link && !link.querySelector('i.fa-moon') && !link.querySelector('i.fa-heart') && !link.querySelector('i.fa-cart-plus')) {
                const newLi = document.createElement('li');
                const newLink = document.createElement('a');
                newLink.href = link.href;
                newLink.textContent = link.textContent.trim();
                if (link.classList.contains('active')) {
                    newLink.classList.add('active');
                }
                newLi.appendChild(newLink);
                mobileNav.appendChild(newLi);
            }
        });
    }
    
    document.body.appendChild(mobileMenu);
    
    const nav = document.querySelector('nav');
    if (nav) {
        const mobileGroup = document.createElement('div');
        mobileGroup.className = 'nav__mobile-group';
        
        const iconBar = document.createElement('div');
        iconBar.className = 'mobile-icon-bar';
        
        const originalNav = document.querySelector('.nav__list');
        if (originalNav) {
            const themeIcon = originalNav.querySelector('.fa-moon');
            const heartIcon = originalNav.querySelector('.fa-heart');
            const cartIcon = originalNav.querySelector('.fa-cart-plus');
            
            if (themeIcon) {
                const themeClone = themeIcon.cloneNode(true);
                iconBar.appendChild(themeClone);
            }
            
            if (heartIcon) {
                const heartLink = heartIcon.parentElement.cloneNode(true);
                iconBar.appendChild(heartLink);
            }
            
            if (cartIcon) {
                const cartLink = cartIcon.parentElement.cloneNode(true);
                iconBar.appendChild(cartLink);
            }
        }
        
        const hamburgerMenu = document.createElement('div');
        hamburgerMenu.className = 'hamburger-menu';
        hamburgerMenu.innerHTML = `
            <button class="hamburger-btn">
                <div class="hamburger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                MENU
            </button>
        `;
        
        mobileGroup.appendChild(iconBar);
        mobileGroup.appendChild(hamburgerMenu);
        
        nav.appendChild(mobileGroup);
    }
}

