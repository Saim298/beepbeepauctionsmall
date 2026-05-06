import React, { createContext, useContext, useEffect, useState } from "react"
import { FiMenu } from "react-icons/fi"
import Sidebar from "../utils/Sidebar.jsx"
import { MobileBottomBarDashboard } from "./MobileBottomBar.jsx"

const DashboardShellContext = createContext({ openMenu: () => {} })

export const useDashboardAppChrome = () => useContext(DashboardShellContext)

/** Renders the hamburger that opens the dashboard sidebar drawer on small screens. */
export function DashboardMenuButton() {
  const { openMenu } = useContext(DashboardShellContext)
  return (
    <button
      type="button"
      className="sidebar-toggle-mobile"
      onClick={openMenu}
      aria-label="Open sidebar menu"
    >
      <FiMenu />
    </button>
  )
}

/**
 * Shared layout: Sidebar (with mobile drawer), bottom padding for the mobile bar, and
 * the dashboard-styled mobile bottom navigation on all in-app account pages.
 */
export function DashboardAppChrome({
  theme = "dark",
  className = "",
  withBottomBar = true,
  children,
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 992) setMobileSidebarOpen(false)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return (
    <DashboardShellContext.Provider
      value={{ openMenu: () => setMobileSidebarOpen(true) }}
    >
      <div
        className={`dashboard-root${withBottomBar ? " mobile-content-pad" : ""}${className ? ` ${className}` : ""}`.trim()}
        data-theme={theme}
      >
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
        {children}
        {withBottomBar ? <MobileBottomBarDashboard /> : null}
      </div>
    </DashboardShellContext.Provider>
  )
}
