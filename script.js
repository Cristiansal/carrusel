// Configuración de carruseles
const carouselsConfig = [
    { id: 'productCarousel', autoPlay: true, currentSlide: 0 },
    { id: 'benefitsCarousel', autoPlay: true, currentSlide: 0 },
    { id: 'processCarousel', autoPlay: true, currentSlide: 0 }
];

// Función principal para inicializar y actualizar un carrusel
function initCarousel(config) {
    const carousel = document.getElementById(config.id);
    if (!carousel) return; 

    const slides = carousel.querySelectorAll('.product-card');
    const totalSlides = slides.length;
    const indicatorsContainer = document.getElementById(config.id.replace('Carousel', 'Indicators'));

    // 1. Crear Indicadores
    if (indicatorsContainer) {
        indicatorsContainer.innerHTML = ''; 
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(config.id, i));
            indicatorsContainer.appendChild(indicator);
        }
    }

    // 2. Control de Auto-Play
    if (config.autoPlay) {
        // Limpia cualquier intervalo previo
        if (config.autoplayInterval) clearInterval(config.autoplayInterval);

        config.autoplayInterval = setInterval(() => {
            moveCarousel(config.id, 1);
        }, 5000);

        const container = carousel.closest('.carousel-container');
        if (container) {
            // Pausa al pasar el ratón
            container.addEventListener('mouseenter', () => clearInterval(config.autoplayInterval));
            // Reanuda al salir el ratón
            container.addEventListener('mouseleave', () => {
                config.autoplayInterval = setInterval(() => {
                    moveCarousel(config.id, 1);
                }, 5000);
            });
        }
    }

    // 3. Soporte Táctil (Swipe)
    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    carousel.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) moveCarousel(config.id, 1);
        if (touchEndX > touchStartX + 50) moveCarousel(config.id, -1);
    });
    
    // 4. Actualizar al estado inicial
    updateCarousel(config.id);
}

function updateCarousel(carouselId) {
    const config = carouselsConfig.find(c => c.id === carouselId);
    if (!config) return;

    const carousel = document.getElementById(carouselId);
    const slides = carousel.querySelectorAll('.product-card');
    const totalSlides = slides.length;

    const offset = -config.currentSlide * 100;
    carousel.style.transform = `translateX(${offset}%)`;
    
    const indicatorsContainer = document.getElementById(carouselId.replace('Carousel', 'Indicators'));
    if (indicatorsContainer) {
        const indicators = indicatorsContainer.querySelectorAll('.indicator');
        indicators.forEach((ind, index) => {
            ind.classList.toggle('active', index === config.currentSlide);
        });
    }
    
    preloadAdjacentImages(slides, config.currentSlide, totalSlides);
}

// Mover carrusel con botones
function moveCarousel(carouselId, direction) {
    const config = carouselsConfig.find(c => c.id === carouselId);
    if (!config) return;

    const totalSlides = document.getElementById(carouselId).querySelectorAll('.product-card').length;
    
    config.currentSlide += direction;
    
    if (config.currentSlide < 0) {
        config.currentSlide = totalSlides - 1;
    } else if (config.currentSlide >= totalSlides) {
        config.currentSlide = 0;
    }
    
    updateCarousel(carouselId);
}

// Saltar a un slide específico
function goToSlide(carouselId, index) {
    const config = carouselsConfig.find(c => c.id === carouselId);
    if (!config) return;
    config.currentSlide = index;
    updateCarousel(carouselId);
}

// Cargar imágenes adyacentes para mejorar UX
function preloadAdjacentImages(slides, currentSlide, totalSlides) {
    const nextSlide = (currentSlide + 1) % totalSlides;
    const prevSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    
    // Obtiene la imagen dentro de la tarjeta
    const nextImg = slides[nextSlide].querySelector('img');
    const prevImg = slides[prevSlide].querySelector('img');
    
    // Establece 'loading' a 'eager' para forzar la carga
    if (nextImg) nextImg.loading = 'eager';
    if (prevImg) prevImg.loading = 'eager';
}


// Inicializar todos los carruseles al cargar la página
window.addEventListener('load', () => {
    carouselsConfig.forEach(config => initCarousel(config));
});

// --- Lógica del Menú Hamburguesa y Scroll ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const body = document.body;
const header = document.querySelector('header');


// Toggle del menú hamburguesa
hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    // Previene el scroll del body cuando el menú está abierto en móvil
    body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
});

// Cerrar menú al hacer clic en un enlace
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function () {
        // Se añade un pequeño retraso para permitir que el smooth scroll inicie antes de que el menú se cierre visualmente
        setTimeout(() => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = 'auto';
        }, 300); 
    });
});

// Smooth scrolling (lógica movida aquí)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Header scroll effect (lógica movida aquí)
window.addEventListener('scroll', () => {
    header.style.boxShadow = window.pageYOffset > 0 ? '0 4px 20px rgba(0,0,0,0.2)' : '0 2px 10px rgba(0,0,0,0.1)';
});

// Form submission alert (simulación)
document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
    e.target.reset();
});