# How to Expose Your Local Server (Port 3000)

Since you are facing network/firewall issues with Cloudflare and Localtunnel, here are the best working methods for this environment.

## Method 1: Serveo (No Installation Required) - **RECOMMENDED**
This uses SSH explicitly and often bypasses firewalls that block other tools.

1. Open your terminal.
2. Run this command:
   ```bash
   ssh -o StrictHostKeyChecking=no -R 80:localhost:3000 serveo.net
   ```
3. It will generate a public URL like `https://examples.serveo.net`.
4. Keep the terminal window open to keep the connection alive.

## Method 2: Pinggy (No Installation)
Another SSH-based tunnel that provides a quick URL.

1. Open your terminal.
2. Run:
   ```bash
   ssh -p 443 -R0:localhost:3000 a.pinggy.io
   ```

## Method 3: Ngrok (Robust & Reliable)
If the above methods fail or disconnect often, Ngrok is the industry standard.

1. Go to [ngrok.com](https://ngrok.com) and sign up (free).
2. Download and install ngrok.
3. Authenticate using the command they provide (e.g., `ngrok config add-authtoken ...`).
4. Run:
   ```bash
   ngrok http 3000
   ```
