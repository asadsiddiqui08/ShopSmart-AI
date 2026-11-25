/**
 * Cloudinary service for image handling
 * Can be configured with CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */

export const uploadImage = async (imageBufferOrUrl) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    try {
      // In production with Cloudinary credentials, upload here
      // For now return formatted response
      return {
        url: typeof imageBufferOrUrl === 'string' ? imageBufferOrUrl : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
        public_id: `shopsmart_${Date.now()}`
      };
    } catch (err) {
      console.error('Cloudinary upload error:', err.message);
      throw err;
    }
  }

  // Fallback: return existing URL
  return {
    url: typeof imageBufferOrUrl === 'string' ? imageBufferOrUrl : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    public_id: `shopsmart_mock_${Date.now()}`
  };
};
