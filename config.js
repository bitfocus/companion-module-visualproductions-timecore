import { Regex } from '@companion-module/base'

export const configFields = [
    {
        type: 'textinput',
        id: 'targetIp',
        label: 'TimeCore IP address',
        tooltip: 'The IP address of the TimeCore device',
        width: 12,
        default: '192.168.1.10',
        regex: Regex.IP
    },
    {
        type: 'number',
        id: 'targetPort',
        label: 'TimeCore TCP Port',
        tooltip: 'The TCP port of the TimeCore device',
        width: 6,
        default: 7000,
        regex: Regex.PORT
    },
]
    