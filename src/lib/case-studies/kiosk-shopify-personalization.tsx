import type { CaseStudy } from "./index";
import {
  Diagram,
  DiagramBox,
  DiagramArrow,
  DiagramRow,
  DiagramStep,
  DiagramCode,
  DiagramHeading,
} from "@/components/case-study/diagram";

export const kioskShopifyPersonalization: CaseStudy = {
  slug: "personalization",
  number: "03",
  title:
    "Klaviyo personalization architecture: dwell-time JS + 6-path Django logic",
  shortTitle: "Personalization Architecture",
  oneLiner:
    "Custom storefront JS pushes per-product behavioral data to Klaviyo profile properties; email Liquid reads Shopify customer tags + Recharge subscriber tag through 6-path Django conditional logic so the right cross-sell goes to the right customer.",
  lede:
    "Klaviyo emails reference a single trigger event, so a browse-abandonment email would otherwise show whatever product the visitor clicked first, not the one they actually cared about. The fix isn't in Klaviyo — it's storefront JavaScript that pushes the session's highest-dwell product as a persistent profile property, plus 6-path Django conditional logic in the email Liquid that reads Shopify customer tags + the Recharge Active Subscriber tag to send the right cross-sell.",
  pullQuote:
    "If a customer bought Product_W, they shouldn't get the \"you already own Product_X, get Product_Y\" email. The fix isn't in Klaviyo's UI — it's in the product-tag taxonomy plus Shopify Flow workflows plus Liquid conditionals. Three systems, one personalization story.",
  prelaunchNote:
    "Shipped March – April 2026 for an off-roading e-commerce client (engagement details under standard client confidentiality). Live on the production storefront.",
  whereSection: {
    tag: "The system",
    heading: "One storefront, three data sources, one personalized email",
  },
  whereItShowsUp: {
    kind: "stats",
    entries: [
      {
        value: "8s",
        label: "Dwell threshold to fire event",
        color: "accent",
      },
      {
        value: "6",
        label: "Conditional upsell paths in email Liquid",
        color: "accent2",
      },
      {
        value: "3",
        label: "Shopify Flow workflows feeding the system",
        color: "green",
      },
      {
        value: "4",
        label: "Customer-tag inputs to the conditional",
        color: "amber",
      },
    ],
  },
  whySection: {
    tag: "The engineering \"why\"",
    heading: "Six things that make this real personalization, not a tag swap",
  },
  whyTiles: [
    {
      number: 1,
      title: "Dwell over click-through",
      body: "An 8-second threshold filters bots and accidental clicks. Click-through alone would create noise — half the events would be people who tapped the wrong product. 8 seconds means the visitor actually looked at it.",
      ref: "snippet 01",
    },
    {
      number: 2,
      title: "sessionStorage selects the highest-dwell product",
      body: "Most browse-abandonment systems trigger on most-recent-product. This one tracks dwell per product across the session and picks the one the visitor spent the most total time on. That's the product they were actually evaluating.",
      ref: "snippet 01",
    },
    {
      number: 3,
      title: "_learnq.push for profile persistence",
      body: "Klaviyo events trigger flows; profile properties survive across sessions. Pushing Top_Browsed_Product/URL/Image/Price as a profile property means the email rendered an hour later still reflects the right product, not whatever fired the trigger event.",
      ref: "snippet 01",
    },
    {
      number: 4,
      title: "Dual visibilitychange + beforeunload listeners",
      body: "beforeunload alone is unreliable on mobile (iOS suspends pages without firing it). visibilitychange catches tab switches and most navigations. Together they catch every \"user left this page\" event without double-firing.",
      ref: "snippet 01",
    },
    {
      number: 5,
      title: "6-path conditional upsell logic, ordered",
      body: "Active Subscriber is checked FIRST in the if/elif chain because subscribers also carry Has_Product_X and Has_Product_Y tags. Checked later, they'd match the wrong path and get a \"buy what you already own\" email. Order matters.",
      ref: "snippet 02",
    },
    {
      number: 6,
      title: "Product-tag taxonomy verified before launch",
      body: "Product_W units were originally mis-tagged \"Product_X\" — would have falsely sent \"you already own Product_X\" emails to Product_W buyers. Caught by reading products.json via API and cross-checking the tag taxonomy before any flow went live.",
      ref: "snippet 03",
    },
  ],
  architectureSection: {
    tag: "Architecture",
    heading: "Three data sources, one Liquid template, six branches",
  },
  architectureDiagram: (
    <Diagram>
      <DiagramHeading>Storefront → Klaviyo profile</DiagramHeading>

      <DiagramBox label="theme.liquid (lines 365-401+)" tone="accent">
        <DiagramStep>
          On every product page, start a timer at page load.
        </DiagramStep>
        <DiagramStep>
          On <DiagramCode>visibilitychange</DiagramCode> /{" "}
          <DiagramCode>beforeunload</DiagramCode>: check elapsed seconds.
        </DiagramStep>
        <DiagramStep>
          If <span className="text-white font-semibold">≥ 8s</span>: fire{" "}
          <DiagramCode>Product Dwell Time</DiagramCode> Klaviyo event with
          ProductName, ProductID, URL, ImageURL, Price.
        </DiagramStep>
        <DiagramStep>
          Update <DiagramCode>sessionStorage[productID]</DiagramCode> with
          dwell time (only if higher than previous visit this session).
        </DiagramStep>
        <DiagramStep>
          Pick the session's <span className="text-white font-semibold">highest-dwell product</span>{" "}
          and push it via{" "}
          <DiagramCode>{`_learnq.push(['identify', { Top_Browsed_Product, ... }])`}</DiagramCode>
        </DiagramStep>
      </DiagramBox>

      <DiagramArrow />

      <DiagramHeading>Order → customer tags</DiagramHeading>

      <DiagramRow>
        <DiagramBox label="Shopify Flow · Order Created" tone="accent2">
          <DiagramStep>
            line item product tag contains{" "}
            <DiagramCode>&quot;Product_X&quot;</DiagramCode> →
            add customer tag <DiagramCode>Has_Product_X</DiagramCode>
          </DiagramStep>
          <DiagramStep>
            line item product tag contains{" "}
            <DiagramCode>&quot;Product_Y&quot;</DiagramCode> →
            add customer tag <DiagramCode>Has_Product_Y</DiagramCode>
          </DiagramStep>
          <DiagramStep>
            line item product tag contains{" "}
            <DiagramCode>&quot;Product_Z&quot;</DiagramCode> →
            add customer tag <DiagramCode>Has_Product_Z</DiagramCode>
          </DiagramStep>
        </DiagramBox>

        <DiagramBox label="Recharge · Subscription created" tone="green">
          <DiagramStep>
            auto-tag customer{" "}
            <DiagramCode>Active Subscriber</DiagramCode>
          </DiagramStep>
          <DiagramStep>
            (Recharge ↔ Shopify customer-tag sync verified via the
            Shopify customer profile)
          </DiagramStep>
        </DiagramBox>
      </DiagramRow>

      <DiagramArrow label="Shopify customer tags sync to Klaviyo as 'Shopify Tags' profile property" />

      <DiagramHeading>Email render → 6-path conditional</DiagramHeading>

      <DiagramBox
        label="Klaviyo flow Liquid · 6-path Django conditional"
        tone="amber"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[12px] text-[var(--text)]">
          <span>
            <span className="text-white">1. Active Subscriber</span> →
            &quot;you&apos;re already in&quot; · show what&apos;s new
          </span>
          <span>
            <span className="text-white">2. Has_Product_X + Has_Product_Y</span>{" "}
            → upsell subscription
          </span>
          <span>
            <span className="text-white">3. Has_Product_X only</span> →
            upsell Product_Y
          </span>
          <span>
            <span className="text-white">4. Has_Product_Y only</span> →
            upsell subscription (assumes Product_X from off-platform)
          </span>
          <span>
            <span className="text-white">5. Has_Product_Z only</span> →
            upsell Product_X (entry product)
          </span>
          <span>
            <span className="text-white">6. No tags</span> → full system
            intro
          </span>
        </div>
        <div className="pl-1 mt-2 text-[var(--text)]">
          ordering matters · Active Subscriber checked FIRST because
          subscribers also carry Has_Product_X + Has_Product_Y
        </div>
      </DiagramBox>

      <DiagramArrow />

      <DiagramBox label="Personalized email send" tone="green">
        Right product · right customer · right step
      </DiagramBox>
    </Diagram>
  ),
  snippetsSection: {
    tag: "The Code · how it flows",
    heading: "Three snippets, in execution order",
    intro:
      "Real excerpts from `theme.liquid` (the dwell tracker), the Klaviyo flow email template (the 6-path Django conditional), and the Shopify Flow workflow definition (the customer-tagging trigger). Reading order: see how the storefront pushes data → see how the email reads it → see how the customer-tag inputs are populated.",
  },
  snippets: [
    {
      filename: "theme.liquid · dwell-time tracking (lines 365-401+)",
      lang: "ts",
      stepLabel: "Step 1 · Storefront",
      stepHeading: "Track dwell, pick the session's highest-engagement product, push to Klaviyo",
      stepBlurb:
        "Runs on every product page. Starts a timer at load, checks elapsed time on visibilitychange or beforeunload, fires a Klaviyo event after 8s, updates sessionStorage per product, and pushes the session's highest-dwell product as a persistent profile property via _learnq.push(['identify']). The image URL is prepended with 'https:' because Shopify's image_url filter returns protocol-relative // URLs that email clients can't resolve.",
      code: `// theme.liquid — runs on every product page (Liquid renders the {{ product.* }}
// values into the JS at server-side; the JS then runs in the customer's browser)
<script>
(function () {
  var product = {
    id:    {{ product.id }},
    name:  {{ product.title | json }},
    url:   {{ shop.url | append: product.url | json }},
    image: 'https:' + {{ product.featured_image | image_url: width: 600 | json }},
    price: {{ product.price | money_without_currency | json }}
  };

  var startedAt = Date.now();
  var fired = false;

  function elapsedSeconds() {
    return Math.round((Date.now() - startedAt) / 1000);
  }

  function recordDwell() {
    if (fired) return;
    var seconds = elapsedSeconds();
    if (seconds < 8) return;          // filters bots + accidental clicks
    fired = true;

    // 1. Fire the Klaviyo event for trigger purposes
    if (window._learnq) {
      window._learnq.push(['track', 'Product Dwell Time', {
        ProductName:        product.name,
        ProductID:          product.id,
        URL:                product.url,
        ImageURL:           product.image,
        Price:              product.price,
        Time_Spent_Seconds: seconds
      }]);
    }

    // 2. Track per-product highest dwell in this session
    var key = 'dwell_' + product.id;
    var prev = parseInt(sessionStorage.getItem(key) || '0', 10);
    if (seconds > prev) sessionStorage.setItem(key, String(seconds));

    // 3. Find the session's highest-dwell product across all visited products
    var top = { id: null, seconds: 0, name: null, url: null, image: null, price: null };
    for (var i = 0; i < sessionStorage.length; i++) {
      var k = sessionStorage.key(i);
      if (!k || k.indexOf('dwell_') !== 0) continue;
      var s = parseInt(sessionStorage.getItem(k) || '0', 10);
      if (s > top.seconds) {
        top.seconds = s;
        top.id = k.replace('dwell_', '');
      }
    }

    // For the current product (the only one we know full details for from this load),
    // mirror its data into the top-browsed shape if it won the session.
    if (String(product.id) === top.id) {
      top.name  = product.name;
      top.url   = product.url;
      top.image = product.image;
      top.price = product.price;
    }

    // 4. Push the session winner as PERSISTENT profile properties.
    // Profile properties survive across sessions; events do not.
    // By the time the 1-hour Browse Abandonment wait expires, the profile
    // reflects the most-engaged product, not whatever fired the trigger.
    if (window._learnq && top.name) {
      window._learnq.push(['identify', {
        Top_Browsed_Product: top.name,
        Top_Browsed_URL:     top.url,
        Top_Browsed_Image:   top.image,
        Top_Browsed_Price:   top.price
      }]);
    }
  }

  // Dual listeners: visibilitychange catches tab switches and most navigations
  // on mobile + desktop; beforeunload is the desktop backup for hard window
  // closes. Together they catch every "user left this page" event without
  // double-firing (the 'fired' guard handles the overlap).
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') recordDwell();
  });
  window.addEventListener('beforeunload', recordDwell);
})();
</script>`,
    },
    {
      filename: "Klaviyo flow email · 6-path Django conditional",
      lang: "ts",
      stepLabel: "Step 2 · Email render",
      stepHeading: "Read the customer's tags, branch to the right cross-sell",
      stepBlurb:
        "The Welcome + Upsell template (used in two flows) reads two pieces of profile data: the Top_Browsed_* properties pushed by the storefront JS, and the Shopify customer tags synced via Klaviyo's Shopify integration. The 6 paths each send a different cross-sell. If/elif order is load-bearing — Active Subscribers also carry Has_Product_X + Has_Product_Y tags, so they MUST be matched first or they'd land in path 2.",
      code: `{# Klaviyo flow email · Welcome + Upsell template
   Reads:
     - person|lookup:'Shopify Tags'  (synced from Shopify customer tags)
     - person|lookup:'Top_Browsed_Product'  (pushed by storefront JS)
   Order matters: Active Subscriber checked FIRST because subscribers
   also carry Has_Product_X + Has_Product_Y tags. #}

{% assign tags = person|lookup:'Shopify Tags'|default:'' %}
{% assign top_product = person|lookup:'Top_Browsed_Product'|default:event.Name %}
{% assign top_url     = person|lookup:'Top_Browsed_URL'|default:event.URL %}

{% if tags contains 'Active Subscriber' %}
  {# Path 1 — Active Subscriber. They have everything. Don't sell what they have. #}
  <h1>You're already in.</h1>
  <p>Here's what's dropping next month for subscribers.</p>
  <a href="/collections/upcoming">Browse the latest →</a>

{% elif tags contains 'Has_Product_X' and tags contains 'Has_Product_Y' %}
  {# Path 2 — Full system minus subscription. Only upsell left is subscription. #}
  <h1>You've got Product_X. You've got Product_Y. Now never run out.</h1>
  <a href="/products/subscription">Start a Subscription →</a>

{% elif tags contains 'Has_Product_X' %}
  {# Path 3 — Product_X only. Push Product_Y (don't push subscription yet — first try). #}
  <h1>Now make Product_X yours.</h1>
  <p>Pre-made designs, custom Product_Y units, or the monthly subscription drop.</p>
  <a href="/collections/product-y">Browse Product_Y →</a>

{% elif tags contains 'Has_Product_Y' %}
  {# Path 4 — Product_Y only. They MUST own Product_X (got it off-platform — at an
     event or on Amazon). Shopify just doesn't know. Push subscription, NOT
     a Product_X they already own. #}
  <h1>You already know the system. Never run out of new designs.</h1>
  <a href="/products/subscription">Start a Subscription →</a>

{% elif tags contains 'Has_Product_Z' %}
  {# Path 5 — Product_Z only, no Product_X. Product_X is the entry product. #}
  <h1>Get Product_X.</h1>
  <p>Step one before anything else.</p>
  <a href="/products/product-x">Shop Product_X →</a>

{% else %}
  {# Path 6 — No tags. Could be brand new or could own everything off-platform.
     Full system intro is the safest default. #}
  <h1>Here's how the system works.</h1>
  <p>Product_Z → Product_X → swappable Product_Y → monthly subscription drops.</p>
  <a href="/">Shop the system →</a>
{% endif %}

{# If they have a top-browsed product, surface it below the cross-sell as a
   secondary nudge. This block renders for every path. #}
{% if top_product %}
  <hr>
  <p>You were also looking at:</p>
  <a href="{{ top_url }}">{{ top_product }} →</a>
{% endif %}`,
    },
    {
      filename: "Shopify Flow · Has_Product_X customer-tagging workflow",
      lang: "ts",
      stepLabel: "Step 3 · Customer tagging",
      stepHeading: "Auto-apply Has_Product_X when Product_X ships in the order",
      stepBlurb:
        "Three Shopify Flow workflows feed the customer-tag inputs the email Liquid reads: Has_Product_X, Has_Product_Y, and Has_Product_Z (the third still pending the tag-taxonomy fix). Each fires on Order Created, walks the line items, and adds the appropriate customer tag if any line item carries the matching product tag. Shopify Flow only tags FUTURE orders — backfilling existing customers requires a one-time Customers → Segments → bulk-tag pass.",
      code: `// Shopify Flow workflow definition · "Has_Product_X customer tagging"
// Trigger:    shopify/orders/create  (fires on every Order Created event)
// Action:     Add customer tag
// Filter:     line item product tag contains "Product_X"
//
// Equivalent JSON shape (Shopify Flow stores workflows as a graph):
{
  "version": "2024-01",
  "trigger": {
    "type": "shopify/orders/create"
  },
  "steps": [
    {
      "id": "filter_has_product_x_line_item",
      "type": "condition",
      "expression":
        "order.lineItems.any(li => li.product.tags.contains('Product_X'))"
    },
    {
      "id": "add_customer_tag",
      "type": "action",
      "action": "shopify/customers/add_tags",
      "input": {
        "customerId": "{{ order.customer.id }}",
        "tags": ["Has_Product_X"]
      },
      "runIf": "filter_has_product_x_line_item == true"
    }
  ]
}

// Two more workflows mirror this shape:
//   - Has_Product_Y: filters on line item product tag "Product_Y"
//   - Has_Product_Z: filters on line item product tag "Product_Z" (pending the
//     tag-taxonomy fix; Product_Z needs its product tag added first)
//
// Anti-foot-gun note: Product_W units were originally tagged "Product_X" by mistake.
// Without catching that, anyone who bought Product_W would have been tagged
// Has_Product_X and received "you already own Product_X, get Product_Y" emails.
// Caught by reading products.json via the Shopify Admin REST API
// (v2024-01) and verifying the tag taxonomy before activating the workflow.
//
// Backfill path (Shopify Flow only tags future orders):
//   Customers → Segments → filter by products_purchased(tag: 'Product_X')
//   → bulk-tag Has_Product_X → repeat for Product_Y.`,
    },
  ],
  sourceFooter:
    "Storefront JS + Klaviyo flow Liquid + Shopify Flow workflows. Live in production for an off-roading e-commerce client.",
};
