import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "../dashboard";


const FullLayout = () => (
    <DashboardLayout>
        <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
        </Suspense>
    </DashboardLayout>
);

export default FullLayout;