import { GoogleGenAI } from '@google/genai';

let aiClient = null;

const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

/**
 * Intelligent shopping chatbot assistant
 */
export const chatShoppingAssistant = async ({ message, history = [], catalog = [] }) => {
  const ai = getAIClient();

  // Create catalog context summary
  const catalogContext = catalog.slice(0, 15).map(p => ({
    id: p._id,
    name: p.name,
    category: p.categoryName || p.category?.name || 'Electronics',
    price: p.discountPrice || p.price,
    rating: p.rating,
    tags: p.tags,
    features: p.specs?.map(s => `${s.name}: ${s.value}`).join(', ')
  }));

  if (ai) {
    try {
      const prompt = `You are ShopSmart AI, an expert, enthusiastic, and helpful personal shopping assistant for ShopSmart AI e-commerce store.
Here is a list of our currently available top products in the catalog:
${JSON.stringify(catalogContext, null, 2)}

User conversation history:
${history.map(h => `${h.role === 'user' ? 'Customer' : 'Assistant'}: ${h.text}`).join('\n')}

Customer's current message: "${message}"

Instructions:
1. Provide a friendly, concise, and helpful response.
2. If the customer asks for recommendations, recommend the best matching products from our catalog with prices and key benefits.
3. If they ask about specs, shipping (Free shipping on orders over $50, 3-5 business days), returns (30-day money-back guarantee), or support, answer clearly.
4. If relevant, mention the exact product IDs that match their query in a separate JSON block at the very end formatted as:
[RECOMMENDED_IDS: id1, id2]

Keep your tone professional, stylish, and customer-focused.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const responseText = response.text || '';
      
      // Parse suggested product IDs if present
      let suggestedProductIds = [];
      const match = responseText.match(/\[RECOMMENDED_IDS:\s*([^\]]+)\]/i);
      let cleanText = responseText;
      if (match) {
        cleanText = responseText.replace(match[0], '').trim();
        suggestedProductIds = match[1].split(',').map(s => s.trim()).filter(Boolean);
      }

      // Filter matched products from catalog
      const matchedProducts = catalog.filter(p => 
        suggestedProductIds.includes(String(p._id)) ||
        p.name.toLowerCase().includes(message.toLowerCase()) ||
        (message.toLowerCase().includes('laptop') && p.categoryName?.toLowerCase().includes('laptop')) ||
        (message.toLowerCase().includes('audio') && p.categoryName?.toLowerCase().includes('audio')) ||
        (message.toLowerCase().includes('headphone') && p.name.toLowerCase().includes('headphone'))
      ).slice(0, 3);

      return {
        reply: cleanText,
        suggestions: matchedProducts
      };
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart heuristic shopping assistant:', err.message);
    }
  }

  // Smart Heuristic Fallback Engine
  const lowerMsg = message.toLowerCase();
  let reply = '';
  let matchedProducts = [];

  if (lowerMsg.includes('return') || lowerMsg.includes('refund')) {
    reply = "We offer a hassle-free **30-day money-back guarantee**! If you're not completely satisfied with your purchase, you can initiate a return from your Orders page or contact our 24/7 support.";
  } else if (lowerMsg.includes('shipping') || lowerMsg.includes('delivery')) {
    reply = "We provide **Free Standard Shipping** on all orders over $50! Standard delivery takes 3 to 5 business days, and Express Next-Day Delivery is also available at checkout.";
  } else if (lowerMsg.includes('discount') || lowerMsg.includes('coupon') || lowerMsg.includes('deal') || lowerMsg.includes('sale')) {
    reply = "You're in luck! Check out our Featured Deals on the homepage where you can find up to **30% off** on select audio gear, smartphones, and smart home tech. Use code **SMART20** at checkout for an extra 20% off your first purchase!";
    matchedProducts = catalog.filter(p => p.discountPrice || p.isFeatured).slice(0, 3);
  } else if (lowerMsg.includes('headphone') || lowerMsg.includes('audio') || lowerMsg.includes('earbud') || lowerMsg.includes('sound')) {
    reply = "Here are top-tier audio picks from our collection with active noise cancellation and crystal-clear acoustic fidelity:";
    matchedProducts = catalog.filter(p => 
      p.categoryName?.toLowerCase().includes('audio') || 
      p.name.toLowerCase().includes('headphone') || 
      p.name.toLowerCase().includes('pro')
    ).slice(0, 3);
  } else if (lowerMsg.includes('laptop') || lowerMsg.includes('computer') || lowerMsg.includes('work') || lowerMsg.includes('macbook')) {
    reply = "Looking for computing power? Here are our best performing laptops engineered for productivity, design, and high efficiency:";
    matchedProducts = catalog.filter(p => 
      p.categoryName?.toLowerCase().includes('laptop') || 
      p.categoryName?.toLowerCase().includes('computer') ||
      p.tags?.includes('productivity')
    ).slice(0, 3);
  } else if (lowerMsg.includes('watch') || lowerMsg.includes('wearable') || lowerMsg.includes('fitness')) {
    reply = "Track your fitness, heart rate, and productivity seamlessly with our top-rated smart wearables:";
    matchedProducts = catalog.filter(p => 
      p.categoryName?.toLowerCase().includes('wearable') || 
      p.name.toLowerCase().includes('watch')
    ).slice(0, 3);
  } else if (lowerMsg.includes('recommend') || lowerMsg.includes('best') || lowerMsg.includes('popular') || lowerMsg.includes('trending')) {
    reply = "Here are our customer favorites and trending products currently topping our charts:";
    matchedProducts = catalog.filter(p => p.isFeatured || p.isTrending || p.rating >= 4.7).slice(0, 3);
  } else {
    // General search or greeting
    matchedProducts = catalog.filter(p => 
      p.name.toLowerCase().includes(lowerMsg) || 
      p.tags?.some(t => lowerMsg.includes(t.toLowerCase()))
    ).slice(0, 3);

    if (matchedProducts.length > 0) {
      reply = `I found these products that match what you're looking for:`;
    } else {
      reply = `Hello! I'm your AI Shopping Assistant at ShopSmart AI. I can help you find products, compare specifications, answer questions about shipping and returns, or recommend the best deals. What kind of product are you looking for today?`;
      matchedProducts = catalog.slice(0, 2);
    }
  }

  return {
    reply,
    suggestions: matchedProducts
  };
};

/**
 * AI Review Sentiment Analyzer
 */
export const analyzeReviewSentiment = async ({ reviewText, rating, productName }) => {
  const ai = getAIClient();

  if (ai) {
    try {
      const prompt = `Analyze the sentiment and extract key insights from this customer product review for "${productName}".
Review rating given: ${rating}/5
Review text: "${reviewText}"

Respond ONLY with valid JSON matching this schema:
{
  "sentiment": "Positive" | "Neutral" | "Negative",
  "score": number between 0.0 and 1.0,
  "summary": "One sentence summary of sentiment",
  "pros": ["string"],
  "cons": ["string"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const cleaned = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn('Gemini sentiment analysis failed, using fallback:', err.message);
    }
  }

  // Fallback heuristic sentiment analysis
  const score = rating >= 4 ? 0.9 : rating === 3 ? 0.5 : 0.2;
  const label = rating >= 4 ? 'Positive' : rating === 3 ? 'Neutral' : 'Negative';

  return {
    sentiment: label,
    score,
    summary: `Customer expressed a generally ${label.toLowerCase()} opinion with a ${rating}/5 rating.`,
    pros: rating >= 4 ? ['High build quality', 'Reliable performance', 'Great design'] : ['Decent feature set'],
    cons: rating <= 3 ? ['Expected better value or durability', 'Room for software/hardware improvement'] : []
  };
};

/**
 * AI Product Comparison Engine
 */
export const compareProductsAI = async ({ products }) => {
  const ai = getAIClient();

  const formattedProducts = products.map(p => ({
    name: p.name,
    price: p.discountPrice || p.price,
    rating: p.rating,
    brand: p.brand,
    category: p.categoryName || p.category?.name,
    specs: p.specs
  }));

  if (ai) {
    try {
      const prompt = `You are an expert product reviewer. Compare the following products side by side:
${JSON.stringify(formattedProducts, null, 2)}

Provide an objective comparison in valid JSON format ONLY:
{
  "verdict": "Comprehensive paragraph deciding the winner or best use-case for each",
  "bestValue": "Name of the product offering the highest value for price",
  "premiumPick": "Name of the highest-end product",
  "featuresComparison": [
    { "feature": "string", "scores": { "productName": "string value or score" } }
  ],
  "prosAndCons": [
    { "productName": "string", "pros": ["string"], "cons": ["string"] }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const cleaned = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn('Gemini comparison failed, using heuristic comparison:', err.message);
    }
  }

  // Fallback Comparison Engine
  const sortedByPrice = [...products].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  const bestValue = sortedByPrice[0]?.name || products[0]?.name;
  const premiumPick = sortedByPrice[sortedByPrice.length - 1]?.name || products[0]?.name;

  return {
    verdict: `Both products present impressive capabilities. If budget efficiency is your primary driver, ${bestValue} delivers exceptional value. For uncompromised premium experience and top-tier build materials, ${premiumPick} stands out.`,
    bestValue,
    premiumPick,
    featuresComparison: [
      {
        feature: 'Price-to-Performance',
        scores: Object.fromEntries(products.map(p => [p.name, (p.discountPrice || p.price) < 200 ? '9.5/10' : '8.8/10']))
      },
      {
        feature: 'Customer Satisfaction',
        scores: Object.fromEntries(products.map(p => [p.name, `${p.rating}/5.0`]))
      },
      {
        feature: 'Build Quality & Finish',
        scores: Object.fromEntries(products.map(p => [p.name, p.brand === 'Apple' || p.brand === 'Sony' ? 'Ultra Premium' : 'Excellent Grade A']))
      }
    ],
    prosAndCons: products.map(p => ({
      productName: p.name,
      pros: ['Ergonomic craftsmanship', 'High customer rating', 'Comprehensive warranty'],
      cons: (p.discountPrice || p.price) > 300 ? ['Higher price point'] : ['Basic accessory bundle']
    }))
  };
};

/**
 * AI Product Description Generator for Admin
 */
export const generateProductDescriptionAI = async ({ name, category, features = [], tone = 'Persuasive & Premium' }) => {
  const ai = getAIClient();

  if (ai) {
    try {
      const prompt = `You are a world-class copywriter for an upscale e-commerce catalog.
Create a high-converting product title, short summary, detailed description, key selling bullet points, and SEO tags for:
- Product Name: ${name}
- Category: ${category}
- Key Features: ${Array.isArray(features) ? features.join(', ') : features}
- Tone: ${tone}

Return ONLY valid JSON:
{
  "title": "Optimized product title",
  "shortDescription": "Punchy 1-2 sentence hook (max 180 chars)",
  "description": "Engaging 3-paragraph product description highlighting craftsmanship, utility, and sensory benefits.",
  "bulletPoints": ["Feature 1 with customer benefit", "Feature 2 with customer benefit", "Feature 3 with customer benefit", "Feature 4 with customer benefit"],
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const cleaned = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn('Gemini description generation failed, using fallback template:', err.message);
    }
  }

  // Fallback description generator
  const featureList = Array.isArray(features) ? features : [features];
  return {
    title: `${name} - Advanced ${category}`,
    shortDescription: `Experience unmatched performance and refined design with the all-new ${name}.`,
    description: `Engineered for excellence, the ${name} merges cutting-edge technology with thoughtful ergonomics. Designed to elevate your daily routine, it sets a new benchmark in the ${category} category with seamless reliability and enduring quality.\n\nCrafted with premium materials, every detail has been calibrated for peak responsiveness and aesthetic elegance. Whether for professional productivity or leisure, it delivers an effortless, immersive experience.\n\nBacked by our comprehensive warranty and dedicated customer care, the ${name} is the definitive choice for modern enthusiasts.`,
    bulletPoints: [
      `Next-generation architecture tailored for optimal ${category} workflow`,
      `Precision engineered materials ensuring long-lasting durability`,
      `Seamless interoperability with your favorite ecosystem and devices`,
      `Backed by 24/7 dedicated support and 30-day money-back satisfaction guarantee`
    ],
    tags: [name.toLowerCase().replace(/\s+/g, '-'), category.toLowerCase(), 'premium', 'innovative', 'top-rated']
  };
};
