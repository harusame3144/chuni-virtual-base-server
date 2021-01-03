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
Microsoft Windows [Version 10.0.19041.685]
(c) 2020 Microsoft Corporation. All rights reserved.

C:\>node --version
v12.18.3
```

#### 0-2. Clone & Configure the server
```
Microsoft Windows [Version 10.0.19041.685]
(c) 2020 Microsoft Corporation. All rights reserved.
// Clone repository (or download it)
C:\>git clone https://github.com/sannoob/chuni-virtual-base-server
Cloning into 'chuni-virtual-base-server'...
remote: Enumerating objects: 5, done.
remote: Counting objects: 100% (5/5), done.
Receiving objects:  60% (3/5)100% (5/5), done.
Receiving objects: 100% (5/5), done.
// Change directory to ./chuni-virtual-base-server
C:\>cd ./chuni-virtual-base-server
// npm install (dependencies)
C:\chuni-virtual-base-server\>npm install
[            ......] - extract:es6-promise: sill extract es6-promise@4.2.8 extracted to C:\chuni-virtual-base-server
C:\chuni-virtual-base-server\>npm run start

```

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