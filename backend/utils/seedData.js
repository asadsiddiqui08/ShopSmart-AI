import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';
import Order from '../models/Order.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting comprehensive database seeding with 20 products...');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();

    // 1. Create Categories (7 categories)
    const categoriesData = [
      {
        name: 'Audio & Headphones',
        slug: 'audio-headphones',
        description: 'Immersive studio sound, noise-canceling headphones, and audiophile speakers.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Smartphones & Tablets',
        slug: 'smartphones-tablets',
        description: 'Next-gen flagship smartphones, tablets, and mobile productivity gear.',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Laptops & Computers',
        slug: 'laptops-computers',
        description: 'High-performance laptops, ultrabooks, ultrawide displays, and mechanical keyboards.',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Smart Wearables',
        slug: 'smart-wearables',
        description: 'Titanium smartwatches, athletic trackers, and smart biometric rings.',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Smart Home & IoT',
        slug: 'smart-home-iot',
        description: 'Autonomous robot vacuums, 4K security cams, ambient lighting, and smart hubs.',
        image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Gaming & VR',
        slug: 'gaming-vr',
        description: '4K ray-tracing consoles, mixed reality headsets, and esports peripherals.',
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Cameras & Drones',
        slug: 'cameras-drones',
        description: 'Full-frame 4K mirrorless cameras, stabilized aerial drones, and creator optics.',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'
      }
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    const catMap = {};
    createdCategories.forEach(c => {
      catMap[c.slug] = c._id;
    });

    // 2. Create Users (Admin + Shopper)
    const adminUser = await User.create({
      name: 'ShopSmart Admin',
      email: 'admin@shopsmart.ai',
      password: 'AdminPassword123!',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      phone: '+1 (555) 019-2834',
      addresses: [
        {
          street: '100 Silicon Way, Suite 400',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94107',
          country: 'United States',
          isDefault: true
        }
      ]
    });

    const demoUser = await User.create({
      name: 'Alex Johnson',
      email: 'alex@shopsmart.ai',
      password: 'UserPassword123!',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      phone: '+1 (555) 438-9201',
      addresses: [
        {
          street: '742 Evergreen Terrace',
          city: 'Springfield',
          state: 'OR',
          postalCode: '97477',
          country: 'United States',
          isDefault: true
        }
      ]
    });

    // 3. Create Products (20 rich catalog items)
    const productsData = [
      // AUDIO
      {
        name: 'AuraSound Pro Noise-Cancelling Headphones',
        slug: 'aurasound-pro-headphones',
        description: 'Immerse yourself in acoustic perfection. The AuraSound Pro features industry-leading hybrid active noise cancellation, bespoke 40mm titanium drivers, and up to 45 hours of ultra-long battery life. Designed with memory foam ear cushions and lightweight aluminum arms for enduring comfort.',
        shortDescription: 'Flagship ANC wireless headphones with 45h playtime and custom titanium acoustic drivers.',
        price: 349.99,
        discountPrice: 299.99,
        category: catMap['audio-headphones'],
        categoryName: 'Audio & Headphones',
        brand: 'AuraSound',
        stock: 35,
        rating: 4.9,
        numReviews: 48,
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
        ],
        specs: [
          { name: 'Driver Size', value: '40mm Custom Titanium' },
          { name: 'Battery Life', value: 'Up to 45 Hours (ANC On)' },
          { name: 'Connectivity', value: 'Bluetooth 5.3 + Multi-point' },
          { name: 'Weight', value: '254g' }
        ],
        tags: ['audio', 'headphones', 'noise-cancelling', 'wireless', 'audiophile', 'bluetooth'],
        isFeatured: true,
        isTrending: true,
        aiHighlights: ['Studio-grade acoustic response', 'Ultra-fast 10-min charge gives 5h play', 'Adaptive spatial audio'],
        aiSentimentSummary: 'Customers consistently praise the silence of ANC and rich sub-bass response.'
      },
      {
        name: 'Zenith Studio Wireless Earbuds',
        slug: 'zenith-studio-earbuds',
        description: 'True wireless freedom with high-resolution LDAC audio streaming. Equipped with 6 beamforming microphones for crystal-clear calls, IPX5 water resistance, and an ergonomic wireless charging case that provides 32 hours total endurance.',
        shortDescription: 'Hi-Res certified true wireless earbuds with transparent mode and Qi wireless charging.',
        price: 189.99,
        discountPrice: 149.99,
        category: catMap['audio-headphones'],
        categoryName: 'Audio & Headphones',
        brand: 'Zenith',
        stock: 50,
        rating: 4.7,
        numReviews: 32,
        images: [
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80'
        ],
        specs: [
          { name: 'Water Resistance', value: 'IPX5 Sweat & Rainproof' },
          { name: 'Total Battery', value: '32 Hours with Case' },
          { name: 'Codecs', value: 'LDAC, AAC, SBC' }
        ],
        tags: ['earbuds', 'audio', 'wireless', 'workout', 'commute'],
        isFeatured: false,
        isTrending: true,
        aiHighlights: ['Compact pocket case', 'Seamless iOS & Android pairing', 'Deep bass reflex chamber'],
        aiSentimentSummary: 'Praised for comfortable long-wear fit and clear microphone pickup.'
      },
      {
        name: 'Bose QuietComfort Ultra Wireless Earbuds',
        slug: 'bose-quietcomfort-ultra-earbuds',
        description: 'Breakthrough spatial audio and world-class noise cancellation tailored specifically to your ear canal shape via CustomTune technology. Built for silence anywhere.',
        shortDescription: 'World-class active noise cancellation with immersive spatial audio calibration.',
        price: 299.00,
        discountPrice: 249.00,
        category: catMap['audio-headphones'],
        categoryName: 'Audio & Headphones',
        brand: 'Bose',
        stock: 25,
        rating: 4.8,
        numReviews: 39,
        images: [
          'https://images.unsplash.com/photo-1598331668826-20cecc596b86?auto=format&fit=crop&w=800&q=80'
        ],
        specs: [
          { name: 'ANC Mode', value: 'Bose World-Class Hybrid' },
          { name: 'Playtime', value: '24 Hours Total Endurance' },
          { name: 'Sensors', value: 'Touch gestures + In-ear detect' }
        ],
        tags: ['audio', 'earbuds', 'bose', 'anc', 'noise-cancelling'],
        isFeatured: false,
        isTrending: true,
        aiHighlights: ['CustomTune personal acoustics', 'Zero ear fatigue over extended usage'],
        aiSentimentSummary: 'Regarded as the gold standard in in-ear noise cancellation.'
      },
      {
        name: 'JBL Boombox 3 Waterproof Portable Speaker',
        slug: 'jbl-boombox-3-speaker',
        description: 'Monstrous sound wherever you go. Features a massive 3-way speaker system delivering high acoustic sensitivity, sharp treble, and earthquake sub-bass. IP67 waterproof and dustproof with a 24-hour internal powerbank.',
        shortDescription: 'Heavy-duty 24h waterproof portable speaker with subwoofer and powerbank function.',
        price: 499.95,
        discountPrice: 429.95,
        category: catMap['audio-headphones'],
        categoryName: 'Audio & Headphones',
        brand: 'JBL',
        stock: 18,
        rating: 4.8,
        numReviews: 27,
        images: [
          'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
        ],
        specs: [
          { name: 'Output Power', value: '180W Total System RMS' },
          { name: 'Water Resistance', value: 'IP67 Waterproof & Dustproof' },
          { name: 'Battery', value: '24 Hours Non-stop Playback' }
        ],
        tags: ['speaker', 'bluetooth', 'jbl', 'waterproof', 'party', 'outdoor'],
        isFeatured: true,
        isTrending: false,
        aiHighlights: ['Integrated metal handle with silicone grip', 'Charges smartphones via USB port'],
        aiSentimentSummary: 'Unanimously praised for outdoor volume levels and rich, room-shaking bass.'
      },

      // LAPTOPS & COMPUTERS
      {
        name: 'TitanBook 16 Pro M3 Ultrabook',
        slug: 'titanbook-16-pro-ultrabook',
        description: 'Engineered for power users, developers, and creatives. Packed with a 16-core neural engine, 32GB unified RAM, 1TB blazing NVMe storage, and a breath-taking 16.2-inch Liquid Retina XDR display running at smooth 120Hz ProMotion.',
        shortDescription: '16.2-inch Retina 120Hz workstation laptop with 32GB RAM and 22-hour battery.',
        price: 2499.00,
        discountPrice: 2299.00,
        category: catMap['laptops-computers'],
        categoryName: 'Laptops & Computers',
        brand: 'Titan',
        stock: 12,
        rating: 4.9,
        numReviews: 24,
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80'
        ],
        specs: [
          { name: 'Display', value: '16.2" Mini-LED (3456 x 2234) 120Hz' },
          { name: 'Processor', value: 'Titan M3 Max 16-Core' },
          { name: 'Memory', value: '32GB Unified Memory' },
          { name: 'Storage', value: '1TB PCIe 4.0 NVMe SSD' },
          { name: 'Battery', value: 'Up to 22 Hours Web Browsing' }
        ],
        tags: ['laptop', 'ultrabook', 'creator', 'coding', '4k', 'portable'],
        isFeatured: true,
        isTrending: true,
        aiHighlights: ['Sublime 1600 nits peak brightness display', 'Silent cooling vapor chamber', 'Studio-quality 6-speaker array'],
        aiSentimentSummary: 'Lauded by software engineers and video editors for zero thermal throttling.'
      },
      {
        name: 'NovaBook Air 14 Lightweight Laptop',
        slug: 'novabook-air-14-laptop',
        description: 'Thin, silent, and effortlessly fast. At just 1.1kg, the NovaBook Air is your ultimate companion for coffee shops, university lectures, and travel. Features a vivid 2.8K OLED screen and 18-hour battery longevity.',
        shortDescription: '1.1kg featherlight OLED laptop built for mobile productivity and all-day battery.',
        price: 1199.00,
        discountPrice: 999.00,
        category: catMap['laptops-computers'],
        categoryName: 'Laptops & Computers',
        brand: 'Nova',
        stock: 28,
        rating: 4.8,
        numReviews: 19,
        images: [
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'
        ],
        specs: [
          { name: 'Weight', value: '1.1 kg (2.4 lbs)' },
          { name: 'Display', value: '14" 2.8K OLED (90Hz)' },
          { name: 'RAM', value: '16GB LPDDR5' },
          { name: 'Storage', value: '512GB SSD' }
        ],
        tags: ['laptop', 'lightweight', 'student', 'oled', 'battery'],
        isFeatured: true,
        isTrending: false,
        aiHighlights: ['True blacks and 100% DCI-P3 color gamut', 'Fanless whisper-silent operation'],
        aiSentimentSummary: 'Users love the featherlight chassis and sharp OLED contrast.'
      },
      {
        name: 'LG UltraGear 38" Curved Nano IPS Monitor',
        slug: 'lg-ultragear-38-curved-monitor',
        description: 'Expand your vision with a cinematic 38-inch 21:9 curved workspace. Features 3840x1600 Quad HD+ resolution, 1ms response time, 144Hz refresh rate, and Thunderbolt 3 / USB-C 90W power delivery for one-cable laptop connectivity.',
        shortDescription: '38" Curved 21:9 Nano IPS WQHD+ 144Hz monitor with 90W USB-C charging.',
        price: 1299.99,
        discountPrice: 1099.99,
        category: catMap['laptops-computers'],
        categoryName: 'Laptops & Computers',
        brand: 'LG',
        stock: 14,
        rating: 4.9,
        numReviews: 31,
        images: [
          'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
        ],
        specs: [
          { name: 'Display Size', value: '38" Curved 2300R 21:9' },
          { name: 'Resolution', value: '3840 x 1600 WQHD+' },
          { name: 'Refresh Rate', value: '144Hz Overclockable to 160Hz' },
          { name: 'Connectivity', value: 'Thunderbolt 3 (90W), DP 1.4, HDMI 2.0' }
        ],
        tags: ['monitor', 'ultrawide', 'curved', 'gaming', 'workspace', '4k'],
        isFeatured: false,
        isTrending: true,
        aiHighlights: ['Replaces dual monitor setups seamlessly', 'Spectacular DCI-P3 98% color accuracy'],
        aiSentimentSummary: 'Hailed as the dream display for programmers and day traders.'
      },
      {
        name: 'Keychron Q1 Pro Wireless Mechanical Keyboard',
        slug: 'keychron-q1-pro-keyboard',
        description: 'Precision engineered from a solid 6063 aluminum block. Features double-gasket acoustic mounting, hot-swappable switches, wireless Bluetooth 5.1 multi-device pairing, and full open-source QMK/VIA key remapping.',
        shortDescription: 'Premium CNC aluminum wireless mechanical keyboard with double-gasket acoustic dampening.',
        price: 199.99,
        discountPrice: 179.99,
        category: catMap['laptops-computers'],
        categoryName: 'Laptops & Computers',
        brand: 'Keychron',
        stock: 33,
        rating: 4.9,
        numReviews: 44,
        images: [
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
        ],
        specs: [
          { name: 'Chassis', value: 'Solid CNC 6063 Aluminum' },
          { name: 'Keycaps', value: 'Double-shot PBT KSA Profile' },
          { name: 'Polling Rate', value: '1000Hz Wired / 90Hz Bluetooth' }
        ],
        tags: ['keyboard', 'mechanical', 'custom', 'desksetup', 'wireless'],
        isFeatured: false,
        isTrending: false,
        aiHighlights: ['Thocky and satisfying typing acoustics', 'Fully programmable rotary encoder knob'],
        aiSentimentSummary: 'Loved by keyboard enthusiasts for weight, build heft, and smooth tactile switches.'
      },

      // SMARTPHONES & TABLETS
      {
        name: 'Apex Horizon Ultra 5G Smartphone',
        slug: 'apex-horizon-ultra-5g',
        description: 'Redefining mobile photography with a 200MP quad-sensor camera array co-engineered with optical masters. Powered by a 4nm octa-core silicon, 120W HyperCharge (0 to 100% in 19 mins), and a brilliant 6.8-inch Dynamic AMOLED 2X display.',
        shortDescription: 'Flagship 5G smartphone with 200MP camera, 120W HyperCharge and 512GB storage.',
        price: 1199.99,
        discountPrice: 1049.99,
        category: catMap['smartphones-tablets'],
        categoryName: 'Smartphones & Tablets',
        brand: 'Apex',
        stock: 22,
        rating: 4.8,
        numReviews: 38,
        images: [
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'
        ],
        specs: [
          { name: 'Main Camera', value: '200MP OIS + 50MP Periscope 10x' },
          { name: 'Screen', value: '6.8" AMOLED 1-120Hz LTPO' },
          { name: 'Charging', value: '120W Wired + 50W Wireless' },
          { name: 'Battery', value: '5400 mAh' }
        ],
        tags: ['smartphone', '5g', 'flagship', 'camera', 'android'],
        isFeatured: true,
        isTrending: true,
        aiHighlights: ['Astrophotography mode captures night skies', '19-minute full recharge', 'Gorilla Glass Armor'],
        aiSentimentSummary: 'Spectacular zoom lens and lightning-fast charging rated best-in-class.'
      },
      {
        name: 'Samsung Galaxy S24 Ultra 5G AI Phone',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'Titanium durability paired with integrated Galaxy AI features. Translate calls live in real-time, format notes instantly, and search anything on screen with Circle to Search. Features a built-in S-Pen and flat 120Hz display.',
        shortDescription: 'Titanium flagship phone with on-device Galaxy AI and built-in S-Pen stylus.',
        price: 1299.99,
        discountPrice: 1149.99,
        category: catMap['smartphones-tablets'],
        categoryName: 'Smartphones & Tablets',
        brand: 'Samsung',
        stock: 20,
        rating: 4.9,
        numReviews: 53,
        images: [
          'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80'
        ],
        specs: [
          { name: 'Build', value: 'Grade 2 Titanium Frame' },
          { name: 'Display', value: '6.8" Flat Dynamic AMOLED 2600 nits' },
          { name: 'Stylus', value: 'Integrated Bluetooth S-Pen' }
        ],
        tags: ['samsung', 'galaxy', 'smartphone', 'ai', '5g', 'spen'],
        isFeatured: true,
        isTrending: true,
        aiHighlights: ['AI Live Translate and Note Assist', 'Anti-reflective Corning Gorilla Armor'],
        aiSentimentSummary: 'Users love the anti-reflective display and productivity boost from the built-in stylus.'
      },
      {
        name: 'Apple iPad Pro 13" M4 OLED Tablet',
        slug: 'apple-ipad-pro-13-m4',
        description: 'Impossibly thin design powered by next-generation Apple M4 silicon. The breakthrough Ultra Retina XDR tandem OLED display delivers unbelievable contrast and color precision for illustrators, designers, and video editors.',
        shortDescription: '13-inch Tandem OLED Ultra Retina XDR tablet with Apple M4 processor.',
        price: 1299.00,
        discountPrice: 1199.00,
        category: catMap['smartphones-tablets'],
        categoryName: 'Smartphones & Tablets',
        brand: 'Apple',
        stock: 16,
        rating: 4.9,
        numReviews: 29,
        images: [
          'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80'
        ],
        specs: [
          { name: 'Thickness', value: '5.1mm Ultrathin' },
          { name: 'Screen', value: '13" Tandem OLED (2752 x 2064) 120Hz' },
          { name: 'Chip', value: 'Apple M4 9-Core CPU / 10-Core GPU' }
        ],
        tags: ['ipad', 'tablet', 'apple', 'oled', 'm4', 'design', 'drawing'],
        isFeatured: false,
        isTrending: true,
        aiHighlights: ['Tandem OLED peak brightness of 1600 nits', 'Barrel roll haptic feedback with Pencil Pro'],
        aiSentimentSummary: 'Praised as the most breathtaking mobile display ever created.'
      },

      // SMART WEARABLES
      {
        name: 'ChronoTrack Active 2 Smartwatch',
        slug: 'chronotrack-active-2-smartwatch',
        description: 'Your premier health and athletic coach on your wrist. Tracks HRV, ECG, SpO2, sleep stages, and over 110 sports modes. Built from aerospace titanium with sapphire crystal glass and water resistant down to 50 meters.',
        shortDescription: 'Titanium GPS smartwatch with ECG, sleep analysis, and 14-day battery reserve.',
        price: 299.99,
        discountPrice: 249.99,
        category: catMap['smart-wearables'],
        categoryName: 'Smart Wearables',
        brand: 'Chrono',
        stock: 40,
        rating: 4.7,
        numReviews: 29,
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
        ],
        specs: [
          { name: 'Case Material', value: 'Aerospace Grade 5 Titanium' },
          { name: 'Glass', value: 'Scratch-resistant Sapphire Crystal' },
          { name: 'Battery Life', value: '14 Days Typical Use' },
          { name: 'Water Resistance', value: '5 ATM (50m)' }
        ],
        tags: ['smartwatch', 'fitness', 'health', 'gps', 'wearable'],
        isFeatured: true,
        isTrending: false,
        aiHighlights: ['Medical grade ECG & blood oxygen sensor', 'Offline topographical trail maps'],
        aiSentimentSummary: 'Praised for accurate heart rate tracking and exceptional 2-week battery life.'
      },
      {
        name: 'Ultrahuman Ring AIR Smart Fitness Ring',
        slug: 'ultrahuman-ring-air',
        description: 'The world’s lightest sleep and health tracking smart ring at just 2.4 grams. Fabricated from fighter-jet titanium with smooth medical-grade hypoallergenic resin inside. Tracks sleep cycles, temperature variation, and HRV recovery with zero monthly subscription fee.',
        shortDescription: '2.4-gram titanium biometric smart ring with circadian rhythm and sleep tracking.',
        price: 349.00,
        discountPrice: 299.00,
        category: catMap['smart-wearables'],
        categoryName: 'Smart Wearables',
        brand: 'Ultrahuman',
        stock: 30,
        rating: 4.8,
        numReviews: 35,
        images: [
          'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'
        ],
        specs: [
          { name: 'Weight', value: '2.4 grams' },
          { name: 'Material', value: 'Titanium with Tungsten Carbide coating' },
          { name: 'Battery Life', value: 'Up to 6 Days Continuous' },
          { name: 'Subscription', value: 'Zero Ongoing Fees' }
        ],
        tags: ['smartring', 'wearable', 'fitness', 'sleep', 'recovery', 'health'],
        isFeatured: false,
        isTrending: true,
        aiHighlights: ['Zero subscription required', 'Barely noticeable weight on fingers while sleeping'],
        aiSentimentSummary: 'Celebrated by athletes for actionable recovery scoring and form factor.'
      },

      // SMART HOME & IOT
      {
        name: 'Lumina Glow Smart Ambience Light Hub',
        slug: 'lumina-glow-ambience-hub',
        description: 'Transform your room atmosphere with synchronized sound-reactive lighting, circadian rhythm natural wake-up lighting, and voice control via Google Home, Alexa, and Apple HomeKit.',
        shortDescription: '16M colors adaptive ambient light hub with music sync and Matter compatibility.',
        price: 89.99,
        discountPrice: 69.99,
        category: catMap['smart-home-iot'],
        categoryName: 'Smart Home & IoT',
        brand: 'Lumina',
        stock: 60,
        rating: 4.6,
        numReviews: 15,
        images: [
          'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80'
        ],
        specs: [
          { name: 'Colors', value: '16 Million RGB + Tunable White' },
          { name: 'Connectivity', value: 'Wi-Fi 6 + Matter + Thread' },
          { name: 'Luminance', value: '1100 Lumens' }
        ],
        tags: ['smarthome', 'lighting', 'rgb', 'matter', 'iot'],
        isFeatured: false,
        isTrending: true,
        aiHighlights: ['Circadian rhythm auto-temperature shifting', 'Zero-latency gaming and screen sync'],
        aiSentimentSummary: 'Loved for easy setup and vibrant color depth.'
      },
      {
        name: 'VisionGuard 4K AI Home Security Camera',
        slug: 'visionguard-4k-ai-camera',
        description: 'Crystal-clear 4K HDR home security camera powered by on-device edge AI. Distinguishes humans, pets, vehicles, and packages with zero monthly subscription fees. Features color night vision and two-way audio talk.',
        shortDescription: 'Wire-free 4K security camera with local edge AI detection and solar charging support.',
        price: 199.99,
        discountPrice: 169.99,
        category: catMap['smart-home-iot'],
        categoryName: 'Smart Home & IoT',
        brand: 'VisionGuard',
        stock: 30,
        rating: 4.8,
        numReviews: 21,
        images: [
          'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=800&q=80'
        ],
        specs: [
          { name: 'Resolution', value: '4K Ultra HD (3840 x 2160) HDR' },
          { name: 'Night Vision', value: 'Color Night Vision with Spotlight' },
          { name: 'Storage', value: 'Local MicroSD / Home Hub (No Monthly Fee)' }
        ],
        tags: ['smarthome', 'security', 'camera', 'ai', '4k'],
        isFeatured: false,
        isTrending: false,
        aiHighlights: ['No mandatory monthly subscription fees', 'AI facial recognition and delivery detection'],
        aiSentimentSummary: 'Users love the sharp night video and absence of recurring subscriptions.'
      },
      {
        name: 'Roborock S8 Pro Ultra Robot Vacuum & Mop',
        slug: 'roborock-s8-pro-ultra',
        description: 'The pinnacle of hands-free autonomous home cleaning. Features 6000Pa HyperForce suction, dual vibrating mop pads, and an all-in-one docking station that automatically self-empties dust, washes the mop with hot water, and heat-dries the pads.',
        shortDescription: 'Fully autonomous robot vacuum & mop with hot-water self-washing dock.',
        price: 1599.99,
        discountPrice: 1399.99,
        category: catMap['smart-home-iot'],
        categoryName: 'Smart Home & IoT',
        brand: 'Roborock',
        stock: 10,
        rating: 4.9,
        numReviews: 41,
        images: [
          'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=800&q=80'
        ],
        specs: [
          { name: 'Suction Power', value: '6000 Pa Extreme Suction' },
          { name: 'Dock Functions', value: 'Self-empty, Self-wash, Hot air drying, Auto-refill' },
          { name: 'Navigation', value: 'PreciSense LiDAR + Reactive 3D Obstacle Avoidance' }
        ],
        tags: ['smarthome', 'robot-vacuum', 'mop', 'autonomous', 'cleaning'],
        isFeatured: true,
        isTrending: false,
        aiHighlights: ['Zero hair tangle dual rubber rollers', 'Lifts mop automatically on carpets'],
        aiSentimentSummary: 'Consistently called life-changing for busy pet owners and large households.'
      },

      // GAMING & VR
      {
        name: 'Sony PlayStation 5 Pro Console',
        slug: 'sony-playstation-5-pro',
        description: 'Witness the highest level of console graphical fidelity ever. Upgraded GPU with 67% more compute units and AI-driven spectral super resolution (PSSR) brings ray-traced 4K visuals at a locked 60 to 120 FPS. Includes 2TB high-speed NVMe storage.',
        shortDescription: 'Flagship 4K 120Hz console with PlayStation Spectral Super Resolution and 2TB SSD.',
        price: 699.99,
        discountPrice: 649.99,
        category: catMap['gaming-vr'],
        categoryName: 'Gaming & VR',
        brand: 'Sony',
        stock: 15,
        rating: 4.9,
        numReviews: 62,
        images: [
          'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
        ],
        specs: [
          { name: 'Storage', value: '2TB Ultra-Fast Custom NVMe SSD' },
          { name: 'Upscaling', value: 'PSSR Machine Learning AI Upscaling' },
          { name: 'Network', value: 'Wi-Fi 7 Ready' },
          { name: 'Audio', value: 'Tempest 3D AudioTech' }
        ],
        tags: ['gaming', 'console', 'playstation', 'ps5', '4k', 'sony'],
        isFeatured: true,
        isTrending: true,
        aiHighlights: ['Uncapped 120Hz high framerate gameplay', 'Advanced ray-traced lighting and reflections'],
        aiSentimentSummary: 'Gamers rave about the silky smooth 60fps fidelity modes in demanding AAA titles.'
      },
      {
        name: 'Meta Quest 3 Mixed Reality VR Headset',
        slug: 'meta-quest-3-vr-headset',
        description: 'Step into mixed reality where virtual elements blend naturally with your physical living room. Powered by the Snapdragon XR2 Gen 2 platform, dual RGB passthrough cameras, 4K+ Infinite Display, and precision Touch Plus haptic controllers.',
        shortDescription: 'All-in-one wireless mixed reality headset with 4K+ Infinite Display and color passthrough.',
        price: 499.99,
        discountPrice: 469.99,
        category: catMap['gaming-vr'],
        categoryName: 'Gaming & VR',
        brand: 'Meta',
        stock: 24,
        rating: 4.8,
        numReviews: 47,
        images: [
          'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=800&q=80'
        ],
        specs: [
          { name: 'Optics', value: 'Pancake Lenses with 4K+ Infinite Display' },
          { name: 'Passthrough', value: 'Stereo Full-Color Passthrough with Depth Sensor' },
          { name: 'Storage', value: '512GB High-speed Storage' }
        ],
        tags: ['vr', 'gaming', 'mixed-reality', 'meta', 'headset', 'metaverse'],
        isFeatured: false,
        isTrending: true,
        aiHighlights: ['No PC or wires required to play', 'Crystal clear edge-to-edge pancake lens clarity'],
        aiSentimentSummary: 'Praised for vibrant color passthrough and expansive library of immersive games.'
      },

      // CAMERAS & DRONES
      {
        name: 'Sony Alpha 7 IV Full-Frame Mirrorless Camera',
        slug: 'sony-alpha-7-iv-camera',
        description: 'The definitive hybrid camera for photographers and cinematographers. Features a newly developed 33MP Exmor R back-illuminated CMOS sensor, 4K 60p 10-bit 4:2:2 video capture, BIONZ XR processing, and AI subject tracking across humans, animals, and birds.',
        shortDescription: '33MP Full-Frame hybrid mirrorless camera with 4K 60p 10-bit recording and AI tracking.',
        price: 2499.00,
        discountPrice: 2299.00,
        category: catMap['cameras-drones'],
        categoryName: 'Cameras & Drones',
        brand: 'Sony',
        stock: 11,
        rating: 4.9,
        numReviews: 34,
        images: [
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'
        ],
        specs: [
          { name: 'Sensor', value: '33.0 Megapixel 35mm Full-Frame Exmor R' },
          { name: 'Video', value: '4K 60p 10-bit 4:2:2 All-Intra' },
          { name: 'Autofocus', value: '759 Phase-detection AF Points with AI Eye Tracking' },
          { name: 'Stabilization', value: '5.5-stop 5-axis Optical In-Body Image Stabilization' }
        ],
        tags: ['camera', 'photography', 'sony', 'fullframe', 'video', 'mirrorless'],
        isFeatured: true,
        isTrending: true,
        aiHighlights: ['Pin-sharp AI eye autofocus in pitch black', 'Breathing compensation for cine lenses'],
        aiSentimentSummary: 'Photographers love the dynamic range and low-light autofocus precision.'
      },
      {
        name: 'DJI Mini 4 Pro 4K Drone Fly More Combo',
        slug: 'dji-mini-4-pro-drone',
        description: 'Weighing under 249 grams, the DJI Mini 4 Pro requires no registration in most regions. Features omnidirectional obstacle sensing, 4K 60fps HDR video, true vertical shooting for TikTok & Reels, and 20km FHD video transmission with the RC 2 smart controller.',
        shortDescription: 'Under 249g pocket drone with omnidirectional obstacle avoidance and 4K 60fps HDR.',
        price: 959.00,
        discountPrice: 899.00,
        category: catMap['cameras-drones'],
        categoryName: 'Cameras & Drones',
        brand: 'DJI',
        stock: 19,
        rating: 4.8,
        numReviews: 36,
        images: [
          'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80'
        ],
        specs: [
          { name: 'Weight', value: '< 249g (No License Required)' },
          { name: 'Camera', value: '4K 60fps HDR / 4K 100fps Slow Motion' },
          { name: 'Flight Time', value: '34 Minutes Per Battery (3 Included)' },
          { name: 'Sensing', value: 'Omnidirectional Obstacle Avoidance' }
        ],
        tags: ['drone', 'dji', 'camera', '4k', 'aerial', 'travel'],
        isFeatured: false,
        isTrending: true,
        aiHighlights: ['True vertical camera rotation for social media', 'ActiveTrack 360 autonomous following'],
        aiSentimentSummary: 'Praised by travelers for pocket size, wind resistance, and intuitive controls.'
      }
    ];

    const createdProducts = await Product.insertMany(productsData);

    // Update item counts in categories
    for (const cat of createdCategories) {
      const count = await Product.countDocuments({ category: cat._id });
      cat.itemCount = count;
      await cat.save();
    }

    // 4. Create Sample Reviews
    const sampleReviews = [
      {
        user: demoUser._id,
        product: createdProducts[0]._id, // AuraSound Pro
        name: 'Alex Johnson',
        rating: 5,
        title: 'Best ANC Headphones I have ever owned!',
        comment: 'The noise cancellation completely blocks out jet engines and coffee shop chatter. Battery life easily lasted me a full week of flights and commutes without needing a recharge.',
        verifiedPurchase: true,
        sentiment: {
          label: 'Positive',
          score: 0.98,
          summary: 'Extremely satisfied with superior noise cancellation and battery longevity.'
        }
      },
      {
        user: adminUser._id,
        product: createdProducts[4]._id, // TitanBook 16 Pro
        name: 'ShopSmart Admin',
        rating: 5,
        title: 'Unbelievable performance for heavy workloads',
        comment: 'Building complex codebases and compiling microservices in seconds. The 120Hz Liquid Retina display is by far the prettiest panel on any laptop.',
        verifiedPurchase: true,
        sentiment: {
          label: 'Positive',
          score: 0.96,
          summary: 'Exceptional computing speed and immaculate display.'
        }
      },
      {
        user: demoUser._id,
        product: createdProducts[16]._id, // PlayStation 5 Pro
        name: 'Alex Johnson',
        rating: 5,
        title: 'Graphics are unreal on an OLED TV',
        comment: 'PSSR upscaling really makes a night and day difference. 60 FPS with full ray tracing enabled feels like playing on a high-end $2000 gaming rig.',
        verifiedPurchase: true,
        sentiment: {
          label: 'Positive',
          score: 0.97,
          summary: 'Thrilled with 60fps ray-traced visuals and PSSR resolution boost.'
        }
      }
    ];

    await Review.insertMany(sampleReviews);

    // 5. Create a sample order for demoUser
    const sampleOrder = await Order.create({
      user: demoUser._id,
      orderItems: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          image: createdProducts[0].images[0],
          price: createdProducts[0].discountPrice || createdProducts[0].price,
          quantity: 1
        }
      ],
      shippingAddress: {
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        postalCode: '97477',
        country: 'United States'
      },
      paymentMethod: 'Credit Card',
      itemsPrice: 299.99,
      taxPrice: 24.00,
      shippingPrice: 0.00,
      totalPrice: 323.99,
      isPaid: true,
      paidAt: new Date(Date.now() - 86400000 * 2),
      status: 'Shipped'
    });

    console.log(`✅ Successfully seeded database:`);
    console.log(`   - ${createdCategories.length} Categories`);
    console.log(`   - ${createdProducts.length} Products`);
    console.log(`   - 2 Users (Admin: admin@shopsmart.ai, User: alex@shopsmart.ai)`);
    console.log(`   - ${sampleReviews.length} Reviews`);
    console.log(`   - 1 Sample Order`);

    return { success: true };
  } catch (err) {
    console.error('❌ Database seeding error:', err.message);
    throw err;
  }
};

// If run directly from CLI
if (process.argv[1]?.includes('seedData.js')) {
  import('../config/db.js').then(async ({ connectDB, disconnectDB }) => {
    await connectDB();
    await seedDatabase();
    await disconnectDB();
    process.exit(0);
  });
}
