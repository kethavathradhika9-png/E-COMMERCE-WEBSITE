import { Router, Request, Response } from 'express';
import { db } from '../store/db.js';
import { RecommendationEngine } from '../services/recommendationEngine.js';
import { DemandForecastingService } from '../services/demandForecasting.js';
import { GeminiService } from '../services/geminiService.js';

export const apiRouter = Router();

// ----------------------------------------------------
// Health Check
// ----------------------------------------------------
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), platform: 'NEXORA AI' });
});

// ----------------------------------------------------
// Categories
// ----------------------------------------------------
apiRouter.get('/categories', (req: Request, res: Response) => {
  res.json(db.getCategories());
});

// ----------------------------------------------------
// Products
// ----------------------------------------------------
apiRouter.get('/products', (req: Request, res: Response) => {
  let products = db.getProducts();
  const { category, brand, search, minPrice, maxPrice, sort, badge } = req.query;

  if (category && typeof category === 'string' && category !== 'All') {
    products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (brand && typeof brand === 'string' && brand !== 'All') {
    products = products.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  }

  if (badge && typeof badge === 'string') {
    products = products.filter(p => (p.badges || []).includes(badge) || (p as any).badge === badge);
  }

  if (minPrice) {
    const min = parseFloat(minPrice as string);
    if (!isNaN(min)) products = products.filter(p => p.price >= min);
  }

  if (maxPrice) {
    const max = parseFloat(maxPrice as string);
    if (!isNaN(max)) products = products.filter(p => p.price <= max);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    products = products.filter(p =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sort === 'price-low') {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    products.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'popularity') {
    products.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  res.json(products);
});

apiRouter.get('/products/:id', (req: Request, res: Response) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

apiRouter.post('/products', (req: Request, res: Response) => {
  try {
    const created = db.addProduct(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.put('/products/:id', (req: Request, res: Response) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(updated);
});

apiRouter.delete('/products/:id', (req: Request, res: Response) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ message: 'Product deleted successfully' });
});

// Complementary bundles & similar alternatives
apiRouter.get('/products/:id/bundle', (req: Request, res: Response) => {
  const bundle = RecommendationEngine.getComplementaryBundle(req.params.id);
  res.json(bundle);
});

apiRouter.get('/products/:id/similar', (req: Request, res: Response) => {
  const similar = RecommendationEngine.getSimilarAlternatives(req.params.id);
  res.json(similar);
});

// ----------------------------------------------------
// Reviews & AI Sentiment Summarization
// ----------------------------------------------------
apiRouter.get('/reviews', (req: Request, res: Response) => {
  const { productId } = req.query;
  const reviews = db.getReviews(productId as string | undefined);
  res.json(reviews);
});

apiRouter.post('/reviews', (req: Request, res: Response) => {
  try {
    const review = db.addReview(req.body);
    res.status(201).json(review);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.get('/reviews/summary/:productId', async (req: Request, res: Response) => {
  try {
    const summary = await GeminiService.analyzeProductReviews(req.params.productId);
    res.json(summary);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// Recommendations & Technical Comparison
// ----------------------------------------------------
apiRouter.get('/recommendations', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'usr-demo-01';
  const recs = RecommendationEngine.getPersonalizedRecommendations(userId);
  res.json(recs);
});

apiRouter.post('/compare', async (req: Request, res: Response) => {
  const { productIds } = req.body;
  if (!Array.isArray(productIds) || productIds.length < 2) {
    return res.status(400).json({ error: 'Provide at least 2 product IDs to compare' });
  }
  try {
    const comparison = await GeminiService.compareProducts(productIds);
    res.json(comparison);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// Conversational AI Shopping Assistant
// ----------------------------------------------------
apiRouter.post('/ai/chat', async (req: Request, res: Response) => {
  const { message, history, userId } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  try {
    const response = await GeminiService.chatAssistant(message, history || [], userId);
    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// Orders & Order Tracking
// ----------------------------------------------------
apiRouter.get('/orders', (req: Request, res: Response) => {
  const { userId } = req.query;
  const orders = db.getOrders(userId as string | undefined);
  res.json(orders);
});

apiRouter.get('/orders/:id', (req: Request, res: Response) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

apiRouter.post('/orders', (req: Request, res: Response) => {
  try {
    const newOrder = db.createOrder(req.body);
    res.status(201).json(newOrder);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.put('/orders/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const updated = db.updateOrderStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(updated);
});

// ----------------------------------------------------
// Demand Forecasting & Predictive Analytics
// ----------------------------------------------------
apiRouter.get('/forecast/platform/overview', (req: Request, res: Response) => {
  const overview = DemandForecastingService.getPlatformDemandOverview();
  res.json(overview);
});

apiRouter.get('/forecast/:productId', (req: Request, res: Response) => {
  const forecast = DemandForecastingService.getForecastForProduct(req.params.productId);
  if (!forecast) {
    return res.status(404).json({ error: 'Forecast not available for this product' });
  }
  res.json(forecast);
});

// ----------------------------------------------------
// User Profile, Preferences & GDPR Privacy Controls
// ----------------------------------------------------
apiRouter.get('/user/profile', (req: Request, res: Response) => {
  const user = db.getUserById('usr-demo-01');
  res.json(user);
});

apiRouter.put('/user/preferences', (req: Request, res: Response) => {
  const updatedUser = db.updateUserPreferences('usr-demo-01', req.body);
  res.json(updatedUser);
});

apiRouter.post('/user/activity', (req: Request, res: Response) => {
  const act = db.logActivity(req.body);
  res.status(201).json(act);
});

apiRouter.delete('/user/privacy', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'usr-demo-01';
  db.clearUserActivities(userId);
  res.json({ message: 'User behavioral telemetry securely cleared under GDPR / DPDP guidelines' });
});
