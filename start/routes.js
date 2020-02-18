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
Route.resource('/schedules', 'ScheduleController').apiOnly().middleware('auth');
Route.post('/sessions', 'SessionController.create');
Route.get('/teste', 'AvailabilityController.index');