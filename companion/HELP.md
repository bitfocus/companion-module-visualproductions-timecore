## Visual Productions TimeCore

This module enables Companion to control the TimeCore device.

### Setup

- Enter the IP of your TimeCore device into the module configuration.
- If you have changed the Receiving TCP Port of your device, you can adjust it in the configuration. Otherwise, leave it as the default (7000)

### Actions

- **Execute action** – Run an action from the device with optional argument
- **Set action list state** – Enable or disable an action list
- **Set timecode state** – Start, Stop, Restart, or Pause internal timecode
- **Set timecode frame** – Set the internal timecode value (format: HH:MM:SS.FF)
- **Set timer state** – Start, Stop, Restart, or Pause a timer (1–4)
- **Set timer value** – Set the value for a specific timer (format: HH:MM:SS.t)
- **Set variable value** – Set a variable on the device
- **Refresh variable** – Refresh a single variable from the device
- **Refresh all variables** – Refresh all variables from the device
- **Core blink** – Trigger device blink

### Feedbacks

- **Timer Below Value** – Active when the selected timer (1–4) is below the given timecode threshold (e.g. light up when under 10 seconds)
- **Receiving** – Active when the selected external timecode source is receiving (SMPTE, MIDI, Art-Net, RTP MIDI, sACN, TCP, or UDP)

### Variables

- **Device Uptime** (`uptime`)
- **Internal Timecode Value** (`tc_internal`)
- **Timecode Internal FPS** (`tc_internal_fps`)
- **Received SMPTE Timecode Value** (`tc_smpte`)
- **Timecode Received SMPTE FPS** (`tc_smpte_fps`)
- **Received MTC Timecode Value** (`tc_mtc`)
- **Timecode Received MTC FPS** (`tc_mtc_fps`)
- **Received Art-Net Timecode Value** (`tc_artnet`)
- **Timecode Received Art-Net FPS** (`tc_artnet_fps`)
- **Received RTP-MIDI Timecode Value** (`tc_rtpmidi`)
- **Timecode Received RTP-MIDI FPS** (`tc_rtpmidi_fps`)
- **Receiving SMPTE** (`receiving_smpte`) – boolean
- **Receiving MIDI** (`receiving_midi`) – boolean
- **Receiving Art-Net** (`receiving_artnet`) – boolean
- **Receiving RTP-MIDI** (`receiving_rtpmidi`) – boolean
- **Receiving sACN** (`receiving_sacn`) – boolean
- **Receiving TCP** (`receiving_tcp`) – boolean
- **Receiving UDP** (`receiving_udp`) – boolean
- **Timer 1** (`timer_1`)
- **Timer 2** (`timer_2`)
- **Timer 3** (`timer_3`)
- **Timer 4** (`timer_4`)
