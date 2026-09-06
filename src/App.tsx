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

import { CMSEditorLayout } from "@/components/layout/CMSEditorLayout"

import { TooltipProvider } from "@/components/ui/tooltip"
import LocationPages from "./components/pages/Location"
import { LocationEditorLayout } from "./components/pages/Location/LocationEditorLayout"
// import { LocationPreview } from "./components/pages/Location/LocationPreview";
import { LocationForm } from "./components/pages/Location/LocationForm"
// import { LocationEditPage } from "./components/pages/Location/LocationEditPage";

import JourneysPage from "@/components/pages/Journeys"
import { JourneyEditorLayout } from "@/components/pages/Journeys/JourneyEditorLayout"
import { JourneyForm } from "@/components/pages/Journeys/JourneyForm"

export function App() {
  return (
    <TooltipProvider>
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
            <Route path="requests" element={<RequestsPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="terms-of-service" element={<TermsOfServicePage />} />

            <Route path="cms" element={<CMSPage />} />
            <Route path="location" element={<LocationPages />} />
            <Route path="journeys" element={<JourneysPage />} />
          </Route>

          <Route path="/cms" element={<CMSEditorLayout />}>
            <Route path=":slug" element={<PageSections />} />
          </Route>

          {/* <Route path="/locations" element={<LocationEditorLayout />}>
            <Route path=":slug" element={<LocationForm />} />
          </Route> */}
          <Route path="/locations" element={<LocationEditorLayout />}>
            <Route path="new" element={<LocationForm />} />
            <Route path=":id/:slug" element={<LocationForm />} />
          </Route>

          {/* Journeys Editor */}
          <Route path="/journeys" element={<JourneyEditorLayout />}>
            <Route path="new" element={<JourneyForm />} />
            <Route path=":id/:slug" element={<JourneyForm />} />
            <Route path=":id" element={<JourneyForm />} />
          </Route>
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
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </TooltipProvider>
  )
}

export default App
