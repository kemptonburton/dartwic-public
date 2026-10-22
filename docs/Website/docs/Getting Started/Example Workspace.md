---
title: Example workspace
summary: Run a simulated test stand with DCode automation and an optional flight peer.
created: 2026-10-05T13:24
updated: 2026-10-21T15:08
---


This workspace pairs a simulated test stand with DCode calculations, valve controllers, warnings, and a fill-and-ignition timeline. A separate C++ flight peer demonstrates communication between nodes. No physical equipment is required.

The actual workspace is `example-workspace/`. The adjacent `walkthroughs/`, `tools/`, and `flight-computer/` folders contain exercises, client scripts, and the peer application. Keep them together when cloning or extracting the repository.

## Start

1. Use DARTWIC Engine and Interface 2.0.0 or newer and the matching [example plugin](https://github.com/kemptonburton/dartwic-example-plugin). Core 2.0.0 packages will be published separately. The downloadable ZIP includes the built plugin at `example-workspace/default/downloads/plugin-win32-x64.zip`, so running that download needs no C++ compiler. Your license must permit the example tasks.
2. Clone this repository into `workspaces/dartwic-example-workspace`, or extract `dartwic-example-workspace.zip` under `workspaces/`. Keep `example-workspace/`, `tools/`, `flight-computer/`, and `walkthroughs/` together.
3. In the Interface, choose **Add workspace** and select `workspaces/dartwic-example-workspace/example-workspace`. The updated development Interface also accepts the repository root and resolves its nested workspace automatically; older Interface releases require the explicit `example-workspace/` folder. Do not select `default/`. Install the required plugins and start the local Engine from the Interface. The command examples below use base port 7400; select that port for the exercise or pass your actual port to the client and native-peer commands. Engine installation, instance configuration, credentials, and runtime storage are managed by DARTWIC, not by this repository's scripts.
4. Open **Schematics -> Engine Test Fire**. Confirm CONNECTED and SENSOR VALID are 1 and the sample counter advances. The driver and Lua controllers start; RUN TEST stays off. **Rocket Flight** is a separate schematic for the flight peer.

## Optional flight node

The test-stand exercises work without the flight computer. For the peer exercises, start the separate flight demo in PowerShell 7:

```powershell
./tools/start-demo.ps1
```

The script starts only `flight-computer/bin/rocket-flight-peer.exe`, in the background. It does not start or stop an Engine, install plugins, prompt for Engine credentials, or change workspace files. It checks for an immediate process exit and reports the flight error log if startup fails. A successful start means the process is running; confirm the **FLIGHT_COMPUTER** peer is connected and its sample counter advances before using it. The packaged ZIP includes the flight executable; for a source clone, build it with this repository's CMake project or use its Windows download. Pass `-FlightExecutable` to use another build. You can also run the flight peer directly in a terminal:

```powershell
./flight-computer/bin/rocket-flight-peer.exe --transport custom
```

Ground receives on 17600 and sends to 17601. Flight uses the reverse endpoints. Flight-owned channels appear as `FLIGHT_COMPUTER:<name>`. The ground sends only quick-disconnect state to the flight peer; the engine test device does not supply flight telemetry.

The authored idle channels are tracked under `default/rapid/channel_snapshot.json`, and the Interface installs the plugin dependencies declared in `default/project.json`. The workspace's simulated device can run without the separate flight peer; start the peer when doing flight-computer exercises.

## Storage layout

The workspace's portable settings live in `global_data/settings.json`; project overrides belong in `default/settings.json`. The rocket model is a shared asset at `global_data/assets/models/`, referenced as `assets/models/...` by its schematic. Tasks, scripts, modules, and authored channel definitions are portable too. Local instance configuration, passwords, license keys, recordings, and caches are not part of this repository or release archive.

The flight scripts keep only a process record and flight stdout/stderr logs under `%LOCALAPPDATA%/DARTWIC Flight Demo/<repository-hash>/`. The hash keeps separate clones independent. Engine binaries and shared plugins remain in your Engine installation; this repository does not ship or create an `engine/` directory.

Use Engine and Interface 2.0.0 or newer for layered settings and shared asset APIs. See the plugin's [storage and settings guide](https://github.com/kemptonburton/dartwic-example-plugin/blob/main/docs/storage-and-settings.md) for plugin settings, module settings, and Model3D asset examples.

The example plugin's settings panel saves decimal precision, unit display, and a resource title at project scope. Open **Example Telemetry** to see those settings applied to live values from the device binding tables. The workspace supplies portable defaults; these display settings do not change the simulated hardware.

## Operate and record

Open **Engine Test Fire** and turn RUN TEST on. The timeline begins at T-2m with a prompt for the recording name. Enter a name to create its dataframe. At T-1m it starts the tank-fill controller, which asks for a target fill percentage; use 60 to try it.

The controller alternates filling and venting as pressure rises. The supply level stays at 100% in this simulation. The timeline holds at the next bucket if filling is unfinished. Once fill completes, the T+0s ignition bucket starts the igniter, waits two seconds, and opens the feed valves for an eight-second firing interval. The T+15s cleanup bucket stops the dataframe.

Requests, applied coils, and measured valve positions are separate channels; compare them when checking a result.

The other switches inject overtemperature, disagreement, missing readings, or disconnection. Clearing a fault releases its overrides automatically; it does not reset the sequence or restore an old command value. Stop RUN TEST before clearing an abort when you intend to remain idle.

The timeline's dataframe contains its selected channels. For an exercise needing additional signals or ARGUS filters, create a separate frame through **Data → Dataframes → New dataframe**, choose **Start now**, and select the required channels, events, and logs. Stop that frame yourself after the exercise. Stopping a frame does not stop equipment.

Open the saved dataframe to review its graph and event/log history, or export its ZIP. Channel writes record on value change in this example; the separate engine auto recorder can also sample unchanged values. Check both recording settings when interpreting sample counts.

For flight exercises, open **Rocket Flight** and start the flight peer. `rocket_launch_sequence` releases the ground quick disconnect and calls the saved `launch-rocket` operation; `rocket_land_sequence` calls `land-rocket`. Flight owns its altitude, velocity, and phase channels.

## Stop

Turn RUN TEST off and clear injected faults. Run `./tools/stop-demo.ps1` to stop only the background flight peer started by the start script. It checks both the executable path and process start time before stopping the recorded PID. For a flight peer started directly in a terminal, use Ctrl+C instead. Stop the Engine through the Interface. Stopping a dataframe does not stop the device.

The plugin contains `engine/src/example_device_driver.cpp`, `engine/include/example_device_module.h`, `engine/src/example_device_discovery.cpp`, and `engine/src/example_transport.cpp`. This repository keeps the matching flight application in `flight-computer/main.cpp`; its build fetches a locked copy of the public plugin dependencies. Building source requires CMake, C++20, and vcpkg, but no private DARTWIC checkout. The [C++ TEMPEST Peer guide](../Clients/C%2B%2B%20TEMPEST%20Peer.md) walks through the connection, channel publication, and command handlers with code. See [flight-computer/README.md](https://github.com/kemptonburton/dartwic-example-workspace/blob/main/flight-computer/README.md) for source build details.

[Download the repository](/downloads/dartwic-example-workspace.zip), [Windows flight peer](/downloads/rocket-flight-peer-windows-x64.zip), and [example plugin](/downloads/plugin-win32-x64.zip).
