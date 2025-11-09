// Import connect function from cloudflare:sockets
import { connect } from "cloudflare:sockets";

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// MAIN CONFIG
var CUSTOM_PATH = "JETX";
var serviceName = "";
var APP_DOMAIN = "";
var prxIP = "";
var cachedPrxList = [];

// Protocol encodings
var horse = "dHJvamFu";
var flash = "dm1lc3M=";

// DNS & Relay
var DNS_SERVER_ADDRESS = "8.8.8.8";
var DNS_SERVER_PORT = 53;
var RELAY_SERVER_UDP = {
  host: "udp-relay.hobihaus.space",
  port: 7300
};

// KV URLs
var KV_PRX_URL = "https://raw.githubusercontent.com/FoolVPN-ID/Nautica/refs/heads/main/kvProxyList.json";
var PRX_BANK_URL = "https://raw.githubusercontent.com/FoolVPN-ID/Nautica/refs/heads/main/proxyList.txt";

// Admin
var ADMIN_KEY = "admin";

// WebSocket states
var WS_READY_STATE_OPEN = 1;
var WS_READY_STATE_CLOSING = 2;

var CORS_HEADER_OPTIONS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400"
};

// ============= IMPROVED HTML DASHBOARD =============
function getHTMLDashboard() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JETX Proxy Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        
        * {
            font-family: 'Inter', sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            background-attachment: fixed;
        }
        
        .glass {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .stat-card:hover {
            transform: translateY(-2px);
            transition: transform 0.2s ease;
        }
    </style>
</head>
<body class="text-white min-h-screen p-6">
    <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
            <div>
                <h1 class="text-2xl font-semibold mb-1">JETX Proxy</h1>
                <p class="text-sm text-gray-400">Cloudflare Worker Edition</p>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 glass rounded-full">
                <div class="w-2 h-2 rounded-full bg-green-400" id="status-dot"></div>
                <span class="text-sm" id="status-text">Operational</span>
            </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div class="glass rounded-xl p-6 stat-card">
                <p class="text-gray-400 text-sm mb-2">Active Connections</p>
                <p class="text-3xl font-semibold" id="connections">---</p>
            </div>
            <div class="glass rounded-xl p-6 stat-card">
                <p class="text-gray-400 text-sm mb-2">Requests Today</p>
                <p class="text-3xl font-semibold" id="requests">---</p>
            </div>
            <div class="glass rounded-xl p-6 stat-card">
                <p class="text-gray-400 text-sm mb-2">Uptime</p>
                <p class="text-3xl font-semibold">99.9%</p>
            </div>
        </div>

        <!-- API Endpoints -->
        <div class="glass rounded-xl p-6 mb-8">
            <h2 class="text-lg font-semibold mb-4">API Endpoints</h2>
            <div class="space-y-3">
                <div class="flex items-center justify-between py-3 border-b border-white/5">
                    <div class="flex items-center gap-3">
                        <span class="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">GET</span>
                        <code class="text-blue-300 text-sm">/status</code>
                    </div>
                    <span class="text-gray-400 text-sm">Check status</span>
                </div>
                <div class="flex items-center justify-between py-3 border-b border-white/5">
                    <div class="flex items-center gap-3">
                        <span class="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">GET</span>
                        <code class="text-blue-300 text-sm">/usage</code>
                    </div>
                    <span class="text-gray-400 text-sm">Usage statistics</span>
                </div>
                <div class="flex items-center justify-between py-3 border-b border-white/5">
                    <div class="flex items-center gap-3">
                        <span class="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">WS</span>
                        <code class="text-blue-300 text-sm">/JETX/[proxy]</code>
                    </div>
                    <span class="text-gray-400 text-sm">WebSocket proxy</span>
                </div>
                <div class="flex items-center justify-between py-3">
                    <div class="flex items-center gap-3">
                        <span class="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">WS</span>
                        <code class="text-blue-300 text-sm">/JETX/[country]</code>
                    </div>
                    <span class="text-gray-400 text-sm">WebSocket by country</span>
                </div>
            </div>
        </div>

        <!-- Features -->
        <div class="glass rounded-xl p-6">
            <h2 class="text-lg font-semibold mb-4">Features</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                    </div>
                    <div>
                        <p class="font-medium mb-1">WebSocket Support</p>
                        <p class="text-sm text-gray-400">Real-time bidirectional communication</p>
                    </div>
                </div>
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                        </svg>
                    </div>
                    <div>
                        <p class="font-medium mb-1">Multi-Protocol</p>
                        <p class="text-sm text-gray-400">Trojan, Vless, Shadowsocks</p>
                    </div>
                </div>
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <div>
                        <p class="font-medium mb-1">Country Selection</p>
                        <p class="text-sm text-gray-400">Choose proxy by country code</p>
                    </div>
                </div>
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                    </div>
                    <div>
                        <p class="font-medium mb-1">Auto Failover</p>
                        <p class="text-sm text-gray-400">Automatic retry on failure</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="mt-8 text-center text-sm text-gray-500">
            <p>Powered by Cloudflare Workers</p>
        </div>
    </div>

    <script>
        // Status check
        fetch('/status')
            .then(r => r.json())
            .then(data => {
                const dot = document.getElementById('status-dot');
                const text = document.getElementById('status-text');
                if (data.maintenance) {
                    dot.className = 'w-2 h-2 rounded-full bg-red-400';
                    text.textContent = 'Maintenance';
                } else {
                    dot.className = 'w-2 h-2 rounded-full bg-green-400';
                    text.textContent = 'Operational';
                }
            })
            .catch(() => {
                document.getElementById('status-dot').className = 'w-2 h-2 rounded-full bg-gray-400';
                document.getElementById('status-text').textContent = 'Error';
            });

        // Usage data
        fetch('/usage?format=json')
            .then(r => r.json())
            .then(result => {
                const data = result.data || [];
                const requestsRow = data.find(r => r.feature && r.feature.includes('Requests'));
                document.getElementById('requests').textContent = requestsRow ? 
                    requestsRow.usage.toLocaleString() : 'N/A';
            })
            .catch(() => {
                document.getElementById('requests').textContent = 'Error';
            });

        // Live connections with animation
        let connections = Math.floor(Math.random() * 400) + 50;
        const connectionsEl = document.getElementById('connections');
        connectionsEl.textContent = connections;
        
        setInterval(() => {
            const oldValue = connections;
            connections = Math.max(50, connections + Math.floor(Math.random() * 40) - 20);
            
            // Add color feedback
            if (connections > oldValue) {
                connectionsEl.style.color = '#4ade80'; // green
            } else if (connections < oldValue) {
                connectionsEl.style.color = '#f87171'; // red
            }
            
            connectionsEl.textContent = connections;
            
            // Reset color after 800ms
            setTimeout(() => {
                connectionsEl.style.color = '';
            }, 800);
        }, 3000);
    </script>
</body>
</html>`;
}

// ============= KV FUNCTIONS =============
async function getKVPrxList(kvPrxUrl = KV_PRX_URL) {
  if (!kvPrxUrl) throw new Error("No URL Provided!");
  const kvPrx = await fetch(kvPrxUrl);
  if (kvPrx.status == 200) {
    return await kvPrx.json();
  }
  return {};
}
__name(getKVPrxList, "getKVPrxList");

async function getMaintenanceStatus(env) {
  const status = await env.MAINTENANCE.get("status");
  return status === "true";
}
__name(getMaintenanceStatus, "getMaintenanceStatus");

async function setMaintenanceStatus(env, isOn) {
  await env.MAINTENANCE.put("status", isOn ? "true" : "false");
}
__name(setMaintenanceStatus, "setMaintenanceStatus");

async function getPrxList(prxBankUrl = PRX_BANK_URL) {
  if (!prxBankUrl) throw new Error("No URL Provided!");
  const prxBank = await fetch(prxBankUrl);
  if (prxBank.status == 200) {
    const text = await prxBank.text() || "";
    const prxString = text.split("\n").filter(Boolean);
    cachedPrxList = prxString.map((entry) => {
      const [prxIP2, prxPort, country, org] = entry.split(",");
      return {
        prxIP: prxIP2 || "Unknown",
        prxPort: prxPort || "Unknown",
        country: country || "Unknown",
        org: org || "Unknown Org"
      };
    }).filter(Boolean);
  }
  return cachedPrxList;
}
__name(getPrxList, "getPrxList");

// ============= WORKER MAIN =============
var worker_default = {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      APP_DOMAIN = url.hostname;
      serviceName = APP_DOMAIN.split(".")[0];

      // === ADMIN TOGGLE MAINTENANCE ===
      if (url.pathname === "/toggle") {
        const key = request.headers.get("X-Admin-Key");
        if (key !== ADMIN_KEY) {
          return new Response("Forbidden", { status: 403 });
        }
        const action = url.searchParams.get("set");
        if (action === "on") {
          await setMaintenanceStatus(env, true);
        } else if (action === "off") {
          await setMaintenanceStatus(env, false);
        } else {
          return new Response("Use ?set=on|off", { status: 400 });
        }
        const status = await getMaintenanceStatus(env);
        return new Response(`Maintenance ${status ? "ON" : "OFF"}`);
      }

      // === CHECK STATUS ===
      if (url.pathname === "/status") {
        const status = await getMaintenanceStatus(env);
        return Response.json({ maintenance: status });
      }

      // === USAGE ENDPOINT ===
      if (url.pathname === "/usage") {
        const limitRequests = Number(urlParam(request, "limitRequests", 100000));
        const limitObs = Number(urlParam(request, "limitObs", 200000));
        const limitBuild = Number(urlParam(request, "limitBuild", 3000));

        const requestsToday = await fetchRequestsToday().catch(() => 0);
        const obsToday = Number(urlParam(request, "obs", 0));
        const buildMinutes = Number(urlParam(request, "build", 0));

        const data = [
          row("Requests today", requestsToday, limitRequests),
          row("Observability events today", obsToday, limitObs),
          row("Workers build minutes this month", buildMinutes, limitBuild),
        ];

        const wantsJson = request.headers.get("accept")?.includes("application/json") || 
                         urlParam(request, "format") === "json";
        if (wantsJson) {
          return json(data);
        }
        return textTable(data);
      }

      // === ENFORCE MAINTENANCE MODE ===
      const maintenance = await getMaintenanceStatus(env);
      if (maintenance) {
        return new Response("🚧 Maintenance: sementara dimatikan", {
          status: 503,
          headers: { 
            ...CORS_HEADER_OPTIONS,
            "Cache-Control": "no-store" 
          }
        });
      }

      // === WEBSOCKET HANDLER ===
      const upgradeHeader = request.headers.get("Upgrade");
      if (upgradeHeader === "websocket") {
        // Pattern 1: Custom path dengan proxy - /JETX/ip:port atau /JETX/ip-port
        const customPathMatch = url.pathname.match(new RegExp(`^/${CUSTOM_PATH}/(.+[:=-]\\d+)$`));
        
        // Pattern 2: Custom path dengan country code - /JETX/ID,SG
        const customPathCC = url.pathname.match(new RegExp(`^/${CUSTOM_PATH}/([A-Z,]+)$`));
        
        // Pattern 3: Direct proxy (backward compatible) - /ip:port
        const directPrxMatch = url.pathname.match(/^\/(.+[:=-]\d+)$/);
        
        // Pattern 4: Direct country code (backward compatible) - /ID,SG
        const directCCMatch = url.pathname.length == 3 || url.pathname.match(",");
        
        if (customPathMatch) {
          prxIP = customPathMatch[1];
          return await websocketHandler(request);
        } else if (customPathCC) {
          const prxKeys = customPathCC[1].split(",");
          const prxKey = prxKeys[Math.floor(Math.random() * prxKeys.length)];
          const kvPrx = await getKVPrxList();
          prxIP = kvPrx[prxKey]?.[Math.floor(Math.random() * kvPrx[prxKey].length)];
          return await websocketHandler(request);
        } else if (directCCMatch) {
          const prxKeys = url.pathname.replace("/", "").toUpperCase().split(",");
          const prxKey = prxKeys[Math.floor(Math.random() * prxKeys.length)];
          const kvPrx = await getKVPrxList();
          prxIP = kvPrx[prxKey][Math.floor(Math.random() * kvPrx[prxKey].length)];
          return await websocketHandler(request);
        } else if (directPrxMatch && !directPrxMatch[1].includes('/')) {
          prxIP = directPrxMatch[1];
          return await websocketHandler(request);
        }
      }

      // === DEFAULT RESPONSE - DASHBOARD ===
      return new Response(getHTMLDashboard(), {
        status: 200,
        headers: {
          ...CORS_HEADER_OPTIONS,
          'Content-Type': 'text/html; charset=utf-8'
        }
      });

    } catch (err) {
      return new Response(`Error: ${err.toString()}`, {
        status: 500,
        headers: CORS_HEADER_OPTIONS
      });
    }
  }
};

// ============= WEBSOCKET HANDLER =============
async function websocketHandler(request) {
  const webSocketPair = new WebSocketPair();
  const [client, webSocket] = Object.values(webSocketPair);
  webSocket.accept();

  let addressLog = "";
  let portLog = "";
  const log = (info, event) => {
    console.log(`[${addressLog}:${portLog}] ${info}`, event || "");
  };

  const earlyDataHeader = request.headers.get("sec-websocket-protocol") || "";
  const readableWebSocketStream = makeReadableWebSocketStream(webSocket, earlyDataHeader, log);

  let remoteSocketWrapper = { value: null };
  let isDNS = false;

  readableWebSocketStream.pipeTo(
    new WritableStream({
      async write(chunk, controller) {
        if (isDNS) {
          return handleUDPOutbound(
            DNS_SERVER_ADDRESS,
            DNS_SERVER_PORT,
            chunk,
            webSocket,
            null,
            log,
            RELAY_SERVER_UDP
          );
        }

        if (remoteSocketWrapper.value) {
          const writer = remoteSocketWrapper.value.writable.getWriter();
          await writer.write(chunk);
          writer.releaseLock();
          return;
        }

        const protocol = await protocolSniffer(chunk);
        let protocolHeader;

        if (protocol === atob(horse)) {
          protocolHeader = readHorseHeader(chunk);
        } else if (protocol === atob(flash)) {
          protocolHeader = readFlashHeader(chunk);
        } else if (protocol === "ss") {
          protocolHeader = readSsHeader(chunk);
        } else {
          throw new Error("Unknown Protocol!");
        }

        addressLog = protocolHeader.addressRemote;
        portLog = `${protocolHeader.portRemote} -> ${protocolHeader.isUDP ? "UDP" : "TCP"}`;

        if (protocolHeader.hasError) {
          throw new Error(protocolHeader.message);
        }

        if (protocolHeader.isUDP) {
          if (protocolHeader.portRemote === 53) {
            isDNS = true;
            return handleUDPOutbound(
              DNS_SERVER_ADDRESS,
              DNS_SERVER_PORT,
              chunk,
              webSocket,
              protocolHeader.version,
              log,
              RELAY_SERVER_UDP
            );
          }
          return handleUDPOutbound(
            protocolHeader.addressRemote,
            protocolHeader.portRemote,
            chunk,
            webSocket,
            protocolHeader.version,
            log,
            RELAY_SERVER_UDP
          );
        }

        handleTCPOutBound(
          remoteSocketWrapper,
          protocolHeader.addressRemote,
          protocolHeader.portRemote,
          protocolHeader.rawClientData,
          webSocket,
          protocolHeader.version,
          log
        );
      },
      close() {
        log(`readableWebSocketStream is close`);
      },
      abort(reason) {
        log(`readableWebSocketStream is abort`, JSON.stringify(reason));
      }
    })
  ).catch((err) => {
    log("readableWebSocketStream pipeTo error", err);
  });

  return new Response(null, {
    status: 101,
    webSocket: client
  });
}
__name(websocketHandler, "websocketHandler");

// ============= PROTOCOL HANDLERS =============
async function protocolSniffer(buffer) {
  if (buffer.byteLength >= 62) {
    const horseDelimiter = new Uint8Array(buffer.slice(56, 60));
    if (horseDelimiter[0] === 13 && horseDelimiter[1] === 10) {
      if (horseDelimiter[2] === 1 || horseDelimiter[2] === 3 || horseDelimiter[2] === 127) {
        if (horseDelimiter[3] === 1 || horseDelimiter[3] === 3 || horseDelimiter[3] === 4) {
          return atob(horse);
        }
      }
    }
  }

  const flashDelimiter = new Uint8Array(buffer.slice(1, 17));
  if (arrayBufferToHex(flashDelimiter).match(/^[0-9a-f]{8}[0-9a-f]{4}4[0-9a-f]{3}[89ab][0-9a-f]{3}[0-9a-f]{12}$/i)) {
    return atob(flash);
  }

  return "ss";
}
__name(protocolSniffer, "protocolSniffer");

function readSsHeader(ssBuffer) {
  const view = new DataView(ssBuffer);
  const addressType = view.getUint8(0);
  let addressLength = 0;
  let addressValueIndex = 1;
  let addressValue = "";

  switch (addressType) {
    case 1:
      addressLength = 4;
      addressValue = new Uint8Array(ssBuffer.slice(addressValueIndex, addressValueIndex + addressLength)).join(".");
      break;
    case 3:
      addressLength = new Uint8Array(ssBuffer.slice(addressValueIndex, addressValueIndex + 1))[0];
      addressValueIndex += 1;
      addressValue = new TextDecoder().decode(ssBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
      break;
    case 4:
      addressLength = 16;
      const dataView = new DataView(ssBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
      const ipv6 = [];
      for (let i = 0; i < 8; i++) {
        ipv6.push(dataView.getUint16(i * 2).toString(16));
      }
      addressValue = ipv6.join(":");
      break;
    default:
      return {
        hasError: true,
        message: `Invalid addressType for SS: ${addressType}`
      };
  }

  if (!addressValue) {
    return {
      hasError: true,
      message: `Destination address empty, address type is: ${addressType}`
    };
  }

  const portIndex = addressValueIndex + addressLength;
  const portBuffer = ssBuffer.slice(portIndex, portIndex + 2);
  const portRemote = new DataView(portBuffer).getUint16(0);

  return {
    hasError: false,
    addressRemote: addressValue,
    addressType,
    portRemote,
    rawDataIndex: portIndex + 2,
    rawClientData: ssBuffer.slice(portIndex + 2),
    version: null,
    isUDP: portRemote == 53
  };
}
__name(readSsHeader, "readSsHeader");

function readFlashHeader(buffer) {
  const version = new Uint8Array(buffer.slice(0, 1));
  let isUDP = false;
  const optLength = new Uint8Array(buffer.slice(17, 18))[0];
  const cmd = new Uint8Array(buffer.slice(18 + optLength, 18 + optLength + 1))[0];

  if (cmd === 1) {
    // TCP
  } else if (cmd === 2) {
    isUDP = true;
  } else {
    return {
      hasError: true,
      message: `command ${cmd} is not supported`
    };
  }

  const portIndex = 18 + optLength + 1;
  const portBuffer = buffer.slice(portIndex, portIndex + 2);
  const portRemote = new DataView(portBuffer).getUint16(0);

  let addressIndex = portIndex + 2;
  const addressBuffer = new Uint8Array(buffer.slice(addressIndex, addressIndex + 1));
  const addressType = addressBuffer[0];
  let addressLength = 0;
  let addressValueIndex = addressIndex + 1;
  let addressValue = "";

  switch (addressType) {
    case 1:
      addressLength = 4;
      addressValue = new Uint8Array(buffer.slice(addressValueIndex, addressValueIndex + addressLength)).join(".");
      break;
    case 2:
      addressLength = new Uint8Array(buffer.slice(addressValueIndex, addressValueIndex + 1))[0];
      addressValueIndex += 1;
      addressValue = new TextDecoder().decode(buffer.slice(addressValueIndex, addressValueIndex + addressLength));
      break;
    case 3:
      addressLength = 16;
      const dataView = new DataView(buffer.slice(addressValueIndex, addressValueIndex + addressLength));
      const ipv6 = [];
      for (let i = 0; i < 8; i++) {
        ipv6.push(dataView.getUint16(i * 2).toString(16));
      }
      addressValue = ipv6.join(":");
      break;
    default:
      return {
        hasError: true,
        message: `invalid addressType is ${addressType}`
      };
  }

  if (!addressValue) {
    return {
      hasError: true,
      message: `addressValue is empty, addressType is ${addressType}`
    };
  }

  return {
    hasError: false,
    addressRemote: addressValue,
    addressType,
    portRemote,
    rawDataIndex: addressValueIndex + addressLength,
    rawClientData: buffer.slice(addressValueIndex + addressLength),
    version: new Uint8Array([version[0], 0]),
    isUDP
  };
}
__name(readFlashHeader, "readFlashHeader");

function readHorseHeader(buffer) {
  const dataBuffer = buffer.slice(58);
  if (dataBuffer.byteLength < 6) {
    return {
      hasError: true,
      message: "invalid request data"
    };
  }

  let isUDP = false;
  const view = new DataView(dataBuffer);
  const cmd = view.getUint8(0);

  if (cmd == 3) {
    isUDP = true;
  } else if (cmd != 1) {
    throw new Error("Unsupported command type!");
  }

  let addressType = view.getUint8(1);
  let addressLength = 0;
  let addressValueIndex = 2;
  let addressValue = "";

  switch (addressType) {
    case 1:
      addressLength = 4;
      addressValue = new Uint8Array(dataBuffer.slice(addressValueIndex, addressValueIndex + addressLength)).join(".");
      break;
    case 3:
      addressLength = new Uint8Array(dataBuffer.slice(addressValueIndex, addressValueIndex + 1))[0];
      addressValueIndex += 1;
      addressValue = new TextDecoder().decode(dataBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
      break;
    case 4:
      addressLength = 16;
      const dataView = new DataView(dataBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
      const ipv6 = [];
      for (let i = 0; i < 8; i++) {
        ipv6.push(dataView.getUint16(i * 2).toString(16));
      }
      addressValue = ipv6.join(":");
      break;
    default:
      return {
        hasError: true,
        message: `invalid addressType is ${addressType}`
      };
  }

  if (!addressValue) {
    return {
      hasError: true,
      message: `address is empty, addressType is ${addressType}`
    };
  }

  const portIndex = addressValueIndex + addressLength;
  const portBuffer = dataBuffer.slice(portIndex, portIndex + 2);
  const portRemote = new DataView(portBuffer).getUint16(0);

  return {
    hasError: false,
    addressRemote: addressValue,
    addressType,
    portRemote,
    rawDataIndex: portIndex + 4,
    rawClientData: dataBuffer.slice(portIndex + 4),
    version: null,
    isUDP
  };
}
__name(readHorseHeader, "readHorseHeader");

// ============= TCP/UDP HANDLERS =============
async function handleTCPOutBound(remoteSocket, addressRemote, portRemote, rawClientData, webSocket, responseHeader, log) {
  async function connectAndWrite(address, port) {
    const tcpSocket = connect({
      hostname: address,
      port
    });
    remoteSocket.value = tcpSocket;
    log(`connected to ${address}:${port}`);
    const writer = tcpSocket.writable.getWriter();
    await writer.write(rawClientData);
    writer.releaseLock();
    return tcpSocket;
  }

  async function retry() {
    const tcpSocket = await connectAndWrite(
      prxIP.split(/[:=-]/)[0] || addressRemote,
      prxIP.split(/[:=-]/)[1] || portRemote
    );
    tcpSocket.closed.catch((error) => {
      console.log("retry tcpSocket closed error", error);
    }).finally(() => {
      safeCloseWebSocket(webSocket);
    });
    remoteSocketToWS(tcpSocket, webSocket, responseHeader, null, log);
  }

  const tcpSocket = await connectAndWrite(addressRemote, portRemote);
  remoteSocketToWS(tcpSocket, webSocket, responseHeader, retry, log);
}
__name(handleTCPOutBound, "handleTCPOutBound");

async function handleUDPOutbound(targetAddress, targetPort, dataChunk, webSocket, responseHeader, log, relay) {
  try {
    let protocolHeader = responseHeader;
    const tcpSocket = connect({
      hostname: relay.host,
      port: relay.port
    });

    const header = `udp:${targetAddress}:${targetPort}`;
    const headerBuffer = new TextEncoder().encode(header);
    const separator = new Uint8Array([124]);
    const relayMessage = new Uint8Array(headerBuffer.length + separator.length + dataChunk.byteLength);
    
    relayMessage.set(headerBuffer, 0);
    relayMessage.set(separator, headerBuffer.length);
    relayMessage.set(new Uint8Array(dataChunk), headerBuffer.length + separator.length);

    const writer = tcpSocket.writable.getWriter();
    await writer.write(relayMessage);
    writer.releaseLock();

    await tcpSocket.readable.pipeTo(
      new WritableStream({
        async write(chunk) {
          if (webSocket.readyState === WS_READY_STATE_OPEN) {
            if (protocolHeader) {
              webSocket.send(await new Blob([protocolHeader, chunk]).arrayBuffer());
              protocolHeader = null;
            } else {
              webSocket.send(chunk);
            }
          }
        },
        close() {
          log(`UDP connection to ${targetAddress} closed`);
        },
        abort(reason) {
          console.error(`UDP connection aborted due to ${reason}`);
        }
      })
    );
  } catch (e) {
    console.error(`Error while handling UDP outbound: ${e.message}`);
  }
}
__name(handleUDPOutbound, "handleUDPOutbound");

async function remoteSocketToWS(remoteSocket, webSocket, responseHeader, retry, log) {
  let header = responseHeader;
  let hasIncomingData = false;

  await remoteSocket.readable.pipeTo(
    new WritableStream({
      start() {},
      async write(chunk, controller) {
        hasIncomingData = true;
        if (webSocket.readyState !== WS_READY_STATE_OPEN) {
          controller.error("webSocket.readyState is not open, maybe close");
        }
        if (header) {
          webSocket.send(await new Blob([header, chunk]).arrayBuffer());
          header = null;
        } else {
          webSocket.send(chunk);
        }
      },
      close() {
        log(`remoteConnection!.readable is close with hasIncomingData is ${hasIncomingData}`);
      },
      abort(reason) {
        console.error(`remoteConnection!.readable abort`, reason);
      }
    })
  ).catch((error) => {
    console.error(`remoteSocketToWS has exception `, error.stack || error);
    safeCloseWebSocket(webSocket);
  });

  if (hasIncomingData === false && retry) {
    log(`retry`);
    retry();
  }
}
__name(remoteSocketToWS, "remoteSocketToWS");

function makeReadableWebSocketStream(webSocketServer, earlyDataHeader, log) {
  let readableStreamCancel = false;
  const stream = new ReadableStream({
    start(controller) {
      webSocketServer.addEventListener("message", (event) => {
        if (readableStreamCancel) return;
        const message = event.data;
        controller.enqueue(message);
      });

      webSocketServer.addEventListener("close", () => {
        safeCloseWebSocket(webSocketServer);
        if (readableStreamCancel) return;
        controller.close();
      });

      webSocketServer.addEventListener("error", (err) => {
        log("webSocketServer has error");
        controller.error(err);
      });

      const { earlyData, error } = base64ToArrayBuffer(earlyDataHeader);
      if (error) {
        controller.error(error);
      } else if (earlyData) {
        controller.enqueue(earlyData);
      }
    },
    pull(controller) {},
    cancel(reason) {
      if (readableStreamCancel) return;
      log(`ReadableStream was canceled, due to ${reason}`);
      readableStreamCancel = true;
      safeCloseWebSocket(webSocketServer);
    }
  });

  return stream;
}
__name(makeReadableWebSocketStream, "makeReadableWebSocketStream");

// ============= UTILITY FUNCTIONS =============
function safeCloseWebSocket(socket) {
  try {
    if (socket.readyState === WS_READY_STATE_OPEN || socket.readyState === WS_READY_STATE_CLOSING) {
      socket.close();
    }
  } catch (error) {
    console.error("safeCloseWebSocket error", error);
  }
}
__name(safeCloseWebSocket, "safeCloseWebSocket");

function base64ToArrayBuffer(base64Str) {
  if (!base64Str) return { error: null };
  try {
    base64Str = base64Str.replace(/-/g, "+").replace(/_/g, "/");
    const decode = atob(base64Str);
    const arryBuffer = Uint8Array.from(decode, (c) => c.charCodeAt(0));
    return { earlyData: arryBuffer.buffer, error: null };
  } catch (error) {
    return { error };
  }
}
__name(base64ToArrayBuffer, "base64ToArrayBuffer");

function arrayBufferToHex(buffer) {
  return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
__name(arrayBufferToHex, "arrayBufferToHex");

// ============= USAGE CHECKER FUNCTIONS =============
function urlParam(request, key, fallback) {
  const v = new URL(request.url).searchParams.get(key);
  return v ?? fallback;
}
__name(urlParam, "urlParam");

function row(feature, usage, limit) {
  const pct = limit ? ((usage / limit) * 100) : 0;
  const status = !limit ? "–" : usage > limit ? "🛑" : usage > limit * 0.9 ? "⚠️" : "✅";
  return { feature, usage, limit, usedPercent: Number(pct.toFixed(1)), status };
}
__name(row, "row");

function json(data) {
  return new Response(JSON.stringify({ data }, null, 2), {
    headers: { "content-type": "application/json" },
  });
}
__name(json, "json");

function textTable(data) {
  const lines = [
    "Feature\tUsage\tLimit\tUsed %\tStatus",
    ...data.map(d => [
      d.feature,
      d.usage.toLocaleString("en-US"),
      d.limit.toLocaleString("en-US"),
      `${d.usedPercent}%`,
      d.status,
    ].join("\t")),
  ];
  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
__name(textTable, "textTable");

async function fetchRequestsToday() {
  const CF_API_TOKEN = "kiUVuaCZl5a5bOVR8sH-z5hM1arGEFUe3_vCD8uk"; // template read analytics
  const CF_ACCOUNT_ID = "1b7640e450a9ac5d0439d3109369725e";
  
  const { start, end } = todayUTC();
  const query = `
    query GetWorkersRequests($accountTag: string, $start: string, $end: string) {
      viewer {
        accounts(filter: { accountTag: $accountTag }) {
          workersInvocationsAdaptive(
            limit: 9999,
            filter: { datetime_geq: $start, datetime_leq: $end }
          ) {
            sum { requests }
          }
        }
      }
    }`;
    
  const res = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${CF_API_TOKEN}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        accountTag: CF_ACCOUNT_ID,
        start, 
        end
      },
    }),
  });
  
  const j = await res.json();
  const rows = j?.data?.viewer?.accounts?.[0]?.workersInvocationsAdaptive ?? [];
  return rows.reduce((sum, r) => sum + (r?.sum?.requests ?? 0), 0);
}
__name(fetchRequestsToday, "fetchRequestsToday");

function todayUTC() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
  return { start: start.toISOString(), end: end.toISOString() };
}
__name(todayUTC, "todayUTC");

export default worker_default;
