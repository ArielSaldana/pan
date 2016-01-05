/**
 * @class    queue
 * @author   Ariel Saldana / http://ahhriel.com
 */
P.Tools.Queue = P.Core.Event_Emitter.extend({
    static: 'queue',
    slice: [].slice,


    options : {

    },


    /**
     * Initialise and merge options
     * @constructor
     * @param {object} options Properties to merge with defaults
     */
    construct: function(options) {
        this._super(options);
    },

    queue: function(parallelism) {
        var q,
            tasks = [],
            started = 0,
            active = 0,
            remaining = 0,
            popping,
            error,
            wait = this.noop,
            all;

        var that = this;

        if (!parallelism) parallelism = Infinity;

        this.pop = function() {
            while (popping = started < tasks.length && active < parallelism) {
                var i = started++,
                    t = tasks[i],
                    a = that.slice.call(t, 1);
                a.push(that.callback(i));
                ++active;
                t[0].apply(null, a);
            }
        }

        this.callback = function(i) {
            return function(e, r) {
                --active;
                if (error != null) return;
                if (e != null) {
                    error = e; // ignore new tasks and squelch active callbacks
                    started = remaining = NaN; // stop queued tasks from starting
                    notify();
                } else {
                    tasks[i] = r;
                    if (--remaining) popping || pop();
                    else notify();
                }
            };
        }

        this.notify = function() {
            if (error != null) wait (error);
            else if (all) wait (error, tasks);
            else wait.apply(null, [error].concat(tasks));
        }


        return q = {
            defer: function() {
                if (!error) {
                    tasks.push(arguments);
                    ++remaining;
                    that.pop();
                }
                return q;
            },
            wait: function(f) {
                wait = f;
                all = false;
                if (!remaining) notify();
                return q;
            },
            awaitAll: function(f) {
                wait = f;
                all = true;
                if (!remaining) notify();
                return q;
            }
        };
    },

    /**
     * simple queue that uses arrays but avoids expensive shift operations
     * @return {object}            Context
     * @function .enqueue()     adds item to the queue
     * @function .dequeue()     removes an item from the queue, and returns that item.                  returns undefined is queue is empty
     * @function .peek()        returns the item at the index of the queue without dequeueing it.       returns undefined if queue is empty
     * @function .getLength()   returns the length of the queue
     * @function .isEmpty()     returns true of false - if queue is empty.
     */
    simpleQueue: function() {
        var queue = [],
            offset = 0;

        this.getLenth = function() {
            return (queue.length - offset);
        }

        this.isEmpty = function() {
            return (queue.length == 0);
        }

        this.enqueue = function(item) {
            queue.push(item);
        }

        this.dequeue = function() {

            // if the queue is empty, return immediately
            if (queue.length == 0) return undefined;

            // store the item at the front of the queue
            var item = queue[offset];

            // increment the offset and remove the free space if necessary
            if (++offset * 2 >= queue.length) {
                queue = queue.slice(offset);
                offset = 0;
            }

            // return the dequeued item
            return item;

        }

        this.peek = function() {
            return (queue.length > 0 ? queue[offset] : undefined);
        }

        return this;
    },

    noop: function() {},

    loop: function(qInstance, interval) {

    },

    stopLoop: function() {

    }

});
