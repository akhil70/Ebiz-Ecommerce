import urllib.request
import json
import time

def post_json(url, data, token=None):
    req = urllib.request.Request(url, method='POST')
    req.add_header('Content-Type', 'application/json')
    if token:
        req.add_header('Authorization', f'Bearer {token}')
    
    jsondata = json.dumps(data).encode('utf-8')
    req.add_header('Content-Length', len(jsondata))
    
    try:
        with urllib.request.urlopen(req, data=jsondata) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.read().decode('utf-8')}")
        raise e

# 1. Login Admin
print("Logging in as admin...")
admin_auth = post_json('http://localhost:9000/api/auth/login', {
    'username': 'admin',
    'password': 'admin'
})
admin_token = admin_auth['access_token']
print("Admin logged in successfully.")

# 2. Login Seller
print("Logging in as seller (shafeelunoffl@gmail.com)...")
seller_auth = post_json('http://localhost:9000/api/auth/login', {
    'username': 'shafeelunoffl@gmail.com',
    'password': '12345678'
})
seller_token = seller_auth['access_token']
print("Seller logged in successfully.")

# 3. Create Brands
brands_data = [
    {"name": "Apex Innovations", "slug": "apex-innovations", "description": "Cutting edge technology and smart gadgets", "status": 1},
    {"name": "Vogue Styles", "slug": "vogue-styles", "description": "Trendy and comfortable clothing", "status": 1},
    {"name": "Stride Footwear", "slug": "stride-footwear", "description": "Premium footwear for active lifestyles", "status": 1},
    {"name": "Chef's Choice", "slug": "chefs-choice", "description": "High-quality kitchen utensils and tools", "status": 1},
    {"name": "Cozy Home", "slug": "cozy-home", "description": "Elegant organizers and home styling decor", "status": 1}
]

brand_ids = {}
print("\nCreating brands...")
for brand in brands_data:
    created = post_json('http://localhost:9000/api/admin/brands', brand, admin_token)
    brand_ids[brand['name']] = created['id']
    print(f"Created brand: {brand['name']} -> ID: {created['id']}")

# 4. Create Categories
categories_data = [
    {"name": "Innovations", "slug": "innovations", "description": "Smart gadgets and technology", "status": 1},
    {"name": "Clothing & Apparel", "slug": "clothing-apparel", "description": "Fashionable dresses and apparel", "status": 1},
    {"name": "Footwear", "slug": "footwear", "description": "Shoes for all walks of life", "status": 1},
    {"name": "Kitchenware", "slug": "kitchenware", "description": "Kitchen utensils and cookware", "status": 1},
    {"name": "Home Decor", "slug": "home-decor", "description": "Lamps, baskets and organization items", "status": 1}
]

category_ids = {}
print("\nCreating categories...")
for cat in categories_data:
    created = post_json('http://localhost:9000/api/admin/categories', cat, admin_token)
    category_ids[cat['name']] = created['id']
    print(f"Created category: {cat['name']} -> ID: {created['id']}")

# 5. Create Subcategories
subcategories_data = [
    # Innovations
    {"categoryId": "Innovations", "name": "Smart Home Devices", "slug": "smart-home", "status": 1},
    {"categoryId": "Innovations", "name": "Innovative Gadgets", "slug": "innovative-gadgets", "status": 1},
    # Clothing & Apparel
    {"categoryId": "Clothing & Apparel", "name": "Women's Dresses", "slug": "womens-dresses", "status": 1},
    {"categoryId": "Clothing & Apparel", "name": "Kids Section", "slug": "kids-section", "status": 1},
    {"categoryId": "Clothing & Apparel", "name": "Men's Wear", "slug": "mens-wear", "status": 1},
    # Footwear
    {"categoryId": "Footwear", "name": "Sports Shoes", "slug": "sports-shoes", "status": 1},
    {"categoryId": "Footwear", "name": "Sneakers & Casuals", "slug": "sneakers-casuals", "status": 1},
    # Kitchenware
    {"categoryId": "Kitchenware", "name": "Cooking Utensils", "slug": "cooking-utensils", "status": 1},
    {"categoryId": "Kitchenware", "name": "Tableware", "slug": "tableware", "status": 1},
    # Home Decor
    {"categoryId": "Home Decor", "name": "Home Lighting", "slug": "home-lighting", "status": 1},
    {"categoryId": "Home Decor", "name": "Storage & Organizers", "slug": "storage-organizers", "status": 1}
]

subcategory_ids = {}
print("\nCreating subcategories...")
for sub in subcategories_data:
    # Map text category name to DB ID
    sub['categoryId'] = category_ids[sub['categoryId']]
    created = post_json('http://localhost:9000/api/admin/subcategories', sub, admin_token)
    subcategory_ids[sub['name']] = created['id']
    print(f"Created subcategory: {sub['name']} -> ID: {created['id']}")

# 6. Create Products
products_raw = [
    # Smart Home Devices
    {
        "name": "Apex Smart Speaker Mini",
        "description": "Voice-controlled smart assistant with rich 360-degree sound. Connects with home devices.",
        "price": 49.99,
        "brand": "Apex Innovations",
        "cat": "Innovations",
        "sub": "Smart Home Devices",
        "thumbnail": "https://images.unsplash.com/photo-1543512214-318c7553f230?w=500",
        "stock": 120, "sku": "APX-SPK-MINI"
    },
    {
        "name": "Smart Thermostat Pro",
        "description": "Save energy with auto-scheduling temperature adjustments and remote control via app.",
        "price": 149.99,
        "brand": "Apex Innovations",
        "cat": "Innovations",
        "sub": "Smart Home Devices",
        "thumbnail": "https://images.unsplash.com/photo-1558002038-1055907df827?w=500",
        "stock": 80, "sku": "APX-THM-PRO"
    },
    {
        "name": "Apex Smart Plugs (4-Pack)",
        "description": "Convert regular outlets to smart plugs. Compatible with Alexa and Google Home.",
        "price": 29.99,
        "brand": "Apex Innovations",
        "cat": "Innovations",
        "sub": "Smart Home Devices",
        "thumbnail": "https://images.unsplash.com/photo-1558002038-1055907df827?w=500",
        "stock": 200, "sku": "APX-PLG-4PK"
    },
    {
        "name": "Smart Door Lock Keyless Entry",
        "description": "Unlock with secure biometric fingerprint, numeric passcode, or via app remote control.",
        "price": 189.99,
        "brand": "Apex Innovations",
        "cat": "Innovations",
        "sub": "Smart Home Devices",
        "thumbnail": "https://images.unsplash.com/photo-1558002038-1055907df827?w=500",
        "stock": 45, "sku": "APX-LCK-KEY"
    },
    {
        "name": "Home Security Camera 2K",
        "description": "Indoor security camera with night vision, motion tracking, and instant alerts.",
        "price": 39.99,
        "brand": "Apex Innovations",
        "cat": "Innovations",
        "sub": "Smart Home Devices",
        "thumbnail": "https://images.unsplash.com/photo-1558002038-1055907df827?w=500",
        "stock": 150, "sku": "APX-CAM-2K"
    },
    # Innovative Gadgets
    {
        "name": "Apex Smartwatch Fit-X",
        "description": "Premium health tracking smartwatch with heart rate, blood oxygen monitor, and active workout tracking.",
        "price": 99.99,
        "brand": "Apex Innovations",
        "cat": "Innovations",
        "sub": "Innovative Gadgets",
        "thumbnail": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        "stock": 70, "sku": "APX-WTC-FITX"
    },
    {
        "name": "Magnetic Wireless Charging Pad",
        "description": "Sleek aluminum base fast-charging pad. MagSafe compatible for smartphones.",
        "price": 19.99,
        "brand": "Apex Innovations",
        "cat": "Innovations",
        "sub": "Innovative Gadgets",
        "thumbnail": "https://images.unsplash.com/photo-1622445262465-248197576550?w=500",
        "stock": 300, "sku": "APX-WLS-MAG"
    },
    {
        "name": "Apex Paperwhite E-Reader",
        "description": "Glare-free screen with adjustable warm light. Battery lasts up to 10 weeks.",
        "price": 129.99,
        "brand": "Apex Innovations",
        "cat": "Innovations",
        "sub": "Innovative Gadgets",
        "thumbnail": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500",
        "stock": 90, "sku": "APX-ERD-PWT"
    },
    {
        "name": "Anti-Gravity Floating Speaker",
        "description": "Stunning design floating speaker with Bluetooth connectivity and LED light ring.",
        "price": 89.99,
        "brand": "Apex Innovations",
        "cat": "Innovations",
        "sub": "Innovative Gadgets",
        "thumbnail": "https://images.unsplash.com/photo-1543512214-318c7553f230?w=500",
        "stock": 35, "sku": "APX-FLT-SPK"
    },
    {
        "name": "Apex Smart Notebook",
        "description": "Reusable smart notebook. Scan hand-written notes straight to cloud services.",
        "price": 24.99,
        "brand": "Apex Innovations",
        "cat": "Innovations",
        "sub": "Innovative Gadgets",
        "thumbnail": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500",
        "stock": 110, "sku": "APX-NTB-SMT"
    },
    # Women's Dresses
    {
        "name": "Vogue Floral Summer Dress",
        "description": "Lightweight, breathable floral design cotton dress. Perfect for sunny days and weekend outings.",
        "price": 34.99,
        "brand": "Vogue Styles",
        "cat": "Clothing & Apparel",
        "sub": "Women's Dresses",
        "thumbnail": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
        "stock": 60, "sku": "VOG-DRS-FLR"
    },
    {
        "name": "Vogue Classic Evening Gown",
        "description": "Elegant silk evening gown with an open back style. Tailored fit for cocktail parties.",
        "price": 119.99,
        "brand": "Vogue Styles",
        "cat": "Clothing & Apparel",
        "sub": "Women's Dresses",
        "thumbnail": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500",
        "stock": 25, "sku": "VOG-GWN-EVE"
    },
    {
        "name": "Vogue Slim-Fit Blazer",
        "description": "Professional women's blazer jacket. Modern office-wear cut in premium blend fabrics.",
        "price": 69.99,
        "brand": "Vogue Styles",
        "cat": "Clothing & Apparel",
        "sub": "Women's Dresses",
        "thumbnail": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500",
        "stock": 40, "sku": "VOG-BLZ-SLM"
    },
    {
        "name": "Bohemian Maxi Casual Dress",
        "description": "Boho chic maxi dress with adjustable straps and comfortable relaxed silhouette.",
        "price": 45.99,
        "brand": "Vogue Styles",
        "cat": "Clothing & Apparel",
        "sub": "Women's Dresses",
        "thumbnail": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
        "stock": 55, "sku": "VOG-DRS-BOH"
    },
    {
        "name": "Vogue Wool Trench Coat",
        "description": "Classic double-breasted winter trench coat. Warm lining and sophisticated design.",
        "price": 149.99,
        "brand": "Vogue Styles",
        "cat": "Clothing & Apparel",
        "sub": "Women's Dresses",
        "thumbnail": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500",
        "stock": 15, "sku": "VOG-COT-TRN"
    },
    # Kids Section
    {
        "name": "Vogue Kids Denim Overalls",
        "description": "Durable and stretchy denim overalls for kids. Ideal for active playtime and styling.",
        "price": 29.99,
        "brand": "Vogue Styles",
        "cat": "Clothing & Apparel",
        "sub": "Kids Section",
        "thumbnail": "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500",
        "stock": 80, "sku": "VOG-KID-OVR"
    },
    {
        "name": "Toddler Cotton Romper Set",
        "description": "Pack of 3 premium cotton rompers for infants. Extremely soft on baby's skin.",
        "price": 19.99,
        "brand": "Vogue Styles",
        "cat": "Clothing & Apparel",
        "sub": "Kids Section",
        "thumbnail": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500",
        "stock": 120, "sku": "VOG-KID-RMP"
    },
    {
        "name": "Kids Waterproof Winter Jacket",
        "description": "Windproof and heavily insulated kids winter coat. Keeps children warm in extreme cold.",
        "price": 49.99,
        "brand": "Vogue Styles",
        "cat": "Clothing & Apparel",
        "sub": "Kids Section",
        "thumbnail": "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500",
        "stock": 30, "sku": "VOG-KID-WJK"
    },
    {
        "name": "Cute Animal Face Hoodie",
        "description": "Fleece kids hoodie featuring playful animal ear details on the hood.",
        "price": 24.99,
        "brand": "Vogue Styles",
        "cat": "Clothing & Apparel",
        "sub": "Kids Section",
        "thumbnail": "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500",
        "stock": 65, "sku": "VOG-KID-HDD"
    },
    {
        "name": "Kids Organic Pajama Set",
        "description": "Super comfy nightwear set made from certified organic cotton.",
        "price": 22.99,
        "brand": "Vogue Styles",
        "cat": "Clothing & Apparel",
        "sub": "Kids Section",
        "thumbnail": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500",
        "stock": 100, "sku": "VOG-KID-PJM"
    },
    # Men's Wear
    {
        "name": "Vogue Premium Oxford Shirt",
        "description": "Classic button-down Oxford cotton shirt for men. Smart casual tailored look.",
        "price": 39.99,
        "brand": "Vogue Styles",
        "cat": "Clothing & Apparel",
        "sub": "Men's Wear",
        "thumbnail": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
        "stock": 90, "sku": "VOG-MEN-OXF"
    },
    {
        "name": "Classic Denim Trucker Jacket",
        "description": "Heavyweight indigo denim jacket. Metal buttons and vintage washed detailing.",
        "price": 59.99,
        "brand": "Vogue Styles",
        "cat": "Clothing & Apparel",
        "sub": "Men's Wear",
        "thumbnail": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500",
        "stock": 50, "sku": "VOG-MEN-DNM"
    },
    {
        "name": "Men's Everyday Fleece Hoodie",
        "description": "Heavy fabric cotton blend fleece hoodie. Great for layering and daily wear.",
        "price": 32.99,
        "brand": "Vogue Styles",
        "cat": "Clothing & Apparel",
        "sub": "Men's Wear",
        "thumbnail": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        "stock": 110, "sku": "VOG-MEN-HDD"
    },
    {
        "name": "Vogue Slim Fit Chinos",
        "description": "Stretch twill cotton chinos. Perfect balance of comfort and corporate style.",
        "price": 45.99,
        "brand": "Vogue Styles",
        "cat": "Clothing & Apparel",
        "sub": "Men's Wear",
        "thumbnail": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
        "stock": 85, "sku": "VOG-MEN-CHN"
    },
    {
        "name": "Merino Wool Crewneck Sweater",
        "description": "Ultra-soft and lightweight crewneck knit sweater. Breathable merino wool fibers.",
        "price": 79.99,
        "brand": "Vogue Styles",
        "cat": "Clothing & Apparel",
        "sub": "Men's Wear",
        "thumbnail": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        "stock": 35, "sku": "VOG-MEN-SWT"
    },
    # Sports Shoes
    {
        "name": "Stride Runner Pro-1",
        "description": "Ultra-lightweight running shoes with dynamic cushion midsoles. Engineered mesh upper.",
        "price": 89.99,
        "brand": "Stride Footwear",
        "cat": "Footwear",
        "sub": "Sports Shoes",
        "thumbnail": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        "stock": 70, "sku": "STR-RUN-PR1"
    },
    {
        "name": "Stride Cross-Trainers X",
        "description": "Reinforced heel support training shoes for weight lifting and high-intensity workouts.",
        "price": 95.99,
        "brand": "Stride Footwear",
        "cat": "Footwear",
        "sub": "Sports Shoes",
        "thumbnail": "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500",
        "stock": 45, "sku": "STR-TRN-XTN"
    },
    {
        "name": "Stride Trail Running Shoes",
        "description": "All-terrain rugged outsoles trail runners. Water-resistant protective upper shell.",
        "price": 105.99,
        "brand": "Stride Footwear",
        "cat": "Footwear",
        "sub": "Sports Shoes",
        "thumbnail": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        "stock": 40, "sku": "STR-TRL-SHW"
    },
    {
        "name": "Pro-Court Tennis Shoes",
        "description": "Excellent grip court shoes with non-marking rubber outsoles and toe bumpers.",
        "price": 79.99,
        "brand": "Stride Footwear",
        "cat": "Footwear",
        "sub": "Sports Shoes",
        "thumbnail": "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500",
        "stock": 60, "sku": "STR-CRT-TNS"
    },
    {
        "name": "Stride Breathable Walkers",
        "description": "Comfort walking shoes featuring memory foam insoles for premium daily walking support.",
        "price": 69.99,
        "brand": "Stride Footwear",
        "cat": "Footwear",
        "sub": "Sports Shoes",
        "thumbnail": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        "stock": 95, "sku": "STR-WLK-BRT"
    },
    # Sneakers & Casuals
    {
        "name": "Classic White Leather Sneakers",
        "description": "Timeless clean profile white sneakers in genuine calfskin leather. Fits any outfit.",
        "price": 74.99,
        "brand": "Stride Footwear",
        "cat": "Footwear",
        "sub": "Sneakers & Casuals",
        "thumbnail": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
        "stock": 100, "sku": "STR-SNK-WHT"
    },
    {
        "name": "Stride Suede Loafers",
        "description": "Handcrafted premium suede slip-on loafers. Superb flexibility and cushioned footbeds.",
        "price": 85.00,
        "brand": "Stride Footwear",
        "cat": "Footwear",
        "sub": "Sneakers & Casuals",
        "thumbnail": "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500",
        "stock": 35, "sku": "STR-LOF-SUD"
    },
    {
        "name": "Retro High-Top Sneakers",
        "description": "Classic canvas construction high-tops with rubber toe guards and vintage styling.",
        "price": 49.99,
        "brand": "Stride Footwear",
        "cat": "Footwear",
        "sub": "Sneakers & Casuals",
        "thumbnail": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
        "stock": 120, "sku": "STR-SNK-HTP"
    },
    {
        "name": "Urban Canvas Slip-ons",
        "description": "Minimalist canvas slip-on shoes. Extremely lightweight, breathable, and machine washable.",
        "price": 39.99,
        "brand": "Stride Footwear",
        "cat": "Footwear",
        "sub": "Sneakers & Casuals",
        "thumbnail": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
        "stock": 150, "sku": "STR-SLP-CNV"
    },
    {
        "name": "Stride Chelsea Suede Boots",
        "description": "Fashionable elastic side panel Chelsea boots. Premium suede leather with crepe rubber soles.",
        "price": 120.00,
        "brand": "Stride Footwear",
        "cat": "Footwear",
        "sub": "Sneakers & Casuals",
        "thumbnail": "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500",
        "stock": 20, "sku": "STR-BTE-CHL"
    },
    # Cooking Utensils
    {
        "name": "Pre-Seasoned Cast Iron Skillet",
        "description": "10.25-inch heavy duty pre-seasoned skillet. Superior heat retention and even heat distribution.",
        "price": 24.99,
        "brand": "Chef's Choice",
        "cat": "Kitchenware",
        "sub": "Cooking Utensils",
        "thumbnail": "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500",
        "stock": 90, "sku": "CHF-SKL-IRN"
    },
    {
        "name": "Classic Stainless Steel Knife Block Set",
        "description": "14-piece professional high-carbon stainless steel knife block set with kitchen shears.",
        "price": 79.99,
        "brand": "Chef's Choice",
        "cat": "Kitchenware",
        "sub": "Cooking Utensils",
        "thumbnail": "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500",
        "stock": 35, "sku": "CHF-KNF-BLK"
    },
    {
        "name": "Silicone Kitchen Utensils (10-Piece)",
        "description": "Heat-resistant silicone utensils with natural wooden handles. Scratch-free for nonstick pans.",
        "price": 29.99,
        "brand": "Chef's Choice",
        "cat": "Kitchenware",
        "sub": "Cooking Utensils",
        "thumbnail": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500",
        "stock": 130, "sku": "CHF-UTN-SIL"
    },
    {
        "name": "Premium Stainless Steel Stock Pot",
        "description": "8-quart professional stock pot with tempered glass lid and ergonomic riveted handles.",
        "price": 45.99,
        "brand": "Chef's Choice",
        "cat": "Kitchenware",
        "sub": "Cooking Utensils",
        "thumbnail": "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500",
        "stock": 60, "sku": "CHF-POT-SST"
    },
    {
        "name": "Chef's Nonstick Frying Pan Set",
        "description": "Set of 2 nonstick frying pans (8-inch and 10-inch). PFOA-free durable nonstick coating.",
        "price": 34.99,
        "brand": "Chef's Choice",
        "cat": "Kitchenware",
        "sub": "Cooking Utensils",
        "thumbnail": "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500",
        "stock": 80, "sku": "CHF-PAN-NST"
    },
    # Tableware
    {
        "name": "Handcrafted Matte Ceramic Plate Set",
        "description": "Set of 4 minimal ceramic dinner plates with organic rim shapes and raw textures.",
        "price": 39.99,
        "brand": "Chef's Choice",
        "cat": "Kitchenware",
        "sub": "Tableware",
        "thumbnail": "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500",
        "stock": 45, "sku": "CHF-PLT-CRM"
    },
    {
        "name": "Elegant Glass Drink Carafe",
        "description": "Minimalist hand-blown glass carafe with sphere cork lid. Holds 1.2 liters.",
        "price": 18.99,
        "brand": "Chef's Choice",
        "cat": "Kitchenware",
        "sub": "Tableware",
        "thumbnail": "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=500",
        "stock": 70, "sku": "CHF-CRF-GLS"
    },
    {
        "name": "Modern Matte Flatware Set",
        "description": "20-piece stainless steel flatware cutlery service for 4, finished in premium matte black.",
        "price": 49.99,
        "brand": "Chef's Choice",
        "cat": "Kitchenware",
        "sub": "Tableware",
        "thumbnail": "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500",
        "stock": 50, "sku": "CHF-FLT-BLK"
    },
    {
        "name": "Stoneware Dinnerware Set (16-Piece)",
        "description": "Complete service for 4, including dinner plates, salad plates, bowls, and mugs in earth tones.",
        "price": 89.99,
        "brand": "Chef's Choice",
        "cat": "Kitchenware",
        "sub": "Tableware",
        "thumbnail": "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500",
        "stock": 25, "sku": "CHF-DIN-STN"
    },
    {
        "name": "Hand-Cut Crystal Wine Glasses",
        "description": "Set of 4 elegant crystal stemware wine glasses. Perfect clarity and balance.",
        "price": 42.99,
        "brand": "Chef's Choice",
        "cat": "Kitchenware",
        "sub": "Tableware",
        "thumbnail": "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=500",
        "stock": 40, "sku": "CHF-GLS-WNE"
    },
    # Home Lighting
    {
        "name": "Cozy Home Minimalist Desk Lamp",
        "description": "Modern Scandinavian style desk lamp with natural wood base and adjustable fabric shade.",
        "price": 34.99,
        "brand": "Cozy Home",
        "cat": "Home Decor",
        "sub": "Home Lighting",
        "thumbnail": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
        "stock": 60, "sku": "COZ-LMP-DSK"
    },
    {
        "name": "Industrial Glass Pendant Light",
        "description": "Hanging pendant light fixture with clear glass globe shade and vintage brass socket.",
        "price": 59.99,
        "brand": "Cozy Home",
        "cat": "Home Decor",
        "sub": "Home Lighting",
        "thumbnail": "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500",
        "stock": 30, "sku": "COZ-LMP-PND"
    },
    {
        "name": "Smart LED Dimmable Floor Lamp",
        "description": "Sleek black metal tall floor lamp with remote control and color temperature adjustment.",
        "price": 69.99,
        "brand": "Cozy Home",
        "cat": "Home Decor",
        "sub": "Home Lighting",
        "thumbnail": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
        "stock": 45, "sku": "COZ-LMP-FLR"
    },
    # Storage & Organizers
    {
        "name": "Cozy Home Woven Seagrass Basket",
        "description": "Eco-friendly handmade woven storage basket with carry handles. Great for blankets or plants.",
        "price": 22.99,
        "brand": "Cozy Home",
        "cat": "Home Decor",
        "sub": "Storage & Organizers",
        "thumbnail": "https://images.unsplash.com/photo-1531835551805-16d864c8d311?w=500",
        "stock": 110, "sku": "COZ-ORG-BKT"
    },
    {
        "name": "Bamboo Expandable Drawer Organizer",
        "description": "Eco-bamboo adjustable utensil drawer divider. Fits most standard drawer sizes.",
        "price": 19.99,
        "brand": "Cozy Home",
        "cat": "Home Decor",
        "sub": "Storage & Organizers",
        "thumbnail": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500",
        "stock": 80, "sku": "COZ-ORG-DRW"
    },
    {
        "name": "Cozy Home Stackable Storage Boxes (3-Pack)",
        "description": "Linen fabric folding storage bins with clear windows and magnetic flip-open lids.",
        "price": 27.99,
        "brand": "Cozy Home",
        "cat": "Home Decor",
        "sub": "Storage & Organizers",
        "thumbnail": "https://images.unsplash.com/photo-1531835551805-16d864c8d311?w=500",
        "stock": 95, "sku": "COZ-ORG-STK"
    }
]

print(f"\nAdding {len(products_raw)} products to backend...")
for idx, p in enumerate(products_raw):
    # Retrieve DB IDs
    b_id = brand_ids[p['brand']]
    c_id = category_ids[p['cat']]
    s_id = subcategory_ids[p['sub']]
    
    product_payload = {
        "name": p['name'],
        "description": p['description'],
        "price": p['price'],
        "discountPrice": None,
        "brandId": b_id,
        "categoryId": c_id,
        "subcategoryId": s_id,
        "stock": p['stock'],
        "sku": p['sku'],
        "thumbnail": p['thumbnail'],
        "images": [p['thumbnail']],
        "isFeatured": True if idx % 5 == 0 else False,
        "isNewArrival": True if idx % 4 == 0 else False,
        "status": 1
    }
    
    created = post_json('http://localhost:9000/api/v1/seller/products', product_payload, seller_token)
    print(f"[{idx+1}/50] Created product: {p['name']} -> ID: {created['id']}")
    # Sleep slightly to prevent flooding
    time.sleep(0.1)

print("\nDatabase populated successfully with realistic premium test data!")
