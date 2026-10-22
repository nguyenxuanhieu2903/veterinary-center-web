/**
 * IndexedDB storage and display helpers for uploaded pet photos.
 */

const PET_IMAGE_REFERENCE_PREFIX = 'petcare-image:';
const PET_IMAGE_DATABASE = 'petcareclinic-images';
const PET_IMAGE_STORE = 'petImages';
const petImageUrlCache = new Map();

function releaseCachedPetImage(imageId) {
  const objectUrl = petImageUrlCache.get(imageId);
  if (!objectUrl) return;
  URL.revokeObjectURL(objectUrl);
  petImageUrlCache.delete(imageId);
}

function openPetImageDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(PET_IMAGE_DATABASE, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(PET_IMAGE_STORE, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Không thể mở kho ảnh thú cưng.'));
  });
}

async function getStoredPetImage(imageId) {
  const database = await openPetImageDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(PET_IMAGE_STORE, 'readonly');
    const request = transaction.objectStore(PET_IMAGE_STORE).get(imageId);
    request.onsuccess = () => resolve(request.result?.blob || null);
    request.onerror = () => reject(request.error || new Error('Không thể đọc ảnh thú cưng.'));
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error('Không thể đọc ảnh thú cưng.'));
    };
  });
}

async function writeStoredPetImage(imageId, blob) {
  const database = await openPetImageDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(PET_IMAGE_STORE, 'readwrite');
    transaction.objectStore(PET_IMAGE_STORE).put({ id: imageId, blob });
    transaction.oncomplete = () => {
      database.close();
      releaseCachedPetImage(imageId);
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error('Không thể lưu ảnh thú cưng.'));
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error || new Error('Không thể lưu ảnh thú cưng.'));
    };
  });
}

async function deleteStoredPetImage(imageId) {
  const database = await openPetImageDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(PET_IMAGE_STORE, 'readwrite');
    transaction.objectStore(PET_IMAGE_STORE).delete(imageId);
    transaction.oncomplete = () => {
      database.close();
      releaseCachedPetImage(imageId);
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error('Không thể xóa ảnh thú cưng.'));
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error || new Error('Không thể xóa ảnh thú cưng.'));
    };
  });
}

async function resolvePetImage(imageReference, fallback = '') {
  if (!imageReference?.startsWith(PET_IMAGE_REFERENCE_PREFIX)) return imageReference || fallback;

  const imageId = imageReference.slice(PET_IMAGE_REFERENCE_PREFIX.length);
  if (petImageUrlCache.has(imageId)) return petImageUrlCache.get(imageId);

  const blob = await getStoredPetImage(imageId);
  if (!blob) return fallback;

  const objectUrl = URL.createObjectURL(blob);
  petImageUrlCache.set(imageId, objectUrl);
  return objectUrl;
}

async function setPetImageSource(imageElement, imageReference, fallback = '') {
  try {
    const source = await resolvePetImage(imageReference, fallback);
    if (imageElement.isConnected) imageElement.src = source;
  } catch (error) {
    console.error('Không thể tải ảnh thú cưng:', error);
    if (imageElement.isConnected) imageElement.src = fallback;
  }
}

window.addEventListener('pagehide', () => {
  petImageUrlCache.forEach(objectUrl => URL.revokeObjectURL(objectUrl));
  petImageUrlCache.clear();
});
