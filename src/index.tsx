import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import { IntlProvider } from "react-intl";
import { SkeletonTheme } from "react-loading-skeleton";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "regenerator-runtime/runtime";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import App from "./App";
import translation from "./assets/i18n/en.json";
import "./assets/styles/base.scss";
import "./assets/styles/skeleton.css";
import WalletProtectedRouter from "./components/layout/WalletProtectedRouter";
import { EthereumProvider } from "./core/context/ethereum.context";
import { ResponsiveProvider } from "./core/context/responsive.context";
import { ScrollBlockProvider } from "./core/context/scroll-block.context";
import { store } from "./core/store/store";

// import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { ErrorFallback } from "./components/fallback/ErrorFallback";
import { ALCHEMY_API_KEY, CHAIN, ENV_STAGE } from "./core/constants/base.const";
import { colors } from "./core/constants/styleguide.const";
import { notFoundPath } from "./core/util/pathBuilder.util";
import NotFoundPage from "./pages/not-found-page/NotFoundPage";
import SuspensePage from "./pages/suspense-page/SuspensePage";
import TermsOfServicePage from "./pages/terms-of-service-page/TermsOfServicePage";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";

const AccountPage = lazy(() => import("./pages/account-page/AccountPage"));
const FavPage = lazy(() => import("./pages/fav-page/FavPage"));
const HomePage = lazy(() => import("./pages/home-page/HomePage"));
const HowItWorksPage = lazy(
  () => import("./pages/how-it-works-page/HowItWorksPage")
);
const LeaderboardPage = lazy(
  () => import("./pages/leader-board-page/LeaderBoardPage")
);
const NotificationsPage = lazy(
  () => import("./pages/notifications-page/NotificationsPage")
);
const PortfolioEditPage = lazy(
  () => import("./pages/portfolio-edit-page/PortfolioEditPage")
);
const PortfolioPage = lazy(
  () => import("./pages/portfolio-page/PortfolioPage")
);
const PrivacyPage = lazy(() => import("./pages/privacy-page/PrivacyPage"));
const PublicProfilePage = lazy(
  () => import("./pages/public-profile-page/PublicProfilePage")
);
const RedirectPage = lazy(() => import("./pages/redirect-page/RedirectPage"));
const StartHerePage = lazy(
  () => import("./pages/start-here-page/StartHerePage")
);
const StockPage = lazy(() => import("./pages/stock-page/StockPage"));
const FanMatchesPage = lazy(
  () => import("./pages/fan-matches-page/FanMatchesPage")
);
const BlogPage = lazy(() => import("./pages/blog-page/BlogPage"));
const BlogArticlePage = lazy(
  () => import("./pages/blog-page/blog-article/BlogArticlePage")
);

// regeneratorRuntime; //Just so import is not removed;

// GraphQL query client
const queryClient = new QueryClient();

// wagmi config
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [CHAIN],
  [
    alchemyProvider({ apiKey: ALCHEMY_API_KEY }), publicProvider()
  ]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new MetaMaskConnector({ chains }),
    // new CoinbaseWalletConnector({
    //   chains,
    //   options: {
    //     appName: "wagmi",
    //   },
    // })
    // new WalletConnectConnector({
    //   chains,
    //   options: {
    //     projectId: WALLET_CONNECT_PROJECT_ID,
    //   },
    // }),
  ]
});

if (ENV_STAGE === "dev") {
  config.connectors.push(new CoinbaseWalletConnector({
    chains,
    options: {
      appName: "wagmi",
    },
  }));
}

const Index = () => {
  // Protect website using basic credentials
  /* const [allowed, setAllowed] = useState(true);
  const [checkingSignIn, setCheckingSignIn] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("PROD_ALLOWED") === "true") {
      setAllowed(true);
    }
    setCheckingSignIn(false);
  }, []); */

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Suspense fallback={<SuspensePage />}>
          <HomePage />
        </Suspense>
      )
    },
    {
      path: "/connect-wallet",
      element: (
        <Suspense fallback={<SuspensePage />}>
          <HomePage openConnectWalletModal={true} />
        </Suspense>
      )
    },
    {
      path: "/stocks",
      element: (
        <Suspense fallback={<SuspensePage />}>
          <StockPage />
        </Suspense>
      )
    },
    {
      path: "/account",
      element: (
        <WalletProtectedRouter>
          <Suspense fallback={<SuspensePage />}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <AccountPage />
            </ErrorBoundary>
          </Suspense>
        </WalletProtectedRouter>
      )
    },
    {
      path: "/portfolio",
      element: (
        <WalletProtectedRouter>
          <Suspense fallback={<SuspensePage />}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <PortfolioPage />
            </ErrorBoundary>
          </Suspense>
        </WalletProtectedRouter>
      )
    },
    {
      path: "/profile/edit",
      element: (
        <WalletProtectedRouter>
          <Suspense fallback={<SuspensePage />}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <PortfolioEditPage />
            </ErrorBoundary>
          </Suspense>
        </WalletProtectedRouter>
      )
    },
    {
      path: "/fans",
      element: (
        <Suspense fallback={<SuspensePage />}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <LeaderboardPage />
          </ErrorBoundary>
        </Suspense>
      )
    },
    {
      path: "/fan-matches",
      element: (
        <Suspense fallback={<SuspensePage />}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <FanMatchesPage />
          </ErrorBoundary>
        </Suspense>
      )
    },
    {
      path: "/how-it-works",
      element: (
        <Suspense fallback={<SuspensePage />}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <HowItWorksPage />
          </ErrorBoundary>
        </Suspense>
      )
    },
    {
      path: "/start-here",
      element: (
        <Suspense fallback={<SuspensePage />}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <StartHerePage />
          </ErrorBoundary>
        </Suspense>
      )
    },
    {
      path: "/notifications",
      element: (
        <Suspense fallback={<SuspensePage />}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <NotificationsPage />
          </ErrorBoundary>
        </Suspense>
      )
    },
    {
      path: "/terms-of-service",
      element: (
        <Suspense fallback={<SuspensePage />}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <TermsOfServicePage />
          </ErrorBoundary>
        </Suspense>
      )
    },
    {
      path: "/blog",
      element: (
        <Suspense fallback={<SuspensePage />}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <BlogPage />
          </ErrorBoundary>
        </Suspense>
      )
    },
    {
      path: "/blog/:title",
      element: (
        <Suspense fallback={<SuspensePage />}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <BlogArticlePage />
          </ErrorBoundary>
        </Suspense>
      )
    },
    {
      path: "/privacy-policy",
      element: (
        <Suspense fallback={<SuspensePage />}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <PrivacyPage />
          </ErrorBoundary>
        </Suspense>
      )
    },
    {
      path: "/:title",
      element: (
        <Suspense fallback={<SuspensePage />}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <FavPage />
          </ErrorBoundary>
        </Suspense>
      )
    },
    {
      path: "/fan/:username",
      element: (
        <Suspense fallback={<SuspensePage />}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <PublicProfilePage />
          </ErrorBoundary>
        </Suspense>
      )
    },
    {
      path: "/redirect/:id",
      element: (
        <Suspense fallback={<SuspensePage />}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <RedirectPage />
          </ErrorBoundary>
        </Suspense>
      )
    },
    {
      path: notFoundPath(),
      element: <NotFoundPage />
    }
  ]);

  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <IntlProvider messages={translation} locale="en">
            <ScrollBlockProvider>
              <EthereumProvider>
                <ResponsiveProvider>
                  <HelmetProvider>
                    <SkeletonTheme
                      baseColor={colors.neutrals3}
                      highlightColor="#585e6e"
                      enableAnimation={true}
                    >
                      <RouterProvider router={router} />
                      <App />
                    </SkeletonTheme>
                  </HelmetProvider>
                </ResponsiveProvider>
              </EthereumProvider>
            </ScrollBlockProvider>
          </IntlProvider>
        </Provider>
      </QueryClientProvider>
    </WagmiConfig>
  );
};

ReactDOM.render(<Index />, document.getElementById("app"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.register();
serviceWorker.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
