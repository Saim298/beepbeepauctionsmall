import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import Home from "./pages/Home.jsx";
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UserAddCar from "./pages/user/AddCar.jsx";
import MyListings from "./pages/user/MyListings.jsx";
import UserDashboard from "./pages/user/UserDashboard.jsx";
import CardManagement from "./pages/user/CardManagement.jsx";
import AuctionsFront from "./pages/AuctionsFront.jsx";
import AuctionDetail from "./pages/AuctionDetail.jsx";
import AuctionDetailFront from "./pages/AuctionDetailFront.jsx";
import UserAddSparePart from "./pages/user/AddMarketplace.jsx";
import MyParts from "./pages/user/MyParts.jsx";
import PartsListingFront from "./pages/PartsListingFront.jsx";
import PartDetailFront from "./pages/PartDetailFront.jsx";

import RoleSelect from "./pages/RoleSelect.jsx";
import Settings from "./pages/Settings.jsx";
import DashboardNotifications from "./pages/DashboardNotifications.jsx";

import Contact from "./pages/Contact.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";
import Chat from "./pages/Chat.jsx";
import CartFront from "./pages/CartFront.jsx";
import CheckoutFront from "./pages/CheckoutFront.jsx";
import MyReviews from "./pages/MyReviews.jsx";
import OAuthSuccess from "./pages/OAuthSuccess.jsx";
import BuyerOrders from "./pages/user/BuyerOrders.jsx";
import SellerOrders from "./pages/user/SellerOrders.jsx";
import CloverCheckoutSuccess from "./pages/CloverCheckoutSuccess.jsx";
import CloverCheckoutFailure from "./pages/CloverCheckoutFailure.jsx";
import CloverOAuthStart from "./pages/CloverOAuthStart.jsx";
import CloverOAuthCallback from "./pages/CloverOAuthCallback.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";

function App() {
  return (
    <>
      <CartProvider>
        <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/oauth-start" element={<CloverOAuthStart />} />
            <Route path="/oauth-clover-callback" element={<CloverOAuthCallback />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/notifications" element={<DashboardNotifications />} />
            <Route path="/user/listings/new" element={<UserAddCar />} />
            <Route path="/user/listings" element={<MyListings />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/cards" element={<CardManagement />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/cart" element={<CartFront />} />
            <Route path="/checkout" element={<CheckoutFront />} />
            <Route path="/checkout/clover-success" element={<CloverCheckoutSuccess />} />
            <Route path="/checkout/clover-failure" element={<CloverCheckoutFailure />} />

            {/* Parts Marketplace Routes */}
            <Route path="/user/parts" element={<MyParts />} />
            <Route path="/user/parts/new" element={<UserAddSparePart />} />
            <Route path="/user/parts/edit/:id" element={<UserAddSparePart />} />
            <Route path="/user/reviews" element={<MyReviews />} />
            <Route path="/user/orders" element={<BuyerOrders />} />
            <Route path="/user/seller-orders" element={<SellerOrders />} />
            <Route path="/parts" element={<PartsListingFront />} />
            <Route path="/parts/:id" element={<PartDetailFront />} />
            <Route path="/part/:id" element={<PartDetailFront />} />
            <Route
              path="/dashboard/part-details/:id"
              element={<AuctionDetailFront />}
            />
     
            {/* Legacy Auction Routes */}
            <Route path="/auctions" element={<AuctionsFront />} />
            <Route path="/auctions/:id" element={<AuctionDetail />} />
            <Route
              path="/auction-details/:id"
              element={<AuctionDetailFront />}
            />
            <Route path="/select-role" element={<RoleSelect />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/coming-soon" element={<ComingSoon />} />

            {/* Catch all other undefined routes and redirect to coming-soon */}
            <Route path="*" element={<ComingSoon />} />
          </Routes>
        </BrowserRouter>
        </NotificationProvider>
      </CartProvider>
    </>
  );
}

export default App;
