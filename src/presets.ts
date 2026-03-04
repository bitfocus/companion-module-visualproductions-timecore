import { CompanionPresetDefinitions } from '@companion-module/base'
import type { TimecoreInstance } from './main.js'

export function setupPresets(instance: TimecoreInstance): void {
	const presets: CompanionPresetDefinitions = {}

	const Color = {
		black: 0x000000,
		white: 0xffffff,
		red: 0xda2f21,
		green: 0x009900,
		gray: 0x4a4a4a,
	}

	// Sources that carry a timecode frame value
	const externalTimecodeSources: { id: string; label: string; tcVariableId: string }[] = [
		{ id: 'smpte', label: 'SMPTE', tcVariableId: 'tc_smpte' },
		{ id: 'midi', label: 'MIDI', tcVariableId: 'tc_mtc' },
		{ id: 'artnet', label: 'Art-Net', tcVariableId: 'tc_artnet' },
		{ id: 'rtpmidi', label: 'RTP MIDI', tcVariableId: 'tc_rtpmidi' },
	]
	for (const source of externalTimecodeSources) {
		presets[`external_tc_${source.id}`] = {
			type: 'button',
			category: 'External Timecode',
			name: source.label,
			options: {},
			style: {
				text: `${source.label}\\n$(this:${source.tcVariableId})`,
				size: 12,
				color: Color.white,
				bgcolor: Color.gray,
			},
			steps: [{ down: [], up: [] }],
			feedbacks: [
				{
					feedbackId: 'receiving',
					options: { source: source.id },
					style: { bgcolor: Color.green, color: Color.white },
				},
			],
		}
	}

	// Sources that signal presence only (no timecode frame)
	const receivingOnlySources: { id: string; label: string }[] = [
		{ id: 'sacn', label: 'sACN' },
		{ id: 'tcp', label: 'TCP' },
		{ id: 'udp', label: 'UDP' },
	]
	for (const source of receivingOnlySources) {
		presets[`external_tc_${source.id}`] = {
			type: 'button',
			category: 'External Timecode',
			name: source.label,
			options: {},
			style: {
				text: source.label,
				size: 12,
				color: Color.white,
				bgcolor: Color.gray,
			},
			steps: [{ down: [], up: [] }],
			feedbacks: [
				{
					feedbackId: 'receiving',
					options: { source: source.id },
					style: { bgcolor: Color.green, color: Color.white },
				},
			],
		}
	}

	const controlActions = [
		{ id: 'start', label: 'Start' },
		{ id: 'stop', label: 'Stop' },
		{ id: 'restart', label: 'Restart' },
		{ id: 'pause', label: 'Pause' },
	]
	presets[`internalTimecodeStatus`] = {
		type: 'button',
		category: 'Internal Timecode',
		name: 'Internal Timecode Status',
		options: {},
		style: {
			text: 'Internal TC\\n$(this:tc_internal)',
			size: 12,
			color: Color.white,
			bgcolor: Color.black,
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: [],
	}

	for (const action of controlActions) {
		presets[`startTimecode_${action.id}`] = {
			type: 'button',
			category: 'Internal Timecode',
			name: action.label,
			options: {},
			style: {
				text: action.label + ' Timecode',
				size: '14',
				color: Color.white,
				bgcolor: Color.black,
			},
			steps: [
				{
					down: [
						{
							actionId: 'internalTimecodeState',
							options: {
								selectedAction: action.id,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
	}
	for (let i = 1; i <= 4; i++) {
		presets[`timer_${i}_header`] = {
			type: 'text',
			category: 'Timers',
			name: 'Timer ' + i,
			text: '',
		}
		presets[`timer_${i}_status`] = {
			type: 'button',
			category: 'Timers',
			name: 'Timer ' + i + ' Status',
			options: {},
			style: {
				text: 'Timer ' + i + '\\n$(this:timer_' + i + ')',
				size: 12,
				color: Color.white,
				bgcolor: Color.black,
			},
			steps: [
				{
					down: [],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'timer_below',
					options: {
						timer: i,
						timecode: '00:00:10.0',
					},
					style: {
						bgcolor: Color.red,
						color: Color.white,
					},
				},
			],
		}

		for (const action of controlActions) {
			presets[`timer_${i}_${action.id}`] = {
				type: 'button',
				category: 'Timers',
				name: action.label,
				options: {},
				style: {
					text: action.label + ' Timer ' + i,
					size: '14',
					color: Color.white,
					bgcolor: Color.black,
				},
				steps: [
					{
						down: [
							{
								actionId: 'timerState',
								options: {
									selectedTimer: i,
									selectedAction: action.id,
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			}
		}
	}
	presets[`blink`] = {
		type: 'button',
		category: 'Utility',
		name: 'Blink',
		options: {},
		style: {
			text: 'Blink',
			size: '14',
			color: Color.white,
			bgcolor: Color.black,
		},
		steps: [
			{
				down: [
					{
						actionId: 'coreBlink',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	instance.setPresetDefinitions(presets)
}
