// "use client"
import { SidebarDemo } from "@/components/SidebarDemo";
import { LoaderProvider } from "../LoaderContext";
import { Loader } from "lucide-react";


export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { storeId: string };
}) {
    // const { userId } = useAuth();

    // if (!userId) {
    //     redirect("/sign-in");
    // }

    return (
        <div className="flex overflow-hidden">
            <LoaderProvider>
                <SidebarDemo>
                    <div className="flex-1 h-screen overflow-y-scroll overflow-hidden rounded-l-xl bg-gray-200 ">
                        {children}
                       
                    </div>
                </SidebarDemo>
            </LoaderProvider>
        </div>

    );
}
