export function setupActions(instance) {
    instance.setActionDefinitions({
        executeAction: {
            name: "Execute action",
            description: "Execute a specific action inside an specific action list",
            options: [
                {
                    type: 'dropdown',
                    label: 'Action List',
                    id: 'selectedActionList',
                    default: 1,
                    choices: [
                        { id: 1, label: "Action List 1" },
                        { id: 2, label: "Action List 2" },
                        { id: 3, label: "Action List 3" },
                        { id: 4, label: "Action List 4" },
                        { id: 5, label: "Action List 5" },
                        { id: 6, label: "Action List 6" },
                        { id: 7, label: "Action List 7" },
                        { id: 8, label: "Action List 8" },
                    ],
                },
                {
                    type: 'number',
                    label: 'Action',
                    id: 'selectedAction',
                    min: 1,
                    max: 48,
                    default: 1,
                },
                {
                    type: 'textinput',
                    label: 'Argument',
                    id: 'targetArgument',
                },
            ],
            callback: async (action, context) => {
                instance.sendMessage("core-al-" + action.options.selectedActionList + "-" + action.options.selectedAction + "-execute=" + action.options.targetArgument);
            },
        },
        setActionListState: {
            name: "Set action list state",
            description: "Enable/Disable a specific action list",
            index: 1,
            options: [
                {
                    type: 'dropdown',
                    label: 'Action List',
                    id: 'selectedActionList',
                    choices: [
                        { id: 1, label: "Action List 1" },
                        { id: 2, label: "Action List 2" },
                        { id: 3, label: "Action List 3" },
                        { id: 4, label: "Action List 4" },
                        { id: 5, label: "Action List 5" },
                        { id: 6, label: "Action List 6" },
                        { id: 7, label: "Action List 7" },
                        { id: 8, label: "Action List 8" },
                    ],
                },
                {
                    type: 'dropdown',
                    label: 'State',
                    id: 'selectedState',
                    default: "true",
                    choices: [
                        { id: "true", label: "Enable" },
                        { id: "false", label: "Disable" },
                    ],
                },
            ],
            callback: async (action, context) => {
                instance.sendMessage("core-al-" + action.options.selectedActionList + "-enable=" + action.options.selectedState);
            },
        },
        internalTimecodeState: {
            name: "Set timecode state",
            description: "Start/Stop/Restart/Pause the timecode",
            options: [
                {
                    type: 'dropdown',
                    label: 'Action',
                    id: 'selectedAction',
                    default: "start",
                    choices: [
                        { id: "start", label: "Start" },
                        { id: "stop", label: "Stop" },
                        { id: "restart", label: "Restart" },
                        { id: "pause", label: "Pause" },
                    ],
                },
            ],
            callback: async (action, context) => {
                instance.sendMessage("core-tc-" + action.options.selectedAction);
            },
        },
        setInternalTimecode: {
            name: "Set timecode frame",
            description: "Set the internal timecode frame",
            options: [
                {
                    type: 'textinput',
                    label: 'Timecode',
                    id: 'targetTimecode',
                    default: "12:00:00:00",
                    regex: instance.timecodeRegex
                },
            ],
            callback: async (action, context) => {
                instance.sendMessage("core-tc-set=" + action.options.targetTimecode);
            },
        },
        timerState: {
            name: "Set timer state",
            description: "Start/Stop/Restart/Pause a timer",
            options: [
                {
                    type: 'dropdown',
                    label: 'Timer',
                    id: 'selectedTimer',
                    default: 1,
                    choices: [
                        { id: 1, label: "Timer 1" },
                        { id: 2, label: "Timer 2" },
                        { id: 3, label: "Timer 3" },
                        { id: 4, label: "Timer 4" },
                    ],
                },
                {
                    type: 'dropdown',
                    label: 'Action',
                    id: 'selectedAction',
                    default: "start",
                    choices: [
                        { id: "start", label: "Start" },
                        { id: "stop", label: "Stop" },
                        { id: "restart", label: "Restart" },
                        { id: "pause", label: "Pause" },
                    ],
                },
            ],
            callback: async (action, context) => {
                instance.sendMessage("core-tm-" + action.options.selectedTimer + "-" + action.options.selectedAction);
            },
        },
        setTimerValue: {
            name: "Set timer value",
            description: "Set the value for a specific timer",
            options: [
                {
                    type: 'dropdown',
                    label: 'Timer',
                    id: 'selectedTimer',
                    default: 1,
                    choices: [
                        { id: 1, label: "Timer 1" },
                        { id: 2, label: "Timer 2" },
                        { id: 3, label: "Timer 3" },
                        { id: 4, label: "Timer 4" },
                    ],
                },
                {
                    type: 'textinput',
                    label: 'Time',
                    id: 'targetTime',
                    default: "12:00:00:00",
                    regex: instance.timecodeRegex
                },
            ],
            callback: async (action, context) => {
                instance.sendMessage("core-tm-" + action.options.selectedTimer + "-set=" + action.options.targetTime);
            },
        },
        setVariable: {
            name: "Set variable value",
            description: "Set the value for a specific variable",
            options: [
                {
                    type: 'dropdown',
                    label: 'Variable',
                    id: 'selectedVariable',
                    default: 1,
                    choices: [
                        { id: 1, label: "Variable 1" },
                        { id: 2, label: "Variable 2" },
                        { id: 3, label: "Variable 3" },
                        { id: 4, label: "Variable 4" },
                        { id: 5, label: "Variable 5" },
                        { id: 6, label: "Variable 6" },
                        { id: 7, label: "Variable 7" },
                        { id: 8, label: "Variable 8" },

                    ],
                },
                {
                    type: 'number',
                    label: 'Value',
                    id: 'targetValue',
                    default: 1,
                },
            ],
            callback: async (action, context) => {
                instance.sendMessage("core-va-" + action.options.selectedVariable + "-set=" + action.options.targetValue);
            },
        },
        refreshVariable: {
            name: "Refresh variable",
            description: "Refresh a specific variable",
            options: [
                {
                    type: 'dropdown',
                    label: 'Variable',
                    id: 'selectedVariable',
                    default: 1,
                    choices: [
                        { id: 1, label: "Variable 1" },
                        { id: 2, label: "Variable 2" },
                        { id: 3, label: "Variable 3" },
                        { id: 4, label: "Variable 4" },
                        { id: 5, label: "Variable 5" },
                        { id: 6, label: "Variable 6" },
                        { id: 7, label: "Variable 7" },
                        { id: 8, label: "Variable 8" },

                    ],
                },
            ],
            callback: async (action, context) => {
                instance.sendMessage("core-va-" + action.options.selectedVariable + "-refresh");
            },
        },
        refreshAllVariables: {
            name: "Refresh all variables",
            description: "Refresh all variables",
            options: [],
            callback: async (action, context) => {
                instance.sendMessage("core-va-refresh");
            },
        },
        coreBlink: {
            name: "Core blink",
            description: "Momentarily flashes the TimeCore’s LED",
            options: [],
            callback: async (action, context) => {
                instance.sendMessage("core-blink");
            },
        },
    })
}