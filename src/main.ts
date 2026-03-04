import {
	InstanceBase,
	runEntrypoint,
	InstanceStatus,
	SomeCompanionConfigField,
	TCPHelper,
} from '@companion-module/base'
import { upgradeScripts } from './upgrade.js'
import { setupActions } from './actions.js'
import { setupFeedbacks } from './feedbacks.js'
import { setupPresets } from './presets.js'
import { setupVariables } from './variables.js'
import { configFields, ModuleConfig } from './config.js'

export interface DeviceState {
	uptime: string
	tcInternalFrame: string
	tcInternalFps: string
	tcSmpteFrame: string
	tcSmpteFps: string
	tcMtcFrame: string
	tcMtcFps: string
	tcArtnetFrame: string
	tcArtnetFps: string
	tcRtpmidiFrame: string
	tcRtpmidiFps: string
	receivingSmpte: string
	receivingMidi: string
	receivingArtnet: string
	receivingRtpmidi: string
	receivingSacn: string
	receivingTcp: string
	receivingUdp: string
	timers: [string, string, string, string]
}

export class TimecoreInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig
	client: TCPHelper | null = null
	timecodeRegex = '/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]\\.[0-9]{2}$/'
	timerValueRegex = '/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]\\.[0-9]$/'
	pollTimer: ReturnType<typeof setInterval> | null = null
	state: DeviceState = {
		uptime: '',
		tcInternalFrame: '',
		tcInternalFps: '',
		tcSmpteFrame: '',
		tcSmpteFps: '',
		tcMtcFrame: '',
		tcMtcFps: '',
		tcArtnetFrame: '',
		tcArtnetFps: '',
		tcRtpmidiFrame: '',
		tcRtpmidiFps: '',
		receivingSmpte: '',
		receivingMidi: '',
		receivingArtnet: '',
		receivingRtpmidi: '',
		receivingSacn: '',
		receivingTcp: '',
		receivingUdp: '',
		timers: ['', '', '', ''],
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config

		this.initActions()
		this.initFeedbacks()
		this.initPresets()
		this.initVariables()

		await this.configUpdated(config)
	}

	initTCP(): void {
		if (this.client) {
			this.client.destroy()
			this.client = null
		}

		if (this.config.targetIp && this.config.targetPort) {
			this.client = new TCPHelper(this.config.targetIp, this.config.targetPort)

			this.client.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})

			this.client.on('error', (err) => {
				this.log('error', 'Network error: ' + err.message)
			})
			this.client.on('connect', () => {
				this.log('info', 'Connected to TimeCore')
			})
			this.client.on('data', (data) => {
				console.log(data)
			})
		} else {
			this.updateStatus(InstanceStatus.BadConfig, 'TimeCore IP or Port is missing')
		}
	}

	startPolling(): void {
		this.stopPolling()
		if (!this.config.targetIp) return

		void this.fetchStatus()
		void this.fetchTimers()

		this.pollTimer = setInterval(() => {
			void this.fetchStatus()
			void this.fetchTimers()
		}, 1000)
	}

	stopPolling(): void {
		if (this.pollTimer !== null) {
			clearInterval(this.pollTimer)
			this.pollTimer = null
		}
	}

	async fetchStatus(): Promise<void> {
		try {
			const res = await fetch(`http://${this.config.targetIp}/ajax/get/index/status`)
			const data = (await res.json()) as {
				gen: { upt: string; upd: number }
				tc: {
					i: { fra: string; fps: string }
					s: { fra: string; fps: string }
					m: { fra: string; fps: string }
					a: { fra: string; fps: string }
					r: { fra: string; fps: string }
				}
				receiving: {
					smpte: string
					midi: string
					a: string
					rtpmidi: string
					s: string
					t: string
					u: string
				}
			}

			const upd = data.gen.upd
			this.state.uptime = upd > 0 ? `${upd}d ${data.gen.upt}` : data.gen.upt

			this.state.tcInternalFrame = data.tc.i.fra
			this.state.tcInternalFps = data.tc.i.fps
			this.state.tcSmpteFrame = data.tc.s.fra
			this.state.tcSmpteFps = data.tc.s.fps
			this.state.tcMtcFrame = data.tc.m.fra
			this.state.tcMtcFps = data.tc.m.fps
			this.state.tcArtnetFrame = data.tc.a.fra
			this.state.tcArtnetFps = data.tc.a.fps
			this.state.tcRtpmidiFrame = data.tc.r.fra
			this.state.tcRtpmidiFps = data.tc.r.fps

			this.state.receivingSmpte = data.receiving.smpte
			this.state.receivingMidi = data.receiving.midi
			this.state.receivingArtnet = data.receiving.a
			this.state.receivingRtpmidi = data.receiving.rtpmidi
			this.state.receivingSacn = data.receiving.s
			this.state.receivingTcp = data.receiving.t
			this.state.receivingUdp = data.receiving.u

			this.updateVariables()
			this.checkFeedbacks()
		} catch (_err) {
			// Silently ignore fetch errors; last known values are preserved
		}
	}

	async fetchTimers(): Promise<void> {
		try {
			const res = await fetch(`http://${this.config.targetIp}/ajax/get/monitor/timers`)
			const data = (await res.json()) as { timers: string[] }

			this.state.timers = [data.timers[0] ?? '', data.timers[1] ?? '', data.timers[2] ?? '', data.timers[3] ?? '']

			this.updateVariables()
			this.checkFeedbacks('timer_below')
		} catch (_err) {
			// Silently ignore fetch errors; last known values are preserved
		}
	}

	updateVariables(): void {
		this.setVariableValues({
			uptime: this.state.uptime,
			tc_internal: this.state.tcInternalFrame,
			tc_internal_fps: this.state.tcInternalFps,
			tc_smpte: this.state.tcSmpteFrame,
			tc_smpte_fps: this.state.tcSmpteFps,
			tc_mtc: this.state.tcMtcFrame,
			tc_mtc_fps: this.state.tcMtcFps,
			tc_artnet: this.state.tcArtnetFrame,
			tc_artnet_fps: this.state.tcArtnetFps,
			tc_rtpmidi: this.state.tcRtpmidiFrame,
			tc_rtpmidi_fps: this.state.tcRtpmidiFps,
			receiving_smpte: this.state.receivingSmpte === 'no' ? false : true,
			receiving_midi: this.state.receivingMidi === 'no' ? false : true,
			receiving_artnet: this.state.receivingArtnet === 'no' ? false : true,
			receiving_rtpmidi: this.state.receivingRtpmidi === 'no' ? false : true,
			receiving_sacn: this.state.receivingSacn === 'no' ? false : true,
			receiving_tcp: this.state.receivingTcp === 'no' ? false : true,
			receiving_udp: this.state.receivingUdp === 'no' ? false : true,
			timer_1: this.state.timers[0],
			timer_2: this.state.timers[1],
			timer_3: this.state.timers[2],
			timer_4: this.state.timers[3],
		})
	}

	async destroy(): Promise<void> {
		this.stopPolling()
		if (this.client) {
			this.client.destroy()
		}
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config
		this.initTCP()
		this.startPolling()
	}

	sendMessage(message: string): void {
		if (this.client) {
			void this.client.send(message)
		}
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return configFields
	}

	initFeedbacks(): void {
		setupFeedbacks(this)
	}

	initActions(): void {
		setupActions(this)
	}

	initPresets(): void {
		setupPresets(this)
	}

	initVariables(): void {
		setupVariables(this)
	}
}

runEntrypoint(TimecoreInstance, upgradeScripts)
