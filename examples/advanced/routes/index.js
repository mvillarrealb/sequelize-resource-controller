module.exports = [
  {
    httpVerb: 'get',
    route: '/v1/interest-points',
    action: 'PoiController?list',
    middlewares: []
  },
  {
    httpVerb: 'post',
    route: '/v1/interest-points',
    action: 'PoiController?create',
    middlewares: []
  },
  {
    httpVerb: 'get',
    route: '/v1/interest-points/:poi_id',
    action: 'PoiController?getOne'
  },
  {
    httpVerb: 'put',
    route: '/v1/interest-points/:poi_id',
    action: 'PoiController?update',
    middlewares: ['PoiController?getOneMiddleware']
  },
  {
    httpVerb: 'delete',
    route: '/v1/interest-points/:poi_id',
    action: 'PoiController?destroy',
    middlewares: ['PoiController?getOneMiddleware']
  }
];
