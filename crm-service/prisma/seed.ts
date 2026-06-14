import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting BrewBean Coffee high-volume seed generator...');

  // Clean existing data
  console.log('🧹 Cleaning existing tables...');
  await prisma.channelEvent.deleteMany({});
  await prisma.campaignRecipient.deleteMany({});
  await prisma.campaign.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.customer.deleteMany({});
  console.log('✅ Tables cleaned.');

  // Data helpers
  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
    'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen',
    'Christopher', 'Lisa', 'Daniel', 'Nancy', 'Matthew', 'Betty', 'Anthony', 'Sandra', 'Mark', 'Margaret',
    'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
    'Kenneth', 'Carol', 'Kevin', 'Amanda', 'Brian', 'Dorothy', 'George', 'Melissa', 'Timothy', 'Deborah',
    'Aravind', 'Priya', 'Rohan', 'Sneha', 'Aditya', 'Anjali', 'Vikram', 'Kavita', 'Manish', 'Divya'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
    'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
    'Swamy', 'Sharma', 'Mehta', 'Rao', 'Patel', 'Nair', 'Singh', 'Joshi', 'Kumar', 'Reddy'];
  
  const coffeeCategories = ['Espresso', 'Latte', 'Cold Brew', 'Americano', 'Mocha', 'Coffee Beans', 'Pastries'];

  // 1. Generate 5,000 Customers
  console.log('👥 Generating 5,000 Customers...');
  const customers: any[] = [];
  const vipCustomers: any[] = [];
  const cartAbandonerCustomers: any[] = [];
  const dormantCustomers: any[] = [];
  const newUserCustomers: any[] = [];
  const generalCustomers: any[] = [];

  const usedEmails = new Set<string>();
  const usedPhones = new Set<string>();

  for (let i = 0; i < 5000; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${fn} ${ln}`;
    
    let email = `${fn.toLowerCase()}.${ln.toLowerCase()}.${Math.floor(Math.random() * 100000)}@example.com`;
    while (usedEmails.has(email)) {
      email = `${fn.toLowerCase()}.${ln.toLowerCase()}.${Math.floor(Math.random() * 100000)}@example.com`;
    }
    usedEmails.add(email);

    let phone = `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    while (usedPhones.has(phone)) {
      phone = `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    }
    usedPhones.add(phone);

    // Determine segment cohort
    let segments: string[] = [];
    const rand = Math.random();
    let cohort = 'general';

    if (rand < 0.10) {
      segments = ['VIP', 'Active'];
      cohort = 'vip';
    } else if (rand < 0.25) {
      segments = ['Cart Abandoner'];
      cohort = 'cart';
    } else if (rand < 0.50) {
      segments = ['Inactive', 'Dormant'];
      cohort = 'dormant';
    } else if (rand < 0.70) {
      segments = ['New User'];
      cohort = 'new';
    } else {
      segments = ['General'];
      cohort = 'general';
    }

    const customer = {
      id: randomUUID(),
      name,
      email,
      phone,
      segments: JSON.stringify(segments),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };

    customers.push(customer);
    if (cohort === 'vip') vipCustomers.push(customer);
    else if (cohort === 'cart') cartAbandonerCustomers.push(customer);
    else if (cohort === 'dormant') dormantCustomers.push(customer);
    else if (cohort === 'new') newUserCustomers.push(customer);
    else generalCustomers.push(customer);
  }

  // Insert Customers in batches
  await chunkAndInsert(prisma.customer, 'Customer', customers);

  // 2. Generate 20,000+ Orders
  console.log('🛍️ Generating Orders...');
  const orders: any[] = [];

  // Helper to add order
  const addOrder = (customerId: string, status: string, amount: number, createdAt: Date, category: string) => {
    orders.push({
      id: randomUUID(),
      customerId,
      amount: Math.round(amount * 100) / 100,
      status,
      category,
      createdAt,
      updatedAt: new Date(),
    });
  };

  // VIP orders: 10 to 30 orders, high value
  for (const c of vipCustomers) {
    const orderCount = 10 + Math.floor(Math.random() * 21);
    for (let o = 0; o < orderCount; o++) {
      const daysAgo = Math.floor(Math.random() * 90); // VIPs are active recently
      const status = 'COMPLETED';
      const amount = 15.00 + Math.random() * 45.00;
      const category = coffeeCategories[Math.floor(Math.random() * coffeeCategories.length)];
      addOrder(c.id, status, amount, new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000), category);
    }
  }

  // Cart Abandoners: 1 to 3 completed orders, and 1 pending order in the last 1-2 days
  for (const c of cartAbandonerCustomers) {
    const orderCount = 1 + Math.floor(Math.random() * 3);
    for (let o = 0; o < orderCount; o++) {
      const daysAgo = 3 + Math.floor(Math.random() * 60);
      const status = 'COMPLETED';
      const amount = 8.00 + Math.random() * 20.00;
      const category = coffeeCategories[Math.floor(Math.random() * coffeeCategories.length)];
      addOrder(c.id, status, amount, new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000), category);
    }
    // Abandoned Cart order (Pending)
    const hoursAgo = 12 + Math.floor(Math.random() * 36);
    const amount = 10.00 + Math.random() * 30.00;
    const category = coffeeCategories[Math.floor(Math.random() * coffeeCategories.length)];
    addOrder(c.id, 'PENDING', amount, new Date(Date.now() - hoursAgo * 60 * 60 * 1000), category);
  }

  // Dormant customers: 1 to 5 completed orders, older than 90 days
  for (const c of dormantCustomers) {
    const orderCount = 1 + Math.floor(Math.random() * 5);
    for (let o = 0; o < orderCount; o++) {
      const daysAgo = 91 + Math.floor(Math.random() * 270);
      const status = 'COMPLETED';
      const amount = 6.00 + Math.random() * 18.00;
      const category = coffeeCategories[Math.floor(Math.random() * coffeeCategories.length)];
      addOrder(c.id, status, amount, new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000), category);
    }
  }

  // New User customers: exactly 1 completed order in the last 1-7 days
  for (const c of newUserCustomers) {
    const daysAgo = 1 + Math.floor(Math.random() * 7);
    const amount = 5.00 + Math.random() * 15.00;
    const category = coffeeCategories[Math.floor(Math.random() * coffeeCategories.length)];
    addOrder(c.id, 'COMPLETED', amount, new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000), category);
  }

  // General customers: 2 to 8 completed orders, distributed
  for (const c of generalCustomers) {
    const orderCount = 2 + Math.floor(Math.random() * 7);
    for (let o = 0; o < orderCount; o++) {
      const daysAgo = Math.floor(Math.random() * 180);
      const status = 'COMPLETED';
      const amount = 5.00 + Math.random() * 25.00;
      const category = coffeeCategories[Math.floor(Math.random() * coffeeCategories.length)];
      addOrder(c.id, status, amount, new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000), category);
    }
  }

  await chunkAndInsert(prisma.order, 'Order', orders);

  // 3. Generate 70 Campaigns
  console.log('📣 Generating 70 Campaigns...');
  const campaigns: any[] = [];
  const campaignSegments = ['VIP', 'Cart Abandoner', 'Dormant', 'New User', 'General'];
  const channels = ['EMAIL', 'SMS', 'WHATSAPP'];

  const campaignTemplates: Record<string, string[]> = {
    'VIP': [
      'Hey {name}, enjoy our premium BrewBean single origin Yirgacheffe batch with an exclusive 20% discount. Code: VIPCOFFEE20',
      'Hi {name}, you are valued! Receive a free artisan pastry with your next Espresso or Cold Brew order this weekend. Present this coupon code: VIPTREAT',
      'Hi {name}, our new Nitro Cold Brew keg is active. Stop by our downtown roastery for an early VIP tasting event!',
    ],
    'Cart Abandoner': [
      'Hey {name}, we saved your favorite BrewBean drink in your cart! Complete checkout now and get 10% off: {cart_url}',
      'Mornings are better with coffee, {name}. Complete your purchase of our custom house blend now: {cart_url}',
      'Hey {name}, did you forget your Latte? Check out now before our morning bean supply runs low: {cart_url}',
    ],
    'Dormant': [
      'We miss you at BrewBean Coffee, {name}! ☕️ It has been a while. Come back this week for 25% off any drink. Code: WELCOMEBACK',
      'Hi {name}, have you tried our new seasonal Maple Pecan Latte yet? Stop by today and get 15% off!',
      'Hey {name}, we would love to brew your next cup. Here is a custom voucher for a free size upgrade: UPGRADE',
    ],
    'New User': [
      'Welcome to the BrewBean family, {name}! 🎉 Take 15% off your next purchase of coffee beans or hot drinks. Code: BREWNEW',
      'Hi {name}! Check out our brew guides to make the perfect French Press or pour-over at home.',
      'Hey {name}, how was your first BrewBean cup? Rate us and get 10% off your next Latte or Americano!',
    ],
    'General': [
      'Start your morning right with a BrewBean Latte pairing. Buy any handcrafted beverage and get a fresh croissant for $1.50.',
      'Weekend vibes are here! ☀️ Restock your pantry with our signature medium roast coffee beans and get free shipping.',
      'Rainy day special! 🌧️ Warm up with our rich White Chocolate Mocha, now available at all locations.',
    ]
  };

  const campaignGoals: Record<string, string> = {
    'VIP': 'Reward loyal VIP customers with early access, discount codes, or free pastries to maximize lifetime value.',
    'Cart Abandoner': 'Remind customers of items left in checkout cart and convert them with 10% discounts.',
    'Dormant': 'Win back inactive customers who haven\'t made a purchase in 90+ days using strong incentives.',
    'New User': 'Onboard new customers, encourage repeat purchases, and gather feedback on their first experience.',
    'General': 'Drive general order volume and showcase weekly coffee bean roasts or pastry specials.'
  };

  for (let c = 0; c < 70; c++) {
    const segment = campaignSegments[c % campaignSegments.length];
    const channel = channels[c % channels.length];
    const templates = campaignTemplates[segment];
    const messageTemplate = templates[Math.floor(Math.random() * templates.length)];
    const goal = campaignGoals[segment];

    const campaignId = randomUUID();
    const createdAt = new Date(Date.now() - (5 + Math.floor(Math.random() * 85)) * 24 * 60 * 60 * 1000); // 5 to 90 days ago

    campaigns.push({
      id: campaignId,
      name: `${segment} ${channel} Campaign - Batch #${Math.floor(c / 5) + 1}`,
      goal,
      segmentDsl: JSON.stringify({
        conditions: [{ field: 'segment', operator: 'equals', value: segment }],
        logicalOperator: 'AND',
      }),
      status: 'COMPLETED',
      channel,
      messageTemplate,
      confidenceScore: 0.70 + Math.random() * 0.25,
      estimatedRoi: 1000 + Math.random() * 4000,
      createdAt,
      updatedAt: createdAt,
    });
  }

  // Insert Campaigns
  for (const campaign of campaigns) {
    await prisma.campaign.create({ data: campaign });
  }
  console.log(`✅ Seeded 70 completed campaigns.`);

  // 4. Generate ~100,000 CampaignRecipients and ~300,000 ChannelEvents
  console.log('📨 Generating Recipients and Events...');
  const recipients: any[] = [];
  const events: any[] = [];

  // Open rates probabilities
  // VIP Segment: WhatsApp = 58%, Email = 40%, SMS = 28%
  // Dormant Segment: WhatsApp = 43%, Email = 31%, SMS = 22%
  // New User Segment: WhatsApp = 37%, Email = 29%, SMS = 24%
  // General/Cart Abandoner: WhatsApp = 35%, Email = 25%, SMS = 20%
  const getRates = (segment: string, channel: string) => {
    let openRate = 0.35;
    let failedRate = 0.02;

    if (segment === 'VIP') {
      if (channel === 'WHATSAPP') openRate = 0.58;
      else if (channel === 'EMAIL') openRate = 0.40;
      else if (channel === 'SMS') openRate = 0.28;
      failedRate = channel === 'EMAIL' ? 0.03 : channel === 'SMS' ? 0.05 : 0.01;
    } else if (segment === 'Dormant') {
      if (channel === 'WHATSAPP') openRate = 0.43;
      else if (channel === 'EMAIL') openRate = 0.31;
      else if (channel === 'SMS') openRate = 0.22;
      failedRate = channel === 'EMAIL' ? 0.03 : channel === 'SMS' ? 0.05 : 0.01;
    } else if (segment === 'New User') {
      if (channel === 'WHATSAPP') openRate = 0.37;
      else if (channel === 'EMAIL') openRate = 0.29;
      else if (channel === 'SMS') openRate = 0.24;
      failedRate = channel === 'EMAIL' ? 0.03 : channel === 'SMS' ? 0.05 : 0.01;
    } else {
      if (channel === 'WHATSAPP') openRate = 0.35;
      else if (channel === 'EMAIL') openRate = 0.25;
      else if (channel === 'SMS') openRate = 0.20;
      failedRate = channel === 'EMAIL' ? 0.03 : channel === 'SMS' ? 0.05 : 0.01;
    }

    return { openRate, failedRate };
  };

  // Group customers by segment for fast lookup
  const customersBySegment: Record<string, any[]> = {
    'VIP': vipCustomers,
    'Cart Abandoner': cartAbandonerCustomers,
    'Dormant': dormantCustomers,
    'New User': newUserCustomers,
    'General': generalCustomers,
  };

  let totalRecipientsCount = 0;

  for (const camp of campaigns) {
    const dsl = JSON.parse(camp.segmentDsl);
    const segment = dsl.conditions[0].value;
    
    // Find target customers
    let targets = customersBySegment[segment] || generalCustomers;
    
    if (segment === 'General') {
      // General campaigns target random 80% sample of all customers
      targets = customers;
      const sampleSize = Math.floor(targets.length * 0.8);
      targets = targets.slice(0, sampleSize);
    }

    const { openRate, failedRate } = getRates(segment, camp.channel);

    for (const customer of targets) {
      const recipientId = randomUUID();
      const eventId = `evt-${recipientId}`;
      const campaignTime = camp.createdAt.getTime();

      const roll = Math.random();
      let status = 'SENT';
      
      const sentTime = new Date(campaignTime + Math.floor(Math.random() * 5) * 60 * 1000); // sent within 5 mins
      let deliveredTime = null;
      let readTime = null;
      let failedTime = null;
      let errorMessage = null;

      if (roll < failedRate) {
        status = 'FAILED';
        failedTime = new Date(sentTime.getTime() + 10 * 1000);
        errorMessage = camp.channel === 'EMAIL' ? 'Bounce: Address not found' : 'Provider routing error';
      } else if (roll < failedRate + openRate) {
        status = 'READ';
        deliveredTime = new Date(sentTime.getTime() + (10 + Math.floor(Math.random() * 50)) * 1000); // delivered in 10-60s
        readTime = new Date(deliveredTime.getTime() + (30 + Math.floor(Math.random() * 120)) * 60 * 1000); // read in 30-150 mins
      } else {
        status = 'DELIVERED';
        deliveredTime = new Date(sentTime.getTime() + (10 + Math.floor(Math.random() * 50)) * 1000); // delivered in 10-60s
      }

      recipients.push({
        id: recipientId,
        campaignId: camp.id,
        customerId: customer.id,
        status,
        sentAt: sentTime,
        deliveredAt: deliveredTime,
        readAt: readTime,
        failedAt: failedTime,
        errorMessage,
        eventId: status !== 'FAILED' ? eventId : null,
        createdAt: sentTime,
        updatedAt: readTime || deliveredTime || failedTime || sentTime,
      });

      // Events
      // SENT event
      events.push({
        id: randomUUID(),
        recipientId,
        eventId: `${eventId}-s`,
        eventType: 'SENT',
        timestamp: sentTime,
        payload: JSON.stringify({ provider: 'provider_gateway', status: 'sent', segment }),
      });

      if (status === 'DELIVERED' || status === 'READ') {
        events.push({
          id: randomUUID(),
          recipientId,
          eventId: `${eventId}-d`,
          eventType: 'DELIVERED',
          timestamp: deliveredTime,
          payload: JSON.stringify({ provider: 'provider_gateway', status: 'delivered', segment }),
        });
      }

      if (status === 'READ') {
        events.push({
          id: randomUUID(),
          recipientId,
          eventId: `${eventId}-r`,
          eventType: 'READ',
          timestamp: readTime,
          payload: JSON.stringify({ provider: 'provider_gateway', status: 'read', segment }),
        });

        // Click event simulation (e.g. 35% click rate of opened ones)
        if (Math.random() < 0.35 && readTime) {
          const clickTime = new Date(readTime.getTime() + (5 + Math.floor(Math.random() * 30)) * 60 * 1000); // clicked 5-35 mins later
          events.push({
            id: randomUUID(),
            recipientId,
            eventId: `${eventId}-c`,
            eventType: 'CLICKED',
            timestamp: clickTime,
            payload: JSON.stringify({ provider: 'user_agent', status: 'clicked', segment }),
          });
        }
      }

      if (status === 'FAILED') {
        events.push({
          id: randomUUID(),
          recipientId,
          eventId: `${eventId}-f`,
          eventType: 'FAILED',
          timestamp: failedTime,
          payload: JSON.stringify({ provider: 'provider_gateway', status: 'failed', error: errorMessage }),
        });
      }

      totalRecipientsCount++;
    }
  }

  console.log(`Generated in memory: ${recipients.length} Recipients and ${events.length} Events.`);

  // Insert Recipients in chunks
  console.log('💾 Writing CampaignRecipients to Database...');
  await chunkAndInsert(prisma.campaignRecipient, 'CampaignRecipient', recipients);

  // Insert Events in chunks
  console.log('💾 Writing ChannelEvents to Database...');
  await chunkAndInsert(prisma.channelEvent, 'ChannelEvent', events);

  console.log('✨ Database successfully seeded with 100% complete BrewBean Coffee Dataset!');
}

async function chunkAndInsert(model: any, modelName: string, data: any[], batchSize = 3000) {
  for (let i = 0; i < data.length; i += batchSize) {
    const chunk = data.slice(i, i + batchSize);
    await model.createMany({ data: chunk });
    if (i % 15000 === 0 && i > 0) {
      console.log(`   Written ${i} records...`);
    }
  }
  console.log(`✅ Successfully seeded ${data.length} records for ${modelName}.`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
