module.exports = function spark(Spark, Emitter) {

  'use strict';

  /**
   * `Primus#initialise` reference.
   */

  var initialise = Spark.prototype.initialise;

  /**
   * Initialise the Primus and setup all
   * parsers and internal listeners.
   *
   * @api private
   */

  Spark.prototype.initialise = function init() {
    if (!this.emitter) this.emitter = new Emitter(this);
    if (!this.__initialise) initialise.apply(this, arguments);
  };

  // Extend the Spark to add the send method if Spark.readable
  // is not supported then we set the method on the prototype instead.
  if (!Spark.readable) return Spark.prototype.send = send;
  if (!Spark.prototype.send) Spark.readable('send', send);

  /**
   * Emits to this Spark.
   *
   * @param {String} ev The event.
   * @param {Mixed} [data] The data to broadcast.
   * @param {Function} [fn] The callback function.
   * @return {Socket} this
   * @api public
   */

  function send(ev, data, fn) {
    // ignore newListener event to avoid this error in node 0.8
    // https://github.com/cayasso/primus-emitter/issues/3
    if ('newListener' === ev) return this;
    this.emitter.send.apply(this.emitter, arguments);
    return this;
  }

};