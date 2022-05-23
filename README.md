# accessible-tabs
Accessible HTML/CSS/JS tabs component

## To use:
Copy HTML and JS (I haven't included styles here)
After importing the Tabs Class, add:

```
// Instantiate Tabs
let tabAreas = document.querySelectorAll('.tabs');

const tabEls: HTMLDivElement[] = Array.from(tabAreas) as HTMLDivElement[];
if (tabEls && tabEls.length) {
  tabEls.forEach((tabsEl: HTMLDivElement) => {
    const tabs = new Tabs(tabsEl);
    tabs.init();
  });
}
```
