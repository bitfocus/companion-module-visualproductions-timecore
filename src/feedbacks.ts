import { combineRgb } from '@companion-module/base'
import { TimecoreInstance } from './main.js'

const RECEIVING_STATE_KEYS: Record<string, keyof TimecoreInstance['state']> = {
	smpte: 'receivingSmpte',
	midi: 'receivingMidi',
	artnet: 'receivingArtnet',
	rtpmidi: 'receivingRtpmidi',
	sacn: 'receivingSacn',
	tcp: 'receivingTcp',
	udp: 'receivingUdp',
}

/** Parse HH:MM:SS or HH:MM:SS.t timecode to total seconds */
function timecodeToSeconds(tc: string): number | null {
	const parts = tc.trim().split(/[:.]/)
	if (parts.length < 3) return null
	const [h, m, s, tenths] = parts.map((p) => parseInt(p, 10) || 0)
	return h * 3600 + m * 60 + s + (tenths ?? 0) / 10
}

export function setupFeedbacks(instance: TimecoreInstance): void {
	instance.setFeedbackDefinitions({
		timer_below: {
			type: 'boolean',
			name: 'Timer Below Value',
			description: 'Active when the selected timer is below the given timecode',
			options: [
				{
					type: 'dropdown',
					label: 'Timer',
					id: 'timer',
					default: 1,
					choices: [
						{ id: 1, label: 'Timer 1' },
						{ id: 2, label: 'Timer 2' },
						{ id: 3, label: 'Timer 3' },
						{ id: 4, label: 'Timer 4' },
					],
				},
				{
					type: 'textinput',
					label: 'Below (Timecode)',
					id: 'timecode',
					default: '00:00:10.0',
					description: 'Format: HH:MM:SS.t',
					regex: instance.timerValueRegex,
				},
			],
			defaultStyle: {
				bgcolor: combineRgb(0, 153, 0),
				color: combineRgb(255, 255, 255),
			},
			callback: (feedback) => {
				const idx = (feedback.options.timer as number) - 1
				const val = instance.state.timers[idx]
				const thresholdTc = (feedback.options.timecode as string) ?? '00:00:10.0'
				const threshold = timecodeToSeconds(thresholdTc)
				if (threshold === null) return false
				if (!val || val === '') return false
				const totalSeconds = timecodeToSeconds(val)
				if (totalSeconds === null) return false
				return totalSeconds < threshold
			},
		},
		receiving: {
			type: 'boolean',
			name: 'Receiving',
			description: 'Active when the selected source is receiving',
			options: [
				{
					type: 'dropdown',
					label: 'Source',
					id: 'source',
					default: 'smpte',
					choices: [
						{ id: 'smpte', label: 'SMPTE' },
						{ id: 'midi', label: 'MIDI' },
						{ id: 'artnet', label: 'Art-Net' },
						{ id: 'rtpmidi', label: 'RTP MIDI' },
						{ id: 'sacn', label: 'sACN' },
						{ id: 'tcp', label: 'TCP' },
						{ id: 'udp', label: 'UDP' },
					],
				},
			],
			defaultStyle: { bgcolor: combineRgb(0, 153, 0), color: combineRgb(255, 255, 255) },
			callback: (feedback) => {
				const source = (feedback.options.source as string) ?? 'smpte'
				const key = RECEIVING_STATE_KEYS[source] ?? 'receivingSmpte'
				const val = instance.state[key]
				return typeof val === 'string' && val !== 'no'
			},
		},
	})
}
