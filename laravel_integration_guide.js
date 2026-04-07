
/*
 * ======================================================================================
 * LARAVEL INTEGRATION GUIDE (BACKEND READY)
 * ======================================================================================
 * This frontend is designed to be easily connected to a Laravel Backend.
 * 
 * 1. API Configuration:
 *    - In `app.js`, `setApiBase('/api')` is already configured.
 *    - Ensure your Laravel `api.php` routes match the endpoints in `App.api` (e.g., `/employees`, `/tasks`).
 * 
 * 2. Authentication:
 *    - The `login` function currently uses LocalStorage.
 *    - To integrate: Replace `login` to call `POST /api/login` (Sanctum/Passport).
 *    - Store the returned token: `localStorage.setItem('token', response.token)`.
 *    - Add `Authorization: Bearer <token>` to `req()` function headers in `app.js`.
 * 
 * 3. Database Sync (Tasks):
 *    - The `App.store` object currently mocks a database using LocalStorage.
 *    - To switch to Real Database:
 *      - Modify `App.store.list('tasks')` to `await App.api.tasks.list()`.
 *      - Modify `App.store.create('tasks', data)` to `await App.api.tasks.create(data)`.
 *      - Ensure `tasks` table in MySQL has columns: `title`, `description`, `assignee`, `priority`, `due`, `status`.
 * 
 * 4. File Uploads:
 *    - `App.api.attachments.upload` is ready for `multipart/form-data`.
 *    - Laravel Controller: `request()->file('file')->store('uploads');`
 * 
 * Status: FRONTEND READY FOR PRODUCTION INTEGRATION.
 * ======================================================================================
 */
