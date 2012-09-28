function api(){}

api._paramParser = function(url, options){
  var i = 0;
  for (var key in options){
    url += sprintf("%s%s=%s", (i===0) ? "?" : "&", key, options[key]);
    i++;
  }
  return url;
};

api._parseResponse = function(content, status, xhr, callback){
    console.log(content);
    if(exists(content.error)){
      if(exists(content.error.name) && content.error.name == "authenticationError"){
        window.location.href="/#!/logout";
      }
    }
    return callback(content.error, content.data);
};

api._ajax = function(type, async, url, options, callback){
  dataType = "";
  if (type == 'json'){
    type = 'GET';
    dataType = 'json';
  }
  $.ajax({
    type: type,
    dataType: dataType,
    async: async,
    url: url,
    data: options,
    success: function(content, status, xhr){
      api._parseResponse(content, status, xhr, callback);
    }
  });
};

api._post = function(url, options, callback){
    console.log("POST:" + url);
    if(Object.isFunction(options)){
        callback=options;
        options={};
    }
    $.post(url, options, function(content, status, xhr){
        api._parseResponse(content, status, xhr, callback);
    });
};

api._get = function(url, options, callback){
    console.log("GET:" + url);
    if(Object.isFunction(options)){
        callback=options;
        options={};
    }
    $.getJSON(url, options, function(content, status, xhr){
        api._parseResponse(content, status, xhr, callback);
    });
};

api._del = function(url, options, callback){
  console.log("DEL:" + url);
  if(Object.isFunction(options)){
    callback=options;
    options={};
  }
  $.del(url, options, function(content, status, xhr){
    api._parseResponse(content, status, xhr, callback);
  });
};

//AUTH
api.auth = function(){};

api.auth.login = function(options, callback){
  api._post("/api/consumers/login", options, callback);
};

api.auth.register = function(options, callback){
  api._post("/api/consumers/register", options, callback);
};

api.auth.facebook = function(accessToken, callback){
  api._post("/api/consumers/fblogin", {accessToken:accessToken}, callback);
};

api.auth.logout = function(callback){
  api._get("/api/consumers/logout", callback);
};

api.auth.self = function(callback){ //update param triggers session update from db
  api._get("/api/consumers/self", function(error, consumer){
    profileDataMerge(consumer);
    callback(error, consumer);
  });
};

api.auth.session = function(update, callback){ //update param triggers session update from db
  if(Object.isFunction(update)){
    callback = update;
    update = false;
  }
  if(exists(update)&&update)
    params = "?update=1";
  else
    params = "";
  api._get("/api/consumers/session"+params, callback);
};
//consumer
api.auth.initialUpdate = function(options, callback){
  api._post("/api/consumers/initialUpdate", options, callback);
};
api.auth.donate = function(options, callback){
  api._post("/api/consumers/donate", options, callback);
};
api.auth.updateCharity = function(id, callback){
  api._post("/api/consumers/self/charity/" + id, callback);
};
api.auth.updateIdentity = function(options, callback){
  api._post("/api/consumers/self/identity", options, callback);
};
api.auth.updateName = function(options, callback){ //options{firstName,lastName}
  api._post('/api/consumers/self/name', options, callback);
};
api.auth.updateEmail = function(options, callback){ //options{password,newEmail}
  api._post("/api/consumers/self/email", options, callback);
};
api.auth.updatePassword = function(options, callback){ //options{password,newEmail}
  api._post("/api/consumers/self/password", options, callback);
};
api.auth.updateEmailComplete = function(key, callback){
  api._get("/api/consumers/changeEmail/"+key, callback);
};
api.auth.updateImage = function(media, callback){
  if(Object.isFunction(media)){
    callback = media;
    media = null;
  }
  api._post("/api/consumers/self/media", media, callback);
};
api.auth.delImage = function(callback){
  api._del("/api/consumers/self/media", callback);
};
api.auth.updateScreenName = function(name, callback){
  api._post('/api/consumers/updateScreenName', {screenName: name}, callback);
};
api.auth.updateBarcodeId = function(options, callback){
  api._post('/api/consumers/self/barcodeId', options, callback);
};
api.auth.retrievePassword = function(key, callback){
  api._get('/api/consumers/passwordResets/' + key, callback);
};
api.auth.updatePermission = function(options, callback){
  api._post("/api/consumers/self/permissions", options, callback);
};
api.auth.updateHiddenFacebookItems = function(options, callback){
  api._post("/api/consumers/self/permissions/hiddenFacebookItems", options, callback);
};
api.auth.addEducation = function(options, callback){
  api._post("/api/consumers/self/profile/education", options, callback);
};
api.auth.addWork = function(options, callback){
  api._post("/api/consumers/self/profile/work", options, callback);
};
api.auth.addInterest = function(options, callback){
  api._post("/api/consumers/self/profile/interests", options, callback);
};
api.auth.addAffiliation = function(options, callback){
  api._post("/api/consumers/self/profile/affiliation", options, callback);
};
api.auth.removeEducation = function(options, callback){
  api._del("/api/consumers/self/profile/education", options, callback);
};
api.auth.removeWork = function(options, callback){
  api._del("/api/consumers/self/profile/work", options, callback);
};
api.auth.removeInterest = function(options, callback){
  api._del("/api/consumers/self/profile/interests", options, callback);
};
api.auth.removeAffiliation = function(options, callback){
  api._del("/api/consumers/self/profile/affiliation", options, callback);
};
api.auth.updateProfile = function(options, callback){
  api._post("/api/consumers/self/profile", options, callback);
};
api.auth.updateTapinsToFacebook = function(options, callback){
  api._post("/api/consumers/self/tapinsToFacebook", options, callback);
};
// Verifies that the key used for signing up at the tablet is still valid
api.auth.verifySignUpKey = function(key, callback){
  api._get('/api/consumers/signUpCompletion/' + key, callback);
};
// Verifies that the key used for updating qr-codes at the tablet is still valid
api.auth.verifyUpdateKey = function(key, callback){
  api._get('/api/consumers/barcodeIdUpdate/' + key, callback);
};
// Complete Registration from a tablet using a provided key
api.auth.completeRegistrationFromKey = function(key, options, callback){
  api._post('/api/consumers/signUpCompletion/' + key, options, callback);
};
api.auth.facebookFromKey = function(key, accessToken, callback){
  api._post("/api/consumers/signUpCompletionFacebook/" + key, {accessToken:accessToken}, callback);
};
// Confirm updating barcode at the tablet using the key
api.auth.updateBarcodeIdFromKey = function(key, options, callback){
  api._post('/api/consumers/barcodeIdUpdate/' + key, options, callback);
};
// Password reset requests
api.passwordResetRequests = function(){};
api.passwordResetRequests.add = function(email, callback){
  api._post('/api/consumers/passwordResets', {email: email}, callback);
};
api.passwordResetRequests.pending = function(options, callback){
  if(Object.isString(options)){
    options = {
      key: options
    };
  }
  api._get('/api/consumers/passwordResets/' + options.key, callback);
};
api.passwordResetRequests.consume = function(options, callback){
  api._post('/api/consumers/passwordResets/' + options.key, options, callback);
};

//ORGANIZATIONS
api.organizations = function(){};

api.organizations.search = function(options, callback){
  var name = options.name;
  var type = options.type;

  var apiURL = "/api/consumers/organizations";
  if(exists(name) && name!==""){
    apiURL += "?q="+name+"&";
  }
  else{
    apiURL += "?";
  }
  if(exists(type) && type!==""){
    apiURL += "type="+type;
  }
  api._get(apiURL, callback);
};

//CONSUMERS
api.consumers = function(){};

api.consumers.get = function(id, callback){
  api._get('/api/consumers/' + id, function(error, consumer){
    profileDataMerge(consumer);
    callback(error, consumer);
  });
};

//POLLS
api.polls = function(){};

api.polls.next = function(callback){
  api._get("/api/consumers/polls/next", callback);
};
api.polls.answer = function(pollId, options, callback){
  api._post(sprintf("/api/consumers/polls/%s/answer", pollId), options, callback);
};
api.polls.skip = function(pollId, callback){
  api._get(sprintf("/api/consumers/polls/%s/skip", pollId), callback);
};
api.polls.flag = function(pollId, callback){
  api._get(sprintf("/api/consumers/polls/%s/flag", pollId), callback);
};
api.polls.all = function(options, callback) {
  if(Object.isFunction(options)){
    callback = options;
    options = {};
  }
  var url = '/api/consumers/polls?stage=all';
  var i = 1; // Because there's already a param in the url
  for (var key in options){
    url += sprintf("%s%s=%s", (i===0) ? "?" : "&", key, options[key]);
    i++;
  }
  api._get(url, callback);
};
api.polls.answered = function(options, callback) {
  if(Object.isFunction(options)){
    callback = options;
    options = {};
  }
  var url = '/api/consumers/polls/answered';
  var i = 0;
  for (var key in options){
    url += sprintf("%s%s=%s", (i===0) ? "?" : "&", key, options[key]);
    i++;
  }
  api._get(url, callback);
};
api.polls.add = function(options, callback){
  api._post("/api/consumers/polls", options, callback);
};
api.polls.get = function(pollId, callback){
  api._get(sprintf("/api/consumers/polls/%s", pollId), callback);
};
api.polls.update = function(pollId, options, callback){
  api._post(sprintf("/api/consumers/polls/%s", pollId), options, callback);
};
//Loyalties
api.loyalties = function() {};
api.loyalties.list = function(options, callback){
  var url = '/api/consumers/loyalties';
  if(!Object.isFunction(options)){
    var i = 0;
    for (var key in options){
      url += sprintf("%s%s=%s", (i===0) ? "?" : "&", key, options[key]);
      i++;
    }
  }
  else
    callback = options;
  api._get(url, callback);
};
api.loyalties.listByBusiness = function(businessId, options, callback){
  var url = sprintf('/api/consumers/businesses/%s/loyalties', businessId);
  if(!Object.isFunction(options)){
    var i = 0;
    for (var key in options){
      url += sprintf("%s%s=%s", (i===0) ? "?" : "&", key, options[key]);
      i++;
    }
  }
  else
    callback = options;
  api._get(url, callback);
};

//Events
api.events = function() {};
api.events.list = function(options, callback){
  if(Object.isFunction(options)){
    callback = options;
    options = {};
  }
  var url = '/api/consumers/events';
  var i = 0;
  for (var key in options){
    url += sprintf("%s%s=%s", (i===0) ? "?" : "&", key, options[key]);
    i++;
  }
  api._get(url, callback);
};

api.events.single = function(eventId, callback){
  api._get(sprintf("/api/consumers/events/%s", eventId), callback);
};

api.events.rsvp = function(eventId, callback){
  var options = {eventId: eventId};
  api._post("/api/consumers/events/rsvp", options, callback);
};

api.events.unRsvp = function(eventId, callback){
  var options = {eventId: eventId};
  api._post("/api/consumers/events/unRsvp", options, callback);
};

//Streams
api.streams = function() {};

api.streams.global = function(options, callback){
  if (Object.isFunction(options)){
    callback = options;
    options = void(0);
  }

  defaultOptions = {
    limit: 15,
    skip: 0
  };

  Object.merge(defaultOptions, options, false);

  api._get(sprintf("/api/consumers/streams?limit=%s&offset=%s", defaultOptions.limit, defaultOptions.skip), callback);
};

api.streams.self = function(options, callback){
  if (Object.isFunction(options)){
    callback = options;
    options = void(0);
  }

  defaultOptions = {
    limit: 15,
    skip: 0
  };

  Object.merge(defaultOptions, options, false);

  api._get(sprintf("/api/consumers/me/stream?limit=%s&offset=%s", defaultOptions.limit, defaultOptions.skip), callback);
};

//Tapins
api.tapins = function(){};
api.tapins.list = function(options, callback){
  if (Object.isFunction(options)){
    callback = options;
    options = {};
  }
  api._get(
    api._paramParser('/api/consumers/tapins', options),
    callback
  );
};

//Business Requests
api.businessRequests = function(){};
api.businessRequests.add = function(name, callback){
  var options = {businessName: name};
  api._post('/api/consumers/businessRequests', options, callback);
};

//Businesses
api.businesses = function(){};
api.businesses.list = function(options, callback){
  if (Object.isFunction(options)){
    callback = options;
    options = {};
  }
  api._get(
    api._paramParser('/api/consumers/businesses', options),
    callback
  );
};
api.businesses.participatingBusinesses = function(options, callback){
  if (Object.isFunction(options)){
    callback = options;
    options = {};
  }
  api._get(
    api._paramParser('/api/consumers/participatingBusinesses', options),
    callback
  );
};
api.businesses.listCharities = function(options, callback){
  if (Object.isFunction(options)){
    callback = options;
    options = {};
  }
  api._get(
    api._paramParser('/api/consumers/businesses?charity=1', options),
    callback
  );
};
api.businesses.listEquipped = function(options, callback){
  if (Object.isFunction(options)){
    callback = options;
    options = {};
  }
  options.equipped = true;
  api._get(
    api._paramParser('/api/consumers/businesses', options),
    callback
  );
};
api.businesses.getOneEquipped = function(bid, callback){
  api._get('/api/consumers/businesses/' + bid, callback);
};

api.businesses.categories = function(){};
api.businesses.categories.list = function(options, callback){
  if (Object.isFunction(options)){
    callback = options;
    options = {};
  }
  api._get(
    api._paramParser('/api/consumers/businesses/categories', options),
    callback
  );
};

// Contact Us
api.contact = function(){};
api.contact.email = function(options, callback){
  api._post('/api/consumers/contact', options, callback);
};

//Business Requests
api.businessRequests = function(){};
api.businessRequests.add = function(name, callback){
  var options = {businessName: name};
  api._post('/api/consumers/businessRequests', options, callback);
};

//Media
api.media = function(){};

api.media.listImages = function(entityType, entityId, callback){
  if(entityType=='business'){
    api._get(sprintf("/api/clients/businesses/%s/media?type=image", entityId), callback);
  }else if(entityType=='client'){
    api._get(sprintf("/api/clients/self/media?type=image"), callback);
  }
};

//Barcode
api.barcodes = function(){};
api.barcodes.create = function(callback){
  api._get("/api/consumers/barcodes", callback);
};

//-----Admin-----//

// Businesses
api.businesses.single = function(bid, callback){
  api._get('/api/consumers/admin/businesses/' + bid, callback);
};
api.businesses.update = function(businessId, options, callback){
  api._post(sprintf('/api/consumers/admin/businesses/%s',businessId), options, callback);
};

// Clients
api.clients = function(){};
api.clients.list = function(callback){
  api._get('/api/consumers/admin/clients', callback);
};

// Loyalty
api.loyalties.del = function(id, callback){
  api._del("/api/consumers/admin/loyalties/" + id, callback);
};
api.loyalties.add = function(options, callback){
  api._post("/api/consumers/admin/loyalties", options, callback);
};

//Events
api.events.create = function(event, callback){
  api._post("/api/consumers/admin/events", event, callback);
};
api.events.del = function(eventId, callback){
  api._del('/api/consumers/admin/events/' + eventId, callback);
};

//Registers
api.businesses.registers = function(){};
api.businesses.registers.add = function(options, callback){
  api._post('api/consumers/admin/businesses/registers', options, callback);
};
api.businesses.registers.del = function(options, callback){
  api._del('api/consumers/admin/businesses/registers', options, callback);
};

// Event Requests
api.eventRequests = function(){};
api.eventRequests.list = function(callback){
  api._get('/api/consumers/admin/eventRequests', callback);
};
api.eventRequests.single = function(requestId, callback){
  api._get('/api/consumers/admin/eventRequests/' + requestId, callback);
};
api.eventRequests.respond = function(requestId, callback){
  api._post('/api/consumers/admin/eventRequests/' + requestId, callback);
};
api.eventRequests.del = function(requestId, callback){
  api._del('/api/consumers/admin/eventRequests/' + requestId, callback);
};

api.submitEmail = function(data, callback){
  api._post('http://consumer/api/consumers/emailSubmission', data, callback);
}