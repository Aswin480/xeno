import axios from 'axios';

const API_BASE = 'http://localhost:8000';

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runSimulation() {
  console.log('🚀 STARTING PURE HTTP CLOSED-LOOP SIMULATION');

  // 1. Find a target spend threshold dynamically using GET /customers
  console.log('Step 1: Finding target customer segment size dynamically via API...');
  const customersRes = await axios.get(`${API_BASE}/customers`);
  const customers = customersRes.data.data;

  // Sort customers by totalSpend descending
  customers.sort((a: any, b: any) => b.totalSpend - a.totalSpend);

  // Pick a cohort size of 20 customers
  const targetCohortSize = 20;
  const targetCohort = customers.slice(0, targetCohortSize);
  const minSpend = targetCohort[targetCohortSize - 1]?.totalSpend || 500;
  
  // Set spend threshold slightly below the 20th customer's spend
  const spendThreshold = Math.floor(minSpend - 1);
  console.log(`🎯 Dynamically selected spend threshold: > $${spendThreshold} (Targets exactly ${targetCohort.length} customers)`);

  // 2. Create a staged campaign via POST /campaigns
  console.log('\nStep 2: Staging dormant customer reactivation campaign...');
  const campaignData = {
    name: 'BrewBean Dormant Customers Reactivation (Simulated)',
    goal: 'Bring back dormant coffee buyers with WhatsApp and 20% OFF.',
    channel: 'WHATSAPP',
    segmentDsl: JSON.stringify({
      conditions: [{ field: 'total_spend', operator: 'gt', value: spendThreshold }],
      logicalOperator: 'AND'
    }),
    messageTemplate: 'Hi {name}, we miss you at BrewBean! Use code WELCOMEBACK20 for 20% off your next Latte or Cold Brew.',
    confidenceScore: 0.95,
    estimatedRoi: 2.1
  };

  const createRes = await axios.post(`${API_BASE}/campaigns`, campaignData);
  const campaign = createRes.data.data;
  console.log(`✅ Campaign staged: ID = ${campaign.id}, Name = "${campaign.name}"`);

  // 3. Launch the campaign to trigger async delivery
  console.log('\nStep 3: Launching the campaign...');
  const launchRes = await axios.post(`${API_BASE}/campaigns/${campaign.id}/launch`);
  console.log(`✅ Launch initiated. Targeted recipients: ${launchRes.data.recipientsCount}`);

  // 4. Monitor live activity
  console.log('\nStep 4: Monitoring live status events and simulated conversions...');
  
  let attempts = 0;
  let finished = false;
  
  while (attempts < 15 && !finished) {
    await delay(2000);
    attempts++;

    // Fetch campaign details to check delivery rates and metrics
    const statsRes = await axios.get(`${API_BASE}/campaigns/${campaign.id}`);
    const currentCampaign = statsRes.data.data;
    const metrics = currentCampaign.metrics || { total: 0, sent: 0, delivered: 0, read: 0, failed: 0, revenueRecovered: 0 };
    
    const completedCount = metrics.delivered + metrics.failed;
    
    console.log(
      `[T+${attempts * 2}s] Status: ${currentCampaign.status} | ` +
      `Progress: ${completedCount}/${metrics.total} | ` +
      `Sent: ${metrics.sent} | Delivered: ${metrics.delivered} | Read: ${metrics.read} | Failed: ${metrics.failed} | ` +
      `Attributed Revenue: $${metrics.revenueRecovered}`
    );

    if (currentCampaign.status === 'COMPLETED' && completedCount >= metrics.total && metrics.total > 0) {
      console.log('✅ All message events processed.');
      finished = true;
    }
  }

  // 5. Query XENO Decision Engine for next-action recommendations
  console.log('\nStep 5: Querying XENO Decision Engine for recommendations...');
  await delay(1000);
  const recommendationRes = await axios.get(`${API_BASE}/copilot/observe/${campaign.id}`);
  const nextAction = recommendationRes.data.data;

  console.log('\n==================================================');
  console.log('🧠 XENO DECISION ENGINE CONCLUSION');
  console.log('==================================================');
  console.log(`Action:         ${nextAction.action.toUpperCase()}`);
  console.log(`Confidence:     ${nextAction.confidence.toUpperCase()}`);
  console.log(`Reasoning:      ${nextAction.reason}`);
  console.log(`Recommendation: ${nextAction.recommendation}`);
  console.log('==================================================');

  console.log('\n🎉 Closed-loop test simulation completed successfully!');
}

runSimulation().catch(err => {
  console.error('❌ Simulation failed with error:', err.message);
  if (err.response) {
    console.error('Response data:', err.response.data);
  }
});
