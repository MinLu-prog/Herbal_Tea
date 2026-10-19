-- Mya Nyo Herbal Tea demo catalog.
-- Safe to run repeatedly: existing products with these names are not duplicated.

INSERT INTO categories (name_en, name_mm, sort_order)
SELECT 'Herbal Tea', 'ဆေးဖက်ဝင်လက်ဖက်ရည်', 1
WHERE NOT EXISTS (
  SELECT 1 FROM categories WHERE name_en = 'Herbal Tea'
);

INSERT INTO categories (name_en, name_mm, sort_order)
SELECT 'Green Tea', 'လက်ဖက်စိမ်း', 2
WHERE NOT EXISTS (
  SELECT 1 FROM categories WHERE name_en = 'Green Tea'
);

INSERT INTO categories (name_en, name_mm, sort_order)
SELECT 'Tea Bags', 'လက်ဖက်ရည်အိတ်', 3
WHERE NOT EXISTS (
  SELECT 1 FROM categories WHERE name_en = 'Tea Bags'
);

INSERT INTO products (
  category_id,
  name_en,
  name_mm,
  flavor_en,
  flavor_mm,
  description_en,
  description_mm,
  size,
  price,
  in_stock,
  is_active,
  image_url
)
SELECT
  (SELECT id FROM categories WHERE name_en = 'Herbal Tea' ORDER BY id LIMIT 1),
  'Mya Nyo Herbal Tea',
  'မြညို ဆေးဖက်ဝင်လက်ဖက်ရည်',
  'Earthy and aromatic',
  'မွှေးပျံ့သော သဘာဝအရသာ',
  'A comforting blend of dried herbs for a calm daily tea ritual.',
  'နေ့စဉ် စိတ်အေးချမ်းစွာ သောက်သုံးနိုင်သော ဆေးဖက်ဝင်အပင်များ ရောစပ်ထားသည့် လက်ဖက်ရည်။',
  '100 g',
  8000,
  1,
  1,
  '/product/product1.jpg'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name_en = 'Mya Nyo Herbal Tea'
);

INSERT INTO products (
  category_id,
  name_en,
  name_mm,
  flavor_en,
  flavor_mm,
  description_en,
  description_mm,
  size,
  price,
  in_stock,
  is_active,
  image_url
)
SELECT
  (SELECT id FROM categories WHERE name_en = 'Herbal Tea' ORDER BY id LIMIT 1),
  'Classic Herbal Leaf Blend',
  'ရိုးရာဆေးဖက်ဝင်အရွက်ရောစပ်မှု',
  'Fresh and naturally sweet',
  'လတ်ဆတ်ပြီး သဘာဝချိုမြိန်သောအရသာ',
  'A fragrant leaf blend made for a refreshing afternoon cup.',
  'နေ့လည်ခင်းတွင် လန်းဆန်းစွာ သောက်သုံးရန် မွှေးပျံ့သော အရွက်ရောစပ်မှု။',
  '150 g',
  9500,
  1,
  1,
  '/product/product2.jpg'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name_en = 'Classic Herbal Leaf Blend'
);

INSERT INTO products (
  category_id,
  name_en,
  name_mm,
  flavor_en,
  flavor_mm,
  description_en,
  description_mm,
  size,
  price,
  in_stock,
  is_active,
  image_url
)
SELECT
  (SELECT id FROM categories WHERE name_en = 'Green Tea' ORDER BY id LIMIT 1),
  'Mountain Green Tea',
  'တောင်ပေါ်လက်ဖက်စိမ်း',
  'Bright and lightly toasted',
  'လန်းဆန်းပြီး နူးညံ့သောအရသာ',
  'Green tea inspired by peaceful mountain gardens and slow mornings.',
  'တောင်ပေါ်လက်ဖက်ခင်းများ၏ အေးချမ်းမှုကို ခံစားရစေသော လက်ဖက်စိမ်း။',
  '120 g',
  10000,
  1,
  1,
  '/product/product3.jpg'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name_en = 'Mountain Green Tea'
);

INSERT INTO products (
  category_id,
  name_en,
  name_mm,
  flavor_en,
  flavor_mm,
  description_en,
  description_mm,
  size,
  price,
  in_stock,
  is_active,
  image_url
)
SELECT
  (SELECT id FROM categories WHERE name_en = 'Tea Bags' ORDER BY id LIMIT 1),
  'Family Tea Collection',
  'မိသားစုသောက် လက်ဖက်ရည်အစုံ',
  'Warm and balanced',
  'နွေးထွေးပြီး ညီမျှသောအရသာ',
  'A convenient selection of tea for sharing with family and friends.',
  'မိသားစုနှင့် သူငယ်ချင်းများအတူ မျှဝေသောက်သုံးရန် အဆင်ပြေသော လက်ဖက်ရည်အစုံ။',
  '20 bags',
  12000,
  1,
  1,
  '/product/product4.jpg'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name_en = 'Family Tea Collection'
);

INSERT INTO products (
  category_id,
  name_en,
  name_mm,
  flavor_en,
  flavor_mm,
  description_en,
  description_mm,
  size,
  price,
  in_stock,
  is_active,
  image_url
)
SELECT
  (SELECT id FROM categories WHERE name_en = 'Herbal Tea' ORDER BY id LIMIT 1),
  'Blue Flower Wellness Tea',
  'အပြာရောင်ပန်း လက်ဖက်ရည်',
  'Floral and mellow',
  'ပန်းရနံ့မွှေးပြီး နူးညံ့သောအရသာ',
  'A beautiful floral tea for a gentle, relaxing break.',
  'နူးညံ့စွာ အနားယူချိန်တွင် သောက်သုံးရန် သင့်တော်သော ပန်းရနံ့လက်ဖက်ရည်။',
  '80 g',
  11000,
  1,
  1,
  '/product/product5.jpg'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name_en = 'Blue Flower Wellness Tea'
);
