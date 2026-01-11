// Mock Agent Service - Simulates AI Agent behavior
// This will be replaced with Azure AI Foundry agent when available

import { generateId } from '@youbiquti/core';
import {
  mockYelpService,
  mockEventsService,
} from '@youbiquti/gno-tools';
// These services will be used in future iterations for trust-weighted results:
// import { socialGraphService, preferenceService, matchingService } from '@youbiquti/service-graph';
import type {
  AgentState,
  ChatMessage,
  ChatSession,
  GatheredPreferences,
  NightPlan,
  PlanItem,
  SendMessageResponse,
} from '../types/index.js';

/**
 * Patterns to detect user intent
 */
const INTENT_PATTERNS = {
  greeting: /^(hi|hello|hey|howdy|greetings)/i,
  partySize: /(\d+)\s*(people|friends|girls|of us|guests)/i,
  date: /(tonight|tomorrow|this weekend|saturday|friday|sunday|\d{1,2}\/\d{1,2})/i,
  time: /(early|around \d|at \d|late|evening|night)/i,
  neighborhood: /(uptown|deep ellum|bishop arts|downtown|lower greenville|knox|design district)/i,
  activity: /(dinner|drinks|bar|restaurant|dancing|club|event|show|comedy|concert)/i,
  budget: /(cheap|affordable|budget|mid|moderate|fancy|upscale|expensive|splurge)/i,
  vibes: /(chill|lively|romantic|fun|trendy|casual|classy|intimate)/i,
  dietary: /(vegetarian|vegan|gluten.?free|kosher|halal|allergies)/i,
  yes: /^(yes|yeah|yep|sure|sounds good|perfect|let's do it|ok|okay)/i,
  no: /^(no|nah|nope|not really|different|change)/i,
  refine: /(different|other|change|another|more|less|cheaper|fancier)/i,
};

/**
 * Mock Agent Service
 * Implements a state-machine based conversation flow
 */
export class MockAgentService {
  /**
   * Process a user message and generate a response
   */
  async processMessage(
    session: ChatSession,
    userMessage: string
  ): Promise<SendMessageResponse> {
    // Detect intents from user message
    const intents = this.detectIntents(userMessage);
    
    // Update gathered preferences based on detected intents
    this.updatePreferences(session.gatheredPreferences, userMessage, intents);
    
    // Determine next state and generate response based on current state
    const { nextState, responseContent, plan } = await this.generateResponse(
      session,
      userMessage,
      intents
    );
    
    // Create response message
    const responseMessage: ChatMessage = {
      id: generateId('msg'),
      role: 'assistant',
      content: responseContent,
      timestamp: new Date().toISOString(),
    };
    
    return {
      message: responseMessage,
      state: nextState,
      plan: plan ?? session.currentPlan,
    };
  }

  /**
   * Detect intents from user message
   */
  private detectIntents(message: string): Set<string> {
    const intents = new Set<string>();
    
    for (const [intent, pattern] of Object.entries(INTENT_PATTERNS)) {
      if (pattern.test(message)) {
        intents.add(intent);
      }
    }
    
    return intents;
  }

  /**
   * Update preferences based on user message
   */
  private updatePreferences(
    prefs: GatheredPreferences,
    message: string,
    intents: Set<string>
  ): void {
    // Extract party size
    if (intents.has('partySize')) {
      const match = message.match(/(\d+)\s*(people|friends|girls|of us|guests)/i);
      if (match?.[1]) {
        prefs.partySize = parseInt(match[1], 10);
      }
    }
    
    // Extract date
    if (intents.has('date')) {
      if (/tonight/i.test(message)) {
        prefs.date = new Date().toISOString().split('T')[0];
      } else if (/tomorrow/i.test(message)) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        prefs.date = tomorrow.toISOString().split('T')[0];
      } else if (/saturday/i.test(message)) {
        prefs.date = this.getNextDayOfWeek(6);
      } else if (/friday/i.test(message)) {
        prefs.date = this.getNextDayOfWeek(5);
      }
    }
    
    // Extract time preference
    if (intents.has('time')) {
      if (/early/i.test(message)) {
        prefs.timePreference = 'early';
      } else if (/late/i.test(message)) {
        prefs.timePreference = 'late';
      } else {
        prefs.timePreference = 'standard';
      }
    }
    
    // Extract neighborhood
    if (intents.has('neighborhood')) {
      const neighborhoods = ['uptown', 'deep ellum', 'bishop arts', 'downtown', 'lower greenville', 'knox', 'design district'];
      for (const n of neighborhoods) {
        if (message.toLowerCase().includes(n)) {
          prefs.neighborhood = n;
          break;
        }
      }
    }
    
    // Extract activities
    if (intents.has('activity')) {
      prefs.activities = prefs.activities ?? [];
      if (/dinner|restaurant/i.test(message)) prefs.activities.push('dinner');
      if (/drinks|bar/i.test(message)) prefs.activities.push('drinks');
      if (/event|show|comedy|concert/i.test(message)) prefs.activities.push('event');
      if (/dancing|club/i.test(message)) prefs.activities.push('dancing');
      // Dedupe
      prefs.activities = [...new Set(prefs.activities)];
    }
    
    // Extract budget
    if (intents.has('budget')) {
      if (/cheap|affordable|budget/i.test(message)) {
        prefs.budget = 'low';
      } else if (/fancy|upscale|expensive|splurge/i.test(message)) {
        prefs.budget = 'high';
      } else {
        prefs.budget = 'medium';
      }
    }
    
    // Extract vibes
    if (intents.has('vibes')) {
      prefs.vibes = prefs.vibes ?? [];
      const vibeWords = ['chill', 'lively', 'romantic', 'fun', 'trendy', 'casual', 'classy', 'intimate'];
      for (const v of vibeWords) {
        if (message.toLowerCase().includes(v)) {
          prefs.vibes.push(v);
        }
      }
      prefs.vibes = [...new Set(prefs.vibes)];
    }
    
    // Extract dietary
    if (intents.has('dietary')) {
      prefs.dietaryRestrictions = prefs.dietaryRestrictions ?? [];
      if (/vegetarian/i.test(message)) prefs.dietaryRestrictions.push('vegetarian');
      if (/vegan/i.test(message)) prefs.dietaryRestrictions.push('vegan');
      if (/gluten.?free/i.test(message)) prefs.dietaryRestrictions.push('gluten-free');
      prefs.dietaryRestrictions = [...new Set(prefs.dietaryRestrictions)];
    }
  }

  /**
   * Get date string for next occurrence of a day of week
   */
  private getNextDayOfWeek(dayOfWeek: number): string {
    const today = new Date();
    const currentDay = today.getDay();
    const daysUntil = (dayOfWeek - currentDay + 7) % 7 || 7;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntil);
    return nextDate.toISOString().split('T')[0]!;
  }

  /**
   * Generate response based on current state
   */
  private async generateResponse(
    session: ChatSession,
    userMessage: string,
    intents: Set<string>
  ): Promise<{
    nextState: AgentState;
    responseContent: string;
    plan?: NightPlan;
  }> {
    const { state, gatheredPreferences: prefs } = session;
    
    switch (state) {
      case 'greeting':
        return this.handleGreeting(prefs, intents);
      
      case 'gathering':
        return this.handleGathering(prefs, intents);
      
      case 'searching':
        return await this.handleSearching(session, prefs);
      
      case 'presenting':
        return this.handlePresenting(session, userMessage, intents);
      
      case 'refining':
        return await this.handleRefining(session, prefs, userMessage);
      
      case 'confirming':
        return this.handleConfirming(session, intents);
      
      case 'complete':
        return {
          nextState: 'complete',
          responseContent: "Your night is all set! Have an amazing time! 🎉 Let me know if you need anything else.",
        };
      
      default:
        return {
          nextState: 'greeting',
          responseContent: "Hi! I'm here to help plan your perfect girls' night out in Dallas! What are you thinking?",
        };
    }
  }

  /**
   * Handle greeting state
   */
  private handleGreeting(
    prefs: GatheredPreferences,
    _intents: Set<string>
  ): { nextState: AgentState; responseContent: string } {
    // If user already provided some info, acknowledge and ask for more
    if (prefs.partySize || prefs.date || prefs.activities?.length) {
      let response = "Sounds fun! ";
      
      if (!prefs.partySize) {
        response += "How many people will be joining?";
      } else if (!prefs.date) {
        response += "When are you planning this for?";
      } else if (!prefs.activities?.length) {
        response += "What kind of night are you thinking - dinner, drinks, dancing, or all of the above?";
      }
      
      return { nextState: 'gathering', responseContent: response };
    }
    
    return {
      nextState: 'gathering',
      responseContent: "Hey! 👋 I'd love to help plan your perfect night out in Dallas! Tell me a bit about what you're thinking - how many people, when, and what kind of vibe you're going for?",
    };
  }

  /**
   * Handle gathering state
   */
  private handleGathering(
    prefs: GatheredPreferences,
    _intents: Set<string>
  ): { nextState: AgentState; responseContent: string } {
    // Check what we still need
    const missing: string[] = [];
    
    if (!prefs.partySize) missing.push('party size');
    if (!prefs.date) missing.push('date');
    if (!prefs.activities?.length) missing.push('activities');
    
    // If we have enough to search, move to searching
    if (missing.length === 0 || (prefs.partySize && prefs.date)) {
      let summary = `Perfect! So we're looking at `;
      summary += prefs.partySize ? `${prefs.partySize} people` : 'a group';
      summary += prefs.date ? ` for ${this.formatDate(prefs.date)}` : '';
      summary += prefs.neighborhood ? ` in ${prefs.neighborhood}` : '';
      summary += `. Let me find some great options for you...`;
      
      return { nextState: 'searching', responseContent: summary };
    }
    
    // Ask for missing info
    if (!prefs.partySize) {
      return {
        nextState: 'gathering',
        responseContent: "Sounds great! How many people will be in your group?",
      };
    }
    
    if (!prefs.date) {
      return {
        nextState: 'gathering',
        responseContent: `Nice, ${prefs.partySize} people! When are you planning this night out?`,
      };
    }
    
    if (!prefs.activities?.length) {
      return {
        nextState: 'gathering',
        responseContent: "What are you in the mood for? Dinner? Drinks? Dancing? An event? Or maybe all of the above?",
      };
    }
    
    return {
      nextState: 'gathering',
      responseContent: "Tell me more about what you're looking for!",
    };
  }

  /**
   * Handle searching state
   */
  private async handleSearching(
    _session: ChatSession,
    prefs: GatheredPreferences
  ): Promise<{ nextState: AgentState; responseContent: string; plan: NightPlan }> {
    // Build the plan based on preferences
    const planItems: PlanItem[] = [];
    const activities = prefs.activities ?? ['dinner', 'drinks'];
    
    // Map budget to price level
    const priceLevel = prefs.budget === 'low' ? 1 : prefs.budget === 'high' ? 3 : 2;
    
    // Search for dinner
    if (activities.includes('dinner')) {
      const { restaurants } = await mockYelpService.searchRestaurants({
        location: prefs.neighborhood ?? 'Dallas',
        priceLevel: priceLevel as 1 | 2 | 3 | 4,
        vibes: prefs.vibes,
        limit: 3,
      });
      
      if (restaurants.length > 0) {
        const restaurant = restaurants[0]!;
        planItems.push({
          id: generateId('pln'),
          type: 'restaurant',
          name: restaurant.name,
          time: prefs.timePreference === 'early' ? '18:00' : prefs.timePreference === 'late' ? '20:30' : '19:00',
          duration: 90,
          details: {
            address: restaurant.address,
            cuisine: restaurant.cuisine,
            priceLevel: restaurant.priceLevel,
            rating: restaurant.rating,
            neighborhood: restaurant.neighborhood,
          },
          confirmed: false,
        });
      }
    }
    
    // Search for bars
    if (activities.includes('drinks') || activities.includes('dancing')) {
      const { bars } = await mockYelpService.searchBars({
        location: prefs.neighborhood ?? 'Dallas',
        priceLevel: priceLevel as 1 | 2 | 3 | 4,
        vibes: prefs.vibes,
        openLate: activities.includes('dancing'),
        limit: 3,
      });
      
      if (bars.length > 0) {
        const bar = bars[0]!;
        planItems.push({
          id: generateId('pln'),
          type: 'bar',
          name: bar.name,
          time: prefs.timePreference === 'early' ? '20:00' : prefs.timePreference === 'late' ? '22:00' : '21:00',
          duration: 120,
          details: {
            address: bar.address,
            barType: bar.barType,
            priceLevel: bar.priceLevel,
            rating: bar.rating,
            vibes: bar.vibes,
          },
          confirmed: false,
        });
      }
    }
    
    // Search for events
    if (activities.includes('event')) {
      const { events } = await mockEventsService.searchEvents({
        location: prefs.neighborhood ?? 'Dallas',
        priceLevel: priceLevel as 1 | 2 | 3 | 4,
        vibes: prefs.vibes,
        limit: 3,
      });
      
      if (events.length > 0) {
        const event = events[0]!;
        planItems.push({
          id: generateId('pln'),
          type: 'event',
          name: event.name,
          time: event.startTime,
          details: {
            venue: event.venue,
            address: event.address,
            eventType: event.eventType,
            ticketPrice: event.ticketPrice,
          },
          confirmed: false,
        });
      }
    }
    
    // Create the plan
    const plan: NightPlan = {
      id: generateId('npl'),
      items: planItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Generate response
    let response = "Found some great options for you! Here's what I'm thinking:\n\n";
    
    for (const item of planItems) {
      const time = item.time ? `at ${this.formatTime(item.time)}` : '';
      response += `🎯 **${item.name}** ${time}\n`;
      
      if (item.type === 'restaurant') {
        response += `   ${(item.details as any).cuisine} • ${(item.details as any).neighborhood}\n`;
      } else if (item.type === 'bar') {
        response += `   ${(item.details as any).barType} • ${((item.details as any).vibes ?? []).join(', ')}\n`;
      } else if (item.type === 'event') {
        response += `   ${(item.details as any).eventType} at ${(item.details as any).venue}\n`;
      }
      response += '\n';
    }
    
    response += "What do you think? Want to see more options, make changes, or does this look good?";
    
    return {
      nextState: 'presenting',
      responseContent: response,
      plan,
    };
  }

  /**
   * Handle presenting state
   */
  private handlePresenting(
    _session: ChatSession,
    _userMessage: string,
    intents: Set<string>
  ): { nextState: AgentState; responseContent: string } {
    if (intents.has('yes')) {
      return {
        nextState: 'confirming',
        responseContent: "Awesome! I can help you check availability and make reservations. Should I look into that, or are you all set?",
      };
    }
    
    if (intents.has('no') || intents.has('refine')) {
      return {
        nextState: 'refining',
        responseContent: "No problem! What would you like to change? Different neighborhood? Different type of venue? More or less fancy?",
      };
    }
    
    return {
      nextState: 'presenting',
      responseContent: "Let me know if this plan works for you, or if you'd like me to find different options!",
    };
  }

  /**
   * Handle refining state
   */
  private async handleRefining(
    _session: ChatSession,
    _prefs: GatheredPreferences,
    _userMessage: string
  ): Promise<{ nextState: AgentState; responseContent: string; plan?: NightPlan }> {
    // Re-run search with updated preferences and move back to searching
    return {
      nextState: 'searching',
      responseContent: "Got it! Let me find some new options based on that...",
    };
  }

  /**
   * Handle confirming state
   */
  private handleConfirming(
    _session: ChatSession,
    intents: Set<string>
  ): { nextState: AgentState; responseContent: string } {
    if (intents.has('yes')) {
      return {
        nextState: 'complete',
        responseContent: "Perfect! Your night is all planned! 🎉 Here's a summary of your evening. Have an amazing time, and don't hesitate to reach out if anything changes!",
      };
    }
    
    return {
      nextState: 'confirming',
      responseContent: "Alright, let me know when you're ready to confirm, or if you want to make any last-minute changes!",
    };
  }

  /**
   * Format date for display
   */
  private formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (dateStr === today.toISOString().split('T')[0]) {
      return 'tonight';
    }
    if (dateStr === tomorrow.toISOString().split('T')[0]) {
      return 'tomorrow';
    }
    
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  }

  /**
   * Format time for display
   */
  private formatTime(timeStr: string): string {
    // Handle ISO datetime strings
    if (timeStr.includes('T')) {
      const date = new Date(timeStr);
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    
    // Handle HH:mm format
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours! >= 12 ? 'PM' : 'AM';
    const displayHour = hours! % 12 || 12;
    return `${displayHour}:${minutes!.toString().padStart(2, '0')} ${period}`;
  }
}

// Export singleton instance
export const mockAgentService = new MockAgentService();
