# Endpoints
## Admin Session
- GET users              -> SELECT name, surname, email, created_at FROM users;
- PUT users              -> UPDATE users SET name, surname, email = $name, $surname, $email WHERE id = $id;
- DELETE users           -> DELETE FROM users WHERE id = $id;
- PUT consommations      -> UPDATE consommations SET user_id, name, calories, sugar, caffeine, quantity, barcode, place, note, when = $user_id, $name, $calories, $sugar, $caffeine, $quantity, $barcode, place, $note, $when WHERE id = $id;
- DELETE consommations   -> DELETE FROM consommations WHERE id = $id;

## User Session
- GET SELF consommations -> SELECT name, quantity, calories, sugar, caffeine, note, place, when, barcode FROM consommations WHERE user_id = $session_id;
- POST consommations     -> INSERT INTO consommations (user_id, name, calories, sugar, caffeine, quantity, barcode, place, note, when) VALUES ($session_id, $name, $calories, $sugar, $caffeine, $quantity, $barcode, $place, $note, $when);
- PUT SELF users         -> UPDATE users SET name, surname = $name, $surname WHERE id = $session_id;
- DELETE SELF users      -> DELETE FROM users WHERE id = $session_id;
- DELETE consommations if user_id = SELF -> DELETE FROM consommations WHERE id = $id;
- EDIT consommations if user_id = SELF -> UPDATE consommations SET name, calories, sugar, caffeine, quantity, barcode, place, note, when = $name, $calories, $sugar, $caffeine, $quantity, $barcode, place, $note, $when WHERE id = $id;

## Everyone
- GET consommations   -> SELECT name, quantity, calories, sugar, caffeine, note, place, when, barcode FROM consommations;
- LOGIN users         -> SELECT email, password FROM users WHERE email = $email;
- POST users          -> INSERT INTO users (email, password, name, surname) VALUES ($email, $hashedpassword, $name, $surname);

### Get spécifiques
- GET consommations   -> SELECT name, quantity, calories, sugar, caffeine, note, place, when FROM consommations WHERE date(created_at) = CURRENT_DATE;
- GET consommations   -> SELECT name, quantity, calories, sugar, caffeine, note, place, when FROM consommations WHERE created_at >= CURRENT_DATE AND created_at < CURRENT_DATE + INTERVAL 7 DAY;
- GET consommations   -> SELECT name, quantity, calories, sugar, caffeine, note, place, when FROM consommations WHERE created_at >= CURRENT_DATE AND created_at < CURRENT_DATE + INTERVAL 1 MONTH;
- GET consommations   -> SELECT name, quantity, calories, sugar, caffeine, note, place, when FROM consommations WHERE created_at >= CURRENT_DATE AND created_at < CURRENT_DATE + INTERVAL 6 MONTH;
- GET consommations   -> SELECT name, quantity, calories, sugar, caffeine, note, place, when FROM consommations WHERE created_at >= CURRENT_DATE AND created_at < CURRENT_DATE + INTERVAL 1 YEAR;
- GET consommations   -> SELECT sugar FROM consommations;
- GET consommations   -> SELECT caffeine FROM consommations;
- GET consommations   -> SELECT calories FROM consommations;
