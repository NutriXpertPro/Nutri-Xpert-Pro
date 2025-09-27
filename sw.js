const CACHE_NAME = 'nutriexpert-v1.0.0';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// URLs críticas para cache
const STATIC_ASSETS = [
  '/',
  '/login',
  '/dashboard', 
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Estratégias de cache por padrão de URL
const CACHE_STRATEGIES = {
  // Network First - APIs e dados dinâmicos
  networkFirst: ['/api/', '/dashboard/data'],
  
  // Cache First - Assets estáticos
  cacheFirst: ['/icons/', '/_next/static/', '/assets/', '.png', '.jpg', '.svg', '.css', '.js'],
  
  // Stale While Revalidate - Páginas
  staleWhileRevalidate: ['/dashboard', '/anamnesis', '/login']
};

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DYNAMIC_CACHE) // Preparar cache dinâmico
    ]).then(() => {
      console.log('[SW] Installation complete');
      return self.skipWaiting();
    })
  );
});

// Ativação - Limpar caches antigos  
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Activation complete');
      return self.clients.claim();
    })
  );
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar requisições não-HTTP
  if (!url.protocol.startsWith('http')) return;
  
  // Determinar estratégia baseada na URL
  const strategy = getStrategy(url.pathname);
  
  switch (strategy) {
    case 'networkFirst':
      event.respondWith(handleNetworkFirst(request));
      break;
    case 'cacheFirst':
      event.respondWith(handleCacheFirst(request));
      break;
    case 'staleWhileRevalidate':
      event.respondWith(handleStaleWhileRevalidate(request));
      break;
    default:
      event.respondWith(handleNetworkFirst(request));
  }
});

// Network First Strategy
async function handleNetworkFirst(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback para página offline
    if (request.destination === 'document') {
      return caches.match('/offline');
    }
    
    throw error;
  }
}

// Cache First Strategy  
async function handleCacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Cache and network failed:', error);
    throw error;
  }
}

// Stale While Revalidate Strategy
async function handleStaleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const networkPromise = fetch(request).then(response => {
    if (response.ok) {
      const cache = caches.open(DYNAMIC_CACHE);
      cache.then(c => c.put(request, response.clone()));
    }
    return response;
  }).catch(error => {
    console.log('[SW] Network update failed:', error);
    return cachedResponse;
  });
  
  return cachedResponse || networkPromise;
}

// Determinar estratégia baseada na URL
function getStrategy(pathname) {
  for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
    if (patterns.some(pattern => pathname.includes(pattern))) {
      return strategy;
    }
  }
  return 'networkFirst';
}

// Background Sync para dados offline
self.addEventListener('sync', event => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-patient-data') {
    event.waitUntil(syncPatientData());
  }
  
  if (event.tag === 'sync-anamnesis') {
    event.waitUntil(syncAnamnesis());
  }
});

// Sincronização de dados de pacientes
async function syncPatientData() {
  try {
    // Recuperar dados pendentes do IndexedDB
    const pendingData = await getPendingPatientData();
    
    for (const data of pendingData) {
      await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    
    await clearPendingPatientData();
    console.log('[SW] Patient data synced successfully');
  } catch (error) {
    console.error('[SW] Failed to sync patient data:', error);
  }
}

// Sincronização de anamnese
async function syncAnamnesis() {
  try {
    const pendingData = await getPendingAnamnesis();
    
    for (const data of pendingData) {
      await fetch('/api/anamnesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    
    await clearPendingAnamnesis();
    console.log('[SW] Anamnesis synced successfully');
  } catch (error) {
    console.error('[SW] Failed to sync anamnesis:', error);
  }
}

// Helpers para IndexedDB (implementar conforme necessário)
async function getPendingPatientData() { /* TODO */ return []; }
async function clearPendingPatientData() { /* TODO */ }
async function getPendingAnamnesis() { /* TODO */ return []; }
async function clearPendingAnamnesis() { /* TODO */ }

// Push Notifications (futuro)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'Ver Detalhes',
          icon: '/icons/checkmark.png'
        },
        {
          action: 'close',
          title: 'Fechar',
          icon: '/icons/xmark.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

console.log('[SW] Service Worker registered successfully');