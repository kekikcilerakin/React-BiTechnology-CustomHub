import { ThemeProvider } from "./components/ThemeProvider";
import Layout from "./Layout";
import { logQlikApps } from "./utils/logQlikApps";

const App = () => {
  logQlikApps();

  return (
    <ThemeProvider defaultTheme="light" storageKey="hub-theme">
      <Layout />
    </ThemeProvider>
  );
};

export default App;
