import { Loader } from './Loader';

function TfjsLoader( model, config ) {

	Loader.call(this, model);

	this.url = undefined;
	this.onCompleteCallback = undefined;

	this.type = "TfjsLoader";

	this.loadLoaderConfig(config);

}

TfjsLoader.prototype = Object.assign(Object.create(Loader.prototype), {

	loadLoaderConfig: function(loaderConfig) {

		if (loaderConfig.url !== undefined) {
			this.url = loaderConfig.url;
		} else {
			console.error("\"url\" property is required to load tensorflow.js model.");
		}

		if (loaderConfig.onComplete !== undefined) {
			this.onCompleteCallback = loaderConfig.onComplete;
		}

	},

	load: async function() {

		const loadedModel = await tf.loadModel(this.url);
		this.model.resource = loadedModel;
		this.model.isFit = true;

		if (this.onCompleteCallback !== undefined) {
			this.onCompleteCallback();
		}

	},

	predict: function(data, inputShape) {

		let batchSize = [1];
		let predictTensorShape = batchSize.concat(inputShape);

		let predictTensor = tf.tensor(data, predictTensorShape);

		let predictResult = this.model.resource.predict(predictTensor);

		return predictResult;

	}

});

export { TfjsLoader };