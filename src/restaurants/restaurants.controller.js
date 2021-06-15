const restaurantsService = require("./restaurants.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function restaurantExists(req, res, next) {
  const { restaurantId } = req.params;

  const restaurant = await restaurantsService.read(restaurantId);

  if (restaurant) {
    res.locals.restaurant = restaurant;
    return next();
  }
  next({ status: 404, message: `Restaurant cannot be found.` });
}

async function restFormCorrect(req, res, next){
  let {restaurant_name} = req.body.data
  let {cuisine} = req.body.data
  let {address} = req.body.data
  let {not_supported} = req.body.data
  
  
  if(restaurant_name && cuisine && address){
    if(Object.keys(req.body.data).length === 3){
      return next()
    } return next({
    status: 400,
    message: `not_supported`
  }) 
  }
  
    return next({
    status: 400,
    message: `Your request is missing restaurant_name, cuisine, or address.`
  })
}



async function list(req, res, next) {
  const data = await restaurantsService.list();
  res.json({ data });
}

async function create(req, res, next) {
  let newRestaurant = req.body.data
  console.log(newRestaurant)
  const data = await restaurantsService.create(newRestaurant);
  res.status(201).json({ data });
}

async function update(req, res, next) {
  const updatedRestaurant = {
    ...res.locals.restaurant,
    ...req.body.data,
    restaurant_id: res.locals.restaurant.restaurant_id,
  };

  const data = await restaurantsService.update(updatedRestaurant);

  res.json({ data });
}

async function destroy(req, res, next) {
 restaurantsService.delete(res.locals.restaurant.restaurantId).then(()=> res.sendStatus(204)).catch(next);

}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(restFormCorrect), asyncErrorBoundary(create)],
  update: [asyncErrorBoundary(restaurantExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(restaurantExists), asyncErrorBoundary(destroy)],
};
