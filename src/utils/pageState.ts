// Page State Persistence Utility
interface PageState {
  route: string;
  timestamp: number;
  scrollPosition?: number;
  formData?: Record<string, any>;
}

const PAGE_STATE_KEY = 'scholarship_connect_page_state';

export const pageStateManager = {
  // Save current page state
  saveState: (route: string, data?: Record<string, any>) => {
    const state: PageState = {
      route,
      timestamp: Date.now(),
      scrollPosition: window.scrollY,
      formData: data
    };
    
    try {
      localStorage.setItem(PAGE_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save page state:', error);
    }
  },

  // Get saved page state
  getState: (): PageState | null => {
    try {
      const saved = localStorage.getItem(PAGE_STATE_KEY);
      if (!saved) return null;
      
      const state = JSON.parse(saved) as PageState;
      
      // Only return recent states (within 24 hours)
      if (Date.now() - state.timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(PAGE_STATE_KEY);
        return null;
      }
      
      return state;
    } catch (error) {
      console.warn('Failed to get page state:', error);
      return null;
    }
  },

  // Clear saved state
  clearState: () => {
    try {
      localStorage.removeItem(PAGE_STATE_KEY);
    } catch (error) {
      console.warn('Failed to clear page state:', error);
    }
  },

  // Restore scroll position
  restoreScrollPosition: (position: number) => {
    setTimeout(() => {
      window.scrollTo(0, position);
    }, 100);
  }
};

// Auto-save on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    pageStateManager.saveState(window.location.pathname);
  });
}