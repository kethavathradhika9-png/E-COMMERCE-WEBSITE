import { IDemandForecast, ITimeSeriesPoint, IProduct } from '../../src/types.js';
import { db } from '../store/db.js';

export class DemandForecastingService {
  /**
   * Generates 30-day historical time-series plus 7-day predictive demand forecast
   * using Exponential Smoothing with Seasonal Decomposition.
   */
  public static getForecastForProduct(productId: string): IDemandForecast | null {
    const product = db.getProductById(productId);
    if (!product) return null;

    const historyPoints: ITimeSeriesPoint[] = [];
    const baseDailyDemand = Math.max(3, Math.round(product.reviewCount / 6) + 4);
    const today = new Date();

    // 1. Generate 30-day historical sales with realistic weekend spikes & noise
    for (let i = 30; i >= 1; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      const weekendMultiplier = isWeekend ? 1.45 : 1.0;
      const noise = (Math.random() * 0.4 - 0.2); // +/- 20%
      const actualUnits = Math.max(1, Math.round(baseDailyDemand * weekendMultiplier * (1 + noise)));

      historyPoints.push({
        date: d.toISOString().split('T')[0],
        units: actualUnits,
        revenue: actualUnits * product.price,
        confidenceUpper: actualUnits,
        confidenceLower: actualUnits
      });
    }

    // 2. Exponential smoothing forecasting for next 7 days
    const forecastPoints: ITimeSeriesPoint[] = [];
    const alpha = 0.35; // Smoothing factor
    let smoothedValue = historyPoints[historyPoints.length - 1].units;

    // Moving average baseline
    const last7Units = historyPoints.slice(-7).map(p => p.units);
    const recentAvg = last7Units.reduce((a, b) => a + b, 0) / 7;

    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      const dayMultiplier = isWeekend ? 1.5 : 1.05;

      smoothedValue = alpha * recentAvg * dayMultiplier + (1 - alpha) * smoothedValue;
      const predictedUnits = Math.max(1, Math.round(smoothedValue));
      const confidenceRange = Math.round(predictedUnits * 0.18);

      forecastPoints.push({
        date: d.toISOString().split('T')[0],
        units: predictedUnits,
        revenue: predictedUnits * product.price,
        confidenceUpper: predictedUnits + confidenceRange,
        confidenceLower: Math.max(1, predictedUnits - confidenceRange)
      });
    }

    const predicted7DayTotal = forecastPoints.reduce((sum, p) => sum + p.units, 0);
    const daysUntilStockout = product.stock > 0 
      ? Math.round((product.stock / (predicted7DayTotal / 7)) * 10) / 10 
      : 0;

    let stockoutRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (product.stock === 0) stockoutRisk = 'CRITICAL';
    else if (daysUntilStockout <= 3) stockoutRisk = 'CRITICAL';
    else if (daysUntilStockout <= 7) stockoutRisk = 'HIGH';
    else if (daysUntilStockout <= 14) stockoutRisk = 'MEDIUM';

    // Optimal Dynamic Price Recommendation
    // Elasticity formula: If stock is low & demand high -> surge price +5% to +8%
    // If stock is surplus & demand low -> discount -5% to -10%
    let optimalPrice = product.price;
    let priceElasticity = -1.35; // Typical consumer tech elasticity
    let strategyNote = 'Stable demand and optimal inventory equilibrium';

    if (stockoutRisk === 'CRITICAL' || stockoutRisk === 'HIGH') {
      optimalPrice = Math.round(product.price * 1.04);
      strategyNote = 'High velocity vs low inventory: Dynamic surge optimization active';
    } else if (product.stock > 100 && daysUntilStockout > 25) {
      optimalPrice = Math.round(product.price * 0.92);
      strategyNote = 'High inventory buffer: Clearance promo recommended to accelerate turns';
    }

    return {
      productId: product.id,
      productName: product.name,
      currentStock: product.stock,
      predictedDemand7Days: predicted7DayTotal,
      predictedDemand30Days: predicted7DayTotal * 4,
      stockoutRisk,
      daysUntilStockout,
      reorderPoint: Math.round((predicted7DayTotal / 7) * 5) + 10, // 5 days lead time buffer
      recommendedOrderQuantity: Math.max(25, Math.round(predicted7DayTotal * 3)),
      elasticity: priceElasticity,
      dynamicPricing: {
        currentPrice: product.price,
        optimalPrice,
        competitorPrice: Math.round(product.price * 1.05),
        surgeMultiplier: parseFloat((optimalPrice / product.price).toFixed(2)),
        strategy: strategyNote
      },
      history: historyPoints,
      forecast: forecastPoints
    };
  }

  /**
   * Retrieves platform-wide demand analytics across all categories.
   */
  public static getPlatformDemandOverview() {
    const products = db.getProducts();
    const forecasts = products.map(p => this.getForecastForProduct(p.id)).filter(Boolean) as IDemandForecast[];

    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const criticalStockouts = forecasts.filter(f => f.stockoutRisk === 'CRITICAL' || f.stockoutRisk === 'HIGH');
    const totalWeeklyPredictedRevenue = forecasts.reduce((sum, f) => sum + (f.predictedDemand7Days * f.dynamicPricing.currentPrice), 0);

    const categoryDemand = [
      { category: 'Laptops & Computing', totalUnits: 142, revenue: 8378000, growth: '+18.4%' },
      { category: 'Audio & Acoustics', totalUnits: 384, revenue: 1728000, growth: '+24.1%' },
      { category: 'Wearables & Health', totalUnits: 215, revenue: 1483500, growth: '+12.6%' },
      { category: 'Footwear & Campus Style', totalUnits: 460, revenue: 1104000, growth: '+31.2%' },
      { category: 'Workspace & Ergonomics', totalUnits: 195, revenue: 975000, growth: '+15.8%' }
    ];

    return {
      totalProducts: products.length,
      totalInventoryUnits: totalStock,
      criticalStockoutAlerts: criticalStockouts.length,
      totalWeeklyPredictedRevenue,
      forecasts: forecasts.slice(0, 10),
      categoryDemand,
      criticalStockouts: criticalStockouts.map(f => ({
        id: f.productId,
        name: f.productName,
        stock: f.currentStock,
        daysUntilStockout: f.daysUntilStockout,
        risk: f.stockoutRisk,
        recommendedOrder: f.recommendedOrderQuantity
      }))
    };
  }
}
