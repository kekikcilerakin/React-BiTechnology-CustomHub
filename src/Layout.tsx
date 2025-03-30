import { Sidebar } from "./components/ui/sidebar";

import { SidebarProvider } from "./components/ui/sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Content from "./components/Content";

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <SidebarProvider>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex w-full flex-1 flex-col">
            <Header />
            <Content />
            <Footer />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Layout;
