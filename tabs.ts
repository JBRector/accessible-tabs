export function switchAttributes(
  el: Element | null,
  attr: string,
  state: 'true' | 'false' = 'false'
): void {
  el?.setAttribute(attr, state);
}

export function getTopPosition(): number {
  const header: HTMLDivElement | null = document.querySelector('.header');
  return header?.offsetHeight || 0;
}

export default class Tabs {
  el: HTMLDivElement;

  tabs: HTMLAnchorElement[];

  panels: HTMLDivElement[];

  tabList: HTMLDivElement | null;

  activeTab: HTMLAnchorElement | null;

  /**
   * @param el {HTMLDivElement}
   */
  constructor(el: HTMLDivElement) {
    this.el = el;
    this.tabList = el.querySelector('[role=tablist]');
    this.tabs = Array.from(el.querySelectorAll('[role=tab]'));
    let tabPanels = el.querySelectorAll('[role=tabpanel]');
    if (tabPanels.length === 0) {
      tabPanels = el.querySelectorAll('.tab-pane');
    }
    this.panels = Array.from(tabPanels) as HTMLDivElement[];
    this.activeTab = this.el.querySelector('[role=tab][aria-selected=true]');
  }

  init = () => {
    this.initTabClicks();
    this.initA11yTabs();
    if (this.tabs.length) {
      const tabToOpen = this.tabs[0];
      this.openTab(tabToOpen);
      tabToOpen.setAttribute('tabindex', '0');
    }
  };

  /**
   * Init click events on the tabs
   */
  initTabClicks = () => {
    this.tabs.forEach((tab: HTMLAnchorElement) => {
      tab.addEventListener('click', (e: MouseEvent) => {
        e.preventDefault();
        this.openTab(tab);
      });
    });
  };

  /**
   * Implement accessible tabs
   *
   * 1. Allow tabs to be navigated with left/right arrows
   * 2. only current tab can be tabbed to
   * 3. Switching tabs with the arrow keys activates the new selected tab
   * 4. Press Home or End key to go to the first or last tab
   */
  initA11yTabs = () => {
    this.tabList?.addEventListener('keydown', (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowDown':
        case 'ArrowRight': {
          e.preventDefault();
          let tabToOpenIndex: number = this.activeTab
            ? [...this.tabs].indexOf(this.activeTab) + 1
            : 0;
          if (tabToOpenIndex >= this.tabs.length) {
            tabToOpenIndex = 0;
          }
          const tabToOpen = this.tabs[tabToOpenIndex];
          this.openTab(tabToOpen);
          tabToOpen.focus();
          break;
        }

        case 'ArrowUp':
        case 'ArrowLeft': {
          e.preventDefault();
          let tabToOpenIndex: number = this.activeTab
            ? [...this.tabs].indexOf(this.activeTab) - 1
            : 0;
          if (tabToOpenIndex === -1) {
            tabToOpenIndex = this.tabs.length - 1;
          }
          const tabToOpen = this.tabs[tabToOpenIndex];
          this.openTab(tabToOpen);
          tabToOpen.focus();
          break;
        }

        case 'Home': {
          e.preventDefault();
          const tabToOpen = this.tabs[0];
          this.openTab(tabToOpen);
          tabToOpen.focus();
          break;
        }

        case 'End': {
          e.preventDefault();
          const tabToOpen = this.tabs[this.tabs.length - 1];
          this.openTab(tabToOpen);
          tabToOpen.focus();
          break;
        }

        default:
          break;
      }
    });
  };

  /**
   * go through all the tabs, remove active class and set them to aria-selected false
   */
  closeAllTabs = () => {
    this.tabs.forEach((tab: HTMLAnchorElement) => {
      switchAttributes(tab, 'aria-selected', 'false');
    });

    this.panels.forEach((panel: HTMLDivElement) => {
      panel.setAttribute('hidden', 'true');
    });
  };

  /**
   * Open up the tab that is passed in and close all others
   * Set active tab
   * @param tab
   */
  openTab = (tab: HTMLAnchorElement) => {
    this.activeTab?.setAttribute('tabindex', '-1');
    this.activeTab = tab;
    tab.setAttribute('tabindex', '0');
    this.closeAllTabs();
    let panelToOpen: number = Number(tab.dataset.tabIndex || 0) - 1;
    if (panelToOpen === -1) {
      panelToOpen = Number(
        tab.getAttribute('id')?.replace('nav-tab-', '') || 0
      );
    }

    tab.setAttribute('aria-selected', 'true');
    if (this.panels[panelToOpen].hasAttribute('hidden')) {
      this.panels[panelToOpen].removeAttribute('hidden');

      // on mobile, scroll tab to top
      if (window.innerWidth < 768) {
        setTimeout(() => {
          window.scrollTo({
            top: this.panels[panelToOpen].offsetTop - getTopPosition(),
            left: 0,
            behavior: 'smooth',
          });
        }, 300);
      }
    }
  };
}
