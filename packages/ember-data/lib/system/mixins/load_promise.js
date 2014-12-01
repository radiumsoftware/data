/**
  @module ember-data
*/

var Evented = Ember.Evented,              // ember-runtime/mixins/evented
    run = Ember.run,                      // ember-metal/run-loop
    get = Ember.get;                      // ember-metal/accessors

Ember.PromiseMixin = Ember.Mixin.create({
  then: function(resolve, reject, label) {
    var deferred, promise, entity;

    entity = this;
    deferred = get(this, '_deferred');
    promise = deferred.promise;

    function fulfillmentHandler(fulfillment) {
      if (fulfillment === promise) {
        return resolve(entity);
      } else {
        return resolve(fulfillment);
      }
    }

    return promise.then(resolve && fulfillmentHandler, reject, label);
  },

  resolve: function(value) {
    var deferred, promise;

    deferred = get(this, '_deferred');
    promise = deferred.promise;

    if (value === this) {
      deferred.resolve(promise);
    } else {
      deferred.resolve(value);
    }
  },

  reject: function(value) {
    get(this, '_deferred').reject(value);
  },

  _deferred: Ember.computed(function() {
    return Ember.RSVP.defer('Ember: DeferredMixin - ' + this);
  })
});

var LoadPromise = Ember.Mixin.create(Ember.PromiseMixin, Evented, {
  init: function() {
    this._super.apply(this, arguments);

    this.one('didLoad', this, function() {
      this.resolve(this);
    });

    this.one('becameError', this, function() {
      this.reject(this);
    });

    if (get(this, 'isLoaded')) {
      this.trigger('didLoad');
    }
  }
});

DS.LoadPromise = LoadPromise;
