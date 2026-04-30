export type Category = {
  id: string;
  name: string;
  description: string;
  bannerSeed: string;
};

export type Product = {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
  price: number;
  rating: number;
  inStock: boolean;
  description: string;
  specifications: string[];
  imageSeed: string;
  imageUrl?: string;
  /** Additional gallery images (data URLs or https), from D1 `gallery_json`. */
  imageUrls?: string[];
  isLive?: boolean;
  /** When set (e.g. D1 products), caps cart + selector. */
  inventory?: number;
};

export const categories: Category[] = [
  { id: "art-craft-sewing", name: "Art, Craft & Sewing", description: "Creative tools, craft kits, and sewing essentials.", bannerSeed: "art-craft" },
  { id: "beauty-personal-care", name: "Beauty & Personal Care", description: "Self-care and grooming products for everyday confidence.", bannerSeed: "beauty" },
  { id: "baby-products", name: "Baby Products", description: "Safe and dependable products for babies and new parents.", bannerSeed: "baby" },
  { id: "home-decor", name: "Home & Decor", description: "Functional and elegant items for modern living spaces.", bannerSeed: "home-decor" },
  { id: "health-household", name: "Health & Household", description: "Household care and wellness necessities for daily life.", bannerSeed: "health-household" },
  { id: "kitchen-dining", name: "Kitchen & Dining", description: "Cookware, dining accessories, and kitchen tools.", bannerSeed: "kitchen-dining" },
  { id: "office-products", name: "Office Products", description: "Reliable office solutions for professionals and teams.", bannerSeed: "office" },
  { id: "pet-supplies", name: "Pet Supplies", description: "Everyday essentials that keep pets happy and healthy.", bannerSeed: "pets" },
  { id: "patio-lawn-garden", name: "Patio, Lawn & Garden", description: "Outdoor tools and supplies for beautiful spaces.", bannerSeed: "garden" },
  { id: "sports-outdoors", name: "Sports & Outdoors", description: "Performance gear for active and outdoor lifestyles.", bannerSeed: "sports-outdoors" },
  { id: "toys-games", name: "Toys & Games", description: "Quality toys and activities for learning and fun.", bannerSeed: "toys-games" },
  { id: "tools-hardware", name: "Tools & Hardware", description: "Durable hardware and tools for home and workshop needs.", bannerSeed: "tools-hardware" },
];

const productNameSeeds: Record<string, string[]> = {
  "art-craft-sewing": ["Precision Craft Scissors", "Acrylic Paint Set", "Embroidery Starter Kit", "Portable Sewing Box", "Premium Sketchbook", "Cotton Fabric Bundle", "Fine Detail Brush Set", "Adjustable Dress Form", "Watercolor Pad", "Professional Glue Gun", "Thread Organizer Rack", "Craft Cutting Mat"],
  "beauty-personal-care": ["Hydrating Face Serum", "Gentle Daily Cleanser", "Volumizing Hair Shampoo", "Ceramic Hair Dryer", "Body Care Gift Set", "Nourishing Lip Treatment", "Electric Toothbrush Kit", "Soft Bristle Hair Brush", "Spa Towel Collection", "Vitamin C Moisturizer", "Precision Trimmer", "Aloe Vera Body Lotion"],
  "baby-products": ["Infant Feeding Bottle Set", "Organic Baby Blanket", "Baby Stroller Organizer", "Silicone Bib Pack", "Convertible Baby Carrier", "Hypoallergenic Baby Wipes", "Crib Mobile Toy Set", "Toddler Training Cup", "Baby Bath Support Seat", "Diaper Caddy Organizer", "Soft Baby Romper Set", "Travel Changing Mat"],
  "home-decor": ["Minimalist Table Lamp", "Decorative Wall Mirror", "Luxury Cushion Covers", "Aromatic Candle Set", "Modern Floor Vase", "Framed Abstract Wall Art", "Woven Storage Basket", "Indoor Plant Stand", "Plush Area Rug", "Ceramic Accent Bowl", "Wooden Floating Shelf", "Decorative Throw Blanket"],
  "health-household": ["Air Purifier Filter Set", "Antibacterial Surface Spray", "Digital Thermometer", "Reusable Cleaning Cloths", "Household First Aid Kit", "Laundry Detergent Pods", "Multi-Surface Mop System", "Hand Sanitizer Bundle", "Moisture Absorber Packs", "Premium Trash Bags", "Disinfecting Wipes", "Water Filter Cartridge"],
  "kitchen-dining": ["Stainless Cookware Set", "Chef Knife Trio", "Heatproof Glass Containers", "Electric Kettle Pro", "Non-Stick Frying Pan", "Bamboo Cutting Board", "Insulated Food Flask", "Dinner Plate Set", "Milk Frother Wand", "Silicone Kitchen Utensils", "Compact Spice Rack", "Tableware Service Set"],
  "office-products": ["Ergonomic Desk Chair", "Wireless Keyboard & Mouse", "Hardcover Business Notebook", "Noise-Reducing Headset", "Document Organizer Tray", "Premium Gel Pen Set", "USB-C Hub Adapter", "Monitor Stand Riser", "Portable Label Maker", "Weekly Planner Pack", "Professional Stapler", "Dry Erase Board Kit"],
  "pet-supplies": ["Adjustable Pet Harness", "Automatic Water Dispenser", "Orthopedic Pet Bed", "Natural Pet Shampoo", "Cat Scratching Post", "Pet Travel Carrier", "Stainless Feeding Bowls", "Interactive Chew Toy Set", "Pet Grooming Brush", "Training Treat Pouch", "Litter Scoop Pro", "Reflective Pet Leash"],
  "patio-lawn-garden": ["Garden Pruning Shears", "Outdoor String Lights", "Weatherproof Patio Cover", "Raised Garden Planter", "Watering Hose Reel", "Lawn Fertilizer Spreader", "Solar Garden Path Lights", "Outdoor Storage Box", "Heavy Duty Rake", "Plant Nutrition Mix", "Patio Furniture Cushion", "Seed Starter Tray Set"],
  "sports-outdoors": ["Insulated Sports Bottle", "Resistance Band Kit", "Lightweight Camping Tent", "All-Terrain Backpack", "Yoga Mat Pro", "Portable Folding Chair", "Performance Running Cap", "Outdoor First Aid Pack", "Cycling Safety Light Set", "Fitness Jump Rope", "Hiking Pole Pair", "Quick Dry Towel Set"],
  "toys-games": ["Educational Building Blocks", "Family Strategy Board Game", "Kids Art Activity Set", "Remote Control Car", "Puzzle Challenge Set", "Interactive Learning Tablet", "Soft Plush Animal", "STEM Experiment Kit", "Classic Card Game Pack", "Magnetic Tile Set", "Role Play Kitchen Toy", "Wooden Train Collection"],
  "tools-hardware": ["Cordless Power Drill", "Heavy Duty Hammer", "Precision Screwdriver Kit", "Adjustable Wrench Set", "Laser Measuring Tool", "Tool Storage Organizer", "Safety Work Gloves", "Multi-Purpose Utility Knife", "Portable Work Light", "Fastening Nail Assortment", "Wall Mounting Kit", "Industrial Tape Measure"],
};

const categoryPriceRange: Record<string, [number, number]> = {
  "art-craft-sewing": [9, 72],
  "beauty-personal-care": [8, 89],
  "baby-products": [11, 140],
  "home-decor": [14, 220],
  "health-household": [7, 95],
  "kitchen-dining": [12, 260],
  "office-products": [6, 320],
  "pet-supplies": [9, 180],
  "patio-lawn-garden": [10, 310],
  "sports-outdoors": [12, 280],
  "toys-games": [8, 160],
  "tools-hardware": [11, 350],
};

const buildProduct = (categoryId: string, index: number, name: string): Product => {
  const [min, max] = categoryPriceRange[categoryId];
  const price = Number((min + ((max - min) * (index + 1)) / 14).toFixed(2));
  const rating = Number((4 + ((index % 8) / 10)).toFixed(1));
  const id = `${categoryId}-${index + 1}`;

  return {
    id,
    slug: id,
    categoryId,
    name,
    price,
    rating,
    inStock: index % 7 !== 0,
    inventory: index % 7 !== 0 ? 9999 : 0,
    description:
      `${name} is sourced through verified supplier networks and designed for dependable everyday performance. This product aligns with Everon Global Trades LLC quality checks for packaging, durability, and value.`,
    specifications: [
      "Verified supplier sourced",
      "Quality assurance checked",
      "Retail-ready packaging",
      "Distributed by Everon Global Trades LLC",
    ],
    imageSeed: id,
  };
};

export const products: Product[] = categories.flatMap((category) =>
  productNameSeeds[category.id].map((name, index) => buildProduct(category.id, index, name)),
);

export const getCategoryById = (id: string) => categories.find((category) => category.id === id);

export const getProductsByCategory = (categoryId: string) => products.filter((product) => product.categoryId === categoryId);

export const getProductBySlug = (slug: string) => products.find((product) => product.slug === slug);

export const getRelatedProducts = (product: Product, count = 4) =>
  products.filter((item) => item.categoryId === product.categoryId && item.id !== product.id).slice(0, count);

/** Maps a D1 `products_admin` row to storefront `Product` (cart, cards, checkout). */
function parseGalleryJson(raw: unknown): string[] {
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((x) => (typeof x === "string" ? x.trim() : "")).filter(Boolean).slice(0, 8);
  } catch {
    return [];
  }
}

export function productFromAdminRow(row: {
  id: string;
  slug?: string | null;
  name: string;
  category_id: string;
  price: number | string;
  inventory?: number | string | null;
  description?: string | null;
  image_url?: string | null;
  gallery_json?: string | null;
  rating?: number | string | null;
}): Product {
  const id = String(row.id);
  const slug = String(row.slug ?? id);
  const price = typeof row.price === "number" ? row.price : Number(row.price);
  const ratingRaw = row.rating == null ? 4.5 : typeof row.rating === "number" ? row.rating : Number(row.rating);
  const rating = Number.isFinite(ratingRaw) ? Math.min(5, Math.max(1, ratingRaw)) : 4.5;
  const inventory = row.inventory == null ? 0 : typeof row.inventory === "number" ? row.inventory : Number(row.inventory);
  const description =
    row.description?.trim() ||
    `${row.name} is offered through Everon Global Trades LLC with supplier-backed quality and dependable fulfillment.`;
  const gallery = parseGalleryJson(row.gallery_json);
  const primary = row.image_url?.trim() ? row.image_url.trim() : gallery[0];
  const restGallery = primary && gallery[0] === primary ? gallery.slice(1) : gallery;

  return {
    id,
    slug,
    categoryId: row.category_id,
    name: row.name,
    price: Number.isFinite(price) ? price : 0,
    rating,
    inStock: inventory > 0,
    description,
    specifications: [
      "Supplier-verified listing",
      "Quality-checked for retail readiness",
      "Shipped by Everon Global Trades LLC",
    ],
    imageSeed: slug,
    imageUrl: primary,
    imageUrls: restGallery.length ? restGallery : undefined,
    isLive: true,
    inventory: Number.isFinite(inventory) ? Math.max(0, Math.floor(inventory)) : 0,
  };
}
