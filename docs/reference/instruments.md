# Instruments reference

Snakie ships a set of **instruments** — live panels that read from or drive the
connected board. They are hosted in the main window's instrument dock (or floated
as windows); see [Open and dock instruments](../how-to/use-instruments) and
[Use the device instruments](../how-to/device-instruments) for usage, and
[Non-invasive live telemetry](../explanation/telemetry-design) for how they read
the board safely.

Each instrument has a **kind**:

- **pin** — opened per pin from the Board View node launchers (one instance per pin).
- **singleton** — exactly one instance, toggled on or off.

## Measurement instruments

| Instrument | id | Kind | Purpose |
| --- | --- | --- | --- |
| **Oscilloscope** | `scope` | pin | Plot a pin's signal over time; fed by the on-device telemetry `scope()` helper. |
| **Multimeter** | `meter` | pin | Show a pin's live value (voltage / level) with a bargraph; fed by `meter()`. |
| **Plotter** | `plotter` | singleton | Graph comma/space-separated numbers your program prints to the serial console. |

See the [telemetry API](telemetry-api) for `scope()` / `meter()` / `plot()`.

## Input instruments

| Instrument | id | Purpose |
| --- | --- | --- |
| **Button** | `button` | Read a push-button on a GPIO pin. |
| **Encoder** | `encoder` | Read a rotary encoder's position / direction. |
| **Gamepad** | `gamepad` | Read a connected gamepad's buttons / axes. |
| **IMU** | `imu` | Read an inertial measurement unit (accelerometer / gyro). |
| **Range** | `range` | Read an ultrasonic distance sensor. |

## Output instruments

| Instrument | id | Purpose |
| --- | --- | --- |
| **LED** | `led` | Drive an LED on a GPIO pin. |
| **Buzzer** | `buzzer` | Drive a piezo buzzer (tones). |
| **SAM** | `sam` | Text-to-speech via the SAM voice synthesiser on a pin. |
| **I²C display** | `i2c-display` | Drive an SSD1306 I²C OLED display. |

## Scanners

| Instrument | id | Purpose |
| --- | --- | --- |
| **I²C detect** | `i2c-detect` | Scan an I²C bus and list the device addresses found. |
| **Wi-Fi scan** | `wifi-scan` | Scan for nearby Wi-Fi networks. |
| **Bluetooth** | `bluetooth` | Scan for nearby Bluetooth devices. |

```{note}
Most instruments rely on a small MicroPython helper library on the board. Snakie
offers to install it the first time you open an instrument that needs it (see
[the instruments how-to](../how-to/device-instruments)).
```
