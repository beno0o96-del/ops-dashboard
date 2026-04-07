# GitHub Upload Checklist

## 1) Clean staging scope

Use backend as the deployable source:

```bash
git add backend
git reset
git add backend/app backend/bootstrap backend/config backend/database backend/public backend/resources backend/routes backend/tests backend/artisan backend/composer.json backend/composer.lock backend/package.json backend/package-lock.json backend/phpunit.xml backend/vite.config.js backend/.env.example backend/.gitignore backend/README.md
```

## 2) Verify excluded files

Do not include:

- `.env`
- `vendor/`
- `node_modules/`
- `public/build/`
- `old projct/`
- `public_backup_*`
- IDE folders and local scripts

## 3) Validation before commit

```bash
cd backend
php artisan test
npm run build
```

## 4) Commit and push

```bash
git commit -m "Prepare clean GitHub upload"
git push origin <branch-name>
```

## 5) Fresh clone smoke test

```bash
cp .env.example .env
composer install
npm install
php artisan key:generate
php artisan migrate
php artisan serve
```
