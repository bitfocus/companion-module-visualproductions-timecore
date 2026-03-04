import { CompanionVariableDefinition } from '@companion-module/base'
import type { TimecoreInstance } from './main.js'

export function setupVariables(instance: TimecoreInstance): void {
	const variables: CompanionVariableDefinition[] = [
		{ variableId: 'uptime', name: 'Device Uptime' },
		{ variableId: 'tc_internal', name: 'Internal Timecode Value' },
		{ variableId: 'tc_internal_fps', name: 'Timecode Internal FPS' },
		{ variableId: 'tc_smpte', name: 'Received SMPTE Timecode Value' },
		{ variableId: 'tc_smpte_fps', name: 'Timecode Received SMPTE FPS' },
		{ variableId: 'tc_mtc', name: 'Received MTC Timecode Value' },
		{ variableId: 'tc_mtc_fps', name: 'Timecode Received MTC FPS' },
		{ variableId: 'tc_artnet', name: 'Received Art-Net Timecode Value' },
		{ variableId: 'tc_artnet_fps', name: 'Timecode Received Art-Net FPS' },
		{ variableId: 'tc_rtpmidi', name: 'Received RTP-MIDI Timecode Value' },
		{ variableId: 'tc_rtpmidi_fps', name: 'Timecode Received RTP-MIDI FPS' },
		{ variableId: 'receiving_smpte', name: 'Receiving SMPTE' },
		{ variableId: 'receiving_midi', name: 'Receiving MIDI' },
		{ variableId: 'receiving_artnet', name: 'Receiving Art-Net' },
		{ variableId: 'receiving_rtpmidi', name: 'Receiving RTP-MIDI' },
		{ variableId: 'receiving_sacn', name: 'Receiving sACN' },
		{ variableId: 'receiving_tcp', name: 'Receiving TCP' },
		{ variableId: 'receiving_udp', name: 'Receiving UDP' },
		{ variableId: 'timer_1', name: 'Timer 1' },
		{ variableId: 'timer_2', name: 'Timer 2' },
		{ variableId: 'timer_3', name: 'Timer 3' },
		{ variableId: 'timer_4', name: 'Timer 4' },
	]
	instance.setVariableDefinitions(variables)
}
