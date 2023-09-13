import { InstanceBase, runEntrypoint, InstanceStatus, Regex } from '@companion-module/base'
import { upgradeScripts } from './upgrade.js'
import { setupActions } from './actions.js'
import { setupFeedbacks } from './feedbacks.js'
import { configFields } from './config.js'

import * as net from 'net';

class WebsocketInstance extends InstanceBase {

	timecodeRegex = "/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]:[0-5][0-9]$/";


	async init(config) {
		this.config = config
		this.client = null;
		this.checkConfig();

		this.initActions()
		this.initFeedbacks()
	}

	checkConfig() {
		if(this.config.targetIp !== "") {
			if(this.client != null) {
				this.client.end();
				this.client = null;
			}
			this.client = new net.Socket();
			this.client.connect(this.config.targetPort, this.config.targetIp, () => {
				this.updateStatus(InstanceStatus.Ok);
			});
			this.client.on('error', (error) => {
				this.updateStatus(InstanceStatus.ConnectionFailure);
				console.log("Error: " + error)
			});
		}
		else {
			this.updateStatus(InstanceStatus.BadConfig, "IP address missing");
		}
	}

	async destroy() {
		this.isInitialized = false
		if(this.client != null) {
			this.client.end();
		}
	}

	async configUpdated(config) {
		this.config = config
		this.checkConfig();
	}

	sendMessage(message) {
		if(this.client != null) {
			this.client.write(message);
		}
	}

	getConfigFields() {
		return configFields;
	}

	initFeedbacks() {
		setupFeedbacks(this);
	}

	initActions() {
		setupActions(this);
	}
}

runEntrypoint(WebsocketInstance, upgradeScripts)
