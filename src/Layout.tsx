import { Sidebar } from "./components/ui/sidebar";

import { SidebarProvider } from "./components/ui/sidebar";
import Header from "./components/Header";
import Footer  from "./components/Footer";
import Content from "./components/Content";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SidebarProvider>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 w-full">
            <Header />
            <Content />
            <Footer />
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
};

export default Layout;
