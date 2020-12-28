'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
});

Route.resource('courses', 'CourseController').apiOnly().middleware(['authCookie','auth']);
Route.resource('categories', 'CategoryController').apiOnly().middleware(['authCookie','auth']);
Route.resource('users', 'UserController').apiOnly().middleware(['authCookie','auth']).except(['store']);
Route.resource('campuses', 'CampusController').apiOnly().middleware(['authCookie','auth']);
Route.resource('equipaments', 'EquipamentController').apiOnly().middleware(['authCookie','auth']);
Route.resource('places', 'PlaceController').apiOnly().middleware(['authCookie','auth']);
Route.resource('schedules', 'ScheduleController').apiOnly().middleware(['authCookie','auth']);
Route.get('/availability', 'AvailabilityController.index').middleware(['authCookie','auth']);
Route.get('/filter', 'FilterScheduleController.index').middleware(['authCookie','auth']);
Route.get('/reports', 'ReportController.index').middleware(['authCookie','auth']);
Route.get('/userLogged', 'UserLoggedController.index').middleware(['authCookie','auth']);
Route.get('/logout', 'SessionController.destroy').middleware(['authCookie','auth']);
Route.post('/sessions', 'SessionController.create');
Route.post('/users', 'UserController.store');
