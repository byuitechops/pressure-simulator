/**
 * This module is used to apply an interface to an object.
 *
 * @module interfaceApplier
 */
var interfaceApplier = (function () {

    /**
     * This method applies the Observable interface to an object. The methods which 
     * can change its state must be defined (the valueChangers). When adding observers,
     * you can specify the method to call when notifying them, as well provide a function
     * which determines what to pass to that method.
     *
     * @method makeObservable
     * @instance
     *
     * @param {Object} object - The object to make observable
     * @param {Array} valueChangers - An array of strings naming the methods that change
     *                                the object's state
     * @returns {Object} The original object, with the method 
     * {@link module:interfaceApplier~ObservableObject#addObserver addObserver()}
     */
    function makeObservable(object, valueChangers) {

        var observers = [];

        var notifyObservers = function () {
            // Notify the observers
            observers.forEach(function (observer, i) {
                observer.object[observer.methodToCall].apply(observer.object, observer.sender());
            });
        }

        /**
         * Method added to the object to allow the addition of observers. You can
         * specify the method to call when notifying them, as well provide a function
         * which determines what to pass to that method, but it's not required.
         *
         * @method addObserver
         * @memberof module:interfaceApplier~ObservableObject
         * @instance
         *
         * @arg {Object} observer - The object to add as an observer
         * @arg {String} [methodToCall="notify"] - The name of the method to 
         *                                         call when notifying the observer
         * @arg {Function} [sender] - A function that returns what to send to the method
         */
        object.addObserver = function (observer, methodToCall, sender) {
            observers.push({
                object: observer,
                methodToCall: methodToCall || "notify",
                sender: sender || function () {
                    return undefined
                }
            });
        }

        valueChangers.forEach(function (methodName) {
            var oldMethod = object[methodName];
            object[methodName] = function () {
                oldMethod.apply(object, arguments);

                notifyObservers();
            }
        });

        /**
         * An object made Observable by 
         * {@link module:interfaceApplier#makeObservable interfaceApplier.makeObservable()}
         * @namespace ObservableObject
         */
        return object;
    }

    return {
        makeObservable: makeObservable
    }
}());
