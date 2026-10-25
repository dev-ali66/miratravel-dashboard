import { Route, Routes } from "react-router-dom"

import { NotFoundPage } from "@/components/pages/NotFound"
import { RootLayout } from "@/components/layout/RootLayout"

import UserListPage from "@/components/pages/UserList"
import CMSPage from "@/components/pages/CMS"
import SignIn from "@/components/pages/Auth/SignIn"
import Home from "@/components/pages/Home"
import PrivacyPolicyPage from "@/components/pages/PrivacyPolicy"
import TermsOfServicePage from "@/components/pages/TermsOfService"
import RequestsPage from "@/components/pages/Requests"

import PageSections from "@/components/pages/CMS/PageSections"

import { PrivateRoute } from "@/components/auth/PrivateRoute"
import { PublicRoute } from "@/components/auth/PublicRoute"

import { CmsEditorLayout } from "@/components/pages/CMS/CmsEditorLayout"

import { TooltipProvider } from "@/components/ui/tooltip"
import LocationPages from "./components/pages/Location"
import { LocationEditorLayout } from "./components/pages/Location/LocationEditorLayout"
import { LocationForm } from "./components/pages/Location/LocationForm"

import ExperiencePages from "./components/pages/Experience"
import { ExperienceEditorLayout } from "./components/pages/Experience/ExperienceEditorLayout"
import { ExperienceForm } from "./components/pages/Experience/ExperienceForm"


import JourneyPages from "./components/pages/Journey"
import { JourneyEditorLayout } from "./components/pages/Journey/JourneyEditorLayout"
import { JourneyForm } from "./components/pages/Journey/JourneyForm"

import StoriesPages from "./components/pages/Stories"
import { StoryEditorLayout } from "./components/pages/Stories/StoryEditorLayout"
import MediaLibraryPage from "@/components/pages/MediaLibrary"

import IAMPage from "@/components/pages/IAM"
import BookingsPage from "@/components/pages/Bookings"
import AuditLogsPage from "@/components/pages/AuditLogs"
import SystemHealthPage from "@/components/pages/SystemHealth"
import PaymentConfigPage from "@/components/pages/PaymentConfig"
import ReviewsPage from "@/components/pages/Reviews"
import PromotionsPage from "@/components/pages/Promotions"
import NewsletterPage from "@/components/pages/Newsletter"
import NotificationsPage from "@/components/pages/Notifications"
import SettingsPage from "@/components/pages/Settings"
import SiteSettingsPage from "@/components/pages/SiteSettings"

import PageLoader from "@/components/shared/PageLoader"
import InquiryPage from "./components/pages/Inquiry"

export function App() {
  return (
    <TooltipProvider>
      <PageLoader />
      <Routes>
        {/* Public */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<SignIn />} />
        </Route>

        {/* Protected */}
        <Route element={<PrivateRoute />}>
          {/* Main application */}
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />

            <Route path="user" element={<UserListPage />} />
            {/* <Route path="concierge" element={<ConciergePage />} /> */}
            <Route path="inquiries" element={<InquiryPage />} />
            <Route path="inquiry" element={<InquiryPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="promotions" element={<PromotionsPage />} />
            <Route path="newsletter" element={<NewsletterPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="requests" element={<RequestsPage />} />

            <Route path="cms" element={<CMSPage />} />
            <Route path="journeys" element={<JourneyPages />} />
            <Route path="location" element={<LocationPages />} />
            <Route path="experiences" element={<ExperiencePages />} />
            <Route path="experience" element={<ExperiencePages />} />
            <Route path="stories" element={<StoriesPages />} />
            <Route path="media-library" element={<MediaLibraryPage />} />
            
            <Route path="iam" element={<IAMPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
            <Route path="system-health" element={<SystemHealthPage />} />
            <Route path="payment-config" element={<PaymentConfigPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="site-settings" element={<SiteSettingsPage />} />
          </Route>

          {/* Full Screen Editors (outside RootLayout) */}
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />

          <Route path="/cms" element={<CmsEditorLayout />}>
            <Route path=":slug" element={<PageSections />} />
          </Route>


          <Route path="/locations" element={<LocationEditorLayout />}>
            <Route path="new" element={<LocationForm />} />
            <Route path=":id/:slug" element={<LocationForm />} />
          </Route>

          <Route path="/experiences" element={<ExperienceEditorLayout />}>
            <Route path="new" element={<ExperienceForm />} />
            <Route path=":id/:slug" element={<ExperienceForm />} />
          </Route>

          <Route path="/journeys" element={<JourneyEditorLayout />}>
            <Route path="new" element={<JourneyForm />} />
            <Route path=":id/:slug" element={<JourneyForm />} />
          </Route>

          <Route path="/stories/:slug" element={<StoryEditorLayout />} />
  {/* <Route
            path="location/add"
            element={
              <LocationForm />
            }
          /> */}

  {/* <Route
            path="location/edit/:locationId"
            element={
              <LocationEditPage />
            }
          /> */}
        </Route >

    {/* 404 */ }
    < Route path = "*" element = {< NotFoundPage />} />
      </Routes >
    </TooltipProvider >
  )
}

export default App
