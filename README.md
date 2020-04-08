### `tcplag`

Trying to lag a TCP connection with some magic.

#### How it works

> **tcplag** is a MITM server between you and the server, you connect to **tcplag** server, then you can control the lag state with keys such as `x` to enter the lag mode and `c` to exit.

```rb
prompt / global input -> controls the lag state (true or false) 
tcplag (server) -> connection -> lag controller -> target server 
```

#### Limitations

- Global input key configuration is shitty.
- You'll receive packets from the server.
- Only one session is allowed.

#### Getting Started

##### Requirements

- [NodeJS](http://node.js.org) and Package Manager (`yarn` or `npm`)

###### TypeScript

This project contains TypeScript files, you can compile or run these files directly.

- If you'd like to compile it to get a optimized source code, just follow [getting started](#getting-started) section.
- If you'd like to run directly instead of compiling you can install `typescript` and `ts-node`.

```sh
# NPM
npm i -g typescript ts-node

# Yarn
yarn global add typescript ts-node
```

#### Installing project dependencies

Before running anything, you'll need to install the project dependencies. You can use one of the following commands based on your favorite package manager.

```sh
# NPM
npm install

# Yarn
yarn 
```

#### Configuration

Copy [`.env.example`](.env.example) to [`.env`](.env) and open it on your favorite text editor.

```ini
# The port where the MITM will listen at.
MITM_PORT=
```

> **MITM_PORT**: This is the port where your `tcplag` server will run.

```ini
# The target server address. (the port is required)
# eg. sohu.com:80
TARGET_ADDRESS=
```

> **TARGET_ADDRESS**: Here you put you target server.

```ini
# The key used to pause a session. (default: x)
PAUSE_KEY=

# The key used to resume session. (default: c)
PLAY_KEY=
```

> **PAUSE_KEY**, **PLAY_KEY**: Inside these fields you can use custom keys to pause or resume lag.

#### Running

Finally, compile it and run by executing the following command inside a terminal.

```sh
# Compiling & Running
yarn build && yarn start
```

> If you have installed `ts-node`, you can run it directly with the source folder as input.
> ```sh
> ts-node src
> ```

#### What I do now?

After running `tcplag`, you can log into your **tcplag** server and control the lag state globally or via terminal.

#### License

[MIT](/LICENSE) &copy; nakamidev