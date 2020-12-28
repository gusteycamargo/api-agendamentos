'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class AuthCookie {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request }, next) {
    if(request.cookie('token')) {
      request.request.headers['authorization'] = `Bearer ${request.cookie('token').token}`
    }

    await next()
  }
}

module.exports = AuthCookie
