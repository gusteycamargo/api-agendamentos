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

Route.resource('courses', 'CourseController').apiOnly().middleware('auth');
Route.resource('categories', 'CategoryController').apiOnly().middleware('auth');
Route.resource('users', 'UserController').apiOnly().middleware('auth');
Route.resource('campuses', 'CampusController').apiOnly().middleware('auth');
Route.resource('equipaments', 'EquipamentController').apiOnly().middleware('auth');
Route.resource('places', 'PlaceController').apiOnly().middleware('auth');
Route.resource('schedules', 'ScheduleController').apiOnly().middleware('auth');

Route.post('/users/restore/:id', 'UserController.restore').middleware('auth');
Route.post('/campuses/restore/:id', 'CampusController.restore').middleware('auth');
Route.post('/categories/restore/:id', 'CategoryController.restore').middleware('auth');
Route.post('/courses/restore/:id', 'CourseController.restore').middleware('auth');
Route.post('/equipaments/restore/:id', 'EquipamentController.restore').middleware('auth');

Route.get('/availability', 'AvailabilityController.index').middleware('auth');
Route.get('/filter', 'FilterScheduleController.index').middleware('auth');
Route.get('/reports', 'ReportController.index').middleware('auth');
Route.get('/userLogged', 'UserLoggedController.index').middleware('auth');
Route.post('/sessions', 'SessionController.create');
