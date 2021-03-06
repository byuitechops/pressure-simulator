/**
 * This module is a factory used to create measure models. 
 * The measure models have the 
 * {@link module:interfaceApplier~ObservableObject Observable} interface applied.
 *
 * @module modelFactory
 */
var modelFactory = (function () {

    /**
     * This is the method to create and return a {@link module:modelFactory~MeasureModel MeasureModel}
     *
     * @method makeMeasureModel
     * @instance
     * 
     * @arg {number|number[]} measureBound - Either a number specifying the max of the measure,
     *                                    or an array specifying the [min,max] of the measure.
     *                                    The default min is 0.
     * @arg {int} precision - The desired number of decimals places to round to when the number 
     *                        is displayed. This number does not affect the underlying model.
     */
    function makeMeasureModel(measureBound, precision) {

        var measurement, measureMin, measureMax, measureRange;

        // Set up bounds
        if (Array.isArray(measureBound)) {
            measureMin = measureBound[0];
            measureMax = measureBound[1];
        } else {
            measureMin = 0;
            measureMax = measureBound;
        }

        measureRange = (measureMax - measureMin);

        /* START Methods to include in object returned */

        /**
         * Sets the measurement by a given percentage of the range within its bounds
         *
         * @method setMeasurementByPercentage
         * @memberof module:modelFactory~MeasureModel
         * @instance
         *
         * @arg {number|String} value - Must either be a decimal percentage (where 1=100%), or
         *                              a string containing the percentage ending with a '%'
         */
        function setMeasurementByPercentage(value) {

            // If meant to be of the from 100%, should come in as string with the '%' char, convert to decimal
            if (typeof value === "string") {
                value = value.trim();
                if (value.charAt(value.length - 1) === "%") {
                    value = value.substring(0, value.length - 1);
                    value = Number(value) / 100;
                } else {
                    value = Number(value);
                }
            }
            // If not number at this point, remove
            if (typeof value !== "number") {
                return;
            }
            if (0 <= value && value <= 1) {
                measurement = measureMin + value * measureRange;
            }
        }

        /**
         * Sets the measurement to a specified amount
         *
         * @method setMeasurement
         * @memberof module:modelFactory~MeasureModel
         * @instance
         *
         * @arg {number} newMeasurement - The new measurement
         */
        function setMeasurement(newMeasurement) {
            measurement = newMeasurement;
        }

        /**
         * Get the measurement
         *
         * @method getMeasurement
         * @memberof module:modelFactory~MeasureModel
         * @instance
         *
         * @returns {number} The current measurement of the model
         */
        function getMeasurement() {
            return measurement;
        }

        /**
         * Get the bounds
         *
         * @method getBounds
         * @memberof module:modelFactory~MeasureModel
         * @instance
         *
         * @returns {Array} The measure bounds in the form [min, max]
         */
        function getBounds() {
            return [measureMin, measureMax];
        }

        /**
         * Get the desired precision
         *
         * @method getPrecision
         * @memberof module:modelFactory~MeasureModel
         * @instance
         *
         * @returns {int} The number of decimal places to round to when displaying the measurement
         */
        function getPrecision() {
            return precision;
        }

        /**
         * The model returned by 
         * {@link module:modelFactory#makeMeasureModel modelFactory.makeMeasureModel}.
         * It has the {@link module:interfaceApplier~ObservableObject Observable} interface applied.
         * @namespace MeasureModel
         */
        var objectToReturn = {
            getMeasurement: getMeasurement,
            getBounds: getBounds,
            getPrecision: getPrecision,
            setMeasurement: setMeasurement
        }
        if (measureMax || measureMax === 0) {
            objectToReturn.setMeasurementByPercentage = setMeasurementByPercentage;
        }

        interfaceApplier.makeObservable(objectToReturn, ["setMeasurement", "setMeasurementByPercentage"]);

        return objectToReturn;
    }

    return {
        makeMeasureModel: makeMeasureModel
    }
}());
