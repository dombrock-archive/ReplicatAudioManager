# ReplicatAudioManager

ReplicatAudioManager is a tool for downloading and updating free and opensource audio tools.

![screenshot](https://github.com/replicat-audio/ReplicatAudioManager/blob/master/demogif1.gif?raw=true)

Features:
* Downloads come directly from the ReplicatAudioManager server and are verified for integrity.
* No 3rd party installers or DRM. ReplicatAudioManager downloads ready to go copies of your tools.
* Allows for all of your tools to be installed to custom locations which are fully portable.

Currently Included Tools:
* GreenWave (Standalone and VST)
* TerminalVelocity (VST)
* Helm (Standalone and VST)
* BlackBird (Standalone and VST)
* More tools to come

![screenshot](https://github.com/replicat-audio/ReplicatAudioManager/blob/master/demogif2.gif?raw=true)

## Front-end
### Run in dev mode
```
cd electron
npm start
```
### Build EXE
```
cd electron
npm run release
```

## Back-end
### Run back-end
```
cd server
# Sync the tables
# This will delete existing tables
node db/_sync
# Run the server
node server
```