---
summary: Open a workspace, connect to its engine, and inspect your first signal.
updated: 2026-10-25T12:35
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



# Creating a Schematic



# Creating a DCode Automation


# Exporting Channels, Events, and Logs



