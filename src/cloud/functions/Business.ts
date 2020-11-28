import * as _ from 'lodash';

export async function nearby(req) {
  const { coords, unit, categoryId, params = {} } = req.params;
  const { filter, sort, paginate } = params;
  let query = new Parse.Query('Business');
  query.near('location', new Parse.GeoPoint(coords));
  if (categoryId) {
    const category = new Parse.Object('Category');
    category.id = categoryId;
    query.equalTo('category', category);
  }
  // Filter
  if (!_.isEmpty(filter)) {
    const queries = [];
    for (let [key, value] of Object.entries(filter)) {
      if (key === 'id') {
        key = 'objectId';
      }
      queries.push(new Parse.Query('Business').matches(key, value as any, 'i'));
    }
    query = Parse.Query.and(query, Parse.Query.or(...queries));
  }
  // Sort
  if (sort) {
    if (sort.direction === 'desc') {
      query.descending(sort.field);
    } else {
      query.ascending(sort.field);
    }
  }
  // Paginate
  if (paginate) {
    const { page = 1, perPage = 25 } = paginate;
    query.skip((page - 1) * perPage);
    query.limit(perPage);
  }
  query.include('category');
  return (
    await query.find({
      useMasterKey: true,
    })
  ).map((business: any) => {
    return {
      id: business.get('pageId'),
      name: business.get('name'),
      description: business.get('description'),
      category: business.get('category').get('name'),
      phone: business.get('phone'),
      address: business.get('address'),
      city: business.get('city'),
      postalCode: business.get('postalCode'),
      country: business.get('country'),
      distance:
        unit === 'km'
          ? business
              .get('location')
              .kilometersTo(coords)
              .toFixed(2)
          : business
              .get('location')
              .milesTo(coords)
              .toFixed(2),
      hours: business.get('hours'),
      picture: business.get('picture'),
      cover: business.get('cover'),
    };
  });
}
