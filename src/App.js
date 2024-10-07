// App.js
import "./App.css";
import Kanary from "./Kanary";
import { QueryClient, QueryClientProvider } from "react-query";

// Create a QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Kanary />
      </div>
    </QueryClientProvider>
  );
}

export default App;
