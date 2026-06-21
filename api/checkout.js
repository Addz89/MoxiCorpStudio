// SECURE: This automatically pulls your hidden key from Vercel's Environment Variables
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  try {
    const { basePackage, addons, customerName, customerEmail } = req.body;

    let totalCost = basePackage.price;
    let descriptionString = `Base: ${basePackage.name}\nEnhancements: `;
    
    // Add up the optional enhancements
    for (const [name, price] of Object.entries(addons)) {
      totalCost += price;
      descriptionString += `${name}, `;
    }

    // Tell Stripe to generate a dynamic checkout page
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail, // Auto-fills their email on the Stripe page
      line_items: [{
        price_data: {
          currency: 'aud',
          product_data: {
            name: `Moxi Corp Custom Build: ${basePackage.name}`,
            description: descriptionString,
          },
          unit_amount: totalCost * 100, // Stripe calculates in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      // Sends them back to your site after payment
      success_url: `https://${req.headers.host}/?success=true`,
      cancel_url: `https://${req.headers.host}/?canceled=true`,
    });

    // Send the link back to your index.html
    res.status(200).json({ url: session.url });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating checkout session' });
  }
}