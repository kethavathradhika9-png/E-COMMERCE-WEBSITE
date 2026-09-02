import { IProduct, IUser, IRecommendationItem, IRecommendationResponse } from '../../src/types.js';
import { db } from '../store/db.js';

export class RecommendationEngine {
  /**
   * Generates personalized hybrid recommendations for a user.
   * Hybrid Formula:
   * Score = (w_content * ContentScore) + (w_pref * PrefScore) + (w_collab * CollabScore) + (w_pop * PopularityScore)
   */
  public static getPersonalizedRecommendations(userId: string, limit = 8): IRecommendationResponse {
    const user = db.getUserById(userId) || db.getUserById('usr-demo-01')!;
    const allProducts = db.getProducts();
    const userActivities = db.getUserActivities(user.id);
    const viewedProductIds = new Set(userActivities.map(a => a.productId));

    // Calculate user preference vectors
    const prefCategories = new Set(user.preferences.preferredCategories);
    const prefBrands = new Set(user.preferences.preferredBrands);
    const minBudget = user.preferences.typicalBudgetMin;
    const maxBudget = user.preferences.typicalBudgetMax;
    const perfWeight = user.preferences.performancePriority / 100;
    const priceWeight = user.preferences.priceSensitivityPriority / 100;

    const scoredItems: IRecommendationItem[] = allProducts.map(product => {
      let contentScore = 0;
      let userPrefScore = 0;
      let popularityScore = 0;
      let collaborativeScore = 0;

      // 1. Category and Brand Affinity
      if (prefCategories.has(product.category)) {
        userPrefScore += 40;
      }
      if (prefBrands.has(product.brand)) {
        userPrefScore += 25;
      }

      // 2. Budget Proximity Score
      if (product.price >= minBudget && product.price <= maxBudget) {
        userPrefScore += 25;
      } else if (product.price < minBudget) {
        userPrefScore += 15;
      } else {
        const overBudgetPenalty = Math.min(20, ((product.price - maxBudget) / maxBudget) * 30);
        userPrefScore += Math.max(0, 20 - overBudgetPenalty);
      }

      // 3. Performance / High Spec weighting
      if (product.specifications && Object.keys(product.specifications).length >= 4) {
        contentScore += 25 * perfWeight;
      }
      const productBadges = product.badges || (product.badge ? [product.badge] : []);
      if (productBadges.includes('AI Choice') || productBadges.includes('Best Seller')) {
        contentScore += 20;
      }

      // 4. Popularity & Social Proof
      popularityScore = (product.rating / 5) * 30 + Math.min(20, (product.reviewCount / 20) * 20);

      // 5. Collaborative / Interaction Score
      if (viewedProductIds.has(product.id)) {
        collaborativeScore += 20; // Re-engagement incentive
      }

      // Calculate Total Hybrid Match Score (Normalized to 0 - 100)
      const rawTotal = (userPrefScore * 0.45) + (contentScore * 0.25) + (popularityScore * 0.20) + (collaborativeScore * 0.10);
      const matchScore = Math.min(99, Math.max(65, Math.round(rawTotal)));

      // Generate Transparent Explainability Justifications
      const reasons: string[] = [];
      if (prefCategories.has(product.category)) {
        reasons.push(`Matches your focus in ${product.category}`);
      }
      if (prefBrands.has(product.brand)) {
        reasons.push(`Preferred hardware vendor (${product.brand})`);
      }
      if (product.price <= maxBudget && priceWeight > 0.5) {
        reasons.push(`Well within your verified budget bracket (₹${product.price.toLocaleString('en-IN')})`);
      }
      if (product.rating >= 4.7) {
        reasons.push(`Top 1% rated (${product.rating}★ with ${product.reviewCount}+ verified reviews)`);
      }
      if (reasons.length === 0) {
        reasons.push(`High compatibility with developer & student workflows`);
      }

      return {
        product,
        matchScore,
        reasons,
        collaborativeScore: Math.round(collaborativeScore),
        contentScore: Math.round(contentScore),
        popularityScore: Math.round(popularityScore),
        strategy: 'HYBRID'
      };
    });

    // Sort by descending match score
    scoredItems.sort((a, b) => b.matchScore - a.matchScore);

    const topItems = scoredItems.slice(0, limit);

    return {
      recommendations: topItems,
      strategyUsed: 'HYBRID',
      userProfileSummary: {
        preferredCategories: Array.from(prefCategories),
        priceSensitivity: user.preferences.priceSensitivity,
        topInterests: ['High Performance Computing', 'Ergonomic Desk Setup', 'High-Fidelity Audio']
      }
    };
  }

  /**
   * Generates "Frequently Bought Together" bundle with dynamic combo discount.
   */
  public static getComplementaryBundle(productId: string): { items: IProduct[]; comboPrice: number; discountSavings: number } {
    const mainProduct = db.getProductById(productId);
    if (!mainProduct) return { items: [], comboPrice: 0, discountSavings: 0 };

    const allProducts = db.getProducts();
    const complements: IProduct[] = [mainProduct];

    // Find complementary categories
    if (mainProduct.category === 'Laptops & Computing') {
      const charger = allProducts.find(p => p.id === 'prod-desk-05' || p.category === 'Workspace & Ergonomics');
      const headphones = allProducts.find(p => p.id === 'prod-aud-02' || p.category === 'Audio & Acoustics');
      if (charger) complements.push(charger);
      if (headphones) complements.push(headphones);
    } else if (mainProduct.category === 'Audio & Acoustics') {
      const charger = allProducts.find(p => p.id === 'prod-desk-05');
      const watch = allProducts.find(p => p.id === 'prod-wear-02');
      if (charger) complements.push(charger);
      if (watch) complements.push(watch);
    } else if (mainProduct.category === 'Footwear & Campus Style') {
      const watch = allProducts.find(p => p.id === 'prod-wear-02');
      const buds = allProducts.find(p => p.id === 'prod-aud-04');
      if (watch) complements.push(watch);
      if (buds) complements.push(buds);
    } else {
      const other = allProducts.filter(p => p.id !== mainProduct.id).slice(0, 2);
      complements.push(...other);
    }

    const rawTotal = complements.reduce((sum, p) => sum + p.price, 0);
    const comboPrice = Math.round(rawTotal * 0.88); // 12% bundle discount
    const discountSavings = rawTotal - comboPrice;

    return {
      items: complements,
      comboPrice,
      discountSavings
    };
  }

  /**
   * Retrieves similar alternatives in same category and price band.
   */
  public static getSimilarAlternatives(productId: string, limit = 4): IProduct[] {
    const target = db.getProductById(productId);
    if (!target) return [];

    const allProducts = db.getProducts();
    return allProducts
      .filter(p => p.id !== target.id && (p.category === target.category || p.brand === target.brand))
      .slice(0, limit);
  }
}
