/* Fine-log crypto designs: 13 original screens, each shown in four looks (minimal, detailed, colourful, dark).
   All names, figures and addresses are invented sample content. Token tickers are plain text; no logos are used. */
(function () {
  "use strict";
  var T = window.FL_TEMPLATES, D = window.FL_DESIGNS, ST = window.FL_STYLES;

  /* ---------- small builders ---------- */
  var tk = function (l, g) { return '<i class="tk g' + (g || 1) + '">' + l + "</i>"; };
  var addr = '<span class="addr m">0x7a…e41</span>';
  function side(brand, items, on) {
    return '<div class="cside"><span class="h logo">' + brand + '</span><span class="onlym bt gh sm">Menu</span><div class="menu">' +
      items.map(function (x, i) { return "<span" + (i === on ? ' class="on"' : "") + ">" + x + "</span>"; }).join("") +
      '</div><div class="wal card"><span class="mu sm">Connected</span>' + addr + "</div></div>";
  }
  function top(brand, links, on, cta) {
    return '<div class="ctop"><span class="h logo">' + brand + '</span><div class="links hidem">' +
      links.map(function (x, i) { return "<span" + (i === on ? ' class="on"' : "") + ">" + x + "</span>"; }).join("") +
      '</div><div class="rgt"><span class="hidem">' + addr + '</span><span class="bt">' + (cta || "Connect") + "</span></div></div>";
  }
  function kpi(label, val, note, cls) {
    return '<div class="card kp"><span class="mu sm">' + label + '</span><b class="m">' + val + "</b>" + (note ? '<span class="sm ' + (cls || "mu") + '">' + note + "</span>" : "") + "</div>";
  }
  function spark(v, cls) {
    var mx = Math.max.apply(null, v), mn = Math.min.apply(null, v), p = v.map(function (y, i) { return (i * 100 / (v.length - 1)).toFixed(1) + "," + (27 - (y - mn) / (mx - mn || 1) * 24).toFixed(1); }).join(" ");
    return '<svg class="spark ' + (cls || "") + '" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><polyline points="' + p + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>';
  }
  function chart(a, b, labels) {
    var W = 600, H = 200, mx = Math.max.apply(null, a.concat(b || [])), mn = Math.min.apply(null, a.concat(b || []));
    var pts = function (v) { return v.map(function (y, i) { return (i * W / (v.length - 1)).toFixed(0) + " " + (H - 22 - (y - mn) / (mx - mn || 1) * (H - 50)).toFixed(0); }); };
    var pa = pts(a), s = '<svg class="chart" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Chart">' +
      '<g style="stroke:var(--t-border)" stroke-width="1"><line x1="0" y1="40" x2="600" y2="40"/><line x1="0" y1="92" x2="600" y2="92"/><line x1="0" y1="144" x2="600" y2="144"/></g>' +
      '<path d="M' + pa.join(" L") + " L600 " + (H - 18) + " L0 " + (H - 18) + ' Z" style="fill:var(--t-primary)" opacity=".14"/>' +
      '<path d="M' + pa.join(" L") + '" fill="none" style="stroke:var(--t-primary)" stroke-width="3" stroke-linejoin="round"/>';
    if (b) s += '<path d="M' + pts(b).join(" L") + '" fill="none" style="stroke:var(--t-secondary)" stroke-width="2.5" stroke-dasharray="6 6"/>';
    s += '<circle cx="' + pa[pa.length - 1].split(" ")[0] + '" cy="' + pa[pa.length - 1].split(" ")[1] + '" r="6" style="fill:var(--t-primary)"/>';
    if (labels) s += '<g style="fill:var(--t-muted);font-family:var(--t-fm)" font-size="13">' + labels.map(function (l, i) { return '<text x="' + Math.min(i * (W / (labels.length - 1)), W - 30).toFixed(0) + '" y="' + (H - 2) + '">' + l + "</text>"; }).join("") + "</g>";
    return s + "</svg>";
  }
  function candles(c) {
    var W = 600, H = 220, all = [].concat.apply([], c), mx = Math.max.apply(null, all), mn = Math.min.apply(null, all), y = function (v) { return (10 + (mx - v) / (mx - mn) * (H - 30)).toFixed(1); }, bw = W / c.length;
    return '<svg class="chart" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Price chart">' +
      '<g style="stroke:var(--t-border)" stroke-width="1"><line x1="0" y1="50" x2="600" y2="50"/><line x1="0" y1="110" x2="600" y2="110"/><line x1="0" y1="170" x2="600" y2="170"/></g>' +
      c.map(function (k, i) { var up = k[3] >= k[0], col = up ? "var(--t-up)" : "var(--t-dn)", x = i * bw + bw / 2, t = Math.min(y(k[0]), y(k[3])), hh = Math.max(2, Math.abs(y(k[0]) - y(k[3])));
        return '<line x1="' + x.toFixed(1) + '" x2="' + x.toFixed(1) + '" y1="' + y(k[1]) + '" y2="' + y(k[2]) + '" style="stroke:' + col + '" stroke-width="1.5"/><rect x="' + (x - bw * 0.3).toFixed(1) + '" y="' + t + '" width="' + (bw * 0.6).toFixed(1) + '" height="' + hh.toFixed(1) + '" rx="1.5" style="fill:' + col + '"/>'; }).join("") + "</svg>";
  }
  function donut(segs) {
    var off = 0, cols = ["var(--t-primary)", "var(--t-secondary)", "var(--t-accent)", "var(--t-muted)"];
    return '<svg class="donut" viewBox="0 0 42 42" role="img" aria-label="Breakdown"><circle cx="21" cy="21" r="15.9" fill="none" style="stroke:var(--t-border)" stroke-width="5"/>' +
      segs.map(function (s, i) { var c = '<circle cx="21" cy="21" r="15.9" fill="none" style="stroke:' + cols[i % 4] + '" stroke-width="5" stroke-dasharray="' + s + " " + (100 - s) + '" stroke-dashoffset="' + (25 - off) + '"/>'; off += s; return c; }).join("") + "</svg>";
  }
  function legend(items) { return '<div class="lg">' + items.map(function (x, i) { return '<div class="rowb sm"><span><i class="sw' + (i % 4 + 1) + '"></i>' + x[0] + '</span><span class="m">' + x[1] + "</span></div>"; }).join("") + "</div>"; }
  function bars(v, hi) { return '<div class="vbars">' + v.map(function (x, i) { return '<i style="height:' + x + '%"' + (i === hi ? ' class="hi"' : "") + "></i>"; }).join("") + "</div>"; }
  var up = function (t) { return '<span class="m up">' + t + "</span>"; }, dn = function (t) { return '<span class="m dn">' + t + "</span>"; };
  function tr(cls, cells) { return '<div class="tr ' + cls + '">' + cells.join("") + "</div>"; }

  var A30 = [42, 44, 43, 47, 46, 51, 49, 54, 58, 55, 61, 64, 62, 68, 72], B30 = [40, 41, 41, 43, 44, 44, 46, 47, 47, 49, 50, 52, 52, 54, 55];
  var CND = [[30, 34, 28, 33], [33, 36, 31, 32], [32, 35, 29, 34], [34, 39, 33, 38], [38, 40, 35, 36], [36, 37, 32, 33], [33, 38, 32, 37], [37, 42, 36, 41], [41, 43, 38, 39], [39, 44, 38, 43], [43, 47, 42, 46], [46, 48, 43, 44], [44, 45, 40, 41], [41, 46, 40, 45], [45, 50, 44, 49], [49, 51, 46, 47], [47, 52, 46, 51], [51, 55, 50, 54], [54, 56, 51, 52], [52, 57, 51, 56], [56, 59, 54, 55], [55, 60, 54, 59]];

  /* ---------- the 13 screens ---------- */
  var L = [
    {
      id: "c-portfolio", name: "Portfolio overview", blurb: "Holdings, allocation and performance", what: "a crypto portfolio dashboard",
      html: '<div class="cshell">' + side("Halo", ["Portfolio", "Markets", "Swap", "Earn", "Activity", "Settings"], 0) + '<div class="cmain">' +
        '<div class="rowb head"><div><span class="mu sm">Tuesday, 17 November</span><span class="h t1">Portfolio</span></div><div class="acts"><span class="bt gh">Send</span><span class="bt">Deposit</span></div></div>' +
        '<div class="kpis k4">' + kpi("Net worth", "$84,210.44", "+3.2% today", "up") + kpi("24h change", "+$2,611.08", "across 9 assets") + kpi("Staked", "$21,400.00", "4.6% average APY") + kpi("Claimable", "$312.80", "3 rewards ready", "ac") + "</div>" +
        '<div class="two"><div class="card"><div class="rowb"><b class="h">Net worth</b><span class="segc"><i>7D</i><i class="on">30D</i><i>1Y</i></span></div>' + chart(A30, B30, ["18 Oct", "25 Oct", "1 Nov", "8 Nov", "17 Nov"]) + "</div>" +
        '<div class="card"><b class="h">Allocation</b><div class="dn2">' + donut([46, 27, 17, 10]) + legend([["Bitcoin", "46%"], ["Ether", "27%"], ["Stablecoins", "17%"], ["Other", "10%"]]) + "</div></div></div>" +
        '<div class="card"><b class="h">Holdings</b><div class="tb">' + tr("c6 hd", ["<span>Asset</span>", '<span class="hidem">Price</span>', '<span class="hidem">24h</span>', '<span class="hidem">Balance</span>', '<span class="hidem">7 days</span>', "<span>Value</span>"]) +
        tr("c6", ['<span class="as">' + tk("B", 1) + "<span><b>Bitcoin</b><small>BTC</small></span></span>", '<span class="m hidem">$97,420.10</span>', '<span class="hidem">' + up("+2.1%") + "</span>", '<span class="m hidem">0.3976</span>', '<span class="hidem up">' + spark([3, 4, 3, 5, 6, 5, 7]) + "</span>", '<span class="m">$38,736.84</span>']) +
        tr("c6", ['<span class="as">' + tk("E", 2) + "<span><b>Ether</b><small>ETH</small></span></span>", '<span class="m hidem">$3,412.60</span>', '<span class="hidem">' + up("+1.8%") + "</span>", '<span class="m hidem">6.6625</span>', '<span class="hidem up">' + spark([4, 4, 5, 4, 6, 6, 7]) + "</span>", '<span class="m">$22,736.45</span>']) +
        tr("c6", ['<span class="as">' + tk("U", 3) + "<span><b>USD Coin</b><small>USDC</small></span></span>", '<span class="m hidem">$1.00</span>', '<span class="hidem m mu">0.0%</span>', '<span class="m hidem">14,315.00</span>', '<span class="hidem mu">' + spark([5, 5, 5, 5, 5, 5, 5]) + "</span>", '<span class="m">$14,315.00</span>']) +
        tr("c6", ['<span class="as">' + tk("S", 1) + "<span><b>Solana</b><small>SOL</small></span></span>", '<span class="m hidem">$214.35</span>', '<span class="hidem">' + dn("-0.9%") + "</span>", '<span class="m hidem">39.29</span>', '<span class="hidem dn">' + spark([7, 6, 6, 5, 6, 4, 4]) + "</span>", '<span class="m">$8,422.15</span>']) +
        "</div></div></div></div>",
      structure: [
        "Left sidebar: product name, vertical menu (Portfolio, Markets, Swap, Earn, Activity, Settings) with the active item filled in the primary colour, and a connected-wallet card at the bottom showing a shortened address in the monospace font.",
        "Page header: the date in muted text, the page title, and two actions on the right (outlined Send, primary Deposit).",
        "A row of four stat cards: net worth, 24-hour change, staked value and claimable rewards. Each has a muted label, a large figure in the monospace font and a short note; gains use the positive colour.",
        "A two-column row: a net-worth area chart with a 7D / 30D / 1Y range switch, and an allocation donut chart with a legend of asset shares.",
        "A holdings table: asset (round token badge, name and ticker), price, 24-hour change coloured by direction, balance, a 7-day sparkline and value, with amounts right-aligned in the monospace font."
      ],
      layout: ["Two-column app shell: fixed 210px sidebar on the surface colour and a fluid main area.", "Stat cards are four equal columns; the chart row is roughly two thirds and one third."],
      responsive: ["Below 640px the sidebar collapses to a top bar with the product name and a Menu button.", "Stat cards become two columns, the chart row stacks, and the table keeps only asset and value."]
    },
    {
      id: "c-trade", name: "Trading terminal", blurb: "Chart, order book and order form", what: "a crypto trading terminal",
      html: '<div class="cfull">' + top("Kite", ["Trade", "Markets", "Earn", "Portfolio"], 0) +
        '<div class="pairbar"><div class="as">' + tk("E", 2) + '<span><b class="h pr">ETH / USDC</b><small>Spot</small></span></div><div class="pst"><span class="mu sm">Last price</span><b class="m up">3,412.60</b></div><div class="pst hidem"><span class="mu sm">24h change</span>' + up("+1.84%") + '</div><div class="pst hidem"><span class="mu sm">24h high</span><b class="m">3,468.20</b></div><div class="pst hidem"><span class="mu sm">24h low</span><b class="m">3,331.75</b></div><div class="pst hidem"><span class="mu sm">24h volume</span><b class="m">$412.6M</b></div></div>' +
        '<div class="tgrid"><div class="card cchart"><div class="rowb"><span class="segc"><i>15m</i><i class="on">1H</i><i>4H</i><i>1D</i></span><span class="mu sm m">O 3,398.1 &nbsp; H 3,421.0 &nbsp; L 3,390.4 &nbsp; C 3,412.6</span></div>' + candles(CND) + "</div>" +
        '<div class="card book"><b class="h">Order book</b><div class="tr c3 hd"><span>Price</span><span>Size</span><span>Total</span></div>' +
        [["3,414.20", "2.410", "8,228"], ["3,413.80", "5.105", "17,427"], ["3,413.10", "1.870", "6,382"], ["3,412.90", "9.340", "31,876"]].map(function (r, i) { return '<div class="tr c3 ask" style="--d:' + (30 + i * 16) + '%"><span class="m dn">' + r[0] + '</span><span class="m">' + r[1] + '</span><span class="m">' + r[2] + "</span></div>"; }).join("") +
        '<div class="mid m"><b class="up">3,412.60</b><span class="mu sm">Spread 0.30</span></div>' +
        [["3,412.30", "7.220", "24,636"], ["3,411.90", "3.015", "10,286"], ["3,411.20", "6.480", "22,104"], ["3,410.70", "12.900", "43,998"]].map(function (r, i) { return '<div class="tr c3 bid" style="--d:' + (38 + i * 15) + '%"><span class="m up">' + r[0] + '</span><span class="m">' + r[1] + '</span><span class="m">' + r[2] + "</span></div>"; }).join("") + "</div>" +
        '<div class="card form"><div class="bs"><span class="on">Buy</span><span>Sell</span></div><span class="segc"><i class="on">Limit</i><i>Market</i><i>Stop</i></span>' +
        '<label>Price<span class="fld2 m">3,412.60 <em>USDC</em></span></label><label>Amount<span class="fld2 m">0.5000 <em>ETH</em></span></label><div class="pct"><i>25%</i><i class="on">50%</i><i>75%</i><i>100%</i></div>' +
        '<div class="rowb sm"><span class="mu">Total</span><span class="m">1,706.30 USDC</span></div><div class="rowb sm"><span class="mu">Fee</span><span class="m">1.71 USDC</span></div><span class="bt full buy">Buy ETH</span></div></div>' +
        '<div class="card ords"><div class="rowb"><b class="h">Open orders</b><span class="pill">2 open</span></div><div class="tb">' + tr("c5 hd", ["<span>Pair</span>", '<span class="hidem">Type</span>', '<span class="hidem">Price</span>', '<span class="hidem">Filled</span>', "<span>Amount</span>"]) +
        tr("c5", ["<span><b>ETH / USDC</b></span>", '<span class="hidem up">Limit buy</span>', '<span class="m hidem">3,380.00</span>', '<span class="m hidem">40%</span>', '<span class="m">1.2000 ETH</span>']) +
        tr("c5", ["<span><b>SOL / USDC</b></span>", '<span class="hidem dn">Limit sell</span>', '<span class="m hidem">228.50</span>', '<span class="m hidem">0%</span>', '<span class="m">18.00 SOL</span>']) + "</div></div></div>",
      structure: [
        "Top bar: product name, four text links with the active one underlined in the primary colour, a shortened wallet address and a primary button.",
        "A pair bar: token badge and pair name, then last price, 24-hour change, high, low and volume as small label-over-value blocks in the monospace font.",
        "A three-column trading grid: a candlestick chart with a time-frame switch and an open/high/low/close readout; an order book with asks above and bids below, each row shaded by depth, and the mid price with the spread between them; and an order form with Buy and Sell tabs, an order-type switch, price and amount fields with their units, percentage shortcuts, total and fee lines and a full-width Buy button in the positive colour.",
        "An open-orders table: pair, type coloured by side, price, percentage filled and amount."
      ],
      layout: ["Full-width layout with 24px side padding and tight gaps, so more data fits on screen.", "The trading grid is roughly 2 : 1 : 1; the chart card is the tallest."],
      responsive: ["Below 640px the grid stacks in this order: chart, order form, order book.", "The pair bar keeps only the pair and last price."]
    },
    {
      id: "c-swap", name: "Swap", blurb: "Token swap with route and price", what: "a token swap screen for a decentralised exchange",
      html: '<div class="cfull">' + top("Driftwood", ["Swap", "Pools", "Bridge", "Stats"], 0) +
        '<div class="swapw"><div class="card swap"><div class="rowb"><b class="h">Swap</b><span class="pill">Slippage 0.5%</span></div>' +
        '<div class="leg"><div class="rowb sm mu"><span>You pay</span><span class="m">Balance 6.6625</span></div><div class="rowb"><b class="m amt">1.5000</b><span class="tsel">' + tk("E", 2) + "ETH</span></div><span class=\"mu sm m\">$5,118.90</span></div>" +
        '<div class="flip"><span>&darr;</span></div>' +
        '<div class="leg"><div class="rowb sm mu"><span>You receive</span><span class="m">Balance 14,315.00</span></div><div class="rowb"><b class="m amt">5,109.42</b><span class="tsel">' + tk("U", 3) + 'USDC</span></div><span class="mu sm m">$5,109.42</span></div>' +
        '<div class="det"><div class="rowb sm"><span class="mu">Rate</span><span class="m">1 ETH = 3,406.28 USDC</span></div><div class="rowb sm"><span class="mu">Network fee</span><span class="m">$1.24</span></div><div class="rowb sm"><span class="mu">Route</span><span class="m">ETH &rarr; WBTC &rarr; USDC</span></div><div class="rowb sm"><span class="mu">Price impact</span><span class="m up">0.04%</span></div></div>' +
        '<span class="bt full">Swap</span></div>' +
        '<div class="sidec"><div class="card"><div class="rowb"><b class="h">ETH / USDC</b>' + up("+1.84%") + "</div>" + chart(A30, null, ["1D", "", "", "", "Now"]) + "</div>" +
        '<div class="card"><b class="h">Recent swaps</b><div class="tb">' +
        tr("c3", ['<span class="as">' + tk("E", 2) + tk("U", 3) + "<span>ETH to USDC</span></span>", '<span class="m mu hidem">2 min ago</span>', '<span class="m">1.5000</span>']) +
        tr("c3", ['<span class="as">' + tk("U", 3) + tk("S", 1) + "<span>USDC to SOL</span></span>", '<span class="m mu hidem">1 hr ago</span>', '<span class="m">800.00</span>']) +
        tr("c3", ['<span class="as">' + tk("B", 1) + tk("E", 2) + "<span>BTC to ETH</span></span>", '<span class="m mu hidem">Yesterday</span>', '<span class="m">0.0500</span>']) + "</div></div></div></div></div>",
      structure: [
        "Top bar: product name, four text links with the active one marked, a shortened wallet address and a primary button.",
        "A swap card about 440px wide: a title with a slippage badge; a You pay panel with the balance, a large amount in the monospace font, a token selector and the dollar value; a round flip button; a matching You receive panel; a details list (rate, network fee, route, price impact); and a full-width primary Swap button.",
        "Beside it, a column with a pair price chart card and a recent-swaps list showing overlapping token badges, the direction, the time and the amount."
      ],
      layout: ["Two columns centred on the page: the swap card on the left and a fluid column on the right, max width about 1000px.", "The two token panels use the background colour inside the card so they read as inset fields."],
      responsive: ["Below 640px the swap card goes full width and the chart and recent swaps stack under it."]
    },
    {
      id: "c-stake", name: "Staking", blurb: "Positions, rewards and validators", what: "a staking dashboard",
      html: '<div class="cshell">' + side("Anchor", ["Overview", "Stake", "Validators", "Rewards", "History"], 1) + '<div class="cmain">' +
        '<div class="rowb head"><div><span class="mu sm">Epoch 412 &middot; ends in 6h 12m</span><span class="h t1">Staking</span></div><div class="acts"><span class="bt gh">Unstake</span><span class="bt">Stake more</span></div></div>' +
        '<div class="kpis k4">' + kpi("Total staked", "1,240.00 SOL", "$265,794") + kpi("Current APY", "7.42%", "+0.18 this epoch", "up") + kpi("Rewards earned", "38.612 SOL", "since March") + kpi("Next payout", "6h 12m", "about 0.251 SOL", "ac") + "</div>" +
        '<div class="two"><div class="card"><div class="rowb"><b class="h">Rewards per epoch</b><span class="pill">Last 12</span></div>' + bars([42, 48, 45, 52, 50, 58, 55, 61, 64, 60, 70, 76], 11) + '<div class="rowb sm mu m"><span>Epoch 401</span><span>Epoch 412</span></div></div>' +
        '<div class="card"><b class="h">Your positions</b><div class="dn2">' + donut([52, 30, 18]) + legend([["Northgate", "644.8 SOL"], ["Tideline", "372.0 SOL"], ["Fieldstone", "223.2 SOL"]]) + "</div></div></div>" +
        '<div class="card"><b class="h">Validators</b><div class="tb">' + tr("c6 hd", ["<span>Validator</span>", '<span class="hidem">Commission</span>', '<span class="hidem">APY</span>', '<span class="hidem">Uptime</span>', '<span class="hidem">Your stake</span>', "<span></span>"]) +
        [["Northgate", "N", 1, "5%", "7.51%", "99.98%", "644.80"], ["Tideline", "T", 2, "4%", "7.44%", "99.91%", "372.00"], ["Fieldstone", "F", 3, "7%", "7.20%", "99.99%", "223.20"], ["Lowland", "L", 1, "3%", "7.61%", "99.40%", "0.00"]].map(function (v) {
          return tr("c6", ['<span class="as">' + tk(v[1], v[2]) + "<b>" + v[0] + "</b></span>", '<span class="m hidem">' + v[3] + "</span>", '<span class="hidem">' + up(v[4]) + "</span>", '<span class="m hidem">' + v[5] + "</span>", '<span class="m hidem">' + v[6] + " SOL</span>", '<span><span class="bt gh sm">Stake</span></span>']); }).join("") + "</div></div></div></div>",
      structure: [
        "Left sidebar: product name, vertical menu with the active item filled in the primary colour, and a connected-wallet card at the bottom.",
        "Page header: the current epoch and time remaining in muted text, the page title, and two actions (outlined Unstake, primary Stake more).",
        "Four stat cards: total staked with its dollar value, current APY with its change, rewards earned, and the time to the next payout.",
        "A two-column row: a bar chart of rewards per epoch with the latest bar in the primary colour, and a donut chart of your positions with a legend naming each validator and its stake.",
        "A validators table: name with a round badge, commission, APY, uptime, your stake and an outlined Stake button on each row."
      ],
      layout: ["Two-column app shell: fixed 210px sidebar and a fluid main area.", "Stat cards are four equal columns; the chart row is roughly two thirds and one third."],
      responsive: ["Below 640px the sidebar collapses to a top bar, stat cards become two columns and the chart row stacks.", "The validators table keeps the name and the Stake button."]
    },
    {
      id: "c-lend", name: "Lending", blurb: "Supply, borrow and health factor", what: "a lending and borrowing dashboard",
      html: '<div class="cfull">' + top("Meridian", ["Dashboard", "Markets", "Stake", "Governance"], 0) +
        '<div class="cpad"><div class="kpis k3"><div class="card hf"><div><span class="mu sm">Health factor</span><b class="m big">2.41</b><span class="sm up">Safe</span></div><div class="gauge"><i style="width:72%"></i></div><div class="rowb sm mu m"><span>1.00 liquidation</span><span>3.00+</span></div></div>' +
        kpi("Net APY", "3.86%", "$1,412 a year at this rate", "up") +
        '<div class="card kp"><span class="mu sm">Borrow limit used</span><b class="m">41%</b><span class="bar"><i style="width:41%"></i></span><span class="sm mu m">$18,200 of $44,390</span></div></div>' +
        '<div class="two eq"><div class="card"><div class="rowb"><b class="h">Your supplies</b><span class="m mu sm">$62,480.00</span></div><div class="tb">' + tr("c4 hd", ["<span>Asset</span>", '<span class="hidem">APY</span>', '<span class="hidem">Collateral</span>', "<span>Balance</span>"]) +
        tr("c4", ['<span class="as">' + tk("E", 2) + "<b>ETH</b></span>", '<span class="hidem">' + up("2.14%") + "</span>", '<span class="hidem"><i class="tg on"></i></span>', '<span class="m">12.40</span>']) +
        tr("c4", ['<span class="as">' + tk("U", 3) + "<b>USDC</b></span>", '<span class="hidem">' + up("5.02%") + "</span>", '<span class="hidem"><i class="tg on"></i></span>', '<span class="m">20,170.00</span>']) + "</div></div>" +
        '<div class="card"><div class="rowb"><b class="h">Your borrows</b><span class="m mu sm">$18,200.00</span></div><div class="tb">' + tr("c4 hd", ["<span>Asset</span>", '<span class="hidem">APY</span>', '<span class="hidem">Rate</span>', "<span>Debt</span>"]) +
        tr("c4", ['<span class="as">' + tk("D", 1) + "<b>DAI</b></span>", '<span class="hidem">' + dn("6.31%") + "</span>", '<span class="hidem mu">Variable</span>', '<span class="m">12,000.00</span>']) +
        tr("c4", ['<span class="as">' + tk("U", 3) + "<b>USDC</b></span>", '<span class="hidem">' + dn("5.88%") + "</span>", '<span class="hidem mu">Stable</span>', '<span class="m">6,200.00</span>']) + "</div></div></div>" +
        '<div class="card"><b class="h">Markets</b><div class="tb">' + tr("c6 hd", ["<span>Asset</span>", '<span class="hidem">Total supplied</span>', '<span class="hidem">Supply APY</span>', '<span class="hidem">Total borrowed</span>', '<span class="hidem">Borrow APY</span>', "<span></span>"]) +
        [["E", 2, "ETH", "$1.84B", "2.14%", "$612M", "3.02%"], ["U", 3, "USDC", "$2.31B", "5.02%", "$1.9B", "5.88%"], ["B", 1, "WBTC", "$986M", "0.42%", "$104M", "1.15%"], ["D", 1, "DAI", "$540M", "5.60%", "$431M", "6.31%"]].map(function (m) {
          return tr("c6", ['<span class="as">' + tk(m[0], m[1]) + "<b>" + m[2] + "</b></span>", '<span class="m hidem">' + m[3] + "</span>", '<span class="hidem">' + up(m[4]) + "</span>", '<span class="m hidem">' + m[5] + "</span>", '<span class="hidem">' + dn(m[6]) + "</span>", '<span><span class="bt gh sm">Supply</span></span>']); }).join("") + "</div></div></div></div>",
      structure: [
        "Top bar: product name, four text links with the active one marked, a shortened wallet address and a primary button.",
        "Three summary cards: a health factor card with a large figure, a Safe status in the positive colour and a horizontal gauge from liquidation to safe; net APY; and borrow limit used with a progress bar and the amounts.",
        "Two equal cards side by side: Your supplies (asset, APY, a collateral switch, balance) and Your borrows (asset, APY, rate type, debt), each with its total in the header.",
        "A markets table: asset, total supplied, supply APY, total borrowed, borrow APY and an outlined Supply button per row. Supply rates use the positive colour and borrow rates the negative colour."
      ],
      layout: ["Single column with 32px side padding, content max width about 1200px.", "Summary cards are three equal columns; supplies and borrows are two equal columns."],
      responsive: ["Below 640px all card rows stack and tables keep the asset and the last column."]
    },
    {
      id: "c-analytics", name: "Protocol analytics", blurb: "TVL, volume, fees and pools", what: "a protocol analytics dashboard",
      html: '<div class="cshell">' + side("Lumen", ["Overview", "Pools", "Tokens", "Chains", "Fees", "Users"], 0) + '<div class="cmain">' +
        '<div class="rowb head"><div><span class="mu sm">Updated 40 seconds ago</span><span class="h t1">Protocol overview</span></div><div class="acts"><span class="segc"><i>24H</i><i>7D</i><i class="on">30D</i><i>All</i></span><span class="bt gh">Export</span></div></div>' +
        '<div class="kpis k4">' + kpi("Total value locked", "$4.82B", "+6.4% in 30 days", "up") + kpi("Volume, 24h", "$612.4M", "-2.1% vs yesterday", "dn") + kpi("Fees, 24h", "$1.84M", "0.30% average") + kpi("Active wallets", "184,220", "+12,410 this week", "up") + "</div>" +
        '<div class="two"><div class="card"><div class="rowb"><b class="h">Total value locked</b><span class="lgi sm"><span><i class="sw1"></i>TVL</span><span><i class="sw2"></i>30-day average</span></span></div>' + chart(A30, B30, ["18 Oct", "25 Oct", "1 Nov", "8 Nov", "17 Nov"]) + "</div>" +
        '<div class="card"><b class="h">By chain</b><div class="cat">' + [["Ethereum", "$2.61B", 100, "p"], ["Base", "$1.02B", 39, "s"], ["Arbitrum", "$0.74B", 28, ""], ["Solana", "$0.45B", 17, "p"]].map(function (c) { return '<div><div class="rowb sm"><span>' + c[0] + '</span><span class="m">' + c[1] + '</span></div><span class="bar ' + c[3] + '"><i style="width:' + c[2] + '%"></i></span></div>'; }).join("") + "</div></div></div>" +
        '<div class="card"><div class="rowb"><b class="h">Top pools</b><span class="pill">By volume</span></div><div class="tb">' + tr("c6 hd", ["<span>Pool</span>", '<span class="hidem">TVL</span>', '<span class="hidem">Volume 24h</span>', '<span class="hidem">Fees 24h</span>', '<span class="hidem">7 days</span>', "<span>APR</span>"]) +
        [["E", "U", "ETH / USDC", "$412.6M", "$98.2M", "$294.6K", [3, 4, 4, 5, 5, 6, 7], "up", "26.1%"], ["B", "E", "WBTC / ETH", "$388.1M", "$61.0M", "$183.0K", [5, 5, 4, 5, 6, 6, 6], "up", "17.2%"], ["U", "D", "USDC / DAI", "$301.9M", "$44.7M", "$4.5K", [5, 5, 5, 5, 5, 5, 5], "mu", "0.5%"], ["S", "U", "SOL / USDC", "$146.3M", "$52.3M", "$156.9K", [7, 6, 6, 5, 5, 4, 5], "dn", "39.1%"]].map(function (p) {
          return tr("c6", ['<span class="as">' + tk(p[0], 1) + tk(p[1], 3) + "<b>" + p[2] + "</b></span>", '<span class="m hidem">' + p[3] + "</span>", '<span class="m hidem">' + p[4] + "</span>", '<span class="m hidem">' + p[5] + "</span>", '<span class="hidem ' + p[7] + '">' + spark(p[6]) + "</span>", up(p[8])]); }).join("") + "</div></div></div></div>",
      structure: [
        "Left sidebar: product name, vertical menu (Overview, Pools, Tokens, Chains, Fees, Users) with the active item filled in the primary colour, and a connected-wallet card at the bottom.",
        "Page header: a last-updated note in muted text, the page title, a time-range switch (24H, 7D, 30D, All) and an outlined Export button.",
        "Four stat cards: total value locked, 24-hour volume, 24-hour fees and active wallets, each with a large figure in the monospace font and a change note coloured by direction.",
        "A two-column row: an area chart of total value locked with a dashed 30-day average and a small legend, and a By chain list with a labelled progress bar per chain.",
        "A top-pools table: pool (two overlapping token badges and the pair), TVL, 24-hour volume, 24-hour fees, a 7-day sparkline and APR."
      ],
      layout: ["Two-column app shell: fixed 210px sidebar and a fluid main area.", "Stat cards are four equal columns; the chart row is roughly two thirds and one third."],
      responsive: ["Below 640px the sidebar collapses to a top bar, stat cards become two columns and the chart row stacks.", "The pools table keeps the pool and APR."]
    },
    {
      id: "c-explorer", name: "Block explorer", blurb: "Search, blocks and transactions", what: "a blockchain explorer",
      html: '<div class="cfull">' + top("Blockscope", ["Blocks", "Transactions", "Tokens", "Validators"], -1, "Sign in") +
        '<div class="exh"><span class="h">Explore the chain</span><div class="exs"><span class="mu">Search by address, transaction hash, block or token</span><span class="bt">Search</span></div></div>' +
        '<div class="cpad"><div class="kpis k4">' + kpi("Block height", "21,408,773", "12s ago") + kpi("Gas price", "14 gwei", "$0.62 per transfer") + kpi("Transactions per second", "118.4", "+4% this hour", "up") + kpi("Finality", "12.8s", "last 100 blocks") + "</div>" +
        '<div class="two eq"><div class="card"><div class="rowb"><b class="h">Latest blocks</b><span class="lk2 sm">View all</span></div><div class="tb">' +
        [["21408773", "12s", "0x4c…91b", "184", "0.0421"], ["21408772", "24s", "0xa1…07e", "211", "0.0518"], ["21408771", "36s", "0x4c…91b", "162", "0.0377"], ["21408770", "48s", "0x9e…c20", "198", "0.0466"], ["21408769", "1m", "0x2b…5fa", "175", "0.0402"]].map(function (b) {
          return tr("c3", ['<span class="as"><i class="bk m">Bk</i><span><b class="m lk2">' + b[0] + "</b><small>" + b[1] + " ago</small></span></span>", '<span class="hidem"><span class="mu sm">Proposer </span><span class="m">' + b[2] + "</span><small>" + b[3] + " transactions</small></span>", '<span class="m">' + b[4] + " ETH</span>"]); }).join("") + "</div></div>" +
        '<div class="card"><div class="rowb"><b class="h">Latest transactions</b><span class="lk2 sm">View all</span></div><div class="tb">' +
        [["0x8f3a…d102", "0x7a…e41", "0x3c…b77", "1.2500"], ["0x51be…77a9", "0xd4…0c2", "0x91…a3e", "0.0840"], ["0xc07d…e3f1", "0x7a…e41", "0x6f…118", "12.0000"], ["0x2a94…9bc0", "0xb8…4d5", "0x3c…b77", "0.4210"], ["0xe6f0…40dd", "0x15…f9a", "0xa0…762", "3.3300"]].map(function (t) {
          return tr("c3", ['<span class="as"><i class="bk m">Tx</i><span><b class="m lk2">' + t[0] + '</b><small>14s ago</small></span></span>', '<span class="hidem sm"><span class="mu">From </span><span class="m">' + t[1] + '</span><br><span class="mu">To </span><span class="m">' + t[2] + "</span></span>", '<span class="m">' + t[3] + " ETH</span>"]); }).join("") + "</div></div></div></div></div>",
      structure: [
        "Top bar: product name, four text links, a shortened wallet address and a primary button.",
        "A centred search header: a large headline and a wide rounded search field with placeholder text and a primary Search button inside it.",
        "Four stat cards: block height, gas price, transactions per second and finality, with figures in the monospace font.",
        "Two equal cards side by side: Latest blocks and Latest transactions. Each row has a small square badge, an identifier in the monospace font in the primary colour with its age under it, a middle column (proposer and transaction count, or from and to addresses) and an amount on the right."
      ],
      layout: ["Single column with 32px side padding, content max width about 1200px.", "The search header sits on a soft tint of the primary colour; the two lists are equal columns."],
      responsive: ["Below 640px stat cards become two columns, the two lists stack and each row keeps the identifier and amount."]
    },
    {
      id: "c-nft", name: "NFT collection", blurb: "Collection page with items and activity", what: "an NFT collection page",
      html: '<div class="cfull">' + top("Atelier", ["Explore", "Drops", "Activity", "Create"], 0) +
        '<div class="banner g1"></div><div class="cpad nftp"><div class="colh"><i class="av big g2"></i><div><span class="h t1">Paper Kites</span><span class="mu">By <span class="lk2">studio-noor</span> &middot; 4,096 generative kites that fly differently in every wallet.</span></div><div class="acts"><span class="bt gh hidem">Share</span><span class="bt">Make offer</span></div></div>' +
        '<div class="kpis k4">' + kpi("Floor price", "0.842 ETH", "+4.1% today", "up") + kpi("Total volume", "6,120 ETH", "since June") + kpi("Listed", "7.4%", "303 of 4,096") + kpi("Owners", "2,318", "57% unique") + "</div>" +
        '<div class="rowb"><div class="chips"><span class="on">Items</span><span>Offers</span><span>Activity</span><span class="hidem">Traits</span></div><span class="pill hidem">Price: low to high</span></div>' +
        '<div class="ngrid">' + [["#0412", "0.842", 1, "a"], ["#3310", "0.851", 2, "b"], ["#1077", "0.868", 3, "c"], ["#2954", "0.880", 4, "a"], ["#0091", "0.905", 5, "b"], ["#3777", "0.930", 6, "c"], ["#1650", "0.944", 2, "a"], ["#0728", "0.990", 3, "b"]].map(function (n) {
          return '<div class="card nft"><div class="art g' + n[2] + " k" + n[3] + '"><i></i><i></i><i></i></div><div class="rowb"><b>Kite ' + n[0] + '</b><span class="m mu sm">Rank ' + (n[2] * 311) + '</span></div><div class="rowb"><span class="m">' + n[1] + ' ETH</span><span class="bt sm">Buy</span></div></div>'; }).join("") + "</div></div></div>",
      structure: [
        "Top bar: product name, four text links with the active one marked, a shortened wallet address and a primary button.",
        "A full-width banner in a gradient of the primary and secondary colours, with a large round collection avatar overlapping its lower edge.",
        "A collection header: the collection name, the creator as a link and a one-line description, with an outlined Share button and a primary Make offer button.",
        "Four stat cards: floor price, total volume, percentage listed and owners.",
        "A tab row (Items, Offers, Activity, Traits) with the active tab filled in the text colour, and a sort badge on the right.",
        "A four-column grid of item cards: a square piece of generative artwork, the item name with its rarity rank, and the price in the monospace font beside a small primary Buy button."
      ],
      layout: ["Single column with 32px side padding; the banner spans the full width and is about 150px tall.", "Item cards are four equal columns with square artwork that fills the card width."],
      responsive: ["Below 640px stat cards and the item grid become two columns and the Share button hides."]
    },
    {
      id: "c-wallet", name: "Wallet", blurb: "Balance, tokens and activity", what: "a crypto wallet app",
      html: '<div class="cfull">' + top("Pocket", ["Home", "Activity", "Contacts", "Settings"], 0, "Lock") +
        '<div class="walw"><div class="wcol"><div class="card bal"><span class="sm">Total balance</span><b class="m big">$24,870.32</b><span class="sm">+$412.06 today &middot; ' + "0x7a…e41</span>" +
        '<div class="wact"><span><i>&uarr;</i>Send</span><span><i>&darr;</i>Receive</span><span><i>+</i>Buy</span><span><i>&harr;</i>Swap</span></div></div>' +
        '<div class="card"><div class="rowb"><b class="h">Tokens</b><span class="lk2 sm">Manage</span></div><div class="tb">' +
        [["E", 2, "Ether", "4.2100 ETH", "$14,367.05", "+1.8%", 1], ["U", 3, "USD Coin", "6,120.00 USDC", "$6,120.00", "0.0%", 0], ["S", 1, "Solana", "16.40 SOL", "$3,515.34", "-0.9%", -1], ["B", 1, "Bitcoin", "0.0089 BTC", "$867.93", "+2.1%", 1]].map(function (t) {
          return tr("c2", ['<span class="as">' + tk(t[0], t[1]) + "<span><b>" + t[2] + '</b><small class="m">' + t[3] + "</small></span></span>", '<span><b class="m">' + t[4] + '</b><small class="m ' + (t[6] > 0 ? "up" : t[6] < 0 ? "dn" : "mu") + '">' + t[5] + "</small></span>"]); }).join("") + "</div></div></div>" +
        '<div class="wcol"><div class="card"><div class="rowb"><b class="h">Activity</b><span class="pill">This week</span></div><div class="tb">' +
        [["&darr;", "Received USDC", "From 0x3c…b77", "+1,200.00", "up"], ["&harr;", "Swapped ETH to USDC", "On Driftwood", "-0.5000 ETH", "mu"], ["&uarr;", "Sent ETH", "To studio-noor", "-0.0840", "dn"], ["&darr;", "Staking reward", "From Anchor", "+0.2510 SOL", "up"]].map(function (a) {
          return tr("c2", ['<span class="as"><i class="bk">' + a[0] + "</i><span><b>" + a[1] + "</b><small>" + a[2] + "</small></span></span>", '<span class="m ' + a[4] + '">' + a[3] + "</span>"]); }).join("") + "</div></div>" +
        '<div class="card"><b class="h">Send again</b><div class="ppl">' + [["N", 1, "Noor"], ["T", 2, "Tolu"], ["K", 3, "Kofi"], ["I", 1, "Ines"]].map(function (p) { return "<span>" + tk(p[0], p[1]) + p[2] + "</span>"; }).join("") + "</div></div></div></div></div>",
      structure: [
        "Top bar: product name, four text links with the active one marked, a shortened wallet address and a button.",
        "Left column: a balance card filled with the primary colour and using the on-primary colour for its text, showing the total balance in a large monospace figure, today's change and the address, with a row of four round action buttons (Send, Receive, Buy, Swap).",
        "Under it, a tokens list: round token badge, name and amount on the left, value and 24-hour change on the right, with a Manage link.",
        "Right column: an activity list with a square direction badge, a title and a detail line, and the amount coloured by direction; then a Send again card with a row of round contact badges and names."
      ],
      layout: ["Two equal columns centred on the page, max width about 980px.", "The balance card is the visual anchor; everything else is quiet surface cards."],
      responsive: ["Below 640px the two columns stack, with the balance card first."]
    },
    {
      id: "c-dao", name: "Governance", blurb: "Proposals, votes and treasury", what: "a DAO governance dashboard",
      html: '<div class="cshell">' + side("Commons", ["Proposals", "Treasury", "Delegates", "Forum", "Docs"], 0) + '<div class="cmain">' +
        '<div class="rowb head"><div><span class="mu sm">3 active &middot; 128 passed</span><span class="h t1">Proposals</span></div><div class="acts"><span class="bt gh">Delegate</span><span class="bt">New proposal</span></div></div>' +
        '<div class="two rev"><div class="plist">' +
        [["CP-41", "Fund the grants round for the first half of 2027", "Active", "Ends in 2 days", 71, "4.2M", "1.7M"], ["CP-40", "Lower the swap fee on stable pairs to 0.02%", "Active", "Ends in 5 days", 48, "2.9M", "3.1M"], ["CP-39", "Add Base as a supported chain", "Passed", "Executed 9 Nov", 88, "6.8M", "0.9M"]].map(function (p) {
          return '<div class="card prop"><div class="rowb"><span class="m mu sm">' + p[0] + '</span><span class="pill' + (p[2] === "Passed" ? " ok" : "") + '">' + p[2] + '</span></div><span class="h">' + p[1] + '</span><div class="vote"><i style="width:' + p[4] + '%"></i></div><div class="rowb sm"><span><span class="up m">' + p[5] + '</span> for &nbsp; <span class="dn m">' + p[6] + '</span> against</span><span class="mu">' + p[3] + "</span></div></div>"; }).join("") + "</div>" +
        '<div class="scol"><div class="card vp"><span class="sm">Your voting power</span><b class="m big">18,420</b><span class="sm">0.21% of supply &middot; delegated to yourself</span><span class="bt full">Vote on CP-41</span></div>' +
        '<div class="card"><b class="h">Treasury</b><b class="m tre">$62.4M</b><div class="dn2">' + donut([54, 31, 15]) + legend([["Stablecoins", "54%"], ["Native token", "31%"], ["ETH", "15%"]]) + "</div></div></div></div></div></div>",
      structure: [
        "Left sidebar: product name, vertical menu (Proposals, Treasury, Delegates, Forum, Docs) with the active item filled in the primary colour, and a connected-wallet card at the bottom.",
        "Page header: counts of active and passed proposals in muted text, the page title, and two actions (outlined Delegate, primary New proposal).",
        "A main column of proposal cards. Each has an identifier in the monospace font, a status badge, the proposal title in the heading font, a single bar split between for and against in the positive and negative colours, the vote totals, and the time remaining.",
        "A side column: a voting-power card filled with the primary colour showing a large figure, the share of supply and a full-width button; and a treasury card with the total, a donut chart and a legend."
      ],
      layout: ["Two-column app shell: fixed 210px sidebar and a fluid main area.", "Inside the main area, proposals take about two thirds and the side column one third."],
      responsive: ["Below 640px the sidebar collapses to a top bar and the side column moves above the proposals."]
    },
    {
      id: "c-launch", name: "Token launch", blurb: "Sale progress, tiers and tokenomics", what: "a token sale launch page",
      html: '<div class="cfull">' + top("Liftoff", ["Live", "Upcoming", "Ended", "Apply"], 0) +
        '<div class="cpad"><div class="two rev"><div class="card sale"><div class="rowb"><div class="as">' + tk("K", 1) + '<span><b class="h pr">Kestrel</b><small>KST &middot; Public sale</small></span></div><span class="pill">Live</span></div>' +
        '<span class="h big">A data network owned by the people who feed it</span><p class="mu">Kestrel pays contributors for verified market data. The public sale funds the first two years of rewards.</p>' +
        '<div class="rowb sm"><span><b class="m">$3.42M</b> raised</span><span class="mu m">Goal $5.00M</span></div><div class="gauge"><i style="width:68%"></i></div><div class="rowb sm mu"><span class="m">68% filled &middot; 4,182 participants</span><span class="m">1 KST = $0.045</span></div>' +
        '<div class="cd">' + [["02", "days"], ["14", "hours"], ["37", "minutes"], ["09", "seconds"]].map(function (c) { return '<div><b class="m">' + c[0] + '</b><span class="mu sm">' + c[1] + "</span></div>"; }).join("") + "</div></div>" +
        '<div class="scol"><div class="card buyb"><b class="h">Join the sale</b><label>You pay<span class="fld2 m">500.00 <em>USDC</em></span></label><label>You get<span class="fld2 m">11,111.11 <em>KST</em></span></label><div class="rowb sm"><span class="mu">Your limit</span><span class="m">$2,000</span></div><span class="bt full">Buy KST</span><span class="mu sm">Tokens unlock 25% at launch, then monthly for 9 months.</span></div></div></div>' +
        '<div class="kpis k3">' + [["Community", "$250 limit", "Open to everyone", ""], ["Supporter", "$2,000 limit", "Hold 1,000 LFT", " best"], ["Partner", "$10,000 limit", "By application", ""]].map(function (t) { return '<div class="card kp' + t[3] + '"><span class="sm">' + t[0] + '</span><b class="m">' + t[1] + '</b><span class="sm">' + t[2] + "</span></div>"; }).join("") + "</div>" +
        '<div class="card"><b class="h">Token distribution</b><div class="dn2 wide">' + donut([40, 25, 20, 15]) + legend([["Contributor rewards", "40%"], ["Public sale", "25%"], ["Team, 3-year vesting", "20%"], ["Treasury", "15%"]]) + "</div></div></div></div>",
      structure: [
        "Top bar: product name, four text links with the active one marked, a shortened wallet address and a primary button.",
        "A two-column opening row. The main card has the token badge, name and ticker, a Live badge, a large headline, a muted paragraph, the amount raised against the goal, a progress bar, participant and price notes, and a countdown of four boxes (days, hours, minutes, seconds) in the monospace font.",
        "The side card is a purchase box: You pay and You get fields with their units, the personal limit, a full-width primary button and a muted unlock note.",
        "Three tier cards with a name, a limit in the monospace font and the requirement; the middle tier is filled with the primary colour.",
        "A token distribution card: a donut chart beside a legend of four allocations."
      ],
      layout: ["Single column with 32px side padding, content max width about 1100px.", "The opening row is roughly two thirds and one third; tier cards are three equal columns."],
      responsive: ["Below 640px the purchase box moves under the sale card, tier cards stack and the countdown stays on one line with smaller boxes."]
    },
    {
      id: "c-yield", name: "Yield vaults", blurb: "Vault cards with APY and deposits", what: "a yield vaults dashboard",
      html: '<div class="cfull">' + top("Orchard", ["Vaults", "Portfolio", "Boosts", "Docs"], 0) +
        '<div class="cpad"><div class="rowb head"><div><span class="mu sm">24 vaults &middot; $318M deposited</span><span class="h t1">Vaults</span></div><div class="chips"><span class="on">All</span><span>Stable</span><span class="hidem">Blue chip</span><span class="hidem">Higher risk</span></div></div>' +
        '<div class="vgrid">' + [["U", "D", 3, 1, "USDC / DAI", "Stable pair", "8.42%", "$84.2M", 1, "Lending loop"], ["E", "U", 2, 3, "ETH / USDC", "Blue chip", "14.10%", "$61.7M", 2, "Concentrated range"], ["B", "E", 1, 2, "WBTC / ETH", "Blue chip", "6.85%", "$52.3M", 2, "Auto-compound"], ["S", "U", 1, 3, "SOL / USDC", "Higher risk", "27.60%", "$18.9M", 3, "Managed range"], ["E", "", 2, 0, "Staked ETH", "Single asset", "4.12%", "$73.0M", 1, "Liquid staking"], ["U", "", 3, 0, "USDC", "Single asset", "5.36%", "$28.4M", 1, "Money market"]].map(function (v) {
          return '<div class="card vault"><div class="rowb"><span class="as">' + tk(v[0], v[2]) + (v[1] ? tk(v[1], v[3]) : "") + "<span><b>" + v[4] + "</b><small>" + v[5] + '</small></span></span><span class="risk r' + v[8] + '"><i></i><i></i><i></i></span></div>' +
            '<div class="rowb"><div><span class="mu sm">APY</span><b class="m apy">' + v[6] + '</b></div><div class="rt"><span class="mu sm">Deposited</span><b class="m">' + v[7] + "</b></div></div>" +
            '<div class="rowb"><span class="pill">' + v[9] + '</span><span class="bt sm">Deposit</span></div></div>'; }).join("") + "</div>" +
        '<div class="card"><div class="rowb"><b class="h">Your deposits</b><span class="m mu sm">$31,880.00 &middot; earning $7.62 a day</span></div><div class="tb">' + tr("c5 hd", ["<span>Vault</span>", '<span class="hidem">Deposited</span>', '<span class="hidem">APY</span>', '<span class="hidem">Earned</span>', "<span></span>"]) +
        tr("c5", ['<span class="as">' + tk("E", 2) + tk("U", 3) + "<b>ETH / USDC</b></span>", '<span class="m hidem">$20,000.00</span>', '<span class="hidem">' + up("14.10%") + "</span>", '<span class="m hidem">$642.18</span>', '<span><span class="bt gh sm">Withdraw</span></span>']) +
        tr("c5", ['<span class="as">' + tk("U", 3) + "<b>USDC</b></span>", '<span class="m hidem">$11,880.00</span>', '<span class="hidem">' + up("5.36%") + "</span>", '<span class="m hidem">$118.40</span>', '<span><span class="bt gh sm">Withdraw</span></span>']) + "</div></div></div></div>",
      structure: [
        "Top bar: product name, four text links with the active one marked, a shortened wallet address and a primary button.",
        "Page header: the number of vaults and total deposited in muted text, the page title, and filter chips (All, Stable, Blue chip, Higher risk) with the active chip filled in the text colour.",
        "A three-column grid of vault cards. Each has one or two overlapping token badges, the vault name and type, a three-dot risk indicator, a large APY figure in the monospace font opposite the amount deposited, a strategy badge and a small primary Deposit button.",
        "A Your deposits table with the total and daily earnings in its header: vault, amount deposited, APY, earned so far and an outlined Withdraw button."
      ],
      layout: ["Single column with 32px side padding, content max width about 1200px.", "Vault cards are three equal columns with the standard gap."],
      responsive: ["Below 640px vault cards stack into one column and the deposits table keeps the vault and the Withdraw button."]
    },
    {
      id: "c-markets", name: "Markets", blurb: "Prices, movers and market table", what: "a crypto markets and prices page",
      html: '<div class="cshell">' + side("Tape", ["Markets", "Watchlist", "Gainers", "New listings", "Sectors", "Alerts"], 0) + '<div class="cmain">' +
        '<div class="rowb head"><div><span class="mu sm">Market cap $3.41T &middot; 24h volume $148B</span><span class="h t1">Markets</span></div><div class="acts"><span class="search hidem">Search 1,240 assets</span><span class="bt">Add alert</span></div></div>' +
        '<div class="kpis k4">' + [["B", 1, "Bitcoin", "$97,420", "+2.1%", [3, 4, 3, 5, 6, 5, 7], "up"], ["E", 2, "Ether", "$3,412", "+1.8%", [4, 4, 5, 4, 6, 6, 7], "up"], ["S", 1, "Solana", "$214.35", "-0.9%", [7, 6, 6, 5, 6, 4, 4], "dn"], ["L", 3, "Chainlink", "$23.18", "+5.4%", [2, 3, 3, 4, 6, 6, 8], "up"]].map(function (m) {
          return '<div class="card mv"><div class="rowb"><span class="as">' + tk(m[0], m[1]) + "<b>" + m[2] + '</b></span><span class="m ' + m[6] + ' sm">' + m[4] + '</span></div><b class="m">' + m[3] + '</b><span class="' + m[6] + '">' + spark(m[5]) + "</span></div>"; }).join("") + "</div>" +
        '<div class="card"><div class="rowb"><b class="h">All assets</b><span class="segc"><i class="on">All</i><i>DeFi</i><i>Layer 1</i><i class="hidem">Stablecoins</i></span></div><div class="tb">' + tr("c7 hd", ["<span>#</span>", "<span>Asset</span>", '<span class="hidem">1h</span>', '<span class="hidem">24h</span>', '<span class="hidem">Market cap</span>', '<span class="hidem">7 days</span>', "<span>Price</span>"]) +
        [[1, "B", 1, "Bitcoin", "BTC", "+0.2%", 1, "+2.1%", 1, "$1.93T", [3, 4, 3, 5, 6, 5, 7], "$97,420.10"], [2, "E", 2, "Ether", "ETH", "+0.1%", 1, "+1.8%", 1, "$410.6B", [4, 4, 5, 4, 6, 6, 7], "$3,412.60"], [3, "U", 3, "Tether", "USDT", "0.0%", 0, "0.0%", 0, "$139.2B", [5, 5, 5, 5, 5, 5, 5], "$1.00"], [4, "S", 1, "Solana", "SOL", "-0.3%", -1, "-0.9%", -1, "$101.4B", [7, 6, 6, 5, 6, 4, 4], "$214.35"], [5, "L", 3, "Chainlink", "LINK", "+0.8%", 1, "+5.4%", 1, "$14.5B", [2, 3, 3, 4, 6, 6, 8], "$23.18"], [6, "A", 2, "Aave", "AAVE", "-0.1%", -1, "+3.0%", 1, "$4.9B", [4, 5, 4, 5, 6, 7, 7], "$326.40"]].map(function (a) {
          var c = function (n) { return n > 0 ? "up" : n < 0 ? "dn" : "mu"; };
          return tr("c7", ['<span class="m mu">' + a[0] + "</span>", '<span class="as">' + tk(a[1], a[2]) + "<span><b>" + a[3] + "</b><small>" + a[4] + "</small></span></span>", '<span class="m hidem ' + c(a[6]) + '">' + a[5] + "</span>", '<span class="m hidem ' + c(a[8]) + '">' + a[7] + "</span>", '<span class="m hidem">' + a[9] + "</span>", '<span class="hidem ' + c(a[8]) + '">' + spark(a[10]) + "</span>", '<span class="m">' + a[11] + "</span>"]); }).join("") + "</div></div></div></div>",
      structure: [
        "Left sidebar: product name, vertical menu (Markets, Watchlist, Gainers, New listings, Sectors, Alerts) with the active item filled in the primary colour, and a connected-wallet card at the bottom.",
        "Page header: total market cap and 24-hour volume in muted text, the page title, a rounded search field and a primary Add alert button.",
        "Four mover cards: token badge and name with the 24-hour change, the price in a large monospace figure, and a sparkline coloured by direction.",
        "An All assets table with a sector switch: rank, asset (badge, name, ticker), 1-hour change, 24-hour change, market cap, a 7-day sparkline and price, with changes coloured by direction and numbers in the monospace font."
      ],
      layout: ["Two-column app shell: fixed 210px sidebar and a fluid main area.", "Mover cards are four equal columns; the table spans the full main width."],
      responsive: ["Below 640px the sidebar collapses to a top bar, mover cards become two columns and the table keeps rank, asset and price."]
    }
  ];
  L.forEach(function (l) { l.cat = "Crypto"; l.html = '<div class="cx">' + l.html + "</div>"; T.push(l); });

  /* ---------- twelve crypto styles: three per look ---------- */
  var add = function (k, fonts, colors, shape) { ST[k] = { fonts: fonts, colors: colors, shape: shape }; };
  add("cm1", ["Inter", "Inter", "IBM Plex Mono"], ["#FFFFFF", "#0F1115", "#0F1115", "#6B7280", "#2563EB"], ["soft", "none", "comfortable", "tight"]);
  add("cm2", ["Manrope", "DM Sans", "DM Mono"], ["#FAFAF7", "#17201B", "#0E7A4E", "#5F6F66", "#C2410C"], ["soft", "none", "spacious", "tight"]);
  add("cm3", ["Space Grotesk", "Inter", "JetBrains Mono"], ["#F7F7F5", "#141414", "#141414", "#8A8A8A", "#F97316"], ["sharp", "none", "comfortable", "tight"]);
  add("cr1", ["Manrope", "DM Sans", "IBM Plex Mono"], ["#F7F1E8", "#2A1830", "#5B2A6B", "#B8683A", "#D99A2B"], ["round", "strong", "comfortable", "tight"]);
  add("cr2", ["Bricolage Grotesque", "Instrument Sans", "DM Mono"], ["#F3F1FB", "#1B1530", "#4F3BD9", "#B14FD6", "#F2A93B"], ["round", "strong", "spacious", "tight"]);
  add("cr3", ["Fraunces", "Work Sans", "IBM Plex Mono"], ["#EEF4EC", "#132419", "#17603F", "#7FA650", "#D4A22A"], ["round", "strong", "comfortable", "normal"]);
  add("cc1", ["Syne", "Inter", "Space Mono"], ["#FFFFFF", "#0B1026", "#2F54EB", "#E0399B", "#FFC021"], ["round", "soft", "comfortable", "tight"]);
  add("cc2", ["Unbounded", "Manrope", "DM Mono"], ["#FFF8EE", "#22160C", "#F4621F", "#6D3BE6", "#12A594"], ["round", "soft", "comfortable", "tight"]);
  add("cc3", ["Bricolage Grotesque", "Instrument Sans", "JetBrains Mono"], ["#F4FBF6", "#0D2318", "#12B76A", "#2E6BF0", "#FF6B4A"], ["round", "soft", "comfortable", "tight"]);
  add("cd1", ["Space Grotesk", "IBM Plex Sans", "JetBrains Mono"], ["#0A0D0B", "#E4F5E9", "#B6F23C", "#3DD6A2", "#FFB020"], ["soft", "none", "comfortable", "tight"]);
  add("cd2", ["Syne", "Inter", "IBM Plex Mono"], ["#0B1022", "#E7ECFB", "#5B8CFF", "#A26BFF", "#35E0D0"], ["round", "none", "comfortable", "tight"]);
  add("cd3", ["Manrope", "DM Sans", "DM Mono"], ["#141110", "#F3ECE6", "#FF8A1F", "#E0552B", "#FFD166"], ["soft", "none", "comfortable", "tight"]);

  var LOOKS = [["minimal", "Minimal", "cm"], ["rich", "Detailed", "cr"], ["colour", "Colourful", "cc"], ["dark", "Dark", "cd"]], out = [];
  L.forEach(function (l, i) {
    LOOKS.forEach(function (k) { out.push({ id: l.id + "-" + k[0], layout: l.id, name: l.name + ", " + k[1].toLowerCase(), style: k[2] + (i % 3 + 1), look: k[0] }); });
  });
  /* crypto designs lead the library; each row of four shows four different screens in the four looks */
  var order = [];
  for (var r = 0; r < L.length; r++) for (var k = 0; k < 4; k++) order.push(out[((r + k * 3) % L.length) * 4 + k]);
  window.FL_DESIGNS = order.concat(D);
  window.FL_LOOKS = { minimal: "Minimal", rich: "Detailed", colour: "Colourful", dark: "Dark" };
})();
