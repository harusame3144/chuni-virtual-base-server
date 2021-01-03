# chuni-virtual-base-server

Chunithm virtual base server SDBT_1.35 (Chunithm Amazon Plus 1.35)

Source: <https://gist.github.com/esterTion/d03d8f80e497181026f2c1fd73598547>  

Ported Node.js & fixed 1.35 by Sannoob#3144

## Steps
### 0. Install node.js & run
Install node.js this link [https://nodejs.org/](https://nodejs.org/)

#### 0-1. Download it & install
- After installation, you can test it with the following command `node --version`
```
C:\>node --version
v12.18.3
```
#### 0-2. Clone & Configure the server
##### 0-2-1. Clone & Install dependencies
* Clone repository (or download it)
```
C:\>git clone https://github.com/sannoob/chuni-virtual-base-server
Cloning into 'chuni-virtual-base-server'...
remote: Enumerating objects: 5, done.
remote: Counting objects: 100% (5/5), done.
Receiving objects:  60% (3/5)100% (5/5), done.
Receiving objects: 100% (5/5), done
```
* Change directory to ./chuni-virtual-base-server
```.
C:\>cd ./chuni-virtual-base-server
```
* Install node dependencies
```
C:\chuni-virtual-base-server\>npm install
[            ......] - extract:es6-promise: sill extract es6-promise@4.2.8 extracted to C:\chuni-virtual-base-server
```
##### 0-2-2. Edit config.js (before edit rename config.inc.js to config.js)
```
module.exports = {
  tcpListenIp: '0.0.0.0', // TCP Server Listening IP (I don't recommend changing this)
  hostIp: '192.168.191.153', // Server Host IP (runs this app)
  broadCastIp: '192.168.191.255', // Host IP's broadcast address (example: 192.168.100.101 -> 192.168.100.255)
  broadCastInterval: 1000 // Broadcast interval (ms) 1sec = 1000ms
}
```
##### 0-2-3. Run Server
- Using `npm run start` or `start.bat`
* Start server
```
C:\chuni-virtual-base-server\>npm run start
> chuni-virtual-base-server@0.1.0 start C:\chuni-virtual-base-server
> node ./virtualbaseserver

Configs
tcpListenIp: 0.0.0.0 hostIp: 192.168.191.153
broadCastIp 192.168.191.255 broadCastInterval 1000 (broadcast between 1 seconds)
UDP1 Broadcast true 0.0.0.0:50001
UDP1 Listening on 0.0.0.0:50001
UDP2 Broadcast true 0.0.0.0:50001
UDP2 Listening on 0.0.0.0:50003
TCP1 Listening on 0.0.0.0:50001
```
- Server is running!

### 1. Basic Setup
#### 1-1. patch chuniApp.exe (SDBT_1.35.00/app/bin/chuniApp.exe)
Head-to-head patch to chuniApp.exe from <https://mon.im/bemanipatcher/chuniamazon.html>

#### 1-2. copy & paste option files
You need to copy all files in `SDBT_1.35.00/option` folder and paste them into `SDBT_1.35.00/app/data` folder (folders like AXXX)
### 2. segatools.ini setup
- Open segatools.ini with your favorite editor (I recommended Notepad++)
#### 2-1. [netenv] / addrSuffix / routerSuffix
Add this lines below [netenv]
```
addrSuffix=XXX
routerSuffix=XXX
```
> **addrSuffix** is the LAN suffix.   
> If your ip is 192.168.191.**101** then addrSuffix is **101**.

> **routerSuffix** is your router suffix
> If your router's ip is 192.168.191.**1** then routerSuffix is **1**
> If you don't have a router IP using a service like Zerotier, set the same value as addrSuffix.

#### 2-2. [keychip] / subnet
- Subnet must start with 192.168.
Edit subnet like this
```
subnet=192.168.100.0
```
> For Example, if your ip is 192.168.191.101 -> **192.168.191.0** is your /24 subnet