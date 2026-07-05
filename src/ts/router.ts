import { getAppPathname, toAppPath } from './base/base-path';
import { PagesList } from './base/enums';
import { isPlantsId } from './base/helpers';
import Cart from './components/cart';
import CartPage from './pages/cart-page';
import CatalogPage from './pages/catalog-page';
import ErrorPage from './pages/error-page';
import PlantPage from './pages/plant-page';

class Router {
  static catalogPage: CatalogPage;
  static cartPage: CartPage;
  static plantPage: PlantPage;
  static errorPage: ErrorPage;

  constructor(cart: Cart) {
    Router.catalogPage = new CatalogPage(cart);
    Router.cartPage = new CartPage(cart);
    Router.plantPage = new PlantPage(cart);
    Router.errorPage = new ErrorPage(cart);
  }

  static render(pathname: string) {
    // console.log('render:', pathname);
    switch (pathname) {
      case PagesList.catalogPage:
        Router.catalogPage.draw();
        break;
      case PagesList.cartPage:
        Router.cartPage.draw();
        break;
      case '/':
        Router.goTo(PagesList.catalogPage, window.location.hash);
        return;
      default:
        if (isPlantsId(pathname)) {
          Router.plantPage.draw(pathname.slice(1));
        } else {
          Router.errorPage.draw();
        }
        break;
    }
    Router.changeLinks();
    Router.handleAnchorLinks();
    Router.scrollToCurrentHash();
  }

  static goTo(pageId: string, hash = '') {
    const path = toAppPath(pageId);
    const fullPath = `${path}${hash}`;
    window.history.pushState({ pageId }, pageId, fullPath);
    Router.render(pageId);
  }

  static scrollToCurrentHash() {
    const { hash } = window.location;

    if (hash) {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    window.scrollTo(0, 0);
  }

  static handleAnchorLinks() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
      if (!link.classList.contains('anchor-changed')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();

          if (!(link instanceof HTMLAnchorElement)) {
            return;
          }

          const hash = link.getAttribute('href');

          if (!hash) {
            return;
          }

          const url = `${window.location.pathname}${window.location.search}${hash}`;
          window.history.pushState(window.history.state, '', url);
          document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
        });
        link.classList.add('anchor-changed');
      }
    });
  }

  static changeLinks() {
    const links = document.querySelectorAll('[href^="/"]');
    links.forEach((link) => {
      if (!link.classList.contains('link-changed')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          if (link instanceof HTMLAnchorElement) {
            const linkPath = getAppPathname(new URL(link.href).pathname);
            const currentPath = getAppPathname(new URL(window.location.href).pathname);

            if (linkPath !== '/catalog' || currentPath !== '/catalog') {
              Router.goTo(linkPath);
            }
          }
        });
        link.classList.add('link-changed');
      }
    });
  }

  static startRouter() {
    window.addEventListener('popstate', () => {
      Router.render(getAppPathname());
    });
    Router.render(getAppPathname());
  }
}

export default Router;
