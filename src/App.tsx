import { ToastContainer } from "react-toastify";
import { Toaster } from "@/components/ui/toaster";
import RenderRoutes from "./route.config";
const App = () => {
    return (
        <>
            <RenderRoutes />
            <Toaster />
            <ToastContainer autoClose={2000} newestOnTop />
        </>)
}


export default App;