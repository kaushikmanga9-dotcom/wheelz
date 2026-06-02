insert into public.cars (
  id, brand, model, variant, year, price, location, mileage, fuel, transmission,
  ownership, value_score, market_delta, added_label, body_type, color, source_platform, source_listing_url,
  dealer_name, insurance_valid, service_history, accident_history, image_urls, price_dropped,
  image_position, highlights, inspection
) values
(
  'honda-city-zx-cvt', 'Honda', 'City', 'ZX CVT', 2021, 1085000, 'Bengaluru', 29000,
  'Petrol', 'Automatic', '1st owner', 94, -72000, 'Today', 'Sedan', 'Silver',
  'Cars24', 'https://www.cars24.com/', 'Cars24 Whitefield Hub', true, 'full', 'none', '{}', true, '74% 64%', array['Dealer warranty', 'Full service history', 'No accident record'],
  '{"engine":97,"exterior":91,"tyres":88,"documents":100}'::jsonb
),
(
  'hyundai-i20-asta', 'Hyundai', 'i20', 'Asta', 2022, 840000, 'Pune', 18400,
  'Petrol', 'Manual', '1st owner', 91, -48000, 'Today', 'Hatchback', 'Black',
  'Spinny', 'https://www.spinny.com/', 'Spinny Pune', true, 'partial', 'none', '{}', false, '50% 64%', array['Low mileage', 'Premium audio', 'Fresh tyres'],
  '{"engine":94,"exterior":89,"tyres":93,"documents":100}'::jsonb
),
(
  'kia-seltos-htx', 'Kia', 'Seltos', 'HTX', 2020, 1295000, 'Hyderabad', 42600,
  'Diesel', 'Manual', '1st owner', 89, -61000, 'Yesterday', 'SUV', 'White',
  'Dealer Direct', 'https://www.cardekho.com/', 'Prime Auto Hyderabad', true, 'missing', 'minor', '{}', true, '35% 64%', array['Top inspected', 'New battery', 'Zero loan pending'],
  '{"engine":92,"exterior":86,"tyres":84,"documents":100}'::jsonb
),
(
  'skoda-slavia-tsi', 'Skoda', 'Slavia', '1.0 TSI Style', 2023, 1320000, 'Delhi NCR', 12900,
  'Petrol', 'Automatic', '1st owner', 88, -36000, '2 days ago', 'Sedan', 'Silver',
  'CarTrade', 'https://www.cartrade.com/', 'NCR Premium Cars', true, 'partial', 'none', '{}', false, '70% 64%', array['Under warranty', 'Low km', 'Ceramic coated'],
  '{"engine":96,"exterior":90,"tyres":89,"documents":100}'::jsonb
),
(
  'maruti-baleno-alpha', 'Maruti Suzuki', 'Baleno', 'Alpha', 2022, 715000, 'Mumbai', 21200,
  'Petrol', 'Manual', '1st owner', 86, -28000, '3 days ago', 'Hatchback', 'Black',
  'Cars24', 'https://www.cars24.com/', 'Cars24 Thane Hub', true, 'missing', 'none', '{}', true, '49% 64%', array['City driven', 'High resale', 'Verified owner'],
  '{"engine":91,"exterior":87,"tyres":82,"documents":99}'::jsonb
),
(
  'tata-nexon-xz-plus', 'Tata', 'Nexon', 'XZ Plus', 2021, 975000, 'Chennai', 33800,
  'Diesel', 'Manual', '2nd owner', 84, -21000, '4 days ago', 'SUV', 'White',
  'OLX Autos', 'https://www.olx.in/cars/', 'Chennai Certified Motors', true, 'partial', 'none', '{}', false, '34% 64%', array['5-star safety', 'Service package', 'Clean insurance'],
  '{"engine":88,"exterior":84,"tyres":86,"documents":98}'::jsonb
)
on conflict (id) do update set
  brand = excluded.brand,
  model = excluded.model,
  variant = excluded.variant,
  year = excluded.year,
  price = excluded.price,
  location = excluded.location,
  mileage = excluded.mileage,
  fuel = excluded.fuel,
  transmission = excluded.transmission,
  ownership = excluded.ownership,
  value_score = excluded.value_score,
  market_delta = excluded.market_delta,
  added_label = excluded.added_label,
  body_type = excluded.body_type,
  color = excluded.color,
  source_platform = excluded.source_platform,
  source_listing_url = excluded.source_listing_url,
  dealer_name = excluded.dealer_name,
  insurance_valid = excluded.insurance_valid,
  service_history = excluded.service_history,
  accident_history = excluded.accident_history,
  image_urls = excluded.image_urls,
  price_dropped = excluded.price_dropped,
  image_position = excluded.image_position,
  highlights = excluded.highlights,
  inspection = excluded.inspection;
