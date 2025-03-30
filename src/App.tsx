import { ThemeProvider } from "./components/ThemeProvider";
import Layout from "./Layout";
import { logQlikUser } from "./utils/getQlikUser";
import { logQlikStreams } from "./utils/getQlikStreams";
import { logQlikApps } from "./utils/getQlikApps";

const App = () => {
  logQlikUser();
  logQlikStreams();
  logQlikApps();

  return (
    <ThemeProvider defaultTheme="light" storageKey="hub-theme">
      <Layout />
    </ThemeProvider>
  );
};

export default App;
