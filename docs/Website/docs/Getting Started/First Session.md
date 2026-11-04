---
summary: Open a workspace, connect to its engine, and inspect your first signal.
updated: 2026-10-30T22:30
created: 2026-08-03T15:41
---

This guide walks through installing DARTWIC, connecting a device, displaying its data, running an automation, and exporting the results.

# Intro

You can follow this session with an Engine on your computer or one already running on your team's network.

For how the Engine, Interface, workspaces, and projects fit together, read [Overview](Overview.md).

# Installing an Interface

To start, you will need access to an interface. You have two options for interfaces, a personal desktop one, or a shared webserver interface. Some teams may setup the webserver interface on their local network to allow for a no-setup connection on any device that has a web browser. Some may prefer to download their own desktop interface and use that as well.

## Desktop Interface

Start by downloading the desktop interface from the [Downloads](https://kemptonburton.com/areas/dartwic/downloads) page.

![](_attachments/Pasted%20image%2020261024155126.png)

Unzip the file contents into a folder. You can name it whatever you want, but the recommended files structure for a DARTWIC setup is shown below. Once the contents are unzipped, you can launch `DARTWIC Interface.exe`.

```
dartwic/
    interface/ (the file you just downloaded)
        DARTWIC Interface.exe   (the interface app)
```

You then should see the interface app launch.

## Webserver Interface

Start by downloading the webserver interface from the [Downloads](https://kemptonburton.com/areas/dartwic/downloads) page.

![](_attachments/Pasted%20image%2020261024155126.png)

Unzip the file contents into a folder. Just like for the desktop interface, you can name it whatever you want, but the recommended files structure for a DARTWIC setup is shown below.

```
dartwic/
    interface/ (the file you just downloaded)
        DARTWIC Webserver.exe   (the interface app as a webserver)
        config.json   (webserver config)
```

Inside you will find the `DARTWIC Webserver.exe`, and a `config.json`. Inside the config you can configure the `ip` and `port` that the webserver is hosted on. The default config is shown below.

```json
{
    "ip": "127.0.0.1",
    "port": 4000
}
```

Start the webserver by launching `DARTWIC Webserver.exe`. To open the interface, paste the `address` into your browser (address is `ip`:`port`)

For example, to open the default interface, you would paste `127.0.0.1:4000` into your browser.

## Configuring the Interface

Once you are in the interface, the only configuration you might want to do is enter your `User` credentials in the `Settings` menu. These credentials are just for visualization purposes, you can enter a name, role, and profile picture that other operators can see once you are connected to an engine.

Open settings

![](_attachments/Pasted%20image%2020261024191820.png)

Click on the `User` tab, and configure your username, name, role, and profile icon, among other things. Your user profile is saved by each engine you connect to. If you already have a profile on an engine that does match your current one, you will be asked to either overwrite the one on the engine, or the one on your interface.

![](_attachments/Pasted%20image%2020261024192032.png)

You can also edit the appearance of the interface, configure TEMPEST network discovery (how your interface finds engines already running on your network), your local engine and workspace folder, and as well as your interface and local, or connected engine version.

# Starting a Local Engine

This section explains how to auto download an engine and starter workspace, as well as start and connect to the locally running engine. If your team already has an engine running check out how to [Connect to an Existing Engine](#connecting-to-an-existing-engine).

Since you will be starting an engine, you will require a license key. You can download a free one on the same downloads page above. Click the button on the downloads page, enter the optional information, and generate a key. 

If you loose it, just generate another one. Keep it copied, when you configure your first local engine workspace you will need it.

![](_attachments/Pasted%20image%2020261024160310.png)


Once open, you can then download a matching engine and workspace setup in a few clicks. The video below shows you how to do that.

![](_attachments/engine-workspace-install.mp4)

Once you auto install the engine and workspace, you should have this file structure: 

```
dartwic/
    interface/ 
    engine/
    workspaces/
        workspace/  (starter workspace)
```


In the interface settings you can see the binded engine and workspaces folder in your settings.

![](_attachments/Pasted%20image%2020261024184159.png)

The engine folder stores engine binaries, assets, and workspace setups (called instances) used to launch local workspaces on your machine.

Unmanaged local workspaces in the `Workspaces Folder` will be automatically discovered and will have a button to auto create an engine instance so you can manage the workspace locally, start the engine, and connect to it.

The video below shows how to setup that local workspace, bind it to an engine, input a license key (the one you got above), start the engine, and connect.

![](_attachments/workspace-startup.mp4)

Once the engine is started, you can shutdown or restart the engine in the connection screen, if its a locally managed engine.

![](_attachments/Pasted%20image%2020261024194524.png)

Or in the node tab while connected.

![](_attachments/Pasted%20image%2020261024194610.png)

# Configuring an Engine

The engines config settings can be edited either manually, while disconnected from the engine, or while connected to the engine.

The Engine config is in `engine/instances/<instance-name>/config.json`. The packaged starter workspace uses `instances/default/` whether you set it up in the Interface or launch the Engine executable directly. Other new workspaces usually use their folder name for the instance. Changes apply on restart.

For example, if you wanted to edit the admin password, you can edit the `config.json` manually, and restart the engine.

Additionally, anyone connected to the interface as an admin can edit the engine settings, which will apply after an engine restart, shown below.

![](_attachments/Pasted%20image%2020261024193411.png)

If your engine is a local engine and binded to the interface, you also can access an engine config tab in the edit popup on the engine connection button to change the config as well.

![](_attachments/Pasted%20image%2020261024194313.png)

# Connecting to an Existing Engine

This section describes how to connect to an engine that is already running on your connected network, not on your local machine.

It is quite easy. If you have TEMPEST Network Discovery on (which is on by default), and the engine is reachable from your current network, then the engine should show up in the interface automatically.

![](_attachments/Pasted%20image%2020261024192639.png)

If it is your fist time connecting, you will have to enter the `server authentication password`. Ask whoever started the engine for it. View [Configuring an Engine](#configuring-an-engine) to see how to find or edit engine config settings.

Or you could connect as a `Viewer`, which limits the commands you can send to the engine.

If your engine node is not showing up automatically, you can click the `Add a node` button and enter the `TEMPEST IP` and `TEMPEST Port` of the engine to connect.

You can find the TEMPEST IP and port that the engine is running on by checking the engine config while connected (or manually in `config.json`), or by checking the logs. You can view engine logs by clicking the log button in the node bar on the bottom of the interface. The IP and port are printed on startup.

![](_attachments/Pasted%20image%2020261024203349.png)


# Installing a Plugin and Setting Up a Module

Once connected, we can install a plugin to communicate with a device. In this guide, we will use the simulated device in the Example Plugin.

It mimics how actual device drivers are written, such as those for ModBus, LabJack, and Ethercat devices, which are all available plugins for DARTWIC.

## Plugin Browser

The interface can automatically install engine and interface plugins. Open **Settings → Plugins → Browse Plugins**.

![](_attachments/Pasted%20image%2020261026225149.png)

Search Example Device Plugin, select it from the browser, and then hit the Install button.

![](_attachments/Pasted%20image%2020261026225330.png)

The interface and engine plugins will be installed, and then a prompt to restart the engine will popup. Because the plugin has a engine component, the engine needs to restart. Select Yes.

![](_attachments/Pasted%20image%2020261026225431.png)

While the engine is restarting, the Interface will be disconnected, and you will see this screen. 

![](_attachments/Pasted%20image%2020261026225459.png)

Depending on the size of the DARTWIC workspace, startup can take quite a bit. Once startup completes, the interface will automatically reconnect.

You should now be able to see the plugin in the settings Plugins list, and see that it has the Engine Installed and Loaded, and Interface Installed and Loaded badges.

![](_attachments/Pasted%20image%2020261026225922.png)

## Setup a Module

Upon downloading the plugin and restarting the engine, you will see a popup in the bottom right for the mock example device discovery

![](_attachments/Pasted%20image%2020261026230635.png)

You can check notifications by clicking the notification button on the top right. Local interface notifications will pop up here such as interface specific warnings, like clock time-zone errors, and global engine notifications that show for all operators, such as device discovery notifications.

Depending on how the plugin is written, you can mute the notification, which be muted engine wide. This is useful if you would like to ignore a device discovery suggestion. On unmute, the popup will show itself again. 

Once the device has been set up, its notification should not popup again. The ModBus, LabJack, and Ethercat plugins also have automatic device discovery set up.

![](_attachments/Pasted%20image%2020261026230734.png)

![](_attachments/Pasted%20image%2020261026230941.png)

![](_attachments/Pasted%20image%2020261026231002.png)

Select the module you want to setup, configure any tasks or channels it suggests, and then review and create. 3 clicks creates a module, channels, and its respective tasks.

You can then open the module in the Modules tab, and start the tasks by clicking the start buttons.

You can also open the task in the Tasks resource by clicking the task icon button in to the left of the task controls. In the Tasks resource you can configure the task bindings such as which device address writes to which RAPID channel. For example, which ModBus analog input register reads to which RAPID channel in a read task.

![](_attachments/Pasted%20image%2020261026231551.png)

Lastly, if you are ever curious on what your channels data is coming from, what task or module is writing it, and what hardware configuration it is using, you can use the Channels searcher. Read more here: [Channels](../Interface/Channels.md).

# Creating a Schematic

One of the main features of DARTWIC is visualization; You can create a Schematic, which is a canvas that you can use to visualize fluid systems, graphs, engines, valves, etc.

Select the schematics tab, right click in the file explorer, and click Create Resource, and give it a name, then open it by clicking it.

![](_attachments/Pasted%20image%2020261026232104.png)

You can then drag and drop any channel from the linked task view in your module, and add it to a node.

The video below shows taking the `fuel_open_coil` channel and dropping it onto the schematic to create a valve.

![](_attachments/schematic-dropin-video.mp4)

Because the `fuel_open_coil` has a matching `fuel_open_coil_state` channel, its `_state` channel will automatically be used as the state channel for that valve, and the `fuel_open_coil` will be used as the command channel for that valve.

# Creating a DCode Automation

The example device has separate open and close coils. This DCode automation turns a single valve request into a half-second pulse on the appropriate coil to open and close it.

Keep the device's read/write tasks running. The names below use the default `example_device_` prefix; adapt them if you changed your task mappings.

Under **Scripts**, create `valves.yaml` and `double_acting_valves.dcode` in the same folder. Each YAML row creates one valve loop:

```yaml
valves:
  - valve: fuel
  - valve: oxidizer
  - valve: fill
  - valve: vent
```

Put this in `double_acting_valves.dcode`:

```dcode
params = yaml "./valves.yaml#valves"

template(params) loop example_valve_{params.valve} 10 disable_warnings:
    once:
        state.last_value = null

    value = |example_device_{params.valve}_request|

    if value == state.last_value:
        return

    state.last_value = value

    if value == 1:
        command |example_device_{params.valve}_open_coil| = 1
        wait(0.5)
        command |example_device_{params.valve}_open_coil| = 0
        set |example_device_{params.valve}_state| = 1
    elif value == 0:
        command |example_device_{params.valve}_close_coil| = 1
        wait(0.5)
        command |example_device_{params.valve}_close_coil| = 0
        set |example_device_{params.valve}_state| = 0
```

Save both files and run the DCode file in **DCode · Lua** mode (**Ctrl+R**). You can also run usin the Run button in the Editor. Activation starts the loops; an initial request of `0` sends a close pulse.

![](_attachments/Pasted%20image%2020261030173121.png)

Click the dropdown arrow to expand the template to see what Loops it makes. You can then **Ctrl + Click** a channel to open it in the task editor

Command `example_device_fuel_request` to `1` to open or `0` to close. Its coil should pulse once for each changed request.

![](_attachments/Pasted%20image%2020261030173355.png)

Now, drag and drop `example_device_fuel_request` into the schematic, and it should add the new valve, and you should be able to command it.

See [Templates and Configuration](../DCode/Templates%20and%20Configuration.md) and [Loops](../DCode/Loops.md) for more detail.

# Exporting Channels, Events, and Logs

## Channels

Now select all the channels related to `example_device_fuel` in the Channels List using the select all button, and open them in telemetry using the Open in Telemetry button.

![](_attachments/Pasted%20image%2020261030173735.png)

You can then scroll out to find where the channels were changing, zoom in and pan to it, and choose **Export telemetry → Channels → Export visible range** for CSV samples. Check **Events** and **Logs** to include their recordings for the same period. See [Telemetry Export](../Interface/Telemetry%20Graphs.md#export-data).

## Events and Logs

You can also view Events or Logs that occurred during the same time as that time range, and export them with the channels also. Click the Show ARGUS Events and Show ARGUS Logs buttons to show them.

![](_attachments/Pasted%20image%2020261030174036.png)

Both export `.jsonl` files, including matching recordings beyond the loaded preview.

The same exports are available under **Data → Databases**. Stay connected until completion. See [Export Events](../Interface/Events%20and%20Logs.md#export-events), [Export Logs](../Interface/Events%20and%20Logs.md#export-logs), and [channel recording settings](../Engine/Recording%20and%20Telemetry.md#channel-recording).

# Conclusion

You have now connected to an Engine, set up a simulated device, built a schematic, controlled valves with DCode, and exported your results. You can build on this setup with more automation, additional schematic controls, or a plugin for your own hardware.

To explore further:

- [Interface guides](../Interface/Overview.md) — walkthroughs of the resources and controls.
- [DCode guides](../DCode/Overview.md) — build tasks, sequences, calculations, and events.
- [Engine guides](../Engine/Overview.md) — understand channels, automation, networking, and recording.
- [Plugin guides](../Plugins/Overview.md) — connect hardware and extend DARTWIC.
