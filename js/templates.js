/* Fine-log UI templates.
   Each template is plain markup styled only through the --t-* design tokens,
   so changing a font, colour or shape restyles every template at once.
   The structure, layout and responsive notes feed the prompt generator. */
/* Photos are served by Unsplash (free to use under the Unsplash License). If one fails to load, the tinted block behind it shows instead. */
function flPhoto(id, alt, w) {
  return '<img src="https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + (w || 800) + '&q=70" alt="' + alt + '" decoding="async" onerror="this.remove()">';
}
window.FL_TEMPLATES = [
  {
    id: "dashboard",
    name: "Fintech dashboard",
    blurb: "Product, admin or analytics",
    cat: "Dashboard",
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
    name: "Landing page",
    blurb: "Product, startup or creative site",
    cat: "Landing",
    what: "a marketing landing page",
    html:
      '<div class="t-land">' +
        '<div class="nav"><span class="h logo">Studio</span><div class="links"><span class="hidem">Work</span><span class="hidem">Services</span><span class="hidem">About</span><span class="bt">Contact</span></div></div>' +
        '<div class="lead"><div class="txt"><span class="pill">Booking for spring</span>' +
          '<span class="h">Creative work with <span class="ac">purpose.</span></span>' +
          '<p>A small studio for brands, websites and product launches. We make things that are clear, considered and built to last.</p>' +
          '<div class="acts"><span class="bt">Get started</span><span class="bt gh">View work</span></div></div>' +
          '<div class="ph g4 art">' + flPhoto("1483366774565-c783b9f70e2c", "Concrete building seen from below", 900) + '</div></div>' +
        '<div class="logos"><span>Northwind</span><span>Lumen</span><span>Fieldnote</span><span>Harbor</span><span>Quill</span></div>' +
        '<div class="feat">' +
          '<div class="card"><div class="ic g1"></div><span class="h">Brand identity</span><p class="mu">Names, marks and a visual system your team can actually use.</p></div>' +
          '<div class="card"><div class="ic g2"></div><span class="h">Websites</span><p class="mu">Fast, readable sites designed and built in one place.</p></div>' +
          '<div class="card"><div class="ic g3"></div><span class="h">Launch support</span><p class="mu">Copy, visuals and a plan for the first ninety days.</p></div>' +
        '</div>' +
        '<span class="h sec">Ways to work together</span>' +
        '<div class="price">' +
          '<div class="card"><b>Sprint</b><b class="m">$2,400</b><span class="mu sm">One week, one clear outcome</span><span class="bt gh">Book a sprint</span></div>' +
          '<div class="card best"><b>Project</b><b class="m">$9,800</b><span class="mu sm">Brand and website, six weeks</span><span class="bt">Start a project</span></div>' +
          '<div class="card"><b>Retainer</b><b class="m">$3,200</b><span class="mu sm">Per month, ongoing design</span><span class="bt gh">Talk to us</span></div>' +
        '</div>' +
        '<div class="cta"><span class="h">Have a launch coming up?</span><span class="bt">Get started</span></div>' +
        '<div class="foot"><span>Studio, Ltd.</span><span>Privacy · Terms · Status</span></div>' +
      '</div>',
    structure: [
      "Top navigation: product name on the left, three text links and a primary button on the right.",
      "Split hero: on the left a small accent badge, a large headline with its last word in the accent colour, one supporting paragraph and two buttons (primary and outlined); on the right a large image or illustration with the card radius.",
      "A row of client names in muted text as social proof.",
      "Three feature cards, each with a small coloured icon tile, a heading and a short description.",
      "Offers: a centred section heading and three cards with a name, a price in the monospace font, a short note and a button. The middle card is filled with the primary colour and uses the on-primary colour for its text.",
      "A call-to-action band filled with the secondary colour: headline on the left, button on the right.",
      "A slim footer with the company name and legal links."
    ],
    layout: [
      "Single centred column, content max width about 1100px, 40px side padding.",
      "Features and pricing are three equal columns with the standard gap."
    ],
    responsive: [
      "Below 640px the text links hide and only the primary button stays in the navigation.",
      "The hero becomes one column with the image under the text, and the headline drops to about two thirds of its size. Feature and offer cards stack. The call-to-action band stacks with the button under the headline."
    ]
  },
  {
    id: "portfolio",
    name: "Portfolio",
    blurb: "Creative portfolio or personal site",
    cat: "Portfolio",
    what: "a personal portfolio website",
    html:
      '<div class="t-port">' +
        '<div class="top2"><span class="h" style="font-size:1.2em">Noor Adeyemi</span><div class="links"><span>Work</span><span class="hidem">About</span><span class="lk">Say hello</span></div></div>' +
        '<span class="h big">Brand designer for small, stubborn companies</span>' +
        '<div class="intro"><p>I build identities and websites for founders who would rather be clear than loud. Nine years, forty-one launches.</p><span class="mu m sm">Available from January · Based in Lagos, working worldwide</span></div>' +
        '<div class="work">' +
          '<div><div class="ph g1">' + flPhoto("1449247709967-d4461a6a6103", "White table beside a brown chair") + '</div><div class="rowb"><span class="h">Fieldnote</span><span class="m mu sm">2026</span></div><span class="mu sm">Identity and web for a research app</span></div>' +
          '<div><div class="ph g5">' + flPhoto("1592078615290-033ee584e267", "Black chair against a teal wall") + '</div><div class="rowb"><span class="h">Harbor Coffee</span><span class="m mu sm">2025</span></div><span class="mu sm">Packaging and shop</span></div>' +
          '<div><div class="ph g6">' + flPhoto("1527576539890-dfa815648363", "Curved building facade against the sky") + '</div><div class="rowb"><span class="h">Lumen Health</span><span class="m mu sm">2025</span></div><span class="mu sm">Brand system</span></div>' +
          '<div><div class="ph g2">' + flPhoto("1597696929736-6d13bed8e6a8", "Ceramic vases in neutral tones") + '</div><div class="rowb"><span class="h">Quill</span><span class="m mu sm">2024</span></div><span class="mu sm">Editorial site for a writing tool</span></div>' +
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
    id: "blog",
    name: "Blog",
    blurb: "Magazine, journal or newsletter",
    cat: "Blog",
    what: "a blog",
    html:
      '<div class="t-blog">' +
        '<div class="nav"><span class="h logo">Fieldnotes</span><div class="links"><span class="hidem">Essays</span><span class="hidem">Guides</span><span class="hidem">About</span><span class="bt">Subscribe</span></div></div>' +
        '<div class="feat"><div><div class="meta"><span class="pill">Featured</span><span class="m mu sm">12 Nov 2026 · 8 min read</span></div>' +
          '<span class="h">Why the best interfaces feel a little boring</span>' +
          '<p class="mu">Familiar patterns are not a lack of imagination. They are a kindness to the person trying to get something done.</p>' +
          '<div class="meta" style="margin-top:16px"><span class="bt">Read the essay</span><span class="sm">By Tolu Bakare</span></div></div>' +
          '<div class="ph g1">' + flPhoto("1519219788971-8d9797e0928e", "Desk lamp on a wooden table", 900) + '</div></div>' +
        '<div class="posts">' +
          '<div class="card"><div class="ph g5">' + flPhoto("1493934558415-9d19f0b2b4d2", "Computer on a wooden desk") + '</div><span class="pill">Guide</span><span class="h">A type scale you can set once and forget</span><span class="m mu sm">05 Nov · 6 min</span></div>' +
          '<div class="card"><div class="ph g6">' + flPhoto("1519947486511-46149fa0a254", "Wooden chair beside a plant") + '</div><span class="pill">Essay</span><span class="h">Colour is a job title, not a mood</span><span class="m mu sm">29 Oct · 5 min</span></div>' +
          '<div class="card"><div class="ph g4">' + flPhoto("1611269154421-4e27233ac5c7", "Wooden table and chairs") + '</div><span class="pill">Notes</span><span class="h">What I learned shipping forty landing pages</span><span class="m mu sm">21 Oct · 9 min</span></div>' +
        '</div>' +
        '<div class="news"><span class="h">One good essay, every other Thursday</span><div class="in"><span class="fld hidem">you@example.com</span><span class="bt">Subscribe</span></div></div>' +
      '</div>',
    structure: [
      "Top navigation: publication name on the left, three text links and a primary Subscribe button on the right.",
      "A featured post in two columns: on the left an accent badge, the date and reading time in the monospace font, a large headline, a muted excerpt, a primary button and the author; on the right a large image with the card radius.",
      "A row of three post cards. Each has an image, an accent category badge, a headline in the heading font, and the date and reading time in the monospace font.",
      "A newsletter band filled with the primary colour: a headline on the left, an email field and a button on the right, all using the on-primary colour."
    ],
    layout: [
      "Single centred column, content max width about 1100px, 40px side padding.",
      "Post cards are three equal columns with the standard gap. Article pages keep text to about 65 characters wide."
    ],
    responsive: [
      "Below 640px the featured post becomes one column with the image under the text, and post cards stack.",
      "The newsletter band stacks, with the button under the headline."
    ]
  },
  {
    id: "agency",
    name: "Agency",
    blurb: "Studio, agency or consultancy",
    cat: "Agency",
    what: "a creative agency website",
    html:
      '<div class="t-agency">' +
        '<div class="pillnav"><span class="h logo">Northwind</span><div class="links"><span class="hidem">Work</span><span class="hidem">Services</span><span class="hidem">Studio</span><span class="hidem">Journal</span></div><span class="bt">Start a project</span></div>' +
        '<div class="top3"><span class="h">We design brands people remember.</span><div class="side2"><p class="mu">Northwind is an independent studio of nine. We do strategy, identity and websites for companies that want to be understood quickly.</p><span class="bt gh">See selected work</span></div></div>' +
        '<div class="ph g1 wide">' + flPhoto("1527576539890-dfa815648363", "Curved building facade against a bright sky", 1200) + '<span class="pill tagp">Selected work, 2026</span></div>' +
        '<div class="bento">' +
          '<div class="card b2"><span class="m mu sm">01</span><span class="h">Strategy</span><p class="mu">Positioning, naming and messaging, written in plain language your team will actually use.</p></div>' +
          '<div class="ph g5 bph">' + flPhoto("1622396481322-3b83d186701b", "White concrete building under a blue sky") + '</div>' +
          '<div class="card bnum"><b class="m">120+</b><span>launches since 2017</span></div>' +
          '<div class="card"><span class="m mu sm">02</span><span class="h">Identity</span><p class="mu">Marks, type and colour as one system.</p></div>' +
          '<div class="card"><span class="m mu sm">03</span><span class="h">Websites</span><p class="mu">Designed and built in the same room.</p></div>' +
        '</div>' +
        '<div class="names"><span>Lumen</span><span>Fieldnote</span><span>Harbor</span><span>Quill</span><span>Kestrel</span><span>Mono</span></div>' +
        '<div class="talk"><span class="h">Let&rsquo;s talk.</span><span class="m">hello@northwind.studio</span></div>' +
      '</div>',
    structure: [
      "A floating, fully rounded navigation bar centred at the top: studio name on the left, four text links in the middle and a primary Start a project button on the right.",
      "An opening row: a very large statement headline on the left and, on the right, a short muted paragraph with an outlined button under it.",
      "A wide feature photo with the card radius and a small accent badge in its lower left corner.",
      "A bento grid of five tiles: a wide Strategy card, a photo tile, a number tile filled with the primary colour, and two narrower service cards. Each service card has a small monospace number, a heading and one line of muted text.",
      "A single row of client names in muted text.",
      "A closing band with a large Let's talk headline on the left and an email address in the monospace font on the right."
    ],
    layout: [
      "Single column, content max width about 1200px, 40px side padding and generous vertical gaps.",
      "The bento grid has four columns: the first card spans two, the photo and number tiles one each, and the two service cards two each on the second row."
    ],
    responsive: [
      "Below 640px the navigation keeps only the studio name and the button, and the opening row stacks.",
      "The bento grid becomes one column and the closing band stacks."
    ]
  },
  {
    id: "moodboard",
    name: "Moodboard",
    blurb: "Gallery, inspiration or photo site",
    cat: "Gallery",
    what: "an image gallery and moodboard site",
    html:
      '<div class="t-mood">' +
        '<div class="nav"><span class="h logo">Moodboard</span><span class="search hidem">Search ideas</span><div class="links"><span class="hidem">Explore</span><span class="bt">Create</span></div></div>' +
        '<div class="tags"><span class="on">For you</span><span>Interiors</span><span>Ceramics</span><span>Architecture</span><span>Workspaces</span><span>Furniture</span></div>' +
        '<div class="mason">' +
          '<div class="pin"><div class="ph g4 r34">' + flPhoto("1586023492125-27b2c045efd7", "Yellow padded chair with a wooden frame", 500) + '<span class="save bt">Save</span></div><b>Mustard and oak</b><span class="mu sm">Furniture</span></div>' +
          '<div class="pin"><div class="ph g5 r11">' + flPhoto("1631125915902-d8abe9225ff2", "Three brown clay vases", 500) + '</div><b>Terracotta trio</b><span class="mu sm">Ceramics</span></div>' +
          '<div class="pin"><div class="ph g6 r45">' + flPhoto("1576831371356-d6e9411ae501", "High-rise building from below", 500) + '</div><b>Lines and sky</b><span class="mu sm">Architecture</span></div>' +
          '<div class="pin"><div class="ph g1 r43">' + flPhoto("1575318634028-6a0cfcb60c59", "Home office with a wooden desk", 500) + '</div><b>Quiet desk</b><span class="mu sm">Workspaces</span></div>' +
          '<div class="pin"><div class="ph g2 r34">' + flPhoto("1522404419647-18cb51cc5c7a", "White concrete building under a teal sky", 500) + '</div><b>Teal and white</b><span class="mu sm">Architecture</span></div>' +
          '<div class="pin"><div class="ph g3 r11">' + flPhoto("1640938776314-4d303f8a1380", "Wooden chair on a yellow background", 500) + '</div><b>Studio yellow</b><span class="mu sm">Furniture</span></div>' +
          '<div class="pin"><div class="ph g4 r45">' + flPhoto("1572853566597-b83cde546912", "Two white ceramic vases", 500) + '</div><b>Paired vases</b><span class="mu sm">Ceramics</span></div>' +
          '<div class="pin"><div class="ph g5 r43">' + flPhoto("1501045661006-fcebe0257c3f", "Armchair beside a snake plant", 500) + '</div><b>Reading corner</b><span class="mu sm">Interiors</span></div>' +
          '<div class="pin"><div class="ph g6 r34">' + flPhoto("1602128110234-2d11c0aaadfe", "White concrete building beside green trees", 500) + '</div><b>Green edge</b><span class="mu sm">Architecture</span></div>' +
          '<div class="pin"><div class="ph g1 r11">' + flPhoto("1597696929644-a2157a251a43", "Floral ceramic mugs", 500) + '</div><b>Painted mugs</b><span class="mu sm">Ceramics</span></div>' +
        '</div>' +
      '</div>',
    structure: [
      "Top navigation: site name on the left, a wide rounded search field in the middle, and an Explore link with a primary Create button on the right.",
      "A horizontal row of topic chips. The active chip is filled with the text colour.",
      "A masonry grid of image tiles in columns of varying height. Each tile is a photo with the card radius, a bold one-line title and a muted category under it. The first tile shows a small primary Save button over the photo."
    ],
    layout: [
      "Full-width layout with 40px side padding. The masonry grid has four columns with the standard gap, and tiles keep their natural aspect ratios (3:4, 1:1, 4:5 and 4:3).",
      "No cards or borders around tiles; the photos carry the page."
    ],
    responsive: [
      "Below 640px the search field hides and the grid becomes two columns.",
      "Topic chips scroll sideways in one row."
    ]
  },
  {
    id: "app",
    name: "Mobile app",
    blurb: "App launch or product page",
    cat: "Mobile app",
    what: "a landing page for a mobile app",
    html:
      '<div class="t-app">' +
        '<div class="nav"><span class="h logo">Tally</span><div class="links"><span class="hidem">Features</span><span class="hidem">Pricing</span><span class="hidem">Help</span><span class="bt">Download</span></div></div>' +
        '<div class="lead2"><span class="pill">New in version 2.0</span><span class="h">Money habits that actually stick</span><p class="mu">Tally shows where your money goes each week and nudges you before you overspend. Two minutes to set up.</p><div class="acts"><span class="bt">Download the app</span><span class="bt gh">See how it works</span></div></div>' +
        '<div class="show">' +
          '<div class="col"><div><span class="ic g1"></span><span class="h">Weekly picture</span><p class="mu">One screen, updated every Monday.</p></div><div><span class="ic g2"></span><span class="h">Gentle nudges</span><p class="mu">A heads-up before a budget runs out.</p></div></div>' +
          '<div class="phone"><div class="scr"><span class="mu sm">This week</span><b class="m big2">$412.60</b><span class="pill">$87 under budget</span>' +
            '<div class="bars"><i style="height:38%"></i><i style="height:62%"></i><i style="height:45%"></i><i class="hi" style="height:88%"></i><i style="height:54%"></i><i style="height:30%"></i><i style="height:48%"></i></div>' +
            '<div class="li"><span>Groceries</span><span class="m">$96.20</span></div><div class="li"><span>Transport</span><span class="m">$41.00</span></div><div class="li"><span>Eating out</span><span class="m">$58.75</span></div>' +
            '<span class="bt full">Add a payment</span></div></div>' +
          '<div class="col"><div><span class="ic g3"></span><span class="h">Shared budgets</span><p class="mu">Split a budget with a partner or flatmate.</p></div><div><span class="ic g1"></span><span class="h">Private by design</span><p class="mu">Your data stays on your phone.</p></div></div>' +
        '</div>' +
        '<div class="rate"><b class="m">4.8</b><span class="mu">average rating from 12,400 reviews</span></div>' +
      '</div>',
    structure: [
      "Top navigation: app name on the left, three text links and a primary Download button on the right.",
      "A centred hero: a small accent badge, a large headline, one muted paragraph and two buttons (primary and outlined).",
      "A three-column showcase: two feature blocks on the left, a phone mockup in the centre and two feature blocks on the right. Each feature block has a small coloured icon tile, a heading and one line of muted text.",
      "The phone mockup is a tall rounded frame in the text colour containing a mini app screen: a muted label, a large amount in the monospace font, an accent badge, a small bar chart with one bar in the primary colour, three list rows with right-aligned amounts, and a full-width primary button.",
      "A centred rating line: a large number in the monospace font with a muted caption."
    ],
    layout: [
      "Single centred column, content max width about 1100px, 40px side padding.",
      "The showcase is three columns with the phone about 260px wide in the centre and feature columns vertically centred beside it."
    ],
    responsive: [
      "Below 640px the showcase becomes one column: the phone first, then the four feature blocks stacked.",
      "The headline drops to about two thirds of its size and buttons go full width."
    ]
  },
  {
    id: "shop",
    name: "E-commerce",
    blurb: "Store, catalog or product launch",
    cat: "E-commerce",
    what: "an online shop",
    html:
      '<div class="t-shop">' +
        '<div class="nav"><span class="h logo">Clay &amp; Co.</span><div class="links"><span class="hidem">Shop</span><span class="hidem">Journal</span><span class="hidem">About</span><span>Cart<span class="cart">2</span></span></div></div>' +
        '<div class="body"><div>' +
          '<span class="h ttl">Ceramics</span>' +
          '<div class="chips"><span class="on">All</span><span>Vases</span><span>Jars</span><span>Mugs</span><span>Bowls</span></div>' +
          '<div class="grid">' +
            '<div class="prod"><div class="ph g4">' + flPhoto("1631125915902-d8abe9225ff2", "Three brown clay vases", 500) + '</div><b>Terracotta trio</b><div class="rowb"><span class="m">$24.00</span><span class="pill">New</span></div></div>' +
            '<div class="prod"><div class="ph g5">' + flPhoto("1631125915973-e0d155a14e4e", "Three white ceramic jars", 500) + '</div><b>White jar set</b><span class="m">$32.00</span></div>' +
            '<div class="prod"><div class="ph g6">' + flPhoto("1572853566597-b83cde546912", "Two white ceramic vases", 500) + '</div><b>Twin vases</b><span class="m">$38.00</span></div>' +
            '<div class="prod"><div class="ph g1">' + flPhoto("1633000116322-d7f5cb7d3ebb", "White vase on a white table", 500) + '</div><b>Tall white vase</b><span class="m">$29.00</span></div>' +
            '<div class="prod"><div class="ph g2">' + flPhoto("1631125916276-69bcd14e3980", "Brown clay jars", 500) + '</div><b>Clay jars</b><div class="rowb"><span class="m">$18.00</span><span class="pill">Low stock</span></div></div>' +
            '<div class="prod"><div class="ph g3">' + flPhoto("1520408222757-6f9f95d87d5d", "White clay vases on a table", 500) + '</div><b>Studio vases</b><span class="m">$54.00</span></div>' +
          '</div></div>' +
          '<div class="card sum"><span class="h">Your order</span>' +
            '<div class="line"><span>Terracotta trio × 2</span><span class="m">$48.00</span></div>' +
            '<div class="line mu"><span>Shipping</span><span class="m">$6.50</span></div>' +
            '<div class="line tot"><span>Total</span><span class="m">$54.50</span></div>' +
            '<span class="bt">Check out</span><span class="mu sm">Free returns within 30 days</span></div>' +
        '</div>' +
      '</div>',
    structure: [
      "Top navigation: shop name on the left, three text links and a cart link with a count badge in the accent colour on the right.",
      "A category title in the heading font with a row of filter chips under it. The active chip is filled with the text colour.",
      "A three-column product grid. Each product has a square product photo, a name, a price in the monospace font and an optional accent badge such as New or Low stock.",
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
