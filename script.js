 // Datos de los flayers con tus imágenes locales
        const flayers = [
            {
                id: 1,
                title: "Happy Express",
                image: "1.png",
                price: "$230,000"
            },
            {
                id: 2,
                title: "Happy Basic",
                image: "2.png",
                price: "$310,000"
            },
            {
                id: 3,
                title: "Happy Plus",
                image: "3.png",
                price: "$395,000"
            },
            {
                id: 4,
                title: "Happy Pro",
                image: "4.png",
                price: "$550,000"
            },
            {
                id: 5,
                title: "Happy Glam",
                image: "5.png",
                price: "$930,000"
            },
            {
                id: 6,
                title: "Happy Premium",
                image: "6.png",
                price: "$1,250,000"
            }
        ];
        
        // Variables globales
        const refreshIndicator = document.getElementById('refreshIndicator');
        const mainContent = document.getElementById('mainContent');
        const imageViewer = document.getElementById('imageViewer');
        const fullImage = document.getElementById('fullImage');
        const fullImageLoading = document.getElementById('fullImageLoading');
        const imageTitle = document.getElementById('imageTitle');
        const closeViewer = document.getElementById('closeViewer');
        const backgroundHearts = document.getElementById('backgroundHearts');
        let isRefreshing = false;
        
        // Inicializar después de cargar la página
        document.addEventListener('DOMContentLoaded', function() {
            // Crear decoraciones de fondo
            createBackgroundDecorations();
            
            // Configurar la transición rápida
            setTimeout(() => {
                document.getElementById('welcomeScreen').style.display = 'none';
                mainContent.style.display = 'block';
                mainContent.style.opacity = '1';
                
                // Generar los flayers
                generateFlayers();
                
                // Animar las tarjetas
                animateCardsOnScroll();
            }, 2200);
            
            // Configurar pull-to-refresh
            setupPullToRefresh();
            
            // Prevenir zoom
            preventZoom();
            
            // Configurar visor de imágenes
            setupImageViewer();
            
            // Precargar imágenes para mejor experiencia
            preloadImages();
        });
        
        // Precargar imágenes
        function preloadImages() {
            flayers.forEach(flayer => {
                const img = new Image();
                img.src = flayer.image;
            });
        }
        
        // Crear decoraciones de fondo (corazones y estrellas)
        function createBackgroundDecorations() {
            // Crear corazones
            for (let i = 0; i < 25; i++) {
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.innerHTML = '💖';
                heart.style.left = `${Math.random() * 100}%`;
                heart.style.animationDelay = `${Math.random() * 20}s`;
                backgroundHearts.appendChild(heart);
            }
            
            // Crear estrellas
            for (let i = 0; i < 20; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.innerHTML = '✨';
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                star.style.animationDelay = `${Math.random() * 15}s`;
                backgroundHearts.appendChild(star);
            }
        }
        
        // Generar los flayers dinámicamente
        function generateFlayers() {
            const container = document.getElementById('flayersContainer');
            container.innerHTML = '';
            
            flayers.forEach(flayer => {
                const flayerCard = document.createElement('div');
                flayerCard.className = 'flayer-card';
                flayerCard.setAttribute('data-id', flayer.id);
                flayerCard.innerHTML = `
                    <div class="flayer-image-container">
                        <div class="image-loading">Cargando...</div>
                        <img src="${flayer.image}" alt="${flayer.title}" class="flayer-image" loading="lazy" style="display: none;" onload="this.style.display='block'; this.previousElementSibling.style.display='none';">
                        <div class="flayer-overlay">
                            <button class="view-button">
                                <i class="fas fa-expand"></i> Ver Grande
                            </button>
                        </div>
                    </div>
                    <div class="flayer-price-container">
                        <div class="flayer-name">${flayer.title}</div>
                        <div class="price-tag">${flayer.price}</div>
                    </div>
                `;
                container.appendChild(flayerCard);
                
                // Agregar evento para abrir imagen en pantalla completa
                flayerCard.addEventListener('click', function(e) {
                    if (!e.target.classList.contains('view-button')) {
                        openImageViewer(flayer.image, flayer.title);
                    }
                });
                
                // Evento específico para el botón
                const viewButton = flayerCard.querySelector('.view-button');
                viewButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    openImageViewer(flayer.image, flayer.title);
                });
            });
        }
        
        // Configurar visor de imágenes
        function setupImageViewer() {
            closeViewer.addEventListener('click', closeImageViewer);
            
            imageViewer.addEventListener('click', function(e) {
                if (e.target === imageViewer) {
                    closeImageViewer();
                }
            });
            
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && imageViewer.classList.contains('active')) {
                    closeImageViewer();
                }
            });
            
            // Manejar carga de imagen en visor
            fullImage.onload = function() {
                fullImage.style.display = 'block';
                fullImageLoading.style.display = 'none';
            };
            
            fullImage.onerror = function() {
                fullImageLoading.textContent = 'Error al cargar la imagen';
                fullImageLoading.style.color = '#ff6b6b';
            };
        }
        
        // Abrir imagen en pantalla completa
        function openImageViewer(imageSrc, title) {
            // Mostrar mensaje de carga
            fullImage.style.display = 'none';
            fullImageLoading.style.display = 'block';
            fullImageLoading.textContent = 'Cargando imagen...';
            fullImageLoading.style.color = '#ffb6c1';
            
            // Cargar imagen
            fullImage.src = imageSrc;
            imageTitle.textContent = title;
            imageViewer.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        // Cerrar visor de imágenes
        function closeImageViewer() {
            imageViewer.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            setTimeout(() => {
                fullImage.src = '';
                imageTitle.textContent = '';
                fullImage.style.display = 'none';
                fullImageLoading.style.display = 'block';
            }, 300);
        }
        
        // Animación de entrada de tarjetas
        function animateCardsOnScroll() {
            const cards = document.querySelectorAll('.flayer-card');
            
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 100);
            });
        }
        
        // Configurar pull-to-refresh
        function setupPullToRefresh() {
            let touchStartY = 0;
            let isDragging = false;
            
            document.addEventListener('touchstart', function(e) {
                if (window.scrollY === 0 && !isRefreshing) {
                    touchStartY = e.touches[0].clientY;
                    isDragging = true;
                }
            }, { passive: true });
            
            document.addEventListener('touchmove', function(e) {
                if (isDragging && !isRefreshing) {
                    const touchCurrentY = e.touches[0].clientY;
                    const diff = touchCurrentY - touchStartY;
                    
                    if (diff > 0 && window.scrollY === 0) {
                        e.preventDefault();
                        updateRefreshIndicator(diff);
                    }
                }
            }, { passive: false });
            
            document.addEventListener('touchend', function(e) {
                if (isDragging && !isRefreshing) {
                    const touchCurrentY = e.changedTouches[0].clientY;
                    
                    if (touchCurrentY - touchStartY > 100) {
                        triggerRefresh();
                    } else {
                        resetRefresh();
                    }
                    
                    isDragging = false;
                }
            });
        }
        
        function updateRefreshIndicator(diff) {
            const maxDiff = 150;
            const progress = Math.min(diff, maxDiff) / maxDiff;
            
            refreshIndicator.style.top = `${-80 + (80 * progress)}px`;
            
            if (diff > 50) {
                refreshIndicator.classList.add('active');
            }
        }
        
        function triggerRefresh() {
            isRefreshing = true;
            
            // Simular actualización con un efecto lindo
            setTimeout(() => {
                // Mezclar los flayers
                shuffleFlayers();
                
                // Regenerar flayers
                generateFlayers();
                animateCardsOnScroll();
                
                // Efecto de confeti visual
                createConfettiEffect();
                
                // Ocultar indicador
                setTimeout(() => {
                    refreshIndicator.classList.remove('active');
                    isRefreshing = false;
                }, 500);
            }, 1200);
        }
        
        function resetRefresh() {
            refreshIndicator.classList.remove('active');
            refreshIndicator.style.top = '-80px';
        }
        
        // Mezclar array de flayers
        function shuffleFlayers() {
            for (let i = flayers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [flayers[i], flayers[j]] = [flayers[j], flayers[i]];
            }
        }
        
        // Crear efecto de confeti (visualmente lindo)
        function createConfettiEffect() {
            const confettiContainer = document.createElement('div');
            confettiContainer.style.position = 'fixed';
            confettiContainer.style.top = '0';
            confettiContainer.style.left = '0';
            confettiContainer.style.width = '100%';
            confettiContainer.style.height = '100%';
            confettiContainer.style.pointerEvents = 'none';
            confettiContainer.style.zIndex = '9999';
            
            const emojis = ['💖', '✨', '🌸', '🎀', '🎉', '🦄', '🌈', '🍬'];
            
            for (let i = 0; i < 30; i++) {
                const confetti = document.createElement('div');
                confetti.style.position = 'absolute';
                confetti.style.fontSize = `${Math.random() * 24 + 16}px`;
                confetti.style.left = `${Math.random() * 100}%`;
                confetti.style.top = '-50px';
                confetti.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
                
                confettiContainer.appendChild(confetti);
                
                // Animación de caída
                const animation = confetti.animate([
                    { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                    { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
                ], {
                    duration: Math.random() * 2000 + 1500,
                    easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
                });
                
                animation.onfinish = () => {
                    confetti.remove();
                };
            }
            
            document.body.appendChild(confettiContainer);
            
            setTimeout(() => {
                confettiContainer.remove();
            }, 3000);
        }
        
        // Prevenir zoom en dispositivos táctiles
        function preventZoom() {
            document.addEventListener('gesturestart', function(e) {
                e.preventDefault();
            });
            
            document.addEventListener('wheel', function(e) {
                if (e.ctrlKey) {
                    e.preventDefault();
                }
            }, { passive: false });
        }