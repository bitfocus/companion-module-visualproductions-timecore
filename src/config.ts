import { Regex, SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig {
	targetIp: string
	targetPort: number
}

export const configFields: SomeCompanionConfigField[] = [
	{
		type: 'textinput',
		id: 'targetIp',
		label: 'TimeCore IP address',
		tooltip: 'The IP address of the TimeCore device',
		width: 12,
		default: '192.168.1.10',
		regex: Regex.IP,
	},
	{
		type: 'number',
		id: 'targetPort',
		label: 'TimeCore TCP Port',
		tooltip: 'The TCP port of the TimeCore device',
		width: 6,
		default: 7000,
		min: 1,
		max: 65535,
	},
]
