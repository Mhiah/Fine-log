/* Fine-log UI templates.
   Each template is plain markup styled only through the --t-* design tokens,
   so changing a font, colour or shape restyles every template at once.
   The structure, layout and responsive notes feed the prompt generator. */
window.FL_TEMPLATES = [
  {
    id: "dashboard",
    name: "Fintech dashboard",
    blurb: "Sidebar, balances, chart, table",
    what: "a fintech dashboard web app",
    html:
      '<div class="t-dash">' +
        '<div class="side"><span class="h logo">Ledger</span>' +
          '<span class="onlym bt gh sm">Menu</span>' +
          '<div class="menu"><span class="on">Overview</span><span>Accounts</span><span>Transfers</span><span>Cards</span><span>Reports</span><span>Settings</span></div>' +
          '<div class="card mini"><span class="mu sm">Savings goal</span><b class="m">68%</b><span class="bar"><i style="width:68%"></i></span></div>' +
        '</div>' +
        '<div class="main">' +
          '<div class="rowb head"><div><span class="mu sm">Monday, 16 November</span><span class="h t1">Good evening, Ada</span></div>' +
            '<div class="acts"><span class="bt gh">Export</span><span class="bt">Send money</span></div></div>' +
          '<div class="kpis">' +
            '<div class="card"><span class="mu sm">Total balance</span><b class="m">$48,203.50</b><span class="pill">+2.4% this month</span></div>' +
            '<div class="card"><span class="mu sm">Income</span><b class="m">$12,940.00</b><span class="mu sm">3 sources</span></div>' +
            '<div class="card"><span class="mu sm">Spending</span><b class="m">$7,316.80</b><span class="mu sm">62% of budget</span></div>' +
          '</div>' +
          '<div class="two">' +
            '<div class="card"><div class="rowb"><b class="h">Cash flow</b><span class="pill">Last 6 months</span></div>' +
              '<svg viewBox="0 0 600 210" role="img" aria-label="Cash flow chart">' +
                '<g style="stroke:var(--t-border)" stroke-width="1"><line x1="0" y1="40" x2="600" y2="40"/><line x1="0" y1="95" x2="600" y2="95"/><line x1="0" y1="150" x2="600" y2="150"/></g>' +
                '<path d="M0 150 L100 122 L200 132 L300 86 L400 98 L500 52 L600 38 L600 185 L0 185 Z" style="fill:var(--t-primary)" opacity=".14"/>' +
                '<path d="M0 150 L100 122 L200 132 L300 86 L400 98 L500 52 L600 38" fill="none" style="stroke:var(--t-primary)" stroke-width="3" stroke-linejoin="round"/>' +
                '<path d="M0 168 L100 158 L200 162 L300 140 L400 146 L500 128 L600 120" fill="none" style="stroke:var(--t-secondary)" stroke-width="2.5" stroke-dasharray="6 6"/>' +
                '<circle cx="600" cy="38" r="6" style="fill:var(--t-primary)"/>' +
                '<g style="fill:var(--t-muted);font-family:var(--t-fm)" font-size="13"><text x="0" y="205">Jun</text><text x="112" y="205">Jul</text><text x="226" y="205">Aug</text><text x="340" y="205">Sep</text><text x="454" y="205">Oct</text><text x="568" y="205">Nov</text></g>' +
              '</svg></div>' +
            '<div class="card"><b class="h">Spending</b><div class="cat">' +
              '<div><div class="rowb sm"><span>Rent and bills</span><span class="m">$3,100</span></div><span class="bar p"><i style="width:78%"></i></span></div>' +
              '<div><div class="rowb sm"><span>Food</span><span class="m">$1,420</span></div><span class="bar s"><i style="width:46%"></i></span></div>' +
              '<div><div class="rowb sm"><span>Transport</span><span class="m">$640</span></div><span class="bar"><i style="width:24%"></i></span></div>' +
              '<div><div class="rowb sm"><span>Subscriptions</span><span class="m">$212</span></div><span class="bar p"><i style="width:12%"></i></span></div>' +
            '</div></div>' +
          '</div>' +
          '<div class="card"><b class="h">Recent transactions</b><div class="tb">' +
            '<div class="tr hd"><span>Description</span><span class="hidem">Date</span><span class="hidem">Status</span><span>Amount</span></div>' +
            '<div class="tr"><span>Northwind Studio</span><span class="mu hidem">14 Nov</span><span class="hidem"><span class="pill">Received</span></span><span class="m">+$2,400.00</span></div>' +
            '<div class="tr"><span>City Power</span><span class="mu hidem">12 Nov</span><span class="hidem mu">Paid</span><span class="m">-$86.40</span></div>' +
            '<div class="tr"><span>Transfer to savings</span><span class="mu hidem">10 Nov</span><span class="hidem mu">Paid</span><span class="m">-$500.00</span></div>' +
            '<div class="tr"><span>Fresh Market</span><span class="mu hidem">09 Nov</span><span class="hidem mu">Paid</span><span class="m">-$63.15</span></div>' +
          '</div></div>' +
        '</div>' +
      '</div>',
    structure: [
      "Left sidebar: product name at the top, vertical menu (Overview, Accounts, Transfers, Cards, Reports, Settings) with the active item filled in the primary colour, and a small savings-goal card pinned to the bottom.",
      "Page header: date in muted text, a greeting as the page title, and two actions on the right (a secondary Export button and a primary Send money button).",
      "A row of three stat cards: total balance, income and spending. Each has a muted label, a large figure in the monospace font and a short note or badge.",
      "A two-column row: a cash-flow line chart with a soft area fill (primary line, dashed secondary line), and a spending breakdown list with thin progress bars.",
      "A recent-transactions table: description, date, status and right-aligned amount in the monospace font."
    ],
    layout: [
      "Two-column app shell: fixed 220px sidebar on the surface colour, fluid main area on the background colour.",
      "Main area is a single column of rows separated by the standard gap. Stat cards are three equal columns."
    ],
    responsive: [
      "Below 640px the sidebar collapses into a top bar with the product name and a Menu button.",
      "Stat cards and the chart row stack into one column. The table keeps only description and amount."
    ]
  },
  {
    id: "landing",
    name: "SaaS landing page",
    blurb: "Hero, features, pricing, call to action",
    what: "a SaaS marketing landing page",
    html:
      '<div class="t-land">' +
        '<div class="nav"><span class="h logo">Relay</span><div class="links"><span class="hidem">Product</span><span class="hidem">Pricing</span><span class="hidem">Docs</span><span class="bt">Start free</span></div></div>' +
        '<div class="lead"><span class="pill">New: shared inboxes</span>' +
          '<span class="h">Answer every customer in one place</span>' +
          '<p>Relay pulls email, chat and social messages into a single queue, so your team replies faster and nothing gets missed.</p>' +
          '<div class="acts"><span class="bt">Start free</span><span class="bt gh">Watch the demo</span></div></div>' +
        '<div class="logos"><span>Northwind</span><span>Lumen</span><span>Fieldnote</span><span>Harbor</span><span>Quill</span></div>' +
        '<div class="feat">' +
          '<div class="card"><div class="ic g1"></div><span class="h">One shared queue</span><p class="mu">Every channel lands in the same list, sorted by who has waited longest.</p></div>' +
          '<div class="card"><div class="ic g2"></div><span class="h">Replies that sound like you</span><p class="mu">Saved answers adapt to each customer and stay in your tone.</p></div>' +
          '<div class="card"><div class="ic g3"></div><span class="h">Numbers you can act on</span><p class="mu">See response time and workload per person, updated live.</p></div>' +
        '</div>' +
        '<span class="h sec">Simple pricing</span>' +
        '<div class="price">' +
          '<div class="card"><b>Starter</b><b class="m">$0</b><span class="mu sm">Up to 2 teammates</span><span class="bt gh">Choose Starter</span></div>' +
          '<div class="card best"><b>Team</b><b class="m">$29</b><span class="mu sm">Per teammate, per month</span><span class="bt">Choose Team</span></div>' +
          '<div class="card"><b>Scale</b><b class="m">$79</b><span class="mu sm">Advanced routing and reports</span><span class="bt gh">Talk to sales</span></div>' +
        '</div>' +
        '<div class="cta"><span class="h">Clear your inbox by Friday</span><span class="bt">Start free</span></div>' +
        '<div class="foot"><span>Relay, Inc.</span><span>Privacy · Terms · Status</span></div>' +
      '</div>',
    structure: [
      "Top navigation: product name on the left, three text links and a primary button on the right.",
      "Centred hero: a small accent badge, a large headline, one supporting paragraph in muted text, and two buttons (primary and outlined).",
      "A row of customer names in muted text as social proof.",
      "Three feature cards, each with a small coloured icon tile, a heading and a short description.",
      "Pricing: a centred section heading and three plan cards. The middle plan is filled with the primary colour and uses the on-primary colour for its text.",
      "A call-to-action band filled with the secondary colour: headline on the left, button on the right.",
      "A slim footer with the company name and legal links."
    ],
    layout: [
      "Single centred column, content max width about 1100px, 40px side padding.",
      "Features and pricing are three equal columns with the standard gap."
    ],
    responsive: [
      "Below 640px the text links hide and only the primary button stays in the navigation.",
      "The headline drops to about two thirds of its size. Feature and pricing cards stack. The call-to-action band stacks with the button under the headline."
    ]
  },
  {
    id: "portfolio",
    name: "Portfolio",
    blurb: "Editorial type, projects, about",
    what: "a personal portfolio website",
    html:
      '<div class="t-port">' +
        '<div class="top2"><span class="h" style="font-size:1.2em">Noor Adeyemi</span><div class="links"><span>Work</span><span class="hidem">About</span><span class="lk">Say hello</span></div></div>' +
        '<span class="h big">Brand designer for small, stubborn companies</span>' +
        '<div class="intro"><p>I build identities and websites for founders who would rather be clear than loud. Nine years, forty-one launches.</p><span class="mu m sm">Available from January · Based in Lagos, working worldwide</span></div>' +
        '<div class="work">' +
          '<div><div class="ph g1"></div><div class="rowb"><span class="h">Fieldnote</span><span class="m mu sm">2026</span></div><span class="mu sm">Identity and web for a research app</span></div>' +
          '<div><div class="ph g5"></div><div class="rowb"><span class="h">Harbor Coffee</span><span class="m mu sm">2025</span></div><span class="mu sm">Packaging and shop</span></div>' +
          '<div><div class="ph g6"></div><div class="rowb"><span class="h">Lumen Health</span><span class="m mu sm">2025</span></div><span class="mu sm">Brand system</span></div>' +
          '<div><div class="ph g2"></div><div class="rowb"><span class="h">Quill</span><span class="m mu sm">2024</span></div><span class="mu sm">Editorial site for a writing tool</span></div>' +
        '</div>' +
        '<div class="about"><span class="h" style="font-size:1.5em">About</span><p>I start with words before pixels: what the company does, for whom, and why anyone should care. The visuals follow from that. If you have a launch coming, <span class="lk">write to me</span>.</p></div>' +
      '</div>',
    structure: [
      "A minimal top row: the person's name on the left, two text links and an underlined contact link in the primary colour on the right.",
      "A very large editorial headline that states what the person does, set in the heading font and filling most of the width.",
      "An intro row: a short paragraph on the left and availability details in small monospace text on the right.",
      "A two-column project grid. Each project has a large image area, the project name in the heading font, the year in monospace, and a one-line description in muted text.",
      "An about section separated by a thin border: a heading on the left and a paragraph on the right with an inline contact link."
    ],
    layout: [
      "Single column with generous 44px side padding and large vertical gaps between sections.",
      "Typography carries the page: no cards, no shadows on text blocks, images use the card radius."
    ],
    responsive: [
      "Below 640px the headline drops to just over half its size and every two-column row becomes one column.",
      "Side padding reduces to 18px."
    ]
  },
  {
    id: "shop",
    name: "E-commerce",
    blurb: "Product grid, filters, order summary",
    what: "an online shop",
    html:
      '<div class="t-shop">' +
        '<div class="nav"><span class="h logo">Clay &amp; Co.</span><div class="links"><span class="hidem">Shop</span><span class="hidem">Journal</span><span class="hidem">About</span><span>Cart<span class="cart">2</span></span></div></div>' +
        '<div class="body"><div>' +
          '<span class="h ttl">Tableware</span>' +
          '<div class="chips"><span class="on">All</span><span>Mugs</span><span>Plates</span><span>Bowls</span><span>Vases</span></div>' +
          '<div class="grid">' +
            '<div class="prod"><div class="ph g4"></div><b>Speckled mug</b><div class="rowb"><span class="m">$24.00</span><span class="pill">New</span></div></div>' +
            '<div class="prod"><div class="ph g5"></div><b>Dinner plate</b><span class="m">$32.00</span></div>' +
            '<div class="prod"><div class="ph g6"></div><b>Ramen bowl</b><span class="m">$38.00</span></div>' +
            '<div class="prod"><div class="ph g1"></div><b>Bud vase</b><span class="m">$29.00</span></div>' +
            '<div class="prod"><div class="ph g2"></div><b>Espresso cup</b><div class="rowb"><span class="m">$18.00</span><span class="pill">Low stock</span></div></div>' +
            '<div class="prod"><div class="ph g3"></div><b>Serving dish</b><span class="m">$54.00</span></div>' +
          '</div></div>' +
          '<div class="card sum"><span class="h">Your order</span>' +
            '<div class="line"><span>Speckled mug × 2</span><span class="m">$48.00</span></div>' +
            '<div class="line mu"><span>Shipping</span><span class="m">$6.50</span></div>' +
            '<div class="line tot"><span>Total</span><span class="m">$54.50</span></div>' +
            '<span class="bt">Check out</span><span class="mu sm">Free returns within 30 days</span></div>' +
        '</div>' +
      '</div>',
    structure: [
      "Top navigation: shop name on the left, three text links and a cart link with a count badge in the accent colour on the right.",
      "A category title in the heading font with a row of filter chips under it. The active chip is filled with the text colour.",
      "A three-column product grid. Each product has a square image area, a name, a price in the monospace font and an optional accent badge such as New or Low stock.",
      "An order summary card in a right-hand column: line items, shipping, a total separated by a border, a full-width primary Check out button and a short reassurance line."
    ],
    layout: [
      "Two-column body: fluid product area and a fixed 300px summary column, 40px side padding.",
      "Product grid is three equal columns with the standard gap."
    ],
    responsive: [
      "Below 640px the summary card moves under the products and the grid becomes two columns.",
      "Navigation keeps only the shop name and cart."
    ]
  }
];
